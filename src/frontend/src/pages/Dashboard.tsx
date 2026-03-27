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
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useActor } from "../hooks/useActor";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const SAMPLE_ORDERS = [
  {
    id: "#1042",
    customer: "Amit Singh",
    items: "Butter Chicken x2, Naan x4",
    total: "₹680",
    status: "confirmed",
    time: "2 min ago",
  },
  {
    id: "#1041",
    customer: "Priya Sharma",
    items: "Biryani x1, Raita x1",
    total: "₹320",
    status: "preparing",
    time: "8 min ago",
  },
  {
    id: "#1040",
    customer: "Ravi Kumar",
    items: "Dal Makhani x2, Roti x6",
    total: "₹440",
    status: "ready",
    time: "15 min ago",
  },
  {
    id: "#1039",
    customer: "Sunita Patel",
    items: "Paneer Tikka x1",
    total: "₹280",
    status: "delivered",
    time: "32 min ago",
  },
  {
    id: "#1038",
    customer: "Deepak Nair",
    items: "Thali x3",
    total: "₹750",
    status: "delivered",
    time: "1 hr ago",
  },
];

const POPULAR = [
  { name: "Butter Chicken", orders: 42, pct: 85 },
  { name: "Biryani", orders: 38, pct: 76 },
  { name: "Paneer Tikka", orders: 29, pct: 58 },
  { name: "Dal Makhani", orders: 24, pct: 48 },
  { name: "Thali", orders: 21, pct: 42 },
];

const CHART_DATA = [12, 19, 15, 28, 22, 35, 31, 42, 38, 45, 40, 52];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PEAK_HOURS = [
  { label: "12 PM", pct: 55 },
  { label: "1 PM", pct: 72 },
  { label: "7 PM", pct: 88 },
  { label: "8 PM", pct: 95 },
  { label: "9 PM", pct: 68 },
];

const WEEKLY_DATA = [
  { day: "Mon", orders: 34, revenue: 8400 },
  { day: "Tue", orders: 28, revenue: 6800 },
  { day: "Wed", orders: 45, revenue: 11200 },
  { day: "Thu", orders: 52, revenue: 13800 },
  { day: "Fri", orders: 67, revenue: 18200 },
  { day: "Sat", orders: 89, revenue: 24600 },
  { day: "Sun", orders: 78, revenue: 21000 },
];

const CUSTOMER_SEGMENTS = [
  { label: "Returning", pct: 78, color: "from-gold to-neon-orange" },
  { label: "New", pct: 15, color: "from-neon-cyan to-blue-400" },
  { label: "VIP", pct: 7, color: "from-neon-purple to-pink-400" },
];

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  preparing: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  ready: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-400 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

