import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Box,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Cloud,
  DollarSign,
  Github,
  Globe,
  Linkedin,
  Play,
  QrCode,
  ShoppingBag,
  Smartphone,
  Star,
  Store,
  TrendingUp,
  Truck,
  Twitter,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";
import RazorpayModal from "../components/RazorpayModal";
import { useCMS } from "../context/CMSContext";
import type { PricingPlan } from "../context/CMSContext";

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const PROBLEMS = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "High Development Cost",
    desc: "Custom websites cost ₹50,000–₹2,00,000+ with ongoing maintenance fees.",
    color: "neon-pink",
  },
  {
    icon: <AlertTriangle className="w-6 h-6" />,
    title: "Manual Order Management",
    desc: "Phone orders, paper tickets, and missed orders cause chaos during peak hours.",
    color: "neon-orange",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "No Customer Data",
    desc: "Without analytics, restaurants can't identify popular dishes or loyal customers.",
    color: "neon-purple",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "No Automation System",
    desc: "Every confirmation, update, and notification requires manual effort.",
    color: "neon-cyan",
  },
];

const SOLUTIONS = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Affordable Website Creation",
    desc: "Launch a professional restaurant website in under 10 minutes. No coding required.",
    color: "text-gold",
  },
  {
    icon: <ShoppingBag className="w-6 h-6" />,
    title: "Online Ordering System",
    desc: "Accept orders 24/7 with a beautiful digital menu. Cart, checkout, and payment built-in.",
    color: "text-neon-cyan",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Automated Confirmations",
    desc: "Order confirmations, WhatsApp notifications, and email receipts sent automatically.",
    color: "text-neon-purple",
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: "AI Chatbot Support",
    desc: "24/7 AI-powered customer support that answers questions and assists with orders.",
    color: "text-neon-pink",
  },
];

const HOW_STEPS = [
  {
    num: "01",
    icon: <Smartphone className="w-5 h-5" />,
    title: "Customer Browses Menu",
    desc: "Customer scans QR code or visits link. Sees your full digital menu.",
  },
  {
    num: "02",
    icon: <ShoppingBag className="w-5 h-5" />,
    title: "Order Placed Online",
    desc: "Customer adds items, fills details, and confirms their order instantly.",
  },
  {
    num: "03",
    icon: <Store className="w-5 h-5" />,
    title: "Restaurant Notified",
    desc: "Your dashboard shows the new order. WhatsApp message arrives too.",
  },
  {
    num: "04",
    icon: <Zap className="w-5 h-5" />,
    title: "Auto Confirmation Sent",
    desc: "Customer receives order confirmation automatically via email/SMS.",
  },
  {
    num: "05",
    icon: <Bot className="w-5 h-5" />,
    title: "AI Logs & Analyzes",
    desc: "AI chatbot handles support and all order data is stored for analytics.",
  },
];

const USERS = [
  {
    icon: <Store className="w-8 h-8" />,
    title: "Small Restaurants",
    desc: "Dhabas, family restaurants, and local eateries going digital for the first time.",
    badge: "Most Popular",
  },
  {
    icon: <Cloud className="w-8 h-8" />,
    title: "Cloud Kitchens",
    desc: "Delivery-only kitchens that need a powerful online ordering system.",
    badge: "Fast Growing",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Food Vendors",
    desc: "Street food stalls and local vendors creating their digital presence.",
    badge: "New",
  },
];

const BENEFITS = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Low Cost Solution",
    desc: "Start for free. Scale as you grow. No hidden charges.",
    stat: "₹0 Setup",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Automated Ordering",
    desc: "Reduce manual work by 90%. Focus on cooking, not paperwork.",
    stat: "90% Less Work",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Smart Analytics",
    desc: "Know your top dishes, peak hours, and loyal customers.",
    stat: "Real-time Data",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "No Coding Required",
    desc: "Set up your entire restaurant platform in minutes, not months.",
    stat: "10 Min Setup",
  },
];

const TESTIMONIALS = [
  {
    name: "Rajesh Kumar",
    role: "Owner, Spice Garden",
    text: "Food Haveli transformed our dhaba. We get 3x more orders online now!",
    rating: 5,
  },
  {
    name: "Prabhat Shukla",
    role: "Cloud Kitchen Owner",
    text: "Setup took 8 minutes. Now I manage everything from my phone.",
    rating: 5,
  },
  {
    name: "Ahmed Khan",
    role: "Biryani House",
    text: "The AI chatbot handles 80% of customer queries automatically.",
    rating: 5,
  },
  {
    name: "Sunita Patel",
    role: "Street Food Vendor",
    text: "My QR code menu is a hit! Customers love the digital experience.",
    rating: 5,
  },
];

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  key: `particle-${i}`,
  width: ((i * 7 + 13) % 4) + 2,
  left: (i * 17 + 5) % 100,
  top: (i * 23 + 11) % 100,
  delay: (i * 0.3) % 3,
}));

