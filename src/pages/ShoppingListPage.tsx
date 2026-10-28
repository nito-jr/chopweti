import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Globe2,
  MapPin,
  Minus,
  Plus,
  Printer,
  Share2,
  ShieldCheck,
  ShoppingBasket,
  Sparkles,
  Trash2,
} from "lucide-react";
import { AppHeader, AppTabBar } from "../components/Header";
import { formatFCFA, formatQty } from "../data";
import { useStore } from "../store";
import {
  findDish,
  findVendor,
  getDishCost,
  getIngredientPrice,
} from "../lib/recommend";
import { cn } from "../lib/cn";

export function ShoppingListPage() {
  const { profile, shopping, saveShopping, toggleChecked, clearShopping, showToast } = useStore();
  const dish = shopping ? findDish(shopping.dishId) : undefined;
  const isBamenda = profile?.locationMode !== "elsewhere";

  const rows = useMemo(() => {
    if (!shopping || !dish) return [];
    const scale = shopping.servings / dish.baseServings;
    return dish.ingredients.map((ingredient) => {
      const choice =
        isBamenda && ingredient.ready
          ? shopping.choices[ingredient.id] ?? "raw"
          : "raw";
      const vendor = ingredient.ready && choice === "ready"
        ? findVendor(ingredient.ready.vendorId)
        : undefined;
      return {
        ingredient,
        choice,
        vendor,
        quantity: formatQty(ingredient.qty * scale, ingredient.unit),
        price: getIngredientPrice(dish, ingredient.id, choice) * scale,
      };
    });
  }, [dish, shopping, isBamenda]);

  if (!shopping || !dish) {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main shell">
          <div className="empty-list">
            <div className="empty-list__art">
              <ShoppingBasket size={34} strokeWidth={1.4} />
              <span>0</span>
            </div>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Nothing on the list yet
            </p>
            <h1>
              Pick a pot.
              <em> We will do the list.</em>
            </h1>
            <p>
              Open any recipe, choose what to buy raw and what a neighbour should
              prepare, then build your list in one tap.
            </p>
            <Link className="button button--clay" to="/dishes">
              Find a dish <ArrowRight size={17} />
            </Link>
          </div>
        </main>
        <AppTabBar />
      </div>
    );
  }

  const total = getDishCost(
    dish,
    shopping.servings,
    isBamenda
      ? shopping.choices
      : Object.fromEntries(
          Object.keys(shopping.choices).map((ingredientId) => [
            ingredientId,
            "raw" as const,
          ]),
        ),
  );
  const checkedCount = shopping.checked.filter((id) =>
    dish.ingredients.some((ingredient) => ingredient.id === id),
  ).length;
  const progress = Math.round((checkedCount / rows.length) * 100);
  const readyRows = rows.filter((row) => row.choice === "ready" && row.vendor);
  const rawRows = rows.filter((row) => row.choice === "raw");
  const readyGroups = Array.from(
    readyRows.reduce((groups, row) => {
      const key = row.vendor?.id ?? "ready";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
      return groups;
    }, new Map<string, typeof rows>()),
  );

  const copyList = async () => {
    const lines = [
      `ChopWeti — ${dish.name} for ${shopping.servings}`,
      "",
      "BUY RAW",
      ...rawRows.map(
        (row) => `• ${row.ingredient.name} — ${row.quantity}${row.ingredient.note ? ` (${row.ingredient.note})` : ""}`,
      ),
      ...readyGroups.flatMap(([vendorId, group]) => {
        const vendor = findVendor(vendorId);
        return [
          "",
          `BUY READY — ${vendor?.name ?? "Vendor"}${vendor ? `, ${vendor.neighborhood}` : ""}`,
          ...group.map(
            (row) => `• ${row.ingredient.ready?.label ?? row.ingredient.name} — ${row.quantity}`,
          ),
        ];
      }),
      "",
      `Total: ${formatFCFA(total)}`,
      shopping.note ? `Note: ${shopping.note}` : "",
    ].filter((line) => line !== null);

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      showToast("List copied. Send it to the vendor or keep it for the market.");
    } catch {
      showToast("Could not copy on this browser. You can print the list instead.");
    }
  };

  const shareList = () => {
    const text = [
      `ChopWeti: ${dish.name} for ${shopping.servings}`,
      `Total: ${formatFCFA(total)}`,
      ...rawRows.map((row) => `• ${row.ingredient.name} — ${row.quantity}`),
      ...readyRows.map(
        (row) => `• ${row.ingredient.ready?.label ?? row.ingredient.name} — ${row.vendor?.shortName}`,
      ),
    ].join("\n");
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const updateServings = (next: number) =>
    saveShopping({ ...shopping, servings: Math.min(12, Math.max(1, next)) });

  return (
    <div className="app-shell shopping-page">
      <AppHeader />
      <main className="app-main shell">
        <div className="list-head">
          <div>
            <Link to={`/recipe/${dish.id}`} className="back-link">
              <ArrowLeft size={14} /> Back to the recipe
            </Link>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Your shopping list
            </p>
            <h1>
              Everything for
              <em> {dish.name}.</em>
            </h1>
            <p>
              Built for {shopping.servings} {shopping.servings === 1 ? "person" : "people"}.
              Nothing extra, nothing forgotten.
            </p>
          </div>
          <div className="list-head__actions">
            <button type="button" className="icon-text-button" onClick={copyList}>
              <Copy size={15} /> Copy list
            </button>
            <button type="button" className="icon-text-button" onClick={() => window.print()}>
              <Printer size={15} /> Print
            </button>
            <button
              type="button"
              className="icon-text-button icon-text-button--danger"
              onClick={() => {
                clearShopping();
                showToast("List cleared.");
              }}
            >
              <Trash2 size={15} /> Clear
            </button>
          </div>
        </div>

        <div className="list-summary">
          <div className="list-summary__total">
            <span className="mini-label">Estimated total</span>
            <strong>{formatFCFA(total)}</strong>
            <span>{formatFCFA(total / shopping.servings)} per person</span>
          </div>
          <div className="list-summary__middle">
            <div className="serving-stepper serving-stepper--list">
              <button
                type="button"
                aria-label="One fewer serving"
                onClick={() => updateServings(shopping.servings - 1)}
                disabled={shopping.servings <= 1}
              >
                <Minus size={15} />
              </button>
              <span>
                <strong>{shopping.servings}</strong> eating
              </span>
              <button
                type="button"
                aria-label="One more serving"
                onClick={() => updateServings(shopping.servings + 1)}
                disabled={shopping.servings >= 12}
              >
                <Plus size={15} />
              </button>
            </div>
            <div className="list-progress">
              <span>
                {checkedCount} of {rows.length} picked up
              </span>
              <div className="list-progress__track">
                <span style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
          <div className="list-summary__actions">
            <button type="button" className="button button--ink button--small" onClick={shareList}>
              <Share2 size={15} /> Send on WhatsApp
            </button>
            <span>
              <ShieldCheck size={13} /> Prices are estimates, confirmed by the vendor
            </span>
          </div>
        </div>

        {!isBamenda && (
          <div className="global-note global-note--list">
            <Globe2 size={15} />
            <p>
              This is a local shopping list. Prepared ingredients and vendor pickup
              are hidden outside Bamenda; FCFA prices are estimates from the Bamenda
              market.
            </p>
          </div>
        )}

        <div className="list-layout">
          <div className="list-groups">
            <section className="list-group">
              <div className="list-group__head">
                <div>
                  <span className="list-group__icon">
                    <ShoppingBasket size={18} />
                  </span>
                  <div>
                    <h2>Buy raw</h2>
                    <p>
                      {rawRows.length} {rawRows.length === 1 ? "item" : "items"} · for{" "}
                      {shopping.servings} {shopping.servings === 1 ? "person" : "people"}
                    </p>
                  </div>
                </div>
                <span className="list-group__total">
                  {formatFCFA(rawRows.reduce((sum, row) => sum + row.price, 0))}
                </span>
              </div>
              <div className="market-note">
                {isBamenda ? <MapPin size={14} /> : <Globe2 size={14} />}
                <span>
                  {isBamenda
                    ? `Best found at ${
                        dish.id === "ndole" || dish.id === "eru" ? "Mankon or Nkwen" : "Nkwen"
                      } market. Prices verified 12 Oct 2026.`
                    : "Shop locally. Prices shown are a reference from the Bamenda market, not a local quote."}
                </span>
              </div>
              <div className="list-items">
                {rawRows.map((row) => (
                  <ListItem
                    key={row.ingredient.id}
                    name={row.ingredient.name}
                    quantity={row.quantity}
                    note={row.ingredient.note}
                    price={row.price}
                    checked={shopping.checked.includes(row.ingredient.id)}
                    onToggle={() => toggleChecked(row.ingredient.id)}
                  />
                ))}
              </div>
            </section>

            {readyGroups.map(([vendorId, group]) => {
              const vendor = findVendor(vendorId);
              return (
                <section className="list-group list-group--vendor" key={vendorId}>
                  <div className="list-group__head">
                    <div>
                      <span
                        className="list-group__icon list-group__icon--vendor"
                        style={{ background: vendor?.color ?? "#3f5c42" }}
                      >
                        {vendor?.initials ?? "VN"}
                      </span>
                      <div>
                        <h2>{vendor?.name ?? "Prepared nearby"}</h2>
                        <p>
                          {vendor?.neighborhood} · verified {vendor?.verified} ·{" "}
                          {group.length} item{group.length === 1 ? "" : "s"}
                        </p>
                      </div>
                    </div>
                    <span className="list-group__total">
                      {formatFCFA(group.reduce((sum, row) => sum + row.price, 0))}
                    </span>
                  </div>
                  <div className="vendor-order-note">
                    <Sparkles size={14} />
                    <span>
                      {vendor?.prepTime} · Pick up at {vendor?.pickup}.
                      <Link to="/vendors">
                        View vendor <ArrowUpRight size={12} />
                      </Link>
                    </span>
                  </div>
                  <div className="list-items">
                    {group.map((row) => (
                      <ListItem
                        key={row.ingredient.id}
                        name={row.ingredient.ready?.label ?? row.ingredient.name}
                        quantity={row.quantity}
                        note={row.ingredient.ready?.note}
                        price={row.price}
                        checked={shopping.checked.includes(row.ingredient.id)}
                        onToggle={() => toggleChecked(row.ingredient.id)}
                        prepared
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="list-aside">
            <div className="list-aside__card">
              <span className="mini-label">For the vendor</span>
              <h3>A note, if you need one</h3>
              <textarea
                value={shopping.note}
                onChange={(event) => saveShopping({ ...shopping, note: event.target.value })}
                placeholder="e.g. Please pound it smooth, I will collect by 5pm."
                rows={4}
                maxLength={240}
              />
              <span className="textarea-count">{shopping.note.length}/240</span>
              <button type="button" className="button button--plain button--wide" onClick={copyList}>
                <Copy size={15} /> Copy the full list
              </button>
            </div>

            <div className="list-aside__card list-aside__budget">
              <span className="mini-label">Where it goes</span>
              {[
                ["Raw ingredients", rawRows.reduce((sum, row) => sum + row.price, 0)],
                ...[...readyGroups].map(([vendorId, group]) => [
                  findVendor(vendorId)?.shortName ?? "Prepared",
                  group.reduce((sum, row) => sum + row.price, 0),
                ] as [string, number]),
              ].map(([label, amount]) => (
                <div key={label as string}>
                  <span>{label}</span>
                  <strong>{formatFCFA(amount as number)}</strong>
                </div>
              ))}
              <div className="list-aside__budget-total">
                <span>Total</span>
                <strong>{formatFCFA(total)}</strong>
              </div>
            </div>

            <div className="list-aside__trust">
              <ShieldCheck size={19} />
              <p>
                <strong>Verified, not guessed.</strong> Every vendor on this list
                was checked in person. If something is wrong, tell us and we will
                re-check.
              </p>
            </div>

            <Link className="list-recipe-link" to={`/recipe/${dish.id}`}>
              <img src={dish.image} alt="" />
              <span>
                <small>Go back to cooking</small>
                <strong>{dish.name}</strong>
              </span>
              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      </main>
      <div className="list-mobile-bar">
        <div>
          <span>{checkedCount}/{rows.length} collected</span>
          <strong>{formatFCFA(total)}</strong>
        </div>
        <button type="button" className="button button--ink button--small" onClick={shareList}>
          <Share2 size={15} /> Send list
        </button>
      </div>
      <AppTabBar />
    </div>
  );
}

function ListItem({
  name,
  quantity,
  note,
  price,
  checked,
  onToggle,
  prepared = false,
}: {
  name: string;
  quantity: string;
  note?: string;
  price: number;
  checked: boolean;
  onToggle: () => void;
  prepared?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn("list-item", checked && "is-checked")}
      onClick={onToggle}
      aria-pressed={checked}
    >
      <span className="list-item__check">
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span className="list-item__name">
        <strong>{name}</strong>
        <small>
          {quantity}
          {note ? ` · ${note}` : ""}
        </small>
      </span>
      {prepared && <span className="list-item__prepared">Prepared</span>}
      <span className="list-item__price">{formatFCFA(price)}</span>
    </button>
  );
}
