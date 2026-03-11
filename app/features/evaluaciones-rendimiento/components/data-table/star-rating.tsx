"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const starsToScore = (stars: number): number => stars * 20;
export const scoreToStars = (score: number): number => Math.round(score / 20);

interface StarRatingProps {
  value: number;
  onChange?: (stars: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const SIZE_MAP = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

const LABEL_MAP: Record<number, string> = {
  1: "Deficiente",
  2: "Regular",
  3: "Aceptable",
  4: "Bueno",
  5: "Excelente",
};

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
  showLabel = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  const displayed = hovered ?? value;

  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          "flex items-center gap-0.5",
          readonly && "cursor-default",
        )}
        role={readonly ? "img" : "radiogroup"}
        aria-label={`Puntuación: ${value} de 5 estrellas`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readonly}
            aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
            className={cn(
              "transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
              !readonly && "cursor-pointer hover:scale-110",
              readonly && "cursor-default pointer-events-none",
            )}
            onClick={() => !readonly && onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(null)}
          >
            <Star
              className={cn(
                SIZE_MAP[size],
                "transition-colors duration-100",
                star <= displayed
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40",
              )}
            />
          </button>
        ))}
      </div>

      {showLabel && value > 0 && (
        <span className="text-xs text-muted-foreground">
          {LABEL_MAP[value]} ({starsToScore(value)}/100)
        </span>
      )}
    </div>
  );
}
