import { Link, useLocation, Form } from "react-router";
import { Coffee, MapPin, Compass, LogOut, User } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { config } = useConfigurables();
  const { user } = useAuth();
  const location = useLocation();

  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const bgColor = config?.backgroundColor ?? "#F5F0E8";
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const appName = config?.appName ?? "Cafessistant";

  const navItems = [
    { href: "/", icon: Coffee, label: "Feed" },
    { href: "/cities", icon: MapPin, label: "Cities" },
    { href: "/discover", icon: Compass, label: "Discover" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor }}>
      {/* Top header */}
      <header
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: bgColor, borderBottom: `1px solid ${primaryColor}18` }}
      >
        <Link to="/" className="flex items-center gap-2">
          {config?.logoUrl && config.logoUrl !== "FILL_LOGO_URL_HERE" ? (
            <img src={config.logoUrl} alt={appName} className="h-8 w-auto object-contain" />
          ) : (
            <Coffee className="w-6 h-6" style={{ color: accentColor }} />
          )}
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
          >
            {appName}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-1" style={{ color: primaryColor }}>
              <User className="w-4 h-4 opacity-60" />
              <span className="text-sm opacity-70 max-w-24 truncate">{user.username}</span>
            </div>
          )}
          <Form method="post" action="/auth/logout">
            <button
              type="submit"
              className="p-2 rounded-full"
              style={{ backgroundColor: surfaceColor }}
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" style={{ color: primaryColor }} />
            </button>
          </Form>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-24">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 flex items-center"
        style={{
          backgroundColor: bgColor,
          borderTop: `1px solid ${primaryColor}18`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = location.pathname === href || (href !== "/" && location.pathname.startsWith(href));
          return (
            <Link
              key={href}
              to={href}
              className="flex-1 flex flex-col items-center py-3 gap-1 transition-opacity"
              style={{ color: active ? accentColor : `${primaryColor}60` }}
            >
              <Icon
                className="w-5 h-5"
                style={{
                  strokeWidth: active ? 2.5 : 1.8,
                  filter: active ? `drop-shadow(0 0 4px ${accentColor}66)` : "none",
                }}
              />
              <span className="text-xs font-medium">{label}</span>
              {active && (
                <div
                  className="absolute -bottom-px w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
