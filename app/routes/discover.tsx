import { useState, useEffect } from "react";
import { Compass, Search, Coffee, Sparkles, MapPin } from "lucide-react";
import { useConfigurables } from "~/modules/configurables";
import { useAuth } from "~/modules/authentication";
import { AppLayout } from "~/components/cafessistant/AppLayout";
import { PersonalRecommendationCard, CommunityRecommendationCard } from "~/components/cafessistant/RecommendationCard";
import type { PersonalRecommendation, CommunityRecommendation } from "~/features/community/services/community.service";

interface RecommendationData {
  personal: PersonalRecommendation[];
  community: CommunityRecommendation[];
}

export default function DiscoverPage() {
  const { config, loading: configLoading } = useConfigurables();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const bgColor = config?.backgroundColor ?? "#F5F0E8";
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";
  const recommendationsHeading = config?.recommendationsHeading ?? "Where to go next";
  const personalLabel = config?.personalTrackLabel ?? "Places you've loved here";
  const communityLabel = config?.communityTrackLabel ?? "New to discover";
  const enableRecs = config?.enableRecommendations !== false;

  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [authLoading, isAuthenticated]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = city.trim();
    if (!trimmed) return;
    setSearchCity(trimmed);
    setLoadingRecs(true);
    setError("");
    try {
      const res = await fetch(`/api/recommendations?city=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      if (json.success) {
        setRecommendations(json.data);
      } else {
        setError(json.error ?? "Failed to load recommendations");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingRecs(false);
    }
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
        {/* Heading */}
        <div className="mb-5">
          <h1
            className="text-2xl font-semibold"
            style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
          >
            {recommendationsHeading}
          </h1>
          <p className="text-sm mt-1" style={{ color: textSecondary }}>
            Search a city to get personalised coffee picks
          </p>
        </div>

        {!enableRecs ? (
          <div className="py-12 text-center">
            <Compass className="w-10 h-10 mx-auto mb-3" style={{ color: `${primaryColor}44` }} />
            <p style={{ color: textSecondary }}>Recommendations are currently disabled.</p>
          </div>
        ) : (
          <>
            {/* City search form */}
            <form onSubmit={handleSearch} className="mb-6">
              <div
                className="flex items-center gap-2 rounded-2xl px-4 py-3"
                style={{ backgroundColor: surfaceColor, border: `1.5px solid ${accentColor}44` }}
              >
                <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: accentColor }} />
                <input
                  type="text"
                  placeholder="Enter a city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="flex-1 bg-transparent text-base focus:outline-none"
                  style={{ color: primaryColor }}
                />
                <button
                  type="submit"
                  disabled={loadingRecs || !city.trim()}
                  className="rounded-xl px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-40"
                  style={{ backgroundColor: accentColor, color: "#fff" }}
                >
                  {loadingRecs ? "..." : "Search"}
                </button>
              </div>
            </form>

            {/* Results */}
            {error && (
              <div className="rounded-xl px-4 py-3 mb-4 text-sm text-red-700 bg-red-50">
                {error}
              </div>
            )}

            {loadingRecs && (
              <div className="py-12 flex flex-col items-center gap-3">
                <Sparkles className="w-8 h-8 animate-pulse" style={{ color: accentColor }} />
                <p className="text-sm" style={{ color: textSecondary }}>Finding the best coffee in {city}...</p>
              </div>
            )}

            {recommendations && !loadingRecs && (
              <div className="space-y-6">
                <p className="text-sm font-medium" style={{ color: textSecondary }}>
                  Recommendations for <span style={{ color: primaryColor, fontWeight: 600 }}>{searchCity}</span>
                </p>

                {/* Personal track */}
                {recommendations.personal.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-1.5 h-5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                      <h2
                        className="text-base font-semibold"
                        style={{ color: primaryColor }}
                      >
                        {personalLabel}
                      </h2>
                    </div>
                    <p className="text-xs mb-3" style={{ color: textSecondary }}>
                      Based on what you've loved here before
                    </p>
                    <div className="space-y-3">
                      {recommendations.personal.map((item) => (
                        <PersonalRecommendationCard key={item.shopName} item={item} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Community track */}
                {recommendations.community.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-1.5 h-5 rounded-full"
                        style={{ backgroundColor: "#6A8C69" }}
                      />
                      <h2
                        className="text-base font-semibold"
                        style={{ color: primaryColor }}
                      >
                        {communityLabel}
                      </h2>
                    </div>
                    <p className="text-xs mb-3" style={{ color: textSecondary }}>
                      Highly rated by the community — not yet visited by you
                    </p>
                    <div className="space-y-3">
                      {recommendations.community.map((item) => (
                        <CommunityRecommendationCard key={item.shopName} item={item} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Nothing found */}
                {recommendations.personal.length === 0 && recommendations.community.length === 0 && (
                  <div className="py-12 text-center">
                    <Search className="w-10 h-10 mx-auto mb-3" style={{ color: `${primaryColor}44` }} />
                    <p
                      className="text-base font-medium"
                      style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
                    >
                      No coffee shops found yet
                    </p>
                    <p className="text-sm mt-1" style={{ color: textSecondary }}>
                      Be the first to log a visit in {searchCity}!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Initial state (nothing searched yet) */}
            {!recommendations && !loadingRecs && !error && (
              <div className="py-16 flex flex-col items-center text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${accentColor}22` }}
                >
                  <Compass className="w-8 h-8" style={{ color: accentColor }} />
                </div>
                <p
                  className="text-lg font-medium mb-2"
                  style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
                >
                  Arriving somewhere new?
                </p>
                <p className="text-sm max-w-xs" style={{ color: textSecondary }}>
                  Enter the city above and we'll show your favourite spots plus new community picks you haven't tried yet
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
