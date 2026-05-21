---
name: bbl-design-system
description: Apply and verify Bangkok Bank (BBL) UI/UX design guidelines. Use this skill whenever you are creating new blocks, styling components, refactoring CSS, or checking if the UI adheres to the brand identity. Ensure all visual elements (colors, spacing, typography) strictly follow these tokens to maintain a professional and trustworthy financial services aesthetic.
---

# Bangkok Bank — UI/UX Design Guidelines

This skill provides comprehensive design tokens and rules for building the BBL Public Website, ensuring consistency with the Foundation Design System.

## 1. Color System

### 1.1 Primary & Shades
| Name | Token | Hex |
|---|---|---|
| Active Blue | `color.primary.active` | `#0064FF` |
| Truthful Blue | `color.primary.truthful` | `#002850` |
| Shade 01 | `color.primary.shade.01` | `#A1C6FF` |
| Shade 02 | `color.primary.shade.02` | `#7DB0FF` |
| Shade 03 | `color.primary.shade.03` | `#4890FF` |
| Badge Blue | `color.primary.badge` | `#4890FF` |
| Shade 04 | `color.primary.shade.04` | `#0048B7` |
| Shade 05 | `color.primary.shade.05` | `#003382` |
| Shade 06 | `color.primary.shade.06` | `#031D37` |

### 1.2 Grayscale & Semantic
| Name | Token | Hex |
|---|---|---|
| Black | `color.grey.black` | `#000000` |
| Grey 10-96 | `color.grey.{10-96}` | (See DESIGN.md for values) |
| White | `color.grey.white` | `#FFFFFF` |
| System Green | `color.semantic.green` | `#2DCD73` |
| System Red | `color.semantic.red` | `#FF0000` |
| System Yellow | `color.semantic.yellow` | `#FFEF5C` |

## 2. Typography System

**Brand Font:** BBL Sans (English/Thai), BBL Sans Looped (Thai body)

### 2.1 Mobile Typography (Base: 14px/16px)
| Style | Token | Font Size | Line Height [EN] | Line Height [TH] |
|---|---|---|---|---|
| D1 | `font.heading.xxlarge` | 3.3 rem / 46 px | 1.15 em | 1.25 em |
| H1 | `font.heading.xlarge` | 2.2 rem / 31 px | 1.15 em | 1.25 em |
| H2 | `font.heading.large` | 1.9 rem / 26 px | 1.15 em | 1.25 em |
| H3 | `font.heading.medium` | 1.6 rem / 22 px | 1.35 em | 1.35 em |
| B1 | `font.body` | 1 rem / 14 px | 1.35 em | 1.35 em |
| B2 | `font.body.small` | 0.9 rem / 12 px | 1.35 em | 1.35 em |

### 2.2 Desktop Typography (Base: 16px)
(See `references/typography.md` for full mobile/desktop scales)

| Style | Token | Font Size | Line Height [EN] | Line Height [TH] |
|---|---|---|---|---|
| D1 | `font.heading.xxlarge` | 5.6 rem / 90 px | 1.15 em | 1.25 em |
| H1 | `font.heading.xlarge` | 4.4 rem / 70 px | 1.15 em | 1.25 em |
| H2 | `font.heading.large` | 3.9 rem / 62 px | 1.15 em | 1.25 em |
| H3 | `font.heading.medium` | 3 rem / 48 px | 1.15 em | 1.25 em |
| H4 | `font.heading.small` | 2 rem / 32 px | 1.15 em | 1.25 em |
| B1 | `font.body` | 1 rem / 16 px | 1.35 em | 1.35 em |

## 3. Spacing & Geometry

- **Spacing:** 8px-based (`space.100` = 8px).
- **Corner Radius:** `rounded-sm` (4px), `rounded-md` (8px), `rounded` (16px), `rounded-full` (50%/9999px).

## 4. Implementation Rules

- **Mobile First:** Declare styles mobile first, use `min-width` media queries for desktop.
- **Tokens ONLY:** Use CSS variables for all design tokens (e.g., `var(--color-primary-active)`).
- **Accessibility:** Ensure WCAG 2.1 AA compliance, especially contrast on blue backgrounds.
