#!/usr/bin/env bash
# Two-connection (really: eight) concurrency checks for the money functions. Uses real parallel
# psql sessions, so it needs committed data; it cleans up after itself. SCRATCH DATABASES ONLY.
# Usage: DATABASE_URL=postgres://... scripts/test-concurrency.sh
set -euo pipefail
: "${DATABASE_URL:?set DATABASE_URL to a scratch database (never production)}"
q() { psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -qAt -c "$1"; }
fail() { echo "FAIL: $1"; cleanup; exit 1; }
U=$(q "select gen_random_uuid()")
cleanup() { q "delete from public.transactions where user_id='$U'" >/dev/null 2>&1 || true
            q "delete from public.profiles where id='$U'" >/dev/null 2>&1 || true
            q "delete from auth.users where id='$U'" >/dev/null 2>&1 || true; }
q "insert into auth.users(id,email) values ('$U','conc@test.local')" >/dev/null
q "insert into public.profiles(id) values ('$U') on conflict do nothing" >/dev/null

# 1. Eight parallel callbacks for the same deposit credit the wallet exactly once.
q "insert into public.transactions(user_id,type,amount,status,mpesa_checkout_id) values ('$U','deposit',250,'pending','ws_CO_conc_1')" >/dev/null
for i in 1 2 3 4 5 6 7 8; do
  q "select public.confirm_deposit('ws_CO_conc_1', 0, 'RCPTCONC1', 250)" >/dev/null & 
done; wait
BAL=$(q "select wallet_balance::int from public.profiles where id='$U'")
[ "$BAL" = "250" ] || fail "wallet should be 250 after 8 parallel callbacks, got $BAL"
echo "ok: 8 parallel confirm_deposit credited once"

# 2. Four parallel reconcile claims never hand out the same row twice.
q "insert into public.transactions(user_id,type,amount,status,mpesa_checkout_id,created_at)
   select '$U','deposit',10,'pending','ws_CO_conc_c'||g, now()-interval '30 minutes' from generate_series(1,40) g" >/dev/null
TMP=$(mktemp)
for i in 1 2 3 4; do
  q "select id from public.claim_stuck_deposits(20) where mpesa_checkout_id like 'ws_CO_conc_c%'" >> "$TMP" &
done; wait
TOTAL=$(wc -l < "$TMP"); DISTINCT=$(sort -u "$TMP" | wc -l); rm -f "$TMP"
[ "$TOTAL" = "$DISTINCT" ] || fail "a row was claimed twice ($TOTAL claimed, $DISTINCT distinct)"
echo "ok: parallel claim_stuck_deposits gave out $TOTAL rows with no duplicates"
cleanup; echo "concurrency checks passed"
