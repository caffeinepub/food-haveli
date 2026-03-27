// Mock API Service — simulates backend with realistic delays

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export interface Order {
  id: string;
  item: string;
  table: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  amount: number;
  time: string;
}

export interface Analytics {
  totalOrders: number;
  revenue: number;
  popularDishes: { name: string; count: number }[];
  peakHour: string;
  retention: number;
  avgOrderValue: number;
}

export interface SearchResult {
  menuItems: { name: string; price: number; category: string }[];
  pages: string[];
  features: string[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: "#1042",
    item: "Butter Chicken + Naan",
    table: 4,
    status: "preparing",
    amount: 380,
    time: "2 min ago",
  },
  {
    id: "#1041",
    item: "Chicken Biryani",
    table: 7,
    status: "ready",
    amount: 280,
    time: "8 min ago",
  },
  {
    id: "#1040",
    item: "Paneer Tikka + Lassi",
    table: 2,
    status: "delivered",
    amount: 380,
    time: "15 min ago",
  },
  {
    id: "#1039",
    item: "Dal Makhani + Roti",
    table: 1,
    status: "delivered",
    amount: 280,
    time: "22 min ago",
  },
  {
    id: "#1038",
    item: "Chicken Tikka Masala",
    table: 5,
    status: "delivered",
    amount: 350,
    time: "35 min ago",
  },
  {
    id: "#1037",
    item: "Gulab Jamun x2",
    table: 3,
    status: "delivered",
    amount: 300,
    time: "48 min ago",
  },
  {
    id: "#1036",
    item: "Garlic Naan x3 + Butter Chicken",
    table: 6,
    status: "delivered",
    amount: 500,
    time: "1 hr ago",
  },
  {
    id: "#1035",
    item: "Mango Lassi + Biryani",
    table: 8,
    status: "delivered",
    amount: 400,
    time: "1.5 hr ago",
  },
  {
    id: "#1034",
    item: "Paneer Tikka",
    table: 9,
    status: "delivered",
    amount: 260,
    time: "2 hr ago",
  },
  {
    id: "#1033",
    item: "Dal Makhani",
    table: 10,
    status: "delivered",
    amount: 220,
    time: "2.5 hr ago",
  },
];

const ALL_MENU_ITEMS = [
  { name: "Butter Chicken", price: 320, category: "Mains" },
  { name: "Chicken Tikka Masala", price: 350, category: "Mains" },
  { name: "Biryani", price: 280, category: "Mains" },
  { name: "Paneer Tikka", price: 260, category: "Mains" },
  { name: "Dal Makhani", price: 220, category: "Mains" },
  { name: "Garlic Naan", price: 60, category: "Breads" },
  { name: "Mango Lassi", price: 120, category: "Drinks" },
  { name: "Gulab Jamun", price: 150, category: "Desserts" },
];

const ALL_FEATURES = [
  "Online Ordering",
  "AI Chatbot",
  "Analytics Dashboard",
  "Voice Commands",
  "Real-time Notifications",
  "Command Palette",
  "Nearby Map",
  "Smart Demand Prediction",
  "Custom Domain",
  "Multi-location Support",
];

const ALL_PAGES = ["Dashboard", "Menu", "Admin", "Map", "Pricing"];

export async function getOrders(): Promise<Order[]> {
  await delay(rand(300, 600));
  return MOCK_ORDERS;
}

export async function getAnalytics(): Promise<Analytics> {
  await delay(rand(400, 800));
  return {
    totalOrders: 1042,
    revenue: 284500,
    popularDishes: [
      { name: "Butter Chicken", count: 342 },
      { name: "Biryani", count: 289 },
      { name: "Paneer Tikka", count: 198 },
      { name: "Dal Makhani", count: 156 },
    ],
    peakHour: "7 PM – 9 PM",
    retention: 78,
    avgOrderValue: 485,
  };
}

export async function postOrder(item: string, qty: number): Promise<Order> {
  await delay(rand(300, 600));
  return {
    id: `#${rand(1043, 1099)}`,
    item: `${item} x${qty}`,
    table: rand(1, 12),
    status: "pending",
    amount: rand(150, 650),
    time: "just now",
  };
}

export async function searchAll(query: string): Promise<SearchResult> {
  await delay(rand(150, 300));
  const q = query.toLowerCase();
  if (!q.trim()) return { menuItems: [], pages: [], features: [] };
  return {
    menuItems: ALL_MENU_ITEMS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    ),
    pages: ALL_PAGES.filter((p) => p.toLowerCase().includes(q)),
    features: ALL_FEATURES.filter((f) => f.toLowerCase().includes(q)),
  };
}