const FOOTER_COLS = [
  {
    title: "Platform",
    links: ["Online Ordering", "Menu Builder", "QR Codes", "Analytics"],
  },
  {
    title: "Solutions",
    links: ["Small Restaurants", "Cloud Kitchens", "Food Vendors", "Catering"],
  },
  { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
];

const DEMO_SCREENS = [
  {
    id: 1,
    title: "🍽️ Digital Menu",
    content: (
      <div className="space-y-2 p-2">
        <p className="text-xs font-bold text-gold mb-2">Spice Garden Menu</p>
        {[
          { name: "Butter Chicken", price: "₹280" },
          { name: "Biryani", price: "₹320" },
          { name: "Paneer Tikka", price: "₹240" },
          { name: "Dal Makhani", price: "₹180" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5"
          >
            <span className="text-xs text-foreground">{item.name}</span>
            <span className="text-xs text-gold font-bold">{item.price}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 2,
    title: "🛒 Cart System",
    content: (
      <div className="space-y-2 p-2">
        <p className="text-xs font-bold text-neon-cyan mb-2">Your Cart</p>
        {[
          { name: "Butter Chicken", qty: 2, price: "₹560" },
          { name: "Naan", qty: 4, price: "₹120" },
        ].map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5"
          >
            <div>
              <p className="text-xs text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">x{item.qty}</p>
            </div>
            <span className="text-xs text-gold font-bold">{item.price}</span>
          </div>
        ))}
        <div className="border-t border-white/10 pt-2 flex justify-between">
          <span className="text-xs font-bold text-foreground">Total</span>
          <span className="text-xs font-black text-gold">₹680</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: "✅ Order Confirmed",
    content: (
      <div className="flex flex-col items-center justify-center h-full gap-3 p-2">
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-xs font-bold text-foreground">Order Confirmed!</p>
        <p className="text-xs text-muted-foreground text-center">
          Order #1046 placed successfully
        </p>
        <p className="text-xs text-gold">ETA: 25 minutes</p>
      </div>
    ),
  },
  {
    id: 4,
    title: "📊 Analytics",
    content: (
      <div className="p-2">
        <p className="text-xs font-bold text-neon-purple mb-3">Today's Stats</p>
        <div className="flex items-end gap-1 h-16 mb-2">
          {[40, 65, 45, 80, 70, 90, 75].map((h) => (
            <div
              key={`bar-height-${h}`}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-gold/40 to-gold"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div className="bg-white/5 rounded p-1 text-center">
            <p className="text-xs font-bold text-gold">₹12,450</p>
            <p className="text-[10px] text-muted-foreground">Revenue</p>
          </div>
          <div className="bg-white/5 rounded p-1 text-center">
            <p className="text-xs font-bold text-neon-cyan">48</p>
            <p className="text-[10px] text-muted-foreground">Orders</p>
          </div>
        </div>
      </div>
    ),
  },
];

const _TEAM = [
  {
    initials: "AM",
    name: "Abhay Vishwakarma",
    role: "Founder & CEO",
    desc: "Passionate about democratizing food tech for small businesses",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    role: "Head of Product",
    desc: "Building the future of restaurant management",
  },
  {
    initials: "RG",
    name: "Rahul Gupta",
    role: "Lead Engineer",
    desc: "Full-stack engineer obsessed with performance",
  },
  {
    initials: "KS",
    name: "Kavya Singh",
    role: "AI/ML Lead",
    desc: "Teaching machines to understand food businesses",
  },
];

const FAQS = [
  {
    q: "Is Food Haveli free to use?",
    a: "Yes! You can start completely free. We offer a free tier with all essential features including menu creation, online ordering, and basic analytics. Premium plans unlock advanced AI features and priority support.",
  },
  {
    q: "Do I need coding skills?",
    a: "Absolutely not! Food Haveli is built for non-technical restaurant owners. If you can use WhatsApp, you can use Food Haveli. Our intuitive interface guides you through every step.",
  },
  {
    q: "How long does setup take?",
    a: "Most restaurants are up and running in under 10 minutes. Add your restaurant name, upload your menu, set your prices, and you're live. No technical knowledge needed.",
  },
  {
    q: "Can I accept online payments?",
    a: "Yes, Food Haveli supports multiple payment methods including UPI, credit/debit cards, net banking, and cash on delivery. All transactions are secured and encrypted.",
  },
  {
    q: "Is there a mobile app?",
    a: "Food Haveli works perfectly on all devices through your browser — no app download required. We're optimized for mobile, tablet, and desktop experiences.",
  },
  {
    q: "How does the AI chatbot work?",
    a: "Our AI Restaurant Assistant is trained on food industry data and can answer customer queries, suggest menu items, handle complaints, and even predict popular dishes based on your order history.",
  },
  {
    q: "Can I customize my menu?",
    a: "Absolutely! You have full control over categories, items, prices, images, descriptions, and availability. You can update your menu in real-time from any device.",
  },
  {
    q: "What kind of analytics do I get?",
    a: "You get real-time data on orders, revenue, popular dishes, peak hours, customer retention rate, average order value, and AI-powered demand predictions.",
  },
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const { pricingPlans } = useCMS();
  const [demoScreen, setDemoScreen] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [contactForm, setContactForm] = useState({
    fullName: "",
    company: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoScreen((s) => (s + 1) % DEMO_SCREENS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  function handlePlanSelect(plan: PricingPlan) {
    if (plan.price === "Free") {
      toast.success("Starter plan activated! You're all set 🎉", {
        position: "top-right",
      });
      setTimeout(() => onNavigate("cms"), 800);
      return;
    }
    setSelectedPlan(plan);
    setShowRazorpay(true);
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setContactForm({ fullName: "", company: "", email: "", message: "" });
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-screen hero-gradient flex items-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {PARTICLES.map((p) => (
            <div
              key={p.key}
              className="absolute rounded-full bg-gold/10 animate-pulse-glow"
              style={{
                width: `${p.width}px`,
                height: `${p.width}px`,
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold/20 to-neon-orange/20 border border-gold/40 rounded-full px-5 py-2 text-sm font-semibold text-gold backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold" />
              </span>
              Where Local Flavours Meet Global Technology.
            </div>
            <h1 className="text-5xl lg:text-6xl font-display font-black leading-tight text-foreground">
              The Future of
              <br />
              <span className="gradient-text">Restaurant</span>
              <br />
              Management is
              <br />
              <span className="bg-gradient-to-r from-gold via-neon-orange to-gold bg-clip-text text-transparent">
                Low-Code.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              Empower your small restaurant, cloud kitchen, or food stall with a
              full digital platform. Orders, analytics, AI support — all in one
              place. No code needed.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                data-ocid="hero.primary_button"
                onClick={() => onNavigate("cms")}
                className="bg-gold hover:bg-gold/90 text-black font-bold px-8 py-6 text-base rounded-full glow-gold transition-all hover:scale-105"
              >
                Start Your Restaurant Website
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                data-ocid="hero.secondary_button"
                onClick={() => onNavigate("dashboard")}
                variant="outline"
                className="border-white/20 text-foreground hover:bg-white/5 px-8 py-6 text-base rounded-full backdrop-blur-sm"
              >
                <Play className="mr-2 w-4 h-4" />
                Try Demo
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                {["Free to start", "No credit card", "Setup in 10 min"].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-gold" />
                      {item}
                    </div>
                  ),
                )}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex -space-x-2">
                  {[
                    { initials: "RK", bg: "bg-red-500" },
                    { initials: "AM", bg: "bg-purple-500" },
                    { initials: "SP", bg: "bg-blue-500" },
                    { initials: "VJ", bg: "bg-green-500" },
                    { initials: "+", bg: "bg-gold/80" },
                  ].map((a) => (
                    <div
                      key={a.initials}
                      className={`w-8 h-8 rounded-full ${a.bg} border-2 border-background flex items-center justify-center text-xs font-bold text-white`}
                    >
                      {a.initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Join <span className="text-gold font-semibold">2,400+</span>{" "}
                  restaurants already live
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative animate-float">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-neon-purple/20 via-gold/10 to-neon-cyan/20 blur-xl" />
              <img
                src="/assets/generated/food-haveli-dashboard-hero-branded.dim_700x500.png"
                alt="Food Haveli AI Platform"
                className="relative rounded-2xl w-full max-w-lg shadow-2xl"
              />
              {/* Single storytelling order notification card */}
              <div className="absolute -bottom-4 -left-4 glass-dark rounded-2xl p-4 shadow-2xl border border-white/10 max-w-[220px]">
                <div className="flex items-start gap-3">
                  <div className="relative mt-0.5">
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      New order received
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Raj's Dhaba · ₹340
                    </p>
                    <p className="text-xs text-green-400 mt-1 font-medium">
                      Just now
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground/60">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="relative bg-card/50 border-y border-border py-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                value: "2,400+",
                label: "Restaurants",
                icon: <Store className="w-5 h-5" />,
              },
              {
                value: "₹8.5Cr+",
                label: "Orders Processed",
                icon: <ShoppingBag className="w-5 h-5" />,
              },
              {
                value: "99.9%",
                label: "Uptime",
                icon: <Zap className="w-5 h-5" />,
              },
              {
                value: "4.9★",
                label: "Rating",
                icon: <Star className="w-5 h-5" />,
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="flex justify-center mb-2 text-gold/60 group-hover:text-gold transition-colors">
                  {stat.icon}
                </div>
                <p className="text-2xl md:text-3xl font-display font-black text-gold animate-pulse">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </section>

      {/* Problems */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-destructive/10 text-destructive border-destructive/30">
              The Problem
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Challenges Facing Small Restaurants
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Over 78% of small restaurants in India struggle with these digital
              challenges daily.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROBLEMS.map((problem) => (
              <div
                key={problem.title}
                className="card-neon rounded-2xl p-6 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-${problem.color}/10 flex items-center justify-center mb-4 text-${problem.color} group-hover:scale-110 transition-transform`}
                >
                  {problem.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {problem.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="py-24 bg-card/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
              The Solution
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              How <span className="text-gold">Food Haveli</span> Solves It
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A complete digital platform built specifically for small
              restaurants in India.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOLUTIONS.map((sol) => (
              <div key={sol.title} className="card-neon rounded-2xl p-6 group">
                <div
                  className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${sol.color} group-hover:scale-110 transition-transform`}
                >
                  {sol.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">{sol.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {sol.desc}
                </p>
                <div className="mt-4 flex items-center text-xs text-gold font-medium">
                  Learn More <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-purple/10 text-neon-purple border-neon-purple/30">
              Process
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              From order to delivery in 5 simple steps
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {HOW_STEPS.map((step) => (
                <div
                  key={step.num}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 rounded-2xl glass-dark flex flex-col items-center justify-center mb-4 group-hover:glow-gold transition-all">
                    <span className="text-xs font-mono text-gold/60 mb-1">
                      {step.num}
                    </span>
                    <div className="text-gold">{step.icon}</div>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 text-sm">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-24 bg-card/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30">
              For You
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Built for Food Businesses
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {USERS.map((user) => (
              <div
                key={user.title}
                className="card-neon rounded-3xl p-8 text-center group relative overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gold/10 text-gold border-gold/20 text-xs">
                    {user.badge}
                  </Badge>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 text-gold group-hover:scale-110 transition-transform">
                  {user.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {user.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {user.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Platform Visual */}
      <section
        className="py-20 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.11 0.012 245) 0%, oklch(0.08 0.015 260) 50%, oklch(0.11 0.012 245) 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, oklch(0.76 0.19 75), transparent 70%)",
            }}
          />
        </div>
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
            Platform Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
            See How <span className="text-gold">Food Haveli</span> Works
          </h2>
          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
            From the moment a customer opens your menu to the second the order
            lands at their table — every step is automated, tracked, and
            beautiful.
          </p>
          <div className="grid grid-cols-3 gap-6 mt-12 max-w-3xl mx-auto">
            {[
              {
                emoji: "🛒",
                title: "Easy Ordering",
                desc: "Customers browse and order in seconds",
              },
              {
                emoji: "⚡",
                title: "Instant Alerts",
                desc: "You get notified the moment an order comes in",
              },
              {
                emoji: "📊",
                title: "Live Analytics",
                desc: "Track revenue, trends and performance",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all"
              >
                <div className="text-2xl mb-2">{f.emoji}</div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="text-xs text-white/50 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/30">
              Benefits
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Why Choose Food Haveli?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="card-neon rounded-2xl p-6 group"
              >
                <div className="text-2xl font-black text-gold mb-2">
                  {benefit.stat}
                </div>
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold mb-3 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="font-bold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features highlight */}
      <section className="py-24 bg-card/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-purple/10 text-neon-purple border-neon-purple/30">
              Features
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Everything You Need
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-neon rounded-2xl p-6">
              <QrCode className="w-8 h-8 text-neon-cyan mb-4" />
              <h3 className="font-bold text-foreground text-lg mb-2">
                QR Code Menu
              </h3>
              <p className="text-muted-foreground text-sm">
                Generate a unique QR code for your restaurant. Customers scan to
                view your full digital menu instantly.
              </p>
            </div>
            <div className="card-neon rounded-2xl p-6">
              <Bot className="w-8 h-8 text-neon-purple mb-4" />
              <h3 className="font-bold text-foreground text-lg mb-2">
                AI Smart Menu Builder
              </h3>
              <p className="text-muted-foreground text-sm">
                Type "Create menu for North Indian restaurant" and AI generates
                categories, dishes, descriptions & prices.
              </p>
            </div>
            <div className="card-neon rounded-2xl p-6">
              <Users className="w-8 h-8 text-gold mb-4" />
              <h3 className="font-bold text-foreground text-lg mb-2">
                WhatsApp Integration
              </h3>
              <p className="text-muted-foreground text-sm">
                New orders instantly sent to your WhatsApp with customer name,
                items, quantity, and total amount.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive App Demo */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30">
              Live Demo
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              See It In Action
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Watch how Food Haveli transforms your restaurant experience
            </p>
          </div>
          <div className="flex flex-col items-center">
            {/* Phone mockup */}
            <div className="relative w-56 bg-[oklch(0.08_0.01_245)] rounded-3xl border-4 border-white/20 shadow-2xl overflow-hidden">
              {/* Notch */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-16 h-4 bg-black rounded-full" />
              </div>
              {/* Screen content */}
              <div className="bg-[oklch(0.11_0.012_245)] min-h-[340px] mx-1 rounded-2xl overflow-hidden">
                <div className="bg-white/5 px-3 py-2 flex items-center justify-between border-b border-white/10">
                  <span className="text-xs font-bold text-gold">
                    Food Haveli
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {demoScreen + 1}/4
                  </span>
                </div>
                <div className="p-1 min-h-[290px] transition-all">
                  <p className="text-xs font-semibold text-center text-foreground py-2">
                    {DEMO_SCREENS[demoScreen].title}
                  </p>
                  {DEMO_SCREENS[demoScreen].content}
                </div>
              </div>
              {/* Home button */}
              <div className="flex justify-center py-3">
                <div className="w-8 h-8 rounded-full border-2 border-white/20" />
              </div>
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-6">
              {DEMO_SCREENS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  data-ocid={`demo.toggle.${i + 1}`}
                  onClick={() => setDemoScreen(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === demoScreen ? "bg-gold w-6" : "bg-white/20"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              {DEMO_SCREENS[demoScreen].title} — Auto-advancing every 3s
            </p>
          </div>
        </div>
      </section>

      {/* Smart Demand Prediction */}
      <section className="py-24 bg-card/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-purple/10 text-neon-purple border-neon-purple/30">
              AI-Powered
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              🧠 Smart Demand Prediction
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              AI analyzes your order history to predict what's coming next
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="font-bold text-foreground mb-2">
                Popular Dishes Forecast
              </h3>
              <p className="text-sm text-muted-foreground">
                Butter Chicken will be{" "}
                <span className="text-green-400 font-semibold">
                  +34% more popular
                </span>{" "}
                this weekend
              </p>
              <div className="mt-4 h-1.5 rounded-full bg-white/5">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-green-500/60 to-green-400" />
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-bold text-foreground mb-2">
                Peak Hour Prediction
              </h3>
              <p className="text-sm text-muted-foreground">
                Expect{" "}
                <span className="text-gold font-semibold">
                  high demand between 7-9 PM
                </span>{" "}
                today
              </p>
              <div className="mt-4 flex gap-1">
                {["6P", "7P", "8P", "9P", "10P"].map((h, i) => (
                  <div
                    key={h}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className={`w-full rounded-t-sm ${
                        i > 0 && i < 3 ? "bg-gold" : "bg-white/20"
                      }`}
                      style={{ height: `${[30, 80, 95, 70, 25][i]}px` }}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {h}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center mb-4">
                <Box className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="font-bold text-foreground mb-2">
                Inventory Planning
              </h3>
              <p className="text-sm text-muted-foreground">
                Pre-order{" "}
                <span className="text-neon-cyan font-semibold">
                  20% more Biryani ingredients
                </span>{" "}
                for Thursday
              </p>
              <div className="mt-4 grid grid-cols-3 gap-1 text-center">
                {["Chicken", "Rice", "Spices"].map((item) => (
                  <div key={item} className="bg-white/5 rounded p-1.5">
                    <p className="text-[10px] text-muted-foreground">{item}</p>
                    <p className="text-xs font-bold text-neon-cyan">+20%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
              Testimonials
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Loved by Restaurant Owners
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="card-neon rounded-2xl p-6">
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <Star
                      key={`${t.name}-star-${j}`}
                      className="w-4 h-4 text-gold fill-gold"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold border border-gold/20 mb-4">
              Pricing
            </span>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Simple, <span className="text-gold">Transparent</span> Pricing
            </h2>
            <p className="text-muted-foreground text-lg">
              Choose the plan that fits your restaurant's needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                data-ocid="pricing.card"
                className={
                  plan.highlighted
                    ? "rounded-2xl border-2 p-8 flex flex-col gap-4 relative scale-105"
                    : "rounded-2xl border border-border bg-card/50 p-8 flex flex-col gap-4"
                }
                style={
                  plan.highlighted
                    ? {
                        borderColor: "oklch(0.75 0.18 60)",
                        background: "oklch(0.13 0.015 60 / 0.5)",
                        boxShadow: "0 0 40px oklch(0.75 0.18 60 / 0.2)",
                      }
                    : {}
                }
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gold text-black text-xs font-bold uppercase tracking-wider">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div>
                  <p
                    className={
                      plan.highlighted
                        ? "text-gold text-sm font-medium uppercase tracking-widest mb-2"
                        : "text-muted-foreground text-sm font-medium uppercase tracking-widest mb-2"
                    }
                  >
                    {plan.name}
                  </p>
                  <p className="text-4xl font-black text-foreground">
                    {plan.price}
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${plan.highlighted ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${plan.highlighted ? "bg-gold/20 text-gold" : "bg-green-500/20 text-green-400"}`}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  data-ocid="pricing.primary_button"
                  onClick={() => handlePlanSelect(plan)}
                  className={
                    plan.highlighted
                      ? "w-full py-3 rounded-xl bg-gold hover:bg-gold/90 text-black text-sm font-bold transition-all hover:scale-105"
                      : "w-full py-3 rounded-xl border border-border text-foreground text-sm font-semibold hover:border-gold/50 hover:text-gold transition-all"
                  }
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team */}
      <section
        className="py-28 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.09 0.018 260), oklch(0.12 0.022 280), oklch(0.1 0.015 300))",
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, oklch(0.76 0.19 75), transparent)",
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full opacity-10"
            style={{
              background:
                "radial-gradient(circle, oklch(0.6 0.22 280), transparent)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
            style={{
              background:
                "radial-gradient(circle, oklch(0.82 0.12 200), transparent)",
            }}
          />
        </div>
        <div className="container max-w-7xl mx-auto px-4 relative">
          {/* Section Header */}
          <div className="text-center mb-20">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6"
              style={{
                background: "oklch(0.76 0.19 75 / 0.1)",
                borderColor: "oklch(0.76 0.19 75 / 0.3)",
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                Leadership
              </span>
            </div>
            <h2
              className="text-5xl md:text-6xl font-display font-black mb-5"
              style={{
                background:
                  "linear-gradient(135deg, #fff 0%, oklch(0.76 0.19 75) 50%, oklch(0.82 0.12 200) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Discover Our
              <br />
              Executive Team
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: "oklch(0.75 0.01 245)" }}
            >
              Visionaries who left comfortable careers at India's top tech
              companies to build the future of restaurant technology.
            </p>
          </div>

          {/* Executive Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Abhay Vishwakarma */}
            <div className="exec-card rounded-3xl p-8 flex flex-col group relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 -translate-y-8 translate-x-8"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.76 0.19 75), transparent)",
                }}
              />
              <div className="animate-shimmer absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              {/* Avatar */}
              <div className="relative mb-8">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-black shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.76 0.19 75), oklch(0.65 0.2 55))",
                    boxShadow: "0 8px 32px oklch(0.76 0.19 75 / 0.4)",
                  }}
                >
                  AM
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-black"
                  style={{ background: "oklch(0.76 0.19 75)" }}
                >
                  <span className="text-xs font-black">AD</span>
                </div>
              </div>
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-1">
                  Abhay Vishwakarma
                </h3>
                <p
                  className="text-sm font-semibold mb-5 tracking-wide uppercase"
                  style={{ color: "oklch(0.76 0.19 75)" }}
                >
                  CEO & CTO — App Designer & Insight Maker
                </p>
                <blockquote
                  className="text-sm leading-relaxed italic mb-6 border-l-2 pl-4"
                  style={{
                    color: "oklch(0.78 0.01 245)",
                    borderColor: "oklch(0.76 0.19 75 / 0.4)",
                  }}
                >
                  "I started Food Haveli because I saw small restaurant owners
                  struggling to compete in a digital world. My goal is simple —
                  give every local food business the tools they need to grow,
                  without needing any technical knowledge."
                </blockquote>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["App Design", "UI/UX", "Data Insights"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                      style={{
                        background: "oklch(0.76 0.19 75 / 0.15)",
                        color: "oklch(0.76 0.19 75)",
                        border: "1px solid oklch(0.76 0.19 75 / 0.3)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.76 0.19 75 / 0.1)",
                    color: "oklch(0.76 0.19 75)",
                    border: "1px solid oklch(0.76 0.19 75 / 0.3)",
                  }}
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => window.open("https://twitter.com", "_blank")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.82 0.12 200 / 0.1)",
                    color: "oklch(0.82 0.12 200)",
                    border: "1px solid oklch(0.82 0.12 200 / 0.3)",
                  }}
                >
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </button>
              </div>
            </div>

            {/* Prabhat Shukla */}
            <div className="exec-card rounded-3xl p-8 flex flex-col group relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 -translate-y-8 translate-x-8"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.6 0.22 280), transparent)",
                }}
              />
              <div className="animate-shimmer absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative mb-8">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.24 280), oklch(0.45 0.2 300))",
                    boxShadow: "0 8px 32px oklch(0.6 0.22 280 / 0.4)",
                  }}
                >
                  PS
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-white"
                  style={{ background: "oklch(0.55 0.24 280)" }}
                >
                  <span className="text-xs font-black">WD</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-1">
                  Prabhat Shukla
                </h3>
                <p
                  className="text-sm font-semibold mb-5 tracking-wide uppercase"
                  style={{ color: "oklch(0.75 0.2 280)" }}
                >
                  CIO — Web Designer & ERP Manager
                </p>
                <blockquote
                  className="text-sm leading-relaxed italic mb-6 border-l-2 pl-4"
                  style={{
                    color: "oklch(0.78 0.01 245)",
                    borderColor: "oklch(0.6 0.22 280 / 0.4)",
                  }}
                >
                  "I believe every restaurant owner deserves a beautiful,
                  professional website without having to hire anyone or spend a
                  fortune. I make sure Food Haveli is easy to use, fast to set
                  up, and works perfectly for every type of food business."
                </blockquote>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Web Design", "ERP Systems", "Business Automation"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          background: "oklch(0.6 0.22 280 / 0.15)",
                          color: "oklch(0.75 0.2 280)",
                          border: "1px solid oklch(0.6 0.22 280 / 0.3)",
                        }}
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.6 0.22 280 / 0.1)",
                    color: "oklch(0.75 0.2 280)",
                    border: "1px solid oklch(0.6 0.22 280 / 0.3)",
                  }}
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => window.open("https://twitter.com", "_blank")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.82 0.12 200 / 0.1)",
                    color: "oklch(0.82 0.12 200)",
                    border: "1px solid oklch(0.82 0.12 200 / 0.3)",
                  }}
                >
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </button>
              </div>
            </div>

            {/* Ramjipal */}
            <div className="exec-card rounded-3xl p-8 flex flex-col group relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-5 -translate-y-8 translate-x-8"
                style={{
                  background:
                    "radial-gradient(circle, oklch(0.82 0.12 200), transparent)",
                }}
              />
              <div className="animate-shimmer absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="relative mb-8">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-black shadow-lg"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.12 200), oklch(0.7 0.15 210))",
                    boxShadow: "0 8px 32px oklch(0.82 0.12 200 / 0.4)",
                  }}
                >
                  RJ
                </div>
                <div
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg flex items-center justify-center text-black"
                  style={{ background: "oklch(0.82 0.12 200)" }}
                >
                  <span className="text-xs font-black">AC</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-white mb-1">
                  Ramjipal
                </h3>
                <p
                  className="text-sm font-semibold mb-5 tracking-wide uppercase"
                  style={{ color: "oklch(0.82 0.12 200)" }}
                >
                  COO — Automation Coordinator
                </p>
                <blockquote
                  className="text-sm leading-relaxed italic mb-6 border-l-2 pl-4"
                  style={{
                    color: "oklch(0.78 0.01 245)",
                    borderColor: "oklch(0.82 0.12 200 / 0.4)",
                  }}
                >
                  "Running a restaurant is already hard work. I focus on making
                  sure all the day-to-day tasks — taking orders, managing the
                  menu, tracking sales — happen automatically, so owners can
                  spend more time doing what they love: serving great food."
                </blockquote>
                <div className="flex flex-wrap gap-2 mb-6">
                  {["Process Automation", "Workflow Design", "Operations"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full font-medium"
                        style={{
                          background: "oklch(0.82 0.12 200 / 0.15)",
                          color: "oklch(0.82 0.12 200)",
                          border: "1px solid oklch(0.82 0.12 200 / 0.3)",
                        }}
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => window.open("https://linkedin.com", "_blank")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.82 0.12 200 / 0.1)",
                    color: "oklch(0.82 0.12 200)",
                    border: "1px solid oklch(0.82 0.12 200 / 0.3)",
                  }}
                >
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                </button>
                <button
                  type="button"
                  onClick={() => window.open("https://twitter.com", "_blank")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    background: "oklch(0.76 0.19 75 / 0.1)",
                    color: "oklch(0.76 0.19 75)",
                    border: "1px solid oklch(0.76 0.19 75 / 0.3)",
                  }}
                >
                  <Twitter className="w-3.5 h-3.5" /> Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/30">
              FAQ
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={faq.q}
                  value={faq.q}
                  data-ocid={`faq.item.${i + 1}`}
                  className="card-neon rounded-2xl border-0 px-6"
                >
                  <AccordionTrigger className="text-foreground font-semibold hover:no-underline hover:text-gold py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Get in Touch */}
      <section className="py-24 bg-card/30">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30">
              Contact Us
            </Badge>
            <h2 className="text-4xl font-display font-black text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-muted-foreground text-lg">
              Have questions? We'd love to hear from you
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact info */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground mb-6">
                Contact Information
              </h3>
              {[
                { icon: "📧", label: "Email", value: "support@foodhaveli.com" },
                { icon: "📞", label: "Phone", value: "+91 98765 43210" },
                { icon: "📍", label: "Location", value: "Bangalore, India" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-4 card-neon rounded-xl p-4"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
              <div className="card-neon rounded-xl p-6 mt-6">
                <p className="text-sm text-foreground font-semibold mb-2">
                  Response Time
                </p>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24 hours on business days. For
                  urgent matters, please call directly.
                </p>
              </div>
            </div>

            {/* Contact form */}
            <form
              data-ocid="contact.panel"
              onSubmit={handleContactSubmit}
              className="card-neon rounded-2xl p-8 space-y-5"
            >
              <div>
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Full Name
                </label>
                <Input
                  id="contact-name"
                  data-ocid="contact.input"
                  placeholder="Rajesh Kumar"
                  value={contactForm.fullName}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, fullName: e.target.value }))
                  }
                  className="bg-white/5 border-white/10 focus:border-gold/50"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact-company"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Company
                </label>
                <Input
                  id="contact-company"
                  data-ocid="contact.input"
                  placeholder="Spice Garden Restaurant"
                  value={contactForm.company}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, company: e.target.value }))
                  }
                  className="bg-white/5 border-white/10 focus:border-gold/50"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Email Address
                </label>
                <Input
                  id="contact-email"
                  data-ocid="contact.input"
                  type="email"
                  placeholder="rajesh@spicegarden.com"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="bg-white/5 border-white/10 focus:border-gold/50"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-foreground mb-1.5 block"
                >
                  Your Message
                </label>
                <Textarea
                  id="contact-message"
                  data-ocid="contact.textarea"
                  placeholder="Tell us how we can help you..."
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, message: e.target.value }))
                  }
                  className="bg-white/5 border-white/10 focus:border-gold/50 resize-none"
                  rows={4}
                  required
                />
              </div>
              <Button
                data-ocid="contact.submit_button"
                type="submit"
                className="w-full bg-gold hover:bg-gold/90 text-black font-bold rounded-full"
              >
                Send Message
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gold/20 via-neon-purple/10 to-neon-cyan/10 border border-gold/20 p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-4">
                Ready to <span className="text-gold">Go Digital?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                Join 2,400+ restaurants already using Food Haveli. Setup takes
                less than 10 minutes.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  data-ocid="cta.primary_button"
                  onClick={() => onNavigate("cms")}
                  className="bg-gold hover:bg-gold/90 text-black font-bold px-10 py-6 text-lg rounded-full glow-gold"
                >
                  Launch Your Platform
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  data-ocid="cta.secondary_button"
                  onClick={() => onNavigate("dashboard")}
                  variant="outline"
                  className="border-white/20 text-foreground hover:bg-white/5 px-10 py-6 text-lg rounded-full"
                >
                  View Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border pt-16 pb-8">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 font-display font-bold text-xl mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                  <span className="text-black text-sm font-black">F</span>
                </div>
                Food <span className="text-gold">Haveli</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering small restaurants to go digital with AI-powered
                tools.
              </p>
            </div>
            {FOOTER_COLS.map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      {col.title === "Solutions" ? (
                        <button
                          type="button"
                          className="text-sm text-muted-foreground hover:text-gold transition-colors"
                        >
                          {link}
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground cursor-default">
                          {link}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()}. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                className="text-gold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                caffeine.ai
              </a>
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <button type="button" className="hover:text-foreground">
                Privacy
              </button>
              <button type="button" className="hover:text-foreground">
                Terms
              </button>
              <button type="button" className="hover:text-foreground">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
      {/* Razorpay Payment Modal */}
      <AnimatePresence>
        {showRazorpay && selectedPlan && (
          <RazorpayModal
            plan={selectedPlan}
            onClose={() => {
              setShowRazorpay(false);
              setSelectedPlan(null);
            }}
            onSuccess={(orderId) => {
              setShowRazorpay(false);
              toast.success(`Payment successful! Order ID: ${orderId}`, {
                position: "top-right",
              });
              setTimeout(() => onNavigate("dashboard"), 800);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
