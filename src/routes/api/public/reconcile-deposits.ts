import { createFileRoute } from "@tanstack/react-router";
import { constantTimeEqual, MIN_SECRET_LENGTH } from "@/lib/mpesa-security.server";
import { defaultDeps, reconcileStuckDeposits } from "@/lib/reconcile.server";

// Scheduled reconcile of stuck pending deposits. Call every minute (pg_cron + pg_net):
//   POST /api/public/reconcile-deposits   header: x-cron-secret: <RECONCILE_CRON_SECRET>
// Fails closed when the secret is unset or too short. At most 20 rows per run.
export const Route = createFileRoute("/api/public/reconcile-deposits")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const expected = process.env["RECONCILE_CRON_SECRET"] ?? "";
        if (expected.length < MIN_SECRET_LENGTH) {
          return Response.json({ error: "Reconcile not configured" }, { status: 503 });
        }
        if (!constantTimeEqual(request.headers.get("x-cron-secret") ?? "", expected)) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        try {
          const summary = await reconcileStuckDeposits(defaultDeps());
          return Response.json({ ok: true, ...summary, ran_at: new Date().toISOString() });
        } catch (e) {
          console.error("[reconcile] run failed", e);
          return Response.json({ error: "Reconcile failed" }, { status: 500 });
        }
      },
    },
  },
});
