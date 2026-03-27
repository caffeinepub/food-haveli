import { MapPin, Navigation, ShoppingBag, Star } from "lucide-react";
import { useState } from "react";

const RESTAURANTS = [
  {
    id: 1,
    name: "Food Haveli – Connaught Place",
    lat: 28.6315,
    lng: 77.2167,
    rating: 4.8,
    distance: "0.3 km",
    hours: "11 AM – 11 PM",
    cuisine: "North Indian · Mughlai",
    tag: "🔥 Trending",
    address: "Block A, Connaught Place, New Delhi",
  },
  {
    id: 2,
    name: "Food Haveli – Karol Bagh",
    lat: 28.6517,
    lng: 77.1902,
    rating: 4.6,
    distance: "1.2 km",
    hours: "12 PM – 10:30 PM",
    cuisine: "North Indian · Punjabi",
    tag: "⭐ Top Rated",
    address: "Pusa Road, Karol Bagh, New Delhi",
  },
  {
    id: 3,
    name: "Food Haveli – Lajpat Nagar",
    lat: 28.5677,
    lng: 77.2434,
    rating: 4.5,
    distance: "1.8 km",
    hours: "11 AM – 11 PM",
    cuisine: "North Indian · Street Food",
    tag: "",
    address: "Central Market, Lajpat Nagar, New Delhi",
  },
  {
    id: 4,
    name: "Food Haveli – Hauz Khas",
    lat: 28.5494,
    lng: 77.2001,
    rating: 4.7,
    distance: "2.1 km",
    hours: "12 PM – 12 AM",
    cuisine: "Fusion · North Indian",
    tag: "🌟 New",
    address: "Hauz Khas Village, South Delhi",
  },
  {
    id: 5,
    name: "Food Haveli – Paharganj",
    lat: 28.6435,
    lng: 77.2108,
    rating: 4.4,
    distance: "2.4 km",
    hours: "10 AM – 10 PM",
    cuisine: "North Indian · Tandoor",
    tag: "",
    address: "Main Bazaar, Paharganj, New Delhi",
  },
  {
    id: 6,
    name: "Food Haveli – Saket",
    lat: 28.5244,
    lng: 77.2066,
    rating: 4.6,
    distance: "2.9 km",
    hours: "11 AM – 11 PM",
    cuisine: "North Indian · Biryani",
    tag: "💰 Value Pick",
    address: "Select City Walk, Saket, New Delhi",
  },
  {
    id: 7,
    name: "Food Haveli – Vasant Kunj",
    lat: 28.5214,
    lng: 77.158,
    rating: 4.3,
    distance: "3.1 km",
    hours: "11 AM – 10 PM",
    cuisine: "Mughlai · North Indian",
    tag: "",
    address: "Vasant Kunj Sector D, New Delhi",
  },
  {
    id: 8,
    name: "Food Haveli – Dwarka",
    lat: 28.5921,
    lng: 77.046,
    rating: 4.2,
    distance: "3.2 km",
    hours: "12 PM – 11 PM",
    cuisine: "North Indian · Punjabi",
    tag: "",
    address: "Sector 10, Dwarka, New Delhi",
  },
];

interface NearbyMapProps {
  onNavigate?: (page: string) => void;
}

export default function NearbyMap({ onNavigate }: NearbyMapProps) {
  const [selected, setSelected] = useState<number | null>(1);

  const selectedRestaurant = RESTAURANTS.find((r) => r.id === selected);

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Find Nearby <span className="text-gold">Food Haveli</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              8 restaurants near you in New Delhi
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 pb-16">
          {/* Real OpenStreetMap iframe */}
          <div
            className="flex-1 rounded-2xl overflow-hidden border border-border shadow-2xl relative"
            style={{ minHeight: 480 }}
          >
            <iframe
              title="Food Haveli locations in New Delhi"
              src="https://www.openstreetmap.org/export/embed.html?bbox=77.0200%2C28.5100%2C77.3200%2C28.7200&layer=mapnik&marker=28.6315%2C77.2167"
              className="w-full h-full"
              style={{ minHeight: 480, border: 0 }}
              loading="lazy"
              allowFullScreen
            />
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl px-3 py-2 text-xs text-white border border-white/10">
              📍 New Delhi, India
            </div>
            <button
              type="button"
              data-ocid="map.primary_button"
              onClick={() => setSelected(1)}
              className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-gold text-black text-sm font-semibold shadow-lg hover:bg-gold/90 transition-all"
            >
              <Navigation className="w-4 h-4" />
              Use My Location
            </button>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
              Restaurants nearby
            </p>
            <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto pr-1">
              {RESTAURANTS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  data-ocid={`map.item.${r.id}`}
                  onClick={() => setSelected(r.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected === r.id
                      ? "border-gold/50 bg-gold/5 shadow-[0_0_12px_oklch(0.75_0.18_60/0.2)]"
                      : "border-border bg-card hover:border-gold/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {r.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.cuisine}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.address}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-gold fill-gold" />
                          <span className="text-xs font-bold text-foreground">
                            {r.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {r.distance}
                        </span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">
                          {r.hours}
                        </span>
                      </div>
                      {r.tag && (
                        <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20">
                          {r.tag}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      data-ocid="map.secondary_button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigate) onNavigate("menu");
                      }}
                      className="flex-1 py-1.5 rounded-lg border border-gold/30 text-gold text-xs font-semibold hover:bg-gold/10 transition-all"
                    >
                      View Menu
                    </button>
                    <button
                      type="button"
                      data-ocid="map.primary_button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onNavigate) onNavigate("order");
                      }}
                      className="flex-1 py-1.5 rounded-lg text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
                      }}
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Order Now
                    </button>
                  </div>
                </button>
              ))}
            </div>

            {selectedRestaurant && (
              <div className="p-4 rounded-xl border border-gold/20 bg-gold/5">
                <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-1">
                  Selected
                </p>
                <p className="font-bold text-sm text-foreground">
                  {selectedRestaurant.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedRestaurant.address}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm font-bold text-gold">
                    ★ {selectedRestaurant.rating}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedRestaurant.distance} away
                  </span>
                </div>
                <button
                  type="button"
                  data-ocid="map.primary_button"
                  onClick={() => onNavigate?.("order")}
                  className="mt-3 w-full py-2 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.55 0.22 30), oklch(0.65 0.19 55))",
                  }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order from this Location
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
