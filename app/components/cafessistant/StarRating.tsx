import { useState } from "react";
import { useConfigurables } from "~/modules/configurables";

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const { config } = useConfigurables();
  const [hovered, setHovered] = useState(0);

  const starColor = config?.starColor ?? "#E8A838";
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  const gapSizes = { sm: "gap-0.5", md: "gap-1", lg: "gap-1.5" };

  return (
    <div className={`flex ${gapSizes[size]}`} role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = hovered ? star <= hovered : star <= value;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`${sizes[size]} transition-transform ${!readonly ? "cursor-pointer hover:scale-110 active:scale-95" : "cursor-default"} focus:outline-none`}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            onClick={() => !readonly && onChange?.(star)}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={filled ? starColor : "none"}
              stroke={filled ? starColor : "#C4B5A0"}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-full h-full"
              style={{
                filter: filled ? `drop-shadow(0 0 3px ${starColor}66)` : "none",
                transition: "all 0.15s ease",
              }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
