import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Mic,
  MicOff,
  Minimize2,
  Send,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  time: string;
  lang?: "hindi" | "english" | "hinglish";
}

type Lang = "hindi" | "english" | "hinglish";

// ─── Language Detection ───────────────────────────────────────────────────────
function detectLanguage(text: string): Lang {
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  if (totalChars === 0) return "english";
  if (devanagariCount === 0) return "english";
  if (devanagariCount / totalChars > 0.4) return "hindi";
  return "hinglish";
}

// ─── TTS ──────────────────────────────────────────────────────────────────────
function speak(text: string, lang: Lang) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "hindi" ? "hi-IN" : "en-IN";
  utterance.rate = 0.9;
  utterance.pitch = 1.05;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

// ─── JARVIS Response Engine ───────────────────────────────────────────────────
const FOOD_HAVELI_KB = {
  what: {
    en: "Food Haveli is a zero-commission SaaS platform that lets any small restaurant, cloud kitchen, or food vendor launch a full online ordering website in under 10 minutes — no coding required. You get AI menu builder, QR code ordering, WhatsApp alerts, GST invoicing, analytics, and more.",
    hi: "Food Haveli एक zero-commission SaaS platform है जो किसी भी छोटे रेस्टोरेंट को 10 मिनट में अपनी online ordering website लॉन्च करने देता है — बिना किसी coding के। AI menu builder, QR code ordering, WhatsApp alerts, GST invoice, analytics — सब कुछ शामिल है।",
    hg: "Food Haveli ek zero-commission SaaS platform hai jo kisi bhi chhote restaurant ko 10 minutes mein apni online ordering website launch karne deta hai — bina coding ke. AI menu builder, QR code, WhatsApp alerts, GST invoice — sab included hai!",
  },
  start: {
    en: "Getting started is easy! Click 'Start Your Restaurant Website' on the homepage → Sign up as an owner → Fill your restaurant profile → Build your menu with AI in 2 minutes → Share your link and start receiving orders!",
    hi: "शुरू करना बहुत आसान है! Homepage पर 'Start Your Restaurant Website' click करें → Owner के रूप में signup करें → Restaurant profile भरें → AI से 2 मिनट में menu बनाएं → Link share करें और orders लेना शुरू करें!",
    hg: "Shuru karna bahut easy hai! Homepage pe 'Start Your Restaurant Website' click karo → Owner signup karo → Profile bharo → AI se 2 min mein menu banao → Link share karo, orders aane shuru!",
  },
  pricing: {
    en: "Food Haveli offers 3 plans:\n• Free — Basic menu & ordering (forever free)\n• Growth ₹999/month — Full AI suite, analytics, WhatsApp alerts\n• Pro ₹2,499/month — All features + reseller rights to onboard other restaurants",
    hi: "Food Haveli 3 plans offer करता है:\n• Free — Basic menu और ordering (हमेशा के लिए free)\n• Growth ₹999/माह — Full AI suite, analytics, WhatsApp alerts\n• Pro ₹2,499/माह — सभी features + दूसरे restaurants onboard करने के reseller rights",
    hg: "Food Haveli 3 plans deta hai:\n• Free — Basic menu & ordering (forever free)\n• Growth ₹999/month — Full AI, analytics, WhatsApp\n• Pro ₹2,499/month — Sab features + reseller rights",
  },
  qr: {
    en: "In CMS, a unique QR code is auto-generated for your restaurant. Download and print it for your tables. Customers scan it with any phone camera — no app download needed — and land directly on your menu to order instantly.",
    hi: "CMS में आपके restaurant के लिए automatic QR code बनता है। इसे download करके tables पर print करें। Customer किसी भी phone से scan करे — बिना कोई app download किए — और सीधे menu पर order करे।",
    hg: "CMS mein aapke restaurant ka unique QR code auto-generate hota hai. Download karo, print karo tables ke liye. Customer kisi bhi phone se scan kare — no app needed — aur directly menu pe aa jaaye.",
  },
  whatsapp: {
    en: "Set your WhatsApp number once in CMS → Settings. Every new order automatically sends a formatted WhatsApp message with customer name, items, address, total, and order ID. No new app to learn — orders come where you already are!",
    hi: "CMS → Settings में एक बार अपना WhatsApp number set करें। हर नया order automatically आपके WhatsApp पर आएगा — customer name, items, address, total सब कुछ। कोई नई app नहीं सीखनी!",
    hg: "CMS → Settings mein ek baar WhatsApp number set karo. Har naya order automatically WhatsApp pe aayega — formatted message ke saath. No new app!",
  },
  ai_menu: {
    en: "In CMS, click 'Generate Menu with AI', type one line like 'North Indian restaurant with curries and breads' — AI builds your entire menu in under 2 minutes with categories, dish names, descriptions, and prices. Edit anything and publish!",
    hi: "CMS में 'Generate Menu with AI' click करें, एक line type करें जैसे 'North Indian restaurant with curries' — AI 2 मिनट में पूरा menu बना देता है, categories, dish names, descriptions, prices के साथ। Edit करो और publish!",
    hg: "CMS mein 'Generate Menu with AI' click karo, ek line likho jaise 'North Indian restaurant' — AI 2 min mein poora menu bana deta hai. Edit karo aur publish!",
  },
  analytics: {
    en: "The analytics dashboard shows: total orders, daily revenue, most popular dishes, peak ordering hours, customer retention rate, average order value, and monthly trends. AI demand prediction also forecasts what to stock before rush hours.",
    hi: "Analytics dashboard में देखें: total orders, daily revenue, सबसे popular dishes, peak hours, customer retention, average order value, monthly trends। AI demand prediction यह भी बताता है कि rush hours से पहले क्या stock करें।",
    hg: "Analytics dashboard mein: orders, revenue, popular dishes, peak hours, retention sab dikhta hai. AI demand prediction bhi batata hai kya stock karna hai!",
  },
  order: {
    en: "Customers open your link or scan QR → browse menu with real photos → add to cart → enter name, phone, address → confirm order. They instantly get a GST invoice and can track status: Pending → Preparing → Ready → Delivered.",
    hi: "Customer आपका link open करे या QR scan करे → real photos के साथ menu browse करे → cart में add करे → name, phone, address enter करे → order confirm करे। GST invoice तुरंत मिलता है और status track होता है।",
    hg: "Customer link open kare ya QR scan kare → menu browse kare → cart mein add kare → details bhare → order confirm kare. GST invoice instant milti hai aur status bhi track hota hai.",
  },
  commission: {
    en: "Food Haveli charges ZERO commission. Compare: Swiggy/Zomato take 18–30% per order. A restaurant doing ₹1 lakh/month saves ₹25,000/month = ₹2,88,000/year by switching to Food Haveli!",
    hi: "Food Haveli का commission बिल्कुल ZERO है। Compare करें: Swiggy/Zomato 18-30% per order लेते हैं। ₹1 लाख/माह करने वाला restaurant ₹25,000/माह बचाता है = सालाना ₹2,88,000 की बचत!",
    hg: "Food Haveli ka commission ZERO hai. Swiggy/Zomato 18-30% lete hain. ₹1 lakh/month restaurant ₹25,000/month bachata hai = ₹2,88,000 per year savings!",
  },
  map: {
    en: "The /map page shows all Food Haveli restaurants on an interactive OpenStreetMap with pins, ratings, and distances. Customers can discover nearby restaurants and order directly.",
    hi: "/map page पर सभी Food Haveli restaurants एक interactive OpenStreetMap पर pins, ratings और distances के साथ दिखते हैं। Customers nearby restaurants discover कर सकते हैं।",
    hg: "/map page pe saare Food Haveli restaurants OpenStreetMap pe dikhte hain. Customers nearby restaurants discover kar sakte hain.",
  },
  cms: {
    en: "The CMS (Content Management System) is your self-service control panel. From one dashboard: add/edit/delete menu items, update restaurant info, view & manage orders, download QR code, manage pricing, onboard vendors — all without any coding!",
    hi: "CMS (Content Management System) आपका self-service control panel है। एक dashboard से: menu items add/edit/delete करें, restaurant info update करें, orders manage करें, QR code download करें, pricing manage करें, vendors onboard करें — बिना किसी coding के!",
    hg: "CMS aapka self-service control panel hai. Ek dashboard se menu, orders, QR, pricing, vendors — sab manage karo, koi coding nahi!",
  },
};

