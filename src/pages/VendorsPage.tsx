import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock,
  Globe2,
  MapPin,
  ShieldCheck,
  Star,
  Store,
  Users,
  X,
} from "lucide-react";
import { AppHeader, AppTabBar } from "../components/Header";
import { dishes, neighborhoods, vendors, type Vendor } from "../data";
import { useStore } from "../store";
import { cn } from "../lib/cn";

export function VendorsPage() {
  const { profile } = useStore();
  const [place, setPlace] = useState("All");
  const [selected, setSelected] = useState<Vendor | null>(null);

  const filtered = useMemo(
    () => vendors.filter((vendor) => place === "All" || vendor.neighborhood === place),
    [place],
  );
  const featured = vendors[0];

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [selected]);

  if (profile?.locationMode === "elsewhere") {
    return (
      <div className="app-shell">
        <AppHeader />
        <main className="app-main shell">
          <div className="bamenda-only">
            <span className="bamenda-only__icon">
              <Globe2 size={30} />
            </span>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Bamenda service
            </p>
            <h1>
              The vendors are
              <em> on the ground in Bamenda.</em>
            </h1>
            <p>
              Prepared ingredients and vendor pickup are only available in Bamenda for
              now. Your recipes, household suggestions and shopping lists still work
              anywhere — prices are shown as Bamenda market estimates.
            </p>
            <div className="bamenda-only__actions">
              <Link className="button button--clay" to="/today">
                Back to my table <ArrowRight size={16} />
              </Link>
              <Link className="text-link text-link--dark" to="/trust">
                How the field network works <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </main>
        <AppTabBar />
      </div>
    );
  }

  return (
    <div className="app-shell vendors-page">
      <AppHeader />
      <main className="app-main shell">
        <header className="vendors-head">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Verified people, not listings
            </p>
            <h1>
              The hands behind
              <em> the hard part.</em>
            </h1>
            <p>
              Pounding, cleaning, cutting, grinding. These are real people in
              Bamenda and the towns around it who do the slow work well.
            </p>
          </div>
          <div className="vendors-head__stats">
            <div>
              <strong>10</strong>
              <span>verified vendors</span>
            </div>
            <div>
              <strong>9</strong>
              <span>neighbourhoods</span>
            </div>
            <div>
              <strong>12 Oct</strong>
              <span>last field check</span>
            </div>
          </div>
        </header>

        <section className="vendor-spotlight">
          <div className="vendor-spotlight__photo">
            <img src={featured.image} alt={featured.name} />
            <span className="vendor-spotlight__label">Vendor spotlight</span>
          </div>
          <div className="vendor-spotlight__body">
            <div className="vendor-spotlight__top">
              <span className="verified-badge">
                <ShieldCheck size={13} /> Verified 12 Oct 2026
              </span>
              <span className="rating">
                <Star size={13} fill="currentColor" /> {featured.rating}
                <small>({featured.reviews})</small>
              </span>
            </div>
            <p className="mini-label">Nkwen · Mile 4</p>
            <h2>{featured.name}</h2>
            <p>{featured.story}</p>
            <div className="vendor-spotlight__specialties">
              {featured.specialties.map((specialty) => (
                <span className="chip" key={specialty}>
                  {specialty}
                </span>
              ))}
            </div>
            <div className="vendor-spotlight__foot">
              <div>
                <span>
                  <Clock size={14} /> {featured.prepTime}
                </span>
                <span>
                  <MapPin size={14} /> {featured.pickup}
                </span>
              </div>
              <button
                type="button"
                className="button button--ink button--small"
                onClick={() => setSelected(featured)}
              >
                See the stall <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>

        <div className="vendor-filter-head">
          <div>
            <p className="mini-label">Browse by neighbourhood</p>
            <h2>Who is cooking near you?</h2>
          </div>
          {profile && (
            <span className="vendor-near-you">
              <MapPin size={14} /> You cook in {profile.neighborhood}
            </span>
          )}
        </div>

        <div className="vendor-places">
          <button
            type="button"
            className={cn("place-chip", place === "All" && "is-active")}
            onClick={() => setPlace("All")}
          >
            All places <span>{vendors.length}</span>
          </button>
          {neighborhoods.map((neighborhood) => {
            const count = vendors.filter(
              (vendor) => vendor.neighborhood === neighborhood.name,
            ).length;
            if (count === 0) return null;
            return (
              <button
                type="button"
                key={neighborhood.name}
                className={cn(
                  "place-chip",
                  place === neighborhood.name && "is-active",
                  profile?.neighborhood === neighborhood.name && "is-home",
                )}
                onClick={() => setPlace(neighborhood.name)}
              >
                {neighborhood.name}
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        <div className="vendor-grid">
          {filtered.map((vendor) => (
            <button
              type="button"
              className="vendor-card"
              key={vendor.id}
              onClick={() => setSelected(vendor)}
            >
              <div className="vendor-card__media">
                {vendor.image ? (
                  <img src={vendor.image} alt={vendor.name} loading="lazy" />
                ) : (
                  <div
                    className="vendor-card__initials"
                    style={{ background: vendor.color }}
                  >
                    <span>{vendor.initials}</span>
                    <small>{vendor.neighborhood}</small>
                  </div>
                )}
                <span className="vendor-card__badge">
                  <ShieldCheck size={12} /> Verified
                </span>
                <span className="vendor-card__rating">
                  <Star size={12} fill="currentColor" /> {vendor.rating}
                </span>
              </div>
              <div className="vendor-card__body">
                <p className="vendor-card__place">
                  <MapPin size={12} /> {vendor.neighborhood}
                </p>
                <h3>{vendor.name}</h3>
                <p className="vendor-card__specialties">
                  {vendor.specialties.slice(0, 2).join(" · ")}
                </p>
                <div className="vendor-card__foot">
                  <span>Checked {vendor.verified}</span>
                  <span className="vendor-card__open">
                    See stall <ArrowUpRight size={12} />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <section className="verification-band">
          <div className="verification-band__copy">
            <span className="mini-label">How a vendor gets here</span>
            <h2>Somebody visits. Then somebody checks.</h2>
            <p>
              A correspondent in the neighbourhood visits the stall, records what
              is sold and when. A regulator reviews the record. Only then does the
              vendor appear with a verification date.
            </p>
            <Link className="text-link text-link--light" to="/trust">
              Read the field process <ArrowRight size={14} />
            </Link>
          </div>
          <div className="verification-band__roles">
            <div>
              <span className="role-number">01</span>
              <Users size={20} />
              <strong>Correspondent visits</strong>
              <small>In person, in the neighbourhood</small>
            </div>
            <div>
              <span className="role-number">02</span>
              <ShieldCheck size={20} />
              <strong>Regulator checks</strong>
              <small>Dates, prices, what is actually sold</small>
            </div>
            <div>
              <span className="role-number">03</span>
              <CalendarDays size={20} />
              <strong>Date goes public</strong>
              <small>You always see the last check</small>
            </div>
          </div>
        </section>

        <section className="vendor-join">
          <div>
            <span className="mini-label">Do the hard part well?</span>
            <h2>Put your stall on the map.</h2>
            <p>
              Vendors keep their own prices and their own business. We confirm
              what you prepare and send neighbours who need it.
            </p>
          </div>
          <a
            className="button button--clay"
            href="mailto:hello@chopweti.app?subject=I%20want%20to%20be%20a%20ChopWeti%20vendor"
          >
            <Store size={16} /> Talk to us about your stall
          </a>
        </section>
      </main>
      <AppTabBar />

      {selected && <VendorModal vendor={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function VendorModal({ vendor, onClose }: { vendor: Vendor; onClose: () => void }) {
  const prepared = dishes.flatMap((dish) =>
    dish.ingredients
      .filter((ingredient) => ingredient.ready?.vendorId === vendor.id)
      .map((ingredient) => ({ dish, ingredient })),
  );

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="vendor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vendor-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close vendor details">
          <X size={18} />
        </button>
        <div
          className="vendor-modal__hero"
          style={!vendor.image ? { background: vendor.color } : undefined}
        >
          {vendor.image ? (
            <img src={vendor.image} alt="" />
          ) : (
            <div className="vendor-modal__initials">{vendor.initials}</div>
          )}
          <div className="vendor-modal__hero-shade" />
          <div className="vendor-modal__hero-copy">
            <span className="verified-badge">
              <ShieldCheck size={12} /> Verified {vendor.verified}
            </span>
            <h2 id="vendor-modal-title">{vendor.name}</h2>
            <p>
              <MapPin size={13} /> {vendor.neighborhood} · {vendor.pickup}
            </p>
          </div>
        </div>
        <div className="vendor-modal__body">
          <div className="vendor-modal__stats">
            <div>
              <Star size={15} fill="currentColor" />
              <strong>{vendor.rating}</strong>
              <span>{vendor.reviews} reviews</span>
            </div>
            <div>
              <Clock size={15} />
              <strong>{vendor.prepTime}</strong>
              <span>preparation</span>
            </div>
            <div>
              <ShieldCheck size={15} />
              <strong>{vendor.correspondent}</strong>
              <span>last field check</span>
            </div>
          </div>
          <p className="vendor-modal__story">{vendor.story}</p>
          <div className="vendor-modal__specialties">
            {vendor.specialties.map((specialty) => (
              <span className="chip" key={specialty}>
                <Check size={11} /> {specialty}
              </span>
            ))}
          </div>

          <div className="vendor-modal__prepared">
            <div className="app-section-head">
              <div>
                <p className="mini-label">What they prepare</p>
                <h3>On these recipes</h3>
              </div>
            </div>
            {prepared.length > 0 ? (
              prepared.map(({ dish, ingredient }) => (
                <Link
                  to={`/recipe/${dish.id}`}
                  key={`${dish.id}-${ingredient.id}`}
                  className="prepared-row"
                  onClick={onClose}
                >
                  <img src={dish.image} alt="" />
                  <span>
                    <small>{dish.name}</small>
                    <strong>{ingredient.ready?.label}</strong>
                  </span>
                  <ArrowUpRight size={14} />
                </Link>
              ))
            ) : (
              <p className="vendor-modal__empty">
                This vendor’s prepared items are being added to recipes. Ask them
                directly at the stall.
              </p>
            )}
          </div>

          <div className="vendor-modal__note">
            <strong>{vendor.priceNote}.</strong> ChopWeti does not take a cut of
            the vendor’s price. Confirm the total at pickup.
          </div>

          <a
            className="button button--clay button--wide"
            href={`mailto:hello@chopweti.app?subject=Order%20from%20${encodeURIComponent(vendor.name)}`}
          >
            Ask ChopWeti to connect you <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}
