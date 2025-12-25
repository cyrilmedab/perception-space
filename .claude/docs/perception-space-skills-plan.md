# Perception Space — Claude Skills Plan

## Overview

This document outlines four custom Claude skills to support development of the Perception Space portfolio. Skills are consolidated for context efficiency and mapped to project phases.

### Consolidation Rationale

- **react-three-fiber**: Absorbs `three-js` as a reference file (always needed together)
- **react-three-xr**: Absorbs `xr-accessibility` as a reference file (accessibility is integral to XR)
- **rapier-physics**: Standalone (distinct concern)
- **asset-pipeline**: Standalone (used across all phases)

---

## Skill Dependency Graph

```
┌──────────────────┐
│ react-three-fiber│  ← Foundation (R3F + drei + Three.js fundamentals)
└────────┬─────────┘
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  rapier-physics  │ │  react-three-xr  │ │  asset-pipeline  │
│    (Phase 2+)    │ │    (Phase 3+)    │ │   (Any phase)    │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

---

## Phase Mapping

| Skill             | Primary Phase | Continues Through |
| ----------------- | ------------- | ----------------- |
| react-three-fiber | Phase 1       | All phases        |
| rapier-physics    | Phase 2       | Phase 4           |
| react-three-xr    | Phase 3       | Phase 5           |
| asset-pipeline    | As needed     | All phases        |

---

## Skill 1: react-three-fiber

### Purpose

Primary 3D development framework. Covers R3F, drei helpers, and includes Three.js fundamentals as reference for debugging and low-level operations.

### Triggers

- R3F component structure questions
- Drei helper usage
- Animation and transitions
- Scroll-driven experiences
- State management in 3D context
- Performance in R3F
- Three.js objects, classes, or methods
- 3D math operations (vectors, quaternions, matrices)
- Shader/material questions
- Performance debugging

### SKILL.md Structure

```markdown
# React Three Fiber

## Core Concepts

- Canvas component and configuration
- Declarative scene graph (JSX = Three.js objects)
- Automatic disposal and reconciliation

## Essential Hooks

- useFrame: render loop access, delta time
- useThree: camera, gl, scene, viewport access
- useLoader: async asset loading
- useCursor: pointer state

## Component Patterns

- Extracting reusable 3D components
- Props drilling vs context in 3D
- Ref forwarding to Three.js objects
- Suspense boundaries for loading

## Drei Helpers (Most Used)

- ScrollControls + useScroll: scroll-driven scenes
- Html: DOM elements in 3D space
- Text/Text3D: typography
- Environment: HDR/HDRI lighting
- OrbitControls, PerspectiveCamera
- useGLTF, useTexture: asset loading
- See references/drei-catalog.md for full guide

## Animation Approaches

- useFrame for continuous animation
- useSpring (@react-spring/three) for physics-based
- GSAP integration patterns
- See references/animations.md for detailed patterns

## State Management

- Zustand integration (extracting outside Canvas)
- Avoiding re-renders in hot paths
- Event handling (onClick, onPointerOver, etc.)

## Performance

- Instancing with <Instances>
- Frame loop control (demand, always, never)
- Drei's Preload and useProgress
- See references/performance.md for optimization guide

## Three.js Fundamentals

For low-level debugging and understanding what R3F abstracts:

