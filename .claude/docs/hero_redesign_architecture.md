# XR Portfolio Hero Section — Architecture & Component Breakdown

## 1. Architectural Goals

- Keep the hero **modular, readable, and iteration-friendly**.
- Separate **visual composition**, **interaction state**, and **physics** concerns.
- Allow easy toggling between dormant (static) and active (physics-enabled) modes.

---

## 2. High-Level Component Tree (Desktop)

```
<HeroSection>
  <Canvas>
    <SceneRoot>
      <LightingRig />
      <CameraRig />
      <Environment />
      <TextSystem />
      <XRDeviceSystem />
    </SceneRoot>
  </Canvas>
</HeroSection>
```

---

## 3. Core Systems

### 3.1 SceneRoot

- Owns global state:

  - `isActivated` (boolean)
  - `activeDeviceMode` (enum: Quest | VisionPro | Pico)

- Responsible for:

  - Enabling/disabling physics stepping
  - Coordinating cross-system transitions

---

## 4. Text System (Critical)

### 4.1 Component Structure

```
<TextSystem>
  <TextRootRigidBody>
    <CombinedTextMesh />        // dormant state
    <LetterGroup />             // active state
  </TextRootRigidBody>
</TextSystem>
```

### 4.2 Text Geometry Generation

- Use a **3D-compatible font (TTF/OTF)**.
- Generate geometry via:

  - `troika-three-text` (preferred for r3f)

- Parameters:

  - Extrusion depth: 8–12% of letter height
  - Bevel: subtle, uniform
  - Curve segments kept low for performance

### 4.3 Dormant State

- Render **CombinedTextMesh** only.
- Single mesh, no per-letter rigid bodies.
- Parent rigid body set to kinematic or disabled.

### 4.4 Active State

- Hide CombinedTextMesh.
- Generate per-letter meshes programmatically.
- Each letter:

  - Child of TextRootRigidBody
  - Optional lightweight rigid body or spring offset

- Root rigid body:

  - Rotation-only constraints (yaw + pitch)
  - High angular damping

---

## 5. XR Device System

### 5.1 Component Structure

```
<XRDeviceSystem>
  <XRDevice type="VisionPro" />
  <XRDevice type="Quest" />
  <XRDevice type="Pico" />
</XRDeviceSystem>
```

### 5.2 Responsibilities

- Load low-poly headset models lazily.
- Maintain static transforms in dormant state.
- Act as **mode selectors** on interaction.

### 5.3 Scaling & Positioning

- Each device scaled to ~25–30% of text width.
- Positioned in shallow arc relative to text root.

---

## 6. Interaction State Flow

### 6.1 Dormant Mode

- Physics engine paused.
- All rigid bodies disabled or kinematic.
- Pointer interactions limited to activation trigger.

### 6.2 Activation

- First click/drag sets `isActivated = true`.
- Physics stepping enabled.
- Text system swaps to per-letter representation.

### 6.3 Mode Switching

- Clicking an XR device updates `activeDeviceMode`.
- Physics parameters interpolated (never hard-switched).

---

## 7. Physics Integration (Rapier)

### 7.1 Strategy

- Physics initialized lazily.
- World step only runs when `isActivated === true`.

### 7.2 Constraints

- TextRootRigidBody:

  - Locked translation
  - Limited rotation

- Letters:

  - Spring joints
  - Slight mass variance

---

## 8. Lighting & Environment Systems

### 8.1 LightingRig

- Key light (upper front-left)
- Soft fill light (opposite side)
- Rim lights per major object

### 8.2 Environment

- Solid or subtle gradient background
- No HDRI reflections

---

## 9. Mobile Architecture Differences

### 9.1 Conditional Rendering

- Desktop: full SceneRoot
- Mobile: simplified SceneRootMobile

### 9.2 Mobile Text System

- Always uses CombinedTextMesh
- No per-letter physics
- Animation-driven transforms only

### 9.3 XR Devices (Mobile)

- Single active device at a time
- Tap-based cycling
- Camera and lighting transitions replace physics

---

## 10. Performance Considerations

- Minimal object count
- No per-frame raycasts unless necessary
- Shared materials and geometries
- Physics timestep capped and paused when inactive

---

## 11. Extensibility

- Easy to add new XR devices as modes
- Text system can support future typography changes
- Interaction model adaptable to other hero concepts
