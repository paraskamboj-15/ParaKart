import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  rating,
  size = 14,
  className,
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, (rating / 5) * 100));

  const row = (filled: boolean) => (
    <div className="flex shrink-0 gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={0}
          className={filled ? "fill-gold" : "fill-line"}
        />
      ))}
    </div>
  );

  return (
    <div
      className={cn("relative inline-flex", className)}
      role="img"
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      {row(false)}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        {row(true)}
      </div>
    </div>
  );
}