- See references/threejs-fundamentals.md
```

### References

| File                                 | Contents                                                                                                                           |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| `references/threejs-fundamentals.md` | Scene graph, Object3D, coordinate system, essential classes, render loop, 3D math (Vector3, Quaternion, Matrix4), dispose patterns |
| `references/animations.md`           | Animation techniques: useFrame, spring physics, scroll-driven patterns, GSAP integration, easing reference                         |
| `references/performance.md`          | Profiling, draw call reduction, instancing, LOD, budget enforcement                                                                |
| `references/drei-catalog.md`         | Categorized drei helpers with usage examples                                                                                       |
| `references/shaders.md`              | GLSL basics, ShaderMaterial patterns, uniforms, common effects                                                                     |
| `references/materials-guide.md`      | Material selection, PBR properties                                                                                                 |

### Drei Recommendations for Perception Space

**Essential (Phase 1):**

- `ScrollControls` + `useScroll` — Core of landing experience
- `PerspectiveCamera` — Controllable camera for scroll path
- `Environment` — Quick professional lighting setup
- `useGLTF` / `useTexture` — Asset loading with suspense
- `Preload` + `useProgress` — Loading states for <3s target
- `useCursor` — Pointer state changes on hover

**Recommended (Phase 1-2):**

- `Float` — Subtle floating animation for ambient objects
- `ContactShadows` — Cheap ground shadows without shadow maps
- `Text` or `Text3D` — In-scene typography for project cards
- `Html` — DOM overlays (links, detail panels) positioned in 3D
- `Bounds` + `useBounds` — Auto-fit camera to content sections

**XR-Relevant (Phase 3+):**

- `Billboard` — UI elements that face camera/user

### Assets

| File                          | Contents                                                                                                        |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `assets/shader-template.glsl` | Boilerplate vertex/fragment shader with common uniforms                                                         |
| `assets/ScrollScene.tsx`      | Minimal scroll-driven scene: Canvas, ScrollControls, CameraRig interpolating along path, content reveal pattern |

### Scripts

None

---

## Skill 2: rapier-physics

### Purpose

Physics simulation for interactive objects. Covers @react-three/rapier integration, rigid body dynamics, and grab/throw mechanics.

### Triggers

- Physics simulation questions
- Grabbable/throwable objects
- Collision detection
- Constraints and joints
- Physics-based animation
- "Playful object" implementation

### SKILL.md Structure

```markdown
# Rapier Physics (@react-three/rapier)

## Setup

- <Physics> provider configuration
- Gravity, timestep, interpolation settings
- Debug rendering

## Rigid Bodies

- Types: dynamic, fixed, kinematicPosition, kinematicVelocity
- Mass, linearDamping, angularDamping
- Restitution (bounciness), friction
- Sleeping and wake conditions

## Colliders

- Auto colliders: cuboid, ball, hull, trimesh
- Manual collider shapes
- Sensor colliders (trigger volumes)
- Collision groups and masks

## Forces and Impulses

- applyImpulse vs applyForce
- Velocity setting
- Torque application

## Constraints

- Fixed joints
- Spring joints (for grab feel)
- Distance constraints

## Grab Mechanics Pattern

[Detailed pattern for grab/release with velocity inheritance]

## Character & Locomotion (Secondary)

- Kinematic character controller pattern
- Ground detection and slope handling
- Basic movement with collision
- Note: Focus on concepts; XR locomotion specifics in webxr-react

## Performance

- Collider complexity tradeoffs
- Fixed timestep considerations
- When to disable physics

## Common Configurations

[Preset configurations for light/medium/heavy objects]
```

### References

| File                              | Contents                                                          |
| --------------------------------- | ----------------------------------------------------------------- |
| `references/grab-patterns.md`     | Desktop drag, touch drag, XR grab implementations                 |
| `references/object-profiles.md`   | Mass/drag/bounce presets for different object feels               |
| `references/character-physics.md` | Kinematic controller basics, ground detection, collision response |

### Assets

| File                       | Contents                                                                    |
| -------------------------- | --------------------------------------------------------------------------- |
| `assets/Grabbable.tsx`     | Reusable grabbable component with velocity tracking and multi-input support |
| `assets/PhysicsPresets.ts` | Object profile constants (light/medium/heavy)                               |

### Scripts

None

---

## Skill 3: react-three-xr

### Purpose

WebXR integration for immersive experiences. Covers @react-three/xr, input handling, XR-specific interaction patterns, and accessibility for inclusive spatial design.

### Triggers

- WebXR session management
- @react-three/xr usage
- Controller interaction
- Hand tracking
- XR-specific UI patterns
- Locomotion
- Transitioning between flat and immersive
- XR/VR/AR accessibility
- Motion sensitivity, reduced motion in 3D
- Gaze-based interaction
- One-handed XR operation
- Motion sickness prevention

### SKILL.md Structure

```markdown
# WebXR with React (@react-three/xr)

