---
name: Opus Search & Concert Discovery
colors:
  surface: '#f9f9fd'
  surface-dim: '#d9dade'
  surface-bright: '#f9f9fd'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f7'
  surface-container: '#ededf2'
  surface-container-high: '#e8e8ec'
  surface-container-highest: '#e2e2e6'
  on-surface: '#1a1c1f'
  on-surface-variant: '#44474c'
  inverse-surface: '#2f3034'
  inverse-on-surface: '#f0f0f4'
  outline: '#75777c'
  outline-variant: '#c5c6cc'
  surface-tint: '#565f6d'
  primary: '#050e1a'
  on-primary: '#ffffff'
  primary-container: '#1b2430'
  on-primary-container: '#828b9a'
  inverse-primary: '#bec7d7'
  secondary: '#7c5818'
  on-secondary: '#ffffff'
  secondary-container: '#fecc82'
  on-secondary-container: '#795516'
  tertiary: '#270005'
  on-tertiary: '#ffffff'
  tertiary-container: '#480d16'
  on-tertiary-container: '#c87277'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae3f4'
  primary-fixed-dim: '#bec7d7'
  on-primary-fixed: '#131c28'
  on-primary-fixed-variant: '#3e4755'
  secondary-fixed: '#ffddaf'
  secondary-fixed-dim: '#efbe76'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#ffdada'
  tertiary-fixed-dim: '#ffb3b6'
  on-tertiary-fixed: '#3d050e'
  on-tertiary-fixed-variant: '#753137'
  background: '#f9f9fd'
  on-background: '#1a1c1f'
  surface-variant: '#e2e2e6'
typography:
  display-hero:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Playfair Display
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  program-title:
    fontFamily: Playfair Display
    fontSize: 17px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
This design system defines a specialized, high-culture concert discovery platform tailored around musical repertoire and program curations. Inspired by archival concert programs, physical playbills, and the acoustic intimacy of premier concert halls, the interface rejects modern clutter, algorithmic noise, and social media bloat. 

The aesthetic is grounded in **Editorial Minimalism**:
- **Personality:** Authoritative, contemplative, pristine, and historically reverent without feeling archaic.
- **Atmosphere:** An inviting, warm archival background evoking premium uncoated cotton stock, paired with deep concert hall charcoal and burnished antique brass accents.
- **Experience:** Purpose-built, quiet utility. Every interaction prioritizes clarity of musical programming—composer, movement, soloist, and orchestra—presented with typographic distinction and calm negative space.

## Colors
The palette balances an intellectual concert hall atmosphere with timeless archival restraint.

### Palette Roles
- **Base Canvas (`#F9F8F5`):** Uncoated warm parchment tone that eases ocular fatigue and honors traditional printed music programs.
- **Surface Elevation (`#FFFFFF`):** Pure white reserved for active search inputs, card surfaces, and modal overlays to cleanly isolate concert data.
- **Primary Charcoal (`#1B2430`):** Deep midnight charcoal with an imperceptible navy undertone used for primary text, structural dividers, and high-emphasis labels.
- **Secondary Brass / Antique Gold (`#9B7332`):** Warm burnished gold for active program matches, movement highlights, composer tags, and primary focus anchors.
- **Tertiary Burgundy (`#5C1D24`):** Restrained concert hall velvet red used sparingly for status indicators such as sold-out ("매진") or closing dates.
- **Neutral Subdued (`#6E727A`):** Cool slate-grey for secondary metadata (running times, seat pricing labels, age limits).
- **Subtle Surface Line (`#E7E4DC`):** Hairline border tone delivering razor-sharp structural delineation without heavy visual weight.

## Typography
Typographic scale in this design system creates an immediate editorial cadence. High-contrast transitional serif **Playfair Display** commands titles, composers, and movement headings with poise. The crisp, neutral sans-serif **Hanken Grotesk** serves the dense factual metadata (dates, seat tiers, running times, and search queries) to preserve legibility at smaller sizes.

### Application Rules
- **Composer & Repertoire:** Render piece titles (e.g., *Mahler Symphony No. 5 in C-sharp minor*) in `program-title` or `headline-md` using standard serif styling with composer names tagged or prefixed in `label-caps`.
- **Concert Titles:** Use `headline-lg` for card titles and hero discovery details.
- **Metadata Fields:** Venue, schedules, ticket tiers, age limits, and running times must strictly utilize `body-md` and `body-sm` with `label-caps` for field descriptors.

## Layout & Spacing
The layout follows a central, search-first fixed-width grid model, celebrating vast horizontal and vertical margins that emulate the white spaces of formal printing.

