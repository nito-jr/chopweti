import { Link } from "react-router-dom";
import { cn } from "../lib/cn";

export function PotMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="rotate(-7 20 23)">
        <path
          d="M8.2 17.4h23.6l-2.7 13.3c-.3 1.5-1.6 2.5-3.1 2.5H14c-1.5 0-2.8-1-3.1-2.5L8.2 17.4Z"
          fill="currentColor"
        />
        <path
          d="M6.6 16.6h26.8"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M10.2 21h19.6"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          opacity=".40"
        />
        <path
          d="M4.7 20.1c-1.5.9-1.6 3.1-.2 4.2l2.4 1.8M35.3 20.1c1.5.9 1.6 3.1.2 4.2l-2.4 1.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <g transform="rotate(-21 15 13)">
          <ellipse cx="15" cy="13.2" rx="9.1" ry="2.6" fill="currentColor" />
          <path
            d="M7.2 13c.5-2.8 4-4.4 7.8-4.4s7.3 1.6 7.8 4.4"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          <circle cx="15" cy="7.1" r="1.6" fill="currentColor" />
        </g>
        <path
          d="M24.2 6.9c-1.4-1.5 1.2-2.4.3-4M29 8.1c-1.2-1.4 1-2.2.2-3.6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function Brand({
  light = false,
  to = "/",
  className,
}: {
  light?: boolean;
  to?: string;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cn("brand", light && "brand--light", className)}
      aria-label="ChopWeti home"
    >
      <PotMark className="brand__mark" />
      <span className="brand__word">
        chop<em>weti</em><span className="brand__dot">.</span>
      </span>
    </Link>
  );
}
