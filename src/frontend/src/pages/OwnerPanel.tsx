import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Building2,
  Crown,
  Home,
  LogOut,
  MessageSquare,
  Moon,
  Settings,
  Shield,
  Star,
  Sun,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useCMS } from "../context/CMSContext";
import { useTheme } from "../context/ThemeContext";
import AdminPanel from "./AdminPanel";

const PLATFORM_STATS = [
  {
    label: "Total Restaurants",
    value: "247",
    icon: Building2,
    change: "+12 this month",
    color: "text-purple-400",
  },
  {
    label: "Total Orders Today",
    value: "1,842",
    icon: BarChart3,
    change: "+18% vs yesterday",
    color: "text-blue-400",
  },
  {
    label: "Platform Revenue",
    value: "₹4,23,000",
    icon: TrendingUp,
    change: "This month",
    color: "text-green-400",
  },
  {
    label: "Active Vendors",
    value: "18",
    icon: Users,
    change: "+3 new vendors",
    color: "text-yellow-400",
  },
];

const RESTAURANTS = [
  {
    id: 1,
    name: "Haveli Kitchen",
    owner: "Ramjipal",
    cuisine: "North Indian",
    plan: "₹2,499",
    status: "active",
    orders: 284,
    joined: "Jan 2024",
  },
  {
    id: 2,
    name: "Spice Garden",
    owner: "Amit Sharma",
    cuisine: "Multi-Cuisine",
    plan: "₹999",
    status: "active",
    orders: 156,
    joined: "Feb 2024",
  },
  {
    id: 3,
    name: "Cloud Curry",
    owner: "Priya Verma",
    cuisine: "Cloud Kitchen",
    plan: "₹2,499",
    status: "active",
    orders: 312,
    joined: "Dec 2023",
  },
  {
    id: 4,
    name: "Biryani House",
    owner: "Salim Khan",
    cuisine: "Mughlai",
    plan: "₹999",
    status: "pending",
    orders: 0,
    joined: "Mar 2024",
  },
  {
    id: 5,
    name: "Dhaba Express",
    owner: "Mohan Lal",
    cuisine: "Punjabi",
    plan: "Free",
    status: "active",
    orders: 87,
    joined: "Mar 2024",
  },
  {
    id: 6,
    name: "TastyBites",
    owner: "Kavita Singh",
    cuisine: "Street Food",
    plan: "₹999",
    status: "suspended",
    orders: 0,
    joined: "Jan 2024",
  },
];

const INQUIRIES = [
  {
    id: 1,
    name: "Rohit Gupta",
    company: "Gupta Foods",
    email: "rohit@guptafoods.in",
    message: "Interested in the ₹2,499 plan for 5 restaurants",
    date: "2024-03-15",
  },
  {
    id: 2,
    name: "Sunita Patel",
    company: "Patel Dhaba Chain",
    email: "sunita@pateldhaba.in",
    message: "Need custom branding and domain setup",
    date: "2024-03-14",
  },
  {
    id: 3,
    name: "Akash Mehta",
    company: "CloudKitchen Pro",
    email: "akash@ckpro.in",
    message: "Want to integrate payment gateway",
    date: "2024-03-12",
  },
];