### Grid System & Widths
- **Maximum Width:** 1280px container centered on desktop displays.
- **Search Command Row:** 840px constrained width, prioritizing instant input of composers (e.g., "Chopin"), works ("Nocturne"), venues, or conductors.
- **Results Layout:** 12-column grid. Full-width concert cards or 2-column alternating program-first cards with 24px gutters.
- **Breakpoints:**
  - **Desktop (1024px+):** 12 columns, 24px gutters (`gutter`), 32px canvas margins (`margin`).
  - **Tablet (768px – 1023px):** 8 columns, 20px gutters, 24px canvas margins.
  - **Mobile (<768px):** 4 columns, 16px gutters, 16px canvas margins. Multi-column repertoire breakdowns fold into sequential stacked blocks.

## Elevation & Depth
In alignment with pure editorial minimalism, depth is achieved through **low-contrast ghost outlines and crisp tonal contrast** rather than heavy drop shadows.

### Elevation Hierarchy
- **Level 0 (Canvas Base):** Uncoated tone `#F9F8F5`. No shadow, no border.
- **Level 1 (Card & Content Blocks):** White background `#FFFFFF` bordered by a 1px solid hairline (`#E7E4DC`). Optional ambient lift on hover: `0 4px 20px -4px rgba(27, 36, 48, 0.06)`.
- **Level 2 (Search Filter Dropdowns & Repertoire Flyouts):** Solid `#FFFFFF` elevated with a refined editorial shadow: `0 8px 30px -6px rgba(27, 36, 48, 0.08)`, bounded by a 1px `#E7E4DC` perimeter border.
- **Level 3 (Image & Poster Zoom Modals):** Backdrop blur `4px` tinted with `#1B2430` at 40% opacity, floating the target detail sheet with high isolation.

## Shapes
Geometry is disciplined and architectural. Corners feature micro-softened radiuses (`roundedness: 1` / 4px) to retain the crisp corners of classic paper tickets and concert programs without appearing harsh or unfinished.

### Geometry Rules
- **Cards & Posters:** `0.25rem` (4px) corner radius.
- **Search Inputs:** `0.25rem` (4px) to preserve architectural stability.
- **Badges & Status Indicators:** `0.25rem` (4px) rectangular shields; pill shapes are explicitly forbidden to prevent an informal or casual application feel.

## Components

### 1. Global Program Search Bar
- **Anatomy:** Prominent centered input field, minimum height 56px, background `#FFFFFF`, border 1px solid `#E7E4DC`.
- **States:** Focus replaces border with 1.5px solid `#9B7332` accompanied by a soft 2px `#9B733215` inner outline.
- **Placeholder:** Styled in `body-lg` using `#6E727A`: *"Search by composer, piece (e.g. Rachmaninoff No. 2), artist, or venue..."*
- **Quick Filters:** Sub-row chips for quick filtering: `All`, `Piano`, `Symphony`, `Chamber`, `Opera`.

### 2. Concert Discovery Card
- **Structure:** Two-column split layout within each card.
  - **Left (240px width desktop):** Aspect ratio 1:1.414 (standard paper ratio) for Poster URL display. Includes the status tag anchored at the top-left corner.
  - **Right (Remaining width):** Structured concert metadata grid.
- **Header:** Concert Title in `headline-md`, followed by Venue and Dates in `body-md` slate.
- **Repertoire Block (Core Differentiator):** Dedicated tinted container (`#F9F8F5`) listing pieces line-by-line:
  - Composer name in `label-caps` (`#9B7332`).
  - Musical work and movement in `program-title` (`#1B2430`).
- **Metadata Footer:** Compact tabular strip displaying Running Time, Age Limit, and Seat Pricing Tiers (e.g., `R석 120,000원 | S석 90,000원 | A석 60,000원`).

### 3. Status Badges
- **예매중 (Booking Open):** Subdued brass wash (`#9B733215`), text `#9B7332`, 1px solid `#9B733240`.
- **매진 (Sold Out):** Burgundy wash (`#5C1D2412`), text `#5C1D24`, 1px solid `#5C1D2430`.
- **공연예정 (Upcoming):** Charcoal wash (`#1B24300D`), text `#1B2430`, 1px solid `#1B243020`.
- **Style:** All badges use `label-caps` (11px uppercase/tracked), 4px padding-y, 8px padding-x, 4px corner radius.

### 4. Interactive Elements & Buttons
- **Primary Action (예매처 이동 / Ticket Link):** Solid deep charcoal `#1B2430`, typography `label-md` in white `#FFFFFF`. Hover transitions to `#2C3847`.
- **Secondary Action (프로그램 상세 / Program Details):** 1px solid `#1B2430` outline, transparent background, text `#1B2430`. Hover fills `#1B24300A`.
- **Tags & Filter Chips:** Hairline border `#E7E4DC`, text `#1B2430`, active state swaps border and text to `#9B7332`.