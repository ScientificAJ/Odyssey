# Odyssey V1 — UI Design Specification

> **UI direction:** A sunlit, magical beach expedition expressed through a clear, accessible mobile interface.
>
> **Platform context:** Mobile UI for iOS and Android.
>
> **Document scope:** Visual language, layout, components, motion, responsive behavior, accessibility presentation, and interface states.

---

## 1. Scope and Source of Truth

This document defines **how Odyssey looks and feels**. It does not decide what the product does.

Product requirements—including features, workflows, navigation destinations, business rules, data definitions, permissions, priorities, and release scope—come from [`PRODUCT_SPEC.md`](./PRODUCT_SPEC.md). When this document uses a screen, action, metric, or piece of copy as an example, treat it as a UI example rather than a product requirement.

Technical architecture, local storage, libraries, build tooling, and engineering gates come from [`TECHNICAL_STACK.md`](./TECHNICAL_STACK.md).

If the product specification and this document conflict:

1. Follow the product specification for behavior and scope.
2. Follow this document for visual and interaction treatment.
3. Adapt the UI pattern without inventing new product behavior.

---

## 2. Visual Concept: “The Sunlit Odyssey”

Odyssey should feel like one continuous beach world rather than a collection of unrelated screens.

The visual vocabulary includes:

- warm sand and light aqua skies;
- islands, shells, waves, sunlight, and a distant sailboat;
- collectible, miniature 3D objects;
- frosted sea-glass surfaces;
- coconut palms as the signature environmental motif;
- postcard-like treatment for user-created imagery where the product calls for it.

These elements are presentation metaphors only. They must not introduce, rename, or imply product mechanics that are absent from the product specification.

### Signature composition

The primary scenic surface opens on a light aqua sky and warm sand foreground. Two stylized coconut palms frame opposite edges. A small sailboat or island may sit near the horizon. Content appears on clean, buoyant cards in the stable foreground.

The scene must remain useful:

- Decorative elements never cover text or controls.
- Environmental media is non-interactive unless the product specification explicitly says otherwise.
- Text and cards remain visually stable while the environment moves.
- A static illustration must preserve the composition when motion, video, or 3D is unavailable.

---

## 3. UI Principles

### 3.1 Wonder with restraint

Use one memorable visual moment per surface. Keep the interface calm; place delight in materials, depth, transitions, and meaningful state changes.

### 3.2 Content before scenery

The interface must remain clear without its environmental layer. Scenery frames content and communicates atmosphere; it never carries essential information.

### 3.3 Familiar controls, distinctive finish

Use recognizable mobile controls and interaction patterns. Express the Odyssey identity through color, shape, illustration, motion, and microcopy—not through unfamiliar control behavior.

### 3.4 Bright does not mean low-contrast

Use bright beach colors for backgrounds, objects, and accents. Use deep ocean blue for readable text and critical outlines.

### 3.5 Calm negative states

Warnings, incomplete states, and recovery surfaces should feel noticeable without becoming hostile. Reserve danger red for destructive actions and critical errors.

### 3.6 Every effect needs a fallback

3D, blur, video, particles, sound, and haptics must degrade gracefully for reduced-motion preferences, battery saver, low-memory devices, and accessibility needs.

### 3.7 UI does not invent policy

Controls reflect behavior defined elsewhere. Do not add requirements, validation rules, scoring systems, automatic actions, or permissions merely because a mockup contains space for them.

---

## 4. Visual Identity

### 4.1 Style name

**Tropical Solar Archipelago**

The intended blend is a premium travel editorial, a miniature animated island diorama, and an elegant productivity interface.

### 4.2 Visual character

- Sunlit, optimistic, and airy.
- Rounded without becoming childish.
- Tactile materials: glazed ceramic, frosted sea glass, polished shells, and soft sand.
- Minimal information density with environmental storytelling.
- Avoid pirate clichés, tiki-bar aesthetics, cartoon treasure maps, and generic neon gaming UI.
- Keep dark or alternate themes visually compatible if the product specification requires them.

### 4.3 Color system

