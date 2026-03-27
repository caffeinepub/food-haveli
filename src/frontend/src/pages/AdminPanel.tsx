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
import {
  BarChart3,
  Edit3,
  MessageSquare,
  PlusCircle,
  Search,
  Settings,
  ShoppingBag,
  Store,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type AdminTab = "overview" | "restaurants" | "orders" | "users";

const RESTAURANTS = [
  {
    id: 1,
    name: "Spice Garden",
    owner: "Rajesh Kumar",
    cuisine: "North Indian",
    orders: 284,
    status: "active",
  },
  {
    id: 2,
    name: "Biryani House",
    owner: "Ahmed Khan",
    cuisine: "Mughlai",
    orders: 193,
    status: "active",
  },
  {
    id: 3,
    name: "Patel's Kitchen",
    owner: "Sunita Patel",
    cuisine: "Gujarati",
    orders: 142,
    status: "active",
  },
  {
    id: 4,
    name: "Cloud Bites",
    owner: "Deepak Nair",
    cuisine: "Multi-Cuisine",
    orders: 89,
    status: "pending",
  },
  {
    id: 5,
    name: "Mama's Dhaba",
    owner: "Priya Sharma",
    cuisine: "Punjabi",
    orders: 210,
    status: "active",
  },
];

const USERS_DATA = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh@spicegarden.in",
    role: "owner",
    joined: "Jan 2025",
  },
  {
    id: 2,
    name: "Ahmed Khan",
    email: "ahmed@biryanihouse.in",
    role: "owner",
    joined: "Feb 2025",
  },
  {
    id: 3,
    name: "Amit Singh",
    email: "amit.customer@gmail.com",
    role: "customer",
    joined: "Mar 2025",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya@cloudkitchen.in",
    role: "owner",
    joined: "Jan 2025",
  },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [search, setSearch] = useState("");

  const sidebarItems: {
    tab: AdminTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      tab: "overview",
      label: "Overview",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      tab: "restaurants",
      label: "Restaurants",
      icon: <Store className="w-4 h-4" />,
    },
    {
      tab: "orders",
      label: "Orders",
      icon: <ShoppingBag className="w-4 h-4" />,
    },
    { tab: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background pt-16 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-card border-r border-border pt-6 pb-4 shrink-0">
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Admin Panel
          </p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {sidebarItems.map((item) => (
            <button
              type="button"
              key={item.tab}
              data-ocid="admin.tab"
              onClick={() => setActiveTab(item.tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.tab
                  ? "bg-gold/10 text-gold"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings className="w-3 h-3" />
            <span>Platform Admin</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-display font-black text-foreground">
              Admin <span className="text-gold">Panel</span>
            </h1>
            <Badge className="bg-gold/10 text-gold border-gold/20">
              Platform Admin
            </Badge>
          </div>

          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Total Restaurants",
                    value: "2,481",
                    icon: <Store className="w-5 h-5" />,
                    color: "text-gold",
                  },
                  {
                    label: "Total Users",
                    value: "18,240",
                    icon: <Users className="w-5 h-5" />,
                    color: "text-neon-cyan",
                  },
                  {
                    label: "Orders Today",
                    value: "1,284",
                    icon: <ShoppingBag className="w-5 h-5" />,
                    color: "text-neon-purple",
                  },
                  {
                    label: "Chat Sessions",
                    value: "342",
                    icon: <MessageSquare className="w-5 h-5" />,
                    color: "text-green-400",
                  },
                ].map((stat) => (
                  <Card
                    key={stat.label}
                    data-ocid="admin.card"
                    className="card-neon border-0"
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-2xl font-black text-foreground mt-1">
                            {stat.value}
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
              <Card className="card-neon border-0">
                <CardHeader>
                  <CardTitle className="text-foreground">
                    Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        label: "API Response Time",
                        value: "98ms",
                        pct: 90,
                        color: "bg-green-400",
                      },
                      {
                        label: "Order Success Rate",
                        value: "99.2%",
                        pct: 99,
                        color: "bg-gold",
                      },
                      {
                        label: "Chatbot Resolution",
                        value: "87%",
                        pct: 87,
                        color: "bg-neon-purple",
                      },
                      {
                        label: "Uptime",
                        value: "99.9%",
                        pct: 100,
                        color: "bg-neon-cyan",
                      },
                    ].map((metric) => (
                      <div key={metric.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            {metric.label}
                          </span>
                          <span className="text-foreground font-semibold">
                            {metric.value}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full ${metric.color}`}
                            style={{ width: `${metric.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Restaurants */}
          {activeTab === "restaurants" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="admin.search_input"
                    placeholder="Search restaurants..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 w-64 bg-card border-border"
                  />
                </div>
                <Button
                  data-ocid="admin.primary_button"
                  className="bg-gold hover:bg-gold/90 text-black font-semibold"
                  onClick={() =>
                    toast.success("Add restaurant modal would open")
                  }
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Restaurant
                </Button>
              </div>
              <Card className="card-neon border-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-muted-foreground">
                        Name
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Owner
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Cuisine
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Orders
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {RESTAURANTS.filter((r) =>
                      r.name.toLowerCase().includes(search.toLowerCase()),
                    ).map((r, i) => (
                      <TableRow
                        key={r.id}
                        data-ocid={`admin.item.${i + 1}`}
                        className="border-border"
                      >
                        <TableCell className="font-medium text-foreground">
                          {r.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.owner}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {r.cuisine}
                        </TableCell>
                        <TableCell className="text-foreground">
                          {r.orders}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              r.status === "active"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                            }
                          >
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              data-ocid={`admin.edit_button.${i + 1}`}
                              onClick={() => toast.info(`Editing ${r.name}`)}
                              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              data-ocid={`admin.delete_button.${i + 1}`}
                              onClick={() => toast.error(`Removed ${r.name}`)}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Users */}
          {(activeTab === "users" || activeTab === "orders") && (
            <Card className="card-neon border-0">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {activeTab === "users"
                    ? "User Management"
                    : "Orders Overview"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeTab === "users" ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">
                          Name
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Email
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Role
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Joined
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {USERS_DATA.map((user, i) => (
                        <TableRow
                          key={user.id}
                          data-ocid={`users.item.${i + 1}`}
                          className="border-border"
                        >
                          <TableCell className="font-medium text-foreground">
                            {user.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                user.role === "owner"
                                  ? "bg-gold/10 text-gold border-gold/20"
                                  : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              }
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.joined}
                          </TableCell>
                          <TableCell>
                            <button
                              type="button"
                              data-ocid={`users.delete_button.${i + 1}`}
                              onClick={() => toast.error("User removed")}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors text-muted-foreground hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Orders data loaded from backend. Connect your restaurant to
                    view live orders.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
