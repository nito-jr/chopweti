import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChefHat,
  Clock,
  Globe2,
  Info,
  ListChecks,
  Minus,
  Plus,
  ShieldAlert,
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
  dishes,
  formatFCFA,
  formatQty,
  type Ingredient,
} from "../data";
import { useStore } from "../store";
import {
  findDish,
  findVendor,
  getDishCost,
  getTableSize,
  isSafeFor,
} from "../lib/recommend";
import { cn } from "../lib/cn";

type ChoiceMap = Record<string, "raw" | "ready">;

function initialChoices(ingredients: Ingredient[]): ChoiceMap {
  return Object.fromEntries(
    ingredients.map((ingredient) => [ingredient.id, "raw" as const]),
  );
}

export function RecipePage() {
  const { id } = useParams();
  const dish = findDish(id);
  const { profile, shopping, saveShopping, showToast, trackEvent } = useStore();
  const navigate = useNavigate();
  const tableSize = getTableSize(profile);
  const sameShopping = Boolean(dish && shopping?.dishId === dish.id);
  const isBamenda = profile?.locationMode !== "elsewhere";

  const [servings, setServings] = useState(
    sameShopping && shopping ? shopping.servings : tableSize,
  );
  const [choices, setChoices] = useState<ChoiceMap>(() =>
    dish
      ? sameShopping && shopping
        ? shopping.choices
        : initialChoices(dish.ingredients)
      : {},
  );
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!dish) return;
    setServings(sameShopping && shopping ? shopping.servings : tableSize);
    setChoices(
      sameShopping && shopping && isBamenda
        ? shopping.choices
        : initialChoices(dish.ingredients),
    );
    setCompleted(new Set());
    setActiveStep(0);
    // The dish and location are reset boundaries; profile preference changes should not reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dish?.id, isBamenda]);

  useEffect(() => {
    if (dish) trackEvent("recipe_opened", { dish: dish.id });
    // Only track when the recipe changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dish?.id]);

  const cost = useMemo(
    () => (dish ? getDishCost(dish, servings, choices) : 0),
    [dish, servings, choices],
  );
  const rawCost = useMemo(() => (dish ? getDishCost(dish, servings) : 0), [dish, servings]);
  const scale = dish ? servings / dish.baseServings : 1;

  if (!dish) {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main shell empty-state">
          <span className="eyebrow">Not on the table</span>
          <h1>That pot is not here.</h1>
          <p>The dish may have moved. Browse the full collection instead.</p>
          <Link className="button button--clay" to="/dishes">
            All dishes <ArrowRight size={16} />
          </Link>
        </main>
        <AppTabBar />
      </div>
    );
  }

  const safe = isSafeFor(dish, profile);
  const relevantCautions = dish.cautions.filter((caution) =>
    profile?.conditions.includes(caution.condition),
  );
  const readyCount = isBamenda
    ? dish.ingredients.filter(
        (ingredient) => ingredient.ready && choices[ingredient.id] === "ready",
      ).length
    : 0;
  const readyVendors = isBamenda
    ? Array.from(
        new Set(
          dish.ingredients
            .filter((ingredient) => ingredient.ready && choices[ingredient.id] === "ready")
            .map((ingredient) => ingredient.ready!.vendorId),
        ),
      )
    : [];
  const progress = Math.round((completed.size / dish.steps.length) * 100);
  const related = dishes
    .filter((item) => item.id !== dish.id)
    .filter((item) => isSafeFor(item, profile))
    .slice(0, 3);

  const toggleStep = (index: number) => {
    setCompleted((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        setActiveStep(Math.min(index + 1, dish.steps.length - 1));
        trackEvent("step_completed", {
          dish: dish.id,
          step: index + 1,
          total: dish.steps.length,
        });
      }
      return next;
    });
  };

  const saveToShopping = (goToPage = true) => {
    const safeChoices = isBamenda
      ? choices
      : Object.fromEntries(
          Object.keys(choices).map((ingredientId) => [ingredientId, "raw" as const]),
        );
    saveShopping({
      dishId: dish.id,
      servings,
      choices: safeChoices,
      checked: [],
      note: "",
    });
    trackEvent("shopping_list_built", {
      dish: dish.id,
      servings,
      ready_items: readyCount,
      location: isBamenda ? "bamenda" : "elsewhere",
    });
    showToast("Shopping list saved for your table.");
    if (goToPage) navigate("/list");
  };

  return (
    <div className="app-shell recipe-page">
      <AppHeader />
      <main className="recipe-main">
        <div className="shell">
          <div className="recipe-breadcrumb">
            <Link to="/dishes">
              <ArrowLeft size={15} /> All dishes
            </Link>
            <span>/</span>
            <span>{dish.name}</span>
          </div>

          <section className="recipe-hero">
            <div className="recipe-hero__media">
              <img src={dish.image} alt={dish.name} />
              <span className="recipe-hero__image-note">
                <Sparkles size={13} /> {dish.localName} · {dish.origin}
              </span>
            </div>
            <div className="recipe-hero__copy">
              <div className="recipe-hero__tags">
                {dish.health.map((tag) => (
                  <HealthPill key={tag} tag={tag} />
                ))}
              </div>
              <p className="eyebrow recipe-hero__origin">{dish.origin}</p>
              <h1>{dish.name}</h1>
              <p className="recipe-hero__tagline">{dish.tagline}</p>
              <div className="recipe-hero__meta">
                <span>
                  <Clock size={16} />
                  <strong>{dish.time} min</strong> total
                </span>
                <span>
                  <ChefHat size={16} />
                  <strong>{dish.difficulty}</strong>
                </span>
                <span>
                  <Users size={16} />
                  <strong>{servings}</strong> eating
                </span>
                <span>
                  <Wallet size={16} />
                  <strong>{formatFCFA(cost)}</strong>
                </span>
              </div>
              <div className="recipe-hero__actions">
                <button
                  type="button"
                  className="button button--clay"
                  onClick={() =>
                    document.getElementById("method")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Start cooking <ArrowDownIcon />
                </button>
                <button
                  type="button"
                  className="button button--plain"
                  onClick={() => saveToShopping(false)}
                >
                  <ListChecks size={16} /> Save the list
                </button>
              </div>
              <p className="recipe-hero__allergy">
                <ShieldCheck size={14} />
                {dish.allergens.length > 0
                  ? `Contains ${dish.allergens.join(", ")}.`
                  : "No common allergens in the base recipe."}
              </p>
            </div>
          </section>

          {!safe && (
            <div className="recipe-warning">
              <ShieldAlert size={20} />
              <div>
                <strong>This dish contains something your table avoids.</strong>
                <p>
                  It is shown because you opened it directly, but it is not
                  suggested for {profile?.tableName ?? "your table"}.
                </p>
              </div>
              <Link to="/dishes" className="button button--small button--plain">
                Find a safe dish
              </Link>
            </div>
          )}

          <div className="nutrition-strip">
            <span className="mini-label">Per serving</span>
            <div>
              <span>
                <strong>{dish.nutrition.calories}</strong> kcal
              </span>
              <span>
                <strong>{dish.nutrition.protein}g</strong> protein
              </span>
              <span>
                <strong>{dish.nutrition.iron}mg</strong> iron
              </span>
              <span>
                <strong>{dish.nutrition.fibre}g</strong> fibre
              </span>
            </div>
            <p>Estimated from the ingredients. Food guidance, not medical advice.</p>
          </div>

          <div className="recipe-layout">
            <div className="recipe-content">
              <section className="recipe-before">
                <div className="section-topline section-topline--small">
                  <span className="section-number">01</span>
                  <p className="section-kicker">Before you start</p>
                  <span className="section-rule" />
                </div>
                <div className="recipe-before__grid">
                  <div>
                    <p className="recipe-before__lede">{dish.story}</p>
                    <p className="recipe-before__desc">{dish.description}</p>
                  </div>
                  <div className="cook-note">
                    <span className="mini-label">Mama’s note</span>
                    <p>{dish.cookNote}</p>
                  </div>
                </div>
              </section>

              <section className="recipe-ingredients" id="ingredients">
                <div className="recipe-section-head">
                  <div>
                    <div className="section-topline section-topline--small">
                      <span className="section-number">02</span>
                      <p className="section-kicker">What goes in</p>
                      <span className="section-rule" />
                    </div>
                    <h2>Ingredients for {servings}</h2>
                  </div>
                  <div className="serving-stepper">
                    <button
                      type="button"
                      aria-label="One fewer serving"
                      onClick={() => setServings((value) => Math.max(1, value - 1))}
                      disabled={servings <= 1}
                    >
                      <Minus size={15} />
                    </button>
                    <span>
                      <strong>{servings}</strong> eating
                    </span>
                    <button
                      type="button"
                      aria-label="One more serving"
                      onClick={() => setServings((value) => Math.min(12, value + 1))}
                      disabled={servings >= 12}
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                </div>

                <p className="ingredients-hint">
                  Choose what you want to buy raw and what a verified neighbour
                  should prepare. The FCFA total follows.
                </p>

                {!isBamenda && (
                  <div className="global-note">
                    <Globe2 size={15} />
                    <p>
                      You are cooking outside Bamenda, so prepared ingredients and
                      vendor pickup are hidden. This list is for shopping locally;
                      prices stay as Bamenda market estimates.
                    </p>
                  </div>
                )}

                <div className="ingredient-list">
                  {dish.ingredients.map((ingredient) => {
                    const activeChoice =
                      isBamenda && ingredient.ready
                        ? choices[ingredient.id] ?? "raw"
                        : "raw";
                    const rawPrice = ingredient.rawPrice * scale;
                    const readyPrice = ingredient.ready
                      ? ingredient.ready.price * scale
                      : rawPrice;
                    const vendor = ingredient.ready
                      ? findVendor(ingredient.ready.vendorId)
                      : undefined;
                    return (
                      <div className="ingredient-row" key={ingredient.id}>
                        <div className="ingredient-row__main">
                          <span className="ingredient-check">
                            <span />
                          </span>
                          <div className="ingredient-row__name">
                            <div>
                              <strong>{ingredient.name}</strong>
                              <span>{formatQty(ingredient.qty * scale, ingredient.unit)}</span>
                            </div>
                            {ingredient.note && <small>{ingredient.note}</small>}
                          </div>
                          <span className="ingredient-row__price">
                            {formatFCFA(
                              activeChoice === "ready" ? readyPrice : rawPrice,
                            )}
                          </span>
                        </div>

                        {isBamenda && ingredient.ready && (
                          <div className="ingredient-choice">
                            <div className="choice-toggle">
                              <button
                                type="button"
                                className={cn("choice-button", activeChoice === "raw" && "is-active")}
                                onClick={() =>
                                  setChoices((current) => ({
                                    ...current,
                                    [ingredient.id]: "raw",
                                  }))
                                }
                              >
                                Buy raw
                                <span>{formatFCFA(rawPrice)}</span>
                              </button>
                              <button
                                type="button"
                                className={cn(
                                  "choice-button",
                                  activeChoice === "ready" && "is-active",
                                )}
                                onClick={() =>
                                  setChoices((current) => ({
                                    ...current,
                                    [ingredient.id]: "ready",
                                  }))
                                }
                              >
                                <Sparkles size={12} /> Buy ready
                                <span>{formatFCFA(readyPrice)}</span>
                              </button>
                            </div>
                            {activeChoice === "ready" && vendor && (
                              <div className="ready-vendor">
                                <span className="ready-vendor__avatar">{vendor.initials}</span>
                                <span>
                                  <strong>{vendor.shortName}</strong> · {vendor.neighborhood}
                                  <small>{ingredient.ready.note}</small>
                                </span>
                                <ShieldCheck size={13} />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="ingredient-total">
                  <div>
                    <span>
                      <Wallet size={15} /> Your pot
                    </span>
                    <small>
                      {!isBamenda
                        ? "Bamenda market estimate · shop locally"
                        : readyCount > 0
                          ? `${readyCount} item${readyCount === 1 ? "" : "s"} prepared nearby`
                          : "All raw, prepared at home"}
                    </small>
                  </div>
                  <strong>{formatFCFA(cost)}</strong>
                </div>
              </section>

              <section className="recipe-method" id="method">
                <div className="recipe-section-head">
                  <div>
                    <div className="section-topline section-topline--small">
                      <span className="section-number">03</span>
                      <p className="section-kicker">The method</p>
                      <span className="section-rule" />
                    </div>
                    <h2>Cook it step by step</h2>
                  </div>
                  <div className="method-progress">
                    <span>
                      {completed.size} of {dish.steps.length} done
                    </span>
                    <div className="method-progress__track">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="step-list">
                  {dish.steps.map((step, index) => {
                    const done = completed.has(index);
                    const current = index === activeStep && !done;
                    return (
                      <article
                        key={step.title}
                        className={cn(
                          "recipe-step",
                          done && "is-done",
                          current && "is-current",
                        )}
                      >
                        <button
                          type="button"
                          className="step-check"
                          onClick={() => toggleStep(index)}
                          aria-label={done ? `Mark step ${index + 1} unfinished` : `Mark step ${index + 1} done`}
                          aria-pressed={done}
                        >
                          {done ? <Check size={15} strokeWidth={3} /> : index + 1}
                        </button>
                        <div className="recipe-step__body">
                          <div className="recipe-step__head">
                            <div>
                              <span className="step-kicker">
                                Step {index + 1} of {dish.steps.length}
                              </span>
                              <h3>{step.title}</h3>
                            </div>
                            <span className="step-time">
                              <Clock size={13} /> {step.minutes} min
                            </span>
                          </div>
                          <p>{step.body}</p>
                          <div className="step-tip">
                            <span>Kitchen tip</span>
                            {step.tip}
                          </div>
                          <button
                            type="button"
                            className={cn("step-done-button", done && "is-done")}
                            onClick={() => toggleStep(index)}
                          >
                            {done ? (
                              <>
                                <Check size={14} /> Done
                              </>
                            ) : (
                              <>
                                Mark this step done <ArrowRight size={14} />
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="after-pot">
                  <div className="after-pot__icon">
                    <ChefHat size={21} />
                  </div>
                  <div>
                    <span className="mini-label">After the pot</span>
                    <p>{dish.servingNote}</p>
                  </div>
                </div>
              </section>

              <section className="recipe-related">
                <div className="app-section-head">
                  <div>
                    <p className="mini-label">Next time</p>
                    <h2>Other pots that fit</h2>
                  </div>
                  <Link className="text-link text-link--dark" to="/dishes">
                    All dishes <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="recipe-related__grid">
                  {related.map((item) => (
                    <DishCard key={item.id} dish={item} servings={servings} variant="mini" />
                  ))}
                </div>
              </section>
            </div>

            <aside className="recipe-side">
              <div className="recipe-side__card">
                <div className="recipe-side__head">
                  <span className="mini-label">Your pot</span>
                  <span className="recipe-side__servings">{servings} eating</span>
                </div>
                <div className="recipe-side__dish">
                  <img src={dish.image} alt="" />
                  <div>
                    <strong>{dish.name}</strong>
                    <span>{dish.time} min · {dish.difficulty}</span>
                  </div>
                </div>

                <div className="recipe-side__rows">
                  <div>
                    <span>Ingredients</span>
                    <strong>{formatFCFA(cost)}</strong>
                  </div>
                  <div>
                    <span>Raw total</span>
                    <strong>{formatFCFA(rawCost)}</strong>
                  </div>
                  {cost !== rawCost && (
                    <div className="is-highlight">
                      <span>Prepared nearby</span>
                      <strong>+{formatFCFA(cost - rawCost)}</strong>
                    </div>
                  )}
                  <div>
                    <span>Per person</span>
                    <strong>{formatFCFA(cost / servings)}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="button button--clay button--wide"
                  onClick={() => saveToShopping(true)}
                >
                  <ListChecks size={16} /> Build my shopping list
                </button>

                {readyVendors.length > 0 && (
                  <div className="recipe-side__vendors">
                    <span className="mini-label">Prepared by</span>
                    {readyVendors.map((vendorId) => {
                      const vendor = findVendor(vendorId);
                      if (!vendor) return null;
                      return (
                        <Link key={vendor.id} to="/vendors" className="side-vendor">
                          <span className="side-vendor__avatar">{vendor.initials}</span>
                          <span>
                            <strong>{vendor.shortName}</strong>
                            <small>
                              {vendor.neighborhood} · checked {vendor.verified}
                            </small>
                          </span>
                          <ArrowUpRight size={13} />
                        </Link>
                      );
                    })}
                  </div>
                )}

                <div className="recipe-side__note">
                  {isBamenda ? <Info size={14} /> : <Globe2 size={14} />}
                  {isBamenda
                    ? "Vendors are independent. ChopWeti confirms they exist and what they sell, then shows their last verification date."
                    : "Vendor pickup is available in Bamenda only. Your list remains a local shopping list, with FCFA estimates from the Bamenda market."}
                </div>
              </div>

              {relevantCautions.length > 0 && (
                <div className="recipe-side__caution">
                  <span className="mini-label">
                    <ShieldAlert size={13} /> For your table
                  </span>
                  {relevantCautions.map((caution) => (
                    <div key={caution.condition}>
                      <strong>{conditionLabels[caution.condition]}</strong>
                      <p>{caution.text}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="recipe-side__quote">
                <p>
                  “The recipe should make you brave enough to try it on a
                  Tuesday.”
                </p>
                <span>ChopWeti kitchen note</span>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <AppTabBar />
    </div>
  );
}

function ArrowDownIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
