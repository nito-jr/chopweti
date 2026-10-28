import {
  Beef,
  Droplets,
  Leaf,
  type LucideIcon,
  Zap,
} from "lucide-react";
import { healthMeta, type HealthTag } from "../data";
import { cn } from "../lib/cn";

const icons: Record<HealthTag, LucideIcon> = {
  "High Protein": Beef,
  "Rich Iron": Droplets,
  "Energy Boost": Zap,
  "Balanced Fiber": Leaf,
};

export function HealthPill({
  tag,
  variant = "solid",
  className,
}: {
  tag: HealthTag;
  variant?: "solid" | "ghost" | "outline";
  className?: string;
}) {
  const Icon = icons[tag];
  return (
    <span
      className={cn("health-pill", `health-pill--${variant}`, className)}
      style={
        variant === "solid"
          ? { background: healthMeta[tag].background, color: healthMeta[tag].color }
          : undefined
      }
    >
      <Icon size={12} strokeWidth={2.1} />
      {tag}
    </span>
  );
}

export function HealthIcon({ tag, size = 18 }: { tag: HealthTag; size?: number }) {
  const Icon = icons[tag];
  return <Icon size={size} strokeWidth={1.8} />;
}
