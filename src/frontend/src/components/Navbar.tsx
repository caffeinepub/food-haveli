import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import {
  Flame,
  LogIn,
  Map as MapIcon,
  Mic,
  Moon,
  Pencil,
  Search,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Sun,
  TrendingUp,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";
import { useRef, useState } from "react";
import type { Page } from "../App";
import { useAuth } from "../context/AuthContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import NotificationBell from "./NotificationBell";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isDark: boolean;
  onToggleDark: () => void;
  onOpenCommand: () => void;
  onOpenVoice: () => void;
}

const SEARCH_DATA = [
  {
    label: "Butter Chicken",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🍗",
    desc: "Creamy tomato gravy",
  },
  {
    label: "Chicken Biryani",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🍚",
    desc: "Fragrant basmati rice",
  },
  {
    label: "Paneer Tikka",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🧀",
    desc: "Tandoor-grilled cottage cheese",
  },
  {
    label: "Dal Makhani",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🫘",
    desc: "Slow-cooked black lentils",
  },
  {
    label: "Chicken Tikka Masala",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🍛",
    desc: "Rich masala sauce",
  },
  {
    label: "Tandoori Chicken",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🍖",
    desc: "Char-grilled whole chicken",
  },
  {
    label: "Palak Paneer",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🥬",
    desc: "Spinach & cottage cheese",
  },
  {
    label: "Shahi Paneer",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "👑",
    desc: "Royal cream gravy",
  },
  {
    label: "Rajma Chawal",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🫘",
    desc: "Kidney beans & rice",
  },
  {
    label: "Chole Bhature",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🥙",
    desc: "Spiced chickpeas & fried bread",
  },
  {
    label: "Masala Dosa",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🥞",
    desc: "Crispy South Indian crepe",
  },
  {
    label: "Mutton Biryani",
    type: "menu",
    category: "Mains",
    page: "order" as Page,
    emoji: "🥩",
    desc: "Slow-cooked mutton & rice",
  },
  {
    label: "Garlic Naan",
    type: "menu",
    category: "Breads",
    page: "order" as Page,
    emoji: "🫓",
    desc: "Butter garlic flatbread",
  },
  {
    label: "Aloo Paratha",
    type: "menu",
    category: "Breads",
    page: "order" as Page,
    emoji: "🫓",
    desc: "Stuffed potato bread",
  },
  {
    label: "Kulcha",
    type: "menu",
    category: "Breads",
    page: "order" as Page,
    emoji: "🫓",
    desc: "Soft leavened bread",
  },
  {
    label: "Samosa",
    type: "menu",
    category: "Snacks",
    page: "order" as Page,
    emoji: "🥟",
    desc: "Crispy fried pastry",
  },
  {
    label: "Pani Puri",
    type: "menu",
    category: "Snacks",
    page: "order" as Page,
    emoji: "🫧",
    desc: "Hollow crispy shells",
  },
  {
    label: "Mango Lassi",
    type: "menu",
    category: "Drinks",
    page: "order" as Page,
    emoji: "🥭",
    desc: "Sweet mango yogurt drink",
  },
  {
    label: "Kheer",
    type: "menu",
    category: "Desserts",
    page: "order" as Page,
    emoji: "🍮",
    desc: "Creamy rice pudding",
  },
  {
    label: "Gulab Jamun",
    type: "menu",
    category: "Desserts",
    page: "order" as Page,
    emoji: "🍩",
    desc: "Milk solid dumplings in syrup",
  },
  {
    label: "Rasmalai",
    type: "menu",
    category: "Desserts",
    page: "order" as Page,
    emoji: "🍮",
    desc: "Soft cheese in saffron milk",
  },
  {
    label: "Home",
    type: "page",
    category: "Navigation",
    page: "landing" as Page,
    emoji: "🏠",
    desc: "Landing page",
  },
  {
    label: "Menu Management",
    type: "page",
    category: "Navigation",
    page: "menu" as Page,
    emoji: "📋",
    desc: "Manage your dishes",
  },
  {
    label: "Find Nearby",
    type: "page",
    category: "Navigation",
    page: "map" as Page,
    emoji: "📍",
    desc: "Restaurants near you",
  },
  {
    label: "Order Online",
    type: "page",
    category: "Navigation",
    page: "order" as Page,
    emoji: "🛒",
    desc: "Place a new order",
  },
  {
    label: "AI Smart Menu",
    type: "feature",
    category: "Features",
    page: "menu" as Page,
    emoji: "✨",
    desc: "Generate menu with AI",
  },
  {
    label: "QR Code Menu",
    type: "feature",
    category: "Features",
    page: "menu" as Page,
    emoji: "📱",
    desc: "Scan-to-order system",
  },
  {
    label: "WhatsApp Orders",
    type: "feature",
    category: "Features",
    page: "order" as Page,
    emoji: "💬",
    desc: "Instant order notifications",
  },
  {
    label: "Order Tracking",
    type: "feature",
    category: "Features",
    page: "order" as Page,
    emoji: "🚀",
    desc: "Real-time order status",
  },
  {
    label: "Customer Support",
    type: "feature",
    category: "Features",
    page: "landing" as Page,
    emoji: "🤖",
    desc: "AI chatbot assistance",
  },
];