| Token           |       Hex | UI use                                  |
| --------------- | --------: | --------------------------------------- |
| `canvas.sky`    | `#EAFBFF` | Primary background                      |
| `canvas.foam`   | `#FFFDF4` | Cards and quiet surfaces                |
| `canvas.sand`   | `#FFF0C7` | Warm sections and selected states       |
| `ocean.aqua`    | `#62E5E0` | Primary brand accent                    |
| `ocean.blue`    | `#3EC6F3` | Links and water accents                 |
| `sun.yellow`    | `#FFD95A` | Highlights and positive emphasis        |
| `coral.main`    | `#FF7A7A` | Primary actions and energetic emphasis  |
| `mango.main`    | `#FFAA4C` | Warnings and warm accents               |
| `lime.main`     | `#B8ED72` | Successful states                       |
| `lavender.main` | `#BBA7FF` | Reflective or secondary accents         |
| `pink.shell`    | `#FFB7D5` | Image frames and warm accents           |
| `ink.ocean`     | `#073B4C` | Primary text                            |
| `ink.muted`     | `#4C7180` | Secondary text                          |
| `line.water`    | `#BDECF1` | Dividers and quiet borders              |
| `state.warning` | `#E98939` | Attention states                        |
| `state.danger`  | `#C94C5E` | Destructive actions and critical errors |

#### Gradient recipes

- **Morning Sky:** `#EAFBFF → #FFF6D8`
- **Lagoon:** `#62E5E0 → #3EC6F3`
- **Sun:** `#FFD95A → #FFAA4C`
- **Coral Glow:** `#FFB7D5 → #FF7A7A`
- **Rare Shell:** `#BBA7FF → #62E5E0`

Do not place white text on yellow, sand, lime, or pale aqua. Use Ocean Ink.

### 4.4 Typography

Use two families only.

- **Display:** Fraunces SemiBold—expressive and slightly storybook.
- **Interface:** Manrope—clean, friendly, and highly readable.

| Style   | Font     | Size / line | Weight | UI use                            |
| ------- | -------- | ----------: | -----: | --------------------------------- |
| Hero    | Fraunces |     44 / 48 |    600 | Major visual statements           |
| Display | Fraunces |     34 / 40 |    600 | Prominent surface statements      |
| H1      | Manrope  |     28 / 34 |    750 | Screen titles                     |
| H2      | Manrope  |     22 / 28 |    700 | Section titles                    |
| H3      | Manrope  |     18 / 24 |    700 | Card titles                       |
| Body    | Manrope  |     16 / 24 |    500 | Standard content                  |
| Small   | Manrope  |     14 / 20 |    550 | Metadata                          |
| Label   | Manrope  |     12 / 16 |    700 | Short labels, uppercase sparingly |
| Metric  | Fraunces |     28 / 30 |    600 | Prominent numeric values          |

Never use ultra-thin weights over video, imagery, or gradients.

### 4.5 Shape language

- Primary cards: 24 px radius.
- Compact cards: 18 px radius.
- Buttons: 18 px radius.
- Pills: filters, tags, and compact actions only.
- Bottom sheets: 32 px top corners.
- Compact tiles: 16 px radius.
- Illustrated objects: rounded, slightly exaggerated proportions; no sharp realism.

### 4.6 Spacing

Use a 4 px base grid.

| Token      | Value | Typical use               |
| ---------- | ----: | ------------------------- |
| `space.1`  |  4 px | Icon or inline adjustment |
| `space.2`  |  8 px | Tight grouping            |
| `space.3`  | 12 px | Related content           |
| `space.4`  | 16 px | Standard internal spacing |
| `space.5`  | 20 px | Phone page gutter         |
| `space.6`  | 24 px | Card and section rhythm   |
| `space.8`  | 32 px | Major section separation  |
| `space.10` | 40 px | Hero composition spacing  |

Prefer spacing over divider lines. Use dividers only when grouping would otherwise be ambiguous.

### 4.7 Depth and material

Use three depth levels:

