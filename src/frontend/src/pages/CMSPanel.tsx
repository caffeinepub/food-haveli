import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Building2,
  CheckCircle2,
  ChefHat,
  Edit2,
  Lock,
  Package,
  PlusCircle,
  Receipt,
  ShoppingBag,
  Store,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type {
  MenuItem,
  Order,
  PricingPlan,
  VendorRestaurant,
} from "../context/CMSContext";
import { useCMS } from "../context/CMSContext";

type Tab = "menu" | "restaurant" | "pricing" | "orders" | "vendors" | "guide";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "menu", label: "Menu Manager", icon: <ChefHat className="w-4 h-4" /> },
  {
    id: "restaurant",
    label: "Restaurant Info",
    icon: <Building2 className="w-4 h-4" />,
  },
  { id: "pricing", label: "Pricing Plans", icon: <Tag className="w-4 h-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingBag className="w-4 h-4" /> },
  {
    id: "vendors",
    label: "Vendor Manager",
    icon: <Users className="w-4 h-4" />,
  },
  { id: "guide", label: "How to Use", icon: <BookOpen className="w-4 h-4" /> },
];

const CATEGORIES = ["Mains", "Breads", "Drinks", "Desserts", "Snacks"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  preparing: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  ready: "bg-green-500/15 text-green-400 border-green-500/30",
  delivered: "bg-slate-500/15 text-slate-400 border-slate-500/30",
  active: "bg-green-500/15 text-green-400 border-green-500/30",
  suspended: "bg-red-500/15 text-red-400 border-red-500/30",
};

function emptyMenuItem(): Omit<MenuItem, "id"> {
  return {
    name: "",
    category: "Mains",
    price: 0,
    desc: "",
    image: "",
    popular: false,
    available: true,
    rating: 4.5,
  };
}

function emptyVendor(): Omit<VendorRestaurant, "id"> {
  return {
    name: "",
    ownerName: "",
    phone: "",
    cuisine: "",
    plan: "Starter",
    status: "pending",
    joinedDate: new Date().toISOString().split("T")[0],
  };
}

