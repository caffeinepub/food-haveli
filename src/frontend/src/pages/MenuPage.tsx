import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useCMS } from "../context/CMSContext";

const CATEGORIES = ["All", "Mains", "Breads", "Drinks", "Desserts", "Snacks"];

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const { menuItems } = useCMS();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      if (item.available === false) return false;
      const matchCat =
        activeCategory === "All" || item.category === activeCategory;
      const matchSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, activeCategory, search]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

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
          qty: 1,
          image: item.image,
        },
      ];
    });
    toast.success(`🍻 ${item.name} added to cart!`);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const placeOrder = () => {
    if (cart.length === 0) return;
    toast.success("🎉 Order placed! Confirmation sent to your phone.");
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-foreground">
              Food Haveli <span className="text-gold">Menu</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Authentic North Indian cuisine · Open until 11 PM
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                data-ocid="menu.search_input"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-64 bg-card border-border"
              />
            </div>
            <Button
              data-ocid="menu.primary_button"
              onClick={() => setCartOpen(true)}
              className="bg-gold hover:bg-gold/90 text-black font-semibold relative"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <Filter className="w-4 h-4 text-muted-foreground mt-2" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              data-ocid="menu.tab"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-gold text-black"
                  : "bg-card text-muted-foreground hover:bg-gold/10 hover:text-gold border border-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        {filtered.length === 0 ? (
          <div data-ocid="menu.empty_state" className="text-center py-20">
            <p className="text-4xl mb-4">🍽️</p>
            <p className="text-muted-foreground">
              No dishes found. Try a different search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item, i) => {
              const cartItem = cart.find((c) => c.id === item.id);
              return (
                <div
                  key={item.id}
                  data-ocid={`menu.item.${i + 1}`}
                  className="card-neon rounded-2xl overflow-hidden group"
                >
                  {/* Food image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    {item.popular && (
                      <Badge className="absolute top-2 left-2 bg-gold text-black text-xs font-bold border-0">
                        Popular
                      </Badge>
                    )}
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span className="text-xs text-white font-bold">
                        {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-sm mb-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {item.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-gold">
                        ₹{item.price}
                      </span>
                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            data-ocid={`menu.secondary_button.${i + 1}`}
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3 text-foreground" />
                          </button>
                          <span className="text-foreground font-bold text-sm w-4 text-center">
                            {cartItem.qty}
                          </span>
                          <button
                            type="button"
                            data-ocid={`menu.primary_button.${i + 1}`}
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-gold hover:bg-gold/90 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3 text-black" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          data-ocid={`menu.primary_button.${i + 1}`}
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gold hover:bg-gold/90 text-black text-xs font-bold transition-all hover:scale-105"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close cart"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm w-full"
            onClick={() => setCartOpen(false)}
          />
          <div
            data-ocid="cart.sheet"
            className="relative w-full max-w-sm bg-card border-l border-border h-full flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-gold" />
                Your Cart ({cartCount} items)
              </h2>
              <button
                type="button"
                data-ocid="cart.close_button"
                onClick={() => setCartOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div data-ocid="cart.empty_state" className="text-center py-12">
                  <p className="text-4xl mb-3">🛒</p>
                  <p className="text-muted-foreground text-sm">
                    Your cart is empty
                  </p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div
                    key={item.id}
                    data-ocid={`cart.item.${i + 1}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop";
                      }}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.name}
                      </p>
                      <p className="text-xs text-gold">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 text-foreground" />
                      </button>
                      <span className="text-foreground text-sm">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="w-6 h-6 rounded-full bg-gold flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 text-black" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold text-foreground">
                    ₹{cartTotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-green-400 text-sm">Free</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-gold text-lg">
                    ₹{cartTotal}
                  </span>
                </div>
                <Button
                  data-ocid="cart.submit_button"
                  onClick={placeOrder}
                  className="w-full bg-gold hover:bg-gold/90 text-black font-bold py-5 rounded-xl"
                >
                  Place Order · ₹{cartTotal}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
