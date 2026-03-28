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
  CheckCircle,
  ChefHat,
  LogOut,
  QrCode,
  Settings,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import type { Page } from "../App";
import { useAuth } from "../context/AuthContext";
import { useCMS } from "../context/CMSContext";
import CMSPanel from "./CMSPanel";
import Dashboard from "./Dashboard";

export default function RestaurantPanel() {
  const { logout } = useAuth();
  const { orders, menuItems } = useCMS();

  const dummyNavigate = (_page: Page) => {};

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
            className="bg-amber-500/10 border border-amber-500/20 mb-8"
            data-ocid="restaurant.tab"
          >
            <TabsTrigger
              value="menu"
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-amber-300"
            >
              <UtensilsCrossed size={15} className="mr-1.5" /> Menu Manager
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