1. **Sea surface:** border plus slight tint; no shadow.
2. **Floating card:** soft aqua shadow with 12–20 px blur.
3. **Hero object:** stronger colored shadow plus subtle parallax.

Avoid stacking blur on blur. Where blur performs poorly, use a solid translucent surface with the same contrast and hierarchy.

### 4.8 Iconography

- Use rounded line icons at 2 px optical weight.
- Pair one system icon family with a small custom Odyssey set.
- Selected icons may become filled ceramic miniatures rather than changing color alone.
- Do not mix multiple unrelated icon libraries.
- Decorative icon variants must preserve the original control’s meaning.

### 4.9 Imagery and 3D art direction

Objects should look like miniature collectible sculptures photographed in bright, diffused sunlight.

- Low-poly geometry with smooth bevels.
- Soft clay or ceramic materials.
- Minimal texture maps; color and form carry the style.
- Slightly oversized leaves and shells for recognizable silhouettes.
- Soft blue-gray shadows, never muddy black.
- Consistent light direction and camera perspective across assets.

---

## 5. Environmental UI Layer

### 5.1 Layer order

From back to front:

1. Sky gradient.
2. Optional atmospheric media such as subtle clouds or moving water.
3. Distant horizon objects.
4. Coconut palms framing the viewport.
5. Sparse ambient particles.
6. Stable interface cards, controls, and navigation.

### 5.2 Coconut palm direction

- The left palm enters from the bottom-left and leans inward.
- The right palm appears more distant and enters from the right edge.
- Animation cycles differ enough to avoid synchronized movement.
- Leaf movement: 2–4 degrees.
- Trunk movement: under 1.5 degrees.
- Scroll parallax: maximum 10 px.
- Palms disappear or recede when they compete with forms, keyboards, or dense content.

### 5.3 Time adaptation

Keep the canvas bright at all hours:

- Morning: pale cyan and warm gold.
- Afternoon: clear aqua and coral accents.
- Evening: peach, lavender, and light sky blue.

Time-based styling is optional and must not alter component contrast or imply product state.

### 5.4 Environmental state changes

If the product specification calls for the environment to respond to state, use small visual changes such as light, water movement, distant-object position, or added scenery. Never let environmental changes become the sole indication of state.

---

## 6. Motion and Feedback

### 6.1 Motion personality

The interface moves like water and wind: smooth acceleration, soft settling, and occasional energetic impact.

### 6.2 Motion tokens

| Token       |    Duration | Curve                    | UI use                     |
| ----------- | ----------: | ------------------------ | -------------------------- |
| `instant`   |      100 ms | ease-out                 | Press feedback             |
| `quick`     |      180 ms | ease-out                 | Toggle, chip, small state  |
| `flow`      |      320 ms | cubic-bezier(.2,.8,.2,1) | Card and sheet transitions |
| `float`     |      520 ms | spring, low bounce       | Hero objects and rewards   |
| `cinematic` | 900–1400 ms | custom sequence          | Rare major transitions     |
| `ambient`   |      6–12 s | ease-in-out loop         | Palms, boat, water, clouds |

### 6.3 Interaction treatment

- **Card press:** dip 2 px and tilt less than 1 degree before opening.
- **Selection:** flow a tinted highlight beneath the selected item.
- **Successful action:** use a short wave trace, count-up, glow, or object movement appropriate to the surface.
- **Image accepted:** add a pearlescent frame before placing the image into its destination.
- **Drag:** lift the item one depth level and show a clear insertion target.
- **Error:** use a concise shake or border emphasis once; do not loop.

These treatments decorate actions defined by the product. They do not define when an action is allowed or what it changes.

### 6.4 Haptics and sound

Where the product supports feedback:

- Light haptic: selection and successful toggles.
- Medium haptic: meaningful completion.
- Heavy haptic: rare major moments only.
- Never vibrate for routine navigation or passive negative states.
- Sound remains optional, brief, and paired with a visual equivalent.

### 6.5 Reduced motion

