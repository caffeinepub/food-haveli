# Food Haveli — JARVIS AI Chatbot

## Current State
The existing chatbot is a rule-based assistant with basic Hindi/English language toggle and preset quick-reply buttons. It does not auto-detect language, does not have true conversational AI, and voice output is not functional on tap/click.

## Requested Changes (Diff)

### Add
- JARVIS identity: rename chatbot to JARVIS with futuristic UI branding
- Auto language detection: detect if user typed Hindi/English/Hinglish and respond accordingly
- Intelligent multi-topic response engine: general knowledge, technical support, education, business advice, coding help, Food Haveli guidance, productivity, career, troubleshooting
- Voice OUTPUT: when user taps a speak/play button on any JARVIS response, it reads it aloud using Web Speech API SpeechSynthesis (Hindi voice for Hindi text, English voice for English text)
- Voice INPUT: microphone button uses Web Speech API SpeechRecognition, auto-detects language, sends recognized text to chat
- Hinglish support: detect mixed language and respond naturally in Hinglish
- Greeting on open: "Hello! I'm JARVIS, your AI assistant. How can I help you today?" or Hindi equivalent based on browser language
- Smart Food Haveli context: JARVIS knows everything about Food Haveli (features, pricing, how to use, owner journey, customer journey, etc.)
- Step-by-step problem solving responses for complex queries
- Follow-up question prompts for ambiguous queries

### Modify
- Replace existing chatbot component entirely with new JARVIS chatbot
- Floating button: JARVIS branding, futuristic glow effect
- Chat window: dark glassmorphism style, JARVIS header with animated pulse indicator
- Messages: each JARVIS response has a small speaker icon to trigger TTS playback
- Language: remove manual EN/HI toggle — now fully automatic via detection

### Remove
- Manual language toggle buttons (EN/HI)
- Old rule-based limited responses

## Implementation Plan
1. Build a comprehensive JARVIS response engine in TypeScript covering all topic categories with Hindi/English/Hinglish variants
2. Implement auto language detection (check for Devanagari Unicode range for Hindi, mixed = Hinglish)
3. Integrate Web Speech API SpeechRecognition for voice input with language auto-detect
4. Integrate Web Speech API SpeechSynthesis for voice output — speaker icon on each bot message
5. JARVIS Food Haveli knowledge base: embed all key facts about features, pricing, owner/customer journeys
6. Redesign chatbot UI: JARVIS branding, futuristic dark theme, animated typing indicator, smooth message transitions
7. Greeting logic: show welcome message when chat opens
