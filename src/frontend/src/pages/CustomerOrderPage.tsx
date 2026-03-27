import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
  Star,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Page } from "../App";

const MENU_ITEMS = [
  {
    id: 1,
    name: "Butter Chicken",
    category: "Non-Veg",
    price: 320,
    desc: "Tender chicken in velvety tomato-cream sauce with aromatic spices.",
    image: "/assets/generated/butter-chicken.dim_400x300.jpg",
    rating: 4.8,
    popular: true,
    veg: false,
  },
  {
    id: 2,
    name: "Chicken Biryani",
    category: "Non-Veg",
    price: 280,
    desc: "Fragrant basmati rice layered with spiced chicken and saffron.",
    image: "/assets/generated/biryani.dim_400x300.jpg",
    rating: 4.9,
    popular: true,
    veg: false,
  },
  {
    id: 3,
    name: "Paneer Tikka",
    category: "Veg",
    price: 240,
    desc: "Smoky marinated paneer cubes grilled in a clay tandoor.",
    image: "/assets/generated/paneer-tikka.dim_400x300.jpg",
    rating: 4.7,
    popular: false,
    veg: true,
  },
  {
    id: 4,
    name: "Dal Makhani",
    category: "Veg",
    price: 180,
    desc: "Slow-cooked black lentils in buttery tomato gravy, simmered for 24 hours.",
    image: "/assets/generated/dal-makhani.dim_400x300.jpg",
    rating: 4.6,
    popular: false,
    veg: true,
  },
  {
    id: 5,
    name: "Garlic Naan",
    category: "Veg",
    price: 60,
    desc: "Soft tandoor-baked flatbread topped with fresh garlic and coriander butter.",
    image: "/assets/generated/garlic-naan.dim_400x300.jpg",
    rating: 4.7,
    popular: false,
    veg: true,
  },
  {
    id: 6,
    name: "Kheer",
    category: "Desserts",
    price: 120,
    desc: "Slow-simmered rice pudding with saffron, cardamom, and crushed pistachios.",
    image: "/assets/generated/kheer.dim_400x300.jpg",
    rating: 4.8,
    popular: false,
    veg: true,
  },
  {
    id: 7,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 100,
    desc: "Soft milk-solid dumplings soaked in rose-flavored sugar syrup.",
    image: "/assets/generated/gulab-jamun.dim_400x300.jpg",
    rating: 4.8,
    popular: true,
    veg: true,
  },
  {
    id: 8,
    name: "Mango Lassi",
    category: "Drinks",
    price: 90,
    desc: "Thick creamy mango yogurt drink. Pure tropical bliss.",
    image: "/assets/generated/mango-lassi.dim_400x300.jpg",
    rating: 4.9,
    popular: true,
    veg: true,
  },
  {
    id: 9,
    name: "Chicken Tikka Masala",
    category: "Non-Veg",
    price: 340,
    desc: "Chargrilled chicken in rich, tangy tomato-cream masala sauce.",
    image: "/assets/generated/chicken-tikka-masala.dim_400x300.jpg",
    rating: 4.8,
    popular: false,
    veg: false,
  },
  {
    id: 10,
    name: "Tandoori Chicken",
    category: "Non-Veg",
    price: 380,
    desc: "Whole chicken marinated in yogurt and spices, charred in clay oven.",
    image: "/assets/generated/tandoori-chicken.dim_400x300.jpg",
    rating: 4.9,
    popular: true,
    veg: false,
  },
  {
    id: 11,
    name: "Palak Paneer",
    category: "Veg",
    price: 220,
    desc: "Creamy spinach curry with soft paneer cubes. Nutritious and delicious.",
    image: "/assets/generated/palak-paneer.dim_400x300.jpg",
    rating: 4.6,
    popular: false,
    veg: true,
  },
  {
    id: 12,
    name: "Shahi Paneer",
    category: "Veg",
    price: 260,
    desc: "Royal Mughlai-style paneer in rich cream and saffron gravy.",
    image: "/assets/generated/shahi-paneer.dim_400x300.jpg",
    rating: 4.7,
    popular: false,
    veg: true,
  },
  {
    id: 13,
    name: "Aloo Paratha",
    category: "Veg",
    price: 140,
    desc: "Spiced potato-filled flatbread pan-fried with ghee.",
    image: "/assets/generated/aloo-paratha.dim_400x300.jpg",
    rating: 4.7,
    popular: false,
    veg: true,
  },
  {
    id: 14,
    name: "Masala Dosa",
    category: "Veg",
    price: 160,
    desc: "Crispy rice crepe filled with spiced potato, served with chutney.",
    image: "/assets/generated/masala-dosa.dim_400x300.jpg",
    rating: 4.6,
    popular: false,
    veg: true,
  },
  {
    id: 15,
    name: "Chole Bhature",
    category: "Veg",
    price: 180,
    desc: "Fluffy deep-fried bread with spiced chickpea curry.",
    image: "/assets/generated/chole-bhature.dim_400x300.jpg",
    rating: 4.7,
    popular: true,
    veg: true,
  },
  {
    id: 16,
    name: "Rajma Chawal",
    category: "Veg",
    price: 200,
    desc: "Red kidney bean curry served over steamed basmati rice.",
    image: "/assets/generated/rajma-chawal.dim_400x300.jpg",
    rating: 4.5,
    popular: false,
    veg: true,
  },
  {
    id: 17,
    name: "Samosa",
    category: "Veg",
    price: 60,
    desc: "Crispy pastry filled with spiced potato and peas, with mint chutney.",
    image: "/assets/generated/samosa.dim_400x300.jpg",
    rating: 4.7,
    popular: true,
    veg: true,
  },
  {
    id: 18,
    name: "Pani Puri",
    category: "Veg",
    price: 80,
    desc: "Crispy hollow puris filled with spiced water and tamarind chutney.",
    image: "/assets/generated/pani-puri.dim_400x300.jpg",
    rating: 4.8,
    popular: true,
    veg: true,
  },
  {
    id: 19,
    name: "Mutton Biryani",
    category: "Non-Veg",
    price: 380,
    desc: "Slow-dum cooked basmati rice with succulent mutton and whole spices.",
    image: "/assets/generated/mutton-biryani.dim_400x300.jpg",
    rating: 4.9,
    popular: true,
    veg: false,
  },
  {
    id: 20,
    name: "Rasmalai",
    category: "Desserts",
    price: 140,
    desc: "Soft cottage cheese patties soaked in saffron-infused sweetened milk.",
    image: "/assets/generated/rasmalai.dim_400x300.jpg",
    rating: 4.9,
    popular: false,
    veg: true,
  },
];