## Session Management

- <XR> provider setup
- <XRButton> for session entry
- Session modes: immersive-vr, immersive-ar
- Feature requirements and optional features
- Graceful fallbacks when XR unavailable

## Controllers

- <Controllers> component
- Ray interaction model
- Trigger, grip, thumbstick input
- Controller events: onSelectStart, onSelectEnd, onSqueeze

## Hand Tracking

- <Hands> component
- Hand model rendering
- Pinch detection
- Hand joint access
- Fallback to controllers

## XR Interaction Patterns

### Selection

- Ray + trigger (controller)
- Pinch gesture (hands)
- Gaze + dwell (accessibility)

### Grabbing

- Near-field grab (hand proximity)
- Far-field grab (ray + pull)
- Object attachment and release

### Hover States

- Proximity-based activation
- Gaze awareness
- Multi-input hover (ray OR hand OR gaze)

## Locomotion

- Teleportation pattern
- Continuous movement
- Boundary enforcement

## Spatial UI

- Billboarding (face user)
- World-locked vs head-locked
- Comfortable reading distances
- Button press depth feedback

## Platform Considerations

- Quest Browser specifics
- Desktop + headset via WebXR
- Hand tracking availability detection

## Transitioning From Flat

- Entry flow (button → overlay → session)
- State preservation across modes
- Returning to flat gracefully

## Accessibility

For motion sensitivity, alternative inputs, and inclusive design:

