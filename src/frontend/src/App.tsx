import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AIChatbot from "./components/AIChatbot";
import Navbar from "./components/Navbar";
import VoiceCommand from "./components/VoiceCommand";
import { CMSProvider } from "./context/CMSContext";
import AdminPanel from "./pages/AdminPanel";
import CMSPanel from "./pages/CMSPanel";
import CustomerOrderPage from "./pages/CustomerOrderPage";
import Dashboard from "./pages/Dashboard";
import InvoicePage from "./pages/InvoicePage";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import NearbyMap from "./pages/NearbyMap";

export type Page =
  | "landing"
  | "dashboard"
  | "menu"
  | "admin"
  | "map"
  | "order"
  | "invoice"
  | "cms";

const TOAST_MESSAGES = [
  "🛔 New order received! Table 4 ordered Butter Chicken",
  "✅ Order #1042 is ready for pickup!",
  "💳 Payment confirmed: ₹650 from Table 7",
  "⭐ New 5-star review: 'Amazing food!'",
  "📦 Order #1039 out for delivery",
  "🍛 New order: Chicken Biryani + Naan from Table 2",
  "📊 Daily revenue milestone: ₹10,000 reached!",
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [isDark, setIsDark] = useState(true);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Real-time toast notifications
  useEffect(() => {
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000;
      return setTimeout(() => {
        toast(TOAST_MESSAGES[toastIndex % TOAST_MESSAGES.length], {
          duration: 4000,
        });
        setToastIndex((i) => i + 1);
        timeoutRef = scheduleNext();
      }, delay);
    };
    let timeoutRef = scheduleNext();
    return () => clearTimeout(timeoutRef);
  }, [toastIndex]);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    if (page !== "landing") {
      toast.success(
        `Navigated to ${page.charAt(0).toUpperCase() + page.slice(1)}`,
      );
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hide navbar on invoice page for clean print
  const hideNavbar = currentPage === "invoice";

  return (
    <CMSProvider>
      <div
        className={`min-h-screen font-sans ${
          isDark ? "bg-[oklch(0.11_0.012_245)]" : "bg-background"
        }`}
      >
        {!hideNavbar && (
          <Navbar
            currentPage={currentPage}
            onNavigate={navigate}
            isDark={isDark}
            onToggleDark={() => setIsDark(!isDark)}
            onOpenCommand={() => {}}
            onOpenVoice={() => setVoiceOpen(true)}
          />
        )}
        <main>
          {currentPage === "landing" && <LandingPage onNavigate={navigate} />}
          {currentPage === "dashboard" && <Dashboard onNavigate={navigate} />}
          {currentPage === "menu" && <MenuPage />}
          {currentPage === "admin" && <AdminPanel />}
          {currentPage === "map" && (
            <NearbyMap onNavigate={(p) => navigate(p as Page)} />
          )}
          {currentPage === "order" && (
            <CustomerOrderPage onNavigate={navigate} />
          )}
          {currentPage === "invoice" && <InvoicePage onNavigate={navigate} />}
          {currentPage === "cms" && <CMSPanel />}
        </main>
        {currentPage !== "invoice" && <AIChatbot />}
        <VoiceCommand
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onCommand={(cmd) => {
            toast.info(`Voice: ${cmd}`);
            setVoiceOpen(false);
          }}
        />
        <Toaster richColors position="top-right" />
      </div>
    </CMSProvider>
  );
}
