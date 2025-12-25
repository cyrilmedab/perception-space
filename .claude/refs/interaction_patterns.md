# Perception Space — Interaction Patterns Reference

## Overview

This document defines the specific interaction behaviors for both the Landing and XR experiences. Use this as a reference when implementing interactive elements.

---

## Landing Experience Interactions

### 1. Scroll Navigation

**Behavior:**
- Scroll (wheel/touch) moves camera along a predefined path
- Damping factor: 0.1 (smooth deceleration)
- Camera looks at content as it passes

**Implementation:**
```tsx
<ScrollControls pages={4} damping={0.1}>
  <CameraRig />
</ScrollControls>
```

**States:**
- `scrolling` — User actively scrolling
- `settled` — Scroll momentum exhausted, camera at rest

---

### 2. Project Card Hover

**Trigger:** Mouse enters card bounds / touch begins on card

**Visual Response:**
- Scale: 1.0 → 1.05 (ease-out, 200ms)
- Emission: 0 → 0.1 (subtle glow)
- Cursor: default → pointer

**Exit:**
- Reverse animation (ease-in, 150ms)

**Code Pattern:**
```tsx
const [hovered, setHovered] = useState(false)

<mesh
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
>
  <meshStandardMaterial 
    emissiveIntensity={hovered ? 0.1 : 0}
  />
</mesh>
```

---

### 3. Project Card Selection

**Trigger:** Click / tap on project card

**Visual Response:**
1. Card scales up: 1.05 → 1.2 (spring animation)
2. Other cards fade: opacity 1.0 → 0.3
3. Detail panel animates in from card position
4. Background dims slightly

**Content Revealed:**
- Problem statement
- Solution summary
- Technical highlights (bullet list)
- Links (GitHub, DevPost, Live)
- Awards if applicable

**Deselection:**
- Click outside card area
- Press Escape
- Click close button on detail panel

**Animation Timing:**
- Expand: 300ms spring (stiffness: 200, damping: 20)
- Collapse: 200ms ease-in

---

### 4. Playful Object (Physics Teaser)

**Object:** A single geometric shape (cube or sphere) in a constrained area

**Interactions:**

#### Grab (Desktop)
- Trigger: mousedown on object
- Behavior: Object follows cursor with slight lag (lerp factor 0.2)
- Cursor: grabbing

#### Grab (Mobile)
- Trigger: touchstart on object
- Behavior: Object follows touch point with slight lag
- Visual: Object slightly scales up (1.1x) while held

#### Release
- Trigger: mouseup / touchend
- Behavior: 
  - Calculate velocity from last N frames of movement
  - Apply velocity to object
  - Object falls with gravity, bounces off ground
  - Damping settles object after 2-3 bounces

**Physics Parameters:**
```typescript
{
  mass: 1,
  linearDamping: 0.5,
  angularDamping: 0.5,
  restitution: 0.6,  // Bounciness
  friction: 0.3
}
```

**Bounds:**
- Object constrained to a box region
- If thrown outside, gentle force returns it to play area

---

## XR Experience Interactions

### 5. Locomotion

**Method:** Teleport or continuous movement (user preference)

**Teleport:**
- Trigger: Controller thumbstick press + release
- Visual: Arc line shows landing point
- Valid targets: Floor plane only
- Transition: Fade to black (100ms), move, fade in (100ms)

**Continuous:**
- Trigger: Controller thumbstick tilt
- Speed: 2 m/s walking, 4 m/s with grip held
- Collision: Stops at boundaries

---

### 6. Project Anchor Hover (XR)

**Trigger:** 
- Gaze lingers on anchor > 500ms
- Controller ray intersects anchor
- Hand approaches within 0.5m

**Visual Response:**
- Anchor pulses gently (scale 1.0 → 1.02, looping)
- Info label fades in above anchor
- Subtle audio cue (optional)

**Exit:**
- Gaze/ray/hand leaves anchor area
- Pulse stops, label fades out

---

### 7. Project Anchor Selection (XR)

**Trigger:**
- Controller trigger press while hovering
- Hand pinch gesture while hovering
- Gaze dwell > 2s (accessibility fallback)

**Visual Response:**
1. Anchor expands into detail panel
2. Panel orients to face user
3. Other anchors recede (scale down, desaturate)
4. User can step closer to read

**Panel Layout:**
- Title + subtitle at top
- Problem/Solution as readable text blocks
- Technical highlights as spatial list
- Links as interactive buttons

**Deselection:**
- Step back > 2m from panel
- Press B/Y button
- Select different anchor

---

### 8. Grabbable Objects (XR)

**Trigger:**
- Hand enters object bounds + pinch
- Controller intersects object + grip button

**Grab Behavior:**
- Object attaches to hand/controller
- Maintains relative offset from grab point
- Has mass: doesn't follow 1:1, has inertia

**While Held:**
- Object can collide with environment
- Haptic feedback on collision (if supported)

**Release:**
- Open hand / release grip
- Object inherits hand velocity
- Falls with gravity, collides with environment

**Object Profiles:**
| Type | Mass | Drag | Bounce | Feel |
|------|------|------|--------|------|
| Light | 0.5 | 0.5 | 0.7 | Responsive, bouncy |
| Medium | 2.0 | 1.0 | 0.4 | Substantial, settles |
| Heavy | 5.0 | 2.0 | 0.2 | Weighty, thunky |

---

### 9. UI Button Press (XR)

**Trigger:**
- Controller ray + trigger
- Hand poke (index finger intersects button)

**Visual Response:**
- Button depresses 0.02m into surface
- Color shifts to "active" state
- Spring back on release

**Audio:**
- Soft click on press
- Softer click on release

**Haptic:**
- Short pulse on press (0.1s, 0.5 intensity)

---

## Transition Animations

### Landing → XR Entry

1. User clicks "Enter XR Experience"
2. Overlay fades in (500ms)
3. WebXR session requested
4. On session start: overlay fades out in headset
5. User sees XR environment

### Project Card Expand (Landing)

```
t=0ms:    Card hover state active
t=0ms:    Click detected
t=0-150ms: Scale 1.05 → 1.15 (overshoot)
t=150-300ms: Scale 1.15 → 1.2 (settle)
t=100-400ms: Detail content fades in (stagger: title, problem, solution, tech, links)
t=200-400ms: Background dims
```

### Project Anchor Expand (XR)

```
t=0ms:    Selection trigger
t=0-200ms: Anchor geometry morphs to panel shape
t=100-300ms: Panel rotates to face user
t=200-500ms: Content fades in (staggered)
t=300-400ms: Other anchors recede
```

---

## Easing Functions Reference

| Name | Use Case | CSS/GSAP Equivalent |
|------|----------|---------------------|
| Ease Out | Hover enter, expand | `ease-out` / `power2.out` |
| Ease In | Hover exit, collapse | `ease-in` / `power2.in` |
| Spring | Selections, bounces | Custom spring physics |
| Linear | Progress indicators | `linear` |

**Spring Config (R3F):**
```typescript
// Snappy
{ tension: 300, friction: 20 }

// Gentle
{ tension: 120, friction: 14 }

// Bouncy
{ tension: 200, friction: 10 }
```

---

## Accessibility Considerations

- All interactive elements must have visible focus states
- Minimum touch target: 44x44px equivalent in 3D space
- Gaze dwell as fallback for all selections
- Motion can be reduced via `prefers-reduced-motion` query
- Text contrast: minimum 4.5:1 against background

