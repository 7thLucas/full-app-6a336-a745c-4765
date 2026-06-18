import { MapPin, Users, Bookmark } from "lucide-react";
import { StarRating } from "./StarRating";
import { useConfigurables } from "~/modules/configurables";
import type { PersonalRecommendation, CommunityRecommendation } from "~/features/community/services/community.service";

interface PersonalCardProps {
  item: PersonalRecommendation;
}

interface CommunityCardProps {
  item: CommunityRecommendation;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export function PersonalRecommendationCard({ item }: PersonalCardProps) {
  const { config } = useConfigurables();
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";

  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{
        backgroundColor: surfaceColor,
        borderLeft: `3px solid ${accentColor}`,
        boxShadow: `0 2px 12px ${primaryColor}0a`,
      }}
    >
      {item.photoUrl && (
        <img
          src={item.photoUrl}
          alt={item.shopName}
          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4
          className="font-semibold text-base leading-tight truncate"
          style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
        >
          {item.shopName}
        </h4>
        <div className="flex items-center gap-1 mt-0.5" style={{ color: textSecondary }}>
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs truncate">{item.city}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <StarRating value={Math.round(item.rating)} readonly size="sm" />
          <div className="flex items-center gap-1" style={{ color: textSecondary }}>
            <Bookmark className="w-3 h-3" />
            <span className="text-xs">{item.visitCount}x · {formatDate(item.lastVisited)}</span>
          </div>
        </div>
        {item.tastingNotes && (
          <p className="text-xs mt-1 leading-relaxed line-clamp-1" style={{ color: textSecondary }}>
            {item.tastingNotes}
          </p>
        )}
      </div>
    </div>
  );
}

export function CommunityRecommendationCard({ item }: CommunityCardProps) {
  const { config } = useConfigurables();
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";
  const successColor = "#6A8C69";

  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{
        backgroundColor: surfaceColor,
        borderLeft: `3px solid ${successColor}`,
        boxShadow: `0 2px 12px ${primaryColor}0a`,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className="font-semibold text-base leading-tight flex-1 truncate"
            style={{ fontFamily: "'Playfair Display', serif", color: primaryColor }}
          >
            {item.shopName}
          </h4>
          <span
            className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: `${successColor}22`, color: successColor }}
          >
            New
          </span>
        </div>
        <div className="flex items-center gap-1 mt-0.5" style={{ color: textSecondary }}>
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="text-xs truncate">{item.city}</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <StarRating value={Math.round(item.averageRating)} readonly size="sm" />
          <div className="flex items-center gap-1" style={{ color: textSecondary }}>
            <Users className="w-3 h-3" />
            <span className="text-xs">{item.ratingCount} {item.ratingCount === 1 ? "review" : "reviews"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
