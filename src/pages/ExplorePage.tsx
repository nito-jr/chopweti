import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { AppHeader, AppTabBar } from "../components/Header";
import { DishCard } from "../components/DishCard";
import {
  dishes,
  healthMeta,
  type HealthTag,
} from "../data";
import { useStore } from "../store";
import {
  getDishCost,
  getMatches,
  getTableSize,
} from "../lib/recommend";
import { cn } from "../lib/cn";

const healthFilters: Array<HealthTag | "All"> = [
  "All",
  "High Protein",
  "Rich Iron",
  "Energy Boost",
  "Balanced Fiber",
];

type TimeFilter = "any" | "quick" | "weekend";
type SortMode = "match" | "quick" | "budget";

export function ExplorePage() {
  const { profile } = useStore();
  const [query, setQuery] = useState("");
  const [health, setHealth] = useState<HealthTag | "All">("All");
  const [time, setTime] = useState<TimeFilter>("any");
  const [sort, setSort] = useState<SortMode>("match");
  const [safeOnly, setSafeOnly] = useState(true);

  const tableSize = getTableSize(profile);
  const matches = useMemo(() => getMatches(profile), [profile]);
  const matchMap = useMemo(
    () => new Map(matches.map((match) => [match.dish.id, match])),
    [matches],
  );
  const hiddenCount = matches.filter((match) => !match.safe).length;

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const list = dishes
      .filter((dish) => {
        const match = matchMap.get(dish.id);
        if (profile && safeOnly && !match?.safe) return false;
        if (health !== "All" && !dish.health.includes(health)) return false;
        if (time === "quick" && dish.time > 50) return false;
        if (time === "weekend" && dish.time < 60) return false;
        if (!needle) return true;
        const haystack = [
          dish.name,
          dish.localName,
          dish.origin,
          dish.description,
          ...dish.ingredients.map((ingredient) => ingredient.name),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
      .map((dish) => ({ dish, match: matchMap.get(dish.id) }));

    if (sort === "quick") {
      list.sort((a, b) => a.dish.time - b.dish.time);
    } else if (sort === "budget") {
      list.sort(
        (a, b) =>
          getDishCost(a.dish, tableSize) - getDishCost(b.dish, tableSize),
      );
    } else {
      list.sort((a, b) => (b.match?.score ?? 0) - (a.match?.score ?? 0));
    }
    return list;
  }, [query, health, time, sort, safeOnly, profile, matchMap, tableSize]);

  const reset = () => {
    setQuery("");
    setHealth("All");
    setTime("any");
    setSort("match");
    setSafeOnly(true);
  };

  const filtersActive = query || health !== "All" || time !== "any" || sort !== "match";

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main shell">
        <header className="explore-head">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              The whole pot list
            </p>
            <h1>
              Find your
              <em> next pot.</em>
            </h1>
            <p>
              Seven dishes from around Bamenda, written for a cook who has never
              made them. Every recipe scales to {tableSize}.
            </p>
          </div>
          <div className="explore-head__aside">
            <span className="mini-label">On this page</span>
            <strong>{results.length} dishes</strong>
            <span>
              {profile ? `Matched to ${profile.tableName}` : "Set your table to personalise"}
            </span>
            {profile ? (
              <Link className="text-link text-link--dark" to="/table">
                Edit table <ArrowUpRight size={13} />
              </Link>
            ) : (
              <Link className="text-link text-link--dark" to="/setup">
                Set my table <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
        </header>

        {!profile && (
          <div className="explore-prompt">
            <Sparkles size={18} />
            <p>
              <strong>Make this list yours.</strong> Add your household, allergies
              and pantry, and the right pots move to the top.
            </p>
            <Link className="button button--clay button--small" to="/setup">
              Set my table
            </Link>
          </div>
        )}

        <div className="explore-search">
          <label className="search-box">
            <Search size={19} />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a dish, an ingredient, a place…"
              aria-label="Search dishes"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </label>
          <label className="sort-box">
            <SlidersHorizontal size={16} />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              aria-label="Sort dishes"
            >
              <option value="match">Best for my table</option>
              <option value="quick">Quickest first</option>
              <option value="budget">Lowest cost first</option>
            </select>
          </label>
        </div>

        <div className="explore-filters">
          <div className="filter-set">
            <span className="filter-label">What it gives you</span>
            <div className="filter-chips">
              {healthFilters.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={cn("filter-chip", health === tag && "is-active")}
                  onClick={() => setHealth(tag)}
                  aria-pressed={health === tag}
                >
                  {tag !== "All" && (
                    <span
                      className="filter-chip__dot"
                      style={{ background: healthMeta[tag].color }}
                    />
                  )}
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="filter-set">
            <span className="filter-label">Time</span>
            <div className="filter-chips">
              <button
                type="button"
                className={cn("filter-chip", time === "any" && "is-active")}
                onClick={() => setTime("any")}
                aria-pressed={time === "any"}
              >
                Any time
              </button>
              <button
                type="button"
                className={cn("filter-chip", time === "quick" && "is-active")}
                onClick={() => setTime("quick")}
                aria-pressed={time === "quick"}
              >
                <Clock size={13} /> Under 50 min
              </button>
              <button
                type="button"
                className={cn("filter-chip", time === "weekend" && "is-active")}
                onClick={() => setTime("weekend")}
                aria-pressed={time === "weekend"}
              >
                <Clock size={13} /> Weekend pots
              </button>
            </div>
          </div>
          {profile && hiddenCount > 0 && (
            <label className="safe-toggle">
              <input
                type="checkbox"
                checked={safeOnly}
                onChange={(event) => setSafeOnly(event.target.checked)}
              />
              <span className="safe-toggle__track">
                <span />
              </span>
              <span>
                <ShieldCheck size={14} /> Only dishes safe for my table
              </span>
            </label>
          )}
        </div>

        <div className="results-meta">
          <p>
            <strong>{results.length}</strong>{" "}
            {results.length === 1 ? "dish" : "dishes"}
            {profile && safeOnly && hiddenCount > 0 && (
              <span className="results-meta__hidden">
                {" "}
                · {hiddenCount} hidden because of your allergies
              </span>
            )}
          </p>
          {filtersActive && (
            <button type="button" className="clear-filters" onClick={reset}>
              <X size={13} /> Clear filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className="explore-grid">
            {results.map(({ dish, match }, index) => (
              <DishCard
                key={dish.id}
                dish={dish}
                match={match?.safe ? match : undefined}
                servings={tableSize}
                eager={index < 3}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span className="no-results__mark">?</span>
            <h2>Nothing matches that pot yet.</h2>
            <p>
              Try a broader search, or clear the filters. If an allergy is
              hiding everything, check your table settings.
            </p>
            <button type="button" className="button button--ink" onClick={reset}>
              Clear filters
            </button>
          </div>
        )}

        <div className="explore-foot">
          <p>
            <ShieldCheck size={15} /> Allergens are filtered against your table
            before a dish is shown.
          </p>
          <p>Recipes are reviewed by cooks in Bamenda. Spot something wrong? Tell us.</p>
        </div>
      </main>
      <AppTabBar />
    </div>
  );
}
