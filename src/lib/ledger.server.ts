// Thin, typed wrappers around the atomic money functions in Postgres
// (supabase/migrations/20261025120000_atomic_money_flows.sql).
//
// All balance and status changes for deposits and withdrawals go through these functions.
// Each one runs as a single database transaction with row locks, so a retry, a double click or
// two parallel requests can never credit, pay or refund twice. Never update wallet_balance,
// user_investments or transaction status directly from route code.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type LedgerResult = { result: string } & Record<string, unknown>;

async function rpc(fn: string, args: Record<string, unknown>): Promise<LedgerResult> {
  // The generated Supabase types don't include these functions yet (same cast the repo already uses
  // for credit_wallet); the result shape is documented in the migration and checked by the callers.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabaseAdmin.rpc as any)(fn, args);
  if (error) throw new Error(`ledger.${fn} failed: ${error.message}`);
  return data as LedgerResult;
}

export function confirmDeposit(args: {
  checkoutId: string;
  resultCode: number | null;
  receipt: string | null;
  paidAmount: number | null;
}) {
  return rpc("confirm_deposit", {
    p_checkout_id: args.checkoutId,
    p_result_code: args.resultCode,
    p_receipt: args.receipt,
    p_paid_amount: args.paidAmount,
  });
}

/**
 * Park (or settle) a callback whose transaction has no checkout id yet. See
 * supabase/migrations/20261027120000_mpesa_callback_inbox.sql.
 */
export function queueUnmatchedCallback(args: {
  checkoutId: string;
  resultCode: number | null;
  receipt: string | null;
  paidAmount: number | null;
}) {
  return rpc("queue_unmatched_callback", {
    p_checkout_id: args.checkoutId,
    p_result_code: args.resultCode,
    p_receipt: args.receipt,
    p_paid_amount: args.paidAmount,
  });
}

/** Save the checkout id on a pending deposit and settle any callback that arrived first. */
export function attachCheckoutId(txId: string, checkoutId: string) {
  return rpc("attach_checkout_id", { p_tx_id: txId, p_checkout_id: checkoutId });
}

export function requestWithdrawal(args: {
  userId: string;
  poolId: string;
  amount: number;
  phone: string;
}) {
  return rpc("request_withdrawal", {
    p_user_id: args.userId,
    p_pool_id: args.poolId,
    p_amount: args.amount,
    p_phone: args.phone,
  });
}

export function approveWithdrawalStart(txId: string, adminId: string) {
  return rpc("approve_withdrawal_start", { p_tx_id: txId, p_admin_id: adminId });
}

/** Fail a withdrawal and refund the reserved units, once. `allowedFrom` limits which states may fail. */
export function failWithdrawal(txId: string, reason: string, allowedFrom: string[]) {
  return rpc("fail_withdrawal", { p_tx_id: txId, p_reason: reason, p_allowed_from: allowedFrom });
}

export function completeWithdrawal(txId: string, receipt: string | null) {
  return rpc("complete_withdrawal", { p_tx_id: txId, p_receipt: receipt });
}
