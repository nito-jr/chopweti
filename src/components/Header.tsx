import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Globe2,
  MapPin,
  Menu,
  SlidersHorizontal,
  Store,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { Brand } from "./Brand";
import { useStore } from "../store";
import { describeTable, locationLabel } from "../lib/recommend";
import { cn } from "../lib/cn";

const marketingLinks = [
  { label: "Dishes", to: "/dishes" },
  { label: "Vendors", to: "/vendors" },
  { label: "Our places", to: "/trust" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const goToIdea = () => {
    setOpen(false);
    if (location.pathname === "/") {
      document.getElementById("idea")?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/?to=idea");
    }
  };

  return (
    <header className={cn("site-header", scrolled && "site-header--scrolled")}>
      <div className="shell site-header__inner">
        <div className="site-header__brand">
          <Brand to="/" />
          <span className="beta-badge">Beta</span>
        </div>
        <nav className="site-nav" aria-label="Main navigation">
          {marketingLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn("site-nav__link", isActive && "is-active")}
            >
              {link.label}
            </NavLink>
          ))}
          <button type="button" className="site-nav__link site-nav__button" onClick={goToIdea}>
            The idea
          </button>
        </nav>
        <div className="site-header__actions">
          <Link className="button button--ink button--small" to={profile ? "/today" : "/setup"}>
            <span className="header-cta-long">
              {profile ? "Open my table" : "Set your table"}
            </span>
            <span className="header-cta-short">{profile ? "Open" : "Set table"}</span>
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </Link>
          <button
            type="button"
            className="icon-button site-header__menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          <div className="shell mobile-menu__inner">
            {marketingLinks.map((link) => (
              <Link key={link.to} to={link.to} className="mobile-menu__link">
                {link.label}
                <ArrowUpRight size={18} />
              </Link>
            ))}
            <button type="button" className="mobile-menu__link" onClick={goToIdea}>
              The idea
              <ArrowUpRight size={18} />
            </button>
            <Link
              to={profile ? "/today" : "/setup"}
              className="button button--clay button--wide mobile-menu__cta"
            >
              {profile ? "Open my table" : "Set your table"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

const appLinks = [
  { label: "Today", to: "/today", icon: CalendarDays },
  { label: "Dishes", to: "/dishes", icon: UtensilsCrossed },
  { label: "Vendors", to: "/vendors", icon: Store },
  { label: "Our places", to: "/trust", icon: MapPin },
];

export function AppHeader() {
  const { profile } = useStore();
  const location = useLocation();
  const visibleLinks = appLinks.filter(
    (link) => link.to !== "/vendors" || profile?.locationMode !== "elsewhere",
  );

  return (
    <header className="app-header">
      <div className="shell app-header__inner">
        <Brand to="/today" />
        <nav className="app-nav" aria-label="App navigation">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => cn("app-nav__link", isActive && "is-active")}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="app-header__right">
          {profile && (
            <span className="neighbourhood-pill">
              {profile.locationMode === "elsewhere" ? <Globe2 size={14} /> : <MapPin size={14} />}
              {locationLabel(profile)}
            </span>
          )}
          <Link
            to="/table"
            className={cn("table-pill", location.pathname === "/table" && "is-active")}
            aria-label="Open my table settings"
          >
            <span className="table-pill__count">
              {profile ? profile.adults + profile.children : 4}
            </span>
            <span className="table-pill__label">{profile ? describeTable(profile) : "Table of 4"}</span>
            <SlidersHorizontal size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

const tabLinks = [
  { label: "Today", to: "/today", icon: CalendarDays },
  { label: "Dishes", to: "/dishes", icon: UtensilsCrossed },
  { label: "List", to: "/list", icon: Store },
  { label: "Vendors", to: "/vendors", icon: MapPin },
  { label: "Table", to: "/table", icon: SlidersHorizontal },
];

export function AppTabBar() {
  const { profile } = useStore();
  const visibleLinks = tabLinks.filter(
    (link) => link.to !== "/vendors" || profile?.locationMode !== "elsewhere",
  );

  return (
    <nav className="tab-bar" aria-label="Mobile app navigation">
      {visibleLinks.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => cn("tab-bar__item", isActive && "is-active")}
          >
            <Icon size={20} strokeWidth={1.9} />
            <span>{link.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
