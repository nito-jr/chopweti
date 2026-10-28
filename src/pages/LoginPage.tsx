import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { roleMeta, useAuth, type OpsRole } from "../lib/auth";
import { cn } from "../lib/cn";

const previewRoles: OpsRole[] = ["admin", "regulator", "correspondent", "vendor"];

export function LoginPage() {
  const { user, loading, configured, previewEnabled, signInPreview, sendMagicLink } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate("/ops", { replace: true });
  }, [user, loading, navigate]);

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await sendMagicLink(email.trim());
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSent(true);
  };

  const enterPreview = (role: OpsRole) => {
    signInPreview(role);
    navigate("/ops");
  };

  return (
    <div className="login-page">
      <div className="login-aside">
        <Brand light to="/" />
        <div className="login-aside__body">
          <p className="eyebrow eyebrow--light">
            <span className="eyebrow__dot" />
            ChopWeti operations
          </p>
          <h1>
            The kitchen keeps
            <em> its own record.</em>
          </h1>
          <p>
            Field checks, vendor stalls and the people who keep the information
            true. Invite-only access.
          </p>
          <div className="login-aside__stamp">
            <ShieldCheck size={17} />
            <span>
              Verified by a person
              <small>Not a form. Not a payment.</small>
            </span>
          </div>
        </div>
        <blockquote>
          “If I would not send my own sister to the stall, it does not go on the
          app.”
          <span>Neba A. · Correspondent, Nkwen</span>
        </blockquote>
      </div>

      <main className="login-main">
        <Link to="/" className="login-back">
          <ArrowLeft size={14} /> Back to ChopWeti
        </Link>

        <div className="login-panel">
          <p className="eyebrow">
            <span className="eyebrow__dot" />
            Team access
          </p>
          <h2>
            Sign in to
            <em> the field desk.</em>
          </h2>
          <p className="login-intro">
            Real operations use invite-only accounts. Email magic links are the
            first sign-in method; admins can require a second factor later.
          </p>

          <form className="login-form" onSubmit={submitEmail}>
            <label>
              <span>Work email</span>
              <div className="login-input">
                <Mail size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@chopweti.app"
                  autoComplete="email"
                  required
                />
              </div>
            </label>
            <button
              type="submit"
              className="button button--ink button--wide"
              disabled={!configured || submitting}
            >
              {submitting ? "Sending…" : "Send magic link"}
              <ArrowRight size={15} />
            </button>
            {!configured && (
              <p className="login-hint">
                Supabase is not connected in this build. Magic links switch on
                once the project URL and anon key are added.
              </p>
            )}
            {sent && (
              <p className="login-success">
                <Check size={14} /> Check your email for the sign-in link.
              </p>
            )}
            {error && <p className="login-error">{error}</p>}
          </form>

          {previewEnabled && (
            <div className="login-preview">
              <div className="login-preview__head">
                <span className="mini-label">
                  <FlaskConical size={12} /> Prototype access
                </span>
                <span>Sample data only</span>
              </div>
              <p>
                Look through the operational roles before real accounts are
                connected. Nothing here is live vendor or household data.
              </p>
              <div className="login-roles">
                {previewRoles.map((role) => {
                  const meta = roleMeta[role];
                  return (
                    <button
                      type="button"
                      key={role}
                      className={cn("login-role", `login-role--${role}`)}
                      onClick={() => enterPreview(role)}
                    >
                      <span
                        className="login-role__mark"
                        style={{ background: meta.soft, color: meta.color }}
                      >
                        {meta.label.slice(0, 1)}
                      </span>
                      <span>
                        <strong>{meta.label}</strong>
                        <small>{meta.description}</small>
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  );
                })}
              </div>
              <p className="login-preview__note">
                This preview disappears automatically once Supabase auth is
                configured.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
