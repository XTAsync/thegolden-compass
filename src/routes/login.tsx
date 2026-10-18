import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { CompassEmblem } from "@/components/CompassEmblem";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary" },
      { property: "og:type", content: "website" },
      { title: "Sign In — Golden Compass" },
      { name: "description", content: "Sign in to Golden Compass for market analysis and demo investing." },
      { property: "og:title", content: "Sign In — Golden Compass" },
      { property: "og:description", content: "Access your Golden Compass markets and account." },
      { property: "og:url", content: "/login" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [shakeField, setShakeField] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setShakeField("email");
      setTimeout(() => setShakeField(null), 500);
      return;
    }
    if (!password) {
      setShakeField("password");
      setTimeout(() => setShakeField(null), 500);
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      setSuccess(true);
      setTimeout(() => navigate({ to: "/home" }), 600);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "var(--ocean-0)" }}>
      <ParallaxBackground />
      <div
        className="relative z-10 mx-auto flex flex-col h-full overflow-y-auto"
        style={{ maxWidth: 430 }}
      >
        <div className="flex flex-col items-center text-center" style={{ padding: "44px 28px 32px" }}>
          <div className="anim-emblem anim-float">
            <CompassEmblem />
          </div>
          <p
            className="t-mono t-muted mb-2 anim-fade-up"
            style={{ fontSize: 9, letterSpacing: "0.2em", animationDelay: "0.4s" }}
          >
            MARKETS · EDUCATION · DEMO
          </p>
          <h1
            className="t-display t-gold anim-fade-up"
            style={{ fontSize: 24, letterSpacing: "0.04em", marginBottom: 8, animationDelay: "0.5s" }}
          >
            Golden Compass
          </h1>
          <p
            className="t-fell t-sec anim-fade-up"
            style={{ fontSize: 16, fontStyle: "italic", animationDelay: "0.6s" }}
          >
            Your investing account
          </p>
        </div>

        <div className="px-5 anim-fade-up relative" style={{ animationDelay: "0.65s" }}>
          {/* Spatial ambient orbs */}
          <div className="spatial-orb spatial-orb-gold" style={{ top: -40, left: -30 }} />
          <div className="spatial-orb spatial-orb-teal" style={{ bottom: 80, right: -40 }} />

          {/* Floating glass chips for spatial depth */}
          <div
            className="glass-chip"
            style={{ top: -18, right: 18, width: 44, height: 44, borderRadius: 14, animationDelay: "0.4s" }}
          />
          <div
            className="glass-chip"
            style={{ bottom: 110, left: -12, width: 28, height: 28, borderRadius: "50%", animationDelay: "1.2s" }}
          />

          <div className="liquid-glass spatial-tilt p-6 mb-4">
            <form onSubmit={handleSubmit}>
              <div className="gc-input-wrap mb-4">
                <label htmlFor="login-email" className="gc-input-label">Email Address</label>
                <input
                  id="login-email"
                  autoComplete="email"
                  type="email"
                  className={`gc-input ${shakeField === "email" ? "shake" : ""}`}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="gc-input-wrap mb-4">
                <label htmlFor="login-password" className="gc-input-label">Password</label>
                <input
                  id="login-password"
                  autoComplete="current-password"
                  type="password"
                  className={`gc-input ${shakeField === "password" ? "shake" : ""}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="t-mono mb-3" style={{ fontSize: 11, color: "var(--gc-danger)" }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || success}
                className="btn-brass w-full"
                style={{ height: 52, fontSize: 12 }}
              >
                {success ? (
                  <span style={{ fontSize: 16, animation: "checkPop 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    ✓
                  </span>
                ) : loading ? (
                  <span
                    style={{
                      width: 14,
                      height: 14,
                      border: "2px solid rgba(42,24,0,0.3)",
                      borderTopColor: "#2A1600",
                      borderRadius: "50%",
                      animation: "spinBtn 0.7s linear infinite",
                      display: "inline-block",
                    }}
                  />
                ) : (
                  <>Sign in</>
                )}
              </button>
            </form>
            <p className="text-center" style={{ marginTop: 14 }}>
              <Link
                to="/forgot-password"
                className="t-mono t-sec"
                style={{ fontSize: 10, letterSpacing: "0.08em", textDecoration: "underline" }}
              >
                Forgot password?
              </Link>
            </p>
          </div>


          <div className="liquid-glass p-4 text-center" style={{ borderRadius: 22 }}>
            <p className="t-fell t-sec" style={{ fontSize: 13, fontStyle: "italic", marginBottom: 8 }}>
              New to Golden Compass?
            </p>
            <Link
              to="/signup"
              className="t-display t-gold inline-block"
              style={{
                fontSize: 11,
                letterSpacing: "0.08em",
                textDecoration: "none",
                padding: "8px 20px",
                borderRadius: 10,
                border: "var(--border-gold)",
                background: "linear-gradient(180deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))",
                transition: "all 0.2s ease",
              }}
            >
              Create account
            </Link>
          </div>

          <p className="t-mono t-muted text-center mt-4" style={{ fontSize: 8, letterSpacing: "0.1em" }}>
            By continuing you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
