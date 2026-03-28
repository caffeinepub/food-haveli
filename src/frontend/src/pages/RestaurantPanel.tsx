import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  ChefHat,
  Eye,
  Home,
  LogOut,
  Minus,
  Moon,
  Plus,
  QrCode,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Sun,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useAuth } from "../context/AuthContext";
import { useCMS } from "../context/CMSContext";
import { useTheme } from "../context/ThemeContext";
import CMSPanel from "./CMSPanel";
import Dashboard from "./Dashboard";

const MENU_CATS = ["All", "Mains", "Breads", "Drinks", "Desserts", "Snacks"];

export default function RestaurantPanel() {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { orders, menuItems } = useCMS();

  const dummyNavigate = (_page: Page) => {};
  const [menuCategory, setMenuCategory] = useState("All");
  const [menuSearch, setMenuSearch] = useState("");
  const [previewCart, setPreviewCart] = useState<
    { id: number; name: string; price: number; image: string; qty: number }[]
  >([]);

  const filteredItems = menuItems.filter((item) => {
    const matchCat = menuCategory === "All" || item.category === menuCategory;
    const matchSearch =
      !menuSearch ||
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(menuSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const addPreviewItem = (item: (typeof menuItems)[0]) => {
    setPreviewCart((p) => {
      const existing = p.find((c) => c.id === item.id);
      if (existing)
        return p.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [
        ...p,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          qty: 1,
        },
      ];
    });
    toast.success(`${item.name} added!`);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.11_0.01_50)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-amber-500/20 bg-[oklch(0.14_0.02_60)] px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <ChefHat size={22} className="text-amber-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Restaurant Dashboard
              </h1>
              <p className="text-amber-300/60 text-xs">
                Haveli Kitchen — Manager View
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="hidden md:flex items-center gap-2 text-sm bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 text-green-300"
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {menuItems.length} menu items live
              </motion.div>
            </AnimatePresence>
            <Badge className="bg-amber-600/30 text-amber-200 border-amber-400/30">
              Restaurant Manager
            </Badge>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-amber-300 hover:text-amber-200 hover:bg-amber-500/10"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                toast.success("Welcome back to Food Haveli!");
              }}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 hover:border-amber-400/60 transition-all gap-1.5"
              data-ocid="restaurant.back_home.button"
            >
              <ArrowLeft size={15} />
              <Home size={14} />
              <span className="hidden sm:inline">Back to Home</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                toast.info("Logged out");
              }}
              className="text-white/60 hover:text-white hover:bg-white/10"
              data-ocid="restaurant.logout.button"
            >
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="menu">
          <TabsList
            className="bg-amber-500/10 border border-amber-500/20 mb-8 flex-wrap h-auto gap-1"
            data-ocid="restaurant.tab"
          >
            <TabsTrigger
              value="menu"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-300"
            >
              <UtensilsCrossed size={15} className="mr-1.5" /> Menu Manager
            </TabsTrigger>
            <TabsTrigger
              value="customer-view"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-300"
            >
              <Eye size={15} className="mr-1.5" /> Customer View
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-300"
            >
              <ShoppingBag size={15} className="mr-1.5" /> Live Orders
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-300"
            >
              <BarChart3 size={15} className="mr-1.5" /> Analytics
            </TabsTrigger>
            <TabsTrigger
              value="qr"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-300"
            >
              <QrCode size={15} className="mr-1.5" /> QR Code
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-300"
            >
              <Settings size={15} className="mr-1.5" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* MENU MANAGER */}
          <TabsContent value="menu">
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <CheckCircle size={16} className="text-green-400" />
              <span className="text-green-300 text-sm">
                Any menu item you add here is{" "}
                <strong>instantly visible to customers</strong> — live sync
                active
              </span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse ml-auto" />
            </div>
            <div className="rounded-xl border border-amber-500/20 overflow-hidden">
              <CMSPanel />
            </div>
          </TabsContent>

          {/* CUSTOMER VIEW */}
          <TabsContent value="customer-view">
            <div className="mb-5 flex items-center gap-2 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Eye size={18} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-amber-200 font-semibold text-sm">
                  Customer Menu Preview
                </p>
                <p className="text-amber-300/60 text-xs mt-0.5">
                  This is exactly how your customers see your menu — fully
                  interactive
                </p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-green-300 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Preview
              </div>
            </div>

            {/* Search + Category Filters */}
            <div className="mb-6">
              <div className="relative max-w-sm mb-4">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                />
                <Input
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  placeholder="Search dishes..."
                  className="pl-9 bg-white/5 border-amber-500/20 text-white placeholder:text-white/30 focus-visible:ring-amber-500/40"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {MENU_CATS.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMenuCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                      menuCategory === cat
                        ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-500/20"
                        : "bg-white/5 border-amber-500/20 text-amber-300/70 hover:text-amber-300 hover:border-amber-500/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredItems.map((item, i) => {
                const inCart = previewCart.find((c) => c.id === item.id);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`group rounded-2xl overflow-hidden border transition-all hover:shadow-xl hover:-translate-y-1 ${
                      item.available
                        ? "bg-white/5 border-white/[0.08] hover:border-amber-500/40 hover:shadow-amber-500/10"
                        : "bg-white/3 border-white/5 opacity-60"
                    }`}
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {item.popular && (
                        <span className="absolute top-3 left-3 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          🔥 Popular
                        </span>
                      )}
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500/90 text-white text-xs px-3 py-1 rounded-full font-semibold">
                            Unavailable
                          </span>
                        </div>
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
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white font-semibold text-sm leading-tight flex-1 mr-2">
                          {item.name}
                        </h3>
                        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs shrink-0">
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
                        {item.available ? (
                          inCart ? (
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewCart((p) =>
                                    p
                                      .map((c) =>
                                        c.id === item.id
                                          ? { ...c, qty: c.qty - 1 }
                                          : c,
                                      )
                                      .filter((c) => c.qty > 0),
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center hover:bg-amber-500/40 transition-all"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-white font-semibold text-sm w-5 text-center">
                                {inCart.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setPreviewCart((p) =>
                                    p.map((c) =>
                                      c.id === item.id
                                        ? { ...c, qty: c.qty + 1 }
                                        : c,
                                    ),
                                  )
                                }
                                className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-500 transition-all"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addPreviewItem(item)}
                              className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
                            >
                              <Plus size={12} /> Add
                            </button>
                          )
                        ) : (
                          <span className="text-white/30 text-xs">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Floating Cart Preview */}
            {previewCart.length > 0 && (
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
              >
                <div className="flex items-center gap-3 bg-amber-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-amber-500/40">
                  <ShoppingCart size={18} />
                  <span className="font-semibold">
                    {previewCart.reduce((s, c) => s + c.qty, 0)} items
                  </span>
                  <span className="text-amber-200">·</span>
                  <span className="font-bold">
                    ₹{previewCart.reduce((s, c) => s + c.price * c.qty, 0)}
                  </span>
                  <span className="text-amber-200 text-xs border border-amber-400/40 rounded-full px-2 py-0.5">
                    Customer Preview
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewCart([])}
                    className="w-5 h-5 rounded-full bg-amber-700/60 flex items-center justify-center hover:bg-amber-700 transition-all ml-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </TabsContent>

          {/* LIVE ORDERS */}
          <TabsContent value="orders">
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ShoppingBag size={18} className="text-amber-400" /> Live
                  Orders
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table data-ocid="restaurant.orders.table">
                  <TableHeader>
                    <TableRow className="border-amber-500/20">
                      <TableHead className="text-amber-300">Order ID</TableHead>
                      <TableHead className="text-amber-300">Customer</TableHead>
                      <TableHead className="text-amber-300">Items</TableHead>
                      <TableHead className="text-amber-300">Amount</TableHead>
                      <TableHead className="text-amber-300">Status</TableHead>
                      <TableHead className="text-amber-300">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-white/40 py-8"
                          data-ocid="restaurant.orders.empty_state"
                        >
                          No orders yet. Orders placed by customers will appear
                          here.
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((o, i) => (
                        <TableRow
                          key={o.id}
                          className="border-amber-500/10"
                          data-ocid={`restaurant.orders.item.${i + 1}`}
                        >
                          <TableCell className="text-amber-300 font-mono">
                            {o.id}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {o.customerName}
                          </TableCell>
                          <TableCell className="text-white/70 text-sm">
                            {o.items}
                          </TableCell>
                          <TableCell className="text-white font-semibold">
                            ₹{o.amount}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                o.status === "delivered"
                                  ? "bg-green-500/20 text-green-300"
                                  : o.status === "preparing"
                                    ? "bg-yellow-500/20 text-yellow-300"
                                    : o.status === "ready"
                                      ? "bg-blue-500/20 text-blue-300"
                                      : "bg-white/10 text-white/60"
                              }
                            >
                              {o.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white/40 text-sm">
                            {o.time}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics">
            <div className="rounded-xl border border-amber-500/20 overflow-hidden">
              <div className="bg-amber-500/10 px-6 py-3 border-b border-amber-500/20">
                <p className="text-amber-300 text-sm font-medium">
                  Restaurant Analytics Dashboard
                </p>
              </div>
              <Dashboard onNavigate={dummyNavigate} />
            </div>
          </TabsContent>

          {/* QR CODE */}
          <TabsContent value="qr">
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <QrCode size={18} className="text-amber-400" /> Restaurant QR
                  Code
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 py-8">
                <div className="p-6 bg-white rounded-2xl">
                  <div className="w-40 h-40 flex items-center justify-center bg-gray-100 rounded-lg border-4 border-gray-800">
                    <div className="grid grid-cols-4 gap-1 p-2">
                      <div className="w-full h-full grid grid-cols-4 gap-1">
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-white" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-white" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-white" />
                        <div className="w-5 h-5 rounded-sm bg-white" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-white" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-white" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-gray-800" />
                        <div className="w-5 h-5 rounded-sm bg-white" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-lg">
                    Haveli Kitchen
                  </p>
                  <p className="text-white/50 text-sm mt-1">
                    Scan to view menu and place orders
                  </p>
                </div>
                <Button
                  className="bg-amber-600 hover:bg-amber-500 text-white"
                  onClick={() => toast.success("QR Code downloaded!")}
                  data-ocid="restaurant.qr.download_button"
                >
                  <QrCode size={16} className="mr-2" /> Download QR Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS */}
          <TabsContent value="settings">
            <Card className="bg-amber-500/5 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  Restaurant Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-white/70">
                <p className="text-amber-300">
                  Configure your restaurant profile, WhatsApp number, GSTIN, and
                  more inside the Menu Manager CMS settings tab above.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Restaurant Name", value: "Haveli Kitchen" },
                    { label: "WhatsApp Number", value: "+91 98765 43210" },
                    { label: "GSTIN", value: "07AABCU9603R1ZN" },
                    { label: "Open Hours", value: "10:00 AM – 10:00 PM" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-4"
                    >
                      <p className="text-amber-300/60 text-xs mb-1">
                        {s.label}
                      </p>
                      <p className="text-white font-medium">{s.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
