import { MapPin, Calendar, Trash2 } from "lucide-react";
import { StarRating } from "./StarRating";
import { useConfigurables } from "~/modules/configurables";

export interface VisitData {
  _id: string;
  shopName: string;
  city: string;
  country?: string;
  address?: string;
  rating: number;
  tastingNotes?: string;
  photoUrl?: string;
  visitedAt?: string | Date;
}

interface VisitCardProps {
  visit: VisitData;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

function formatDate(date?: string | Date): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function VisitCard({ visit, onDelete, compact = false }: VisitCardProps) {
  const { config } = useConfigurables();
  const surfaceColor = config?.surfaceColor ?? "#EDE6D6";
  const primaryColor = config?.brandColor?.primary ?? "#2C1A0E";
  const accentColor = config?.brandColor?.accent ?? "#C97C3A";
  const textSecondary = config?.textSecondaryColor ?? "#7A6F65";

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      style={{ backgroundColor: surfaceColor, border: `1px solid ${accentColor}22` }}
    >
      {/* Photo strip */}
      {visit.photoUrl && !compact && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={visit.photoUrl}
            alt={`Photo from ${visit.shopName}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className={`p-4 ${compact ? "py-3" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Shop name */}
            <h3
              className={`font-semibold leading-tight truncate ${compact ? "text-base" : "text-lg"}`}
              style={{
                fontFamily: "'Playfair Display', serif",
                color: primaryColor,
              }}
            >
              {visit.shopName}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 mt-0.5" style={{ color: textSecondary }}>
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="text-sm truncate">
                {visit.city}{visit.country ? `, ${visit.country}` : ""}
              </span>
            </div>
          </div>

          {/* Right: stars + delete */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <StarRating value={visit.rating} readonly size={compact ? "sm" : "sm"} />
            {onDelete && (
              <button
                onClick={() => onDelete(visit._id)}
                className="p-1 rounded-lg opacity-40 hover:opacity-100 transition-opacity"
                style={{ color: primaryColor }}
                aria-label="Delete visit"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tasting notes */}
        {visit.tastingNotes && !compact && (
          <p
            className="mt-2 text-sm leading-relaxed line-clamp-2"
            style={{ color: textSecondary }}
          >
            {visit.tastingNotes}
          </p>
        )}

        {/* Date */}
        {visit.visitedAt && (
          <div className="flex items-center gap-1 mt-2" style={{ color: textSecondary }}>
            <Calendar className="w-3 h-3" />
            <span className="text-xs">{formatDate(visit.visitedAt)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