- Replace camera moves with crossfades.
- Freeze atmospheric video on a representative frame.
- Stop palm sway and particles.
- Replace particle travel with a count-up under 300 ms.
- Preserve state clarity independently of animation.

---

## 7. Layout and Navigation Presentation

The product specification owns destinations, hierarchy, and flows. This section defines how approved structures should be presented.

### 7.1 Screen composition

- Keep the title and primary context visible before dense content.
- Place the primary action within comfortable thumb reach when platform conventions allow.
- Reveal the next content item partially when it helps communicate scrollability.
- Use scenic height flexibly; reduce decoration before compressing content.
- Preserve native safe areas and keyboard behavior.

### 7.2 Bottom navigation

When the product calls for bottom navigation, present it as a floating frosted sea-glass dock.

- Use clear labels alongside icons.
- Make the selected state identifiable by fill, weight, and shape—not color alone.
- Keep contextual actions visually distinct from destinations.
- Do not add, remove, or merge destinations in this document.

### 7.3 Full screens, sheets, and dialogs

- Use full screens for focused, multi-step, or content-heavy work when specified by the product flow.
- Use bottom sheets for brief, reversible actions.
- Reserve dialogs for destructive confirmation, permission explanation, and short interruptions.
- Back gestures and platform-standard dismissal must work unless the product explicitly requires a blocking state.

### 7.4 Dense and temporal layouts

- Use clear grouping, consistent alignment, and sticky context where needed.
- Keep labels readable at a glance; do not rely on color intensity alone.
- During drag or rescheduling interactions, show both the original and proposed position clearly.
- Provide visible alternatives for every gesture-only action.

---

## 8. Component System

### 8.1 Buttons

#### Primary — Coral Sun

- Coral fill.
- Ocean Ink label.
- 52 px height.
- 18 px radius.
- Optional restrained highlight on press.

#### Secondary — Sea Glass

- Foam background with aqua border.
- Ocean Ink label.
- Match primary dimensions when paired.

#### Quiet

- Text plus icon.
- No container until pressed or focused.

#### Destructive

- Use danger color only in a destructive context.
- Label the consequence directly rather than using generic confirmation copy.

### 8.2 Cards

- Minimum horizontal padding: 18 px.
- Minimum vertical padding: 16 px.
- Use no more than two button styles in one card.
- Whole-card press is appropriate only when there is one obvious destination.
- Keep metadata visually subordinate to the title and primary state.

### 8.3 Chips and segmented controls

- Minimum height: 36–40 px.
- Selected state uses tint, border, icon, and weight—not color alone.
- Keep labels visible unless the icon is universally understood and accessible text is present.
- Do not horizontally scroll a segmented control whose options must be compared at once.

### 8.4 Inputs

- Labels remain visible after entry.
- Help and error text appear directly beneath the relevant field.
- Focus uses a 2 px Ocean Blue or Aqua outline with sufficient contrast.
- Preserve entered values after validation errors.
- Optional adornments must not reduce the text tap target.

### 8.5 Progress indicators

Choose a visual that matches the meaning supplied by the product:

- circular sun ring for bounded progress;
- layered horizontal tide bar for comparative or remaining progress;
- route position for ordered journey progress;
- shell trail for short, finite setup progress.

Do not reuse one metaphor for unrelated values. Always pair meaningful graphics with a numeric or textual equivalent.

### 8.6 Toasts

- Appear above bottom navigation or the safe area.
- Remain visible for 3–5 seconds unless accessibility settings require longer.
- Support at most one action.
- State the result in plain language.

### 8.7 Bottom sheets

- Show a visible drag handle when the sheet can be dragged.
- Keep the title fixed when long content scrolls.
- Use snap points only when they improve the task.
- Avoid accidental collapse during form entry.
- Preserve native focus order and keyboard clearance.

### 8.8 Dialogs

- Use a direct title and a short consequence statement.
- Put the safe and destructive actions in predictable platform order.
- Do not use scenery, particles, or playful motion in critical confirmations.

### 8.9 Images and private content

When the product displays user imagery:

