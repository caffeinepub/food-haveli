import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  image: string;
  popular: boolean;
  available: boolean;
  rating: number;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  gstin: string;
  email: string;
  openHours: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  badge: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

export interface VendorRestaurant {
  id: number;
  name: string;
  ownerName: string;
  phone: string;
  cuisine: string;
  plan: string;
  status: "active" | "pending" | "suspended";
  joinedDate: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: string;
  amount: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  time: string;
  table: number;
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Butter Chicken",
    category: "Mains",
    price: 320,
    desc: "Tender chicken in a rich, creamy tomato-based gravy.",
    rating: 4.9,
    image: "/assets/generated/butter-chicken.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 2,
    name: "Chicken Tikka Masala",
    category: "Mains",
    price: 350,
    desc: "Marinated chicken in spiced masala sauce.",
    rating: 4.8,
    image: "/assets/generated/chicken-tikka-masala.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 3,
    name: "Dal Makhani",
    category: "Mains",
    price: 220,
    desc: "Slow-cooked black lentils in butter and cream.",
    rating: 4.7,
    image: "/assets/generated/dal-makhani.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 4,
    name: "Paneer Tikka",
    category: "Mains",
    price: 260,
    desc: "Grilled cottage cheese in tandoori spices.",
    rating: 4.8,
    image: "/assets/generated/paneer-tikka.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 5,
    name: "Biryani",
    category: "Mains",
    price: 280,
    desc: "Fragrant basmati rice with aromatic spices.",
    rating: 4.9,
    image: "/assets/generated/biryani.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 6,
    name: "Palak Paneer",
    category: "Mains",
    price: 240,
    desc: "Fresh spinach gravy with soft paneer cubes.",
    rating: 4.6,
    image: "/assets/generated/palak-paneer.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 7,
    name: "Chole Bhature",
    category: "Mains",
    price: 180,
    desc: "Spicy chickpea curry with fluffy fried bread.",
    rating: 4.8,
    image: "/assets/generated/chole-bhature.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 8,
    name: "Shahi Paneer",
    category: "Mains",
    price: 280,
    desc: "Cottage cheese in a rich royal mughlai gravy.",
    rating: 4.7,
    image: "/assets/generated/shahi-paneer.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 9,
    name: "Rajma Masala",
    category: "Mains",
    price: 200,
    desc: "Kidney beans in a tangy tomato gravy.",
    rating: 4.6,
    image: "/assets/generated/rajma-masala.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 10,
    name: "Masala Dosa",
    category: "Mains",
    price: 160,
    desc: "Crispy crepe filled with spiced potato filling.",
    rating: 4.7,
    image: "/assets/generated/masala-dosa.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 11,
    name: "Tandoori Chicken",
    category: "Mains",
    price: 380,
    desc: "Whole chicken marinated and cooked in tandoor.",
    rating: 4.9,
    image: "/assets/generated/tandoori-chicken.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 12,
    name: "Mutton Biryani",
    category: "Mains",
    price: 420,
    desc: "Slow-cooked mutton with saffron basmati rice.",
    rating: 4.8,
    image: "/assets/generated/mutton-biryani.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 13,
    name: "Garlic Naan",
    category: "Breads",
    price: 60,
    desc: "Soft leavened bread with garlic and butter.",
    rating: 4.8,
    image: "/assets/generated/garlic-naan.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 14,
    name: "Aloo Paratha",
    category: "Breads",
    price: 80,
    desc: "Whole wheat flatbread stuffed with spiced potato.",
    rating: 4.7,
    image: "/assets/generated/aloo-paratha.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 15,
    name: "Kulcha",
    category: "Breads",
    price: 70,
    desc: "Leavened bread baked in tandoor.",
    rating: 4.6,
    image: "/assets/generated/kulcha.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 16,
    name: "Pani Puri",
    category: "Snacks",
    price: 80,
    desc: "Hollow crispy balls filled with spicy tamarind water.",
    rating: 4.8,
    image: "/assets/generated/pani-puri.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 17,
    name: "Samosa",
    category: "Snacks",
    price: 40,
    desc: "Golden fried pastry with spiced potato filling.",
    rating: 4.7,
    image: "/assets/generated/samosa.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 18,
    name: "Mango Lassi",
    category: "Drinks",
    price: 120,
    desc: "Chilled yogurt drink blended with fresh mango.",
    rating: 4.9,
    image: "/assets/generated/mango-lassi.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 19,
    name: "Lassi",
    category: "Drinks",
    price: 80,
    desc: "Classic chilled yogurt-based drink.",
    rating: 4.7,
    image: "/assets/generated/lassi.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 20,
    name: "Gulab Jamun",
    category: "Desserts",
    price: 150,
    desc: "Soft milk dumplings soaked in rose-flavored syrup.",
    rating: 4.9,
    image: "/assets/generated/gulab-jamun.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 21,
    name: "Kheer",
    category: "Desserts",
    price: 120,
    desc: "Creamy rice pudding with cardamom and dry fruits.",
    rating: 4.8,
    image: "/assets/generated/kheer.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 22,
    name: "Rasmalai",
    category: "Desserts",
    price: 160,
    desc: "Soft paneer patties soaked in saffron milk.",
    rating: 4.9,
    image: "/assets/generated/rasmalai.dim_400x300.jpg",
    popular: true,
    available: true,
  },
  {
    id: 23,
    name: "Rajma Chawal",
    category: "Mains",
    price: 180,
    desc: "Comfort food — rajma curry with steamed rice.",
    rating: 4.6,
    image: "/assets/generated/rajma-chawal.dim_400x300.jpg",
    popular: false,
    available: true,
  },
  {
    id: 24,
    name: "Chicken Biryani",
    category: "Mains",
    price: 300,
    desc: "Aromatic chicken biryani with fried onions.",
    rating: 4.8,
    image: "/assets/generated/biryani.dim_400x300.jpg",
    popular: true,
    available: true,
  },
];

