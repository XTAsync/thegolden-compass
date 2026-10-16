import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { useAccountSummary } from "@/hooks/useAccountSummary";
import { NotificationBell } from "@/components/NotificationBell";
import { Sparkline } from "@/components/Sparkline";
import { CompassEmblem } from "@/components/CompassEmblem";
import { useQuotes } from "@/lib/quote-client";
import { symbolsByCategory } from "@/lib/symbols";
import { MoreVertical, LifeBuoy, Megaphone, ArrowRight, Compass, Newspaper, Settings, LayoutGrid, LogOut } from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Golden Compass" },
      { name: "description", content: "Your Golden Compass hub: what's new, GC AI guidance, market indexes and notices." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Home — Golden Compass" },
      { property: "og:description", content: "What's new, GC AI and market movement in one place." },
      { property: "og:url", content: "/home" },
    ],
    links: [{ rel: "canonical", href: "/home" }],
  }),
  component: HomePage,
});

const ANNOUNCEMENTS = [
  { tag: "NEW", title: "Command Center", body: "One control panel for wallet, markets, tools and settings." },
  { tag: "UPDATE", title: "Candlestick charts", body: "1D–1Y OHLC charts with volume on every asset page." },
  { tag: "FEATURE", title: "Price alerts", body: "Get notified the moment a stock crosses your level." },
];

const INDEXES = symbolsByCategory("index").slice(0, 6);

