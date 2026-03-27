import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Mic, Minimize2, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
}

const QUICK_REPLIES_EN = [
  "Show Menu 🍽",
  "Track Order 📦",
  "Today's Specials ⭐",
  "Pricing 💰",
  "Contact Support 📞",
];

const QUICK_REPLIES_HI = [
  "मेनू दिखाएं 🍽",
  "ऑर्डर ट्रैक करें 📦",
  "आज के विशेष ⭐",
  "मूल्य 💰",
  "सहायता 📞",
];

const GREETING_EN =
  "Namaste! 🙏 I'm Haveli AI Assistant. How can I help you today? (हिंदी में भी बात कर सकते हैं — HI बटन दबाएं!)";
const GREETING_HI =
  "नमस्ते! 🙏 मैं Haveli AI असिस्टेंट हूं। आज मैं आपकी क्या सेवा कर सकता हूं? (You can switch to English by clicking EN button)";

const getAIResponse = (msg: string, lang: "EN" | "HI"): string => {
  const lower = msg.toLowerCase();

  if (lang === "HI") {
    if (
      lower.includes("menu") ||
      lower.includes("dish") ||
      lower.includes("खाना") ||
      lower.includes("मेनू") ||
      lower.includes("show menu") ||
      lower.includes("मेनू दिखाएं")
    )
      return "हमारे पास 24 शानदार डिश हैं! 🍛 बटर चिकन (₹320), बिरयानी (₹280), पनीर टिक्का (₹260), दाल मखनी (₹220), गार्लिक नान (₹60), मैंगो लस्सी (₹120), गुलाब जामुन (₹150)। 'Order Now' पर क्लिक करके ऑर्डर करें!";
    if (
      lower.includes("order") ||
      lower.includes("track") ||
      lower.includes("ऑर्डर") ||
      lower.includes("ट्रैक") ||
      lower.includes("ऑर्डर ट्रैक")
    )
      return "आपका अंतिम ऑर्डर #1042 (बटर चिकन + नान) तैयार हो रहा है। 🔥 ETA: 15 मिनट। जब तैयार होगा तो नोटिफिकेशन मिलेगा!";
    if (
      lower.includes("special") ||
      lower.includes("today") ||
      lower.includes("विशेष") ||
      lower.includes("आज") ||
      lower.includes("आज के विशेष")
    )
      return "आज के विशेष: 🎉 चिकन बिरयानी के साथ रायता मुफ्त! दोपहर 3 बजे से पहले बटर चिकन पर 20% छूट। दाल मखनी कॉम्बो केवल ₹199!";
    if (
      lower.includes("price") ||
      lower.includes("pricing") ||
      lower.includes("मूल्य") ||
      lower.includes("कीमत")
    )
      return "हमारी योजनाएं हमेशा के लिए मुफ्त से शुरू होती हैं! 💰 ग्रोथ प्लान ₹999/माह। प्रो प्लान ₹2,499/माह मल्टी-लोकेशन सपोर्ट के साथ। अपग्रेड करने के लिए Pricing सेक्शन देखें।";
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("namaste") ||
      lower.includes("नमस्ते") ||
      lower.includes("हैलो")
    )
      return "नमस्ते! 🙏 Food Haveli में आपका स्वागत है। मैं आपका AI असिस्टेंट हूं। मेनू, ऑर्डर, मूल्य — सब कुछ में मदद कर सकता हूं। आज मैं आपकी क्या सेवा कर सकता हूं?";
    if (
      lower.includes("support") ||
      lower.includes("contact") ||
      lower.includes("help") ||
      lower.includes("सहायता") ||
      lower.includes("मदद")
    )
      return "हमारी सपोर्ट टीम 24/7 उपलब्ध है! 📞 फोन: +91 98765 43210 | ईमेल: support@foodhaveli.in | होमपेज पर 'Get in Touch' सेक्शन पर जाएं।";
    if (lower.includes("qr") || lower.includes("scan"))
      return "QR कोड मेनू: 📱 अपने CMS पैनल में जाएं → QR Code सेक्शन → कोड डाउनलोड करें → टेबल पर लगाएं। ग्राहक स्कैन करके सीधे ऑर्डर कर सकते हैं!";
    if (lower.includes("whatsapp") || lower.includes("व्हाट्सएप"))
      return "WhatsApp इंटीग्रेशन: 💬 CMS → Settings में अपना नंबर डालें। हर नया ऑर्डर आपके WhatsApp पर पूरी जानकारी के साथ आएगा — बिना कोई नई ऐप सीखे!";
    if (lower.includes("ai") || lower.includes("menu builder"))
      return "AI मेनू बिल्डर: ✨ CMS → Menu Manager → 'Generate with AI' पर क्लिक करें। अपने रेस्तरां का विवरण लिखें और 2 मिनट में पूरा मेनू तैयार हो जाएगा!";
    return "मैं यहां मदद के लिए हूं! 🤖 मेनू, ऑर्डर, मूल्य, QR कोड, WhatsApp के बारे में पूछें। नीचे दिए गए बटन से जल्दी पूछें।";
  }

  // English responses
  if (
    lower.includes("menu") ||
    lower.includes("dish") ||
    lower.includes("show menu")
  )
    return "We have 24 amazing dishes! 🍛 Butter Chicken (₹320), Biryani (₹280), Paneer Tikka (₹260), Dal Makhani (₹220), Garlic Naan (₹60), Mango Lassi (₹120), Gulab Jamun (₹150), Chicken Tikka Masala (₹350). Click 'Order Now' to place an order!";
  if (lower.includes("order") || lower.includes("track"))
    return "Your last order #1042 (Butter Chicken + Naan) is being prepared. 🔥 ETA: 15 mins. You'll get a notification when it's ready!";
  if (lower.includes("special") || lower.includes("today"))
    return "Today's specials: 🎉 Chicken Biryani with extra raita FREE! Butter Chicken 20% off before 3pm. Dal Makhani combo ₹199 only!";
  if (
    lower.includes("price") ||
    lower.includes("pricing") ||
    lower.includes("plan")
  )
    return "Our plans start FREE forever! 💰 Growth plan ₹999/mo with unlimited orders & AI chatbot. Pro plan ₹2,499/mo with multi-location support. Want to upgrade?";
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("namaste")
  )
    return "Namaste! 🙏 Welcome to Food Haveli. I'm your AI assistant. I can help you with menu, orders, pricing, and much more. How can I serve you today?";
  if (
    lower.includes("support") ||
    lower.includes("contact") ||
    lower.includes("help")
  )
    return "Our support team is available 24/7! 📞 Call: +91 98765 43210 | Email: support@foodhaveli.in | Or scroll to the 'Get in Touch' section on the homepage.";
  if (lower.includes("qr") || lower.includes("scan"))
    return "QR Code Menu: 📱 Go to CMS Panel → QR Code section → Download your code → Place on tables. Customers scan it to order instantly, no app download needed!";
  if (lower.includes("whatsapp"))
    return "WhatsApp Integration: 💬 Go to CMS → Settings → enter your number. Every new order lands on your WhatsApp with full details — zero learning curve!";
  if (lower.includes("ai") || lower.includes("menu builder"))
    return "AI Menu Builder: ✨ Go to CMS → Menu Manager → click 'Generate with AI'. Describe your restaurant and a full menu is ready in under 2 minutes!";
  return "I'm here to help! 🤖 Ask me about our menu, orders, pricing, QR code, or WhatsApp integration. Use the quick buttons below for faster answers!";
};

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentLang, setCurrentLang] = useState<"EN" | "HI">("EN");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: GREETING_EN,
      time: "now",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: bottomRef is stable
  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, minimized]);

  // When language is switched, update the greeting message
  const switchLanguage = (lang: "EN" | "HI") => {
    if (lang === currentLang) return;
    setCurrentLang(lang);
    const greeting = lang === "HI" ? GREETING_HI : GREETING_EN;
    setMessages([
      {
        id: Date.now(),
        role: "assistant",
        content: greeting,
        time: "now",
      },
    ]);
  };

  const sendMessage = (text?: string) => {
    const content = text || input.trim();
    if (!content) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getAIResponse(content, currentLang),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  const handleVoice = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      sendMessage(
        currentLang === "HI" ? "आज के विशेष ⭐" : "Show me today's specials",
      );
    }, 2000);
  };

  const quickReplies =
    currentLang === "HI" ? QUICK_REPLIES_HI : QUICK_REPLIES_EN;

  if (!open) {
    return (
      <button
        type="button"
        data-ocid="chatbot.open_modal_button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 animate-pulse-slow"
        style={{ boxShadow: "0 0 24px oklch(0.65 0.2 35 / 0.5)" }}
      >
        <Bot className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      data-ocid="chatbot.dialog"
      className={`fixed bottom-6 right-6 z-50 w-84 rounded-2xl overflow-hidden shadow-2xl border border-orange-500/20 transition-all ${
        minimized ? "h-14" : "h-[500px]"
      } flex flex-col`}
      style={{
        background: "oklch(0.13 0.015 245 / 0.97)",
        backdropFilter: "blur(20px)",
        width: 340,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.65 0.2 50 / 0.15), oklch(0.55 0.22 35 / 0.15))",
          borderColor: "oklch(0.65 0.2 50 / 0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f97316, #dc2626)" }}
          >
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Haveli AI Assistant</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">
                  {currentLang === "HI" ? "ऑनलाइन" : "Online"}
                </span>
              </div>
              {/* Language toggle buttons */}
              <div className="flex items-center gap-0.5 bg-white/10 rounded-full px-1.5 py-0.5">
                <button
                  type="button"
                  className={`text-[11px] font-bold transition-all cursor-pointer px-2 py-0.5 rounded-full ${
                    currentLang === "EN"
                      ? "text-black bg-yellow-400 shadow"
                      : "text-white/50 hover:text-white/80"
                  }`}
                  onClick={() => switchLanguage("EN")}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  className={`text-[11px] font-bold transition-all cursor-pointer px-2 py-0.5 rounded-full ${
                    currentLang === "HI"
                      ? "text-black bg-orange-400 shadow"
                      : "text-white/50 hover:text-white/80"
                  }`}
                  onClick={() => switchLanguage("HI")}
                  title="हिंदी में बदलें"
                >
                  HI
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            data-ocid="chatbot.toggle"
            onClick={() => setMinimized(!minimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          <button
            type="button"
            data-ocid="chatbot.close_button"
            onClick={() => setOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Language banner */}
          <div
            className="px-4 py-1.5 text-center text-[11px] font-medium border-b"
            style={{
              background:
                currentLang === "HI"
                  ? "linear-gradient(90deg, oklch(0.65 0.2 50 / 0.12), oklch(0.55 0.22 35 / 0.12))"
                  : "linear-gradient(90deg, oklch(0.65 0.25 245 / 0.10), oklch(0.55 0.22 245 / 0.10))",
              borderColor: "oklch(0.65 0.2 50 / 0.15)",
              color: currentLang === "HI" ? "#fb923c" : "#60a5fa",
            }}
          >
            {currentLang === "HI"
              ? "🇮🇳 हिंदी मोड सक्रिय है — सभी जवाब हिंदी में मिलेंगे"
              : "🇬🇧 English mode active — All replies in English"}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "text-white rounded-br-sm"
                      : "bg-white/8 text-white rounded-bl-sm border border-white/10"
                  }`}
                  style={
                    msg.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #f97316, #dc2626)",
                        }
                      : {}
                  }
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                  <p
                    className={`text-xs mt-1 opacity-60 ${
                      msg.role === "user" ? "text-white" : "text-white/70"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                data-ocid="chatbot.button"
                onClick={() => sendMessage(reply)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 border border-white/10 hover:border-orange-500/30 text-xs text-white/70 transition-all"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-white/10">
            <button
              type="button"
              data-ocid="chatbot.toggle"
              onClick={handleVoice}
              className={`p-2 rounded-lg border transition-all ${
                isListening
                  ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse"
                  : "border-white/10 hover:bg-white/10 text-muted-foreground hover:text-orange-400"
              }`}
              title={currentLang === "HI" ? "वॉइस इनपुट" : "Voice input"}
            >
              <Mic className="w-4 h-4" />
            </button>
            <Input
              data-ocid="chatbot.input"
              value={
                isListening
                  ? currentLang === "HI"
                    ? "🎤 सुन रहा हूं..."
                    : "🎤 Listening..."
                  : input
              }
              onChange={(e) => !isListening && setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                currentLang === "HI" ? "Haveli AI से पूछें..." : "Ask Haveli AI..."
              }
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40 text-sm"
            />
            <Button
              type="button"
              data-ocid="chatbot.submit_button"
              onClick={() => sendMessage()}
              size="sm"
              className="px-3"
              style={{
                background: "linear-gradient(135deg, #f97316, #dc2626)",
              }}
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
