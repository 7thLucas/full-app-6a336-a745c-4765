import { useState, useEffect, useCallback } from "react";
import { MapPin, Coffee, ChevronDown, ChevronUp } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { AppLayout } from "~/components/cafessistant/AppLayout";
import { VisitCard } from "~/components/cafessistant/VisitCard";
import type { VisitData } from "~/components/cafessistant/VisitCard";
import { StarRating } from "~/components/cafessistant/StarRating";

interface CitySummary {
  _id: string;
  count: number;
  lastVisited: string;
  avgRating: number;
  country?: string;
}

export default function CitiesPage() {
  const { config, loading: configLoading } = useConfigurables();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const bgColor = config?.backgroundColor ?? "#F5F0E8";
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";

  const [cities, setCities] = useState<CitySummary[]>([]);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [cityVisits, setCityVisits] = useState<Record<string, VisitData[]>>({});
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingCity, setLoadingCity] = useState<string | null>(null);

  const fetchCities = useCallback(async () => {
    try {
      const res = await fetch("/api/visits/cities");
      if (res.ok) {
        const json = await res.json();
        setCities(json.data ?? []);
      }
    } finally {
      setLoadingCities(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCities();
    } else if (!authLoading && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [authLoading, isAuthenticated, fetchCities]);

  const toggleCity = async (city: string) => {
    if (expandedCity === city) {
      setExpandedCity(null);
      return;
    }

    setExpandedCity(city);
    if (!cityVisits[city]) {
      setLoadingCity(city);
      try {
        const res = await fetch(`/api/visits?city=${encodeURIComponent(city)}&limit=50`);
        if (res.ok) {
          const json = await res.json();
          setCityVisits((prev) => ({ ...prev, [city]: json.data ?? [] }));
        }
      } finally {
        setLoadingCity(null);
      }
    }
  };

  const handleDelete = async (id: string, city: string) => {
    if (!confirm("Remove this visit?")) return;
    await fetch(`/api/visits/${id}`, { method: "DELETE" });
    setCityVisits((prev) => ({
      ...prev,
      [city]: (prev[city] ?? []).filter((v) => v._id !== id),
    }));
    setCities((prev) =>
      prev.map((c) => c._id === city ? { ...c, count: c.count - 1 } : c).filter((c) => c.count > 0)
    );
  };

  if (authLoading || configLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: bgColor }}>
        <Coffee className="w-8 h-8 animate-pulse" style={{ color: accentColor }} />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 pt-4">
        <h1
          className="text-2xl font-semibold mb-1"
          style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
        >
          Your coffee cities
        </h1>
        <p className="text-sm mb-5" style={{ color: textSecondary }}>
          {cities.length} {cities.length === 1 ? "city" : "cities"} visited
        </p>

        {loadingCities ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ backgroundColor: `${primaryColor}11` }} />
            ))}
          </div>
        ) : cities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: `${accentColor}22` }}
            >
              <MapPin className="w-8 h-8" style={{ color: accentColor }} />
            </div>
            <p
              className="text-lg font-medium"
              style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
            >
              No cities yet
            </p>
            <p className="text-sm mt-1" style={{ color: textSecondary }}>
              Log a visit to start building your coffee atlas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cities.map((city) => {
              const isExpanded = expandedCity === city._id;
              const visits = cityVisits[city._id] ?? [];
              const isLoadingThisCity = loadingCity === city._id;

              return (
                <div
                  key={city._id}
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: surfaceColor, border: `1px solid ${accentColor}22` }}
                >
                  {/* City header row */}
                  <button
                    onClick={() => toggleCity(city._id)}
                    className="w-full px-4 py-4 flex items-center gap-3 text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${accentColor}22` }}
                    >
                      <MapPin className="w-5 h-5" style={{ color: accentColor }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className="text-lg font-semibold leading-tight"
                          style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
                        >
                          {city._id}
                        </h3>
                        {city.count >= 2 && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
                          >
                            Return visitor
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs" style={{ color: textSecondary }}>
                          {city.count} {city.count === 1 ? "visit" : "visits"}
                        </span>
                        <StarRating value={Math.round(city.avgRating)} readonly size="sm" />
                      </div>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: textSecondary }} />
                    ) : (
                      <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: textSecondary }} />
                    )}
                  </button>

                  {/* Expanded visits */}
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 border-t" style={{ borderColor: `${primaryColor}11` }}>
                      {isLoadingThisCity ? (
                        <div className="py-4 flex justify-center">
                          <Coffee className="w-5 h-5 animate-pulse" style={{ color: accentColor }} />
                        </div>
                      ) : (
                        visits.map((visit) => (
                          <div key={visit._id} className="mt-2">
                            <VisitCard
                              visit={visit}
                              onDelete={(id) => handleDelete(id, city._id)}
                              compact
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
