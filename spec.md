# Food Haveli — AI Upgrade + Feature Integration

## Current State
- Haveli AI chatbot exists (AIChatbot.tsx, 1073 lines) with rule-based responses, language detection, EN/HI toggle buttons, voice input/output, bad word filter
- CMS Panel has menu management (manual add/edit) but NO actual AI menu generation that creates items
- NO QR code generation in CMS — QR scanner exists but only for scanning
- WhatsApp alert is described in landing page flow but NOT triggered on order placement
- Analytics Dashboard exists in Dashboard.tsx but needs verification
- Language selector is EN/HI text buttons inside the chat

## Requested Changes (Diff)

### Add
- AI Menu Generator in CMS: button to describe restaurant type → auto-populate menu items (mock AI, generates realistic North Indian / South Indian / Chinese / etc menus)
- QR Code Generator in CMS: generates a downloadable QR code image for the restaurant menu URL using a QR library or Google Charts API
- WhatsApp Alert: when customer places order in CustomerOrderPage, open WhatsApp with pre-filled order message to owner's number
- Language selector as a clear toggle (dropdown or pill switcher) at the top of the chat window — not just inside toolbar
- Enhanced Haveli AI: much larger knowledge base, conversational memory (last 5 messages for context), human-like natural responses for general topics (tech, coding, business, education, general knowledge), responses formatted with bullet points/line breaks for readability

### Modify
- AIChatbot.tsx: upgrade response engine to handle general knowledge questions more naturally (cooking tips, business advice, coding help, general Q&A) alongside Food Haveli specific queries. Add context from last 3-5 messages. Make language selector more visible at top of chat.
- CMSPanel.tsx: add AI Menu Generator tab action and QR Code section under menu tab
- CustomerOrderPage.tsx: after order confirmation, trigger WhatsApp link to owner with order details

### Remove
- Nothing removed

## Implementation Plan
1. Upgrade AIChatbot.tsx: expand knowledge base for general topics, add conversational context (last 5 messages passed to response function), make language selector prominent at chat header, improve response naturalness
2. Add AI Menu Generator to CMSPanel.tsx: button in Menu Manager tab, prompt input, generate realistic menu items based on cuisine type
3. Add QR Code Generator to CMSPanel.tsx: generate QR using Google Charts API (https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=URL), show preview, download button
4. Add WhatsApp alert to CustomerOrderPage.tsx: after order placed, create WhatsApp link with formatted order details and open it
5. Verify Dashboard.tsx analytics show correctly