const DEFAULT_RESTAURANT_INFO: RestaurantInfo = {
  name: "Food Haveli",
  tagline: "Order Fresh. Eat Happy. Track Every Bite.",
  address: "Connaught Place, New Delhi – 110001",
  phone: "+91-98765-43210",
  gstin: "07AABCU9603R1ZX",
  email: "hello@foodhaveli.in",
  openHours: "10 AM – 11 PM",
};

const DEFAULT_PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "Free",
    badge: "",
    features: [
      "Online menu",
      "Up to 50 orders/month",
      "Basic analytics",
      "Email support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    id: "growth",
    name: "Growth",
    price: "₹999/month",
    badge: "Recommended",
    features: [
      "Everything in Starter",
      "Unlimited orders",
      "Advanced analytics",
      "AI chatbot",
      "Priority support",
      "Custom domain",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "₹2,499/month",
    badge: "",
    features: [
      "Everything in Growth",
      "Multi-location support",
      "White-label solution",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const DEFAULT_VENDORS: VendorRestaurant[] = [
  {
    id: 1,
    name: "Spice Garden",
    ownerName: "Amit Kumar",
    phone: "+91-98100-11111",
    cuisine: "North Indian",
    plan: "Growth",
    status: "active",
    joinedDate: "2026-01-15",
  },
  {
    id: 2,
    name: "Mumbai Tiffins",
    ownerName: "Priya Nair",
    phone: "+91-98200-22222",
    cuisine: "Maharashtrian",
    plan: "Starter",
    status: "active",
    joinedDate: "2026-02-01",
  },
  {
    id: 3,
    name: "Cloud Kitchen Co.",
    ownerName: "Rahul Singh",
    phone: "+91-98300-33333",
    cuisine: "Multi-Cuisine",
    plan: "Enterprise",
    status: "active",
    joinedDate: "2025-12-10",
  },
  {
    id: 4,
    name: "Street Bites",
    ownerName: "Sneha Patel",
    phone: "+91-98400-44444",
    cuisine: "Street Food",
    plan: "Starter",
    status: "pending",
    joinedDate: "2026-03-01",
  },
  {
    id: 5,
    name: "Royal Dine",
    ownerName: "Vikram Mehta",
    phone: "+91-98500-55555",
    cuisine: "Mughlai",
    plan: "Growth",
    status: "suspended",
    joinedDate: "2025-11-20",
  },
];

const DEFAULT_ORDERS: Order[] = [
  {
    id: "FH-001",
    customerName: "Rahul Sharma",
    items: "Butter Chicken, Naan x2",
    amount: 440,
    status: "delivered",
    time: "12:30 PM",
    table: 4,
  },
  {
    id: "FH-002",
    customerName: "Priya Verma",
    items: "Biryani, Lassi",
    amount: 360,
    status: "preparing",
    time: "1:15 PM",
    table: 7,
  },
  {
    id: "FH-003",
    customerName: "Amit Gupta",
    items: "Paneer Tikka, Dal Makhani",
    amount: 480,
    status: "ready",
    time: "1:45 PM",
    table: 2,
  },
  {
    id: "FH-004",
    customerName: "Sunita Rao",
    items: "Masala Dosa, Samosa x3",
    amount: 280,
    status: "pending",
    time: "2:00 PM",
    table: 9,
  },
  {
    id: "FH-005",
    customerName: "Deepak Joshi",
    items: "Mutton Biryani, Gulab Jamun",
    amount: 570,
    status: "delivered",
    time: "11:00 AM",
    table: 1,
  },
  {
    id: "FH-006",
    customerName: "Kavita Singh",
    items: "Chole Bhature x2",
    amount: 360,
    status: "preparing",
    time: "2:20 PM",
    table: 5,
  },
  {
    id: "FH-007",
    customerName: "Raj Malhotra",
    items: "Tandoori Chicken, Garlic Naan",
    amount: 440,
    status: "pending",
    time: "2:35 PM",
    table: 3,
  },
  {
    id: "FH-008",
    customerName: "Neha Khanna",
    items: "Mango Lassi x2, Kheer",
    amount: 360,
    status: "delivered",
    time: "10:30 AM",
    table: 6,
  },
  {
    id: "FH-009",
    customerName: "Ankit Sharma",
    items: "Shahi Paneer, Kulcha x2",
    amount: 420,
    status: "ready",
    time: "3:00 PM",
    table: 8,
  },
  {
    id: "FH-010",
    customerName: "Ritu Agarwal",
    items: "Rasmalai, Gulab Jamun",
    amount: 310,
    status: "delivered",
    time: "9:45 AM",
    table: 10,
  },
];

const STORAGE_KEY = "foodhaveli_cms";

interface CMSState {
  menuItems: MenuItem[];
  restaurantInfo: RestaurantInfo;
  pricingPlans: PricingPlan[];
  vendors: VendorRestaurant[];
  orders: Order[];
}

interface CMSContextValue extends CMSState {
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: number, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: number) => void;
  updateRestaurantInfo: (info: Partial<RestaurantInfo>) => void;
  addPricingPlan: (plan: Omit<PricingPlan, "id">) => void;
  updatePricingPlan: (id: string, plan: Partial<PricingPlan>) => void;
  deletePricingPlan: (id: string) => void;
  addVendor: (vendor: Omit<VendorRestaurant, "id">) => void;
  updateVendor: (id: number, vendor: Partial<VendorRestaurant>) => void;
  deleteVendor: (id: number) => void;
  updateOrderStatus: (id: string, status: Order["status"]) => void;
}

const CMSContext = createContext<CMSContextValue | null>(null);

function loadState(): CMSState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        menuItems: parsed.menuItems ?? DEFAULT_MENU_ITEMS,
        restaurantInfo: parsed.restaurantInfo ?? DEFAULT_RESTAURANT_INFO,
        pricingPlans: parsed.pricingPlans ?? DEFAULT_PRICING_PLANS,
        vendors: parsed.vendors ?? DEFAULT_VENDORS,
        orders: parsed.orders ?? DEFAULT_ORDERS,
      };
    }
  } catch {
    /* ignore */
  }
  return {
    menuItems: DEFAULT_MENU_ITEMS,
    restaurantInfo: DEFAULT_RESTAURANT_INFO,
    pricingPlans: DEFAULT_PRICING_PLANS,
    vendors: DEFAULT_VENDORS,
    orders: DEFAULT_ORDERS,
  };
}

