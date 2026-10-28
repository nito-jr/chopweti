import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Allergen, Condition, Goal, Neighborhood } from "./data";
import { supabase } from "./lib/auth";

export type LocationMode = "bamenda" | "elsewhere";

export interface Profile {
  tableName: string;
  neighborhood: Neighborhood;
  city: string;
  locationMode: LocationMode;
  adults: number;
  children: number;
  allergens: Allergen[];
  dislikes: string[];
  goals: Goal[];
  conditions: Condition[];
  pantry: string[];
  pepper: number;
  createdAt: string;
}

export interface ShoppingState {
  dishId: string;
  servings: number;
  choices: Record<string, "raw" | "ready">;
  checked: string[];
  note: string;
}

export interface FeedbackEntry {
  id: string;
  rating: number;
  cooked: string;
  message: string;
  email: string;
  page: string;
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  name: string;
  path: string;
  props?: Record<string, string | number | boolean>;
  createdAt: string;
}

interface StoreValue {
  profile: Profile | null;
  saveProfile: (profile: Profile) => void;
  clearProfile: () => void;
  shopping: ShoppingState | null;
  saveShopping: (state: ShoppingState) => void;
  clearShopping: () => void;
  toggleChecked: (ingredientId: string) => void;
  feedback: FeedbackEntry[];
  submitFeedback: (entry: Omit<FeedbackEntry, "id" | "createdAt">) => void;
  events: AnalyticsEvent[];
  trackEvent: (
    name: string,
    props?: Record<string, string | number | boolean>,
  ) => void;
  toast: string | null;
  showToast: (message: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

const PROFILE_KEY = "chopweti.profile.v1";
const SHOPPING_KEY = "chopweti.shopping.v1";
const FEEDBACK_KEY = "chopweti.feedback.v1";
const EVENTS_KEY = "chopweti.analytics.v1";

function readJSON<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A private browser can refuse storage. The app should still work for this visit.
  }
}

function newId() {
  try {
    return window.crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function normalizeProfile(raw: Profile | null): Profile | null {
  if (!raw) return null;
  const legacy = raw as Profile & { spice?: "mild" | "medium" | "hot" };
  const legacyPepper =
    legacy.spice === "hot" ? 86 : legacy.spice === "mild" ? 18 : legacy.spice === "medium" ? 50 : 50;
  return {
    ...makeProfile(),
    ...raw,
    tableName: raw.tableName ?? "",
    city: raw.city ?? "",
    locationMode: raw.locationMode === "elsewhere" ? "elsewhere" : "bamenda",
    pepper: typeof raw.pepper === "number" ? Math.max(0, Math.min(100, raw.pepper)) : legacyPepper,
  };
}

function loadProfile() {
  return normalizeProfile(readJSON<Profile>(PROFILE_KEY));
}

export function makeProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    tableName: "",
    neighborhood: "Nkwen",
    city: "",
    locationMode: "bamenda",
    adults: 2,
    children: 2,
    allergens: [],
    dislikes: [],
    goals: ["family"],
    conditions: [],
    pantry: ["rice", "plantain", "beans", "onions", "palm oil"],
    pepper: 50,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

export const demoProfile: Profile = makeProfile({
  tableName: "The Ngwa table",
  neighborhood: "Nkwen",
  adults: 2,
  children: 2,
  allergens: ["peanuts"],
  dislikes: ["okra"],
  goals: ["muscle", "family"],
  conditions: ["blood-pressure"],
  pantry: ["rice", "beans", "plantain", "onions", "palm oil", "greens"],
  pepper: 62,
});

export const demoGlobalProfile: Profile = makeProfile({
  tableName: "The Diaspora table",
  neighborhood: "Bamenda Centre",
  city: "London, UK",
  locationMode: "elsewhere",
  adults: 2,
  children: 1,
  allergens: [],
  goals: ["family", "iron"],
  pantry: ["rice", "plantain", "beans", "onions"],
  pepper: 30,
});

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(loadProfile);
  const [shopping, setShopping] = useState<ShoppingState | null>(() =>
    readJSON<ShoppingState>(SHOPPING_KEY),
  );
  const [feedback, setFeedback] = useState<FeedbackEntry[]>(() =>
    readJSON<FeedbackEntry[]>(FEEDBACK_KEY) ?? [],
  );
  const [events, setEvents] = useState<AnalyticsEvent[]>(() =>
    readJSON<AnalyticsEvent[]>(EVENTS_KEY) ?? [],
  );
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const saveProfile = useCallback((next: Profile) => {
    setProfile(next);
    writeJSON(PROFILE_KEY, next);
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    try {
      window.localStorage.removeItem(PROFILE_KEY);
      window.localStorage.removeItem(SHOPPING_KEY);
    } catch {
      // Ignore unavailable storage.
    }
    setShopping(null);
  }, []);

  const saveShopping = useCallback((next: ShoppingState) => {
    setShopping(next);
    writeJSON(SHOPPING_KEY, next);
  }, []);

  const clearShopping = useCallback(() => {
    setShopping(null);
    try {
      window.localStorage.removeItem(SHOPPING_KEY);
    } catch {
      // Ignore unavailable storage.
    }
  }, []);

  const toggleChecked = useCallback((ingredientId: string) => {
    setShopping((current) => {
      if (!current) return current;
      const has = current.checked.includes(ingredientId);
      const next = {
        ...current,
        checked: has
          ? current.checked.filter((id) => id !== ingredientId)
          : [...current.checked, ingredientId],
      };
      writeJSON(SHOPPING_KEY, next);
      return next;
    });
  }, []);

  const trackEvent = useCallback(
    (name: string, props?: Record<string, string | number | boolean>) => {
      const event: AnalyticsEvent = {
        id: newId(),
        name,
        path: window.location.hash.replace(/^#/, "") || "/",
        props,
        createdAt: new Date().toISOString(),
      };
      setEvents((current) => {
        const next = [event, ...current].slice(0, 400);
        writeJSON(EVENTS_KEY, next);
        return next;
      });
      if (supabase) {
        void supabase
          .from("events")
          .insert({
            name: event.name,
            path: event.path,
            props: event.props ?? {},
            created_at: event.createdAt,
          })
          .then(
            () => undefined,
            () => undefined,
          );
      }
    },
    [],
  );

  const submitFeedback = useCallback(
    (entry: Omit<FeedbackEntry, "id" | "createdAt">) => {
      const full: FeedbackEntry = {
        ...entry,
        id: newId(),
        createdAt: new Date().toISOString(),
      };
      setFeedback((current) => {
        const next = [full, ...current].slice(0, 200);
        writeJSON(FEEDBACK_KEY, next);
        return next;
      });
      if (supabase) {
        void supabase
          .from("feedback")
          .insert({
            rating: full.rating,
            cooked: full.cooked,
            message: full.message,
            email: full.email,
            page: full.page,
            created_at: full.createdAt,
          })
          .then(
            () => undefined,
            () => undefined,
          );
      }
      trackEvent("feedback_submitted", { rating: entry.rating, page: entry.page });
    },
    [trackEvent],
  );

  const value = useMemo(
    () => ({
      profile,
      saveProfile,
      clearProfile,
      shopping,
      saveShopping,
      clearShopping,
      toggleChecked,
      feedback,
      submitFeedback,
      events,
      trackEvent,
      toast,
      showToast,
    }),
    [
      profile,
      saveProfile,
      clearProfile,
      shopping,
      saveShopping,
      clearShopping,
      toggleChecked,
      feedback,
      submitFeedback,
      events,
      trackEvent,
      toast,
      showToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
