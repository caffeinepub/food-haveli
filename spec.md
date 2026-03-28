# Food Haveli — 3-Panel Role Differentiation

## Current State
All panels (landing, menu, dashboard, admin, cms, order, invoice) exist as pages but there is no clear role-based separation. The navbar shows everything to everyone. No login gates differentiate who sees what. Data generated in CMS is not clearly reflected in the customer menu in a visible way for judges.

## Requested Changes (Diff)

### Add
- **Role selection screen / login portal** — when user clicks Login, show 3 distinct role cards:
  1. **Platform Owner** (Super Admin) — Abhay Vishwakarma, CEO & CTO — enters with a special owner PIN/password
  2. **Restaurant Owner** (CMS Manager) — restaurant person logs in to manage their restaurant
  3. **Customer** — no login needed, goes straight to menu/order
- **Owner Panel (Super Admin)** — completely distinct UI, purple/indigo color scheme, shows:
  - Platform-wide stats (total restaurants, total orders, total revenue across all)
  - All registered restaurants list with status
  - Vendor onboarding management
  - Pricing plan management
  - Contact form submissions / inquiries
  - Platform settings
  - Role badge: "Platform Owner" in purple
- **Restaurant Panel** — gold/amber color scheme, shows:
  - Restaurant's own menu management (add/edit/delete items — data saved to shared CMSContext)
  - Their orders (live feed)
  - Their analytics dashboard
  - QR code + WhatsApp settings
  - AI menu generator
  - Role badge: "Restaurant Manager" in gold
- **Customer UI** — clean red/orange consumer interface, shows:
  - Menu page with all items from CMSContext (items added by restaurant are instantly visible here)
  - Cart, order placement, invoice
  - Order tracking
  - Role badge: "Customer" in green on order pages
- **Shared data visibility** — when restaurant manager adds/edits menu items, those items IMMEDIATELY appear on the Customer menu page (via shared CMSContext state). A visible banner/badge shows "Live" or "Synced" to make this clear for judges.
- **Panel switcher in navbar** — after login, show role badge + "Switch Panel" option
- **Demo mode notice** — small banner at top of each panel saying which role is active (e.g., "Viewing as: Platform Owner")

### Modify
- Navbar: show role-specific navigation links based on active role
- Login page: replace current login modal with the 3-role portal
- CMSPanel: wrap inside Restaurant Panel shell with gold theme
- AdminPanel: wrap inside Owner Panel shell with purple theme
- CustomerOrderPage + MenuPage: wrap in Customer UI shell with clean consumer design
- CMSContext: ensure menu items added in restaurant panel are read by customer menu page

### Remove
- Remove generic "Login" that doesn't differentiate roles

## Implementation Plan
1. Create `AuthContext.tsx` — manages active role state: `null | 'owner' | 'restaurant' | 'customer'`
2. Create `RoleLoginPage.tsx` — 3 big role cards with distinct colors and role descriptions; owner uses PIN "OWNER123", restaurant uses "REST123", customer goes straight through
3. Update `App.tsx` — route based on role; show role-specific pages
4. Create `OwnerPanel.tsx` — super admin shell wrapping AdminPanel content with purple theme, platform-wide stats, vendor list, inquiries tab
5. Wrap CMSPanel in `RestaurantPanel.tsx` shell — gold theme, restaurant-specific nav
6. Wrap MenuPage + CustomerOrderPage in `CustomerShell.tsx` — clean consumer UI, shows live menu from CMSContext
7. Add "Live Sync" indicator — when menu item is added in RestaurantPanel, customer menu shows a green "Updated" flash
8. Role badge in navbar — colored pill showing current role
9. Demo access codes shown on login page for judges: Owner PIN, Restaurant PIN, Customer (no login)
