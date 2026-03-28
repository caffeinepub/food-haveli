import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Flame,
  LogOut,
  Minus,
  Moon,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useAuth } from "../context/AuthContext";
import { useCMS } from "../context/CMSContext";
import { useTheme } from "../context/ThemeContext";
import CustomerOrderPage from "./CustomerOrderPage";

type CustomerView = "menu" | "order" | "invoice";

const CATEGORIES = ["All", "Mains", "Breads", "Drinks", "Desserts", "Snacks"];

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export default function CustomerShell() {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { menuItems } = useCMS();
  const [view, setView] = useState<CustomerView>("menu");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleNavigate = (page: Page) => {
    if (page === "order" || page === "invoice" || page === "menu") {
      setView(page as CustomerView);
    }
  };

  const filtered = menuItems.filter((item) => {
    const matchCat = category === "All" || item.category === category;
    const matchSearch =
      !search ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch && item.available;
  });

  const addToCart = (item: (typeof menuItems)[0]) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, qty: c.qty + 1 } : c,
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: 1,
        },
      ];
    });
    toast.success(`${item.name} added to cart!`);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.qty, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    const itemsList = cart.map((c) => `${c.name} x${c.qty}`).join(", ");
    const msg = encodeURIComponent(
      `🍽️ New Order from Food Haveli!\n\nItems: ${itemsList}\n\nTotal: ₹${cartTotal}\n\nThank you!`,
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, "_blank");
    toast.success("Order sent via WhatsApp! 🎉");
    setCart([]);
    setCartOpen(false);
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
                  Live Menu · {menuItems.filter((m) => m.available).length}{" "}
                  items
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
              <User size={12} className="mr-1" /> Customer
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/10"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>

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
                Orders
              </button>
            </div>

            {/* Cart Button */}
            {view === "menu" && (
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 hover:bg-orange-500/30 transition-all"
                data-ocid="customer.cart.button"
              >
                <ShoppingCart size={16} />
                <span className="text-sm font-medium hidden sm:inline">
                  Cart
                </span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

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
        {view === "menu" && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Search + Filters */}
            <div className="mb-8">
              <div className="relative max-w-md mb-5">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dishes..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-orange-500/40"
                  data-ocid="customer.search_input"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      category === cat
                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20"
                    }`}
                    data-ocid="customer.menu.tab"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            {filtered.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-20 text-center"
                data-ocid="customer.menu.empty_state"
              >
                <p className="text-5xl mb-4">🍽️</p>
                <p className="text-white/50 text-lg">No dishes found</p>
                <p className="text-white/30 text-sm mt-1">
                  Try a different category or search term
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((item, i) => {
                  const inCart = cart.find((c) => c.id === item.id);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group rounded-2xl overflow-hidden bg-white/5 border border-white/8 hover:border-orange-500/40 transition-all hover:shadow-xl hover:shadow-orange-500/10 hover:-translate-y-1"
                      data-ocid={`customer.menu.item.${i + 1}`}
                    >
                      {/* Image */}
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {item.popular && (
                          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                            🔥 Popular
                          </span>
                        )}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1">
                          <Star
                            size={12}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="text-white text-xs font-medium">
                            {item.rating}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="text-white font-semibold text-sm leading-tight flex-1 mr-2">
                            {item.name}
                          </h3>
                          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 text-xs shrink-0">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed mb-3 line-clamp-2">
                          {item.desc}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-amber-400 font-bold text-lg">
                            ₹{item.price}
                          </span>

                          {inCart ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, -1)}
                                className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center hover:bg-orange-500/40 transition-all"
                                data-ocid={`customer.menu.item.${i + 1}`}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-white font-semibold text-sm w-5 text-center">
                                {inCart.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, 1)}
                                className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                                data-ocid={`customer.menu.item.${i + 1}`}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:shadow-lg hover:shadow-orange-500/30"
                              data-ocid={`customer.menu.item.${i + 1}`}
                            >
                              <Plus size={12} /> Add
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {view === "order" && <CustomerOrderPage onNavigate={handleNavigate} />}
      </main>

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setCartOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[oklch(0.13_0.02_25)] border-l border-orange-500/20 z-50 flex flex-col"
              data-ocid="customer.cart.panel"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-orange-500/20">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-orange-400" />
                  <h2 className="text-white font-bold text-lg">Your Cart</h2>
                  {cartCount > 0 && (
                    <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                      {cartCount} items
                    </Badge>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setCartOpen(false)}
                  className="text-white/40 hover:text-white transition-colors"
                  data-ocid="customer.cart.close_button"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cart Items */}
              <ScrollArea className="flex-1 px-5 py-4">
                {cart.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    data-ocid="customer.cart.empty_state"
                  >
                    <p className="text-4xl mb-3">🛒</p>
                    <p className="text-white/50">Your cart is empty</p>
                    <p className="text-white/30 text-sm mt-1">
                      Add some delicious dishes!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/8"
                        data-ocid={`customer.cart.item.${i + 1}`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {item.name}
                          </p>
                          <p className="text-amber-400 text-sm font-bold">
                            ₹{item.price * item.qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-white/10 text-white/70 flex items-center justify-center hover:bg-orange-500/30 transition-all"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-white text-sm w-4 text-center">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all"
                          >
                            <Plus size={10} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCart((p) => p.filter((c) => c.id !== item.id))
                            }
                            className="w-6 h-6 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500/40 transition-all ml-1"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="px-5 py-4 border-t border-orange-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span className="text-amber-400 font-bold text-lg">
                      ₹{cartTotal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/40">GST (5%)</span>
                    <span className="text-white/60">
                      ₹{Math.round(cartTotal * 0.05)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-amber-400 text-xl">
                      ₹{Math.round(cartTotal * 1.05)}
                    </span>
                  </div>
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-5 rounded-xl shadow-lg shadow-orange-500/30"
                    data-ocid="customer.cart.submit_button"
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Place Order via WhatsApp
                  </Button>
                  <p className="text-center text-white/30 text-xs">
                    You'll be redirected to WhatsApp to confirm
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
