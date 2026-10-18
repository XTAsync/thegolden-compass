import { createFileRoute } from "@tanstack/react-router";
import { authenticateRequest, json } from "@/lib/auth.server";

// Legacy non-atomic settlement stays closed until replaced with isolated demo RPCs.
export const Route = createFileRoute("/api/wallet-invest")({
  server: { handlers: { POST: async ({ request }) => {
    const auth = await authenticateRequest(request);
    if (auth instanceof Response) return auth;
    return json({ error: "Pool transfers are temporarily disabled while atomic settlement is upgraded. Your existing wallet and pools are unchanged." }, 403);
  } } },
});