- Use a stable aspect ratio and lightweight placeholder to prevent layout shift.
- Keep sensitive thumbnails out of decorative backgrounds.
- Use neutral placeholders until media is available.
- Make private or pending states visually explicit when those states exist in the product.
- Do not imply verification, analysis, remote upload, or privacy guarantees through UI copy unless the product implements them.

---

## 9. Interface States

These are visual treatments for states defined by the product, not requirements to create those states.

### 9.1 Loading

- Use skeleton cards with a gentle water-like highlight.
- Avoid a full-screen spinner for routine loading.
- Load core controls before decorative 3D or video.
- Show a poster illustration immediately when scenic media is delayed.

### 9.2 Empty

- Use open space and one restrained environmental object.
- Explain what is absent in plain language.
- Present a single next action only when the product defines one.
- Do not make emptiness look like an error.

### 9.3 Success

- Confirm the completed action immediately.
- Use lime, sun, or aqua accents with Ocean Ink text.
- Keep celebratory motion short and skippable when repeated frequently.

### 9.4 Warning

- Use mango or amber accents.
- Pair the color with an icon and explicit label.
- Explain the situation before presenting options.

### 9.5 Error

- Preserve the user’s visible work whenever the product can recover it.
- Use direct language and place recovery actions near the error.
- Reserve full-page errors for cases where the entire surface is unavailable.
- Avoid blame, alarmist illustration, and repeated shaking motion.

### 9.6 Local save or recovery

Odyssey V1 has no remote sync state. When a local write or proof-file operation is still running, distinguish it from both success and failure with a clock or progress indicator and a plain-language label. Do not use a cloud or upload icon. Show success only after the local operation is durable; preserve the user's visible work when recovery is possible.

---

## 10. Content Style in the UI

- Keep interface copy energetic, kind, and concise.
- Use adventure language in expressive headings only when it matches the product’s approved terminology.
- Use plain verbs for controls.
- Avoid guilt-driven language.
- Avoid forced pirate speech.
- Do not rename product entities in this document; display the terms defined by the product specification.
- Never use copy to imply functionality, automation, privacy, security, or intelligence the product does not provide.

---

## 11. Accessibility

Target WCAG 2.2 AA behavior and follow native platform accessibility conventions.

### 11.1 Visual

- Minimum 4.5:1 contrast for normal text.
- Minimum 3:1 contrast for large text and meaningful graphics.
- Minimum 44 × 44 pt touch targets.
- Support system font scaling to at least 200% without hiding essential controls.
- Do not encode status only through color, animation, shape, or position.
- Place solid surfaces behind text over imagery or video.
- Keep focus indicators visible for external keyboard use.

### 11.2 Screen readers

- Give every actionable element a concise name, role, state, and value where applicable.
- Announce dynamic state changes without stealing focus unnecessarily.
- Hide decorative palms, particles, waves, and reward objects from the accessibility tree.
- Combine fragmented visual labels into one useful announcement when they describe a single control.

### 11.3 Motor and cognitive accessibility

- No required drag-only or swipe-only interaction.
- Every gesture has a visible alternative.
- Forms preserve progress.
- Timed visuals do not remove access to content.
- Consequences are explained in plain language before destructive actions.

### 11.4 Media

- Environmental media contains no essential information.
- Respect reduced motion and operating-system battery or data preferences.
- Pair sound and haptic feedback with visible state changes.

---

## 12. Responsive Layout

### 12.1 Phone

- Base design width: 390 pt.
- Horizontal page padding: 20 pt.
- Below 360 pt, reduce decorative scene height before reducing text size.
- Keep primary controls clear of safe areas and the keyboard.

### 12.2 Large phone

- Expand environmental space and gutters slightly.
- Keep readable card width under 560 pt.

### 12.3 Tablet

- Use a centered content column or a two-column layout when the approved product surface benefits from simultaneous context and detail.
- Keep reading widths controlled.
- Do not stretch phone cards edge to edge.
- Preserve the same hierarchy and action order as the phone layout.

### 12.4 Orientation

