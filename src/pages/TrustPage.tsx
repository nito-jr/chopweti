import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ClipboardCheck,
  Eye,
  MapPin,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { AppHeader, AppTabBar } from "../components/Header";
import { neighborhoods, vendors } from "../data";

const notes = [
  {
    id: "042",
    place: "Nkwen",
    person: "Neba A.",
    date: "12 Oct 2026",
    text:
      "Nkwen market had good cocoyam this week, but the price moved up by 200 FCFA a heap. Mama Ngum is pounding from 6am.",
    tag: "Price change",
  },
  {
    id: "041",
    place: "Mankon",
    person: "Ndzana R.",
    date: "11 Oct 2026",
    text:
      "Aunty Juliana’s ndolé is washed six times now, not four. She says the leaf came in bitter this week and she is taking longer with it.",
    tag: "Quality note",
  },
  {
    id: "040",
    place: "Bambili",
    person: "Nfor E.",
    date: "08 Oct 2026",
    text:
      "Student kitchen added a 1,500 FCFA family portion of fufu. They are open until 8pm on weekdays now, not 6pm.",
    tag: "Update",
  },
];

const roles = [
  {
    icon: UserRound,
    title: "Correspondents",
    subtitle: "Eyes in the neighbourhood",
    body:
      "A correspondent visits stalls, records what is actually sold, notes prices and takes a photo. They live or work in the area they cover.",
    color: "#3f5c42",
  },
  {
    icon: ClipboardCheck,
    title: "Regulators",
    subtitle: "The second pair of eyes",
    body:
      "A regulator reviews the correspondent’s record against the vendor’s details. They can reject a submission, ask for a re-visit, or pause a vendor.",
    color: "#b8643e",
  },
  {
    icon: ShieldCheck,
    title: "Admins",
    subtitle: "Keeping the system honest",
    body:
      "Admins manage access, resolve disputes and publish the verification date. No vendor can pay to skip a check or hide a failed one.",
    color: "#b28a2e",
  },
];

