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
  BarChart3,
  Building2,
  Crown,
  LogOut,
  MessageSquare,
  Settings,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useCMS } from "../context/CMSContext";
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
  const { vendors } = useCMS();

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
