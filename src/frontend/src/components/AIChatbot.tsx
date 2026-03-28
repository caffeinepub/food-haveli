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

// ─── Bad Word Filter ──────────────────────────────────────────────────────────
const BAD_WORDS_EN = [
  "fuck",
  "shit",
  "ass",
  "bitch",
  "bastard",
  "damn",
  "crap",
  "hell",
  "idiot",
  "stupid",
  "moron",
  "jerk",
  "cunt",
  "dick",
  "piss",
];
const BAD_WORDS_HI = [
  "गाली",
  "भड़वा",
  "मादरचोद",
  "बहनचोद",
  "लंड",
  "रंडी",
  "हरामी",
  "कमीना",
  "कुत्ता",
  "साला",
  "बकवास",
  "गधा",
  "चुतिया",
  "बेवकूफ",
];

function containsBadWord(text: string): boolean {
  const lower = text.toLowerCase();
  for (const word of BAD_WORDS_EN) {
    if (lower.includes(word)) return true;
  }
  for (const word of BAD_WORDS_HI) {
    if (text.includes(word)) return true;
  }
  return false;
}

function censorBadWords(text: string): string {
  let result = text;
  for (const word of BAD_WORDS_EN) {
    const regex = new RegExp(word, "gi");
    result = result.replace(regex, "***");
  }
  for (const word of BAD_WORDS_HI) {
    result = result.replaceAll(word, "***");
  }
  return result;
}

