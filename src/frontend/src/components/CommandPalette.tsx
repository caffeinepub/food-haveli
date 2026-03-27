import {
  BarChart3,
  Home,
  LayoutDashboard,
  Mail,
  Mic,
  Search,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Page } from "../App";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
  onOpenVoice?: () => void;
}

type Command = {
  label: string;
  page: Page | null;
  icon: React.ReactNode;
  desc: string;
  action?: () => void;
};

const buildCommands = (onOpenVoice?: () => void): Command[] => [
  {
    label: "Home / Landing",
    page: "landing" as Page,
    icon: <Home className="w-4 h-4" />,
    desc: "Marketing landing page",
  },
  {
    label: "Dashboard",
    page: "dashboard" as Page,
    icon: <LayoutDashboard className="w-4 h-4" />,
    desc: "Restaurant analytics",
  },
  {
    label: "Menu & Ordering",
    page: "menu" as Page,
    icon: <ShoppingCart className="w-4 h-4" />,
    desc: "Browse menu and place order",
  },
  {
    label: "Admin Panel",
    page: "admin" as Page,
    icon: <Settings className="w-4 h-4" />,
    desc: "Platform administration",
  },
  {
    label: "Smart Analytics",
    page: "dashboard" as Page,
    icon: <BarChart3 className="w-4 h-4" />,
    desc: "View AI-powered analytics",
  },
  {
    label: "Voice Commands",
    page: null,
    icon: <Mic className="w-4 h-4" />,
    desc: "Control with your voice",
    action: onOpenVoice,
  },
  {
    label: "Contact Support",
    page: null,
    icon: <Mail className="w-4 h-4" />,
    desc: "Get help from our team",
    action: () => toast.info("Scroll to Contact section for support"),
  },
];

export default function CommandPalette({
  open,
  onClose,
  onNavigate,
  onOpenVoice,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS = buildCommands(onOpenVoice);

  const filtered = COMMANDS.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelected(0);
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown")
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      if (e.key === "ArrowUp") setSelected((s) => Math.max(s - 1, 0));
      if (e.key === "Enter" && filtered[selected]) {
        const cmd = filtered[selected];
        if (cmd.action) {
          cmd.action();
          onClose();
        } else if (cmd.page) {
          onNavigate(cmd.page);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selected, onClose, onNavigate]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm w-full"
        onClick={onClose}
      />
      <div
        data-ocid="command.modal"
        className="relative w-full max-w-lg glass-dark rounded-2xl overflow-hidden border border-border shadow-2xl"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            data-ocid="command.search_input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            placeholder="Search pages, features..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          <button
            type="button"
            data-ocid="command.close_button"
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="py-2">
          <p className="px-4 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Navigation & Actions
          </p>
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-muted-foreground text-sm">
              No results found
            </div>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.label}
                type="button"
                data-ocid="command.button"
                onClick={() => {
                  if (cmd.action) {
                    cmd.action();
                    onClose();
                  } else if (cmd.page) {
                    onNavigate(cmd.page);
                    onClose();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  i === selected ? "bg-gold/10" : "hover:bg-white/5"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    i === selected
                      ? "bg-gold text-black"
                      : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {cmd.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {cmd.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{cmd.desc}</p>
                </div>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-border flex gap-3 text-xs text-muted-foreground">
          <span>↵ Select</span>
          <span>↑↓ Navigate</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
}
