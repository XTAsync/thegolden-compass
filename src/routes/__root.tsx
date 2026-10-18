import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { NotificationsProvider } from "@/hooks/useNotifications";
import { BottomNav } from "@/components/BottomNav";
import { ParallaxBackground } from "@/components/ParallaxBackground";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSplash } from "@/components/LoadingSplash";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { DisclosureBlock, ModeBanner } from "@/features/settings/DisclosureBlock";

import appCss from "../styles.css?url";

const authRoutes = ["/login", "/signup", "/forgot-password", "/reset-password"];

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: "var(--ocean-0)" }}>
      <div className="max-w-md text-center">
        <h1 className="t-display t-gold" style={{ fontSize: 48 }}>404</h1>
        <h2 className="t-serif t-parch mt-4" style={{ fontSize: 18 }}>Page not found</h2>
        <p className="t-mono t-muted mt-2" style={{ fontSize: 11 }}>
          The requested page does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="btn-brass inline-flex"
            style={{ padding: "10px 24px", fontSize: 11 }}
          >
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Golden Compass — Markets, Education & Demo Investing" },
      { name: "description", content: "Explore markets, investment education and demo investing with Golden Compass." },
      { name: "author", content: "Golden Compass" },
      { property: "og:site_name", content: "Golden Compass" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Golden Compass — Markets, Education & Demo Investing" },
      { name: "twitter:title", content: "Golden Compass — Markets, Education & Demo Investing" },
      { property: "og:description", content: "Market analysis and investing education for Kenya-focused retail investors." },
      { name: "twitter:description", content: "Market analysis and investing education for Kenya-focused retail investors." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "Golden Compass",
              description: "Market analysis and investing education for Kenya-focused retail investors.",
            },
            {
              "@type": "WebSite",
              name: "Golden Compass",
              description: "Market analysis, education and demo investing.",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppShell() {
  const location = useLocation();
  const { loading: authLoading, user } = useAuth();
  const isAuth = authRoutes.includes(location.pathname);

  if (authLoading && !isAuth) {
    return <LoadingSplash />;
  }

  if (isAuth) {
    return <Outlet />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "var(--ocean-0)" }}>
      <ParallaxBackground />
      <div
        className="relative z-10 mx-auto flex flex-col h-full"
        style={{ maxWidth: 430 }}
      >
        {user && <ModeBanner />}
        <div className="flex-1 overflow-y-auto" style={{ WebkitOverflowScrolling: "touch" }}>
          <Outlet />
          <DisclosureBlock />
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

function RootComponent() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationsProvider>
        <ErrorBoundary>
          <AppShell />
        </ErrorBoundary>
        <Toaster position="top-center" theme="dark" richColors />
      </NotificationsProvider>
    </AuthProvider>
    </QueryClientProvider>
  );
}