const glassCard =
  "backdrop-blur-sm bg-white/5 dark:bg-white/5 border border-white/10 shadow-xl hover:border-gold/30 transition-all rounded-2xl";

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "analytics"
  >("overview");
  const { actor, isFetching } = useActor();

  const { data: restaurants } = useQuery({
    queryKey: ["all-restaurants"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRestaurants();
    },
    enabled: !!actor && !isFetching,
  });

  const maxVal = Math.max(...CHART_DATA);
  const maxWeekly = Math.max(...WEEKLY_DATA.map((d) => d.orders));

  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-display font-black text-foreground">
              Restaurant <span className="text-gold">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              Spice Garden — Welcome back, Rajesh!
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              data-ocid="dashboard.secondary_button"
              variant="outline"
              size="sm"
              className="border-border text-foreground"
              onClick={() => toast.success("Data refreshed!")}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              data-ocid="dashboard.secondary_button"
              variant="outline"
              size="sm"
              className="border-border text-foreground"
              onClick={() => toast.success("Report exported as PDF!")}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              data-ocid="dashboard.primary_button"
              size="sm"
              className="bg-gold hover:bg-gold/90 text-black font-semibold"
              onClick={() => onNavigate("menu")}
            >
              View Menu
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-card rounded-xl mb-8 w-fit border border-border">
          {(["overview", "orders", "analytics"] as const).map((tab) => (
            <button
              type="button"
              key={tab}
              data-ocid="dashboard.tab"
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-gold text-black shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {[
                {
                  title: "Total Orders",
                  value: "1,284",
                  change: "+12%",
                  icon: <ShoppingBag className="w-5 h-5" />,
                  color: "text-neon-cyan",
                },
                {
                  title: "Daily Revenue",
                  value: "₹12,450",
                  change: "+8%",
                  icon: <DollarSign className="w-5 h-5" />,
                  color: "text-gold",
                },
                {
                  title: "Active Restaurants",
                  value: String(restaurants?.length ?? 3),
                  change: "+2",
                  icon: <Users className="w-5 h-5" />,
                  color: "text-neon-purple",
                },
                {
                  title: "Avg Order Time",
                  value: "18 min",
                  change: "-3 min",
                  icon: <Clock className="w-5 h-5" />,
                  color: "text-green-400",
                },
                {
                  title: "Customer Retention",
                  value: "78%",
                  change: "+5%",
                  icon: <Users className="w-5 h-5" />,
                  color: "text-pink-400",
                },
                {
                  title: "Avg Order Value",
                  value: "₹485",
                  change: "+₹32",
                  icon: <DollarSign className="w-5 h-5" />,
                  color: "text-orange-400",
                },
              ].map((stat) => (
                <Card
                  key={stat.title}
                  data-ocid="dashboard.card"
                  className={`${glassCard} border-0`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-black text-foreground mt-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-green-400 mt-1">
                          {stat.change} vs last week
                        </p>
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue chart */}
              <Card className={`lg:col-span-2 ${glassCard} border-0`}>
                <CardHeader>
                  <CardTitle className="text-foreground font-bold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold" />
                    Revenue This Year
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2 h-40">
                    {CHART_DATA.map((val, i) => (
                      <div
                        key={MONTHS[i]}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <button
                          type="button"
                          className="w-full rounded-t-sm bg-gold/60 hover:bg-gold transition-colors cursor-pointer"
                          style={{ height: `${(val / maxVal) * 100}%` }}
                          title={`${MONTHS[i]}: ₹${val}k`}
                          onClick={() =>
                            toast.info(`${MONTHS[i]}: ₹${val},000 revenue`)
                          }
                        />
                        <span className="text-xs text-muted-foreground">
                          {MONTHS[i].slice(0, 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    Revenue in ₹1000s
                  </p>
                </CardContent>
              </Card>

              {/* Popular dishes */}
              <Card className={`${glassCard} border-0`}>
                <CardHeader>
                  <CardTitle className="text-foreground font-bold flex items-center gap-2">
                    <Package className="w-4 h-4 text-neon-purple" />
                    Popular Dishes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {POPULAR.map((dish) => (
                      <div key={dish.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground font-medium">
                            {dish.name}
                          </span>
                          <span className="text-muted-foreground">
                            {dish.orders} orders
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold to-orange-400"
                            style={{ width: `${dish.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Peak hours */}
            <Card className={`mt-6 ${glassCard} border-0`}>
              <CardHeader>
                <CardTitle className="text-foreground font-bold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neon-cyan" />
                  Peak Order Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {PEAK_HOURS.map((h) => (
                    <div key={h.label} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-12 shrink-0">
                        {h.label}
                      </span>
                      <div className="flex-1 h-6 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400/60 to-gold transition-all"
                          style={{ width: `${h.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gold font-semibold w-8 text-right">
                        {h.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* ===== ORDERS TAB ===== */}
        {activeTab === "orders" && (
          <>
            <Card className={`${glassCard} border-0`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground font-bold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold" />
                    Recent Orders
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gold/10 text-gold border-gold/20">
                      {SAMPLE_ORDERS.length} orders
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-border text-foreground text-xs"
                      onClick={() => toast.success("Orders exported!")}
                    >
                      <Download className="w-3 h-3 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">
                        Order ID
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Customer
                      </TableHead>
                      <TableHead className="text-muted-foreground hidden md:table-cell">
                        Items
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Total
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground hidden sm:table-cell">
                        Time
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {SAMPLE_ORDERS.map((order, i) => (
                      <TableRow
                        key={order.id}
                        data-ocid={`orders.item.${i + 1}`}
                        className="border-border hover:bg-white/5"
                      >
                        <TableCell className="font-mono text-gold text-sm">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          {order.customer}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm hidden md:table-cell">
                          {order.items}
                        </TableCell>
                        <TableCell className="text-foreground font-semibold">
                          {order.total}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs border ${statusColor[order.status]}`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                          {order.time}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7 px-2 text-gold hover:bg-gold/10"
                            onClick={() =>
                              toast.success(`Order ${order.id} updated!`)
                            }
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Order status summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                {
                  label: "Pending",
                  count: 3,
                  color: "text-yellow-400",
                  bg: "bg-yellow-500/10",
                },
                {
                  label: "Preparing",
                  count: 7,
                  color: "text-orange-400",
                  bg: "bg-orange-500/10",
                },
                {
                  label: "Ready",
                  count: 4,
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
                {
                  label: "Delivered",
                  count: 28,
                  color: "text-green-400",
                  bg: "bg-green-500/10",
                },
              ].map((s) => (
                <Card
                  key={s.label}
                  className={`${glassCard} border-0 cursor-pointer`}
                  onClick={() =>
                    toast.info(`${s.count} ${s.label.toLowerCase()} orders`)
                  }
                >
                  <CardContent className="pt-5 pb-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}
                    >
                      <CheckCircle className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <p className="text-2xl font-black text-foreground">
                      {s.count}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {s.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* ===== ANALYTICS TAB ===== */}
        {activeTab === "analytics" && (
          <>
            {/* Weekly chart */}
            <Card className={`${glassCard} border-0 mb-6`}>
              <CardHeader>
                <CardTitle className="text-foreground font-bold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gold" />
                  Weekly Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3 h-40">
                  {WEEKLY_DATA.map((d) => (
                    <div
                      key={d.day}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <button
                        type="button"
                        className="w-full rounded-t-md bg-gradient-to-t from-orange-500/60 to-gold/80 hover:from-orange-500 hover:to-gold transition-colors"
                        style={{ height: `${(d.orders / maxWeekly) * 100}%` }}
                        title={`${d.day}: ${d.orders} orders`}
                        onClick={() =>
                          toast.info(
                            `${d.day}: ${d.orders} orders, ₹${d.revenue.toLocaleString()} revenue`,
                          )
                        }
                      />
                      <span className="text-xs text-muted-foreground">
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer segments */}
              <Card className={`${glassCard} border-0`}>
                <CardHeader>
                  <CardTitle className="text-foreground font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-neon-purple" />
                    Customer Segments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {CUSTOMER_SEGMENTS.map((seg) => (
                      <div key={seg.label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-foreground font-medium">
                            {seg.label} Customers
                          </span>
                          <span className="text-gold font-bold">
                            {seg.pct}%
                          </span>
                        </div>
                        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${seg.color}`}
                            style={{ width: `${seg.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Revenue stats */}
              <Card className={`${glassCard} border-0`}>
                <CardHeader>
                  <CardTitle className="text-foreground font-bold flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gold" />
                    Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Dine-in", amount: "₹48,200", pct: 55 },
                      { label: "Delivery", amount: "₹32,100", pct: 36 },
                      { label: "Takeaway", amount: "₹7,800", pct: 9 },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground w-20 shrink-0">
                          {r.label}
                        </span>
                        <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold to-orange-400"
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-foreground font-semibold w-16 text-right">
                          {r.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Total Revenue
                      </span>
                      <span className="text-lg font-black text-gold">
                        ₹88,100
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demand prediction */}
            <Card className={`mt-6 ${glassCard} border-0`}>
              <CardHeader>
                <CardTitle className="text-foreground font-bold flex items-center gap-2">
                  <Package className="w-4 h-4 text-neon-cyan" />
                  AI Demand Prediction — Next 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      dish: "Butter Chicken",
                      pred: "+18%",
                      confidence: "High",
                      emoji: "🍗",
                    },
                    {
                      dish: "Biryani",
                      pred: "+24%",
                      confidence: "High",
                      emoji: "🍚",
                    },
                    {
                      dish: "Paneer Tikka",
                      pred: "+9%",
                      confidence: "Medium",
                      emoji: "🧀",
                    },
                    {
                      dish: "Dal Makhani",
                      pred: "-5%",
                      confidence: "Low",
                      emoji: "🫘",
                    },
                  ].map((p) => (
                    <button
                      type="button"
                      key={p.dish}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all cursor-pointer text-left w-full"
                      onClick={() =>
                        toast.info(
                          `${p.dish}: predicted ${p.pred} demand next week`,
                        )
                      }
                    >
                      <div className="text-2xl mb-2">{p.emoji}</div>
                      <p className="text-sm font-semibold text-foreground">
                        {p.dish}
                      </p>
                      <p
                        className={`text-lg font-black mt-1 ${p.pred.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                      >
                        {p.pred}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Confidence: {p.confidence}
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
