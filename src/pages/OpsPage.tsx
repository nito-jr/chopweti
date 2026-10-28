import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  ClipboardCheck,
  FilePlus2,
  Inbox,
  LayoutDashboard,
  ListChecks,
  MapPin,
  MessageSquare,
  Package,
  ShieldCheck,
  Store,
  Users,
  X,
} from "lucide-react";
import { Brand } from "../components/Brand";
import { formatFCFA, vendors } from "../data";
import { useStore, type AnalyticsEvent, type FeedbackEntry } from "../store";
import { roleMeta, supabase, useAuth, type OpsRole } from "../lib/auth";
import {
  activeVendors,
  peopleSeed,
  requestsSeed,
  vendorPreparedItems,
  verificationSeed,
  type VerificationItem,
  type VerificationStatus,
} from "../lib/opsData";
import { cn } from "../lib/cn";

type Tab = string;

const tabsByRole: Record<OpsRole, { id: Tab; label: string; icon: typeof LayoutDashboard }[]> = {
  admin: [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "verification", label: "Verification", icon: ClipboardCheck },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "people", label: "People", icon: Users },
  ],
  regulator: [
    { id: "queue", label: "Review queue", icon: ClipboardCheck },
    { id: "history", label: "Decision log", icon: ListChecks },
  ],
  correspondent: [
    { id: "report", label: "File a report", icon: FilePlus2 },
    { id: "mine", label: "My reports", icon: ListChecks },
  ],
  vendor: [
    { id: "stall", label: "My stall", icon: Store },
    { id: "prepared", label: "Prepared items", icon: Package },
    { id: "requests", label: "Requests", icon: Inbox },
  ],
};

const statusLabel: Record<VerificationStatus, string> = {
  pending: "Awaiting review",
  approved: "Verified",
  changes: "Needs a re-visit",
};