const CATEGORIES = ["All", "Veg", "Non-Veg", "Drinks", "Desserts"];

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface CustomerOrderPageProps {
  onNavigate: (page: Page) => void;
}

export default function CustomerOrderPage({
  onNavigate,
}: CustomerOrderPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState("cod");

  const filteredItems =
    activeCategory === "All"
      ? MENU_ITEMS
      : activeCategory === "Veg"
        ? MENU_ITEMS.filter((i) => i.veg)
        : activeCategory === "Non-Veg"
          ? MENU_ITEMS.filter((i) => !i.veg)
          : MENU_ITEMS.filter((i) => i.category === activeCategory);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (item: (typeof MENU_ITEMS)[0]) => {
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
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0),
    );
  };

  const getItemQty = (id: number) => cart.find((c) => c.id === id)?.qty ?? 0;

  const handlePlaceOrder = () => {
    if (!name || !phone || !address) return;
    const invoiceNum = `FH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
      invoiceNumber: invoiceNum,
      date: new Date().toISOString(),
      customer: { name, phone, address },
      items: cart,
      subtotal: cartTotal,
      gst: Math.round(cartTotal * 0.05),
      deliveryFee: 40,
      total: cartTotal + Math.round(cartTotal * 0.05) + 40,
      payment,
    };
    localStorage.setItem("fh_order", JSON.stringify(orderData));
    onNavigate("invoice" as Page);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div
        className="py-10 px-4 text-white"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.38 0.18 30), oklch(0.45 0.20 45), oklch(0.52 0.17 60))",
        }}
      >
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-black">
                Food Haveli – Order Online
              </h1>
              <div className="flex items-center gap-4 text-sm text-white/80 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Connaught Place, New Delhi
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" /> +91-98765-43210
                </span>
              </div>
            </div>
          </div>
          <p className="text-white/70 text-sm mt-2">
            Order Fresh. Eat Happy. Track Every Bite. 🍴
          </p>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Menu */}
          <div className="flex-1">
            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  data-ocid="order.tab"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    activeCategory === cat
                      ? "text-white shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:border-orange-500/30"
                  }`}
                  style={
                    activeCategory === cat
                      ? {
                          background:
                            "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
                        }
                      : undefined
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item, idx) => {
                const qty = getItemQty(item.id);
                return (
                  <div
                    key={item.id}
                    data-ocid={`order.item.${idx + 1}`}
                    className="bg-card border border-border rounded-2xl overflow-hidden hover:border-orange-500/30 transition-all hover:shadow-lg group"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.popular && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 text-white border-0 text-xs">
                          🔥 Popular
                        </Badge>
                      )}
                      <div
                        className={`absolute top-3 right-3 w-5 h-5 rounded-sm border-2 flex items-center justify-center ${
                          item.veg
                            ? "border-green-500 bg-green-500/20"
                            : "border-red-500 bg-red-500/20"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${item.veg ? "bg-green-500" : "bg-red-500"}`}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-foreground text-sm">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {item.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        {item.desc}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className="font-black text-lg"
                          style={{ color: "oklch(0.55 0.22 30)" }}
                        >
                          ₹{item.price}
                        </span>
                        {qty === 0 ? (
                          <button
                            type="button"
                            data-ocid="order.primary_button"
                            onClick={() => addToCart(item)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90"
                            style={{
                              background:
                                "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
                            }}
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              data-ocid="order.secondary_button"
                              onClick={() => updateQty(item.id, -1)}
                              className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold text-foreground w-5 text-center">
                              {qty}
                            </span>
                            <button
                              type="button"
                              data-ocid="order.primary_button"
                              onClick={() => updateQty(item.id, 1)}
                              className="w-7 h-7 rounded-full text-white flex items-center justify-center transition-colors"
                              style={{ background: "oklch(0.55 0.22 30)" }}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart sidebar (desktop) */}
          <div className="hidden lg:flex flex-col w-80 shrink-0">
            <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden">
              <div
                className="px-5 py-4 text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.38 0.18 30), oklch(0.50 0.20 50))",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Your Cart
                  </span>
                  {cartCount > 0 && (
                    <Badge className="bg-white/20 text-white border-0">
                      {cartCount} items
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-5">
                {cart.length === 0 ? (
                  <div
                    data-ocid="order.empty_state"
                    className="text-center py-8"
                  >
                    <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">
                      Your cart is empty
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Add items to get started
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          data-ocid="order.row"
                          className="flex items-center gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ₹{item.price} × {item.qty}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, -1)}
                              className="w-5 h-5 rounded-full border border-border flex items-center justify-center hover:bg-accent"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQty(item.id, 1)}
                              className="w-5 h-5 rounded-full text-white flex items-center justify-center"
                              style={{ background: "oklch(0.55 0.22 30)" }}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GST (5%)</span>
                        <span className="font-semibold">
                          ₹{Math.round(cartTotal * 0.05)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Delivery Fee
                        </span>
                        <span className="font-semibold">₹40</span>
                      </div>
                      <div className="flex justify-between text-base font-black mt-2 pt-2 border-t border-border">
                        <span>Total</span>
                        <span style={{ color: "oklch(0.55 0.22 30)" }}>
                          ₹{cartTotal + Math.round(cartTotal * 0.05) + 40}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      data-ocid="order.primary_button"
                      onClick={() => setCheckoutOpen(true)}
                      className="mt-4 w-full py-3 rounded-xl text-white font-bold transition-all hover:opacity-90"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
                      }}
                    >
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile cart button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 lg:hidden">
          <button
            type="button"
            data-ocid="order.primary_button"
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.38 0.18 30), oklch(0.50 0.20 50))",
            }}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{cartCount} items</span>
            <span className="text-white/80">·</span>
            <span>₹{cartTotal + Math.round(cartTotal * 0.05) + 40}</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mobile cart sheet */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setCartOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setCartOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close cart"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Your Cart</h3>
              <button type="button" onClick={() => setCartOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {cart.map((item) => (
              <div key={item.id} className="flex items-center gap-3 mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{item.price} × {item.qty}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    className="w-7 h-7 rounded-full border flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    className="w-7 h-7 rounded-full text-white flex items-center justify-center"
                    style={{ background: "oklch(0.55 0.22 30)" }}
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (5%)</span>
                <span>₹{Math.round(cartTotal * 0.05)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span>₹40</span>
              </div>
              <div className="flex justify-between font-black pt-2 border-t">
                <span>Total</span>
                <span style={{ color: "oklch(0.55 0.22 30)" }}>
                  ₹{cartTotal + Math.round(cartTotal * 0.05) + 40}
                </span>
              </div>
            </div>
            <button
              type="button"
              data-ocid="order.primary_button"
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              className="mt-4 w-full py-4 rounded-2xl text-white font-bold"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setCheckoutOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setCheckoutOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close checkout"
          />
          <div
            data-ocid="order.modal"
            className="relative bg-background rounded-3xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl">Complete Your Order</h3>
              <button
                type="button"
                data-ocid="order.close_button"
                onClick={() => setCheckoutOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="cust-name">Full Name *</Label>
                <Input
                  id="cust-name"
                  data-ocid="order.input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cust-phone">Phone Number *</Label>
                <Input
                  id="cust-phone"
                  data-ocid="order.input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="cust-address">Delivery Address *</Label>
                <Input
                  id="cust-address"
                  data-ocid="order.input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House no., Street, Area, City"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Payment Method</Label>
                <RadioGroup
                  value={payment}
                  onValueChange={setPayment}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-orange-500/30 transition-all">
                    <RadioGroupItem
                      data-ocid="order.radio"
                      value="cod"
                      id="cod"
                    />
                    <Label htmlFor="cod" className="cursor-pointer">
                      <span className="font-semibold">Cash on Delivery</span>
                      <p className="text-xs text-muted-foreground">
                        Pay when food arrives
                      </p>
                    </Label>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-orange-500/30 transition-all">
                    <RadioGroupItem
                      data-ocid="order.radio"
                      value="online"
                      id="online"
                    />
                    <Label htmlFor="online" className="cursor-pointer">
                      <span className="font-semibold">Online Payment</span>
                      <p className="text-xs text-muted-foreground">
                        UPI / Card / Net Banking
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Order Summary */}
              <div className="bg-muted/50 rounded-xl p-4">
                <p className="text-sm font-bold mb-2">Order Summary</p>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs text-muted-foreground mb-1"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-black text-sm">
                  <span>Grand Total</span>
                  <span style={{ color: "oklch(0.55 0.22 30)" }}>
                    ₹{cartTotal + Math.round(cartTotal * 0.05) + 40}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                data-ocid="order.submit_button"
                onClick={handlePlaceOrder}
                disabled={!name || !phone || !address}
                className="w-full py-6 rounded-xl font-black text-lg text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
                }}
              >
                🛔 Place Order ₹{cartTotal + Math.round(cartTotal * 0.05) + 40}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