const TRENDING = [
  { label: "Butter Chicken", emoji: "🍗" },
  { label: "Biryani", emoji: "🍚" },
  { label: "Order Now", emoji: "🛒" },
  { label: "AI Smart Menu", emoji: "✨" },
];

const TYPE_COLORS: Record<string, string> = {
  menu: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
  page: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  feature: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

function highlightMatch(text: string, query: string) {
  if (!query) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <span className="text-gold font-bold bg-gold/10 rounded px-0.5">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </span>
  );
}

export default function Navbar({
  currentPage,
  onNavigate,
  isDark,
  onToggleDark,
  onOpenVoice,
}: NavbarProps) {
  const { role, logout: roleLogout } = useAuth();
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredResults =
    searchQuery.length > 0
      ? SEARCH_DATA.filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : SEARCH_DATA;

  const grouped = filteredResults.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, typeof SEARCH_DATA>,
  );

  const flatList = Object.values(grouped).flat();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const item = flatList[activeIndex];
      if (item) {
        onNavigate(item.page);
        setSearchQuery("");
        setSearchOpen(false);
        setActiveIndex(-1);
      }
    } else if (e.key === "Escape") {
      setSearchOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Compact nav links — icon only on medium, icon+label only on large
  const navLinks: { label: string; page: Page; icon: React.ReactNode }[] = [
    {
      label: "Platform",
      page: "landing",
      icon: <UtensilsCrossed className="w-3.5 h-3.5" />,
    },
    {
      label: "Menu",
      page: "menu",
      icon: <ShoppingCart className="w-3.5 h-3.5" />,
    },
    { label: "Nearby", page: "map", icon: <MapIcon className="w-3.5 h-3.5" /> },
    { label: "CMS", page: "cms", icon: <Pencil className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 dark:bg-[oklch(0.11_0.012_245/0.9)] backdrop-blur-xl border-b border-border">
      <nav className="container max-w-7xl mx-auto px-3 h-14 flex items-center gap-2 flex-nowrap">
        {/* Logo */}
        <button
          type="button"
          data-ocid="nav.link"
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-1.5 font-display font-bold text-base shrink-0"
        >
          <div className="w-7 h-7 rounded-lg bg-gold flex items-center justify-center shrink-0">
            <UtensilsCrossed className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="hidden sm:inline whitespace-nowrap">
            Food <span className="text-gold">Haveli</span>
          </span>
        </button>

        {/* Nav links — single row, flex-nowrap */}
        <div className="hidden md:flex items-center gap-0.5 flex-nowrap min-w-0">
          {navLinks.map((link) => (
            <button
              key={link.page}
              type="button"
              data-ocid="nav.link"
              onClick={() => onNavigate(link.page)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                currentPage === link.page
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {link.icon}
              <span className="hidden lg:inline">{link.label}</span>
            </button>
          ))}

          {/* Search */}
          <div ref={searchRef} className="relative ml-1">
            <div
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all duration-300 ${
                isFocused
                  ? "border-gold/60 bg-gold/5 shadow-[0_0_12px_rgba(234,179,8,0.15)] w-64"
                  : "border-border bg-card/50 hover:border-gold/30 w-44"
              }`}
            >
              <Search
                className={`w-3 h-3 shrink-0 transition-colors duration-200 ${
                  isFocused ? "text-gold" : "text-muted-foreground"
                }`}
              />
              <Input
                ref={inputRef}
                data-ocid="nav.search_input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                onFocus={() => {
                  setIsFocused(true);
                  setSearchOpen(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  setTimeout(() => {
                    setSearchOpen(false);
                    setActiveIndex(-1);
                  }, 200);
                }}
                onKeyDown={handleKeyDown}
                placeholder={isFocused ? "Search..." : "Search"}
                className="h-auto p-0 border-0 bg-transparent text-xs focus-visible:ring-0 text-foreground placeholder:text-muted-foreground min-w-0 flex-1"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveIndex(-1);
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {searchOpen && (
              <div
                className="absolute top-full mt-2 right-0 w-80 rounded-2xl border border-border/80 shadow-2xl overflow-hidden z-50"
                style={{
                  background: isDark
                    ? "rgba(10,10,20,0.97)"
                    : "rgba(255,255,255,0.97)",
                  backdropFilter: "blur(20px)",
                  animation: "searchDropIn 0.18s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {searchQuery ? (
                      <>
                        <Sparkles className="w-3 h-3 text-gold" />
                        <span className="text-xs text-muted-foreground">
                          {filteredResults.length} result
                          {filteredResults.length !== 1 ? "s" : ""} for{" "}
                          <span className="text-gold font-medium">
                            "{searchQuery}"
                          </span>
                        </span>
                      </>
                    ) : (
                      <>
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-muted-foreground font-medium">
                          All Items — {SEARCH_DATA.length} available
                        </span>
                      </>
                    )}
                  </div>
                  <kbd className="text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                    ESC
                  </kbd>
                </div>

                {!searchQuery && (
                  <div className="px-4 py-2 border-b border-border/40 flex gap-2 flex-wrap">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </span>
                    {TRENDING.map((t) => (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => setSearchQuery(t.label)}
                        className="text-[11px] px-2 py-0.5 rounded-full bg-gold/8 hover:bg-gold/15 border border-gold/20 text-gold/80 hover:text-gold transition-all"
                      >
                        {t.emoji} {t.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="max-h-80 overflow-y-auto">
                  {filteredResults.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <span className="text-2xl">🔍</span>
                      <p className="text-sm text-muted-foreground mt-2">
                        No results for "{searchQuery}"
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Try menu items, pages, or features
                      </p>
                    </div>
                  ) : (
                    Object.entries(grouped).map(([category, items]) => {
                      return (
                        <div key={category}>
                          <div className="px-4 pt-3 pb-1">
                            <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest">
                              {category}
                            </span>
                          </div>
                          {items.map((item, itemIdx) => {
                            const categoryKeys = Object.keys(grouped);
                            const catIdx = categoryKeys.indexOf(category);
                            const offset = categoryKeys
                              .slice(0, catIdx)
                              .reduce((sum, k) => sum + grouped[k].length, 0);
                            const idx = offset + itemIdx;
                            const isActive = idx === activeIndex;
                            return (
                              <button
                                key={item.label + item.type}
                                type="button"
                                data-ocid="nav.link"
                                onClick={() => {
                                  onNavigate(item.page);
                                  setSearchQuery("");
                                  setSearchOpen(false);
                                  setActiveIndex(-1);
                                }}
                                onMouseEnter={() => setActiveIndex(idx)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all duration-100 ${
                                  isActive
                                    ? "bg-gold/8 border-l-2 border-gold"
                                    : "hover:bg-white/4 border-l-2 border-transparent"
                                }`}
                              >
                                <span className="text-lg leading-none w-6 text-center flex-shrink-0">
                                  {item.emoji}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-foreground">
                                    {highlightMatch(item.label, searchQuery)}
                                  </div>
                                  <div className="text-[11px] text-muted-foreground truncate">
                                    {item.desc}
                                  </div>
                                </div>
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded-md uppercase tracking-wide font-semibold flex-shrink-0 ${
                                    TYPE_COLORS[item.type]
                                  }`}
                                >
                                  {item.type}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-4 py-2 border-t border-border/50 flex items-center gap-3 text-[10px] text-muted-foreground/60">
                  <span className="flex items-center gap-1">
                    <kbd className="border border-border rounded px-1">↑↓</kbd>{" "}
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="border border-border rounded px-1">↵</kbd>{" "}
                    open
                  </span>
                  <span className="ml-auto flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-gold" /> Food Haveli Search
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right actions */}
        <div className="flex items-center gap-1 shrink-0 flex-nowrap">
          <NotificationBell />

          {role && (
            <button
              type="button"
              onClick={() => {
                roleLogout();
              }}
              className={
                role === "owner"
                  ? "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                  : role === "restaurant"
                    ? "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
                    : "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-colors"
              }
              title="Switch Role"
              data-ocid="nav.role.button"
            >
              <span
                className={
                  role === "owner"
                    ? "w-1.5 h-1.5 rounded-full bg-purple-400"
                    : role === "restaurant"
                      ? "w-1.5 h-1.5 rounded-full bg-amber-400"
                      : "w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                }
              />
              {role === "owner"
                ? "Owner"
                : role === "restaurant"
                  ? "Manager"
                  : "Customer"}
            </button>
          )}
          <button
            type="button"
            data-ocid="nav.toggle"
            onClick={onOpenVoice}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-gold"
            title="Voice Commands"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            data-ocid="nav.toggle"
            onClick={onToggleDark}
            className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <Button
            data-ocid="nav.primary_button"
            onClick={() => onNavigate("order" as Page)}
            size="sm"
            className="hidden sm:flex bg-orange-500 hover:bg-orange-500/90 text-white font-semibold rounded-full px-3 text-xs h-8"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-1" />
            Order
          </Button>

          <Button
            data-ocid="nav.primary_button"
            onClick={handleAuth}
            disabled={isLoggingIn}
            size="sm"
            className="bg-gold hover:bg-gold/90 text-black font-semibold rounded-full px-3 text-xs h-8"
          >
            <LogIn className="w-3.5 h-3.5 mr-1" />
            {isLoggingIn ? "..." : isAuthenticated ? "Logout" : "Login"}
          </Button>
        </div>
      </nav>

      <style>{`
        @keyframes searchDropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
}