function HomePage() {
  const { user, loading, signOut } = useAuth();
  const s = useAccountSummary();
  const { notifications } = useNotifications();
  const [menu, setMenu] = useState(false);
  const { quotes } = useQuotes(INDEXES.map((e) => ({ symbol: e.symbol, exchange: e.exchange })), 60_000);

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex flex-col gap-4 px-5 pt-6 pb-28 anim-fade-up">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <h1 className="t-display t-gold truncate" style={{ fontSize: 24, letterSpacing: "0.03em" }}>
          WELCOME, {s.firstName.toUpperCase()}!
        </h1>
        <NotificationBell />
      </header>
      <p className="t-fell t-sec -mt-2" style={{ fontSize: 14 }}>Navigate your wealth</p>

      {/* Continue as + Help */}
      <div className="grid grid-cols-[minmax(0,1fr)_88px] gap-3">
        <div className="glass-gold rounded-[20px] p-4 relative">
          <div className="relative z-10 flex items-center justify-between">
            <p className="t-mono t-sec" style={{ fontSize: 9, letterSpacing: "0.16em" }}>CONTINUE AS</p>
            <button aria-label="Account menu" onClick={() => setMenu((v) => !v)} className="t-gold bg-transparent border-none cursor-pointer p-1 -m-1">
              <MoreVertical size={16} />
            </button>
          </div>
          {menu && (
            <div className="absolute z-20 right-3 top-9 rounded-xl overflow-hidden" style={{ background: "var(--ocean-2)", border: "1px solid rgba(201,168,76,0.25)", minWidth: 160 }}>
              {[
                { to: "/account", Icon: Settings, label: "Account Centre" },
                { to: "/quick", Icon: LayoutGrid, label: "Quick Access" },
              ].map(({ to, Icon, label }) => (
                <Link key={label} to={to} className="flex items-center gap-2 px-4 py-3 t-serif t-parch" style={{ fontSize: 13, textDecoration: "none" }}>
                  <Icon size={14} className="t-gold" /> {label}
                </Link>
              ))}
              <button onClick={() => signOut()} className="w-full flex items-center gap-2 px-4 py-3 bg-transparent border-none cursor-pointer t-serif" style={{ fontSize: 13, color: "var(--gc-danger)" }}>
                <LogOut size={14} /> Sign out
              </button>
            </div>
          )}
          <Link to="/command" className="relative z-10 mt-3 flex items-center gap-3" style={{ textDecoration: "none" }}>
            <span className="w-12 h-12 rounded-full flex items-center justify-center t-display t-gold shrink-0" style={{ fontSize: 18, border: "1px solid rgba(201,168,76,0.45)", background: "radial-gradient(circle at 30% 30%, rgba(201,168,76,0.3), transparent 70%)" }}>
              {s.firstName.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="t-display t-parch block truncate" style={{ fontSize: 14 }}>{s.fullName}</span>
              <span className="t-mono t-muted block truncate" style={{ fontSize: 9 }}>Investor · {s.kycStatus === "approved" ? "Verified" : "Unverified"}</span>
            </span>
            <ArrowRight size={18} className="t-gold shrink-0" />
          </Link>
        </div>
        <Link to="/guides/dividend-tracking" className="glass rounded-[20px] flex flex-col items-center justify-center gap-2 text-center" style={{ textDecoration: "none" }}>
          <LifeBuoy size={22} className="t-gold" strokeWidth={1.6} />
          <span className="t-mono t-parch" style={{ fontSize: 9, letterSpacing: "0.08em", lineHeight: 1.4 }}>ACC HELP<br />CENTRE</span>
        </Link>
      </div>

      {/* App Centre */}
      <section className="glass rounded-[20px] p-4">
        <div className="flex items-center gap-2">
          <Megaphone size={15} className="t-gold" />
          <p className="t-mono t-sec" style={{ fontSize: 9, letterSpacing: "0.16em" }}>APP CENTRE · BRAND NEWS</p>
        </div>
        <h2 className="t-display t-parch mt-2" style={{ fontSize: 16 }}>What's New in Golden Compass</h2>
        <div className="mt-3 flex gap-3 overflow-x-auto -mx-4 px-4 pb-1" style={{ scrollSnapType: "x mandatory" }}>
          {ANNOUNCEMENTS.map((a) => (
            <div key={a.title} className="glass rounded-xl p-3 shrink-0" style={{ width: 200, scrollSnapAlign: "start" }}>
              <span className="t-mono t-gold" style={{ fontSize: 8, letterSpacing: "0.16em" }}>{a.tag}</span>
              <p className="t-serif t-parch mt-1" style={{ fontSize: 14 }}>{a.title}</p>
              <p className="t-mono t-muted mt-1" style={{ fontSize: 9, lineHeight: 1.5 }}>{a.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GC AI */}
      <Link to="/navigator" className="glass-gold rounded-[20px] p-5 flex items-center gap-4" style={{ textDecoration: "none" }}>
        <span className="relative z-10 shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center" style={{ color: "var(--gold-200)", border: "1px solid rgba(201,168,76,0.4)", background: "linear-gradient(150deg, rgba(201,168,76,0.25), rgba(42,191,191,0.08))" }}>
          <Compass size={28} strokeWidth={1.5} />
        </span>
        <span className="relative z-10 min-w-0 flex-1">
          <span className="t-fell t-sec block" style={{ fontSize: 13 }}>Want to know more?</span>
          <span className="t-display t-gold block" style={{ fontSize: 22 }}>GC AI</span>
          <span className="t-mono t-muted block" style={{ fontSize: 9 }}>Ask your navigator about your portfolio & markets</span>
        </span>
        <ArrowRight size={20} className="relative z-10 t-gold shrink-0" />
      </Link>

      {/* Market Index */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="t-display t-gold" style={{ fontSize: 14, letterSpacing: "0.06em" }}>Market Index</h2>
          <Link to="/markets" className="t-mono t-sec" style={{ fontSize: 9, letterSpacing: "0.12em", textDecoration: "none" }}>MARKET VIEW ›</Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {INDEXES.map((e) => {
            const st = quotes[e.symbol.toUpperCase()];
            const q = st?.quote;
            const up = (q?.change_pct ?? 0) >= 0;
            const color = up ? "var(--gc-success)" : "var(--gc-danger)";
            return (
              <Link key={e.symbol} to="/stock/$symbol" params={{ symbol: e.symbol }} search={{ exchange: e.exchange }} className="glass rounded-xl p-3" style={{ textDecoration: "none" }}>
                <div className="flex items-center justify-between">
                  <span className="t-display t-parch" style={{ fontSize: 12 }}>{e.symbol}</span>
                  <span className="t-mono" style={{ fontSize: 10, color }}>{q ? `${up ? "+" : ""}${q.change_pct.toFixed(2)}%` : "…"}</span>
                </div>
                <div style={{ height: 24, marginTop: 6 }}>
                  {st && st.history.length > 1 ? <Sparkline data={st.history} width={130} height={24} color={up ? "rgb(120,200,140)" : "rgb(220,120,120)"} /> : <div className="skeleton w-full h-full rounded" />}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* News / notices */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <Newspaper size={15} className="t-gold" />
          <h2 className="t-display t-gold" style={{ fontSize: 14, letterSpacing: "0.06em" }}>News & Notices</h2>
        </div>
        <div className="flex flex-col gap-2">
          {notifications.slice(0, 5).map((n) => (
            <div key={n.id} className="glass rounded-xl p-4">
              <p className="t-serif t-parch" style={{ fontSize: 14 }}>{n.title}</p>
              {n.body && <p className="t-mono t-muted mt-1" style={{ fontSize: 10, lineHeight: 1.5 }}>{n.body}</p>}
              <p className="t-mono t-sec mt-1" style={{ fontSize: 8 }}>{new Date(n.created_at).toLocaleDateString("en-KE")}</p>
            </div>
          ))}
          <Link to="/pools" className="rounded-xl p-4 flex items-center gap-3" style={{ textDecoration: "none", border: "1px dashed rgba(201,168,76,0.35)", background: "rgba(201,168,76,0.05)" }}>
            <CompassEmblem size={34} />
            <span className="min-w-0 flex-1">
              <span className="t-mono t-gold block" style={{ fontSize: 8, letterSpacing: "0.16em" }}>FEATURED</span>
              <span className="t-serif t-parch block" style={{ fontSize: 14 }}>Start a pool from KES 5</span>
            </span>
            <ArrowRight size={16} className="t-gold" />
          </Link>
        </div>
      </section>
    </div>
  );
}
