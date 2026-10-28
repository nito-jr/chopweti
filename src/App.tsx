import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { StoreProvider, useStore } from "./store";
import { findDish } from "./lib/recommend";
import { AuthProvider } from "./lib/auth";
import { Toast } from "./components/Toast";
import { FeedbackWidget } from "./components/FeedbackWidget";
import { LandingPage } from "./pages/LandingPage";
import { SetupPage } from "./pages/SetupPage";
import { TodayPage } from "./pages/TodayPage";
import { ExplorePage } from "./pages/ExplorePage";
import { RecipePage } from "./pages/RecipePage";
import { ShoppingListPage } from "./pages/ShoppingListPage";
import { VendorsPage } from "./pages/VendorsPage";
import { TrustPage } from "./pages/TrustPage";
import { TablePage } from "./pages/TablePage";
import { CreditsPage } from "./pages/CreditsPage";
import { LoginPage } from "./pages/LoginPage";
import { OpsPage } from "./pages/OpsPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function RouteTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const staticTitles: Record<string, string> = {
      "/": "ChopWeti — Chop weti today?",
      "/setup": "Set your table — ChopWeti",
      "/today": "Today at your table — ChopWeti",
      "/dishes": "Dishes — ChopWeti",
      "/list": "Your shopping list — ChopWeti",
      "/vendors": "Verified vendors — ChopWeti",
      "/trust": "Our places — ChopWeti",
      "/table": "Your table — ChopWeti",
      "/credits": "Photo credits — ChopWeti",
      "/login": "Team access — ChopWeti",
      "/ops": "Field desk — ChopWeti",
    };

    if (pathname.startsWith("/recipe/")) {
      const dish = findDish(pathname.replace("/recipe/", ""));
      document.title = dish ? `${dish.name} recipe — ChopWeti` : "Recipe — ChopWeti";
    } else {
      document.title = staticTitles[pathname] ?? "Not on this table — ChopWeti";
    }
  }, [pathname]);

  return null;
}

function PageAnalytics() {
  const { pathname } = useLocation();
  const { trackEvent } = useStore();

  useEffect(() => {
    if (pathname.startsWith("/ops") || pathname.startsWith("/login")) return;
    trackEvent("page_view", { path: pathname });
  }, [pathname, trackEvent]);

  return null;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    return undefined;
  }, [location.pathname, location.hash]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <HashRouter>
          <RouteTitle />
          <ScrollToTop />
          <PageAnalytics />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/dishes" element={<ExplorePage />} />
            <Route path="/recipe/:id" element={<RecipePage />} />
            <Route path="/list" element={<ShoppingListPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/trust" element={<TrustPage />} />
            <Route path="/table" element={<TablePage />} />
            <Route path="/credits" element={<CreditsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/ops" element={<OpsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <FeedbackWidget />
          <Toast />
        </HashRouter>
      </StoreProvider>
    </AuthProvider>
  );
}
