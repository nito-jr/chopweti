import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, ShieldCheck, Users } from "lucide-react";
import { formatFCFA, type Dish } from "../data";
import { getDishCost, type DishMatch } from "../lib/recommend";
import { HealthPill } from "./HealthPill";
import { cn } from "../lib/cn";

export function DishCard({
  dish,
  match,
  servings = 4,
  variant = "default",
  eager = false,
}: {
  dish: Dish;
  match?: DishMatch;
  servings?: number;
  variant?: "default" | "wide" | "mini";
  eager?: boolean;
}) {
  const cost = getDishCost(dish, servings);
  return (
    <Link
      to={`/recipe/${dish.id}`}
      className={cn("dish-card", `dish-card--${variant}`)}
      aria-label={`${dish.name}, ${dish.time} minutes`}
    >
      <div className="dish-card__media">
        <img
          src={dish.image}
          alt={dish.name}
          loading={eager ? "eager" : "lazy"}
          style={{ objectPosition: dish.id === "kati-kati" ? "center 58%" : "center" }}
        />
        <div className="dish-card__tags">
          {dish.health.slice(0, 1).map((tag) => (
            <HealthPill key={tag} tag={tag} />
          ))}
        </div>
        <span className="dish-card__arrow" aria-hidden="true">
          <ArrowUpRight size={17} strokeWidth={2} />
        </span>
        {dish.allergens.length === 0 && <span className="dish-card__safe">Allergy-safe base</span>}
      </div>
      <div className="dish-card__body">
        <p className="dish-card__origin">{dish.origin}</p>
        <h3>{dish.name}</h3>
        <div className="dish-card__meta">
          <span>
            <Clock size={14} /> {dish.time} min
          </span>
          <span>
            <Users size={14} /> {servings}
          </span>
          <span>{formatFCFA(cost)}</span>
        </div>
        {match?.reasons[0] && (
          <p className="dish-card__reason">
            <ShieldCheck size={14} />
            {match.reasons[0]}
          </p>
        )}
      </div>
    </Link>
  );
}