export function CMSProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CMSState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addMenuItem = useCallback((item: Omit<MenuItem, "id">) => {
    setState((prev) => ({
      ...prev,
      menuItems: [...prev.menuItems, { ...item, id: Date.now() }],
    }));
  }, []);

  const updateMenuItem = useCallback((id: number, item: Partial<MenuItem>) => {
    setState((prev) => ({
      ...prev,
      menuItems: prev.menuItems.map((m) =>
        m.id === id ? { ...m, ...item } : m,
      ),
    }));
  }, []);

  const deleteMenuItem = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      menuItems: prev.menuItems.filter((m) => m.id !== id),
    }));
  }, []);

  const updateRestaurantInfo = useCallback((info: Partial<RestaurantInfo>) => {
    setState((prev) => ({
      ...prev,
      restaurantInfo: { ...prev.restaurantInfo, ...info },
    }));
  }, []);

  const addPricingPlan = useCallback((plan: Omit<PricingPlan, "id">) => {
    setState((prev) => ({
      ...prev,
      pricingPlans: [
        ...prev.pricingPlans,
        { ...plan, id: `plan_${Date.now()}` },
      ],
    }));
  }, []);

  const updatePricingPlan = useCallback(
    (id: string, plan: Partial<PricingPlan>) => {
      setState((prev) => ({
        ...prev,
        pricingPlans: prev.pricingPlans.map((p) =>
          p.id === id ? { ...p, ...plan } : p,
        ),
      }));
    },
    [],
  );

  const deletePricingPlan = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      pricingPlans: prev.pricingPlans.filter((p) => p.id !== id),
    }));
  }, []);

  const addVendor = useCallback((vendor: Omit<VendorRestaurant, "id">) => {
    setState((prev) => ({
      ...prev,
      vendors: [...prev.vendors, { ...vendor, id: Date.now() }],
    }));
  }, []);

  const updateVendor = useCallback(
    (id: number, vendor: Partial<VendorRestaurant>) => {
      setState((prev) => ({
        ...prev,
        vendors: prev.vendors.map((v) =>
          v.id === id ? { ...v, ...vendor } : v,
        ),
      }));
    },
    [],
  );

  const deleteVendor = useCallback((id: number) => {
    setState((prev) => ({
      ...prev,
      vendors: prev.vendors.filter((v) => v.id !== id),
    }));
  }, []);

  const updateOrderStatus = useCallback(
    (id: string, status: Order["status"]) => {
      setState((prev) => ({
        ...prev,
        orders: prev.orders.map((o) => (o.id === id ? { ...o, status } : o)),
      }));
    },
    [],
  );

  return (
    <CMSContext.Provider
      value={{
        ...state,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        updateRestaurantInfo,
        addPricingPlan,
        updatePricingPlan,
        deletePricingPlan,
        addVendor,
        updateVendor,
        deleteVendor,
        updateOrderStatus,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used within CMSProvider");
  return ctx;
}
