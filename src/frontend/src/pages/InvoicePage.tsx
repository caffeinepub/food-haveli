import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  ChefHat,
  Clock,
  Download,
  MapPin,
  Phone,
  RotateCcw,
  Truck,
  UtensilsCrossed,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Page } from "../App";
import { useCMS } from "../context/CMSContext";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface OrderData {
  invoiceNumber: string;
  date: string;
  customer: { name: string; phone: string; address: string };
  items: OrderItem[];
  subtotal: number;
  gst: number;
  deliveryFee: number;
  total: number;
  payment: string;
}

interface InvoicePageProps {
  onNavigate: (page: Page) => void;
}

const STATUS_STEPS = [
  { icon: CheckCircle, label: "Order Placed", desc: "Received & confirmed" },
  { icon: ChefHat, label: "Preparing", desc: "Kitchen is cooking" },
  { icon: Truck, label: "Out for Delivery", desc: "On the way" },
  { icon: UtensilsCrossed, label: "Delivered", desc: "Enjoy your meal!" },
];

export default function InvoicePage({ onNavigate }: InvoicePageProps) {
  const { restaurantInfo } = useCMS();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("fh_order");
    if (saved) {
      setOrder(JSON.parse(saved));
    } else {
      // Demo data if no order in storage
      setOrder({
        invoiceNumber: "FH-2026-7842",
        date: new Date().toISOString(),
        customer: {
          name: "Rahul Sharma",
          phone: "+91 98765 43210",
          address: "42, Lodhi Colony, New Delhi - 110003",
        },
        items: [
          {
            id: 1,
            name: "Butter Chicken",
            price: 320,
            qty: 1,
            image: "/assets/generated/butter-chicken.dim_400x300.jpg",
          },
          {
            id: 2,
            name: "Garlic Naan",
            price: 60,
            qty: 2,
            image: "/assets/generated/garlic-naan.dim_400x300.jpg",
          },
          {
            id: 7,
            name: "Mango Lassi",
            price: 90,
            qty: 1,
            image: "/assets/generated/mango-lassi.dim_400x300.jpg",
          },
        ],
        subtotal: 530,
        gst: 27,
        deliveryFee: 40,
        total: 597,
        payment: "cod",
      });
    }
  }, []);

  if (!order) return null;

  const orderDate = new Date(order.date);
  const formattedDate = orderDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = orderDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-background pt-20 print:pt-0 print:bg-white">
      <div className="container max-w-3xl mx-auto px-4 py-8 print:px-0 print:py-0">
        {/* Actions (print hidden) */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div>
            <h1 className="text-xl font-black text-foreground">
              Order Confirmation
            </h1>
            <p className="text-sm text-muted-foreground">
              Your order has been placed successfully!
            </p>
            <div
              className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl w-fit text-xs font-semibold"
              style={{
                background: "oklch(0.22 0.12 142 / 0.3)",
                border: "1px solid oklch(0.55 0.18 142 / 0.4)",
                color: "oklch(0.75 0.18 142)",
              }}
            >
              <span>📱</span> Owner notified via WhatsApp
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              data-ocid="invoice.secondary_button"
              onClick={() => onNavigate("order" as Page)}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Order Again
            </Button>
            <Button
              data-ocid="invoice.primary_button"
              onClick={() => window.print()}
              className="gap-2 text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
              }}
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </Button>
          </div>
        </div>

        {/* Status Tracker */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 print:hidden">
          <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-4">
            Order Status
          </h2>
          <div className="flex items-center justify-between relative">
            <div
              className="absolute left-0 right-0 top-5 h-0.5 mx-10"
              style={{ background: "oklch(0.25 0.01 245)" }}
            />
            {STATUS_STEPS.map((step, i) => {
              const isActive = i === 0;
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="flex flex-col items-center gap-2 z-10"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))"
                        : "oklch(0.18 0.015 245)",
                      borderColor: isActive
                        ? "oklch(0.65 0.19 55)"
                        : "oklch(0.25 0.01 245)",
                    }}
                  >
                    <Icon
                      className={`w-4 h-4 ${isActive ? "text-white" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-xs font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </p>
                    <p className="text-xs text-muted-foreground hidden sm:block">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg print:rounded-none print:border-none print:shadow-none">
          {/* Invoice Header */}
          <div
            className="p-8 text-white print:text-black"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.38 0.18 30), oklch(0.52 0.20 50))",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <UtensilsCrossed className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black">
                      {restaurantInfo.name}
                    </h2>
                    <p className="text-white/70 text-xs">
                      {restaurantInfo.tagline}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-white/80">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> {restaurantInfo.address}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5" /> {restaurantInfo.phone}
                  </p>
                  <p className="text-xs text-white/60">
                    GSTIN: {restaurantInfo.gstin}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 mb-3">
                  TAX INVOICE
                </Badge>
                <p className="font-black text-xl">{order.invoiceNumber}</p>
                <p className="text-white/70 text-sm">{formattedDate}</p>
                <p className="text-white/70 text-sm">{formattedTime}</p>
                <p className="text-white/60 text-xs mt-1">
                  Payment:{" "}
                  {order.payment === "cod"
                    ? "Cash on Delivery"
                    : "Online Payment"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Customer Details */}
            <div className="bg-muted/30 rounded-xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Bill To
              </h3>
              <p className="font-bold text-foreground">{order.customer.name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Phone className="w-3 h-3" /> {order.customer.phone}
              </p>
              <p className="text-sm text-muted-foreground flex items-start gap-1 mt-1">
                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />{" "}
                {order.customer.address}
              </p>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Order Items
              </h3>
              <div className="rounded-xl overflow-hidden border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 font-semibold text-muted-foreground">
                        Item
                      </th>
                      <th className="text-center p-3 font-semibold text-muted-foreground">
                        Qty
                      </th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">
                        Price
                      </th>
                      <th className="text-right p-3 font-semibold text-muted-foreground">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr
                        key={item.id}
                        className={
                          i % 2 === 0 ? "bg-background" : "bg-muted/20"
                        }
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <span className="font-medium text-foreground">
                              {item.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-center text-muted-foreground">
                          {item.qty}
                        </td>
                        <td className="p-3 text-right text-muted-foreground">
                          ₹{item.price}
                        </td>
                        <td className="p-3 text-right font-semibold text-foreground">
                          ₹{item.price * item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST @ 5%</span>
                  <span className="font-medium">₹{order.gst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₹{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-lg font-black pt-3 border-t border-border">
                  <span>Grand Total</span>
                  <span style={{ color: "oklch(0.55 0.22 30)" }}>
                    ₹{order.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                Restaurant Location
              </h3>
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  title="Food Haveli - Connaught Place location"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=77.2090%2C28.6320%2C77.2250%2C28.6420&layer=mapnik&marker=28.6315%2C77.2167"
                  className="w-full"
                  style={{ height: 220, border: 0 }}
                  loading="lazy"
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 text-orange-500" />
                <span>
                  Food Haveli, Block A, Connaught Place, New Delhi – 110001
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Thank you for ordering from Food Haveli! 🍴
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                For support: {restaurantInfo.email} · {restaurantInfo.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex gap-3 mt-6 justify-center print:hidden">
          <Button
            variant="outline"
            data-ocid="invoice.secondary_button"
            onClick={() => onNavigate("order" as Page)}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Order Again
          </Button>
          <Button
            data-ocid="invoice.primary_button"
            onClick={() => window.print()}
            className="gap-2 text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
            }}
          >
            <Download className="w-4 h-4" />
            Download / Print Invoice
          </Button>
        </div>

        {/* Estimated time */}
        <div className="mt-4 text-center print:hidden">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Estimated delivery time: 35-45 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
