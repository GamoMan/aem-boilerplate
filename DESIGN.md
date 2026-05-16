---
name: bbl-design-system
description: Apply and verify Bangkok Bank (BBL) UI/UX design guidelines. Use this skill whenever you are creating new blocks, styling components, refactoring CSS, or checking if the UI adheres to the brand identity. Ensure all visual elements (colors, spacing, typography) strictly follow these tokens to maintain a professional and trustworthy financial services aesthetic.
---

# Bangkok Bank — UI/UX Design Guidelines

> **Foundation Design System** — Reference for developers building BBL Public Website.
> Source: Figma Foundation file · Last updated: May 2025

---

## 1. Color System

Apply the primary palette to create an energetic, friendly, and engaging expression. Use the signature blue combined with neutral black and white.

### 1.1 Primary Palette

| Name | Token | Hex |
|---|---|---|
| Active Blue | `color.primary.active` | `#0064FF` |
| Truthful Blue | `color.primary.truthful` | `#002850` |

### 1.2 Primary Shade Palette

Use these shades for UI elements like Tags and infographics. Apply in small percentages alongside secondary colors.

| Name | Token | Hex |
|---|---|---|
| Shade 01 (lightest) | `color.primary.shade.01` | `#A1C6FF` |
| Shade 02 | `color.primary.shade.02` | `#7DB0FF` |
| Shade 03 | `color.primary.shade.03` | `#4890FF` |
| Badge Blue | `color.primary.badge` | `#4890FF` |
| Shade 04 | `color.primary.shade.04` | `#0048B7` |
| Shade 05 | `color.primary.shade.05` | `#003382` |
| Shade 06 (darkest) | `color.primary.shade.06` | `#031D37` |

**Constraints:**
- **Use Tokens:** Always use `color.primary.badge` for badge and tag backgrounds; never use raw hex values.
- **Scope:** Reserve `color.primary.badge` for small interactive labels and status chips only.
- **Sizing:** Ensure badges size to their text content; do not stretch them to full width.

### 1.3 Secondary Palette

Apply secondary colors sparingly for infographics and diagrams to support the primary palette.

| Name | Token | Hex |
|---|---|---|
| S1 Shade | `color.secondary.s1.shade` | `#7D0032` |
| S1 (Red) | `color.secondary.s1` | `#EB144B` |
| S1 Tint | `color.secondary.s1.tint` | `#FFD7D2` |
| S2 Shade | `color.secondary.s2.shade` | `#004646` |
| S2 (Teal) | `color.secondary.s2` | `#3C7878` |
| S2 Tint | `color.secondary.s2.tint` | `#C8FFB9` |
| S3 Shade | `color.secondary.s3.shade` | `#583585` |
| S3 (Purple) | `color.secondary.s3` | `#9669D2` |
| S3 Tint | `color.secondary.s3.tint` | `#E1D2FF` |

### 1.4 Grayscale Palette

Use these neutral colors for backgrounds, text, and shapes to ensure consistency across light and dark modes.

| Name | Token | Hex |
|---|---|---|
| Black | `color.grey.black` | `#000000` |
| Grey 10 | `color.grey.10` | `#1E1E21` |
| Grey 15 | `color.grey.15` | `#28282D` |
| Grey 20 | `color.grey.20` | `#323238` |
| Grey 30 | `color.grey.30` | `#46464D` |
| Grey 40 | `color.grey.40` | `#5E5E66` |
| Grey 50 | `color.grey.50` | `#78787D` |
| Grey 60 | `color.grey.60` | `#939399` |
| Grey 80 | `color.grey.80` | `#C8C8CC` |
| Grey 90 | `color.grey.90` | `#E3E3E5` |
| Grey 96 | `color.grey.96` | `#F5F5F5` |
| White | `color.grey.white` | `#FFFFFF` |

### 1.5 Semantic Colours

Use semantic colors to convey specific meaning. Ensure legibility by placing black text over lighter background shades.

| Name | Token | Hex | Usage |
|---|---|---|---|
| System Green | `color.semantic.green` | `#2DCD73` | Success / positive result |
| System Red | `color.semantic.red` | `#FF0000` | Error / alert |
| System Yellow | `color.semantic.yellow` | `#FFEF5C` | Warning |

---

## 2. Typography

Use headings for page titles or subheadings to introduce content. Headings are sized to contrast with content, increase visual hierarchy, and help readers easily understand the structure of content.