export function OpsPage() {
  const { user, loading, configured, signOut } = useAuth();
  const { feedback, events, showToast, trackEvent } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [remoteFeedback, setRemoteFeedback] = useState<FeedbackEntry[]>([]);
  const [remoteEvents, setRemoteEvents] = useState<AnalyticsEvent[]>([]);
  const [queue, setQueue] = useState(verificationSeed);
  const [reports, setReports] = useState([
    {
      id: "FR-041",
      place: "Mankon",
      seen: "Cleaned ndolé, cow skin, tripe",
      date: "11 Oct 2026",
      status: "approved",
    },
    {
      id: "FR-040",
      place: "Bambili",
      seen: "Prepared fufu, family portions",
      date: "08 Oct 2026",
      status: "approved",
    },
  ]);
  const [requests, setRequests] = useState(requestsSeed);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [reportForm, setReportForm] = useState({
    vendorId: "mama-ngum",
    seen: "",
    price: "",
    note: "",
  });

  useEffect(() => {
    if (!configured || !supabase || user?.role !== "admin") return;
    let mounted = true;

    supabase
      .from("feedback")
      .select("id, rating, cooked, message, email, page, created_at")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        if (!mounted || !data) return;
        setRemoteFeedback(
          data.map((row) => ({
            id: row.id,
            rating: row.rating,
            cooked: row.cooked ?? "",
            message: row.message,
            email: row.email ?? "",
            page: row.page ?? "",
            createdAt: row.created_at,
          })),
        );
      });

    supabase
      .from("events")
      .select("id, name, path, props, created_at")
      .order("created_at", { ascending: false })
      .limit(400)
      .then(({ data }) => {
        if (!mounted || !data) return;
        setRemoteEvents(
          data.map((row) => ({
            id: row.id,
            name: row.name,
            path: row.path ?? "",
            props: row.props ?? {},
            createdAt: row.created_at,
          })),
        );
      });

    return () => {
      mounted = false;
    };
  }, [configured, user?.role]);

  const allFeedback = useMemo(() => {
    const merged = [...remoteFeedback, ...feedback];
    const seen = new Set<string>();
    return merged.filter((entry) => {
      const key = `${entry.createdAt}|${entry.message}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [remoteFeedback, feedback]);

  const allEvents = useMemo(() => {
    const merged = [...remoteEvents, ...events];
    const seen = new Set<string>();
    return merged.filter((event) => {
      const key = `${event.createdAt}|${event.name}|${event.path}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [remoteEvents, events]);

  if (loading) {
    return (
      <div className="page-loading">
        <span className="loading-bowl">◡</span>
        <p>Opening the field desk…</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!user.role) {
    return (
      <div className="ops-access">
        <Brand to="/" />
        <div>
          <h1>No role assigned.</h1>
          <p>
            This account is signed in, but it has not been given an operational
            role. An admin needs to assign one before the field desk opens.
          </p>
          <button
            type="button"
            className="button button--ink"
            onClick={async () => {
              await signOut();
              navigate("/login");
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const role = user.role;
  const tabs = tabsByRole[role];
  const activeTab = tabs.some((item) => item.id === tab) ? tab : tabs[0].id;
  const meta = roleMeta[role];
  const vendor = vendors.find((item) => item.id === (user.vendorId ?? "mama-ngum")) ?? vendors[0];
  const pending = queue.filter((item) => item.status === "pending");
  const prepared = vendorPreparedItems(vendor.id);

  const updateStatus = (id: string, status: VerificationStatus) => {
    setQueue((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    trackEvent("verification_decision", { report: id, status });
    showToast(
      status === "approved"
        ? "Report approved. The vendor keeps this verification date."
        : "Sent back to the correspondent for a re-visit.",
    );
  };

  const submitReport = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reportForm.seen.trim()) return;
    const newReport = {
      id: `FR-${42 + reports.length}`,
      place: vendor.neighborhood,
      seen: reportForm.seen,
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "pending",
    };
    setReports((current) => [newReport, ...current]);
    setReportForm({ vendorId: user.vendorId ?? vendor.id, seen: "", price: "", note: "" });
    trackEvent("field_report_submitted", { vendor: vendor.id });
    showToast("Field report sent to a regulator.");
  };

  const respondRequest = (id: string, status: "accepted" | "declined") => {
    setRequests((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    trackEvent("vendor_request_response", { request: id, status });
    showToast(status === "accepted" ? "Order accepted." : "Request declined.");
  };

  return (
    <div className="ops-shell">
      <aside className="ops-sidebar">
        <Brand light to="/" />
        <div className="ops-role-badge" style={{ background: `${meta.color}22`, color: meta.soft }}>
          <span style={{ background: meta.color }} />
          {meta.label} desk
        </div>
        <nav className="ops-nav" aria-label="Operations navigation">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className={cn("ops-nav__item", activeTab === item.id && "is-active")}
                onClick={() => setTab(item.id)}
              >
                <Icon size={17} />
                {item.label}
                {item.id === "verification" && pending.length > 0 && (
                  <span className="ops-nav__count">{pending.length}</span>
                )}
                {item.id === "queue" && pending.length > 0 && (
                  <span className="ops-nav__count">{pending.length}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="ops-sidebar__foot">
          {user.preview && (
            <div className="ops-preview-note">
              <span>Preview</span>
              Sample data only. Real operations need Supabase auth.
            </div>
          )}
          <Link to="/" className="ops-site-link">
            <ArrowLeft size={13} /> Public site
          </Link>
        </div>
      </aside>

      <main className="ops-main">
        <header className="ops-topbar">
          <div>
            <p className="mini-label">
              {user.preview ? "Prototype access" : "Signed in"} · {meta.label}
            </p>
            <h1>{tabs.find((item) => item.id === activeTab)?.label}</h1>
          </div>
          <div className="ops-user">
            <span className="ops-user__avatar" style={{ background: meta.color }}>
              {user.initials}
            </span>
            <div>
              <strong>{user.name}</strong>
              <small>{user.neighborhood || user.email}</small>
            </div>
            <button
              type="button"
              className="ops-signout"
              onClick={async () => {
                await signOut();
                navigate("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        {user.preview && (
          <div className="ops-preview-banner">
            <ShieldCheck size={15} />
            <p>
              <strong>Preview mode.</strong> The role, permissions and screens are
              real; the records are sample data. Once Supabase is connected, this
              route is invite-only and the preview disappears.
            </p>
          </div>
        )}

        <div className="ops-content">
          {role === "admin" && activeTab === "overview" && (
            <AdminOverview
              queue={queue}
              feedbackCount={allFeedback.length}
              eventCount={allEvents.length}
              events={allEvents}
              connected={configured}
              onGoTo={setTab}
            />
          )}
          {role === "admin" && activeTab === "verification" && (
            <VerificationQueue queue={queue} onDecide={updateStatus} />
          )}
          {role === "admin" && activeTab === "feedback" && (
            <FeedbackInbox feedback={allFeedback} events={allEvents} />
          )}
          {role === "admin" && activeTab === "people" && <PeopleTable />}

          {role === "regulator" && activeTab === "queue" && (
            <>
              <div className="ops-section-head">
                <div>
                  <p className="mini-label">Separation of duties</p>
                  <h2>Reports waiting for a second look</h2>
                </div>
                <span className="ops-badge ops-badge--warm">{pending.length} pending</span>
              </div>
              <p className="ops-lede">
                A correspondent cannot approve their own report. Approving sets the
                public verification date; sending back asks for a re-visit.
              </p>
              <VerificationQueue queue={queue} onDecide={updateStatus} showDetail />
            </>
          )}
          {role === "regulator" && activeTab === "history" && (
            <DecisionLog queue={queue} />
          )}

          {role === "correspondent" && activeTab === "report" && (
            <div className="report-layout">
              <form className="ops-form" onSubmit={submitReport}>
                <div className="ops-section-head">
                  <div>
                    <p className="mini-label">Field report</p>
                    <h2>What did you actually see?</h2>
                  </div>
                  <CalendarDays size={20} />
                </div>
                <label>
                  <span>Vendor</span>
                  <select
                    value={reportForm.vendorId}
                    onChange={(event) =>
                      setReportForm((current) => ({ ...current, vendorId: event.target.value }))
                    }
                  >
                    {activeVendors.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} · {item.neighborhood}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>What is on sale today?</span>
                  <input
                    type="text"
                    value={reportForm.seen}
                    onChange={(event) =>
                      setReportForm((current) => ({ ...current, seen: event.target.value }))
                    }
                    placeholder="e.g. pounded cocoyam, cleaned eru, yellow soup spice"
                    required
                  />
                </label>
                <label>
                  <span>Price note</span>
                  <input
                    type="text"
                    value={reportForm.price}
                    onChange={(event) =>
                      setReportForm((current) => ({ ...current, price: event.target.value }))
                    }
                    placeholder="e.g. cocoyam up 200 FCFA a heap"
                  />
                </label>
                <label>
                  <span>What should a regulator know?</span>
                  <textarea
                    rows={4}
                    value={reportForm.note}
                    onChange={(event) =>
                      setReportForm((current) => ({ ...current, note: event.target.value }))
                    }
                    placeholder="Condition of the stall, storage, portion sizes, anything that changed."
                  />
                </label>
                <button type="submit" className="button button--ink">
                  Send report <ArrowRight size={15} />
                </button>
              </form>
              <div className="ops-note-card">
                <ShieldCheck size={20} />
                <h3>The field rules</h3>
                <ul>
                  <li>Visit in person. No phone calls or WhatsApp rumours.</li>
                  <li>Record what is actually for sale, not what was there last month.</li>
                  <li>Do not accept payment from a vendor for a good report.</li>
                  <li>If you would not send your sister there, say so.</li>
                </ul>
              </div>
            </div>
          )}
          {role === "correspondent" && activeTab === "mine" && (
            <div className="ops-table-card">
              <div className="ops-section-head">
                <div>
                  <p className="mini-label">Your record</p>
                  <h2>Filed reports</h2>
                </div>
                <span className="ops-badge">{reports.length} total</span>
              </div>
              <div className="ops-table">
                <div className="ops-table__head">
                  <span>Report</span>
                  <span>Place</span>
                  <span>What was seen</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                {reports.map((report) => (
                  <div className="ops-table__row" key={report.id}>
                    <span>{report.id}</span>
                    <span>{report.place}</span>
                    <span>{report.seen}</span>
                    <span>{report.date}</span>
                    <span>
                      <StatusBadge status={report.status as VerificationStatus} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === "vendor" && (
            <VendorDesk
              tab={activeTab}
              vendor={vendor}
              prepared={prepared}
              availability={availability}
              onToggle={(label) =>
                setAvailability((current) => ({ ...current, [label]: !current[label] }))
              }
              requests={requests}
              onRespond={respondRequest}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function AdminOverview({
  queue,
  feedbackCount,
  eventCount,
  events,
  connected,
  onGoTo,
}: {
  queue: VerificationItem[];
  feedbackCount: number;
  eventCount: number;
  events: AnalyticsEvent[];
  connected: boolean;
  onGoTo: (tab: string) => void;
}) {
  const pending = queue.filter((item) => item.status === "pending").length;
  const approved = queue.filter((item) => item.status === "approved").length;

  return (
    <>
      <div className="ops-stats">
        <div>
          <span className="ops-stat__icon ops-stat__icon--blue">
            <ClipboardCheck size={19} />
          </span>
          <strong>{pending}</strong>
          <span>reports waiting</span>
          <button type="button" onClick={() => onGoTo("verification")}>
            Review <ArrowUpRight size={12} />
          </button>
        </div>
        <div>
          <span className="ops-stat__icon ops-stat__icon--green">
            <ShieldCheck size={19} />
          </span>
          <strong>{approved}</strong>
          <span>vendors verified</span>
          <small>Last check 12 Oct</small>
        </div>
        <div>
          <span className="ops-stat__icon ops-stat__icon--clay">
            <MessageSquare size={19} />
          </span>
          <strong>{feedbackCount}</strong>
          <span>feedback notes</span>
          <button type="button" onClick={() => onGoTo("feedback")}>
            Open inbox <ArrowUpRight size={12} />
          </button>
        </div>
        <div>
          <span className="ops-stat__icon ops-stat__icon--gold">
            <BarChart3 size={19} />
          </span>
          <strong>{eventCount}</strong>
          <span>events tracked</span>
          <small>{connected ? "Shared Supabase view" : "This browser only"}</small>
        </div>
      </div>

      <div className="ops-grid-2">
        <div className="ops-table-card">
          <div className="ops-section-head">
            <div>
              <p className="mini-label">Network</p>
              <h2>Verification queue</h2>
            </div>
            <button type="button" className="text-link text-link--dark" onClick={() => onGoTo("verification")}>
              See all <ArrowRight size={13} />
            </button>
          </div>
          <div className="ops-queue-mini">
            {queue.slice(0, 3).map((item) => (
              <div key={item.id}>
                <span className="ops-queue-mini__dot" />
                <div>
                  <strong>{item.vendorId.replace(/-/g, " ")}</strong>
                  <small>
                    {item.place} · {item.correspondent}
                  </small>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="ops-note-card">
          <span className="mini-label">Today</span>
          <h3>What needs attention</h3>
          <div className="attention-list">
            <div>
              <span>01</span>
              <p>Two vendor reports are waiting on a regulator.</p>
            </div>
            <div>
              <span>02</span>
              <p>Nkwen market prices moved this week; recipes still show old estimates.</p>
            </div>
            <div>
              <span>03</span>
              <p>Feedback inbox is empty until the first beta tester submits a note.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="ops-grid-2">
        <div className="ops-note-card">
          <span className="mini-label">Analytics</span>
          <h3>Beta funnel</h3>
          <Funnel events={events} />
        </div>
        <div className="ops-note-card">
          <span className="mini-label">Feedback</span>
          <h3>What testers are saying</h3>
          <p className="ops-empty">
            Feedback submitted in the app will appear here. The admin can read it,
            filter it and follow up by email.
          </p>
        </div>
      </div>
    </>
  );
}

function VerificationQueue({
  queue,
  onDecide,
  showDetail = false,
}: {
  queue: VerificationItem[];
  onDecide: (id: string, status: VerificationStatus) => void;
  showDetail?: boolean;
}) {
  return (
    <div className="queue-list">
      {queue.map((item) => {
        const vendor = vendors.find((entry) => entry.id === item.vendorId);
        return (
          <article className="queue-card" key={item.id}>
            <div className="queue-card__top">
              <div>
                <span className="mini-label">{item.id}</span>
                <h3>{vendor?.name ?? item.vendorId}</h3>
                <p>
                  <MapPin size={12} /> {item.place} · {item.correspondent} ·{" "}
                  {item.submitted}
                </p>
              </div>
              <StatusBadge status={item.status} />
            </div>
            {showDetail && (
              <div className="queue-card__detail">
                <div>
                  <span>What was seen</span>
                  <strong>{item.seen}</strong>
                </div>
                <div>
                  <span>Price note</span>
                  <strong>{item.priceNote}</strong>
                </div>
                <div>
                  <span>Correspondent note</span>
                  <p>{item.note}</p>
                </div>
              </div>
            )}
            {item.status === "pending" && (
              <div className="queue-card__actions">
                <button
                  type="button"
                  className="button button--ink button--small"
                  onClick={() => onDecide(item.id, "approved")}
                >
                  <Check size={13} /> Approve
                </button>
                <button
                  type="button"
                  className="button button--plain button--small"
                  onClick={() => onDecide(item.id, "changes")}
                >
                  <X size={13} /> Needs re-visit
                </button>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function FeedbackInbox({
  feedback,
  events,
}: {
  feedback: ReturnType<typeof useStore>["feedback"];
  events: ReturnType<typeof useStore>["events"];
}) {
  return (
    <div className="feedback-layout">
      <div>
        <div className="ops-section-head">
          <div>
            <p className="mini-label">Direct from the app</p>
            <h2>Feedback inbox</h2>
          </div>
          <span className="ops-badge">{feedback.length} notes</span>
        </div>
        {feedback.length === 0 ? (
          <div className="ops-empty-card">
            <MessageSquare size={23} />
            <h3>No feedback yet.</h3>
            <p>
              Use the feedback button on the public app and this inbox fills in.
              Submissions are stored on this device until Supabase is connected.
            </p>
            <Link to="/" className="button button--plain button--small">
              Open the public app <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="feedback-list">
            {feedback.map((entry) => (
              <article key={entry.id}>
                <div className="feedback-list__top">
                  <span className="feedback-stars">
                    {"★".repeat(entry.rating)}
                    <em>{"★".repeat(5 - entry.rating)}</em>
                  </span>
                  <span>{new Date(entry.createdAt).toLocaleString("en-GB")}</span>
                </div>
                {entry.cooked && <strong>Cooked: {entry.cooked}</strong>}
                <p>{entry.message || "No written note."}</p>
                <small>
                  {entry.page} {entry.email ? `· ${entry.email}` : ""}
                </small>
              </article>
            ))}
          </div>
        )}
      </div>
      <div className="ops-note-card">
        <span className="mini-label">Events</span>
        <h3>Latest activity</h3>
        {events.length === 0 ? (
          <p className="ops-empty">
            Events appear here as testers move through the app. This is a local
            buffer until the shared analytics table is connected.
          </p>
        ) : (
          <div className="event-list">
            {events.slice(0, 8).map((event) => (
              <div key={event.id}>
                <span>{event.name.replace(/_/g, " ")}</span>
                <small>{event.path}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PeopleTable() {
  return (
    <div className="ops-table-card">
      <div className="ops-section-head">
        <div>
          <p className="mini-label">Invite-only</p>
          <h2>People and roles</h2>
        </div>
        <span className="ops-badge">{peopleSeed.length} accounts</span>
      </div>
      <p className="ops-lede">
        Roles are enforced by row-level security. The UI hides what a role cannot
        do, but the database is the real boundary.
      </p>
      <div className="ops-table ops-table--people">
        <div className="ops-table__head">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Place</span>
          <span>Access</span>
        </div>
        {peopleSeed.map((person) => {
          const meta = roleMeta[person.role as OpsRole];
          return (
            <div className="ops-table__row" key={person.id}>
              <span>{person.name}</span>
              <span>{person.email}</span>
              <span>
                <span className="role-tag" style={{ background: meta.soft, color: meta.color }}>
                  {meta.label}
                </span>
              </span>
              <span>{person.place}</span>
              <span>Active</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DecisionLog({ queue }: { queue: VerificationItem[] }) {
  return (
    <div className="ops-table-card">
      <div className="ops-section-head">
        <div>
          <p className="mini-label">Audit trail</p>
          <h2>Decisions</h2>
        </div>
      </div>
      <div className="decision-list">
        {queue.map((item) => (
          <div key={item.id}>
            <span className="decision-list__id">{item.id}</span>
            <div>
              <strong>{item.vendorId.replace(/-/g, " ")}</strong>
              <small>
                {item.place} · reviewed by regulator · {item.submitted}
              </small>
            </div>
            <StatusBadge status={item.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function VendorDesk({
  tab,
  vendor,
  prepared,
  availability,
  onToggle,
  requests,
  onRespond,
}: {
  tab: string;
  vendor: (typeof vendors)[number];
  prepared: ReturnType<typeof vendorPreparedItems>;
  availability: Record<string, boolean>;
  onToggle: (label: string) => void;
  requests: typeof requestsSeed;
  onRespond: (id: string, status: "accepted" | "declined") => void;
}) {
  if (tab === "stall") {
    return (
      <div className="vendor-desk">
        <div className="ops-section-head">
          <div>
            <p className="mini-label">Your storefront</p>
            <h2>{vendor.name}</h2>
          </div>
          <span className="ops-badge ops-badge--green">
            <ShieldCheck size={12} /> Verified {vendor.verified}
          </span>
        </div>
        <div className="vendor-desk__grid">
          <div className="ops-note-card">
            <span className="mini-label">Public profile</span>
            <h3>What neighbours see</h3>
            <p>{vendor.story}</p>
            <div className="vendor-desk__facts">
              <span>
                <MapPin size={13} /> {vendor.pickup}
              </span>
              <span>{vendor.prepTime}</span>
              <span>{vendor.priceNote}</span>
            </div>
            <div className="chip-row">
              {vendor.specialties.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="ops-note-card">
            <span className="mini-label">Verification</span>
            <h3>A person checked this stall</h3>
            <div className="verification-stamp">
              <ShieldCheck size={24} />
              <div>
                <strong>{vendor.verified}</strong>
                <span>{vendor.correspondent} · Nkwen</span>
              </div>
            </div>
            <p>
              You cannot change your own verification date. A correspondent visits,
              a regulator checks, and the date is published.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (tab === "prepared") {
    return (
      <div className="ops-table-card">
        <div className="ops-section-head">
          <div>
            <p className="mini-label">What you prepare</p>
            <h2>Prepared items</h2>
          </div>
          <span className="ops-badge">{prepared.length} items</span>
        </div>
        <div className="prepared-list">
          {prepared.map((item) => {
            const available = availability[item.label] ?? item.available;
            return (
              <div key={`${item.dish}-${item.label}`}>
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.dish}</small>
                </div>
                <span>{formatFCFA(item.price)}</span>
                <button
                  type="button"
                  className={cn("availability-toggle", available && "is-on")}
                  onClick={() => onToggle(item.label)}
                  aria-pressed={available}
                >
                  <span />
                  {available ? "Available" : "Paused"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="ops-request-list">
      <div className="ops-section-head">
        <div>
          <p className="mini-label">Pickup requests</p>
          <h2>Incoming orders</h2>
        </div>
        <span className="ops-badge">{requests.filter((item) => item.status === "new").length} new</span>
      </div>
      {requests.map((request) => (
        <article key={request.id}>
          <div className="ops-request__top">
            <div>
              <span className="mini-label">{request.id}</span>
              <h3>{request.household}</h3>
              <p>{request.pickup}</p>
            </div>
            <strong>{formatFCFA(request.total)}</strong>
          </div>
          <ul>
            {request.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="ops-request__actions">
            {request.status === "new" ? (
              <>
                <button
                  type="button"
                  className="button button--ink button--small"
                  onClick={() => onRespond(request.id, "accepted")}
                >
                  Accept <Check size={13} />
                </button>
                <button
                  type="button"
                  className="button button--plain button--small"
                  onClick={() => onRespond(request.id, "declined")}
                >
                  Decline
                </button>
              </>
            ) : (
              <span className={cn("request-status", `request-status--${request.status}`)}>
                {request.status}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  return (
    <span className={cn("status-badge", `status-badge--${status}`)}>
      {status === "approved" && <Check size={11} />}
      {status === "changes" && <X size={11} />}
      {statusLabel[status]}
    </span>
  );
}

function Funnel({ events }: { events: AnalyticsEvent[] }) {
  const names = [
    ["Setup completed", "setup_completed"],
    ["Recipe opened", "recipe_opened"],
    ["Shopping list built", "shopping_list_built"],
    ["Feedback given", "feedback_submitted"],
  ] as const;
  const counts = names.map(([, key]) => ({
    label: names.find((entry) => entry[1] === key)?.[0] ?? key,
    count: events.filter((event) => event.name === key).length,
  }));
  const max = Math.max(1, ...counts.map((item) => item.count));

  return (
    <div className="funnel">
      {counts.map((item) => (
        <div key={item.label}>
          <span>{item.label}</span>
          <div>
            <span style={{ width: `${Math.max(3, (item.count / max) * 100)}%` }} />
          </div>
          <strong>{item.count}</strong>
        </div>
      ))}
      <p>
        {events.length === 0
          ? "No events yet. This meter uses the local buffer until the shared analytics table is connected."
          : `${events.length} events in view.`}
      </p>
    </div>
  );
}
