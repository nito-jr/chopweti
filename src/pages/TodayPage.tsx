import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChefHat,
  Clock,
  Flame,
  Globe2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { AppHeader, AppTabBar } from "../components/Header";
import { DishCard } from "../components/DishCard";
import { HealthPill } from "../components/HealthPill";
import {
  conditionLabels,
  formatFCFA,
  goalOptions,
} from "../data";
import {
  demoProfile,
  useStore,
  type Profile,
} from "../store";
import {
  getDishCost,
  getHouseholdNote,
  getMatches,
  getTableSize,
  locationLabel,
  type DishMatch,
} from "../lib/recommend";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 11) return "Good morning";
  if (hour < 16) return "Good afternoon";
  return "Good evening";
}

function getFeatured(profile: Profile): DishMatch[] {
  return getMatches(profile).filter((match) => match.safe);
}

export function TodayPage() {
  const { profile, saveProfile, showToast } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [selection, setSelection] = useState(0);

  useEffect(() => {
    if (!profile && params.get("demo") === "1") {
      saveProfile(demoProfile);
      return;
    }
    if (!profile) navigate("/setup", { replace: true });
  }, [profile, params, saveProfile, navigate]);

  const matches = useMemo(() => (profile ? getFeatured(profile) : []), [profile]);
  const featured = matches[selection % Math.max(1, matches.length)];

  if (!profile) {
    return (
      <div className="page-loading">
        <span className="loading-bowl">◡</span>
        <p>Setting the table…</p>
      </div>
    );
  }

  if (!featured) {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main shell empty-state">
          <h1>No safe dish yet.</h1>
          <p>Your allergies remove every dish in this first collection. Update your table or talk to us.</p>
          <Link className="button button--clay" to="/table">
            Edit my table
          </Link>
        </main>
      </div>
    );
  }

  const { dish, reasons, pantryMatches } = featured;
  const tableSize = getTableSize(profile);
  const cost = getDishCost(dish, tableSize);
  const cautionForTable = dish.cautions.find((caution) =>
    profile.conditions.includes(caution.condition),
  );
  const isBamenda = profile.locationMode === "bamenda";
  const more = matches
    .filter((match) => match.dish.id !== dish.id)
    .slice(0, 3);
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dateParts = today.split(", ");

  const shuffle = () => {
    setSelection((value) => (value + 1) % matches.length);
    showToast("Another pot that fits your table.");
  };

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main shell">
        <div className="today-topline">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              {dateParts[0]} · {locationLabel(profile)}
            </p>
            <h1>
              {greeting()},<em> {profile.tableName}.</em>
            </h1>
            <p className="today-topline__lede">
              Here is what fits your table today. No guessing, no foreign pantry.
            </p>
          </div>
          <Link className="today-rule-card" to="/table">
            <span className="mini-label">Cooking for</span>
            <strong>{tableSize}</strong>
            <span>{tableSize === 1 ? "person" : "people"}</span>
            <small>{getHouseholdNote(profile)}</small>
            <span className="today-rule-card__edit">
              Edit table <ArrowUpRight size={12} />
            </span>
          </Link>
        </div>

        <section className="tonight-card">
          <div className="tonight-card__media">
            <img src={dish.image} alt={dish.name} />
            <div className="tonight-card__media-shade" />
            <div className="tonight-card__badges">
              <span className="tonight-label">
                <Sparkles size={13} /> Tonight’s pot
              </span>
              <span className="tonight-check">
                <ShieldCheck size={13} /> Fits your table
              </span>
            </div>
            <div className="tonight-card__caption">
              <span>{dish.origin}</span>
              <span>{dish.localName}</span>
            </div>
          </div>

          <div className="tonight-card__body">
            <div className="tonight-card__tagrow">
              {dish.health.map((tag) => (
                <HealthPill key={tag} tag={tag} />
              ))}
              {dish.allergens.length === 0 && (
                <span className="tonight-card__allergy">
                  <ShieldCheck size={12} /> No common allergens
                </span>
              )}
            </div>
            <h2>{dish.name}</h2>
            <p className="tonight-card__desc">{dish.description}</p>

            <div className="match-notes">
              {reasons.map((reason) => (
                <span key={reason}>
                  <Check size={14} strokeWidth={2.6} /> {reason}
                </span>
              ))}
            </div>

            <div className="tonight-card__facts">
              <div>
                <Clock size={17} />
                <span>
                  <strong>{dish.time} min</strong>
                  <small>{dish.prepTime} min prep</small>
                </span>
              </div>
              <div>
                <Wallet size={17} />
                <span>
                  <strong>{formatFCFA(cost)}</strong>
                  <small>whole pot</small>
                </span>
              </div>
              <div>
                <Users size={17} />
                <span>
                  <strong>{tableSize} eating</strong>
                  <small>scaled to you</small>
                </span>
              </div>
            </div>

            {cautionForTable && (
              <div className="tonight-caution">
                <ShieldCheck size={15} />
                <p>
                  <strong>A note for your table:</strong> {cautionForTable.text}
                </p>
              </div>
            )}

            <div className="tonight-card__actions">
              <Link className="button button--clay" to={`/recipe/${dish.id}`}>
                <ChefHat size={17} /> Cook this
              </Link>
              <button type="button" className="button button--plain" onClick={shuffle}>
                <RefreshCw size={15} /> Something else
              </button>
            </div>
          </div>
        </section>

        <div className="today-lower">
          <section className="today-more">
            <div className="app-section-head">
              <div>
                <p className="mini-label">Also good tonight</p>
                <h2>More for your table</h2>
              </div>
              <Link className="text-link text-link--dark" to="/dishes">
                All dishes <ArrowRight size={14} />
              </Link>
            </div>
            <div className="today-more__grid">
              {more.map((match) => (
                <DishCard
                  key={match.dish.id}
                  dish={match.dish}
                  match={match}
                  servings={tableSize}
                  variant="mini"
                />
              ))}
            </div>
          </section>

          <aside className="table-snapshot">
            <div className="table-snapshot__head">
              <span className="mini-label">Your table</span>
              <Link to="/table">
                Edit <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="table-snapshot__name">
              <span className="table-snapshot__avatar">{tableSize}</span>
              <div>
                <strong>{profile.tableName}</strong>
                <span>
                  {profile.adults} adults · {profile.children} children
                </span>
              </div>
            </div>

            <div className="snapshot-row">
              <span className="snapshot-label">Hard lines</span>
              <div className="chip-row">
                {profile.allergens.length > 0 ? (
                  profile.allergens.map((allergen) => (
                    <span key={allergen} className="chip chip--danger">
                      No {allergen}
                    </span>
                  ))
                ) : (
                  <span className="chip">No allergies set</span>
                )}
                {profile.dislikes.slice(0, 2).map((item) => (
                  <span key={item} className="chip">
                    No {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="snapshot-row">
              <span className="snapshot-label">What matters</span>
              <div className="chip-row">
                {profile.goals.map((goal) => (
                  <span key={goal} className="chip">
                    {goalOptions.find((option) => option.key === goal)?.label}
                  </span>
                ))}
                {profile.conditions.map((condition) => (
                  <span key={condition} className="chip chip--caution">
                    {conditionLabels[condition]}
                  </span>
                ))}
              </div>
            </div>

            <div className="snapshot-row">
              <span className="snapshot-label">Pantry</span>
              <div className="chip-row">
                {profile.pantry.slice(0, 5).map((item) => (
                  <span key={item} className="chip chip--pantry">
                    {item}
                  </span>
                ))}
                {profile.pantry.length > 5 && (
                  <span className="chip chip--pantry">+{profile.pantry.length - 5}</span>
                )}
              </div>
            </div>

            {isBamenda ? (
              <div className="snapshot-field">
                <MapPin size={15} />
                <div>
                  <strong>Vendors near {profile.neighborhood}</strong>
                  <span>Last checked 12 Oct 2026</span>
                </div>
                <Link to="/vendors">
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="snapshot-field">
                <Globe2 size={15} />
                <div>
                  <strong>Bamenda market prices</strong>
                  <span>Vendor pickup is hidden outside Bamenda</span>
                </div>
              </div>
            )}
          </aside>
        </div>

        <section className="pantry-strip">
          <div className="pantry-strip__icon">
            <Flame size={21} />
          </div>
          <div>
            <p className="mini-label">Use what you have</p>
            <h3>
              {pantryMatches > 0
                ? `${dish.name} uses ${pantryMatches} thing${pantryMatches === 1 ? "" : "s"} already in your kitchen.`
                : "You have a good start in the pantry."}
            </h3>
            <p>
              {formatFCFA(cost)} for the whole pot at Bamenda market prices.{" "}
              {isBamenda
                ? "Buy only what is missing, or let a neighbour prepare the hardest part."
                : "Shop for what is missing locally; prepared ingredients are a Bamenda service for now."}
            </p>
          </div>
          <Link className="button button--ink button--small" to={`/recipe/${dish.id}`}>
            See the list <ArrowRight size={15} />
          </Link>
        </section>

        <section className="field-note">
          <div className="field-note__stamp">
            <ShieldCheck size={18} />
            <span>Field note 042</span>
          </div>
          <blockquote>
            “Nkwen market had good cocoyam this week, but the price moved up by
            200 FCFA a heap. Mama Ngum is pounding from 6am.”
          </blockquote>
          <div className="field-note__by">
            <span className="field-note__avatar">NA</span>
            <div>
              <strong>Neba A.</strong>
              <span>Correspondent · Nkwen · 12 Oct 2026</span>
            </div>
            <Link to="/trust">
              How we verify <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>
      </main>
      <AppTabBar />
    </div>
  );
}