- See references/accessibility.md
```

### References

| File                                 | Contents                                                                                |
| ------------------------------------ | --------------------------------------------------------------------------------------- |
| `references/interaction-patterns.md` | Detailed XR interaction recipes (hover, select, grab)                                   |
| `references/locomotion.md`           | Teleport and continuous movement implementations                                        |
| `references/spatial-ui.md`           | UI placement, readability, button feedback patterns                                     |
| `references/accessibility.md`        | Motion sensitivity, reduced motion, gaze dwell, one-handed operation, testing checklist |

### Assets

| File                           | Contents                                             |
| ------------------------------ | ---------------------------------------------------- |
| `assets/XRInteractable.tsx`    | Multi-input interactable component (ray, hand, gaze) |
| `assets/XRSessionWrapper.tsx`  | Session management with graceful fallbacks           |
| `assets/GazeDwell.tsx`         | Gaze-dwell selection with progress indicator         |
| `assets/MotionPreferences.tsx` | Hook for motion preference detection                 |

### Scripts

None

---

## Skill 4: asset-pipeline

### Purpose

Optimize 3D assets for web delivery within performance budgets. Covers GLTF optimization, texture compression, and asset auditing.

### Triggers

- GLTF/GLB optimization
- Draco compression
- Texture compression/formats
- Asset size reduction
- Bundle size debugging
- 3D model optimization
- Blender export for web

### SKILL.md Structure

````markdown
# Asset Pipeline

## Tool Installation

### gltf-transform (required)

```bash
npm install -g @gltf-transform/cli
# Or use npx: npx @gltf-transform/cli optimize input.glb output.glb
```
````

### glTF Validator (optional, for validation)

```bash
npm install -g gltf-validator
```

### Sharp (for texture processing)

```bash
npm install sharp
```

## GLTF Optimization

### Draco Compression

- Mesh geometry compression (typically 80-90% reduction)
- Supported by Three.js/R3F via DRACOLoader
- Trade-off: decode time vs file size

### gltf-transform CLI

- `gltf-transform optimize` for general optimization
- `gltf-transform draco` for compression
- `gltf-transform dedup` for removing duplicate data
- `gltf-transform prune` for removing unused data

### glTF Validator

- Validate files before deployment
- Catch common export errors

## Texture Optimization

### Format Selection

| Format | Use Case                          | Browser Support |
| ------ | --------------------------------- | --------------- |
| WebP   | General purpose, good compression | Wide            |
| AVIF   | Best compression, newer           | Growing         |
| KTX2   | GPU-compressed, fastest decode    | Via loader      |
| PNG    | Lossless, transparency            | Universal       |
| JPEG   | Photos, no transparency           | Universal       |

### Texture Sizing

- Power of 2 dimensions (512, 1024, 2048)
- Max 2048px for mobile, 4096px desktop
- Mipmap generation for LOD

### Atlasing

- Combine multiple textures into one
- Reduces draw calls
- Use for UI elements, small objects

## Asset Auditing

### Size Budget Enforcement

- Set per-asset limits
- Track total bundle size
- Automate in CI if possible

### Identifying Bloat

- Unused vertices/materials
- Oversized textures
- Unnecessary animation data
- Duplicate embedded textures

## Blender Export Settings

- Export as GLB (binary, single file)
- Apply modifiers before export
- Limit bone influences for skeletal meshes
- Bake animations, avoid constraints

## Loading Strategies

### Progressive Loading

- Load low-res first, swap to high-res
- Prioritize visible assets
- Lazy load off-screen content

### Preloading

- drei's `useGLTF.preload()`
- Load during idle time
- Show loading progress

## Common Size Targets

| Asset Type         | Target Size |
| ------------------ | ----------- |
| Hero model         | < 500KB     |
| Background model   | < 200KB     |
| UI texture         | < 50KB      |
| Environment map    | < 500KB     |
| Total initial load | < 2MB       |

````

### References
| File | Contents |
|------|----------|
| `references/gltf-transform-recipes.md` | Common gltf-transform command patterns |
| `references/texture-formats.md` | Detailed format comparison, conversion tools |
| `references/blender-export.md` | Step-by-step Blender export settings for web |

### Assets
None

### Scripts
| File | Contents |
|------|----------|
| `scripts/audit-assets.sh` | Script to analyze GLTF files and report sizes |
| `scripts/optimize-gltf.sh` | Wrapper for common gltf-transform optimization pipeline |

---

## Skill Relationships & Non-Overlap

| Concern | Owned By | Others Defer To |
|---------|----------|-----------------|
| 3D math, raw Three.js API, scene composition, React patterns, drei | react-three-fiber | — |
| Physics simulation, rigid bodies, collisions | rapier-physics | — |
| XR sessions, controllers, hands, XR input, accessibility | react-three-xr | rapier-physics for grab physics |
| Asset optimization, compression, formats | asset-pipeline | — |

### Cross-Skill Interactions
- **Grabbable in XR**: react-three-xr handles input detection → rapier-physics handles physics response
- **Optimized models**: asset-pipeline prepares → react-three-fiber loads via useGLTF
- **Scroll-driven camera**: react-three-fiber owns this entirely (drei ScrollControls)
- **Material/shader questions**: react-three-fiber (includes Three.js fundamentals reference)

---

## Reference File Details

### react-three-fiber/references/animations.md

```markdown
# Animation Patterns

## Continuous Animation (useFrame)
- Delta-time usage
- Ref-based updates (avoid state)
- Conditional animation

## Spring Physics (@react-spring/three)
- useSpring configuration
- Spring presets (snappy, gentle, bouncy)
- Chained animations

## Scroll-Driven Animation
- useScroll hook from drei
- Scroll ranges and offsets
- Parallax patterns
- Camera path animation
- Content reveal timing
- Damping and momentum

## Timeline Animation (GSAP)
- gsap.to/from/fromTo with refs
- ScrollTrigger integration (if needed)
- Killing tweens on unmount

## Easing Reference
| Name | Use Case | Value |
|------|----------|-------|
| easeOut | Hover enter | power2.out |
| easeIn | Hover exit | power2.in |
| spring | Selections | tension/friction |

## Stagger Patterns
- Sequential reveals
- Delay calculations
````

