import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, Check, MessageSquare, Star, X } from "lucide-react";
import { useStore } from "../store";
import { useAuth } from "../lib/auth";
import { cn } from "../lib/cn";

const FEEDBACK_EVENT = "chopweti:open-feedback";

export function openFeedback() {
  window.dispatchEvent(new Event(FEEDBACK_EVENT));
}

export function FeedbackWidget() {
  const { submitFeedback, trackEvent } = useStore();
  const { configured } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [cooked, setCooked] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const listener = () => {
      setOpen(true);
      setSent(false);
      trackEvent("feedback_opened", { page: location.pathname });
    };
    window.addEventListener(FEEDBACK_EVENT, listener);
    return () => window.removeEventListener(FEEDBACK_EVENT, listener);
  }, [location.pathname, trackEvent]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (
    location.pathname.startsWith("/ops") ||
    location.pathname.startsWith("/login") ||
    location.pathname === "/setup"
  ) {
    return null;
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (rating === 0) return;
    submitFeedback({
      rating,
      cooked,
      message,
      email,
      page: location.pathname,
    });
    setSent(true);
    setRating(0);
    setCooked("");
    setMessage("");
    setEmail("");
  };

  return (
    <>
      <button
        type="button"
        className="feedback-fab"
        onClick={() => {
          setOpen(true);
          setSent(false);
          trackEvent("feedback_opened", { page: location.pathname });
        }}
      >
        <MessageSquare size={14} />
        <span>Beta feedback</span>
      </button>

      {open && (
        <div className="feedback-overlay" role="presentation" onClick={() => setOpen(false)}>
          <div
            className="feedback-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="feedback-close"
              onClick={() => setOpen(false)}
              aria-label="Close feedback"
            >
              <X size={17} />
            </button>

            {sent ? (
              <div className="feedback-done">
                <span className="feedback-done__mark">
                  <Check size={23} />
                </span>
                <p className="mini-label">Thank you</p>
                <h2 id="feedback-title">That helps us cook better.</h2>
                <p>
                  {configured
                    ? "Your note is in the beta inbox. If you left an email, we may follow up — never to send marketing."
                    : "Your note is saved on this device. It will reach the shared beta inbox once the feedback service is connected."}
                </p>
                <div className="feedback-done__actions">
                  <button type="button" className="button button--ink" onClick={() => setOpen(false)}>
                    Back to the app
                  </button>
                  <button type="button" className="text-link text-link--dark" onClick={() => setSent(false)}>
                    Leave another note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit}>
                <p className="mini-label">Beta feedback</p>
                <h2 id="feedback-title">
                  How did that
                  <em> cook for you?</em>
                </h2>
                <p className="feedback-intro">
                  Be blunt. What worked, what confused you, what would stop you
                  cooking this again?
                </p>

                <div className="feedback-rating">
                  <span>Overall</span>
                  <div>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        className={cn((hover || rating) >= value && "is-active")}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(value)}
                        aria-label={`${value} out of 5`}
                        aria-pressed={rating === value}
                      >
                        <Star size={23} fill="currentColor" strokeWidth={1.3} />
                      </button>
                    ))}
                  </div>
                  <small>{rating > 0 ? `${rating} of 5` : "Tap a star"}</small>
                </div>

                <label className="feedback-field">
                  <span>What did you cook? <em>optional</em></span>
                  <input
                    type="text"
                    value={cooked}
                    onChange={(event) => setCooked(event.target.value)}
                    placeholder="e.g. Achu & yellow soup"
                    maxLength={80}
                  />
                </label>

                <label className="feedback-field">
                  <span>What worked, or what broke?</span>
                  <textarea
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="The recipe was clear until the pounding step…"
                    rows={4}
                    maxLength={600}
                    required
                  />
                  <small>{message.length}/600</small>
                </label>

                <label className="feedback-field">
                  <span>Email <em>optional, for a follow-up</em></span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    maxLength={120}
                  />
                </label>

                <button
                  type="submit"
                  className="button button--clay button--wide"
                  disabled={rating === 0 || message.trim().length === 0}
                >
                  Send feedback <ArrowRight size={16} />
                </button>
                <p className="feedback-privacy">
                  {configured
                    ? "Sent to the ChopWeti feedback inbox. No marketing, no third-party tracker."
                    : "Saved on this device until the shared feedback service is connected. No marketing, no third-party tracker."}
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
