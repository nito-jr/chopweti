import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Globe2,
  Lock,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  ShoppingBasket,
  Trash2,
  X,
} from "lucide-react";
import { AppHeader, AppTabBar } from "../components/Header";
import {
  conditionLabels,
  goalOptions,
  pantryOptions,
} from "../data";
import { useStore } from "../store";
import { findDish, getTableSize, locationLabel } from "../lib/recommend";
import { pepperColor, pepperLabel } from "../lib/pepper";
import { cn } from "../lib/cn";

export function TablePage() {
  const { profile, saveProfile, clearProfile, shopping, showToast } = useStore();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);

  if (!profile) {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main shell empty-state">
          <p className="eyebrow">Your table</p>
          <h1>No table set yet.</h1>
          <p>Set your household once and every pot on ChopWeti fits it better.</p>
          <Link className="button button--clay" to="/setup">
            Set my table <ArrowRight size={16} />
          </Link>
        </main>
        <AppTabBar />
      </div>
    );
  }

  const tableSize = getTableSize(profile);
  const activeDish = shopping ? findDish(shopping.dishId) : undefined;
  const togglePantry = (key: string) => {
    const has = profile.pantry.includes(key);
    saveProfile({
      ...profile,
      pantry: has
        ? profile.pantry.filter((item) => item !== key)
        : [...profile.pantry, key],
    });
    showToast(has ? "Removed from your pantry." : "Added to your pantry.");
  };

  const clearEverything = () => {
    clearProfile();
    setConfirmClear(false);
    navigate("/");
  };

  return (
    <div className="app-shell table-page">
      <AppHeader />
      <main className="app-main shell">
        <header className="table-head">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Your table
            </p>
            <h1>
              {profile.tableName}
              <em>.</em>
            </h1>
            <p>
              {tableSize} {tableSize === 1 ? "person" : "people"} ·{" "}
              {locationLabel(profile)} · set {new Date(profile.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <Link className="button button--ink" to="/setup">
            <Pencil size={15} /> Edit my table
          </Link>
        </header>

        <div className="table-page-grid">
          <div className="table-page-main">
            <section className="settings-card">
              <div className="settings-card__head">
                <div>
                  <span className="mini-label">Who is eating</span>
                  <h2>Household</h2>
                </div>
                <Link to="/setup" className="settings-edit">
                  Edit <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="household-row">
                <div className="household-figures">
                  <div>
                    <strong>{profile.adults}</strong>
                    <span>adults</span>
                  </div>
                  <div>
                    <strong>{profile.children}</strong>
                    <span>children</span>
                  </div>
                  <div>
                    <strong>{tableSize}</strong>
                    <span>at the table</span>
                  </div>
                </div>
                <div className="household-place">
                  {profile.locationMode === "elsewhere" ? (
                    <Globe2 size={15} />
                  ) : (
                    <MapPin size={15} />
                  )}
                  <div>
                    <strong>{locationLabel(profile)}</strong>
                    <span>
                      {profile.locationMode === "elsewhere"
                        ? "Recipes and lists only"
                        : "Vendors checked nearby"}
                    </span>
                  </div>
                  {profile.locationMode === "bamenda" ? (
                    <Link to="/vendors">
                      Browse <ArrowUpRight size={12} />
                    </Link>
                  ) : (
                    <span className="household-place__note">Bamenda only</span>
                  )}
                </div>
              </div>
              <div className="household-people" aria-hidden="true">
                {Array.from({ length: tableSize }).map((_, index) => (
                  <span key={index} className={index < profile.adults ? "is-adult" : "is-child"}>
                    {index < profile.adults ? "A" : "C"}
                  </span>
                ))}
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card__head">
                <div>
                  <span className="mini-label">The non-negotiables</span>
                  <h2>Hard lines</h2>
                </div>
                <Link to="/setup" className="settings-edit">
                  Edit <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="settings-block">
                <span className="settings-label">
                  <ShieldCheck size={14} /> Allergies — removed, never suggested
                </span>
                <div className="chip-row">
                  {profile.allergens.length > 0 ? (
                    profile.allergens.map((allergen) => (
                      <span key={allergen} className="chip chip--danger">
                        No {allergen}
                      </span>
                    ))
                  ) : (
                    <span className="settings-empty">No allergies set on this table.</span>
                  )}
                </div>
              </div>
              <div className="settings-block">
                <span className="settings-label">Dislikes — moved down the list</span>
                <div className="chip-row">
                  {profile.dislikes.length > 0 ? (
                    profile.dislikes.map((item) => (
                      <span key={item} className="chip">
                        {item}
                        <Check size={11} />
                      </span>
                    ))
                  ) : (
                    <span className="settings-empty">Nothing the table refuses.</span>
                  )}
                </div>
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card__head">
                <div>
                  <span className="mini-label">How dinner should work</span>
                  <h2>Goals & cautions</h2>
                </div>
                <Link to="/setup" className="settings-edit">
                  Edit <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="goal-summary">
                {profile.goals.map((goal) => {
                  const info = goalOptions.find((option) => option.key === goal);
                  return (
                    <div key={goal}>
                      <Check size={14} />
                      <span>
                        <strong>{info?.label}</strong>
                        <small>{info?.hint}</small>
                      </span>
                    </div>
                  );
                })}
              </div>
              {profile.conditions.length > 0 && (
                <div className="settings-block settings-block--caution">
                  <span className="settings-label">Cautions shown on recipes</span>
                  <div className="chip-row">
                    {profile.conditions.map((condition) => (
                      <span key={condition} className="chip chip--caution">
                        {conditionLabels[condition]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="settings-block">
                <span className="settings-label">Pepper intensity</span>
                <div className="table-pepper">
                  <span
                    className="table-pepper__bar"
                    style={{
                      background: `linear-gradient(90deg, #2b6cb5, #d58f2f, ${pepperColor(
                        profile.pepper,
                      )})`,
                    }}
                  >
                    <span
                      className="table-pepper__thumb"
                      style={{ left: `${profile.pepper}%`, background: pepperColor(profile.pepper) }}
                    />
                  </span>
                  <strong style={{ color: pepperColor(profile.pepper) }}>
                    {pepperLabel(profile.pepper)}
                  </strong>
                  <small>{profile.pepper}%</small>
                </div>
              </div>
            </section>

            <section className="settings-card">
              <div className="settings-card__head">
                <div>
                  <span className="mini-label">Tap to update</span>
                  <h2>Your pantry</h2>
                </div>
                <span className="settings-count">{profile.pantry.length} items</span>
              </div>
              <p className="settings-intro">
                What you have now changes which pots rise to the top. There is no
                wrong pantry.
              </p>
              <div className="pantry-editor">
                {pantryOptions.map((option) => {
                  const selected = profile.pantry.includes(option.key);
                  return (
                    <button
                      type="button"
                      key={option.key}
                      className={cn("pantry-toggle", selected && "is-selected")}
                      onClick={() => togglePantry(option.key)}
                      aria-pressed={selected}
                    >
                      {selected ? <Check size={13} /> : <Plus size={13} />}
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="table-page-aside">
            <div className="table-aside-card">
              <span className="mini-label">Your current list</span>
              {shopping ? (
                <>
                  <h3>{activeDish?.name ?? "Saved shopping list"}</h3>
                  <p>
                    For {shopping.servings} · {shopping.checked.length} items
                    collected
                  </p>
                  <Link className="button button--ink button--small button--wide" to="/list">
                    <ShoppingBasket size={15} /> Open shopping list
                  </Link>
                </>
              ) : (
                <>
                  <h3>No list yet.</h3>
                  <p>Pick a pot and we’ll build the list around it.</p>
                  <Link className="button button--plain button--small button--wide" to="/dishes">
                    Find a dish <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>

            <div className="table-aside-card table-aside-card--privacy">
              <span className="table-aside-card__icon">
                <Lock size={17} />
              </span>
              <h3>Private by default.</h3>
              <p>
                Your table is stored on this device only. No account, no email,
                no profile sold to anyone. Clearing the table removes it here.
              </p>
              <div className="privacy-list">
                <span>
                  <Check size={12} /> No login
                </span>
                <span>
                  <Check size={12} /> No tracking pixels
                </span>
                <span>
                  <Check size={12} /> No email required
                </span>
              </div>
            </div>

            <div className="table-aside-card">
              <span className="mini-label">A little help</span>
              <h3>Something not right?</h3>
              <p>
                If a recipe, price or vendor looks wrong, tell us. A person reads
                it.
              </p>
              <a className="text-link text-link--dark" href="mailto:hello@chopweti.app">
                hello@chopweti.app <ArrowUpRight size={12} />
              </a>
            </div>

            <button
              type="button"
              className="danger-zone"
              onClick={() => setConfirmClear(true)}
            >
              <Trash2 size={15} />
              Clear my table and data
            </button>
          </aside>
        </div>
      </main>
      <AppTabBar />

      {confirmClear && (
        <div className="modal-overlay" role="presentation" onClick={() => setConfirmClear(false)}>
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setConfirmClear(false)}
              aria-label="Close"
            >
              <X size={17} />
            </button>
            <span className="confirm-modal__icon">
              <Trash2 size={21} />
            </span>
            <h2 id="clear-title">Clear this table?</h2>
            <p>
              This removes your household, allergies, goals, pantry and shopping
              list from this device. It cannot be undone.
            </p>
            <div className="confirm-modal__actions">
              <button
                type="button"
                className="button button--plain"
                onClick={() => setConfirmClear(false)}
              >
                Keep my table
              </button>
              <button type="button" className="button button--danger" onClick={clearEverything}>
                Yes, clear everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
