import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export type OpsRole = "admin" | "regulator" | "correspondent" | "vendor";

export interface OpsUser {
  id: string;
  name: string;
  email: string;
  role: OpsRole | null;
  neighborhood: string;
  vendorId?: string;
  initials: string;
  preview: boolean;
}

interface AuthValue {
  user: OpsUser | null;
  loading: boolean;
  configured: boolean;
  previewEnabled: boolean;
  signInPreview: (role: OpsRole) => void;
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

export const roleMeta: Record<
  OpsRole,
  { label: string; description: string; color: string; soft: string }
> = {
  admin: {
    label: "Admin",
    description: "People, places, feedback and the whole system.",
    color: "#2456a5",
    soft: "#e1e9f6",
  },
  regulator: {
    label: "Regulator",
    description: "Checks field reports and keeps verification honest.",
    color: "#9b4b28",
    soft: "#f4e2d8",
  },
  correspondent: {
    label: "Correspondent",
    description: "Visits vendors and files neighbourhood reports.",
    color: "#3d5d40",
    soft: "#e4ebdc",
  },
  vendor: {
    label: "Vendor",
    description: "Manages a stall and the ingredients prepared there.",
    color: "#8a651b",
    soft: "#f5e9c8",
  },
};

const previewUsers: Record<OpsRole, OpsUser> = {
  admin: {
    id: "preview-admin",
    name: "Ngwa P.",
    email: "admin@chopweti.app",
    role: "admin",
    neighborhood: "Bamenda Centre",
    initials: "NP",
    preview: true,
  },
  regulator: {
    id: "preview-regulator",
    name: "Manka T.",
    email: "regulator@chopweti.app",
    role: "regulator",
    neighborhood: "Ntarikon",
    initials: "MT",
    preview: true,
  },
  correspondent: {
    id: "preview-correspondent",
    name: "Neba A.",
    email: "neba@chopweti.app",
    role: "correspondent",
    neighborhood: "Nkwen",
    initials: "NA",
    preview: true,
  },
  vendor: {
    id: "preview-vendor",
    name: "Mama Ngum",
    email: "mamangum@chopweti.app",
    role: "vendor",
    neighborhood: "Nkwen",
    vendorId: "mama-ngum",
    initials: "MN",
    preview: true,
  },
};

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const configured = Boolean(url && anonKey);
export const supabase: SupabaseClient | null =
  configured && url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
      })
    : null;

export const previewEnabled = !configured;
const PREVIEW_KEY = "chopweti.ops.preview-role";

const AuthContext = createContext<AuthValue | null>(null);

function initialsFrom(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "CW"
  );
}

function isRole(value: unknown): value is OpsRole {
  return value === "admin" || value === "regulator" || value === "correspondent" || value === "vendor";
}

async function resolveUser(sessionUser: User): Promise<OpsUser> {
  const fallbackName =
    (sessionUser.user_metadata?.full_name as string | undefined) ||
    sessionUser.email?.split("@")[0] ||
    "Team member";

  if (!supabase) {
    return {
      id: sessionUser.id,
      name: fallbackName,
      email: sessionUser.email ?? "",
      role: null,
      neighborhood: "",
      initials: initialsFrom(fallbackName),
      preview: false,
    };
  }

  const { data } = await supabase
    .from("profiles")
    .select("role, full_name, neighborhood, vendor_id")
    .eq("id", sessionUser.id)
    .maybeSingle();

  const role = isRole(data?.role) ? data.role : null;
  const name = data?.full_name || fallbackName;

  return {
    id: sessionUser.id,
    name,
    email: sessionUser.email ?? "",
    role,
    neighborhood: data?.neighborhood ?? "",
    vendorId: data?.vendor_id ?? undefined,
    initials: initialsFrom(name),
    preview: false,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OpsUser | null>(() => {
    if (!previewEnabled) return null;
    try {
      const role = window.localStorage.getItem(PREVIEW_KEY);
      return isRole(role) ? previewUsers[role] : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    try {
      window.localStorage.removeItem(PREVIEW_KEY);
    } catch {
      // Nothing to clear.
    }
    setUser(null);

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      if (data.session?.user) {
        setUser(await resolveUser(data.session.user));
      }
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(await resolveUser(session.user));
        } else {
          setUser(null);
        }
      },
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signInPreview = useCallback((role: OpsRole) => {
    try {
      window.localStorage.setItem(PREVIEW_KEY, role);
    } catch {
      // Preview still works for this visit.
    }
    setUser(previewUsers[role]);
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    if (!supabase) {
      return {
        error:
          "Supabase is not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then this becomes an invite-only magic link.",
      };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}#/ops`,
      },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    try {
      window.localStorage.removeItem(PREVIEW_KEY);
    } catch {
      // Ignore storage failures.
    }
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      configured,
      previewEnabled,
      signInPreview,
      sendMagicLink,
      signOut,
    }),
    [user, loading, configured, signInPreview, sendMagicLink, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
