import { useEffect } from "react";
import { useConfigurables } from "../hooks/use-configurables";

/**
 * ConfigurablesCSSBridge — Syncs brandColor and palette from configurables into CSS custom
 * properties so Tailwind utilities (bg-primary, text-accent, etc.) reflect the
 * DB-driven config in real time.
 */
export function ConfigurablesCSSBridge() {
  const { config } = useConfigurables();

  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    const isValidColor = (v: unknown): v is string =>
      typeof v === "string" && v.length > 0 && !v.startsWith("FILL_");

    const brandColor = config?.brandColor;
    if (brandColor && typeof brandColor === "object") {
      if (isValidColor(brandColor.primary)) {
        root.style.setProperty("--primary", brandColor.primary);
        root.style.setProperty("--ring", brandColor.primary);
        root.style.setProperty("--sidebar-primary", brandColor.primary);
      }
      if (isValidColor(brandColor.secondary)) {
        root.style.setProperty("--secondary", brandColor.secondary);
      }
      if (isValidColor(brandColor.accent)) {
        root.style.setProperty("--accent", brandColor.accent);
        root.style.setProperty("--sidebar-accent", brandColor.accent);
      }
    }

    // Extend with Cafessistant-specific palette overrides from configurables
    if (isValidColor(config?.backgroundColor)) {
      root.style.setProperty("--background", config.backgroundColor!);
    }
    if (isValidColor(config?.surfaceColor)) {
      root.style.setProperty("--card", config.surfaceColor!);
      root.style.setProperty("--secondary", config.surfaceColor!);
    }
    if (isValidColor(config?.textPrimaryColor)) {
      root.style.setProperty("--foreground", config.textPrimaryColor!);
      root.style.setProperty("--card-foreground", config.textPrimaryColor!);
    }
    if (isValidColor(config?.textSecondaryColor)) {
      root.style.setProperty("--muted-foreground", config.textSecondaryColor!);
    }
  }, [config?.brandColor, config?.backgroundColor, config?.surfaceColor, config?.textPrimaryColor, config?.textSecondaryColor]);

  return null;
}
