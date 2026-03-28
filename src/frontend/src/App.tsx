import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import AIChatbot from "./components/AIChatbot";
import Navbar from "./components/Navbar";
import VoiceCommand from "./components/VoiceCommand";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CMSProvider } from "./context/CMSContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import CustomerShell from "./pages/CustomerShell";
import LandingPage from "./pages/LandingPage";
import NearbyMap from "./pages/NearbyMap";
import OwnerPanel from "./pages/OwnerPanel";
import RestaurantPanel from "./pages/RestaurantPanel";
import RoleLoginPage from "./pages/RoleLoginPage";

export type Page =
  | "landing"
  | "dashboard"
  | "menu"
  | "admin"
  | "map"
  | "order"
  | "invoice"
  | "cms"
  | "login";

const TOAST_MESSAGES = [
  "🛔 New order received! Table 4 ordered Butter Chicken",
  "✅ Order #1042 is ready for pickup!",
  "💳 Payment confirmed: ₹650 from Table 7",
  "⭐ New 5-star review: 'Amazing food!'",
  "📦 Order #1039 out for delivery",
  "🍛 New order: Chicken Biryani + Naan from Table 2",
  "📊 Daily revenue milestone: ₹10,000 reached!",
];

function AppContent() {
  const { role } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [toastIndex, setToastIndex] = useState(0);

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

  // Role-based panels have their own full-screen UI
  if (role === "owner") {
    return (
      <>
        <OwnerPanel />
        <AIChatbot />
        <VoiceCommand
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onCommand={(cmd) => {
            toast.info(`Voice: ${cmd}`);
            setVoiceOpen(false);
          }}
        />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  if (role === "restaurant") {
    return (
      <>
        <RestaurantPanel />
        <AIChatbot />
        <VoiceCommand
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onCommand={(cmd) => {
            toast.info(`Voice: ${cmd}`);
            setVoiceOpen(false);
          }}
        />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  if (role === "customer") {
    return (
      <>
        <CustomerShell />
        <AIChatbot />
        <VoiceCommand
          open={voiceOpen}
          onClose={() => setVoiceOpen(false)}
          onCommand={(cmd) => {
            toast.info(`Voice: ${cmd}`);
            setVoiceOpen(false);
          }}
        />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // No role — show landing page with option to login
  if (
    currentPage === "login" ||
    currentPage === "cms" ||
    currentPage === "admin"
  ) {
    return (
      <>
        <RoleLoginPage />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Default: landing + standard navbar
  return (
    <div
      className={`min-h-screen font-sans ${
        isDark ? "bg-[oklch(0.11_0.012_245)]" : "bg-background"
      }`}
    >
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        isDark={isDark}
        onToggleDark={toggleTheme}
        onOpenCommand={() => {}}
        onOpenVoice={() => setVoiceOpen(true)}
      />
      <main>
        {currentPage === "landing" && <LandingPage onNavigate={navigate} />}
        {currentPage === "map" && (
          <NearbyMap onNavigate={(p) => navigate(p as Page)} />
        )}
        {/* Redirect to RoleLoginPage for protected pages */}
        {["dashboard", "order", "invoice"].includes(currentPage) && (
          <RoleLoginPage />
        )}
      </main>
      <AIChatbot />
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
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CMSProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </CMSProvider>
    </ThemeProvider>
  );
}