### 2.1 Headings
Headings come in a range of sizes, for use in different contexts:
- **D1:** XXL and XL are suitable for brand and marketing content.
- **H2:** XL and L are suitable for page titles in products such as a form title.
- **H3:** M can be used in large components where space is not limited and perfectly balances with Body M, such as modals.
- **H4:** S and XS are for titles in small components where space is limited, such as flags.
- **H5:** XXS should be used sparingly and is suitable matched with Body S, for example, in fine print.

Maintain a base font size of **16px (1rem)**. Adhere to the separate line-height scales for **[EN]** and **[TH]** scripts to ensure optimal readability.

### 2.2 Implementation Rules
- **Brand Font:** Use **BBL Sans** exclusively. Do not substitute with system fonts.
- **Scale Usage:** Use S-M font scale for `xs` and `sm` breakpoints; use L-XL for `md`, `lg`, and `xl`.

---

## 3. Spacing

Always use the **8px-based** (`space.100`) token system. This ensures visual rhythm and alignment across all page components.

| Token | Pixels | Use for |
|---|---|---|
| space.000–space.100 | 0–8px | Gaps between icons/text, padding in badges, small component gutters. |
| space.150–space.300 | 12–24px | Container padding, vertical spacing in cards, component margins. |
| space.400–space.1000 | 32–80px | Section margins, large white space between content blocks. |

---

## 4. Corner Radius

Use alias tokens to maintain consistent geometry across the UI.

| Alias Token | Pixels | Usage |
|---|---|---|
| `rounded-sm` | 4px | Small tags and metadata labels. |
| `rounded-md` | 8px | Buttons, tags, logos, toast components. |
| `rounded` | 16px | Cards, popovers, headers, navigation drawers. |
| `rounded-full` | 50% / 9999px | Toggles, FABs, pill-style tabs. |

**Example: Token Usage in CSS**
```css
.button {
  border-radius: var(--rounded-md); /* Correct: use token */
}
```

---

## 5. Elevation & Shadow

Use elevation to communicate hierarchy and interaction states.

### 5.1 Shadow Levels

**Example 1: Raised State (Cards)**
```css
box-shadow:
  0px 4px 4px -1px rgba(0,0,0,0.10),
  0px 4px 8px -1px rgba(0,0,0,0.06);
```

**Example 2: Overlay State (Dropdowns/Modals)**
```css
box-shadow:
  0px 17px 20px -5px rgba(0,0,0,0.10),
  0px 15px 10px -5px rgba(0,0,0,0.04);
```

---

## 6. Layout & Grid

### 6.1 Equal-height Card Grids
Ensure multi-card rows align top and bottom edges. This improves scanability and visual balance.

**Example: Card Grid Implementation**
```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-300);
  align-items: stretch; /* Ensures cards fill height */
}

.card {
  display: grid;
  height: 100%;
  padding: var(--space-300);
  border-radius: var(--rounded);
}
```

---

## 7. Components — Standards

### 7.1 Buttons
Use buttons to drive primary actions. Follow the height and radius rules strictly.

| Size | Height | Border Radius | Usage |
|---|---|---|---|
| L | 52px | 8px (`rounded-md`) | Hero areas and major CTAs. |
| M | 44px | 8px (`rounded-md`) | General forms and body content. |

**Important:** Use `rounded-full` **only** for FAB and Toggle components. All standard buttons must use `rounded-md`.

### 7.2 Form Controls
- **States:** Highlight active/focus states with Blue (`#0064FF`) and errors with Red (`#FF0000`).
- **Checkboxes:** Use for multiple selections.
- **Radio Buttons:** Use for mutually exclusive options.

### 7.3 Tags & Badges
Use `color.primary.badge` and `rounded-full` for compact metadata.

**Example: Tag Implementation**
```css
.tag {
  background-color: var(--color-primary-badge);
  border-radius: var(--rounded-full);
  padding: 4px 7px;
  width: fit-content;
}
```

---

## 8. Brand Identity

The Bangkok Bank logo conveys security and growth. **Protect the brand** by following these constraints:
- **No Distortion:** Never stretch or recolor the symbol.
- **Clear Space:** Maintain a buffer equal to the symbol's height on all sides.
- **Accessibility:** Ensure the background provides sufficient contrast for the logotype.
