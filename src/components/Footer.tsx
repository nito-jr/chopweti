import { Link } from "react-router-dom";
import { ArrowUpRight, Instagram, MessageCircle } from "lucide-react";
import { Brand } from "./Brand";
import { openFeedback } from "./FeedbackWidget";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Brand light />
            <p>
              The daily answer to “chop weti?” — built with Bamenda cooks, for
              Bamenda tables.
            </p>
            <div className="site-footer__social">
              <a href="mailto:hello@chopweti.app" aria-label="Email ChopWeti">
                <MessageCircle size={18} />
              </a>
              <a href="https://instagram.com" aria-label="ChopWeti on Instagram">
                <Instagram size={18} />
              </a>
            </div>
          </div>
          <div className="site-footer__links">
            <div>
              <p className="footer-heading">Eat</p>
              <Link to="/dishes">All dishes</Link>
              <Link to="/today">Today’s table</Link>
              <Link to="/list">Shopping list</Link>
            </div>
            <div>
              <p className="footer-heading">People</p>
              <Link to="/vendors">Verified vendors</Link>
              <Link to="/trust">Our places</Link>
              <Link to="/trust#field">Become a correspondent</Link>
            </div>
            <div>
              <p className="footer-heading">ChopWeti</p>
              <Link to="/?to=idea">The idea</Link>
              <Link to="/credits">Photo credits</Link>
              <button type="button" className="footer-link-button" onClick={openFeedback}>
                Give feedback <MessageCircle size={12} />
              </button>
              <Link to="/login">Team login</Link>
              <a href="mailto:hello@chopweti.app">
                Say hello <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
        <div className="site-footer__word" aria-hidden="true">
          chop<span>weti</span>.
        </div>
        <div className="site-footer__bottom">
          <p>© 2026 ChopWeti. Made in Bamenda, Cameroon.</p>
          <p>Food is identity. Cook it with confidence.</p>
        </div>
      </div>
    </footer>
  );
}
