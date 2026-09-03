# Portfolio visual system

This portfolio uses the same product-grade visual grammar as SonicMap while
keeping its existing black, graphite, white, and cyan identity. Interfaces feel
technical, atmospheric, restrained, and deliberately layered.

## Principles

- Typography leads. Display headings are large, tightly tracked, and serif-led;
  interface copy stays in a clean grotesque sans; labels use uppercase mono.
- Cyan is punctuation, not decoration. Use it for rules, active states, indexes,
  links, and primary actions. Avoid large cyan glows and gradients.
- Surfaces use layered near-black panels, subtle inset highlights, 10–16px
  radii, fine neutral borders, and restrained depth.
- Every major section sits on the same vertical rhythm and continuous backdrop.
- Motion should reveal hierarchy. Favor short fades and small translations over
  scaling, bouncing, or persistent decorative movement.

## Tokens

- Canvas: `#070a0a`
- Panel: `#0d1213`
- Raised panel: `#111718`
- Ink: `#edf6f6`
- Muted ink: `#9aa9a9`
- Hairline: `rgba(226, 250, 250, .11)`
- Accent: `#22d3ee`
- Display face: Fraunces
- UI face: Inter
- Technical face: JetBrains Mono

## Component rules

- Section headings use the display face and a fluid 2.8–5.25rem scale.
- Cards share the same border, background, corner radius, and hover lift.
- Buttons are compact, slightly rounded rectangles. Primary buttons invert to
  cyan; secondary buttons remain dark with a hairline border.
- Inputs use dark solid surfaces and hairline borders, with cyan focus rings.
- Images are treated as editorial plates: clipped, minimally rounded, and
  separated from text by a rule or clear spacing.
- Decorative backgrounds stay behind the shared grid and below 18% opacity.

## Accessibility

- Preserve visible keyboard focus with a 2px cyan outline.
- Do not communicate state through color alone.
- Respect `prefers-reduced-motion` and disable nonessential animation.
- Body copy should remain at least 16px with comfortable line height.
