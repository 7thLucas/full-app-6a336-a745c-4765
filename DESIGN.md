# Cafessistant — Design Guidelines

## Visual Identity
Warm, journal-like aesthetic that feels personal and travel-forward. Evokes a well-worn notebook carried across cities, not a corporate app or a cold utility.

## Color Palette
- **Primary**: Deep espresso brown `#2C1A0E` — anchors the brand, used for key UI chrome
- **Accent**: Warm amber/caramel `#C97C3A` — highlights ratings, CTAs, active states
- **Background**: Soft cream/off-white `#F5F0E8` — warm page feel
- **Surface**: Light parchment `#EDE6D6` — cards, input fields
- **Text primary**: Dark charcoal `#1C1C1C`
- **Text secondary**: Muted warm gray `#7A6F65`
- **Success/high-rating**: Muted sage green `#6A8C69`
- **Star rating**: Golden amber `#E8A838`

## Typography
- **Headings**: Serif (e.g. Playfair Display or similar) — journal/editorial feel
- **Body & UI**: Clean sans-serif (e.g. Inter or DM Sans) — readable and modern
- **Tasting notes / journal text**: Slightly larger line-height for readability

## Elevation & Depth
- Cards use soft shadows with warm tint, no harsh black drops
- Bottom sheets / modals slide up from bottom (mobile-first)
- Subtle texture overlays on backgrounds to evoke paper/craft

## Key Components

### Visit Log Card
- Coffee shop name prominent (serif heading)
- Star rating with golden amber stars
- City + date in muted secondary text
- Tasting notes snippet as body text
- Optional photo as a left-side thumbnail or top hero

### Quick Log CTA
- Prominent floating action button (FAB) — espresso brown with amber icon
- Bottom-sheet form slides up: 5 large tap targets for star rating at the top, name field, location, notes
- Minimal fields visible by default; expandable for more detail
- "Log it" submit — warm amber filled button

### City History Browser
- City as section header (serif, large)
- Visits listed chronologically under each city
- "Return visitor" badge/chip when city has been visited before
- Map pin icon accent per city entry

### Recommendation Cards
- Two-track layout: "Your favourites here" (personal) vs "New to discover" (community)
- Personal track: uses star rating and visit date to rank
- Community track: displays aggregate rating and a "Not visited yet" label
- Warm card backgrounds with subtle left-border accent in amber

## Motion & Interaction
- Form fields animate in sequentially on quick log sheet (staggered fade-up)
- Star tap triggers a small burst/pulse animation
- City sections collapse/expand smoothly
- Page transitions: gentle horizontal slide (left/right navigation feel)

## Mobile-First Constraints
- All primary actions reachable with one thumb
- FAB always visible on main feed/history screens
- Bottom sheet for logging — never full-page navigation for quick capture
- Tap targets minimum 44px

## Tone in UI Copy
- Warm, first-person: "Your visits", "Places you've loved", "Discover something new"
- Encouraging on empty states: "Start your coffee atlas — log your first visit"
- Smart but humble on recommendations: "Based on what you've loved here before"
