import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Globe2,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Utensils,
} from "lucide-react";
import { Brand } from "../components/Brand";
import {
  allergenOptions,
  conditionOptions,
  dislikeOptions,
  goalOptions,
  neighborhoods,
  pantryOptions,
  type Neighborhood,
} from "../data";
import { demoProfile, makeProfile, useStore, type Profile } from "../store";
import { cn } from "../lib/cn";
import { pepperColor, pepperDescription, pepperLabel } from "../lib/pepper";

const steps = [
  { title: "Your table", kicker: "First, who are we cooking for?" },
  { title: "Hard lines", kicker: "What must never reach the plate?" },
  { title: "What food should do", kicker: "How should dinner work for you?" },
  { title: "Your pantry", kicker: "What is already in the kitchen?" },
];

function toggleInList<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function SetupPage() {
  const { profile, saveProfile, trackEvent } = useStore();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<Profile>(() => profile ?? makeProfile());
  const [step, setStep] = useState(0);
  const editing = Boolean(profile);

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const total = draft.adults + draft.children;
  const canContinue =
    step !== 0 ||
    (draft.tableName.trim().length > 0 &&
      total > 0 &&
      (draft.locationMode === "bamenda" || draft.city.trim().length > 0));

  const pantrySelected = useMemo(
    () => pantryOptions.filter((option) => draft.pantry.includes(option.key)),
    [draft.pantry],
  );

  const finish = () => {
    saveProfile({ ...draft, createdAt: profile?.createdAt ?? new Date().toISOString() });
    trackEvent("setup_completed", {
      location: draft.locationMode,
      people: total,
      allergies: draft.allergens.length,
    });
    navigate("/today");
  };

  const useSample = () => {
    saveProfile(demoProfile);
    navigate("/today");
  };

  return (
    <div className="setup-page">
      <header className="setup-header">
        <Brand to="/" />
        <Link className="setup-header__cancel" to={editing ? "/today" : "/"}>
          {editing ? "Back to my table" : "Cancel"}
        </Link>
      </header>

      <div className="setup-shell">
        <aside className="setup-aside">
          <div>
            <p className="eyebrow eyebrow--light">
              <span className="eyebrow__dot" />
              {editing ? "Your table, updated" : "Set your table"}
            </p>
            <h1>
              A good pot starts
              <em> with knowing who is eating.</em>
            </h1>
            <p>
              Four short questions. No account, no email, no noise. Everything
              stays on this device.
            </p>
          </div>

          <div className="setup-preview">
            <div className="setup-preview__top">
              <span className="mini-label">Your table</span>
              <span className="setup-preview__count">
                <Users size={13} /> {total || "—"}
              </span>
            </div>
            <h3>{draft.tableName || "My table"}</h3>
            <p className="setup-preview__place">
              {draft.locationMode === "elsewhere" ? <Globe2 size={13} /> : <MapPin size={13} />}
              {draft.locationMode === "elsewhere"
                ? draft.city || "Outside Bamenda"
                : draft.neighborhood}
            </p>
            <div className="setup-preview__rows">
              <div>
                <span>Hard lines</span>
                <p>
                  {draft.allergens.length > 0
                    ? `No ${draft.allergens.join(", ")}`
                    : "None yet"}
                </p>
              </div>
              <div>
                <span>What matters</span>
                <p>
                  {draft.goals.length > 0
                    ? draft.goals
                        .map((goal) => goalOptions.find((option) => option.key === goal)?.label)
                        .filter(Boolean)
                        .slice(0, 2)
                        .join(" · ")
                    : "Family portions"}
                </p>
              </div>
              <div>
                <span>Pantry</span>
                <p>
                  {pantrySelected.length > 0
                    ? pantrySelected
                        .slice(0, 3)
                        .map((item) => item.label)
                        .join(" · ")
                    : "Not set"}
                </p>
              </div>
            </div>
            <div className="setup-preview__foot">
              <ShieldCheck size={13} />
              {draft.allergens.length > 0
                ? "Allergy dishes are removed, not hidden"
                : "Allergies are treated as hard lines"}
            </div>
          </div>

          <p className="setup-aside__note">
            “Achu on a Tuesday should not feel like an exam.”
          </p>
        </aside>

        <main className="setup-card">
          <div className="setup-progress">
            <div className="setup-progress__bars">
              {steps.map((item, index) => (
                <span
                  key={item.title}
                  className={cn(index <= step && "is-filled", index === step && "is-current")}
                />
              ))}
            </div>
            <span>
              Step {step + 1} of {steps.length}
            </span>
          </div>

          <div className="setup-card__head">
            <p className="setup-card__kicker">{steps[step].kicker}</p>
            <h2>{steps[step].title}</h2>
          </div>

          {step === 0 && (
            <div className="setup-step">
              <label className="field">
                <span>What should we call your table?</span>
                <input
                  type="text"
                  value={draft.tableName}
                  onChange={(event) => update("tableName", event.target.value)}
                  placeholder="e.g. The Ngwa table"
                  maxLength={40}
                  autoFocus
                  onFocus={(event) => event.currentTarget.select()}
                />
              </label>

              <div className="field">
                <span>Where are you cooking from?</span>
                <div className="location-switch">
                  <button
                    type="button"
                    className={cn(draft.locationMode === "bamenda" && "is-selected")}
                    onClick={() => update("locationMode", "bamenda")}
                    aria-pressed={draft.locationMode === "bamenda"}
                  >
                    <MapPin size={15} /> In Bamenda
                    <small>Vendors and prepared ingredients</small>
                  </button>
                  <button
                    type="button"
                    className={cn(draft.locationMode === "elsewhere" && "is-selected")}
                    onClick={() => update("locationMode", "elsewhere")}
                    aria-pressed={draft.locationMode === "elsewhere"}
                  >
                    <Globe2 size={15} /> Outside Bamenda
                    <small>Recipes and lists, no vendor pickup</small>
                  </button>
                </div>
              </div>

              {draft.locationMode === "bamenda" ? (
                <label className="field">
                  <span>Which neighbourhood?</span>
                  <div className="select-wrap">
                    <MapPin size={16} />
                    <select
                      value={draft.neighborhood}
                      onChange={(event) =>
                        update("neighborhood", event.target.value as Neighborhood)
                      }
                    >
                      {neighborhoods.map((place) => (
                        <option key={place.name} value={place.name}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <small>We only show vendors verified in or near your neighbourhood.</small>
                </label>
              ) : (
                <label className="field">
                  <span>Which city or country are you in?</span>
                  <input
                    type="text"
                    value={draft.city}
                    onChange={(event) => update("city", event.target.value)}
                    placeholder="e.g. Douala, London, Toronto"
                    maxLength={60}
                  />
                  <small>
                    Recipes, scaling and FCFA estimates still work. Vendor pickup is hidden
                    outside Bamenda for now.
                  </small>
                </label>
              )}

              <div className="counter-row">
                <div className="counter-block">
                  <div>
                    <span>Adults</span>
                    <small>12 and over</small>
                  </div>
                  <div className="counter">
                    <button
                      type="button"
                      aria-label="One fewer adult"
                      onClick={() => update("adults", Math.max(0, draft.adults - 1))}
                      disabled={draft.adults === 0}
                    >
                      <Minus size={16} />
                    </button>
                    <strong>{draft.adults}</strong>
                    <button
                      type="button"
                      aria-label="One more adult"
                      onClick={() => update("adults", Math.min(12, draft.adults + 1))}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                <div className="counter-block">
                  <div>
                    <span>Children</span>
                    <small>Under 12</small>
                  </div>
                  <div className="counter">
                    <button
                      type="button"
                      aria-label="One fewer child"
                      onClick={() => update("children", Math.max(0, draft.children - 1))}
                      disabled={draft.children === 0}
                    >
                      <Minus size={16} />
                    </button>
                    <strong>{draft.children}</strong>
                    <button
                      type="button"
                      aria-label="One more child"
                      onClick={() => update("children", Math.min(12, draft.children + 1))}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-visual">
                <div className="table-visual__people" aria-hidden="true">
                  {Array.from({ length: Math.min(total, 8) }).map((_, index) => (
                    <span
                      key={index}
                      className={index < draft.adults ? "is-adult" : "is-child"}
                    >
                      {index < draft.adults ? "A" : "C"}
                    </span>
                  ))}
                </div>
                <p>
                  {total === 0
                    ? "Add at least one person to the table."
                    : `${total} ${total === 1 ? "person" : "people"} at the table. Recipes and costs will scale to this.`}
                </p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="setup-step">
              <div className="callout callout--danger">
                <ShieldAlert size={18} />
                <p>
                  <strong>Allergies are absolute.</strong> Any dish containing one
                  is removed from your suggestions — not shown with a warning.
                </p>
              </div>

              <fieldset className="fieldset">
                <legend>Does anyone at this table have an allergy?</legend>
                <div className="option-grid option-grid--allergens">
                  {allergenOptions.map((option) => {
                    const selected = draft.allergens.includes(option.key);
                    return (
                      <button
                        type="button"
                        key={option.key}
                        className={cn("check-card", selected && "is-selected")}
                        onClick={() => update("allergens", toggleInList(draft.allergens, option.key))}
                        aria-pressed={selected}
                      >
                        <span className="check-card__box">
                          {selected && <Check size={13} strokeWidth={3} />}
                        </span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <small>You can change this at any time. We never suggest around an allergy.</small>
              </fieldset>

              <fieldset className="fieldset">
                <legend>Anything the table simply will not eat?</legend>
                <div className="chip-select">
                  {dislikeOptions.map((option) => {
                    const selected = draft.dislikes.includes(option.key);
                    return (
                      <button
                        type="button"
                        key={option.key}
                        className={cn("select-chip", selected && "is-selected")}
                        onClick={() => update("dislikes", toggleInList(draft.dislikes, option.key))}
                        aria-pressed={selected}
                      >
                        {selected && <Check size={12} />}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <small>Dislikes move dishes down the list. Allergies remove them entirely.</small>
              </fieldset>
            </div>
          )}

          {step === 2 && (
            <div className="setup-step">
              <fieldset className="fieldset">
                <legend>What should dinner do for you?</legend>
                <div className="goal-grid">
                  {goalOptions.map((goal) => {
                    const selected = draft.goals.includes(goal.key);
                    return (
                      <button
                        type="button"
                        key={goal.key}
                        className={cn("goal-card", selected && "is-selected")}
                        onClick={() => update("goals", toggleInList(draft.goals, goal.key))}
                        aria-pressed={selected}
                      >
                        <span className="goal-card__icon">
                          {goal.key === "muscle" && <Flame size={19} />}
                          {goal.key === "energy" && <Sparkles size={19} />}
                          {goal.key === "iron" && <Heart size={19} />}
                          {goal.key === "light" && <Utensils size={19} />}
                          {goal.key === "family" && <Users size={19} />}
                        </span>
                        <span>
                          <strong>{goal.label}</strong>
                          <small>{goal.hint}</small>
                        </span>
                        <span className="goal-card__check">
                          {selected && <Check size={13} strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <small>Choose as many as fit. We use them to order the suggestions.</small>
              </fieldset>

              <fieldset className="fieldset">
                <legend>Is anyone managing a condition?</legend>
                <div className="condition-list">
                  {conditionOptions.map((condition) => {
                    const selected = draft.conditions.includes(condition.key);
                    return (
                      <button
                        type="button"
                        key={condition.key}
                        className={cn("condition-card", selected && "is-selected")}
                        onClick={() =>
                          update("conditions", toggleInList(draft.conditions, condition.key))
                        }
                        aria-pressed={selected}
                      >
                        <span className="condition-card__icon">
                          <AlertTriangle size={17} />
                        </span>
                        <span>
                          <strong>{condition.label}</strong>
                          <small>{condition.hint}</small>
                        </span>
                        <span className="check-card__box">
                          {selected && <Check size={13} strokeWidth={3} />}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <small>
                  This adds clear cautions — never a hidden ingredient. It is not
                  medical advice.
                </small>
              </fieldset>

              <fieldset className="fieldset">
                <legend>How much pepper can the table take?</legend>
                <div className="pepper-control">
                  <div className="pepper-control__top">
                    <span
                      className="pepper-readout"
                      style={{ color: pepperColor(draft.pepper) }}
                    >
                      {pepperLabel(draft.pepper)}
                    </span>
                    <span className="pepper-value">{draft.pepper}% heat</span>
                  </div>
                  <input
                    className="pepper-slider"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={draft.pepper}
                    onChange={(event) => update("pepper", Number(event.target.value))}
                    style={{ color: pepperColor(draft.pepper) }}
                    aria-label="Pepper intensity"
                    aria-valuetext={`${pepperLabel(draft.pepper)}, ${draft.pepper} percent heat`}
                  />
                  <div className="pepper-scale">
                    <span>Mild</span>
                    <span>Medium</span>
                    <span>Hot</span>
                  </div>
                  <p className="pepper-note">{pepperDescription(draft.pepper)}</p>
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="setup-step">
              <fieldset className="fieldset">
                <legend>What is already in the kitchen?</legend>
                <p className="fieldset__intro">
                  Tick what you have. Meals that use more of it rise to the top.
                  You can skip this and come back later.
                </p>
                <div className="chip-select chip-select--pantry">
                  {pantryOptions.map((option) => {
                    const selected = draft.pantry.includes(option.key);
                    return (
                      <button
                        type="button"
                        key={option.key}
                        className={cn("select-chip select-chip--large", selected && "is-selected")}
                        onClick={() => update("pantry", toggleInList(draft.pantry, option.key))}
                        aria-pressed={selected}
                      >
                        <span className="pantry-dot" />
                        {option.label}
                        {selected && <Check size={12} />}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="setup-summary">
                <div className="setup-summary__head">
                  <span className="mini-label">Ready when you are</span>
                  <span className="setup-summary__badge">
                    <ShieldCheck size={13} /> Private to this device
                  </span>
                </div>
                <h3>{draft.tableName || "My table"} is set.</h3>
                <p>
                  {total} {total === 1 ? "person" : "people"} in{" "}
                  {draft.locationMode === "elsewhere"
                    ? draft.city || "another city"
                    : draft.neighborhood}.
                  {draft.locationMode === "elsewhere"
                    ? "Vendor pickup stays hidden; recipes and lists still work. "
                    : ""}
                  {draft.allergens.length > 0
                    ? `We will keep ${draft.allergens.join(", ")} off every plate.`
                    : "No allergies set."}{" "}
                  {draft.goals.length > 0
                    ? "Suggestions will lean toward what you chose."
                    : "We will start with family-friendly pots."}
                </p>
                <div className="setup-summary__chips">
                  {draft.allergens.map((allergen) => (
                    <span key={allergen} className="chip chip--danger">
                      No {allergen}
                    </span>
                  ))}
                  {draft.goals.slice(0, 3).map((goal) => (
                    <span key={goal} className="chip">
                      {goalOptions.find((option) => option.key === goal)?.label}
                    </span>
                  ))}
                  {draft.pantry.length > 0 && (
                    <span className="chip chip--pantry">{draft.pantry.length} pantry items</span>
                  )}
                </div>
              </div>

              <button type="button" className="sample-link" onClick={useSample}>
                Or look around with a sample table first
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          <div className="setup-actions">
            {step === 0 ? (
              <Link to={editing ? "/today" : "/"} className="button button--plain">
                <ArrowLeft size={16} /> {editing ? "Cancel" : "Back home"}
              </Link>
            ) : (
              <button
                type="button"
                className="button button--plain"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                type="button"
                className="button button--clay"
                onClick={() => canContinue && setStep((value) => value + 1)}
                disabled={!canContinue}
              >
                Continue <ArrowRight size={17} />
              </button>
            ) : (
              <button type="button" className="button button--clay" onClick={finish}>
                {editing ? "Save my table" : "Open my table"}
                <ArrowRight size={17} />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