// ─── Language Detection ───────────────────────────────────────────────────────
function detectLanguage(text: string): Lang {
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;
  const totalChars = text.replace(/\s/g, "").length;
  if (totalChars === 0) return "english";
  if (devanagariCount === 0) return "english";
  if (devanagariCount / totalChars > 0.3) return "hindi";
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

// ─── Haveli AI Response Engine ────────────────────────────────────────────────
const FOOD_HAVELI_KB = {
  what: {
    en: "Food Haveli is a zero-commission SaaS platform that lets any small restaurant, cloud kitchen, or food vendor launch a full online ordering website in under 10 minutes — no coding required. You get AI menu builder, QR code ordering, WhatsApp alerts, GST invoicing, analytics, demand prediction, and much more.",
    hi: "Food Haveli एक zero-commission SaaS platform है जो किसी भी छोटे रेस्टोरेंट को 10 मिनट में अपनी online ordering website लॉन्च करने देता है — बिना किसी coding के। AI menu builder, QR code ordering, WhatsApp alerts, GST invoice, analytics, demand prediction — सब कुछ शामिल है।",
    hg: "Food Haveli ek zero-commission SaaS platform hai jo kisi bhi chhote restaurant ko 10 minutes mein apni online ordering website launch karne deta hai — bina coding ke. AI menu builder, QR code, WhatsApp alerts, GST invoice, analytics — sab included hai!",
  },
  start: {
    en: "Getting started is super easy!\n1. Click 'Start Your Restaurant Website' on the homepage\n2. Sign up as an owner\n3. Fill your restaurant profile (name, address, GSTIN)\n4. Build your menu with AI in 2 minutes\n5. Set up WhatsApp alerts\n6. Download & print your QR code\n7. Share your link — start receiving orders!\nThe entire process takes under 10 minutes.",
    hi: "शुरू करना बहुत आसान है!\n1. Homepage पर 'Start Your Restaurant Website' click करें\n2. Owner के रूप में signup करें\n3. Restaurant profile भरें (name, address, GSTIN)\n4. AI से 2 मिनट में menu बनाएं\n5. WhatsApp alerts setup करें\n6. QR code download करें और print करें\n7. Link share करें — orders लेना शुरू!\nपूरी process 10 मिनट से कम में होती है।",
    hg: "Shuru karna bahut easy hai!\n1. 'Start Your Restaurant Website' click karo\n2. Owner signup karo\n3. Profile bharo\n4. AI se 2 min mein menu banao\n5. WhatsApp alerts setup karo\n6. QR print karo, link share karo — orders shuru!",
  },
  pricing: {
    en: "Food Haveli offers 3 transparent plans:\n\n🆓 Free Plan — ₹0/month\n• Basic menu & ordering (forever free)\n• QR code, WhatsApp alerts\n\n🚀 Growth — ₹999/month\n• Full AI suite + analytics\n• Demand prediction, WhatsApp alerts\n• Priority support\n\n👑 Pro — ₹2,499/month\n• All Growth features\n• Reseller rights — onboard other restaurants\n• Vendor manager dashboard\n• Earn recurring income",
    hi: "Food Haveli 3 transparent plans offer करता है:\n\n🆓 Free Plan — ₹0/माह\n• Basic menu और ordering (हमेशा के लिए free)\n• QR code, WhatsApp alerts\n\n🚀 Growth — ₹999/माह\n• Full AI suite + analytics\n• Demand prediction, priority support\n\n👑 Pro — ₹2,499/माह\n• सभी Growth features\n• Reseller rights — दूसरे restaurants onboard करें\n• Recurring income कमाएं",
    hg: "Food Haveli 3 plans deta hai:\n🆓 Free (₹0) — Basic ordering\n🚀 Growth (₹999) — AI, analytics, WhatsApp\n👑 Pro (₹2,499) — Sab features + reseller rights",
  },
  qr: {
    en: "In CMS, a unique QR code is auto-generated for your restaurant. Download and print it for your dining tables, counter, or packaging. Customers scan it with any phone camera — no app download needed — and land directly on your menu to order instantly. The QR links to your unique menu URL permanently.",
    hi: "CMS में आपके restaurant के लिए automatic QR code बनता है। इसे download करके tables, counter या packaging पर print करें। Customer किसी भी phone से scan करे — बिना कोई app download किए — और सीधे menu पर order करे। QR code permanently आपके menu URL से linked रहता है।",
    hg: "CMS mein aapke restaurant ka unique QR code auto-generate hota hai. Download karo, tables pe print karo. Customer kisi bhi phone se scan kare — no app needed — aur directly menu pe aa jaaye aur order kare.",
  },
  whatsapp: {
    en: "Set your WhatsApp number once in CMS → Settings. Every new order automatically sends a formatted WhatsApp message containing:\n• Customer name & phone number\n• Full list of items with quantities\n• Delivery address\n• Total amount with GST\n• Order ID and timestamp\nNo new app to learn — orders arrive where you already are, 24/7!",
    hi: "CMS → Settings में एक बार अपना WhatsApp number set करें। हर नया order automatically आपके WhatsApp पर formatted message भेजता है जिसमें होता है:\n• Customer name और phone\n• Items और quantities\n• Delivery address\n• Total amount with GST\n• Order ID और timestamp\nकोई नई app नहीं सीखनी — orders आपके WhatsApp पर आते हैं!",
    hg: "CMS → Settings mein ek baar WhatsApp number set karo. Har naya order automatically WhatsApp pe formatted message bhejta hai — customer name, items, address, total, order ID sab ke saath!",
  },
  ai_menu: {
    en: "In CMS, click 'Generate Menu with AI', type one line describing your restaurant — e.g. 'North Indian restaurant with curries, breads, and drinks'. AI instantly builds:\n• Full menu categories (Mains, Breads, Snacks, Drinks, Desserts)\n• Dish names with descriptions\n• Market-rate pricing suggestions\nEdit anything you want and publish in one click. Total time: under 2 minutes!",
    hi: "CMS में 'Generate Menu with AI' click करें, एक line type करें जैसे 'North Indian restaurant with curries' — AI तुरंत बना देता है:\n• Full menu categories\n• Dish names और descriptions\n• Market-rate pricing\nकोई भी item edit करें और एक click में publish! Total time: 2 मिनट से कम!",
    hg: "CMS mein 'Generate Menu with AI' click karo, ek line likho jaise 'North Indian restaurant' — AI 2 min mein poora menu bana deta hai with categories, names, descriptions, prices. Edit karo aur publish!",
  },
  analytics: {
    en: "The Smart Analytics Dashboard gives you real-time business intelligence:\n• Total orders & daily revenue\n• Most popular dishes (bar chart)\n• Peak ordering hours (line chart)\n• Customer retention rate\n• Average order value (AOV)\n• Monthly revenue trends\n\nAI Demand Prediction layer also forecasts:\n• Which dishes will sell most tomorrow\n• Expected peak hours\n• How much inventory to prepare\nAll in one beautiful dashboard — no analyst needed!",
    hi: "Smart Analytics Dashboard real-time business intelligence देता है:\n• Total orders और daily revenue\n• सबसे popular dishes (bar chart)\n• Peak ordering hours (line chart)\n• Customer retention rate\n• Average order value\n• Monthly revenue trends\n\nAI Demand Prediction बताता है:\n• कल कौन सी dishes सबसे ज्यादा बिकेंगी\n• Expected peak hours\n• कितना inventory तैयार करें\nसब कुछ एक dashboard में!",
    hg: "Analytics dashboard mein: orders, revenue, popular dishes, peak hours, retention sab real-time dikhta hai. AI demand prediction bhi batata hai kal kya aur kitna stock karna hai!",
  },
  order: {
    en: "Customer ordering is seamless — under 3 minutes total:\n1. Open link or scan QR code\n2. Browse menu with real food photos\n3. Add items to cart\n4. Enter name, phone, delivery address\n5. Confirm order\n\nAfter order:\n• Instant GST invoice generated\n• Live status tracking: Pending → Preparing → Ready → Delivered\n• Restaurant gets WhatsApp notification immediately",
    hi: "Customer ordering बहुत आसान है — 3 मिनट से कम:\n1. Link open करें या QR scan करें\n2. Real food photos के साथ menu browse करें\n3. Cart में items add करें\n4. Name, phone, address enter करें\n5. Order confirm करें\n\nOrder के बाद:\n• GST invoice instantly generate होती है\n• Live tracking: Pending → Preparing → Ready → Delivered\n• Restaurant को WhatsApp notification मिलता है",
    hg: "Customer 3 min mein order kar sakta hai: link/QR → menu browse → cart → details → confirm. GST invoice instant milti hai aur live tracking bhi hota hai.",
  },
  commission: {
    en: "Food Haveli charges ZERO commission — ever.\n\nCompare the savings:\n• Swiggy/Zomato commission: 18–30% per order\n• Restaurant doing ₹1 lakh/month on Swiggy pays ₹25,000/month in commission\n• Food Haveli Pro plan: ₹2,499/month\n• Monthly savings: ₹22,501\n• Annual savings: ₹2,70,012\n\nIn 3 months, the savings pay for a full year of Food Haveli Pro!",
    hi: "Food Haveli का commission बिल्कुल ZERO है — हमेशा के लिए।\n\nबचत का comparison:\n• Swiggy/Zomato commission: 18-30% per order\n• ₹1 लाख/माह का restaurant ₹25,000/माह commission देता है\n• Food Haveli Pro plan: ₹2,499/माह\n• मासिक बचत: ₹22,501\n• वार्षिक बचत: ₹2,70,012\n\n3 महीने की बचत से पूरे साल का Food Haveli Pro मिल जाता है!",
    hg: "Food Haveli ka commission ZERO hai. Swiggy/Zomato 18-30% lete hain. ₹1 lakh/month restaurant ko ₹25,000/month bachta hai Food Haveli se — ₹2,70,000 per year savings!",
  },
  map: {
    en: "The /map page shows all Food Haveli restaurants on an interactive OpenStreetMap with location pins, ratings, and distances. Customers can discover nearby restaurants, see ratings, and order directly. Restaurant owners can add their real location coordinates via CMS to appear on the map.",
    hi: "/map page पर सभी Food Haveli restaurants एक interactive OpenStreetMap पर pins, ratings और distances के साथ दिखते हैं। Customers nearby restaurants discover कर सकते हैं और सीधे order कर सकते हैं। Owners CMS से अपनी location add कर सकते हैं।",
    hg: "/map page pe saare Food Haveli restaurants OpenStreetMap pe dikhte hain with ratings aur distances. Customers nearby discover karke directly order kar sakte hain.",
  },
  cms: {
    en: "The CMS (Content Management System) is your all-in-one self-service control panel. From one dashboard you can:\n• Add/edit/delete menu items with images\n• Update restaurant info (address, phone, GSTIN)\n• View & manage all orders with status updates\n• Download QR code\n• Manage pricing plans\n• Onboard other vendors (reseller model)\n• View analytics and reports\nAll without writing a single line of code!",
    hi: "CMS (Content Management System) आपका all-in-one self-service control panel है। एक dashboard से:\n• Menu items add/edit/delete करें (images के साथ)\n• Restaurant info update करें (address, phone, GSTIN)\n• Orders view और manage करें\n• QR code download करें\n• Pricing plans manage करें\n• Vendors onboard करें (reseller model)\n• Analytics और reports देखें\nबिना एक भी line code लिखे!",
    hg: "CMS aapka all-in-one control panel hai. Ek jagah se menu, orders, QR, pricing, vendors, analytics — sab manage karo. No coding!",
  },
  gst: {
    en: "GST on restaurant food in India is 5% (without ITC) for most restaurants. Food Haveli automatically calculates and includes GST in every order. After each order, a fully GST-compliant invoice is generated containing:\n• Your restaurant's GSTIN\n• Itemized list of all dishes\n• GST amount breakdown (CGST + SGST)\n• Order ID, date, time\n• Customer and restaurant details\nNo manual billing needed — it's 100% automatic!",
    hi: "India में restaurant food पर GST 5% (without ITC) होता है। Food Haveli automatically हर order में GST calculate करता है। हर order के बाद fully GST-compliant invoice बनती है जिसमें होता है:\n• आपका restaurant GSTIN\n• सभी dishes की itemized list\n• GST breakdown (CGST + SGST)\n• Order ID, date, time\n• Customer और restaurant details\nकोई manual billing नहीं — 100% automatic!",
    hg: "GST 5% hota hai restaurant pe. Food Haveli automatically GST calculate karta hai aur GST-compliant invoice generate karta hai har order ke baad — GSTIN, items, breakdown sab ke saath.",
  },
  invoice: {
    en: "Every order on Food Haveli generates a GST-compliant invoice automatically. The invoice includes:\n• Unique Order ID\n• Restaurant name, address, GSTIN\n• Customer name and delivery address\n• Itemized list: dish name, quantity, price\n• Subtotal, GST (CGST + SGST), and Grand Total\n• Order date and time\nCustomers can save or print it for their records. Zero paperwork for the restaurant owner!",
    hi: "Food Haveli पर हर order के बाद GST-compliant invoice automatically generate होती है। Invoice में होता है:\n• Unique Order ID\n• Restaurant name, address, GSTIN\n• Customer name और delivery address\n• Items: dish name, quantity, price\n• Subtotal, GST (CGST + SGST), Grand Total\n• Order date और time\nCustomers इसे save या print कर सकते हैं। Restaurant owner को कोई paperwork नहीं!",
    hg: "Har order ke baad GST invoice automatically generate hoti hai — Order ID, restaurant GSTIN, items, GST breakdown, grand total sab ke saath. Customer save ya print kar sakta hai.",
  },
  vendor: {
    en: "The Vendor/Reseller model (Pro Plan — ₹2,499/month) lets you build a food tech business:\n• Onboard multiple restaurants via CMS → Vendor Manager\n• Each restaurant gets their own ordering website\n• Manage all vendors from one dashboard\n• Charge restaurants a monthly fee\n• Earn recurring passive income\nExample: Onboard 10 restaurants at ₹500/month each = ₹5,000/month extra income. Your plan pays for itself with just 5 restaurants!",
    hi: "Vendor/Reseller model (Pro Plan — ₹2,499/माह) से आप एक food tech business बना सकते हैं:\n• CMS → Vendor Manager से multiple restaurants onboard करें\n• हर restaurant को अपनी ordering website मिलती है\n• एक dashboard से सभी vendors manage करें\n• Restaurants से monthly fee लें\n• Recurring passive income कमाएं\nExample: 10 restaurants at ₹500/माह = ₹5,000/माह extra income. सिर्फ 5 restaurants से plan का खर्च निकल जाता है!",
    hg: "Pro Plan mein Vendor Manager se aap multiple restaurants onboard kar sakte ho, unse monthly fee le sakte ho, aur passive income kama sakte ho. 10 restaurants × ₹500 = ₹5,000/month extra!",
  },
  add_menu: {
    en: "To add menu items manually in CMS:\n1. Go to CMS panel (click 'CMS' in navbar)\n2. Click 'Menu Management' tab\n3. Click '+ Add Item' button\n4. Fill: dish name, description, price, category\n5. Upload a real food photo (or paste image URL)\n6. Click 'Save' — item goes live instantly!\n\nTo use AI instead: click 'Generate Menu with AI' and describe your restaurant in one line.",
    hi: "CMS में manually menu items add करने के लिए:\n1. Navbar में 'CMS' click करें\n2. 'Menu Management' tab पर जाएं\n3. '+ Add Item' button click करें\n4. Dish name, description, price, category भरें\n5. Real food photo upload करें\n6. 'Save' click करें — item instantly live!\n\nAI से menu बनाने के लिए: 'Generate Menu with AI' click करें।",
    hg: "CMS → Menu Management → + Add Item → name, price, category, photo bharo → Save. Item instantly live ho jaata hai. AI se bhi menu banwa sakte ho!",
  },
  blockchain: {
    en: "Food Haveli runs on the Internet Computer (ICP) — a next-generation blockchain network by DFINITY. Why this is better than AWS or traditional cloud:\n• No central server — decentralized, always online\n• Data owned by YOU — not by Amazon or Google\n• Censorship-resistant — no one can shut it down\n• Lower cost at scale — no per-GB storage fees\n• Smart contracts (Motoko canisters) run the backend\nThis means your restaurant platform can never be taken down, and you truly own your data and business.",
    hi: "Food Haveli Internet Computer (ICP) blockchain पर run करता है — DFINITY द्वारा बनाया गया। AWS से बेहतर क्यों:\n• कोई central server नहीं — decentralized, हमेशा online\n• Data आपका — Amazon या Google का नहीं\n• कोई shutdown नहीं कर सकता\n• Scale पर कम cost\n• Smart contracts (Motoko canisters) backend चलाते हैं\nइसका मतलब आपकी restaurant platform कभी down नहीं होगी और data पूरी तरह आपका है।",
    hg: "Food Haveli Internet Computer blockchain pe hai — DFINITY ka. Iska matlab: no central server, data aapka, kabhi shutdown nahi, AWS se better cost. Aapka restaurant kabhi offline nahi hoga!",
  },
  support: {
    en: "Food Haveli support options:\n• 💬 This AI chatbot (Haveli AI) — 24/7 instant answers\n• 📝 Contact Form — fill name, company, email, message on the website\n• 📱 WhatsApp — contact the team directly\n• 🌐 CMS Panel — self-serve for most issues\n\nFor technical issues: describe your problem to Haveli AI and get step-by-step solutions. For billing/account issues: use the Contact form or reach out via WhatsApp.",
    hi: "Food Haveli support options:\n• 💬 यह AI chatbot (Haveli AI) — 24/7 instant answers\n• 📝 Contact Form — website पर name, company, email, message भरें\n• 📱 WhatsApp — team से directly contact करें\n• 🌐 CMS Panel — most issues के लिए self-serve\n\nTechnical issues के लिए: Haveli AI को problem बताएं, step-by-step solution मिलेगा।",
    hg: "Support ke liye: Haveli AI (24/7), Contact Form, WhatsApp, ya CMS Panel. Technical issue hai to Haveli AI ko batao — step-by-step solution milega!",
  },
};

function getHaveliResponse(input: string, lang: Lang): string {
  const lower = input.toLowerCase();
  const l = lang === "hindi" ? "hi" : lang === "hinglish" ? "hg" : "en";

  // Greetings
  if (
    /^(hello|hi|hey|hii|helo|good morning|good evening|good afternoon|wassup|sup|yo)/.test(
      lower.trim(),
    ) ||
    /^(namaste|namaskar|jai hind|kya haal|theek ho|kaise ho|नमस्ते|हैलो|सुप्रभात|कैसे हो|क्या हाल)/.test(
      lower.trim(),
    )
  ) {
    if (l === "hi")
      return "नमस्ते! 🙏 मैं Haveli AI हूँ, Food Haveli का intelligent assistant। आज मैं आपकी किस तरह मदद कर सकता हूँ?\n\nमैं इनमें help कर सकता हूँ:\n• Food Haveli features और guidance\n• Menu management और CMS\n• Orders, invoices, GST\n• Business और coding advice\n• और बहुत कुछ!";
    if (l === "hg")
      return "Hello! Main Haveli AI hoon, Food Haveli ka smart assistant. Aaj main aapki kaise help kar sakta hoon? 😊\n\nMain help kar sakta hoon:\n• Food Haveli features\n• Menu, orders, CMS\n• Business advice\n• Coding aur tech tips";
    return "Hello! I'm Haveli AI, your intelligent assistant for Food Haveli. How can I help you today? 😊\n\nI can assist with:\n• Food Haveli features & guidance\n• Menu management & CMS\n• Orders, invoices & GST\n• Business & coding advice\n• And much more!";
  }

  // Food Haveli specific
  if (
    lower.includes("what is food haveli") ||
    lower.includes("food haveli kya") ||
    lower.includes("फूड हवेली क्या") ||
    lower.includes("about food haveli") ||
    lower.includes("tell me about")
  ) {
    return FOOD_HAVELI_KB.what[l];
  }
  if (
    lower.includes("gst") ||
    lower.includes("tax") ||
    lower.includes("taxation") ||
    lower.includes("टैक्स") ||
    lower.includes("जीएसटी")
  ) {
    return FOOD_HAVELI_KB.gst[l];
  }
  if (
    lower.includes("invoice") ||
    lower.includes("receipt") ||
    lower.includes("bill") ||
    lower.includes("बिल") ||
    lower.includes("इनवॉइस")
  ) {
    return FOOD_HAVELI_KB.invoice[l];
  }
  if (
    lower.includes("vendor") ||
    lower.includes("resell") ||
    lower.includes("reseller") ||
    lower.includes("earn") ||
    lower.includes("income") ||
    lower.includes("passive") ||
    lower.includes("onboard") ||
    lower.includes("रिसेलर") ||
    lower.includes("कमाई")
  ) {
    return FOOD_HAVELI_KB.vendor[l];
  }
  if (
    lower.includes("add menu") ||
    lower.includes("add item") ||
    lower.includes("menu add") ||
    lower.includes("नया item") ||
    lower.includes("item kaise") ||
    lower.includes("dish add")
  ) {
    return FOOD_HAVELI_KB.add_menu[l];
  }
  if (
    lower.includes("blockchain") ||
    lower.includes("icp") ||
    lower.includes("internet computer") ||
    lower.includes("dfinity") ||
    lower.includes("decentralized") ||
    lower.includes("web3") ||
    lower.includes("ब्लॉकचेन")
  ) {
    return FOOD_HAVELI_KB.blockchain[l];
  }
  if (
    lower.includes("support") ||
    lower.includes("help") ||
    lower.includes("contact") ||
    lower.includes("issue") ||
    lower.includes("problem") ||
    lower.includes("मदद") ||
    lower.includes("समस्या")
  ) {
    return FOOD_HAVELI_KB.support[l];
  }
  if (
    lower.includes("start") ||
    lower.includes("get started") ||
    lower.includes("कैसे शुरू") ||
    lower.includes("shuru") ||
    lower.includes("signup") ||
    lower.includes("register") ||
    lower.includes("begin")
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
    lower.includes("₹") ||
    lower.includes("fee") ||
    lower.includes("subscription")
  ) {
    return FOOD_HAVELI_KB.pricing[l];
  }
  if (lower.includes("qr") || lower.includes("scan") || lower.includes("स्कैन")) {
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
    lower.includes("menu banao") ||
    lower.includes("auto menu")
  ) {
    return FOOD_HAVELI_KB.ai_menu[l];
  }
  if (
    lower.includes("analytic") ||
    lower.includes("dashboard") ||
    lower.includes("revenue") ||
    lower.includes("report") ||
    lower.includes("डेटा") ||
    lower.includes("रिपोर्ट") ||
    lower.includes("prediction") ||
    lower.includes("demand")
  ) {
    return FOOD_HAVELI_KB.analytics[l];
  }
  if (
    lower.includes("order") ||
    lower.includes("track") ||
    lower.includes("ऑर्डर") ||
    lower.includes("delivery") ||
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
    lower.includes("save") ||
    lower.includes("saving")
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
      return "Coding सीखना एक शानदार decision है! यहाँ एक solid plan है:\n\n📚 Beginner Path:\n• Python से शुरू करें — सबसे easy syntax\n• HTML/CSS — web pages बनाएं\n• JavaScript — interactivity add करें\n\n🚀 Intermediate Path:\n• React या Vue — modern UI frameworks\n• Node.js — backend development\n• SQL/MongoDB — databases\n\n🎯 Free Resources:\n• freeCodeCamp.org\n• Khan Academy\n• CS50 (Harvard, free)\n• YouTube (Hindi में भी available!)\n\nRoz 30-60 minutes practice करें और छोटे projects बनाएं। आप किस language में interested हैं?";
    if (l === "hg")
      return "Coding seekhna bahut exciting hai! Solid plan:\n\n📚 Python se shuru karo (easiest), phir HTML/CSS, phir JavaScript.\n\n🚀 Phir React (UI), Node.js (backend), SQL (database).\n\n🎯 Free resources: freeCodeCamp, CS50, YouTube.\n\nRoz 30-60 min practice karo, chhote projects banao. Kaunsi language mein interest hai?";
    return "Learning to code is an excellent decision! Here's a solid roadmap:\n\n📚 Beginner Path:\n• Python — easiest syntax, great for beginners\n• HTML/CSS — build web pages\n• JavaScript — add interactivity\n\n🚀 Intermediate Path:\n• React — modern UI framework\n• Node.js — backend development\n• SQL/MongoDB — databases\n\n🎯 Free Resources:\n• freeCodeCamp.org\n• CS50 by Harvard (free)\n• The Odin Project\n• YouTube tutorials\n\nPractice 30-60 min daily and build small projects. Which language interests you most?";
  }

  if (
    lower.includes("business") ||
    lower.includes("व्यवसाय") ||
    lower.includes("startup") ||
    lower.includes("idea") ||
    lower.includes("पैसा") ||
    lower.includes("money") ||
    lower.includes("entrepreneur")
  ) {
    if (l === "hi")
      return "आपके व्यवसाय को बढ़ाने के proven strategies:\n\n📱 Digital Presence:\n• अपनी website launch करें (Food Haveli से!)\n• Google My Business पर register करें\n• Instagram और WhatsApp Business use करें\n\n📊 Data-Driven Growth:\n• Analytics से best-selling items identify करें\n• Peak hours में extra staff तैयार रखें\n• Customer feedback regularly लें\n\n💰 Revenue Boost:\n• Online ordering से reach बढ़ाएं\n• Zero commission platform use करें\n• Loyalty program शुरू करें\n\nआपका व्यवसाय किस क्षेत्र में है?";
    if (l === "hg")
      return "Business badhane ke proven strategies:\n\n📱 Digital: website launch karo, Google My Business, Instagram.\n📊 Data: analytics use karo, peak hours track karo.\n💰 Revenue: online ordering, zero commission platform, loyalty program.\n\nAapka business kaunse field mein hai?";
    return "Proven strategies to scale your business:\n\n📱 Build Digital Presence:\n• Launch your website (Food Haveli makes it 10 min!)\n• Register on Google My Business\n• Use Instagram & WhatsApp Business\n\n📊 Data-Driven Decisions:\n• Use analytics to find best-selling items\n• Prepare extra for peak hours\n• Collect customer feedback regularly\n\n💰 Boost Revenue:\n• Enable online ordering — reach more customers\n• Use zero-commission platform (save ₹25,000/month vs Swiggy)\n• Start a loyalty program\n\nWhat industry is your business in?";
  }

  if (
    lower.includes("career") ||
    lower.includes("job") ||
    lower.includes("नौकरी") ||
    lower.includes("करियर") ||
    lower.includes("fresher") ||
    lower.includes("placement") ||
    lower.includes("interview")
  ) {
    if (l === "hi")
      return "Career guidance के लिए complete roadmap:\n\n🎯 Step 1 — Goal Define करें:\n• कौन सा field? (Tech, Finance, Marketing, Food Business)\n• 2 साल में कहाँ देखते हैं खुद को?\n\n📚 Step 2 — Skills Build करें:\n• Online courses (Coursera, Udemy, YouTube)\n• Certifications जो industry में valued हों\n\n🛠️ Step 3 — Portfolio बनाएं:\n• Real projects जो showcase कर सकें\n• GitHub profile (tech के लिए)\n\n🤝 Step 4 — Network करें:\n• LinkedIn profile optimize करें\n• Alumni से connect करें\n• Meetups और events attend करें\n\n💼 Step 5 — Apply करें:\n• Internships से शुरुआत करें\n• Resume tailor करें हर job के लिए\n\nआप किस field में career बनाना चाहते हैं?";
    if (l === "hg")
      return "Career roadmap:\n1. Goal define karo (kaunsa field?)\n2. Skills build karo (online courses)\n3. Portfolio banao (real projects)\n4. LinkedIn optimize karo, network karo\n5. Internships se start karo\n\nKis field mein jaana chahte ho?";
    return "Complete career building roadmap:\n\n🎯 Step 1 — Define Your Goal:\n• Which field excites you? (Tech, Finance, Marketing)\n• Where do you see yourself in 2 years?\n\n📚 Step 2 — Build Skills:\n• Online courses (Coursera, Udemy, YouTube)\n• Industry-valued certifications\n\n🛠️ Step 3 — Build Portfolio:\n• Real projects you can showcase\n• GitHub profile (for tech roles)\n\n🤝 Step 4 — Network Actively:\n• Optimize LinkedIn profile\n• Connect with alumni\n• Attend meetups and events\n\n💼 Step 5 — Apply Smart:\n• Start with internships for experience\n• Tailor resume for each job\n\nWhich career field are you targeting?";
  }

  if (
    lower.includes("ai") ||
    lower.includes("artificial intelligence") ||
    lower.includes("machine learning") ||
    lower.includes("chatgpt") ||
    lower.includes("कृत्रिम बुद्धिमत्ता")
  ) {
    if (l === "hi")
      return "AI (Artificial Intelligence) machines को human-like thinking और learning की capability देता है।\n\nKey areas:\n🧠 Machine Learning — patterns से सीखना\n🔬 Deep Learning — neural networks\n💬 NLP — भाषा समझना (जो मैं करता हूँ!)\n👁️ Computer Vision — images पहचानना\n\nAI आज इन industries में revolution ला रहा है:\n• Healthcare — disease diagnosis\n• Finance — fraud detection\n• Food Tech — demand prediction, menu optimization\n• Education — personalized learning\n\nAI सीखना शुरू करें: Python → NumPy/Pandas → Scikit-learn → TensorFlow।\nFree: fast.ai, Google ML Crash Course, Kaggle।\n\nकोई specific AI topic जानना चाहते हैं?";
    if (l === "hg")
      return "AI machines ko human-like thinking deta hai. Key areas: ML, Deep Learning, NLP, Computer Vision. Aaj healthcare, finance, food tech mein AI use ho raha hai. Seekhna ho to: Python → ML libraries → Projects. Koi specific AI topic?";
    return "AI (Artificial Intelligence) gives machines human-like thinking and learning abilities.\n\nKey Areas:\n🧠 Machine Learning — learning from data patterns\n🔬 Deep Learning — neural networks mimicking the brain\n💬 NLP — understanding human language (like me!)\n👁️ Computer Vision — recognizing images and video\n\nAI is transforming industries:\n• Healthcare — disease diagnosis\n• Finance — fraud detection\n• Food Tech — demand prediction\n• Education — personalized learning\n\nTo learn AI: Python → NumPy/Pandas → Scikit-learn → TensorFlow/PyTorch\nFree resources: fast.ai, Google ML Crash Course, Kaggle\n\nAny specific AI area you want to explore?";
  }

  if (
    lower.includes("web") ||
    lower.includes("website") ||
    lower.includes("react") ||
    lower.includes("html") ||
    lower.includes("css") ||
    lower.includes("javascript") ||
    lower.includes("frontend") ||
    lower.includes("वेबसाइट")
  ) {
    if (l === "hi")
      return "Web development का complete roadmap:\n\n🏗️ Foundation (1-2 महीने):\n• HTML — structure और content\n• CSS — styling और layouts (Flexbox, Grid)\n• JavaScript — interactivity और logic\n\n⚛️ Modern Framework (1-2 महीने):\n• React या Vue.js — component-based UI\n• TypeScript — type-safe JavaScript\n\n🔧 Backend (1-2 महीने):\n• Node.js + Express — REST APIs\n• Python + FastAPI/Django\n• SQL/MongoDB — databases\n\n🎯 Free Resources:\n• MDN Web Docs (best reference)\n• freeCodeCamp\n• The Odin Project\n• JavaScript.info\n\nपहले HTML/CSS से शुरू करें। आपको किस specific चीज़ में help चाहिए?";
    if (l === "hg")
      return "Web dev roadmap: HTML → CSS → JavaScript → React → Node.js/Backend. Free: MDN Docs, freeCodeCamp, The Odin Project. Kaunse topic mein help chahiye?";
    return "Complete web development roadmap:\n\n🏗️ Foundation (1-2 months):\n• HTML — structure and content\n• CSS — styling, Flexbox, Grid\n• JavaScript — interactivity and logic\n\n⚛️ Modern Framework (1-2 months):\n• React — component-based UI\n• TypeScript — type-safe JavaScript\n\n🔧 Backend (1-2 months):\n• Node.js + Express — REST APIs\n• Python + Django/FastAPI\n• SQL/MongoDB — databases\n\n🎯 Free Resources:\n• MDN Web Docs (best reference)\n• freeCodeCamp.org\n• The Odin Project\n• JavaScript.info\n\nStart with HTML/CSS basics. What specific area do you need help with?";
  }

  if (
    lower.includes("productivity") ||
    lower.includes("time management") ||
    lower.includes("productive") ||
    lower.includes("focus") ||
    lower.includes("व्यस्त") ||
    lower.includes("organize")
  ) {
    if (l === "hi")
      return "Productivity maximize करने के proven tips:\n\n⏱️ Time Management:\n• Pomodoro — 25 min focus + 5 min break\n• Time blocking — calendar में specific tasks schedule करें\n• 2-minute rule — 2 min का काम अभी करें\n\n📋 Task Management:\n• दिन की शुरुआत में 3 Main tasks decide करें\n• Notion या Todoist use करें\n• Weekly review करें\n\n🧠 Deep Work:\n• Phone notifications off करें\n• Specific deep work hours set करें\n• Distracting websites block करें\n\n😴 Recovery:\n• 7-8 घंटे की नींद लें\n• Regular exercise करें\n• Breaks लेना जरूरी है\n\nकोई specific productivity challenge?";
    if (l === "hg")
      return "Productivity tips: Pomodoro (25+5 min), 3 main daily tasks, Notion se organize, deep work hours, phone off. 7-8 ghante neend aur exercise bhi zaruri. Koi specific challenge?";
    return "Proven productivity tips to maximize your output:\n\n⏱️ Time Management:\n• Pomodoro — 25 min focus + 5 min break\n• Time blocking — schedule specific tasks\n• 2-minute rule — if under 2 min, do it now\n\n📋 Task Management:\n• Set 3 priority tasks every morning\n• Use Notion or Todoist\n• Weekly review every Sunday\n\n🧠 Deep Work:\n• Turn off notifications during focused work\n• Set dedicated deep work hours\n• Use website blockers for distractions\n\n😴 Recovery (often ignored):\n• 7-8 hours of quality sleep\n• Regular exercise (even 20 min/day)\n• Take real breaks\n\nAny specific productivity challenge you're facing?";
  }

  if (
    lower.includes("menu") ||
    lower.includes("food") ||
    lower.includes("dish") ||
    lower.includes("खाना") ||
    lower.includes("मेनू")
  ) {
    if (l === "hi")
      return "Food Haveli के menu में शानदार dishes हैं! 🍛\n\n🍗 Non-Veg Specials:\n• Butter Chicken — ₹320 (bestseller!)\n• Chicken Biryani — ₹280\n• Chicken Tikka — ₹350\n\n🥦 Veg Delights:\n• Paneer Tikka — ₹260\n• Dal Makhani — ₹220\n• Palak Paneer — ₹240\n\n🍞 Breads:\n• Garlic Naan — ₹60\n• Tandoori Roti — ₹40\n\n🥤 Drinks:\n• Mango Lassi — ₹120\n• Masala Chai — ₹60\n\nOrder करने के लिए 'Order Now' click करें!";
    if (l === "hg")
      return "Food Haveli mein amazing dishes hain! Butter Chicken (₹320), Biryani (₹280), Paneer Tikka (₹260), Dal Makhani (₹220), Garlic Naan (₹60), Mango Lassi (₹120). 'Order Now' click karo!";
    return "Food Haveli has amazing dishes! 🍛\n\n🍗 Non-Veg Specials:\n• Butter Chicken — ₹320 (bestseller!)\n• Chicken Biryani — ₹280\n• Chicken Tikka — ₹350\n\n🥦 Veg Delights:\n• Paneer Tikka — ₹260\n• Dal Makhani — ₹220\n• Palak Paneer — ₹240\n\n🍞 Breads: Garlic Naan ₹60, Tandoori Roti ₹40\n🥤 Drinks: Mango Lassi ₹120, Masala Chai ₹60\n\nClick 'Order Now' to place an order!";
  }

  // Smart fallback with suggestions
  if (l === "hi")
    return "आपका सवाल मिला। 😊 मैं इन topics पर expert हूँ:\n\n🍽️ Food Haveli:\n• Features, pricing, CMS, QR code\n• WhatsApp alerts, AI menu, analytics\n• GST invoice, orders, vendor reseller\n\n💼 Business & Tech:\n• Business strategies\n• Coding & web development\n• AI & machine learning\n• Career guidance\n\nकृपया अपना सवाल थोड़ा और specific बताएं — मैं full detail के साथ जवाब दूँगा! 🙏";
  if (l === "hg")
    return "Aapka sawaal mila. Main in topics pe expert hoon:\n\n🍽️ Food Haveli: features, pricing, CMS, QR, WhatsApp, AI menu, GST, vendor\n💼 Business & Tech: coding, web dev, AI, career guidance\n\nThoda aur specific batao — full detail ke saath jawab dunga! 😊";
  return `I received your question. 😊 Here's what I can help you with:\n\n🍽️ Food Haveli Topics:\n• Features, pricing, plans\n• CMS, QR code, WhatsApp alerts\n• AI menu builder, analytics, GST invoice\n• Vendor/reseller model, blockchain/ICP\n\n💼 General Topics:\n• Business strategies & growth\n• Coding & web development\n• AI & machine learning\n• Career guidance & tips\n• Productivity & time management\n\nCould you be a bit more specific about what you'd like to know? I'll give you a detailed, expert answer! 😊`;
}

// ─── Quick Reply Chips ─────────────────────────────────────────────────────────
const QUICK_EN = [
  "How to get started?",
  "Pricing plans",
  "Track my order",
  "AI Menu Builder",
  "GST & Invoice",
];
const QUICK_HI = [
  "कैसे शुरू करें?",
  "मूल्य योजनाएं",
  "ऑर्डर ट्रैक करें",
  "AI मेनू Builder",
  "GST और Invoice",
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
  const [lastDetectedLang, setLastDetectedLang] = useState<Lang>("english");
  const [forcedLang, setForcedLang] = useState<"english" | "hindi" | null>(
    null,
  );
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
        ? "नमस्ते! 🙏 मैं Haveli AI हूँ, Food Haveli का intelligent assistant। आज मैं आपकी किस तरह मदद कर सकता हूँ?"
        : "Hello! I'm Haveli AI, your intelligent assistant for Food Haveli. How can I help you today? 😊";
      const gLang: Lang = isHindi ? "hindi" : "english";
      if (isHindi) setLastDetectedLang("hindi");
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
  });

  const sendMessage = useCallback(
    async (text?: string) => {
      const msg = (text ?? input).trim();
      if (!msg) return;
      setInput("");
      const lang = detectLanguage(msg);
      setLastDetectedLang(lang);

      // Bad word check
      if (containsBadWord(msg)) {
        const censored = censorBadWords(msg);
        addMessage("user", censored);
        setIsTyping(true);
        await new Promise((r) => setTimeout(r, 400));
        setIsTyping(false);
        const warning =
          lang === "hindi" || lang === "hinglish"
            ? "⚠️ कृपया सम्मानजनक भाषा का उपयोग करें। मैं आपकी मदद करने के लिए यहाँ हूँ और सकारात्मक बातचीत में सबसे अच्छा काम करता हूँ। कृपया अपना सवाल विनम्रता से पूछें!"
            : "⚠️ Please use respectful language. I'm here to help you, and I work best in a positive conversation. Feel free to ask your question politely!";
        addMessage("assistant", warning, lang);
        return;
      }

      addMessage("user", msg);
      setIsTyping(true);
      await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
      setIsTyping(false);
      const responseLang: Lang = forcedLang ?? lang;
      const response = getHaveliResponse(msg, responseLang);
      addMessage("assistant", response, responseLang);
    },
    [input, addMessage, forcedLang],
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
      recognition.lang =
        forcedLang === "hindi" ||
        (forcedLang === null &&
          (lastDetectedLang === "hindi" || lastDetectedLang === "hinglish"))
          ? "hi-IN"
          : "en-IN";
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
  }, [isRecording, lastDetectedLang, forcedLang, addMessage]);

  // Speaker button
  const handleSpeak = useCallback(
    (msg: Message) => {
      if (speakingId === msg.id) {
        stopSpeaking();
        setSpeakingId(null);
      } else {
        setSpeakingId(msg.id);
        speak(msg.content, msg.lang ?? "english");
        const dur = Math.max(3000, msg.content.length * 70);
        setTimeout(
          () => setSpeakingId((prev) => (prev === msg.id ? null : prev)),
          dur,
        );
      }
    },
    [speakingId],
  );

  // Dynamic quick replies based on detected language
  const quickReplies =
    messages.length <= 1
      ? lastDetectedLang === "hindi" || lastDetectedLang === "hinglish"
        ? QUICK_HI
        : QUICK_EN
      : [];

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="haveli-btn"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            data-ocid="haveli.open_modal_button"
            className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-1 group"
            style={{ filter: "drop-shadow(0 0 18px oklch(0.78 0.19 85))" }}
          >
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
              Haveli AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="haveli-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            data-ocid="haveli.dialog"
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
                      Haveli AI
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.7 0.05 240)" }}
                    >
                      Smart Assistant
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
              <div className="flex items-center gap-2">
                {/* Language Toggle */}
                <div
                  className="flex items-center rounded-full p-0.5 gap-0.5"
                  style={{
                    background: "oklch(0.15 0.04 240)",
                    border: "1px solid oklch(0.3 0.05 240)",
                  }}
                >
                  {(["auto", "english", "hindi"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      data-ocid="haveli.toggle"
                      onClick={() =>
                        setForcedLang(lang === "auto" ? null : lang)
                      }
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-all"
                      style={
                        (lang === "auto" && forcedLang === null) ||
                        forcedLang === lang
                          ? {
                              background: "oklch(0.78 0.19 85)",
                              color: "oklch(0.1 0.02 240)",
                            }
                          : { color: "oklch(0.55 0.05 240)" }
                      }
                    >
                      {lang === "auto"
                        ? "AUTO"
                        : lang === "english"
                          ? "EN"
                          : "हिं"}
                    </button>
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  data-ocid="haveli.close_button"
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
                    setLastDetectedLang("english");
                  }}
                  data-ocid="haveli.cancel_button"
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
                    className={`max-w-[78%] group ${
                      msg.role === "user" ? "items-end" : "items-start"
                    } flex flex-col gap-0.5`}
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
                          data-ocid="haveli.toggle"
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
                      data-ocid="haveli.button"
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
                  placeholder="Ask Haveli AI anything..."
                  data-ocid="haveli.input"
                  className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 placeholder:text-sm"
                  style={{
                    color: "oklch(0.92 0.01 240)",
                  }}
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  data-ocid="haveli.toggle"
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
                  data-ocid="haveli.submit_button"
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
                Haveli AI · Powered by Food Haveli
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
