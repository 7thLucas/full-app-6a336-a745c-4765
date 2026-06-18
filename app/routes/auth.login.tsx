import { redirect } from "react-router";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, Link, useActionData, useNavigation } from "react-router";
import { getUserFromRequest, signJwt, buildAuthCookie } from "~/modules/authentication/authentication.server";
import { AuthService } from "~/modules/authentication/authentication.service";
import { Coffee } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";

export async function loader({ request }: LoaderFunctionArgs) {
  if (getUserFromRequest(request)) return redirect("/");
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    const user = await AuthService.login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    const token = signJwt({ sub: user.id, role: user.role, username: user.username, email: user.email, email_verified: user.email_verified });
    return redirect("/", { headers: { "Set-Cookie": buildAuthCookie(token, new URL(request.url).hostname) } });
  } catch (error: any) {
    return { error: error.message ?? "Invalid credentials" };
  }
}

export default function LoginRoute() {
  const actionData = useActionData<{ error?: string }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { config } = useConfigurables();

  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const bgColor = config?.backgroundColor ?? "#F5F0E8";
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";
  const appName = config?.appName ?? "Cafessistant";
  const tagline = config?.appTagline ?? "Your personal coffee atlas";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: bgColor }}
    >
      {/* Logo + name */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-md"
          style={{ backgroundColor: primaryColor }}
        >
          {config?.logoUrl && config.logoUrl !== "FILL_LOGO_URL_HERE" ? (
            <img src={config.logoUrl} alt={appName} className="w-10 h-10 object-contain" />
          ) : (
            <Coffee className="w-7 h-7 text-white" />
          )}
        </div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
        >
          {appName}
        </h1>
        <p className="text-sm mt-1" style={{ color: textSecondary }}>{tagline}</p>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl p-6 shadow-lg"
        style={{ backgroundColor: surfaceColor, border: `1px solid ${accentColor}22` }}
      >
        <h2
          className="text-xl font-semibold mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
        >
          Welcome back
        </h2>
        <p className="text-sm mb-5" style={{ color: textSecondary }}>Sign in to your coffee journal</p>

        <Form method="post" className="space-y-4">
          {actionData?.error && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {actionData.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: primaryColor }}>Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2"
              style={{ backgroundColor: bgColor, color: primaryColor, border: `1.5px solid ${accentColor}33` }}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium" style={{ color: primaryColor }}>Password</label>
              <Link
                to="/auth/forgot-password"
                className="text-xs"
                style={{ color: accentColor }}
              >
                Forgot?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl px-4 py-3 text-base focus:outline-none"
              style={{ backgroundColor: bgColor, color: primaryColor, border: `1.5px solid ${accentColor}33` }}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl py-4 text-base font-semibold mt-2 transition-all disabled:opacity-60"
            style={{ backgroundColor: primaryColor, color: "#fff", boxShadow: `0 4px 16px ${primaryColor}44` }}
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </Form>

        <p className="text-center text-sm mt-5" style={{ color: textSecondary }}>
          No account yet?{" "}
          <Link to="/auth/register" className="font-semibold" style={{ color: accentColor }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