function getJarvisResponse(input: string, lang: Lang): string {
  const lower = input.toLowerCase();
  const l = lang === "hindi" ? "hi" : lang === "hinglish" ? "hg" : "en";

  // Greetings
  if (
    /^(hello|hi|hey|hii|helo|namaste|नमस्ते|हैलो|सुप्रभात|good morning|good evening|good afternoon|wassup|sup)/.test(
      lower.trim(),
    )
  ) {
    if (l === "hi")
      return "नमस्ते! 🙏 मैं JARVIS हूँ, Food Haveli का AI assistant। आज मैं आपकी किस तरह मदद कर सकता हूँ?";
    if (l === "hg")
      return "Hello! Main JARVIS hoon, Food Haveli ka AI assistant. Aaj main aapki kaise help kar sakta hoon? 😊";
    return "Hello! I'm JARVIS, your AI assistant for Food Haveli. How can I help you today? 😊";
  }

  // Food Haveli specific
  if (
    lower.includes("what is food haveli") ||
    lower.includes("food haveli kya") ||
    lower.includes("फूड हवेली क्या") ||
    lower.includes("about food haveli")
  ) {
    return FOOD_HAVELI_KB.what[l];
  }
  if (
    lower.includes("start") ||
    lower.includes("get started") ||
    lower.includes("कैसे शुरू") ||
    lower.includes("shuru") ||
    lower.includes("signup") ||
    lower.includes("register")
  ) {
    return FOOD_HAVELI_KB.start[l];
  }
  if (
    lower.includes("price") ||
    lower.includes("pricing") ||
    lower.includes("plan") ||
    lower.includes("cost") ||
    lower.includes("मूल्य") ||
    lower.includes("कीमत") ||
    lower.includes("₹")
  ) {
    return FOOD_HAVELI_KB.pricing[l];
  }
  if (
    lower.includes("qr") ||
    lower.includes("qr code") ||
    lower.includes("scan") ||
    lower.includes("स्कैन")
  ) {
    return FOOD_HAVELI_KB.qr[l];
  }
  if (
    lower.includes("whatsapp") ||
    lower.includes("alert") ||
    lower.includes("notification") ||
    lower.includes("notify")
  ) {
    return FOOD_HAVELI_KB.whatsapp[l];
  }
  if (
    lower.includes("ai menu") ||
    lower.includes("menu builder") ||
    lower.includes("generate menu") ||
    lower.includes("menu बनाएं") ||
    lower.includes("menu banao")
  ) {
    return FOOD_HAVELI_KB.ai_menu[l];
  }
  if (
    lower.includes("analytic") ||
    lower.includes("dashboard") ||
    lower.includes("revenue") ||
    lower.includes("revenue") ||
    lower.includes("analytics") ||
    lower.includes("डेटा") ||
    lower.includes("रिपोर्ट")
  ) {
    return FOOD_HAVELI_KB.analytics[l];
  }
  if (
    lower.includes("order") ||
    lower.includes("track") ||
    lower.includes("ऑर्डर") ||
    lower.includes("delivery") ||
    lower.includes("invoice") ||
    lower.includes("cart")
  ) {
    return FOOD_HAVELI_KB.order[l];
  }
  if (
    lower.includes("commission") ||
    lower.includes("swiggy") ||
    lower.includes("zomato") ||
    lower.includes("comparison") ||
    lower.includes("compare") ||
    lower.includes("बचत") ||
    lower.includes("save")
  ) {
    return FOOD_HAVELI_KB.commission[l];
  }
  if (
    lower.includes("map") ||
    lower.includes("nearby") ||
    lower.includes("location") ||
    lower.includes("नजदीक") ||
    lower.includes("पास")
  ) {
    return FOOD_HAVELI_KB.map[l];
  }
  if (
    lower.includes("cms") ||
    lower.includes("manage") ||
    lower.includes("admin") ||
    lower.includes("panel") ||
    lower.includes("manage") ||
    lower.includes("मैनेज")
  ) {
    return FOOD_HAVELI_KB.cms[l];
  }

  // General knowledge
  if (
    lower.includes("coding") ||
    lower.includes("programming") ||
    lower.includes("code") ||
    lower.includes("develop") ||
    lower.includes("कोडिंग") ||
    lower.includes("प्रोग्रामिंग")
  ) {
    if (l === "hi")
      return "Coding सीखना एक शानदार decision है! यहाँ एक simple plan है:\n• Python से शुरू करें — beginners के लिए best\n• Free resources: freeCodeCamp, Khan Academy, YouTube\n• रोज 30-60 मिनट practice करें\n• छोटे projects बनाएं — calculator, to-do list\nआप किस language में interested हैं?";
    if (l === "hg")
      return "Coding seekhna bahut exciting hai! Plan yeh hai:\n• Python se shuru karo — beginners ke liye best\n• freeCodeCamp, YouTube pe free resources hain\n• Roz 30-60 min practice karo\n• Chhote projects banao — calculator, to-do list\nKaunsi language mein interest hai aapko?";
    return "Learning to code is an excellent choice! Here's a solid plan:\n• Start with Python — best for beginners\n• Free resources: freeCodeCamp, Khan Academy, CS50\n• Practice 30-60 min daily\n• Build small projects — calculator, to-do list, portfolio\nWhich programming language interests you most?";
  }

  if (
    lower.includes("business") ||
    lower.includes("व्यवसाय") ||
    lower.includes("startup") ||
    lower.includes("idea") ||
    lower.includes("income") ||
    lower.includes("पैसा") ||
    lower.includes("money")
  ) {
    if (l === "hi")
      return "आपके व्यवसाय को बढ़ाने के प्रभावी तरीके:\n• Digital presence बनाएं — website और social media\n• Customer feedback लें और improve करें\n• Local marketing करें — WhatsApp groups, Google Maps\n• Food Haveli जैसे platform से online ordering शुरू करें\n• Analytics से data-driven decisions लें\nआपका व्यवसाय किस क्षेत्र में है?";
    if (l === "hg")
      return "Business badhane ke tarike:\n• Digital presence banao — website + social media\n• Customer feedback lo\n• WhatsApp groups, Google Maps pe local marketing karo\n• Food Haveli se online ordering shuru karo\n• Analytics se smart decisions lo\nAapka business kaunse field mein hai?";
    return "Key strategies to scale your business:\n• Build a strong digital presence — website & social media\n• Collect and act on customer feedback\n• Leverage local marketing — WhatsApp groups, Google Maps listing\n• Start online ordering with Food Haveli (zero commission!)\n• Use analytics for data-driven decisions\nWhat industry is your business in?";
  }

  if (
    lower.includes("career") ||
    lower.includes("job") ||
    lower.includes("नौकरी") ||
    lower.includes("करियर") ||
    lower.includes("fresher") ||
    lower.includes("placement")
  ) {
    if (l === "hi")
      return "Career guidance के लिए:\n• अपना goal define करें — कौन सा field?\n• Skills identify करें\n• LinkedIn profile professional बनाएं\n• Projects और portfolio तैयार करें\n• Networking करें — alumni, LinkedIn\n• Internships से शुरुआत करें\nआप किस field में career बनाना चाहते हैं?";
    if (l === "hg")
      return "Career ke liye tips:\n• Goal clear karo — kaunsa field?\n• LinkedIn profile banao\n• Projects aur portfolio taiyar karo\n• Networking karo — alumni, LinkedIn\n• Internships se start karo\nKis field mein jaana chahte ho?";
    return "Career building tips:\n• Define your goal — which field excites you?\n• Identify skill gaps and fill them\n• Build a strong LinkedIn profile\n• Create a portfolio of real projects\n• Network actively — alumni, LinkedIn, events\n• Start with internships for experience\nWhich career field are you targeting?";
  }

  if (
    lower.includes("ai") ||
    lower.includes("artificial intelligence") ||
    lower.includes("machine learning") ||
    lower.includes("chatgpt") ||
    lower.includes("कृत्रिम बुद्धिमत्ता")
  ) {
    if (l === "hi")
      return "AI (Artificial Intelligence) machines को human-like thinking और learning की capability देता है। Key areas:\n• Machine Learning — patterns से सीखना\n• Deep Learning — neural networks\n• NLP — भाषा समझना (जो मैं करता हूँ!)\n• Computer Vision — images पहचानना\nAI आज healthcare, finance, food tech सब में use हो रहा है। क्या आप AI सीखना चाहते हैं?";
    if (l === "hg")
      return "AI machines ko human-like thinking deta hai. Key areas: Machine Learning, Deep Learning, NLP, Computer Vision. Aaj AI healthcare, finance, food tech mein use ho raha hai. Kya aap AI seekhna chahte ho?";
    return "AI (Artificial Intelligence) gives machines human-like thinking and learning abilities. Key areas:\n• Machine Learning — learning from patterns\n• Deep Learning — neural networks\n• NLP — understanding language (what I do!)\n• Computer Vision — recognizing images\nAI is transforming healthcare, finance, and food tech. Would you like to learn AI?";
  }

  if (
    lower.includes("web") ||
    lower.includes("website") ||
    lower.includes("react") ||
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("javascript") ||
    lower.includes("frontend")
  ) {
    if (l === "hi")
      return "Web development के लिए roadmap:\n• HTML — structure (1-2 हफ्ते)\n• CSS — styling (2-3 हफ्ते)\n• JavaScript — interactivity (1-2 महीने)\n• React — modern UI framework (1-2 महीने)\n• Backend के लिए Node.js या Python\nFree resources: MDN Docs, freeCodeCamp, The Odin Project। आपको किस चीज़ में help चाहिए?";
    if (l === "hg")
      return "Web dev roadmap: HTML → CSS → JavaScript → React → Backend. Free resources: MDN, freeCodeCamp, The Odin Project. Kaunse topic mein help chahiye?";
    return "Web development roadmap:\n• HTML — structure (1-2 weeks)\n• CSS — styling (2-3 weeks)\n• JavaScript — interactivity (1-2 months)\n• React — modern UI (1-2 months)\n• Backend — Node.js or Python\nFree resources: MDN Docs, freeCodeCamp, The Odin Project. What do you need help with specifically?";
  }

  if (
    lower.includes("productivity") ||
    lower.includes("time management") ||
    lower.includes("productive") ||
    lower.includes("काम") ||
    lower.includes("focus") ||
    lower.includes("busy")
  ) {
    if (l === "hi")
      return "Productivity बढ़ाने के tips:\n• Pomodoro technique — 25 मिनट काम, 5 मिनट break\n• दिन की शुरुआत में 3 main tasks decide करें\n• Phone notifications बंद करें focus time में\n• Notion या Todoist से tasks manage करें\n• रात को अगले दिन की planning करें\nक्या आप किसी specific challenge से जूझ रहे हैं?";
    if (l === "hg")
      return "Productivity tips: Pomodoro (25 min work, 5 min break), 3 main tasks decide karo, phone notifications band karo focus mein, Notion se tasks manage karo. Koi specific challenge hai?";
    return "Top productivity tips:\n• Pomodoro technique — 25 min focus, 5 min break\n• Set 3 priority tasks every morning\n• Turn off notifications during deep work\n• Use Notion or Todoist for task management\n• Plan tomorrow the night before\nIs there a specific productivity challenge you're facing?";
  }

  if (
    lower.includes("health") ||
    lower.includes("fitness") ||
    lower.includes("exercise") ||
    lower.includes("diet") ||
    lower.includes("स्वास्थ्य") ||
    lower.includes("व्यायाम")
  ) {
    if (l === "hi")
      return "अच्छे स्वास्थ्य के लिए:\n• रोज 30 मिनट exercise करें\n• पानी खूब पिएं — 8 glasses minimum\n• Balanced diet लें — protein, vegetables, fruits\n• 7-8 घंटे की नींद लें\n• Stress management के लिए meditation करें\nयाद रखें: किसी भी health concern के लिए doctor से consult करें। क्या कोई specific goal है?";
    if (l === "hg")
      return "Health tips: Roz 30 min exercise, 8 glasses paani, balanced diet, 7-8 ghante neend, meditation for stress. Koi specific health goal hai?";
    return "Key health tips:\n• Exercise 30 minutes daily\n• Drink 8+ glasses of water\n• Eat balanced — protein, vegetables, fruits\n• Get 7-8 hours of sleep\n• Practice meditation for stress management\nNote: Consult a doctor for specific health concerns. Any particular health goal?";
  }

  if (
    lower.includes("menu") ||
    lower.includes("food") ||
    lower.includes("dish") ||
    lower.includes("खाना") ||
    lower.includes("मेनू")
  ) {
    if (l === "hi")
      return "Food Haveli के menu में 24 शानदार dishes हैं! 🍛 जैसे Butter Chicken (₹320), Chicken Biryani (₹280), Paneer Tikka (₹260), Dal Makhani (₹220), Garlic Naan (₹60), Mango Lassi (₹120)। Order करने के लिए 'Order Now' click करें या '/order' page पर जाएं!";
    if (l === "hg")
      return "Food Haveli mein 24 dishes hain! Butter Chicken (₹320), Biryani (₹280), Paneer Tikka (₹260), Dal Makhani (₹220) — sab available hai. 'Order Now' click karo ya /order page pe jao!";
    return "Food Haveli has 24 amazing dishes! 🍛 Butter Chicken (₹320), Chicken Biryani (₹280), Paneer Tikka (₹260), Dal Makhani (₹220), Garlic Naan (₹60), Mango Lassi (₹120). Click 'Order Now' or go to /order to place an order!";
  }

  // Default intelligent response
  if (l === "hi")
    return `आपका सवाल मिला: "${input.slice(0, 60)}"\nमैं आपकी मदद करने की कोशिश करता हूँ। क्या आप थोड़ा और detail में बता सकते हैं? या Food Haveli से related कोई सवाल हो तो पूछें — मैं हमेशा तैयार हूँ! 😊`;
  if (l === "hg")
    return `Aapka sawaal mila: "${input.slice(0, 60)}"\nMain help karne ki koshish karunga. Thoda aur detail mein batao ya Food Haveli ke baare mein kuch poochho! 😊`;
  return `I received your question: "${input.slice(0, 60)}"\nCould you provide a bit more detail? I'm here to help with Food Haveli guidance, coding, business, career advice, and much more! 😊`;
}