- Prefer portrait composition on phones.
- Support landscape for forms and utility surfaces if the product supports rotation.
- Recompose scenery instead of cropping controls or essential content.

---

## 13. UI Implementation Guidance

This guidance is implementation-agnostic and does not prescribe product architecture.

- Centralize semantic tokens for color, typography, spacing, radius, depth, and motion.
- Components consume tokens such as `surface.card`, `text.primary`, and `motion.flow` rather than raw values.
- Render text and controls in the native UI layer above decorative media.
- Use one shared environmental scene per visible surface; do not place independent 3D contexts inside list items.
- Provide poster-frame or static fallbacks for all video and 3D treatments.
- Generate appropriately sized image thumbnails to avoid rendering full-resolution media in lists.
- Unload nonessential decorative assets under memory pressure.
- Test on low-end and mid-range devices, not only simulators or flagship hardware.

### Suggested token groups

```text
theme/
  colors
  typography
  spacing
  radii
  motion
  shadows
  breakpoints
```

This is a token organization example, not a required project structure.

---

## 14. UI Performance Targets

- Core content and controls render before decorative media.
- Normal scrolling and navigation target 60 FPS on the agreed test-device range.
- Avoid layout shift while fonts, imagery, video, or 3D assets load.
- Keep only one active WebGL scene on a surface.
- Pause ambient media when obscured or when the app backgrounds.
- Offer static presentation under reduced-motion, battery-saver, or constrained-device conditions.
- Treat any asset-size budget as an engineering decision confirmed outside this document.

---

## 15. UI Quality Checklist

### Visual system

- The sunlit beach identity is recognizable without overpowering content.
- Typography, lighting, materials, icon style, and camera perspective are consistent.
- Text contrast meets accessibility targets in every state.
- Decorative assets do not cause layout shift or obscure controls.

### Interaction

- Controls follow familiar mobile behavior.
- Motion clarifies hierarchy and state change.
- Repeated actions do not force long animations.
- Gesture interactions have visible alternatives.
- Focus, pressed, selected, disabled, loading, and error states are designed.

### Responsive behavior

- Content remains usable at compact widths and 200% text scaling.
- Safe areas and keyboards do not cover actions.
- Tablet layouts use space intentionally rather than stretching phone UI.
- The static fallback remains visually coherent.

### Accessibility

- Contrast and touch-target requirements pass.
- Reading and focus order match the visual hierarchy.
- Decorative media is hidden from assistive technology.
- State is never communicated by color or motion alone.

### Product boundary

- Every displayed action and state maps to an approved product requirement.
- UI examples have not become unreviewed feature requirements.
- Copy does not promise behavior the product does not implement.
- This document contains no release priorities, data models, business logic, or product acceptance criteria.

---

## 16. UI Anti-Patterns

- Autoplay video behind every surface.
- Text placed directly over moving water or detailed imagery.
- 3D scenes inside scrolling list items.
- Decorative metaphors that obscure the real meaning of a control.
- Punishing or shaming visual states.
- Fake intelligence, verification, privacy, or sync language.
- Confetti for routine actions.
- Too many gradients without hierarchy.
- Dark neon gamer panels that break the sunlit concept.
- Pirate fonts or novelty type in controls.
- Visuals that dictate new features, rules, metrics, or workflows.

---

## 17. UI Definition of Done

The UI is ready when:

1. Approved product flows are represented without adding or changing product behavior.
2. Content hierarchy and primary actions are immediately clear.
3. Every component includes its relevant interaction and system states.
4. The interface remains usable with decorative video, sound, motion, and 3D disabled.
5. Contrast, touch targets, screen-reader presentation, focus order, and enlarged text have been verified.
6. Phone and supported tablet layouts are coherent and stable.
7. Loading media causes no meaningful layout shift.
8. The visual system is expressed through shared semantic tokens.
9. Motion and environmental effects stay within performance targets on the agreed device range.
10. Product owners can change features or flows without treating this UI document as the source of product requirements.

The final UI test is simple: remove the scenery and the interface must remain clear and dependable. Restore it, and Odyssey should feel unmistakably its own.
