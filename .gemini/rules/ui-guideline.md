# FRONTEND UI & DESIGN COMPLIANCE RULES

Whenever the user asks to generate, modify, or design UI components, pages, or features:

1. **MANDATORY REFERENCE:**
   - Must check and strictly follow `STYLE_GUIDE.md` for colors, sizing, fonts, and component structures.
   - Must check `SYSTEM_DESIGN.md` for architecture and microservice service layer integration.

2. **📱 STRICT RESPONSIVENESS MANDATE (BẮT BUỘC RESPONSIVE 100%):**
   - All layouts, pages, and components must adapt seamlessly to Mobile (360px+), Tablet (768px+), and Desktop (1024px+ / 1440px+).
   - Sidebars MUST be collapsible on mobile with a Drawer overlay and Hamburger menu toggle.
   - Tables must be wrapped in `overflow-x-auto` to prevent horizontal breaking.
   - Grid layouts must use progressive breakpoints: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` or `grid-cols-2 md:grid-cols-3 lg:grid-cols-6`.
   - Never allow unintended horizontal scrolling on the page level.

3. **COLOR PALETTE (MODERN PLATFORM TONE):**
   - Primary: `#4F46E5` (Modern Indigo)
   - Accent / CTA: `#FF5722` (Sunset Coral)
   - Background: `#F8FAFC` (Soft Slate) & `#FFFFFF` (Pure White)
   - Trust/Perks: `#10B981` (Emerald Mint)
   - Rating: `#FBBF24` (Warm Amber)

4. **ROLES & FOLDERS:**
   - `app/(shop)/`: Storefront for customers.
   - `app/(seller)/`: Seller Center for shop owners (`/seller`).

5. **LIBRARY WHITELIST:**
   - Icon: `lucide-react`
   - Table: `@tanstack/react-table`
   - Charts: `recharts`
   - UI: `radix-ui` / `shadcn/ui`
   - Slider: `embla-carousel-react`
   - Toast: `sonner`
   - Animation: `framer-motion`
   - Form: `react-hook-form` + `zod`
