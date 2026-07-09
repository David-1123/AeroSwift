---
name: Executive Transit
colors:
  surface: '#fef9f0'
  surface-dim: '#ded9d1'
  surface-bright: '#fef9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3ea'
  surface-container: '#f2ede4'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e7e2d9'
  on-surface: '#1d1c16'
  on-surface-variant: '#45474c'
  inverse-surface: '#32302b'
  inverse-on-surface: '#f5f0e7'
  outline: '#76777c'
  outline-variant: '#c6c6cc'
  surface-tint: '#585e6c'
  primary: '#030813'
  on-primary: '#ffffff'
  primary-container: '#1a202c'
  on-primary-container: '#828796'
  inverse-primary: '#c1c6d7'
  secondary: '#745a2d'
  on-secondary: '#ffffff'
  secondary-container: '#ffdaa1'
  on-secondary-container: '#795e30'
  tertiary: '#0e0700'
  on-tertiary: '#ffffff'
  tertiary-container: '#291e0d'
  on-tertiary-container: '#96856d'
  error: '#C53030'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde2f3'
  primary-fixed-dim: '#c1c6d7'
  on-primary-fixed: '#161c27'
  on-primary-fixed-variant: '#414754'
  secondary-fixed: '#ffdeab'
  secondary-fixed-dim: '#e4c18a'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5a4317'
  tertiary-fixed: '#f5dfc4'
  tertiary-fixed-dim: '#d8c3a9'
  on-tertiary-fixed: '#241a09'
  on-tertiary-fixed-variant: '#524531'
  background: '#fef9f0'
  on-background: '#1d1c16'
  surface-variant: '#e7e2d9'
  surface-white: '#FFFFFF'
  status-pending: '#E2E8F0'
  status-assigned: '#BD9D69'
  status-en-route: '#2D3748'
  success: '#2F855A'
  warning: '#B7791F'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  data-tabular:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  table-cell-padding: 12px 16px
---

## Brand & Style

The design system is engineered for a high-fidelity airport ride management application, prioritizing a sense of punctuality, reliability, and executive service. The aesthetic is **Corporate / Modern** with a lean toward **Minimalism**, using a high-contrast palette of deep charcoals and refined golds to evoke a premium lounge experience.

The target audience includes logistics coordinators, executive chauffeurs, and frequent business travelers who require clarity and precision. The visual language avoids decorative clutter, focusing instead on information density, structural hierarchy, and a calm, trustworthy interface that remains functional under the pressure of real-time transit management.

## Colors

The color palette is built on a foundation of "Onyx" (#1A202C) for primary actions and deep contrast, and "Champagne Gold" (#BD9D69) for highlights and executive accents. 

- **Primary:** Used for high-emphasis buttons, headers, and active navigation states.
- **Secondary:** Used for interactive accents, premium badges, and focus indicators.
- **Neutral:** A warm "Bone" white (#F8F3EA) serves as the primary background color, reducing eye strain compared to pure white while maintaining a sophisticated feel.
- **Semantic Colors:** Integrated for transit-specific status logic. "Pending" uses a neutral slate, "Assigned" utilizes the secondary brand gold, and "Driver on the Way" moves to a high-contrast dark tone to signal immediate action/importance.

## Typography

This design system employs a pairing of **Playfair Display** for editorial headlines and **Inter** for all functional, data-heavy, and UI-centric text.

- **Headlines:** Use Playfair Display to inject a sense of luxury and establishment. These should be used sparingly for page titles and section headers.
- **Body & Data:** Inter is used for its exceptional legibility at small sizes. For administrative tables, the `data-tabular` style utilizes tabular numerals to ensure columns of flight numbers and timestamps align perfectly.
- **Labels:** Small caps or bolded Inter labels provide clear categorization for ride details without overwhelming the visual hierarchy.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model for desktop administrative views to ensure data density remains manageable, switching to a fluid single-column model for mobile.

- **Administrative Tables:** Designed with a 12-column structure. High-priority data (Passenger Name, Flight #) spans 2-3 columns, while status badges and timestamps occupy single columns.
- **Rhythm:** A strict 8px base unit governs all padding and margins. 
- **Density:** The design system supports a "Comfortable" density for driver-facing apps and a "Compact" density for administrative dashboards to maximize information visibility without scrolling.

## Elevation & Depth

Visual hierarchy is achieved primarily through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Surface Tiers:** The main background is the Bone neutral (#F8F3EA). Cards and data containers use Surface White (#FFFFFF) to lift them slightly off the page.
- **Borders:** Administrative tables use 1px solid borders in a lightened version of the primary color (approx 10% opacity) to define cells without creating visual noise.
- **Active States:** Subtle, crisp shadows (e.g., 4px blur, 10% opacity Onyx) are reserved exclusively for "floating" elements like dropdown menus or active ride-detail modals.

## Shapes

The shape language is **Soft (0.25rem)**, reflecting a professional and structured environment. 

- **Buttons & Inputs:** Use the base `rounded` (4px) setting to maintain a precise, architectural feel.
- **Badges:** Status badges use a slightly higher roundedness (rounded-lg) to distinguish them from interactive buttons.
- **Cards:** Use `rounded-lg` (8px) for container grouping, providing a clear but subtle distinction between different ride modules.

## Components

### Buttons
- **Primary:** Onyx background, White text. 4px border-radius. High-contrast.
- **Secondary:** Gold background, Onyx text. Used for "Book New Ride" or "Upgrade."
- **Ghost:** Onyx outline, no fill. Used for secondary administrative actions like "Export CSV."

### Status Badges
- **Pending:** Grey background with dark grey text.
- **Assigned:** Gold background with dark charcoal text.
- **En Route:** Onyx background with White text (highest urgency).
- All badges use `label-sm` typography and a pill-like shape.

### Input Fields
- **Default:** White background with a 1px border.
- **Validation:** Clear 2px left-border accent in `success` (Green) or `error` (Red). Error states include a `body-sm` helper text directly below the field.
- **Focus:** 1px Gold border with a 2px soft Gold outer glow.

### Administrative Tables
- **Header:** Sticky headers with Onyx background and Gold `label-md` text.
- **Rows:** Alternating "Bone" and "White" backgrounds (zebra striping) for readability in data-heavy views.
- **Actions:** Inline icon buttons for "Edit" or "Reassign" appear on hover.

### Ride Cards
- Summary of trip details using `headline-md` for the destination and `data-tabular` for the pickup time. Includes a prominent color-coded status badge in the top-right corner.