# XR Portfolio Hero Section — Design Document

## 1. Purpose & Goals

- Create a high-impact hero section that immediately communicates **XR systems thinking**, **interaction design maturity**, and **technical restraint**.
- Avoid chaotic physics demos; emphasize controlled, intentional spatial design.
- Serve as a visual and experiential thesis for the portfolio.

---

## 2. Experience Overview

### 2.1 Desktop Experience (Primary)

- Static, calm composition on initial load.
- Physics and interaction activate only after explicit user input.
- XR devices act as _mode selectors_, not toys.

### 2.2 Mobile Experience (Fallback)

- Guided, animation-driven interaction model.
- No real-time physics simulation.
- Touch- and motion-native interactions only.

---

## 3. Initial Static State (All Platforms)

### 3.1 Composition & Layout

- Central focus: extruded 3D name, horizontally centered.
- Text occupies **60–65% of total viewport width**.
- Text sits slightly forward in Z-depth relative to surrounding objects.

### 3.2 Typography (3D-Compatible)

- Font style: clean, geometric sans-serif suitable for extrusion.
- References: Inter, Space Grotesk, SF Pro–style proportions. Use troika-three
- Characteristics:
  - Uniform stroke width
  - Rounded corners / softened edges
  - High legibility from oblique angles
- Extrusion depth: **8–12% of letter height**.

### 3.3 XR Headset Models (Static Placement)

#### Devices

- Meta Quest 3
- Apple Vision Pro
- Pico 4

#### Spatial Arrangement

- Devices arranged in a **shallow arc** around the text.
- Vision Pro: left side, slightly below text centerline.
- Quest 3: slightly above and behind the center of the name.
- Pico 4: right side, symmetric to Vision Pro.

#### Scale Ratios

- Each headset scaled to **25–30% of total name width**.
- Text remains visually dominant at all times.

---

## 4. Environment & Background

### 4.1 Background

- Solid or very subtle gradient.
- Color: near-black, deep graphite, or dark neutral gray.
- No visible textures or noise.

### 4.2 Spatial Framing

- No visible bounding box or sandbox walls.
- Scene feels like a floating XR lab or showroom.

---

## 5. Lighting Design

### 5.1 Global Lighting Setup

- Studio-style lighting, minimal and intentional.

#### Key Light

- Direction: upper front-left.
- Intensity: strong enough to define form and text extrusion.

#### Fill Light

- Direction: opposite side of key.
- Intensity: soft, just enough to avoid crushed blacks.

#### Rim Lights

- Thin rim light behind each major object (text + headsets).
- Purpose: silhouette separation from dark background.

### 5.2 Material Response

- Lighting tuned for matte and semi-matte materials.
- No harsh specular highlights.

---

## 6. Color Scheme

### 6.1 Text

- Off-white or very light gray.
- No pure white to avoid glare.

### 6.2 Headsets

- Muted grayscale variants:

  - Quest 3: neutral cool gray
  - Vision Pro: soft silver / warm gray
  - Pico 4: darker neutral gray

### 6.3 Accents

- Minimal to none in static state.
- Any accent color reserved for interaction states.

---

## 7. Interaction Activation (Desktop Only)

### 7.1 Dormant State

- Physics engine not ticking.
- All objects effectively static or kinematic.

### 7.2 Activation Trigger

- First click or drag within hero section.
- Subtle visual cue indicating activation (fade, micro-settle).

---

## 8. Core Interaction Concepts (Desktop)

### 8.1 Name as Physical Interface

- Name treated as a single constrained rigid body.
- Letters connected via spring joints.
- Rotation-only constraints (yaw + pitch).

### 8.2 Headsets as Mode Selectors

- Clicking a headset changes the _interaction personality_ of the scene.
- Only one headset active at a time.

---

## 9. Mobile Fallback Design

### 9.1 Interaction Model

- No continuous physics simulation.
- Tap-based mode cycling between XR devices.

### 9.2 Visual Behavior

- One headset visible at a time.
- Smooth camera and lighting transitions per device.

### 9.3 Motion & Parallax

- Device-tilt parallax where supported.
- Touch-move parallax as fallback.

---

## 10. Performance & Constraints

- Minimal draw calls.
- Low object count.
- Physics lazy-loaded and disabled by default.
- Mobile-first performance budgeting.

---

## 11. Design Principles Reinforced

- Intentionality over spectacle.
- XR devices as tools, not props.
- Physics as feedback, not chaos.
- Clear hierarchy: text > devices > environment.
