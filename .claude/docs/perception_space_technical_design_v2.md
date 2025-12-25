# Perception Space — Technical Design Document v2

## 1. Purpose

This document defines the **technical architecture, systems, and implementation approach** for *Perception Space*. It supports a two-tier experience: a mobile-compatible landing site and an extended WebXR experience.

---

## 2. System Overview

Perception Space is **two experiences sharing one content layer**:

1. **Landing Experience** — Scroll-driven Three.js site, works everywhere
2. **XR Experience** — Spatial environment for WebXR-capable devices

Both experiences:
- Read from the same content/data layer
- Share reusable 3D components where possible
- Maintain consistent visual language
- Are independently loadable (XR doesn't require landing to load first)

---

## 3. Technology Stack

### Core (Both Experiences)
| Technology | Purpose |
|------------|---------|
| React 18+ | UI framework |
| Three.js | 3D rendering |
| @react-three/fiber (R3F) | React renderer for Three.js |
| @react-three/drei | Helpers, abstractions, primitives |
| Zustand | Global state management |
| TypeScript | Type safety |

### Landing Experience Additions
| Technology | Purpose |
|------------|---------|
| @react-three/drei ScrollControls | Scroll-driven camera |
| GSAP or R3F useSpring | Transitions and animations |

### XR Experience Additions
| Technology | Purpose |
|------------|---------|
| @react-three/xr | WebXR integration for R3F |
| @react-three/rapier | Physics engine |

### Deferred (Phase 2+)
| Technology | Purpose | When to Add |
|------------|---------|-------------|
| Troika-three-text | High-quality SDF text | If drei Text3D insufficient |
| Theatre.js | Complex authored animations | If GSAP insufficient |
| MDX | Rich content authoring | If JSON too limiting |

---

## 4. Architecture

```
src/
├── core/                       # Shared foundation
│   ├── content/
│   │   ├── projects.json       # Project data
│   │   ├── career.json         # Career/role data
│   │   └── meta.json           # Site metadata
│   ├── components/
│   │   ├── ProjectCard/        # Reusable project display
│   │   ├── Text/               # Typography components
│   │   └── InteractiveObject/  # The playful physics object
│   ├── state/
│   │   ├── useExperienceStore.ts
│   │   └── useContentStore.ts
│   ├── hooks/
│   │   └── useDeviceCapabilities.ts
│   └── types/
│       └── index.ts
│
├── landing/                    # Mobile-compatible Three.js site
│   ├── LandingScene.tsx        # Main scene composition
│   ├── CameraRig.tsx           # Scroll-driven camera
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   └── CareerSection.tsx
│   ├── components/
│   │   ├── ProjectCardLanding.tsx
│   │   └── PlayfulObject.tsx   # Physics teaser object
│   └── transitions/
│       └── index.ts
│
├── xr/                         # WebXR experience
│   ├── XRScene.tsx             # Main XR scene
│   ├── XREnvironment.tsx       # Lighting, atmosphere
│   ├── anchors/
│   │   ├── ProjectAnchor.tsx   # Spatial project display
│   │   └── AnchorLayout.ts     # Spatial arrangement logic
│   ├── interactions/
│   │   ├── Grabbable.tsx       # Physics grab interaction
│   │   ├── Hoverable.tsx       # Proximity/gaze hover
│   │   └── Selectable.tsx      # Selection handling
│   ├── hands/
│   │   └── HandPresence.tsx    # Hand tracking visuals
│   └── physics/
│       ├── PhysicsProvider.tsx
│       └── PhysicsObjects.tsx  # Canonical interactive objects
│
├── app/
│   ├── App.tsx
│   ├── Router.tsx
│   └── ExperienceGate.tsx      # Device detection, routing
│
└── styles/
    └── globals.css
```

---

## 5. State Management

### Experience Store (Zustand)

```typescript
interface ExperienceState {
  // Current mode
  mode: 'landing' | 'xr';
  
  // Landing-specific
  scrollProgress: number;          // 0-1 normalized scroll
  activeSection: 'hero' | 'projects' | 'career' | 'contact';
  
  // Shared
  selectedProject: string | null;  // Project ID
  isTransitioning: boolean;
  
  // XR-specific
  xrSessionActive: boolean;
}
```

### Landing Experience States (Simplified)

```typescript
type LandingState = 
  | 'browsing'      // Scrolling through content
  | 'inspecting'    // Project detail expanded
  | 'interacting';  // Playing with physics object
```

### XR Experience States

```typescript
type XRState =
  | 'orienting'     // Just entered, getting bearings
  | 'exploring'     // Moving through space
  | 'approaching'   // Near a project anchor
  | 'inspecting'    // Engaged with project content
  | 'playing';      // Interacting with physics objects
```

---

## 6. Content Model

### Project Schema

```typescript
interface Project {
  id: string;
  title: string;
  subtitle?: string;
  focus: ProjectFocus[];           // Tags for clustering
  thumbnail: string;               // Image path
  media?: {
    images?: string[];
    video?: string;
  };
  content: {
    problem: string;
    solution: string;
    technical: string[];           // Bullet points
  };
  links: {
    github?: string;
    devpost?: string;
    live?: string;
  };
  awards?: string[];               // Hackathon wins, etc.
}

type ProjectFocus = 
  | 'xr-systems'
  | 'networking'
  | 'performance'
  | 'spatial-ui'
  | 'experimental';
```

### Career Schema

```typescript
interface Role {
  id: string;
  title: string;
  company: string;
  location: string;
  period: { start: string; end: string };
  highlights: string[];
}
```

---

## 7. Landing Experience Systems

### Scroll-Driven Camera

Using drei's `ScrollControls`:

```tsx
<ScrollControls pages={4} damping={0.1}>
  <CameraRig />
  <Scroll>
    <HeroSection position={[0, 0, 0]} />
    <ProjectsSection position={[0, -10, 0]} />
    <CareerSection position={[0, -20, 0]} />
  </Scroll>
</ScrollControls>
```

Camera path is a spline or series of keyframes tied to scroll progress.

### Project Card Interaction (Landing)

```typescript
interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onSelect: () => void;
}

// States:
// - Default: shows thumbnail, title, focus tags
// - Hovered: subtle scale + glow
// - Expanded: reveals full content panel
```

### Playful Object (Landing)

Single physics-enabled object demonstrating:
- Click-drag to grab (desktop)
- Touch-drag to grab (mobile)
- Velocity on release
- Gravity + collision with ground plane
- Damped settling

Implementation: Rapier physics in a constrained area, or simplified custom physics for lighter bundle.

---

## 8. XR Experience Systems

### Entry Points

1. **From Landing** — "Enter XR" button triggers WebXR session
2. **Direct** — URL parameter `?xr=1` attempts immediate XR entry

### Spatial Layout

Projects arranged in a hemisphere or gallery layout:

```typescript
interface AnchorLayout {
  type: 'hemisphere' | 'gallery' | 'orbital';
  radius: number;
  focusCount: number;              // Projects in "front"
}
```

### Interaction System

#### Hoverable
```typescript
interface HoverableProps {
  onHoverStart: () => void;
  onHoverEnd: () => void;
  hoverDistance: number;           // Proximity threshold
  children: React.ReactNode;
}
```

Hover triggers:
- XR: Gaze, hand proximity, controller ray
- Fallback: Mouse raycast

#### Grabbable
```typescript
interface GrabbableProps {
  mass: number;
  drag: number;                    // Linear damping
  angularDrag: number;
  onGrab?: () => void;
  onRelease?: (velocity: Vector3) => void;
  children: React.ReactNode;
}
```

Uses Rapier rigid bodies with constraints for hand attachment.

#### Selectable
```typescript
interface SelectableProps {
  onSelect: () => void;
  children: React.ReactNode;
}
```

Select triggers:
- XR: Pinch, trigger, hand tap
- Fallback: Click

### Physics Configuration

```typescript
const physicsConfig = {
  gravity: [0, -9.81, 0],
  timestep: 1/72,                  // Match XR refresh
  interpolation: true,
};

// Canonical objects
const objectProfiles = {
  light: { mass: 0.5, drag: 0.5, restitution: 0.7 },
  medium: { mass: 2.0, drag: 1.0, restitution: 0.4 },
  heavy: { mass: 5.0, drag: 2.0, restitution: 0.2 },
};
```

### Hand Tracking

If supported (`navigator.xr.isSessionSupported('immersive-vr')` + hand input):
- Render hand models via @react-three/xr
- Map pinch to grab
- Map point to ray

Fallback: Controller models with ray interaction.

---

## 9. Device Detection & Routing

```typescript
interface DeviceCapabilities {
  isMobile: boolean;
  isTouch: boolean;
  hasWebXR: boolean;
  hasImmersiveVR: boolean;
  hasImmersiveAR: boolean;
  hasHandTracking: boolean;
}

function useDeviceCapabilities(): DeviceCapabilities {
  // Check navigator.xr, touch events, screen size
}
```

### Routing Logic

```
User arrives at /
  ├─ Mobile? → Render LandingScene (touch-optimized)
  ├─ Desktop? → Render LandingScene (mouse-optimized)
  │             └─ Show "Enter XR" if hasImmersiveVR
  └─ ?xr=1 param? → Attempt XRScene directly
```

---

## 10. Performance Targets

| Metric | Landing | XR |
|--------|---------|-----|
| FPS | 60 | 72 |
| Initial Load | < 3s | < 5s (after landing) |
| Bundle Size | < 500KB (gzipped) | +200KB for XR module |
| Draw Calls | < 50 | < 100 |
| Triangles | < 100K | < 200K |

### Optimization Strategies

- **Code splitting**: XR module loads only when needed
- **Asset optimization**: GLTF + Draco, compressed textures
- **Instancing**: Repeated geometry via InstancedMesh
- **LOD**: Reduce detail at distance (XR)
- **Single shadow light**: One directional light with shadows
- **Culling**: Frustum culling (automatic in Three.js)

---

## 11. Build Phases

### Phase 1: Landing Foundation (4-6 weeks)
- [ ] Project scaffolding (Vite + React + R3F + TypeScript)
- [ ] Content model and sample data
- [ ] Basic scene with scroll-driven camera
- [ ] Static project cards (no expansion)
- [ ] Responsive layout (mobile/desktop)
- [ ] Deploy to Vercel/Netlify

**Milestone**: Functional portfolio viewable on any device

### Phase 2: Landing Polish (3-4 weeks)
- [ ] Project card expansion interaction
- [ ] Hover states and transitions
- [ ] Playful physics object
- [ ] Career section
- [ ] Lighting and atmosphere polish
- [ ] Performance optimization

**Milestone**: Portfolio feels polished and interactive

### Phase 3: XR Foundation (4-6 weeks)
- [ ] WebXR session management
- [ ] Basic XR scene with project anchors
- [ ] Controller ray interaction
- [ ] "Enter XR" flow from landing
- [ ] Spatial layout system

**Milestone**: Can view projects in VR

### Phase 4: XR Interactions (4-6 weeks)
- [ ] Grabbable physics objects
- [ ] Hand tracking support
- [ ] Hover proximity states
- [ ] Satisfying interaction feedback
- [ ] Audio feedback (optional)

**Milestone**: XR experience feels native and polished

### Phase 5: Scaling & Content (Ongoing)
- [ ] Add remaining projects
- [ ] Content management improvements
- [ ] Analytics
- [ ] Accessibility audit
- [ ] Documentation

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep | High | High | Strict phase gates, MVP focus |
| WebXR browser inconsistency | Medium | Medium | Test on Quest Browser early, graceful fallbacks |
| Performance on mobile | Medium | High | Budget enforcement, early profiling |
| Physics complexity | Medium | Medium | Start with simple custom physics, upgrade to Rapier if needed |
| Content updates breaking layout | Low | Medium | Robust content schema, automated tests |

---

## 13. Development Environment

### Prerequisites
- Node.js 18+
- npm or pnpm
- Modern browser (Chrome/Edge for WebXR testing)
- Optional: Quest headset for XR testing

### Key Commands
```bash
npm run dev          # Local development
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint + TypeScript check
```

### WebXR Testing
- **Desktop**: Chrome with WebXR emulator extension
- **Device**: Quest Browser, connect via `adb` or deploy to HTTPS

---

## 14. File Naming Conventions

```
ComponentName.tsx     # React components
useHookName.ts        # Custom hooks
utilityName.ts        # Utility functions
CONSTANT_NAME         # Constants (in constants.ts)
type-name.ts          # Type definition files
```

---

## 15. Guiding Principles

1. **Landing first.** XR is an enhancement, not a requirement.
2. **Content is king.** Architecture serves content, not the reverse.
3. **Ship incrementally.** Each phase produces a deployable artifact.
4. **Budget ruthlessly.** Performance budgets are not negotiable.
5. **Inevitable, not clever.** Interactions should feel obvious in retrospect.

