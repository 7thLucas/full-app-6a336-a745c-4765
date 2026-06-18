import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { Plus, Coffee, Sparkles } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { AppLayout } from "~/components/cafessistant/AppLayout";
import { VisitCard } from "~/components/cafessistant/VisitCard";
import { QuickLogSheet } from "~/components/cafessistant/QuickLogSheet";
import type { VisitData } from "~/components/cafessistant/VisitCard";
import type { LogFormData } from "~/components/cafessistant/QuickLogSheet";

export async function loader({ request }: LoaderFunctionArgs) {
  // Auth check happens client-side via useAuth redirect
  return null;
}

async function uploadPhoto(file: File): Promise<string | undefined> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const res = await fetch("/api/uploader/image", { method: "POST", body: formData });
    const json = await res.json();
    if (json.success && json.data?.url) return json.data.url;
  } catch {}
  return undefined;
}

export default function HomePage() {
  const { config, loading: configLoading } = useConfigurables();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const bgColor = config?.backgroundColor ?? "#F5F0E8";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";
  const welcomeMessage = config?.welcomeMessage ?? "Welcome back, coffee explorer";
  const emptyStateMessage = config?.emptyStateMessage ?? "Start your coffee atlas — log your first visit";
  const logVisitCTA = config?.logVisitCTA ?? "Log a visit";

  const [visits, setVisits] = useState<VisitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [logSheetOpen, setLogSheetOpen] = useState(false);

  const fetchVisits = useCallback(async () => {
    try {
      const res = await fetch("/api/visits?limit=30");
      if (res.ok) {
        const json = await res.json();
        setVisits(json.data ?? []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchVisits();
    } else if (!authLoading && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [authLoading, isAuthenticated, fetchVisits]);

  const handleLogSubmit = async (data: LogFormData) => {
    let photoUrl: string | undefined;
    if (data.photoFile) {
      photoUrl = await uploadPhoto(data.photoFile);
    }

    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shopName: data.shopName,
        city: data.city,
        country: data.country || undefined,
        address: data.address || undefined,
        rating: data.rating,
        tastingNotes: data.tastingNotes || undefined,
        photoUrl,
      }),
    });

    const json = await res.json();
    if (!json.success) throw new Error(json.error ?? "Failed to log visit");

    setVisits((prev) => [json.data, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this visit?")) return;
    await fetch(`/api/visits/${id}`, { method: "DELETE" });
    setVisits((prev) => prev.filter((v) => v._id !== id));
  };

  if (authLoading || configLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: bgColor }}>
        <div className="flex flex-col items-center gap-3">
          <Coffee className="w-8 h-8 animate-pulse" style={{ color: accentColor }} />
          <p className="text-sm" style={{ color: textSecondary }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4 pb-2">
        {/* Welcome header */}
        <div className="mb-5">
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
          >
            {welcomeMessage}
          </h1>
          {visits.length > 0 && (
            <p className="text-sm mt-1" style={{ color: textSecondary }}>
              {visits.length} visit{visits.length !== 1 ? "s" : ""} logged
            </p>
          )}
        </div>

        {/* Quick CTA banner (if has visits) */}
        {visits.length > 0 && (
          <Link
            to="/discover"
            className="flex items-center gap-3 rounded-2xl p-4 mb-5"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, #4A2E1A 100%)`,
              boxShadow: `0 4px 20px ${primaryColor}44`,
            }}
          >
            <Sparkles className="w-5 h-5 flex-shrink-0 text-amber-300" />
            <div>
              <p className="text-white text-sm font-semibold">Get recommendations</p>
              <p className="text-white/70 text-xs mt-0.5">Find great coffee in any city</p>
            </div>
          </Link>
        )}

        {/* Visits list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl animate-pulse"
                style={{ backgroundColor: `${primaryColor}11` }}
              />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${accentColor}22` }}
            >
              <Coffee className="w-8 h-8" style={{ color: accentColor }} />
            </div>
            <p
              className="text-lg font-medium mb-2"
              style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
            >
              {emptyStateMessage}
            </p>
            <p className="text-sm" style={{ color: textSecondary }}>
              Tap the + button below to log your first coffee shop
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visits.map((visit) => (
              <VisitCard key={visit._id} visit={visit} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setLogSheetOpen(true)}
        className="fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-20"
        style={{
          backgroundColor: primaryColor,
          boxShadow: `0 6px 24px ${primaryColor}66`,
        }}
        aria-label={logVisitCTA}
      >
        <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
      </button>

      {/* Quick Log Sheet */}
      <QuickLogSheet
        open={logSheetOpen}
        onClose={() => setLogSheetOpen(false)}
        onSubmit={handleLogSubmit}
      />
    </AppLayout>
  );
}