// ─── Quick Reply Chips ─────────────────────────────────────────────────────────
const QUICK_EN = [
  "How to get started?",
  "Pricing plans",
  "Track my order",
  "AI Menu Builder",
  "Talk to support",
];
const _QUICK_HI = [
  "कैसे शुरू करें?",
  "मूल्य योजनाएं",
  "ऑर्डर ट्रैक करें",
  "AI मेनू Builder",
  "सहायता चाहिए",
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speakingId, setSpeakingId] = useState<number | null>(null);
  const [greetingDone, setGreetingDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const idRef = useRef(1);

  const addMessage = useCallback(
    (role: "user" | "assistant", msgContent: string, lang?: Lang) => {
      const id = idRef.current++;
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) => [
        ...prev,
        { id, role, content: msgContent, time, lang },
      ]);
      return id;
    },
    [],
  );

  // Auto-greet on first open
  useEffect(() => {
    if (isOpen && !greetingDone) {
      setGreetingDone(true);
      const browserLang = navigator.language || "";
      const isHindi = browserLang.startsWith("hi");
      const greeting = isHindi
        ? "नमस्ते! 🙏 मैं JARVIS हूँ, Food Haveli का AI assistant। आज मैं आपकी किस तरह मदद कर सकता हूँ?"
        : "Hello! I'm JARVIS, your AI assistant for Food Haveli. How can I help you today? 😊";
      const gLang: Lang = isHindi ? "hindi" : "english";
      setTimeout(() => {
        addMessage("assistant", greeting, gLang);
      }, 500);
    }
  }, [isOpen, greetingDone, addMessage]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }); // scroll runs after every render, no deps needed

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg) return;
      setInput("");
      const lang = detectLanguage(msg);
      addMessage("user", msg);
      setIsTyping(true);
      // Simulate thinking delay
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
      setIsTyping(false);
      const response = getJarvisResponse(msg, lang);
      addMessage("assistant", response, lang);
    },
    [input, addMessage],
  );

  // Voice input
  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        addMessage(
          "assistant",
          "Voice input is not supported in your browser. Please type your message.",
          "english",
        );
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "hi-IN";
      recognition.interimResults = false;
      recognition.continuous = false;
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);
      recognition.start();
      recognitionRef.current = recognition;
      setIsRecording(true);
    } else {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
  }, [isRecording, addMessage]);

  // Speaker button
  const handleSpeak = useCallback(
    (msg: Message) => {
      if (speakingId === msg.id) {
        stopSpeaking();
        setSpeakingId(null);
      } else {
        setSpeakingId(msg.id);
        speak(msg.content, msg.lang ?? "english");
        // reset after speech ends (estimate by length)
        const dur = Math.max(3000, msg.content.length * 70);
        setTimeout(
          () => setSpeakingId((prev) => (prev === msg.id ? null : prev)),
          dur,
        );
      }
    },
    [speakingId],
  );

  const quickReplies = messages.length <= 1 ? QUICK_EN : [];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="jarvis-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            data-ocid="jarvis.open_modal_button"
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
            style={{ filter: "drop-shadow(0 0 18px oklch(0.78 0.19 85))" }}
          >
            {/* Pulse rings */}
            <span
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: "oklch(0.78 0.19 85 / 0.25)",
                borderRadius: "50%",
              }}
            />
            <span
              className="absolute inset-0 rounded-full animate-ping [animation-delay:0.4s]"
              style={{
                background: "oklch(0.6 0.2 240 / 0.2)",
                borderRadius: "50%",
              }}
            />
            <div
              className="relative w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.03 240), oklch(0.25 0.08 240))",
                border: "2px solid oklch(0.78 0.19 85 / 0.8)",
                boxShadow:
                  "0 0 24px oklch(0.78 0.19 85 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.1)",
              }}
            >
              <Bot
                className="w-7 h-7"
                style={{ color: "oklch(0.78 0.19 85)" }}
              />
            </div>
            <span
              className="text-[10px] font-bold tracking-widest"
              style={{
                color: "oklch(0.78 0.19 85)",
                textShadow: "0 0 8px oklch(0.78 0.19 85)",
              }}
            >
              JARVIS
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="jarvis-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            data-ocid="jarvis.dialog"
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-24px)] flex flex-col"
            style={{
              height: "min(600px, calc(100vh - 40px))",
              background: "oklch(0.12 0.04 240 / 0.92)",
              backdropFilter: "blur(24px) saturate(1.8)",
              border: "1px solid oklch(0.78 0.19 85 / 0.4)",
              borderRadius: "20px",
              boxShadow:
                "0 0 40px oklch(0.78 0.19 85 / 0.15), 0 25px 60px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.08)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-t-[20px] flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.18 0.08 240), oklch(0.22 0.06 260))",
                borderBottom: "1px solid oklch(0.78 0.19 85 / 0.2)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.25 0.12 240), oklch(0.3 0.1 260))",
                    border: "1.5px solid oklch(0.78 0.19 85 / 0.6)",
                    boxShadow: "0 0 12px oklch(0.78 0.19 85 / 0.3)",
                  }}
                >
                  <Bot
                    className="w-5 h-5"
                    style={{ color: "oklch(0.78 0.19 85)" }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-bold text-sm tracking-wider"
                      style={{ color: "oklch(0.78 0.19 85)" }}
                    >
                      JARVIS
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.7 0.05 240)" }}
                    >
                      AI Assistant
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: "oklch(0.65 0.22 142)" }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.65 0.22 142)" }}
                    >
                      Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  data-ocid="jarvis.close_button"
                  style={{ color: "oklch(0.7 0.05 240)" }}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full hover:bg-white/10"
                  onClick={() => {
                    setIsOpen(false);
                    setMessages([]);
                    setGreetingDone(false);
                  }}
                  data-ocid="jarvis.cancel_button"
                  style={{ color: "oklch(0.7 0.05 240)" }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "oklch(0.3 0.05 240) transparent",
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "assistant" && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.25 0.12 240), oklch(0.3 0.1 260))",
                        border: "1px solid oklch(0.78 0.19 85 / 0.5)",
                      }}
                    >
                      <Bot
                        className="w-3.5 h-3.5"
                        style={{ color: "oklch(0.78 0.19 85)" }}
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] group ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-0.5`}
                  >
                    <div
                      className="px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        borderRadius:
                          msg.role === "user"
                            ? "16px 16px 4px 16px"
                            : "16px 16px 16px 4px",
                        background:
                          msg.role === "user"
                            ? "linear-gradient(135deg, oklch(0.55 0.2 85), oklch(0.48 0.18 50))"
                            : "oklch(0.2 0.05 240 / 0.8)",
                        color: "oklch(0.95 0.01 240)",
                        border:
                          msg.role === "assistant"
                            ? "1px solid oklch(0.3 0.05 240)"
                            : "none",
                      }}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1 px-1">
                      <span
                        className="text-[10px]"
                        style={{ color: "oklch(0.5 0.05 240)" }}
                      >
                        {msg.time}
                      </span>
                      {msg.role === "assistant" && (
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg)}
                          data-ocid="jarvis.toggle"
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                          style={{
                            color:
                              speakingId === msg.id
                                ? "oklch(0.65 0.22 142)"
                                : "oklch(0.5 0.05 240)",
                          }}
                          title={speakingId === msg.id ? "Stop" : "Read aloud"}
                        >
                          {speakingId === msg.id ? (
                            <VolumeX className="w-3 h-3" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 items-end"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.25 0.12 240), oklch(0.3 0.1 260))",
                      border: "1px solid oklch(0.78 0.19 85 / 0.5)",
                    }}
                  >
                    <Bot
                      className="w-3.5 h-3.5"
                      style={{ color: "oklch(0.78 0.19 85)" }}
                    />
                  </div>
                  <div
                    className="px-4 py-3 flex gap-1"
                    style={{
                      borderRadius: "16px 16px 16px 4px",
                      background: "oklch(0.2 0.05 240 / 0.8)",
                      border: "1px solid oklch(0.3 0.05 240)",
                    }}
                  >
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{
                          background: "oklch(0.78 0.19 85)",
                          animationDelay: `${i * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick reply chips */}
              {quickReplies.length > 0 && messages.length >= 1 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1.5 pt-1"
                >
                  {quickReplies.map((chip) => (
                    <button
                      type="button"
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      data-ocid="jarvis.button"
                      className="text-xs px-2.5 py-1 rounded-full transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: "oklch(0.2 0.06 240 / 0.8)",
                        border: "1px solid oklch(0.78 0.19 85 / 0.4)",
                        color: "oklch(0.78 0.19 85)",
                      }}
                    >
                      {chip}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div
              className="flex-shrink-0 px-3 pb-3 pt-2"
              style={{ borderTop: "1px solid oklch(0.25 0.05 240)" }}
            >
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{
                  background: "oklch(0.18 0.04 240)",
                  border: "1px solid oklch(0.3 0.06 240)",
                }}
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && sendMessage()
                  }
                  placeholder="Ask JARVIS anything..."
                  data-ocid="jarvis.input"
                  className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-sm"
                  style={{
                    color: "oklch(0.92 0.01 240)",
                  }}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  data-ocid="jarvis.toggle"
                  className="p-1.5 rounded-lg transition-all hover:scale-110 active:scale-95 flex-shrink-0"
                  style={{
                    background: isRecording
                      ? "oklch(0.55 0.22 25 / 0.3)"
                      : "oklch(0.25 0.06 240)",
                    color: isRecording
                      ? "oklch(0.7 0.22 25)"
                      : "oklch(0.6 0.06 240)",
                    boxShadow: isRecording
                      ? "0 0 10px oklch(0.55 0.22 25 / 0.4)"
                      : "none",
                  }}
                  title={isRecording ? "Stop recording" : "Start voice input"}
                >
                  {isRecording ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim()}
                  data-ocid="jarvis.submit_button"
                  className="p-1.5 rounded-lg transition-all hover:scale-110 active:scale-95 flex-shrink-0 disabled:opacity-40"
                  style={{
                    background: input.trim()
                      ? "linear-gradient(135deg, oklch(0.55 0.2 85), oklch(0.48 0.18 50))"
                      : "oklch(0.25 0.06 240)",
                    color: "oklch(0.95 0.01 240)",
                    boxShadow: input.trim()
                      ? "0 0 10px oklch(0.78 0.19 85 / 0.3)"
                      : "none",
                  }}
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p
                className="text-center text-[10px] mt-1.5"
                style={{ color: "oklch(0.4 0.04 240)" }}
              >
                JARVIS · Powered by Food Haveli AI
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