### rapier-physics/references/grab-patterns.md

```markdown
# Grab Interaction Patterns

## Desktop (Mouse)

- onPointerDown: attach kinematic body or constraint
- onPointerMove: update target position
- Track velocity from position delta over frames
- onPointerUp: release, apply calculated velocity

## Mobile (Touch)

- touchstart/touchmove/touchend mapping
- Single touch only for grab
- Same velocity calculation

## XR (Hands/Controllers)

- Detect pinch or grip button
- Create spring joint to hand position
- Joint stiffness affects "feel"
- On release: joint removal, velocity inheritance

## Velocity Calculation

- Store last N positions (ring buffer, N=5)
- Calculate average velocity on release
- Clamp to reasonable max

## Throw Feel Tuning

- Mass affects throw distance
- Damping affects arc
- Gravity affects landing
```

### react-three-xr/references/interaction-patterns.md

```markdown
# XR Interaction Patterns

## Hover Detection

### Multi-Input Hover

Objects should respond to ANY of:

- Controller ray intersection
- Hand proximity (< 0.3m)
- Gaze intersection (> 500ms dwell)

### Hover Response

- Subtle scale pulse (1.0 → 1.02, looping)
- Emission increase
- Audio cue (optional)
- Info label fade-in

## Selection

### Controller Selection

- Primary trigger = select
- Grip = grab (if grabbable)

### Hand Selection

- Pinch = select
- Grab pose = grab (if grabbable)

### Gaze Selection (Accessibility)

- 2s dwell on target
- Visual progress indicator
- Confirm with any input or auto-confirm

## Grab Mechanics

### Near-Field (Direct)

- Hand enters object bounds
- Pinch/grab gesture detected
- Object attaches with offset preserved
- Release inherits hand velocity

### Far-Field (Ray)

- Ray intersects object
- Trigger/pinch to "catch"
- Object pulls toward hand
- Then behaves as near-field

## UI Interaction

### Button Press

- Detect finger tip / ray intersection
- Button depresses on contact (0.02m)
- Trigger on full press
- Spring return on release
- Haptic pulse on trigger
```

---

## Implementation Order

### Step 1: Create react-three-fiber skill

Foundation for all 3D work. Includes Three.js fundamentals as reference.

### Step 2: Create rapier-physics skill

Needed for Phase 2 "playful object" and XR grabbables.

### Step 3: Create react-three-xr skill

Needed for Phase 3-4. Includes accessibility patterns as reference.

### Step 4: Create asset-pipeline skill

Can be used any phase when loading external assets.

---

## Estimated Token Budgets

| Skill             | SKILL.md   | References | Assets/Scripts    | Triggers  |
| ----------------- | ---------- | ---------- | ----------------- | --------- |
| react-three-fiber | ~400 lines | ~800 lines | 1 shader template | High      |
| rapier-physics    | ~350 lines | ~300 lines | 2 components      | Moderate  |
| react-three-xr    | ~450 lines | ~600 lines | 4 components      | Phase 3+  |
| asset-pipeline    | ~450 lines | ~250 lines | 2 scripts         | As needed |

All skills stay under the 500-line SKILL.md guideline. References loaded only when needed.

---

## Next Steps

1. ✅ Skill list finalized (4 consolidated skills)
2. ✅ Plan validated
3. Create each skill in implementation order
4. Populate reference files and asset templates
5. Package skills for installation

---

## Final Skill Summary

| #   | Skill             | Focus                                                      | Phase |
| --- | ----------------- | ---------------------------------------------------------- | ----- |
| 1   | react-three-fiber | R3F, drei, Three.js fundamentals, scroll-driven, animation | 1+    |
| 2   | rapier-physics    | Physics, grabbables, satisfying object feel                | 2+    |
| 3   | react-three-xr    | XR sessions, hands, controllers, spatial UI, accessibility | 3+    |
| 4   | asset-pipeline    | GLTF optimization, textures, compression                   | Any   |

---

## Open Questions

None — ready to begin skill creation.
