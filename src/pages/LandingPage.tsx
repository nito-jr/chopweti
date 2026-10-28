import { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChefHat,
  Clock,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { SiteHeader } from "../components/Header";
import { Footer } from "../components/Footer";
import { DishCard } from "../components/DishCard";
import { HealthIcon } from "../components/HealthPill";
import {
  dishes,
  formatFCFA,
  healthMeta,
  neighborhoods,
  type HealthTag,
} from "../data";
import { getDishCost } from "../lib/recommend";

const featuredIds = ["eru", "ndole", "achu", "kati-kati"];
const featured = featuredIds
  .map((id) => dishes.find((dish) => dish.id === id))
  .filter((dish) => Boolean(dish));
const heroDish = dishes.find((dish) => dish.id === "eru") ?? dishes[0];

const healthOrder: HealthTag[] = [
  "High Protein",
  "Rich Iron",
  "Energy Boost",
  "Balanced Fiber",
];

const neighbourhoodLine = neighborhoods.map((place) => place.name).join("  ·  ");

export function LandingPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (searchParams.get("to") === "idea") {
      const timer = window.setTimeout(() => {
        document.getElementById("idea")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [searchParams, location.key]);

  return (
    <div className="landing">
      <div className="top-strip">
        <div className="top-strip__track">
          <span>Fresh from the field — Nkwen market verified 12 Oct</span>
          <span className="top-strip__dot" />
          <span>{neighbourhoodLine}</span>
          <span className="top-strip__dot" />
          <span>Bamenda · Cameroon</span>
        </div>
      </div>
      <SiteHeader />

      <main>
        <section className="hero">
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow hero__eyebrow">
                <span className="eyebrow__dot" />
                A kitchen companion from Bamenda
              </p>
              <h1 className="hero__title">
                <span className="hero__question">
                  Chop <em>weti?</em>
                </span>
                <span className="hero__answer">
                  Let’s cook<span className="hero__period">.</span>
                </span>
              </h1>
              <p className="hero__lede">
                Tell us who’s eating, what’s in your pantry and what you can’t
                touch. We’ll put the right pot in front of you — with a recipe
                that actually walks you through it.
              </p>
              <div className="hero__actions">
                <Link className="button button--clay" to="/setup">
                  Set my table
                  <ArrowRight size={18} strokeWidth={2.2} />
                </Link>
                <Link className="text-link" to="/today?demo=1">
                  See a sample table
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="hero__proof">
                <div className="avatar-stack" aria-hidden="true">
                  <span style={{ background: "#36533b" }}>NM</span>
                  <span style={{ background: "#b8643e" }}>AK</span>
                  <span style={{ background: "#c99b39" }}>BK</span>
                  <span style={{ background: "#6d7c4f" }}>+</span>
                </div>
                <p>
                  <strong>Built for real households.</strong> One person, six
                  people, a peanut allergy, a son who lifts — the table changes,
                  the answer should too.
                </p>
              </div>
            </div>

            <div className="hero__visual">
              <div className="hero__image-frame">
                <img
                  src="/images/hero-eru.jpg"
                  alt="Eru and water fufu served on banana leaves in a wooden bowl"
                  fetchPriority="high"
                />
                <div className="hero__image-shade" />
              </div>

              <div className="hero__suggestion">
                <div className="hero__suggestion-top">
                  <span className="mini-label">Tonight’s suggestion</span>
                  <span className="live-dot">Fits your table</span>
                </div>
                <div className="hero__suggestion-title">
                  <div>
                    <h2>{heroDish.name}</h2>
                    <p>
                      {heroDish.health[1] ?? heroDish.health[0]} ·{" "}
                      {heroDish.ingredients.length} ingredients
                    </p>
                  </div>
                  <span className="hero__suggestion-price">
                    {formatFCFA(getDishCost(heroDish, 4))}
                  </span>
                </div>
                <div className="hero__suggestion-foot">
                  <span>
                    <Clock size={13} /> {heroDish.time} min
                  </span>
                  <span>
                    <Users size={13} /> 4 eating
                  </span>
                  <span className="safe-note">
                    <ShieldCheck size={13} /> Peanut-free
                  </span>
                </div>
              </div>

              <div className="hero__verified">
                <ShieldCheck size={15} />
                <span>
                  Field-checked in Nkwen
                  <small>12 Oct 2026</small>
                </span>
              </div>

              <div className="hero__stamp" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <defs>
                    <path
                      id="stampPath"
                      d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"
                    />
                  </defs>
                  <text>
                    <textPath href="#stampPath">
                      MADE FOR BAMENDA KITCHENS · COOK WITH CONFIDENCE ·
                    </textPath>
                  </text>
                  <g transform="translate(60 60)">
                    <circle r="22" />
                    <path
                      d="M-8 2h16c-.3 5-3.6 8-8 8s-7.7-3-8-8Zm3 9h10M-5-4c-1.2-1.6 1.1-2.2.2-3.8M0-4c-1.2-1.6 1.1-2.2.2-3.8M5-4c-1.2-1.6 1.1-2.2.2-3.8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                </svg>
              </div>

              <svg
                className="hero__scribble"
                viewBox="0 0 180 90"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 74C39 83 66 73 77 50c9-20-5-38-19-31-13 7-4 35 20 42 30 9 57-7 72-29"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="m144 39 7-8 6 10"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </section>

        <section className="proof-rail" aria-label="ChopWeti at a glance">
          <div className="shell proof-rail__inner">
            <div className="proof-rail__stat">
              <strong>9</strong>
              <span>neighbourhoods on the ground</span>
            </div>
            <div className="proof-rail__stat">
              <strong>10</strong>
              <span>verified local vendors</span>
            </div>
            <div className="proof-rail__stat">
              <strong>4</strong>
              <span>ways food works for you</span>
            </div>
            <div className="proof-rail__note">
              <Sparkles size={16} />
              <p>No foreign meal plans. No guesswork. Just your food, made clear.</p>
            </div>
          </div>
        </section>

        <section className="section idea" id="idea">
          <div className="shell">
            <div className="section-topline">
              <span className="section-number">01</span>
              <p className="section-kicker">The daily question</p>
              <span className="section-rule" />
            </div>

            <div className="idea__intro">
              <h2>
                We watched our mothers cook it a hundred times.
                <em> Then it was our turn.</em>
              </h2>
              <div className="idea__intro-copy">
                <p>
                  How much spice? When does the cocoyam go in? How do you know
                  the soup is right? Most food apps were built for another
                  kitchen, another pantry and another life.
                </p>
                <p>
                  ChopWeti is built for this one — the Bamenda kitchen, with its
                  markets, its dishes and its people.
                </p>
                <Link className="text-link text-link--dark" to="/trust">
                  Meet the people behind the food
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            <div className="idea__grid">
              <div className="idea__portrait">
                <img
                  src="/images/market-fruit.jpg"
                  alt="Fresh fruit and vegetables displayed at a market in Bamenda"
                  loading="lazy"
                />
                <div className="idea__portrait-overlay">
                  <p>“Food is identity. It should not feel out of reach.”</p>
                  <span>From the ChopWeti kitchen notes</span>
                </div>
                <span className="idea__photo-tag">
                  <MapPin size={12} /> Nkwen market
                </span>
              </div>

              <div className="idea__steps">
                <div className="idea-step">
                  <span className="idea-step__number">01</span>
                  <div>
                    <h3>It knows who is eating</h3>
                    <p>
                      Your household, your allergies, your dislikes, your goals.
                      A peanut allergy is not a preference — it is a hard line.
                    </p>
                  </div>
                  <Users size={22} strokeWidth={1.6} />
                </div>
                <div className="idea-step">
                  <span className="idea-step__number">02</span>
                  <div>
                    <h3>It starts with your pantry</h3>
                    <p>
                      Beans, plantain, a little palm oil, half a bag of rice.
                      Suggestions that use what you already have come first.
                    </p>
                  </div>
                  <ChefHat size={22} strokeWidth={1.6} />
                </div>
                <div className="idea-step">
                  <span className="idea-step__number">03</span>
                  <div>
                    <h3>It walks you through the pot</h3>
                    <p>
                      Numbered steps, what to look for, the mistake to avoid.
                      Written for someone who has never made it before.
                    </p>
                  </div>
                  <HeartHandshake size={22} strokeWidth={1.6} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section dishes-section">
          <div className="shell">
            <div className="section-topline">
              <span className="section-number">02</span>
              <p className="section-kicker">On the table</p>
              <span className="section-rule" />
              <Link className="section-link" to="/dishes">
                All dishes <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="dishes-section__head">
              <h2>
                Seven pots to start with.
                <em> More from the neighbourhood, soon.</em>
              </h2>
              <p>
                Achu, ndolé, eru, kati-kati, koki, beans and dodo, poulet DG.
                Every one scaled to your table and priced in FCFA.
              </p>
            </div>
            <div className="dish-grid">
              {featured.map((dish, index) =>
                dish ? (
                  <DishCard
                    key={dish.id}
                    dish={dish}
                    variant={index === 0 ? "wide" : "default"}
                    eager={index === 0}
                  />
                ) : null,
              )}
            </div>
            <div className="dishes-section__foot">
              <p>
                <ShieldCheck size={15} /> Allergens are filtered out, never
                suggested around.
              </p>
              <Link className="text-link text-link--dark" to="/dishes">
                Find something for tonight
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        <section className="recipe-feature">
          <div className="shell recipe-feature__grid">
            <div className="recipe-feature__copy">
              <div className="section-topline section-topline--light">
                <span className="section-number">03</span>
                <p className="section-kicker">The recipe is the heart</p>
                <span className="section-rule" />
              </div>
              <h2>
                A recipe that
                <em> walks beside you.</em>
              </h2>
              <p className="recipe-feature__lede">
                Not a list of ingredients and a prayer. Each dish is a guided
                walkthrough with short steps, a practical tip, and a way to tell
                when it is actually ready.
              </p>
              <ul className="check-list">
                <li>
                  <Check size={16} /> Ingredients scaled to your household
                </li>
                <li>
                  <Check size={16} /> Buy raw or buy it prepared by a neighbour
                </li>
                <li>
                  <Check size={16} /> Tips from cooks who have made it a hundred times
                </li>
                <li>
                  <Check size={16} /> Clear cautions for salt and sugar, never a surprise
                </li>
              </ul>
              <Link className="button button--cream" to="/recipe/eru">
                Step into a recipe
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="recipe-phone-wrap">
              <div className="recipe-phone">
                <div className="recipe-phone__top">
                  <span>9:41</span>
                  <span className="recipe-phone__island" />
                  <span>●●●</span>
                </div>
                <div className="recipe-phone__image">
                  <img src="/images/dishes/eru.jpg" alt="" loading="lazy" />
                  <div className="recipe-phone__back">←</div>
                  <span className="recipe-phone__live">Cooking now</span>
                </div>
                <div className="recipe-phone__body">
                  <p className="mini-label">Eru & water fufu · for 4</p>
                  <h3>Wilt the eru</h3>
                  <div className="recipe-phone__progress">
                    <span className="is-done" />
                    <span className="is-done" />
                    <span className="is-current" />
                    <span />
                    <span />
                    <span />
                  </div>
                  <p className="recipe-phone__stepmeta">Step 4 of 6 · 10 minutes</p>
                  <p className="recipe-phone__instruction">
                    Add the eru in three handfuls, stirring after each one. It
                    will look like too much at first — keep going. Add half a cup
                    of beef stock, cover, and cook on low heat.
                  </p>
                  <div className="recipe-phone__tip">
                    <span>Mama’s tip</span>
                    If the pot looks dry, add stock, not water. Water washes out
                    the taste you just built.
                  </div>
                  <div className="recipe-phone__actions">
                    <span>Previous</span>
                    <span className="recipe-phone__next">Next step →</span>
                  </div>
                </div>
              </div>
              <div className="float-chip float-chip--servings">
                <Users size={14} />
                <span>
                  Scaled for <strong>6 people</strong>
                </span>
              </div>
              <div className="float-chip float-chip--vendor">
                <span className="float-chip__avatar">MN</span>
                <span>
                  Buy ready: <strong>cleaned eru</strong>
                  <small>Mama Ngum · Nkwen</small>
                </span>
                <ShieldCheck size={14} />
              </div>
            </div>
          </div>
        </section>

        <section className="section health-section">
          <div className="shell">
            <div className="section-topline">
              <span className="section-number">04</span>
              <p className="section-kicker">Food that does something</p>
              <span className="section-rule" />
            </div>
            <div className="health-section__head">
              <h2>
                Eat for the life you actually live.
                <em> Not someone else’s.</em>
              </h2>
              <p>
                Local food is already full of good things: leafy greens,
                groundnuts, fish, plantains and tubers. We just make it easier to
                see what each pot gives you.
              </p>
            </div>

            <div className="health-section__grid">
              <div className="health-cards">
                {healthOrder.map((tag, index) => (
                  <div className="health-card" key={tag}>
                    <div className="health-card__icon">
                      <HealthIcon tag={tag} size={21} />
                    </div>
                    <span className="health-card__index">0{index + 1}</span>
                    <h3>{tag}</h3>
                    <p>{healthMeta[tag].description}</p>
                  </div>
                ))}
              </div>

              <div className="table-card">
                <div className="table-card__head">
                  <span className="mini-label">Your table, remembered</span>
                  <span className="table-card__count">
                    <Users size={14} /> 4 eating
                  </span>
                </div>
                <div className="table-card__people">
                  <span className="person person--one">A</span>
                  <span className="person person--two">N</span>
                  <span className="person person--three">J</span>
                  <span className="person person--four">+1</span>
                  <p>
                    Two adults, two children. Nkwen. A son who lifts, a mother
                    watching her salt.
                  </p>
                </div>
                <div className="table-card__rules">
                  <div>
                    <span className="rule-label">Hard lines</span>
                    <div className="chip-row">
                      <span className="chip chip--danger">
                        <ShieldCheck size={13} /> No peanuts
                      </span>
                      <span className="chip">No okra</span>
                    </div>
                  </div>
                  <div>
                    <span className="rule-label">What matters now</span>
                    <div className="chip-row">
                      <span className="chip">High protein</span>
                      <span className="chip">Family portions</span>
                      <span className="chip chip--caution">Lower salt</span>
                    </div>
                  </div>
                  <div>
                    <span className="rule-label">Already in the pantry</span>
                    <div className="chip-row">
                      <span className="chip chip--pantry">Beans</span>
                      <span className="chip chip--pantry">Plantain</span>
                      <span className="chip chip--pantry">Palm oil</span>
                      <span className="chip chip--pantry">Onions</span>
                    </div>
                  </div>
                </div>
                <div className="table-card__footer">
                  <span>
                    <Clock size={14} /> Tonight: 35 min · 2,800 FCFA
                  </span>
                  <Link to="/today?demo=1" className="text-link text-link--dark">
                    See the table <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
            <p className="health-disclaimer">
              ChopWeti offers food guidance, not medical advice. If you manage a
              condition, follow the plan you have agreed with your clinician.
            </p>
          </div>
        </section>

        <section className="section vendor-feature">
          <div className="shell">
            <div className="section-topline">
              <span className="section-number">05</span>
              <p className="section-kicker">A neighbour does the hard part</p>
              <span className="section-rule" />
            </div>
            <div className="vendor-feature__grid">
              <div className="vendor-feature__photo">
                <img
                  src="/images/vendor-greens.jpg"
                  alt="Women selling fresh greens and groundnuts at a roadside market in Cameroon"
                  loading="lazy"
                />
                <div className="vendor-feature__photo-card">
                  <div className="vendor-feature__avatar">MN</div>
                  <div>
                    <strong>Mama Ngum</strong>
                    <span>Nkwen · pounded cocoyam & cleaned eru</span>
                  </div>
                  <span className="verified-badge">
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>
                <span className="vendor-feature__caption">
                  Verified 12 Oct 2026 by Neba A.
                </span>
              </div>

              <div className="vendor-feature__copy">
                <h2>
                  Keep the cooking.
                  <em> Skip the pounding.</em>
                </h2>
                <p>
                  The slowest work is often the preparation: pounding fufu,
                  cleaning and cutting eru, grinding spices, preparing proteins.
                  On any recipe, choose what to buy raw and what to buy ready.
                  A real person nearby gets your business.
                </p>
                <div className="vendor-steps">
                  <div>
                    <span>01</span>
                    <p>
                      <strong>Choose by ingredient.</strong> Buy the cocoyam
                      ready-pounded, but cut the onions yourself.
                    </p>
                  </div>
                  <div>
                    <span>02</span>
                    <p>
                      <strong>See the real cost.</strong> The shopping list and
                      FCFA total update as you choose.
                    </p>
                  </div>
                  <div>
                    <span>03</span>
                    <p>
                      <strong>Pick up close by.</strong> Vendors are verified in
                      your own neighbourhood, with the date we last checked.
                    </p>
                  </div>
                </div>
                <div className="savings-card">
                  <div>
                    <span className="mini-label">Achu for four</span>
                    <p>
                      <s>6,500 FCFA</s> <strong>3,500 FCFA</strong> for ready-pounded
                      cocoyam
                    </p>
                  </div>
                  <span className="savings-card__time">
                    <Clock size={14} /> 25 min saved
                  </span>
                </div>
                <Link className="button button--ink" to="/vendors">
                  Meet the vendors
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section places-section">
          <div className="shell">
            <div className="section-topline">
              <span className="section-number">06</span>
              <p className="section-kicker">Rooted in real places</p>
              <span className="section-rule" />
            </div>
            <div className="places-section__grid">
              <div className="places-section__copy">
                <h2>
                  Trust is a person
                  <em> on the ground.</em>
                </h2>
                <p>
                  Correspondents in each neighbourhood report what they actually
                  see at market and which vendors operate there. Regulators check
                  their work. Admins keep the system running.
                </p>
                <p>
                  You see only what has been verified, with the date it was last
                  checked — so the information stays true as things change.
                </p>
                <Link className="text-link text-link--dark" to="/trust">
                  How verification works
                  <ArrowRight size={15} />
                </Link>
                <div className="role-row">
                  <div>
                    <span className="role-dot role-dot--green" />
                    <strong>Correspondents</strong>
                    <small>report from market</small>
                  </div>
                  <div>
                    <span className="role-dot role-dot--clay" />
                    <strong>Regulators</strong>
                    <small>check the reports</small>
                  </div>
                  <div>
                    <span className="role-dot role-dot--gold" />
                    <strong>Admins</strong>
                    <small>keep it running</small>
                  </div>
                </div>
              </div>

              <div className="places-section__map">
                <div className="place-map__top">
                  <span className="mini-label">Where we cook</span>
                  <span className="place-map__count">9 places · 10 vendors</span>
                </div>
                <div className="place-map__canvas">
                  <div className="map-grid" aria-hidden="true" />
                  <div className="map-ring map-ring--one" aria-hidden="true" />
                  <div className="map-ring map-ring--two" aria-hidden="true" />
                  <div className="map-pin map-pin--main">
                    <span className="map-pin__dot" />
                    <span className="map-pin__label">Bamenda Centre</span>
                  </div>
                  <div className="map-pin map-pin--nkwen">
                    <span className="map-pin__dot" />
                    <span className="map-pin__label">Nkwen</span>
                  </div>
                  <div className="map-pin map-pin--upstation">
                    <span className="map-pin__dot" />
                    <span className="map-pin__label">Upstation</span>
                  </div>
                  <div className="map-pin map-pin--bambili">
                    <span className="map-pin__dot" />
                    <span className="map-pin__label">Bambili</span>
                  </div>
                  <div className="map-pin map-pin--santa">
                    <span className="map-pin__dot" />
                    <span className="map-pin__label">Santa</span>
                  </div>
                  <span className="map-caption">North West Region · Cameroon</span>
                </div>
                <div className="place-map__list">
                  {neighborhoods.slice(0, 4).map((place) => (
                    <div key={place.name}>
                      <span>{place.name}</span>
                      <small>checked {place.lastVerified}</small>
                    </div>
                  ))}
                  <Link to="/trust">
                    All places <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta__grain" aria-hidden="true" />
          <div className="shell final-cta__inner">
            <p className="eyebrow eyebrow--light">
              <span className="eyebrow__dot" />
              Tuesday is a good day to try
            </p>
            <h2>
              Chop weti,
              <em> today?</em>
            </h2>
            <p className="final-cta__lede">
              Four minutes to set your table. A proper pot by dinner.
            </p>
            <div className="final-cta__actions">
              <Link className="button button--ink" to="/setup">
                Set my table
                <ArrowRight size={18} />
              </Link>
              <Link className="button button--ghost-light" to="/dishes">
                Browse the dishes
              </Link>
            </div>
            <div className="final-cta__trust">
              <span>
                <ShieldCheck size={15} /> Allergies respected absolutely
              </span>
              <span>
                <MapPin size={15} /> Built for Bamenda
              </span>
              <span>
                <Star size={15} /> No account needed
              </span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