export default function CMSPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("menu");
  const cms = useCMS();

  return (
    <div className="min-h-screen bg-background pt-16 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/30 fixed top-16 left-0 bottom-0 z-10 p-4">
        {/* CMS Lock header */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Lock className="w-4 h-4 text-gold" />
          </div>
          <div>
            <p className="text-xs font-bold text-gold uppercase tracking-widest">
              CMS Panel
            </p>
            <p className="text-[10px] text-muted-foreground">Owner Access</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              data-ocid={`cms.${tab.id}.tab`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-2 py-3 rounded-xl bg-green-500/5 border border-green-500/10">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs text-green-400 font-medium">
              Auto-saved
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground">
            All changes saved to localStorage and reflected live.
          </p>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed top-16 left-0 right-0 z-10 bg-card/95 backdrop-blur border-b border-border flex overflow-x-auto gap-1 p-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-12 md:mt-0">
        {activeTab === "menu" && <MenuManagerTab cms={cms} />}
        {activeTab === "restaurant" && <RestaurantInfoTab cms={cms} />}
        {activeTab === "pricing" && <PricingPlansTab cms={cms} />}
        {activeTab === "orders" && <OrdersTab cms={cms} />}
        {activeTab === "vendors" && <VendorManagerTab cms={cms} />}
        {activeTab === "guide" && <HowToUseTab />}
      </main>
    </div>
  );
}

// ─── Menu Manager ───────────────────────────────────────────────────────────

function MenuManagerTab({ cms }: { cms: ReturnType<typeof useCMS> }) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<MenuItem, "id">>(emptyMenuItem());
  const [errors, setErrors] = useState<Partial<Record<keyof MenuItem, string>>>(
    {},
  );
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cms.menuItems.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );
  }, [cms.menuItems, search]);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.price || form.price <= 0) errs.price = "Valid price required";
    if (!form.desc.trim()) errs.desc = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (editingId !== null) {
      cms.updateMenuItem(editingId, form);
      toast.success(`✅ "${form.name}" updated!`);
    } else {
      cms.addMenuItem(form);
      toast.success(`🍽️ "${form.name}" added to menu!`);
    }
    setForm(emptyMenuItem());
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const startEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      category: item.category,
      price: item.price,
      desc: item.desc,
      image: item.image,
      popular: item.popular,
      available: item.available,
      rating: item.rating,
    });
    setEditingId(item.id);
    setShowForm(true);
    setErrors({});
  };

  const cancelForm = () => {
    setForm(emptyMenuItem());
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">
            Menu <span className="text-gold">Manager</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {cms.menuItems.length} items · {filtered.length} shown
          </p>
        </div>
        <Button
          data-ocid="cms.menu.open_modal_button"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyMenuItem());
          }}
          className="bg-gold hover:bg-gold/90 text-black font-semibold gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Item
        </Button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div
          data-ocid="cms.menu.panel"
          className="rounded-2xl border border-gold/20 bg-card/50 backdrop-blur p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">
              {editingId !== null ? "Edit Item" : "Add New Item"}
            </h3>
            <button
              type="button"
              onClick={cancelForm}
              className="p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Name *</Label>
              <Input
                data-ocid="cms.menu.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Dish name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((p) => ({ ...p, category: v }))}
              >
                <SelectTrigger data-ocid="cms.menu.select" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Price (₹) *</Label>
              <Input
                data-ocid="cms.menu.input"
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm((p) => ({ ...p, price: Number(e.target.value) }))
                }
                placeholder="0"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-xs text-red-400">{errors.price}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input
                data-ocid="cms.menu.input"
                value={form.image}
                onChange={(e) =>
                  setForm((p) => ({ ...p, image: e.target.value }))
                }
                placeholder="/assets/generated/..."
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label>Description *</Label>
              <Textarea
                data-ocid="cms.menu.textarea"
                value={form.desc}
                onChange={(e) =>
                  setForm((p) => ({ ...p, desc: e.target.value }))
                }
                rows={2}
                placeholder="Short description"
                className={errors.desc ? "border-red-500" : ""}
              />
              {errors.desc && (
                <p className="text-xs text-red-400">{errors.desc}</p>
              )}
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="cms.menu.switch"
                  checked={form.popular}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, popular: v }))
                  }
                  id="popular"
                />
                <Label htmlFor="popular">Popular</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  data-ocid="cms.menu.switch"
                  checked={form.available}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, available: v }))
                  }
                  id="available"
                />
                <Label htmlFor="available">Available</Label>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              data-ocid="cms.menu.submit_button"
              onClick={handleSubmit}
              className="bg-gold hover:bg-gold/90 text-black font-semibold"
            >
              {editingId !== null ? "Update Item" : "Add Item"}
            </Button>
            <Button
              data-ocid="cms.menu.cancel_button"
              variant="outline"
              onClick={cancelForm}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Input
          data-ocid="cms.menu.search_input"
          placeholder="Search by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-4 bg-card/50"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card/80 border-b border-border">
              <th className="text-left p-3 font-semibold text-muted-foreground">
                Item
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground hidden sm:table-cell">
                Category
              </th>
              <th className="text-right p-3 font-semibold text-muted-foreground">
                Price
              </th>
              <th className="text-center p-3 font-semibold text-muted-foreground hidden md:table-cell">
                Popular
              </th>
              <th className="text-center p-3 font-semibold text-muted-foreground hidden md:table-cell">
                Available
              </th>
              <th className="text-center p-3 font-semibold text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  <span data-ocid="cms.menu.empty_state">No items found.</span>
                </td>
              </tr>
            ) : (
              filtered.map((item, i) => (
                <tr
                  key={item.id}
                  data-ocid={`cms.menu.row.${i + 1}`}
                  className="border-b border-border/50 hover:bg-white/3 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {item.name}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="p-3 text-right font-bold text-gold">
                    ₹{item.price}
                  </td>
                  <td className="p-3 text-center hidden md:table-cell">
                    <Switch
                      checked={item.popular}
                      onCheckedChange={(v) => {
                        cms.updateMenuItem(item.id, { popular: v });
                        toast.success("Updated!");
                      }}
                    />
                  </td>
                  <td className="p-3 text-center hidden md:table-cell">
                    <Switch
                      checked={item.available}
                      onCheckedChange={(v) => {
                        cms.updateMenuItem(item.id, { available: v });
                        toast.success("Updated!");
                      }}
                    />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        data-ocid={`cms.menu.edit_button.${i + 1}`}
                        onClick={() => startEdit(item)}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirm === item.id ? (
                        <>
                          <button
                            type="button"
                            data-ocid={`cms.menu.confirm_button.${i + 1}`}
                            onClick={() => {
                              cms.deleteMenuItem(item.id);
                              toast.success(`🗑 Deleted "${item.name}"`);
                              setDeleteConfirm(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            data-ocid={`cms.menu.cancel_button.${i + 1}`}
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-muted-foreground text-xs font-medium"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          data-ocid={`cms.menu.delete_button.${i + 1}`}
                          onClick={() => setDeleteConfirm(item.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Restaurant Info ─────────────────────────────────────────────────────────

function RestaurantInfoTab({ cms }: { cms: ReturnType<typeof useCMS> }) {
  const [form, setForm] = useState({ ...cms.restaurantInfo });

  const handleSave = () => {
    cms.updateRestaurantInfo(form);
    toast.success("✅ Restaurant info saved!");
  };

  const fields: {
    key: keyof typeof form;
    label: string;
    placeholder: string;
  }[] = [
    { key: "name", label: "Restaurant Name", placeholder: "Food Haveli" },
    {
      key: "tagline",
      label: "Tagline",
      placeholder: "Order Fresh. Eat Happy...",
    },
    {
      key: "address",
      label: "Address",
      placeholder: "Connaught Place, New Delhi – 110001",
    },
    { key: "phone", label: "Phone", placeholder: "+91-98765-43210" },
    { key: "email", label: "Email", placeholder: "hello@foodhaveli.in" },
    { key: "gstin", label: "GSTIN", placeholder: "07AABCU9603R1ZX" },
    { key: "openHours", label: "Open Hours", placeholder: "10 AM – 11 PM" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">
          Restaurant <span className="text-gold">Info</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          This data appears on invoices and across the app
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur p-6 space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1">
            <Label>{f.label}</Label>
            <Input
              data-ocid={`cms.restaurant.${f.key}_input`}
              value={form[f.key]}
              onChange={(e) =>
                setForm((p) => ({ ...p, [f.key]: e.target.value }))
              }
              placeholder={f.placeholder}
            />
          </div>
        ))}
        <Button
          data-ocid="cms.restaurant.save_button"
          onClick={handleSave}
          className="bg-gold hover:bg-gold/90 text-black font-semibold w-full mt-2"
        >
          Save Changes
        </Button>
      </div>

      {/* Invoice preview */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-card/50">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Invoice Preview
          </p>
        </div>
        <div
          className="p-6 flex flex-col sm:flex-row gap-4 justify-between"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.38 0.18 30), oklch(0.52 0.20 50))",
          }}
        >
          <div className="text-white">
            <p className="text-xl font-black">{form.name}</p>
            <p className="text-white/70 text-xs">{form.tagline}</p>
            <p className="text-white/80 text-sm mt-2">{form.address}</p>
            <p className="text-white/80 text-sm">{form.phone}</p>
            <p className="text-white/60 text-xs mt-1">GSTIN: {form.gstin}</p>
          </div>
          <div className="text-white text-right">
            <Badge className="bg-white/20 text-white border-white/30">
              TAX INVOICE
            </Badge>
            <p className="text-sm text-white/70 mt-2">{form.email}</p>
            <p className="text-sm text-white/70">{form.openHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pricing Plans ───────────────────────────────────────────────────────────

function PricingPlansTab({ cms }: { cms: ReturnType<typeof useCMS> }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newPlan, setNewPlan] = useState<Omit<PricingPlan, "id">>({
    name: "",
    price: "",
    badge: "",
    features: [],
    cta: "",
    highlighted: false,
  });
  const [newFeaturesText, setNewFeaturesText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleSavePlan = (plan: PricingPlan, featuresText: string) => {
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    cms.updatePricingPlan(plan.id, { ...plan, features });
    toast.success("✅ Plan updated!");
    setEditingId(null);
  };

  const handleAddPlan = () => {
    if (!newPlan.name.trim() || !newPlan.price.trim()) {
      toast.error("Name and price are required");
      return;
    }
    const features = newFeaturesText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
    cms.addPricingPlan({ ...newPlan, features });
    toast.success("✅ Plan added!");
    setNewPlan({
      name: "",
      price: "",
      badge: "",
      features: [],
      cta: "",
      highlighted: false,
    });
    setNewFeaturesText("");
    setShowNewForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">
            Pricing <span className="text-gold">Plans</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {cms.pricingPlans.length} plans on your homepage
          </p>
        </div>
        <Button
          data-ocid="cms.pricing.open_modal_button"
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-gold hover:bg-gold/90 text-black font-semibold gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Plan
        </Button>
      </div>

      {showNewForm && (
        <PlanForm
          plan={{ id: "_new", ...newPlan }}
          featuresText={newFeaturesText}
          onFeaturesChange={setNewFeaturesText}
          onChange={(key, val) => setNewPlan((p) => ({ ...p, [key]: val }))}
          onSave={handleAddPlan}
          onCancel={() => setShowNewForm(false)}
          isNew
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cms.pricingPlans.map((plan) => (
          <EditablePlanCard
            key={plan.id}
            plan={plan}
            isEditing={editingId === plan.id}
            onEdit={() => setEditingId(plan.id)}
            onSave={handleSavePlan}
            onCancel={() => setEditingId(null)}
            onDelete={() => setDeleteConfirm(plan.id)}
            deleteConfirm={deleteConfirm === plan.id}
            onConfirmDelete={() => {
              cms.deletePricingPlan(plan.id);
              toast.success("Plan deleted");
              setDeleteConfirm(null);
            }}
            onCancelDelete={() => setDeleteConfirm(null)}
          />
        ))}
      </div>
    </div>
  );
}

function PlanForm({
  plan,
  featuresText,
  onFeaturesChange,
  onChange,
  onSave,
  onCancel,
  isNew,
}: {
  plan: PricingPlan;
  featuresText: string;
  onFeaturesChange: (v: string) => void;
  onChange: (key: string, val: string | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-card/50 backdrop-blur p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">
          {isNew ? "New Plan" : "Edit Plan"}
        </h3>
        <button type="button" onClick={onCancel}>
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label>Plan Name</Label>
          <Input
            data-ocid="cms.pricing.input"
            value={plan.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Starter"
          />
        </div>
        <div className="space-y-1">
          <Label>Price</Label>
          <Input
            data-ocid="cms.pricing.input"
            value={plan.price}
            onChange={(e) => onChange("price", e.target.value)}
            placeholder="Free or ₹999/month"
          />
        </div>
        <div className="space-y-1">
          <Label>Badge (optional)</Label>
          <Input
            data-ocid="cms.pricing.input"
            value={plan.badge}
            onChange={(e) => onChange("badge", e.target.value)}
            placeholder="Recommended"
          />
        </div>
        <div className="space-y-1">
          <Label>CTA Button Text</Label>
          <Input
            data-ocid="cms.pricing.input"
            value={plan.cta}
            onChange={(e) => onChange("cta", e.target.value)}
            placeholder="Get Started"
          />
        </div>
        <div className="space-y-1 col-span-2">
          <Label>Features (one per line)</Label>
          <Textarea
            data-ocid="cms.pricing.textarea"
            value={featuresText}
            onChange={(e) => onFeaturesChange(e.target.value)}
            rows={4}
            placeholder="Online menu&#10;Unlimited orders&#10;AI chatbot"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            data-ocid="cms.pricing.switch"
            checked={plan.highlighted}
            onCheckedChange={(v) => onChange("highlighted", v)}
            id="highlighted"
          />
          <Label htmlFor="highlighted">Highlighted (featured)</Label>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          data-ocid="cms.pricing.save_button"
          onClick={onSave}
          className="bg-gold hover:bg-gold/90 text-black font-semibold"
        >
          Save
        </Button>
        <Button
          data-ocid="cms.pricing.cancel_button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function EditablePlanCard({
  plan,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  deleteConfirm,
  onConfirmDelete,
  onCancelDelete,
}: {
  plan: PricingPlan;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (plan: PricingPlan, features: string) => void;
  onCancel: () => void;
  onDelete: () => void;
  deleteConfirm: boolean;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}) {
  const [localPlan, setLocalPlan] = useState({ ...plan });
  const [featuresText, setFeaturesText] = useState(plan.features.join("\n"));

  if (isEditing) {
    return (
      <PlanForm
        plan={localPlan}
        featuresText={featuresText}
        onFeaturesChange={setFeaturesText}
        onChange={(key, val) => setLocalPlan((p) => ({ ...p, [key]: val }))}
        onSave={() => onSave(localPlan, featuresText)}
        onCancel={onCancel}
      />
    );
  }

  return (
    <div
      data-ocid="cms.pricing.card"
      className={`rounded-2xl p-5 flex flex-col gap-3 border ${
        plan.highlighted
          ? "border-gold/40 bg-gold/5"
          : "border-border bg-card/50"
      }`}
    >
      {plan.badge && (
        <span className="inline-block px-3 py-0.5 rounded-full bg-gold text-black text-xs font-bold self-start">
          {plan.badge}
        </span>
      )}
      <div>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">
          {plan.name}
        </p>
        <p className="text-2xl font-black text-foreground mt-1">{plan.price}</p>
      </div>
      <ul className="space-y-1.5 flex-1">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className="w-3.5 h-3.5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-[9px]">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
      <p className="text-xs font-semibold text-foreground border border-border rounded-lg py-2 text-center">
        {plan.cta}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          data-ocid="cms.pricing.edit_button"
          onClick={onEdit}
          className="flex-1 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-medium flex items-center justify-center gap-1"
        >
          <Edit2 className="w-3 h-3" /> Edit
        </button>
        {deleteConfirm ? (
          <>
            <button
              type="button"
              data-ocid="cms.pricing.confirm_button"
              onClick={onConfirmDelete}
              className="flex-1 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium"
            >
              Confirm
            </button>
            <button
              type="button"
              data-ocid="cms.pricing.cancel_button"
              onClick={onCancelDelete}
              className="flex-1 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-xs font-medium"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            data-ocid="cms.pricing.delete_button"
            onClick={onDelete}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Orders ──────────────────────────────────────────────────────────────────

function OrdersTab({ cms }: { cms: ReturnType<typeof useCMS> }) {
  const [filter, setFilter] = useState<Order["status"] | "all">("all");

  const filtered =
    filter === "all"
      ? cms.orders
      : cms.orders.filter((o) => o.status === filter);
  const totalRevenue = cms.orders.reduce((sum, o) => sum + o.amount, 0);
  const activeRevenue = cms.orders
    .filter((o) => o.status !== "delivered")
    .reduce((sum, o) => sum + o.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">
          Live <span className="text-gold">Orders</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage and update order statuses in real-time
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: cms.orders.length,
            color: "text-foreground",
          },
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString()}`,
            color: "text-gold",
          },
          {
            label: "Active Orders",
            value: cms.orders.filter((o) => o.status !== "delivered").length,
            color: "text-orange-400",
          },
          {
            label: "Active Revenue",
            value: `₹${activeRevenue.toLocaleString()}`,
            color: "text-green-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card/50 p-4"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-xl font-black mt-1 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "preparing", "ready", "delivered"] as const).map(
          (s) => (
            <button
              key={s}
              type="button"
              data-ocid="cms.orders.tab"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filter === s
                  ? "bg-gold text-black"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {s === "all" ? `All (${cms.orders.length})` : s}
            </button>
          ),
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-card/80 border-b border-border">
              <th className="text-left p-3 font-semibold text-muted-foreground">
                Order ID
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground">
                Customer
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground hidden md:table-cell">
                Items
              </th>
              <th className="text-right p-3 font-semibold text-muted-foreground">
                Amount
              </th>
              <th className="text-center p-3 font-semibold text-muted-foreground">
                Status
              </th>
              <th className="text-center p-3 font-semibold text-muted-foreground hidden sm:table-cell">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="cms.orders.empty_state"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((order, i) => (
                <tr
                  key={order.id}
                  data-ocid={`cms.orders.row.${i + 1}`}
                  className="border-b border-border/50 hover:bg-white/3 transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-muted-foreground">
                    {order.id}
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-foreground">
                      {order.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Table {order.table}
                    </p>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground hidden md:table-cell max-w-xs truncate">
                    {order.items}
                  </td>
                  <td className="p-3 text-right font-bold text-gold">
                    ₹{order.amount}
                  </td>
                  <td className="p-3 text-center">
                    <select
                      data-ocid={`cms.orders.select.${i + 1}`}
                      value={order.status}
                      onChange={(e) => {
                        cms.updateOrderStatus(
                          order.id,
                          e.target.value as Order["status"],
                        );
                        toast.success(`Order ${order.id} → ${e.target.value}`);
                      }}
                      className={`text-xs px-2 py-1 rounded-full border font-medium bg-transparent cursor-pointer ${STATUS_COLORS[order.status] ?? ""}`}
                    >
                      {(
                        ["pending", "preparing", "ready", "delivered"] as const
                      ).map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-background text-foreground capitalize"
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-center text-xs text-muted-foreground hidden sm:table-cell">
                    {order.time}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Vendor Manager ──────────────────────────────────────────────────────────

function VendorManagerTab({ cms }: { cms: ReturnType<typeof useCMS> }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Omit<VendorRestaurant, "id">>(emptyVendor());
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const planNames = cms.pricingPlans.map((p) => p.name);
  const activeCount = cms.vendors.filter((v) => v.status === "active").length;
  const vendorRevenue = cms.vendors
    .filter((v) => v.status === "active")
    .reduce((sum, v) => {
      const plan = cms.pricingPlans.find((p) => p.name === v.plan);
      const price = plan ? Number(plan.price.replace(/[^0-9]/g, "")) : 0;
      return sum + price;
    }, 0);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.ownerName.trim()) {
      toast.error("Name and owner are required");
      return;
    }
    if (editingId !== null) {
      cms.updateVendor(editingId, form);
      toast.success("✅ Vendor updated!");
    } else {
      cms.addVendor(form);
      toast.success("🏪 New vendor onboarded!");
    }
    setForm(emptyVendor());
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (v: VendorRestaurant) => {
    setForm({
      name: v.name,
      ownerName: v.ownerName,
      phone: v.phone,
      cuisine: v.cuisine,
      plan: v.plan,
      status: v.status,
      joinedDate: v.joinedDate,
    });
    setEditingId(v.id);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">
            Vendor <span className="text-gold">Manager</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Sell the Platform — Onboard restaurants to use Food Haveli
          </p>
        </div>
        <Button
          data-ocid="cms.vendors.open_modal_button"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setForm(emptyVendor());
          }}
          className="bg-gold hover:bg-gold/90 text-black font-semibold gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Vendor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-4 h-4 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Total Vendors</p>
          </div>
          <p className="text-2xl font-black text-foreground">
            {cms.vendors.length}
          </p>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <p className="text-xs text-green-400">Active</p>
          </div>
          <p className="text-2xl font-black text-green-400">{activeCount}</p>
        </div>
        <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Receipt className="w-4 h-4 text-gold" />
            <p className="text-xs text-gold">Monthly Revenue</p>
          </div>
          <p className="text-2xl font-black text-gold">
            ₹{vendorRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Inline vendor form */}
      {showForm && (
        <div
          data-ocid="cms.vendors.panel"
          className="rounded-2xl border border-gold/20 bg-card/50 backdrop-blur p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">
              {editingId !== null ? "Edit Vendor" : "Onboard New Restaurant"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Restaurant Name *</Label>
              <Input
                data-ocid="cms.vendors.input"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Spice Garden"
              />
            </div>
            <div className="space-y-1">
              <Label>Owner Name *</Label>
              <Input
                data-ocid="cms.vendors.input"
                value={form.ownerName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, ownerName: e.target.value }))
                }
                placeholder="Amit Kumar"
              />
            </div>
            <div className="space-y-1">
              <Label>Phone</Label>
              <Input
                data-ocid="cms.vendors.input"
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="+91-98XXX-XXXXX"
              />
            </div>
            <div className="space-y-1">
              <Label>Cuisine Type</Label>
              <Input
                data-ocid="cms.vendors.input"
                value={form.cuisine}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cuisine: e.target.value }))
                }
                placeholder="North Indian"
              />
            </div>
            <div className="space-y-1">
              <Label>Plan</Label>
              <Select
                value={form.plan}
                onValueChange={(v) => setForm((p) => ({ ...p, plan: v }))}
              >
                <SelectTrigger data-ocid="cms.vendors.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {planNames.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({
                    ...p,
                    status: v as VendorRestaurant["status"],
                  }))
                }
              >
                <SelectTrigger data-ocid="cms.vendors.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              data-ocid="cms.vendors.submit_button"
              onClick={handleSubmit}
              className="bg-gold hover:bg-gold/90 text-black font-semibold"
            >
              {editingId !== null ? "Update Vendor" : "Onboard Vendor"}
            </Button>
            <Button
              data-ocid="cms.vendors.cancel_button"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="bg-card/80 border-b border-border">
              <th className="text-left p-3 font-semibold text-muted-foreground">
                Restaurant
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground">
                Owner
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground">
                Cuisine
              </th>
              <th className="text-left p-3 font-semibold text-muted-foreground">
                Plan
              </th>
              <th className="text-center p-3 font-semibold text-muted-foreground">
                Status
              </th>
              <th className="text-center p-3 font-semibold text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {cms.vendors.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="cms.vendors.empty_state"
                >
                  No vendors yet. Onboard your first restaurant!
                </td>
              </tr>
            ) : (
              cms.vendors.map((vendor, i) => (
                <tr
                  key={vendor.id}
                  data-ocid={`cms.vendors.row.${i + 1}`}
                  className="border-b border-border/50 hover:bg-white/3 transition-colors"
                >
                  <td className="p-3">
                    <p className="font-medium text-foreground">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {vendor.phone}
                    </p>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {vendor.ownerName}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {vendor.cuisine}
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {vendor.plan}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <select
                      data-ocid={`cms.vendors.select.${i + 1}`}
                      value={vendor.status}
                      onChange={(e) => {
                        cms.updateVendor(vendor.id, {
                          status: e.target.value as VendorRestaurant["status"],
                        });
                        toast.success("Status updated!");
                      }}
                      className={`text-xs px-2 py-1 rounded-full border font-medium bg-transparent cursor-pointer capitalize ${STATUS_COLORS[vendor.status] ?? ""}`}
                    >
                      <option
                        value="active"
                        className="bg-background text-foreground"
                      >
                        active
                      </option>
                      <option
                        value="pending"
                        className="bg-background text-foreground"
                      >
                        pending
                      </option>
                      <option
                        value="suspended"
                        className="bg-background text-foreground"
                      >
                        suspended
                      </option>
                    </select>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        data-ocid={`cms.vendors.edit_button.${i + 1}`}
                        onClick={() => startEdit(vendor)}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {deleteConfirm === vendor.id ? (
                        <>
                          <button
                            type="button"
                            data-ocid={`cms.vendors.confirm_button.${i + 1}`}
                            onClick={() => {
                              cms.deleteVendor(vendor.id);
                              toast.success("Vendor removed");
                              setDeleteConfirm(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            data-ocid={`cms.vendors.cancel_button.${i + 1}`}
                            onClick={() => setDeleteConfirm(null)}
                            className="px-2 py-1 rounded-lg bg-white/10 text-muted-foreground text-xs font-medium"
                          >
                            No
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          data-ocid={`cms.vendors.delete_button.${i + 1}`}
                          onClick={() => setDeleteConfirm(vendor.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── How to Use ──────────────────────────────────────────────────────────────

function HowToUseTab() {
  const guides = [
    {
      icon: <ChefHat className="w-5 h-5 text-gold" />,
      title: "Menu Manager",
      desc: "Add, edit, or delete any dish from your menu. Toggle items on/off to show or hide them. Changes appear live on your menu page instantly.",
    },
    {
      icon: <Building2 className="w-5 h-5 text-blue-400" />,
      title: "Restaurant Info",
      desc: "Update your restaurant name, address, phone number, GSTIN, and email. This information appears on every invoice and receipt your customers receive.",
    },
    {
      icon: <Tag className="w-5 h-5 text-purple-400" />,
      title: "Pricing Plans",
      desc: "Edit the three pricing tiers shown on your homepage. Change plan names, prices, features, and CTA button text. Mark one as 'highlighted' for emphasis.",
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-orange-400" />,
      title: "Orders",
      desc: "See all incoming orders and update their status — Pending → Preparing → Ready → Delivered. Filter by status and track revenue in real-time.",
    },
    {
      icon: <Users className="w-5 h-5 text-green-400" />,
      title: "Vendor Manager",
      desc: "Onboard other restaurants onto the Food Haveli platform. Assign them a pricing plan and track their status. This is how you sell the platform and earn revenue.",
    },
    {
      icon: <Package className="w-5 h-5 text-cyan-400" />,
      title: "All Changes are Live",
      desc: "Every change you make is saved automatically to your browser and reflected live across the entire app — menu, invoice, pricing, and orders.",
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-display font-black text-foreground">
          How to <span className="text-gold">Use</span> the CMS
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Complete guide to managing your Food Haveli app
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {guides.map((g) => (
          <div
            key={g.title}
            className="rounded-2xl border border-border bg-card/50 p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-border flex items-center justify-center">
                {g.icon}
              </div>
              <h3 className="font-bold text-foreground">{g.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {g.desc}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gold/20 bg-gold/5 p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-gold mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-gold">Pro Tip</p>
            <p className="text-sm text-muted-foreground mt-1">
              All changes are saved automatically in your browser's
              localStorage. To share changes with customers, deploy the updated
              app. No coding required — just use this CMS panel to manage
              everything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