export default function OwnerPanel() {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { vendors, menuItems } = useCMS();
  const [ownerMenuCat, setOwnerMenuCat] = useState("All");

  return (
    <div className="min-h-screen bg-[oklch(0.10_0.015_290)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 border-b border-purple-500/20 bg-[oklch(0.13_0.02_290)] px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Crown size={22} className="text-purple-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Platform Owner Dashboard
              </h1>
              <p className="text-purple-300/60 text-xs">
                Food Haveli — Super Admin
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-purple-200/70 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
              <Shield size={14} className="text-purple-400" />
              <span>Abhay Vishwakarma — CEO &amp; CTO</span>
            </div>
            <Badge className="bg-purple-600/30 text-purple-200 border-purple-400/30">
              Platform Owner
            </Badge>
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-purple-300 hover:text-purple-200 hover:bg-purple-500/10"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
            {/* Back to Home */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                logout();
                toast.success("Welcome back to Food Haveli!");
              }}
              className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 hover:border-amber-400/60 transition-all gap-1.5"
              data-ocid="owner.back_home.button"
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
              data-ocid="owner.logout.button"
            >
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="overview">
          <TabsList
            className="bg-purple-500/10 border border-purple-500/20 mb-8"
            data-ocid="owner.tab"
          >
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              <BarChart3 size={15} className="mr-1.5" /> Overview
            </TabsTrigger>
            <TabsTrigger
              value="restaurants"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              <Building2 size={15} className="mr-1.5" /> Restaurants
            </TabsTrigger>
            <TabsTrigger
              value="vendors"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              <Users size={15} className="mr-1.5" /> Vendors
            </TabsTrigger>
            <TabsTrigger
              value="inquiries"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              <MessageSquare size={15} className="mr-1.5" /> Inquiries
            </TabsTrigger>
            <TabsTrigger
              value="live-menu"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              <UtensilsCrossed size={15} className="mr-1.5" /> Live Menu
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-300"
            >
              <Settings size={15} className="mr-1.5" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* OVERVIEW */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {PLATFORM_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Card className="bg-purple-500/5 border-purple-500/20">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-white/50 text-sm">{s.label}</p>
                        <s.icon size={18} className={s.color} />
                      </div>
                      <p className={`text-3xl font-bold ${s.color}`}>
                        {s.value}
                      </p>
                      <p className="text-white/30 text-xs mt-1">{s.change}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-6">
              <h3 className="text-white font-semibold mb-4">Platform Health</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Uptime", value: "99.98%", color: "text-green-400" },
                  {
                    label: "API Latency",
                    value: "42ms",
                    color: "text-blue-400",
                  },
                  {
                    label: "Active Sessions",
                    value: "1,204",
                    color: "text-purple-400",
                  },
                  {
                    label: "Error Rate",
                    value: "0.01%",
                    color: "text-yellow-400",
                  },
                ].map((m) => (
                  <div key={m.label} className="text-center">
                    <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-white/40 text-sm mt-1">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* RESTAURANTS */}
          <TabsContent value="restaurants">
            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Building2 size={18} className="text-purple-400" /> Registered
                  Restaurants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table data-ocid="owner.restaurants.table">
                  <TableHeader>
                    <TableRow className="border-purple-500/20">
                      <TableHead className="text-purple-300">#</TableHead>
                      <TableHead className="text-purple-300">
                        Restaurant
                      </TableHead>
                      <TableHead className="text-purple-300">Owner</TableHead>
                      <TableHead className="text-purple-300">Cuisine</TableHead>
                      <TableHead className="text-purple-300">Plan</TableHead>
                      <TableHead className="text-purple-300">Orders</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RESTAURANTS.map((r, i) => (
                      <TableRow
                        key={r.id}
                        className="border-purple-500/10"
                        data-ocid={`owner.restaurants.item.${i + 1}`}
                      >
                        <TableCell className="text-white/40">{r.id}</TableCell>
                        <TableCell className="text-white font-medium">
                          {r.name}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {r.owner}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {r.cuisine}
                        </TableCell>
                        <TableCell className="text-purple-300 font-mono">
                          {r.plan}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {r.orders}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              r.status === "active"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : r.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* VENDORS */}
          <TabsContent value="vendors">
            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users size={18} className="text-purple-400" /> Vendor Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table data-ocid="owner.vendors.table">
                  <TableHeader>
                    <TableRow className="border-purple-500/20">
                      <TableHead className="text-purple-300">Vendor</TableHead>
                      <TableHead className="text-purple-300">Owner</TableHead>
                      <TableHead className="text-purple-300">Plan</TableHead>
                      <TableHead className="text-purple-300">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendors.map((v, i) => (
                      <TableRow
                        key={v.id}
                        className="border-purple-500/10"
                        data-ocid={`owner.vendors.item.${i + 1}`}
                      >
                        <TableCell className="text-white font-medium">
                          {v.name}
                        </TableCell>
                        <TableCell className="text-white/70">
                          {v.ownerName}
                        </TableCell>
                        <TableCell className="text-purple-300">
                          {v.plan}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              v.status === "active"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : v.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                                  : "bg-red-500/20 text-red-300 border-red-500/30"
                            }
                          >
                            {v.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INQUIRIES */}
          <TabsContent value="inquiries">
            <Card className="bg-purple-500/5 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare size={18} className="text-purple-400" />{" "}
                  Contact Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {INQUIRIES.map((inq, i) => (
                  <div
                    key={inq.id}
                    className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4"
                    data-ocid={`owner.inquiries.item.${i + 1}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{inq.name}</p>
                        <p className="text-purple-300/70 text-sm">
                          {inq.company} · {inq.email}
                        </p>
                      </div>
                      <span className="text-white/30 text-xs">{inq.date}</span>
                    </div>
                    <p className="text-white/60 text-sm">{inq.message}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* LIVE MENU */}
          <TabsContent value="live-menu">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Live Menu Overview
                  </h3>
                  <p className="text-purple-300/60 text-sm mt-0.5">
                    All menu items across the platform — read-only management
                    view
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-purple-300">
                      {menuItems.length}
                    </p>
                    <p className="text-purple-400/60 text-xs">Total Items</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-green-300">
                      {menuItems.filter((m) => m.available).length}
                    </p>
                    <p className="text-green-400/60 text-xs">Available</p>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 text-center">
                    <p className="text-2xl font-bold text-red-300">
                      {menuItems.filter((m) => !m.available).length}
                    </p>
                    <p className="text-red-400/60 text-xs">Unavailable</p>
                  </div>
                </div>
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["All", "Mains", "Breads", "Drinks", "Desserts", "Snacks"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setOwnerMenuCat(cat)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        ownerMenuCat === cat
                          ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20"
                          : "bg-white/5 border-purple-500/20 text-purple-300/70 hover:text-purple-300 hover:border-purple-500/40"
                      }`}
                    >
                      {cat}
                    </button>
                  ),
                )}
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {menuItems
                  .filter(
                    (item) =>
                      ownerMenuCat === "All" || item.category === ownerMenuCat,
                  )
                  .map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="rounded-2xl overflow-hidden bg-purple-500/5 border border-purple-500/15 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/10 transition-all hover:-translate-y-1"
                      data-ocid={`owner.menu.item.${i + 1}`}
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {item.popular && (
                          <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                            🔥 Popular
                          </span>
                        )}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              item.available
                                ? "bg-green-500/90 text-white"
                                : "bg-red-500/90 text-white"
                            }`}
                          >
                            {item.available ? "✓ Available" : "✕ Off"}
                          </span>
                        </div>
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
                          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs shrink-0">
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
                          <span className="text-purple-300/50 text-xs">
                            ID #{item.id}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </div>
          </TabsContent>

          {/* SETTINGS — wraps AdminPanel */}
          <TabsContent value="settings">
            <div className="rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="bg-purple-500/10 px-6 py-3 border-b border-purple-500/20">
                <p className="text-purple-300 text-sm font-medium">
                  Platform Admin Settings
                </p>
              </div>
              <AdminPanel />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
