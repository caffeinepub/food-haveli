import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, LogOut, ShoppingCart, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useAuth } from "../context/AuthContext";
import { useCMS } from "../context/CMSContext";
import CustomerOrderPage from "./CustomerOrderPage";
import MenuPage from "./MenuPage";

type CustomerView = "menu" | "order" | "invoice";

export default function CustomerShell() {
  const { logout } = useAuth();
  const { menuItems } = useCMS();
  const [view, setView] = useState<CustomerView>("menu");

  const handleNavigate = (page: Page) => {
    if (page === "order" || page === "invoice" || page === "menu") {
      setView(page as CustomerView);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.015_20)]">
      {/* Customer Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-orange-500/20 bg-[oklch(0.13_0.02_25)] px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flame size={24} className="text-orange-400" />
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Haveli Kitchen
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400/80 text-xs">
                  Live Menu · {menuItems.length} items
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              <User size={12} className="mr-1" /> Customer
            </Badge>

            {/* Nav Pills */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-full p-1">
              <button
                type="button"
                onClick={() => setView("menu")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  view === "menu"
                    ? "bg-orange-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
                data-ocid="customer.menu.tab"
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => setView("order")}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  view === "order"
                    ? "bg-orange-500 text-white"
                    : "text-white/60 hover:text-white"
                }`}
                data-ocid="customer.order.tab"
              >
                <ShoppingCart size={14} className="inline mr-1" /> Order
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                toast.info("Switched role");
              }}
              className="text-white/60 hover:text-white hover:bg-white/10"
              data-ocid="customer.logout.button"
            >
              <LogOut size={16} className="mr-1" /> Switch Role
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Sync Banner */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="bg-green-500/10 border-b border-green-500/20 px-6 py-2"
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-green-400/80 text-xs">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Menu synced live from Restaurant Manager ·{" "}
          {menuItems.filter((m) => m.available).length} items available
        </div>
      </motion.div>

      {/* Content */}
      <main>
        {view === "menu" && <MenuPage />}
        {view === "order" && <CustomerOrderPage onNavigate={handleNavigate} />}
      </main>
    </div>
  );
}
