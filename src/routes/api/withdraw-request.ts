import { createFileRoute } from "@tanstack/react-router";
import { rateLimit } from "@/lib/rate-limit.server";
import { authenticateRequest, json } from "@/lib/auth.server";
import { requireFreshAal2 } from "@/lib/mfa.server";
import { checkTransactionLimit } from "@/lib/limits.server";
import { screenTransaction } from "@/lib/aml.server";
import { isMpesaLiveEnabled } from "@/lib/config.server";
import { requestWithdrawal } from "@/lib/ledger.server";

// Body: { pool_id: string, amount: number, phone: string }
// Reserves the user's units and creates a 'pending' withdrawal in ONE database transaction
// (request_withdrawal). Holding period, exit fee, balance check and the reservation all happen
// under a row lock, so parallel requests cannot spend the same holding twice.
// Admins approve from /admin/transactions (off-app B2C payout).
export const Route = createFileRoute("/api/withdraw-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const authResult = await authenticateRequest(request);
          if (authResult instanceof Response) return authResult;
          const { userId, claims } = authResult;
          if (!(await isMpesaLiveEnabled()))
            return json(
              { error: "Real withdrawals are disabled pending compliance approval." },
              403,
            );
          if (!rateLimit(userId, 5, 60_000)) return json({ error: "Too many requests" }, 429);

          const mfaBlock = await requireFreshAal2(userId, claims);
          if (mfaBlock) return mfaBlock;

          const body = (await request.json()) as {
            pool_id?: string;
            amount?: number;
            phone?: string;
          };
          const pool_id = String(body.pool_id ?? "");
          const amount = Number(body.amount);
          if (!pool_id || !Number.isFinite(amount) || amount <= 0)
            return json({ error: "Invalid input" }, 400);

          const phoneRaw = String(body.phone ?? "").replace(/\D/g, "");
          let phone = phoneRaw;
          if (phone.startsWith("0")) phone = "254" + phone.slice(1);
          else if (phone.startsWith("7") || phone.startsWith("1")) phone = "254" + phone;
          if (!/^254(7|1)\d{8}$/.test(phone))
            return json({ error: "Invalid M-Pesa phone number" }, 400);

          // Compliance caps (placeholder thresholds - TBD).
          const limit = await checkTransactionLimit(userId, "withdrawal", amount);
          if (!limit.ok) return json({ error: limit.error }, 400);

          const res = await requestWithdrawal({ userId, poolId: pool_id, amount, phone });

          switch (res.result) {
            case "ok":
              break;
            case "pool_not_found":
              return json({ error: "Pool not found" }, 404);
            case "no_holdings":
              return json({ error: "You have no holdings in this pool" }, 400);
            case "insufficient_holdings":
              return json(
                { error: `Maximum withdrawable: KES ${Number(res.max).toFixed(2)}` },
                400,
              );
            case "locked": {
              const d = Number(res.days_remaining);
              return json({ error: `Locked for ${d} more day${d === 1 ? "" : "s"}` }, 400);
            }
            default:
              return json({ error: "Invalid input" }, 400);
          }

          const txId = String(res.transaction_id);
          const gross = Number(res.gross);
          const fee = Number(res.fee);
          const net = Number(res.net);

          // AML screening is advisory here (raises a flag for review); the reservation is already safe.
          try {
            await screenTransaction({
              userId,
              transactionId: txId,
              amount: gross,
              kind: "withdrawal",
            });
          } catch (e) {
            console.error("[withdraw-request] AML screening failed", e);
          }

          return json({
            success: true,
            transaction_id: txId,
            gross,
            fee,
            net,
            message: `Withdrawal of KES ${net.toFixed(2)} requested (KES ${fee.toFixed(2)} exit fee). Pending admin approval.`,
          });
        } catch (e) {
          console.error("[withdraw-request] error", e);
          return json({ error: "Could not process the withdrawal request" }, 500);
        }
      },
    },
  },
});