export function TrustPage() {
  return (
    <div className="app-shell trust-page">
      <AppHeader />
      <main className="app-main shell">
        <header className="trust-head">
          <div className="trust-head__copy">
            <p className="eyebrow">
              <span className="eyebrow__dot" />
              Our places, and how we know
            </p>
            <h1>
              Trust is a person
              <em> on the ground.</em>
            </h1>
            <p>
              A badge is easy to draw. A date is easy to fake. What is hard is
              having someone in Nkwen who actually walked to the stall, saw what
              was there and put their name to it.
            </p>
            <div className="trust-head__actions">
              <a className="button button--clay" href="mailto:hello@chopweti.app?subject=I%20want%20to%20be%20a%20correspondent">
                Become a correspondent <ArrowRight size={16} />
              </a>
              <Link className="text-link text-link--dark" to="/vendors">
                See verified vendors <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
          <div className="trust-head__media">
            <img
              src="/images/market-bamenda.jpg"
              alt="Commercial Avenue in Bamenda"
            />
            <div className="trust-head__media-card">
              <span className="mini-label">Last network check</span>
              <strong>12 October 2026</strong>
              <span>9 places · 10 vendors · 3 correspondents</span>
            </div>
            <span className="trust-head__media-tag">
              <MapPin size={12} /> Commercial Avenue, Bamenda
            </span>
          </div>
        </header>

        <section className="trust-network">
          <div className="section-topline section-topline--small">
            <span className="section-number">01</span>
            <p className="section-kicker">The field network</p>
            <span className="section-rule" />
          </div>
          <div className="trust-network__head">
            <h2>
              Three people stand between
              <em> a stall and your plate.</em>
            </h2>
            <p>
              Verification is not a one-time badge. It is a chain with names,
              dates and the possibility of being wrong — which is why it gets
              checked again.
            </p>
          </div>
          <div className="roles-grid">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <div className="role-card" key={role.title}>
                  <span className="role-card__icon" style={{ background: role.color }}>
                    <Icon size={20} />
                  </span>
                  <p className="mini-label">{role.subtitle}</p>
                  <h3>{role.title}</h3>
                  <p>{role.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="trust-process">
          <div className="trust-process__copy">
            <div className="section-topline section-topline--light section-topline--small">
              <span className="section-number">02</span>
              <p className="section-kicker">What “verified” means</p>
              <span className="section-rule" />
            </div>
            <h2>
              A visit.
              <em> A record. A second look.</em>
            </h2>
            <p>
              Every vendor on ChopWeti has a last-checked date and a correspondent
              who put their name to the visit. When something changes — a price, a
              new stall, a closed day — the date moves.
            </p>
            <div className="process-list">
              <div>
                <span>01</span>
                <div>
                  <strong>Visit in person</strong>
                  <p>The correspondent goes to the stall. No phone call, no WhatsApp rumour.</p>
                </div>
              </div>
              <div>
                <span>02</span>
                <div>
                  <strong>Record what is real</strong>
                  <p>What they sell, what they prepare, the price, the days they open.</p>
                </div>
              </div>
              <div>
                <span>03</span>
                <div>
                  <strong>Regulator review</strong>
                  <p>A second person checks the record and can reject it.</p>
                </div>
              </div>
              <div>
                <span>04</span>
                <div>
                  <strong>Publish the date</strong>
                  <p>You see the day it was checked. If it is old, you know it is old.</p>
                </div>
              </div>
              <div>
                <span>05</span>
                <div>
                  <strong>Check again in 30 days</strong>
                  <p>Food changes. Prices change. The badge has to keep up.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="trust-process__visual">
            <div className="verified-anatomy">
              <div className="verified-anatomy__top">
                <span className="verified-seal">
                  <ShieldCheck size={28} />
                </span>
                <div>
                  <span className="mini-label">Anatomy of a badge</span>
                  <h3>What you are actually seeing</h3>
                </div>
              </div>
              <div className="anatomy-row">
                <span className="anatomy-dot" />
                <div>
                  <strong>The name of a person</strong>
                  <p>Neba A., correspondent, Nkwen</p>
                </div>
              </div>
              <div className="anatomy-row">
                <span className="anatomy-dot" />
                <div>
                  <strong>The date of the last visit</strong>
                  <p>12 October 2026 — not “recently”</p>
                </div>
              </div>
              <div className="anatomy-row">
                <span className="anatomy-dot" />
                <div>
                  <strong>What was seen</strong>
                  <p>Pounded cocoyam, cleaned eru, yellow soup spice</p>
                </div>
              </div>
              <div className="anatomy-row">
                <span className="anatomy-dot" />
                <div>
                  <strong>What it does not promise</strong>
                  <p>We do not guarantee taste or stock. We confirm the vendor and what they sell.</p>
                </div>
              </div>
              <div className="anatomy-stamp">
                <ShieldCheck size={16} />
                Checked by a person, not a form
              </div>
            </div>

            <div className="trust-photo-card">
              <img
                src="/images/vendor-beans.jpg"
                alt="A vendor selling beans at a market in Cameroon"
                loading="lazy"
              />
              <blockquote>
                “If I would not send my own sister to the stall, it does not go on
                the app.”
              </blockquote>
              <span>Neba A. · Correspondent, Nkwen</span>
            </div>
          </div>
        </section>

        <section className="trust-places">
          <div className="section-topline section-topline--small">
            <span className="section-number">03</span>
            <p className="section-kicker">Our places</p>
            <span className="section-rule" />
          </div>
          <div className="trust-places__head">
            <h2>
              Nine places.
              <em> More as people join.</em>
            </h2>
            <p>
              We start where we have people, not where the map looks empty. A
              place goes live when there is a correspondent who can keep it true.
            </p>
          </div>
          <div className="places-table">
            <div className="places-table__head">
              <span>Neighbourhood</span>
              <span>What is there</span>
              <span>Vendors</span>
              <span>Last checked</span>
              <span>Correspondent</span>
            </div>
            {neighborhoods.map((place) => {
              const correspondents = Array.from(
                new Set(
                  vendors
                    .filter((vendor) => vendor.neighborhood === place.name)
                    .map((vendor) => vendor.correspondent),
                ),
              );
              return (
                <div className="places-table__row" key={place.name}>
                  <span className="places-table__name">
                    <MapPin size={13} /> {place.name}
                    {place.name === "Nkwen" && <small className="is-home-tag">home</small>}
                  </span>
                  <span>{place.blurb}</span>
                  <span>{place.vendors}</span>
                  <span>{place.lastVerified}</span>
                  <span>{correspondents.join(", ") || "Opening soon"}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="field-notes" id="field">
          <div className="section-topline section-topline--small">
            <span className="section-number">04</span>
            <p className="section-kicker">From the field</p>
            <span className="section-rule" />
          </div>
          <div className="field-notes__head">
            <h2>What changed this week.</h2>
            <p>
              The small facts that make a shopping list real: a price, a closing
              time, a batch of bitter leaf.
            </p>
          </div>
          <div className="field-notes__grid">
            {notes.map((note) => (
              <article className="field-note-card" key={note.id}>
                <div className="field-note-card__top">
                  <span className="field-note-card__number">NOTE {note.id}</span>
                  <span className="field-note-card__tag">{note.tag}</span>
                </div>
                <p>{note.text}</p>
                <div className="field-note-card__by">
                  <span className="field-note__avatar">{note.person.slice(0, 1)}</span>
                  <div>
                    <strong>{note.person}</strong>
                    <span>
                      {note.place} · {note.date}
                    </span>
                  </div>
                  <Eye size={15} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="trust-principles">
          <div className="section-topline section-topline--light section-topline--small">
            <span className="section-number">05</span>
            <p className="section-kicker">What we will not do</p>
            <span className="section-rule" />
          </div>
          <div className="trust-principles__grid">
            <h2>
              Trust is also
              <em> what you refuse.</em>
            </h2>
            <div className="principle-list">
              <div>
                <Check size={15} />
                <p>
                  <strong>No paid verification.</strong> A vendor cannot buy a
                  badge or skip a re-check.
                </p>
              </div>
              <div>
                <Check size={15} />
                <p>
                  <strong>No hidden allergens.</strong> If a dish contains
                  something on your list, it does not appear.
                </p>
              </div>
              <div>
                <Check size={15} />
                <p>
                  <strong>No pretend medical advice.</strong> Cautions are flags,
                  not prescriptions. Your clinician knows your body.
                </p>
              </div>
              <div>
                <Check size={15} />
                <p>
                  <strong>No stale dates.</strong> A verification older than 30
                  days is shown as due for a re-check.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="correspondent-cta">
          <div className="correspondent-cta__icon">
            <Users size={24} />
          </div>
          <div>
            <span className="mini-label">We are recruiting</span>
            <h2>Do you know your market?</h2>
            <p>
              We are looking for the first correspondents in Ndop, Upstation,
              Ntarikon, Bambili, Bali, Santa and Mankon. A phone, a walk to the
              market and a habit of writing things down is enough to start.
            </p>
          </div>
          <a
            className="button button--cream"
            href="mailto:hello@chopweti.app?subject=ChopWeti%20correspondent"
          >
            <CalendarDays size={16} /> Write to us
          </a>
        </section>
      </main>
      <AppTabBar />
    </div>
  );
}
