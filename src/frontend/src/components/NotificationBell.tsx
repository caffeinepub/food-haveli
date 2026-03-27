import { Bell, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const NOTIFICATIONS = [
  {
    id: 1,
    dot: "bg-green-400",
    title: "New order received",
    desc: "Order #1045 from Amit Singh",
    time: "2 min ago",
  },
  {
    id: 2,
    dot: "bg-neon-purple",
    title: "Order ready",
    desc: "Order #1043 is ready for pickup",
    time: "8 min ago",
  },
  {
    id: 3,
    dot: "bg-neon-cyan",
    title: "Customer message",
    desc: "Priya asked about delivery time",
    time: "12 min ago",
  },
  {
    id: 4,
    dot: "bg-gold",
    title: "Payment confirmed",
    desc: "₹680 payment received",
    time: "20 min ago",
  },
];

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        data-ocid="notifications.open_modal_button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-5 h-5" />
        {!read && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
            {NOTIFICATIONS.length}
          </span>
        )}
      </button>

      {open && (
        <div
          data-ocid="notifications.popover"
          className="absolute right-0 top-12 w-80 glass-dark border border-white/10 rounded-2xl shadow-2xl z-[200] overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <p className="text-sm font-bold text-foreground">Notifications</p>
            <button
              type="button"
              data-ocid="notifications.close_button"
              onClick={() => {
                setRead(true);
                setOpen(false);
              }}
              className="text-xs text-gold hover:text-gold/80 font-medium"
            >
              Mark all read
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                data-ocid={`notifications.item.${n.id}`}
                className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot} animate-pulse`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {n.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors"
            >
              View all notifications <X className="inline w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
