import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Crown, Eye, EyeOff, Flame, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const PINS = {
  owner: "OWNER123",
  restaurant: "REST123",
};

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  badge: string;
  badgeClass: string;
  pinRequired: boolean;
  pinPlaceholder?: string;
  buttonLabel: string;
  buttonClass: string;
  delay: number;
  onAccess: (pin?: string) => void;
}

function RoleCard({
  title,
  description,
  icon,
  gradient,
  border,
  badge,
  badgeClass,
  pinRequired,
  pinPlaceholder,
  buttonLabel,
  buttonClass,
  delay,
  onAccess,
}: RoleCardProps) {
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative rounded-2xl border-2 ${border} p-8 flex flex-col gap-5 hover:scale-[1.02] transition-transform duration-300 cursor-default`}
      style={{ background: gradient }}
    >
      <div className="flex items-start justify-between">
        <div className="p-3 rounded-xl bg-black/20">{icon}</div>
        <Badge className={badgeClass}>{badge}</Badge>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>
      {pinRequired && (
        <div className="relative">
          <Input
            type={showPin ? "text" : "password"}
            placeholder={pinPlaceholder}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onAccess(pin)}
            className="bg-black/30 border-white/20 text-white placeholder:text-white/40 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPin(!showPin)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      )}
      <Button
        onClick={() => onAccess(pinRequired ? pin : undefined)}
        className={`w-full font-semibold ${buttonClass}`}
      >
        {buttonLabel}
      </Button>
    </motion.div>
  );
}

export default function RoleLoginPage() {
  const { login } = useAuth();

  const handleOwner = (pin?: string) => {
    if (pin !== PINS.owner) {
      toast.error("Invalid PIN. Try OWNER123");
      return;
    }
    login("owner");
    toast.success("Welcome, Platform Owner!");
  };

  const handleRestaurant = (pin?: string) => {
    if (pin !== PINS.restaurant) {
      toast.error("Invalid PIN. Try REST123");
      return;
    }
    login("restaurant");
    toast.success("Welcome, Restaurant Manager!");
  };

  const handleCustomer = () => {
    login("customer");
    toast.success("Welcome! Browse our menu.");
  };

  return (
    <div className="min-h-screen bg-[oklch(0.11_0.012_245)] flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flame className="text-orange-400" size={40} />
          <span className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-yellow-400 to-red-400 bg-clip-text text-transparent">
            Food Haveli
          </span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Choose Your Access
        </h1>
        <p className="text-white/50 text-lg">
          Select your role to enter the platform
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        <RoleCard
          title="Platform Owner"
          description="Full platform control — manage all restaurants, vendors, platform analytics, billing, and global settings."
          icon={<Crown size={28} className="text-purple-200" />}
          gradient="linear-gradient(135deg, oklch(0.25 0.08 300) 0%, oklch(0.18 0.1 290) 100%)"
          border="border-purple-500/40"
          badge="Super Admin"
          badgeClass="bg-purple-500/30 text-purple-200 border-purple-400/30"
          pinRequired={true}
          pinPlaceholder="Enter Owner PIN..."
          buttonLabel="Access Owner Panel"
          buttonClass="bg-purple-600 hover:bg-purple-500 text-white"
          delay={0.1}
          onAccess={handleOwner}
        />

        <RoleCard
          title="Restaurant Manager"
          description="Manage your restaurant — menu items, live orders, analytics, QR code, WhatsApp alerts, and AI tools."
          icon={<ChefHat size={28} className="text-amber-200" />}
          gradient="linear-gradient(135deg, oklch(0.28 0.08 70) 0%, oklch(0.20 0.1 60) 100%)"
          border="border-amber-500/40"
          badge="Manager"
          badgeClass="bg-amber-500/30 text-amber-200 border-amber-400/30"
          pinRequired={true}
          pinPlaceholder="Enter Manager PIN..."
          buttonLabel="Access Restaurant Panel"
          buttonClass="bg-amber-600 hover:bg-amber-500 text-white"
          delay={0.2}
          onAccess={handleRestaurant}
        />

        <RoleCard
          title="I'm a Customer"
          description="Browse the menu with real food photos, place orders, track your delivery, and receive a GST invoice."
          icon={<ShoppingBag size={28} className="text-green-200" />}
          gradient="linear-gradient(135deg, oklch(0.22 0.07 150) 0%, oklch(0.18 0.08 30) 100%)"
          border="border-green-500/40"
          badge="Customer"
          badgeClass="bg-green-500/30 text-green-200 border-green-400/30"
          pinRequired={false}
          buttonLabel="Browse Menu →"
          buttonClass="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white"
          delay={0.3}
          onAccess={handleCustomer}
        />
      </div>

      {/* Demo Access Info Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-10 w-full max-w-5xl rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6"
        data-ocid="demo.panel"
      >
        <p className="text-yellow-400 font-semibold text-center mb-4 text-sm uppercase tracking-widest">
          🎯 Demo Access for Judges
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
            <p className="text-purple-300 text-xs font-medium mb-1">
              Platform Owner PIN
            </p>
            <code className="text-purple-200 font-bold text-lg">OWNER123</code>
          </div>
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <p className="text-amber-300 text-xs font-medium mb-1">
              Restaurant Manager PIN
            </p>
            <code className="text-amber-200 font-bold text-lg">REST123</code>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
            <p className="text-green-300 text-xs font-medium mb-1">
              Customer Access
            </p>
            <code className="text-green-200 font-bold text-lg">
              No PIN Needed
            </code>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <p className="mt-8 text-white/30 text-sm">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noreferrer"
          className="text-orange-400/70 hover:text-orange-400"
        >
          caffeine.ai
        </a>
      </p>
    </div>
  );
}
