# Perception Space — Implementation Roadmap

## Project Overview
Portfolio website for Cyril Medabalimi (XR Software Engineer) with two tiers:
1. **Landing Experience** — Scroll-driven Three.js site (mobile + desktop)
2. **XR Experience** — WebXR spatial environment (Phase 3+)

**Aesthetic**: Floating gallery (cards suspended in atmospheric space with fog/depth)
**Work Style**: Task-by-task sessions
**Assets**: Placeholders initially

---

## Current State
- **Phase 1 Complete** — Landing foundation implemented
- **Phase 2 Complete** — Landing polish with magical design

### Architecture Summary
- React 18+ with TypeScript, Vite build
- Three.js via @react-three/fiber (R3F)
- @react-three/drei for helpers (ScrollControls, Text, Float, RoundedBox)
- @react-spring/three for smooth spring animations
- Zustand for state management (useExperienceStore)

### Scene Structure
- **LandingScene.tsx**: Main Canvas with ScrollControls (4 pages, damping 0.1)
- **CameraRig.tsx**: Camera moves from Y=0 to Y=-32 based on scroll
- **AtmosphericLighting.tsx**: Multi-colored pulsing point lights, ambient, directional
- **MagicalFog**: Custom fog (#0a0a12) with depth 4-35 units

### Sections (by Y position)
- **HeroSection (Y=0)**: Name, title, location, scroll indicator, ethereal glow rings, enhanced particles
- **ProjectsSection (Y=-10)**: 5 project cards in 2-column staggered layout with depth variation
- **CareerSection (Y=-25)**: Timeline with 3 role cards, glowing node markers
- **ContactSection (Y=-32)**: LinkedIn, GitHub, Email cards with hover effects

### Key Components
- **ProjectCard.tsx**: Spring-animated hover (scale 1.08), color-coded by focus area, sparkle effects
- **ProjectDetail.tsx**: Modal panel that follows camera, closes on Escape, shows full project info
- **PlayfulOrb.tsx**: Interactive crystal orbs with orbital rings and particles
- **MagicalParticles.tsx**: 60 floating particles with color variety and organic motion

### State Management (useExperienceStore)
- `mode`: 'landing' | 'xr'
- `selectedProject`: string | null (triggers ProjectDetail panel)
- `scrollProgress`: number (0-1)
- `isLoading`: boolean

### Content Data (src/core/content/)
- projects.json: 5 projects with focus areas, awards, links, technical details
- career.json: 3 roles with highlights
- meta.json: Cyril's info, skills, education, contact

### Performance
- Bundle: 367KB gzipped (budget: 500KB)
- DPR capped at 2x via useDeviceCapabilities hook
- 60 particles + 3 orbs + fog for atmosphere without impacting FPS

---

## Phase 1: Landing Foundation

### Setup (Tasks 1.1-1.2)
| Task | Description | Files |
|------|-------------|-------|
| 1.1 | Install 3D dependencies | `npm install three @react-three/fiber @react-three/drei zustand` |
| 1.2 | Configure path aliases + folder structure | `vite.config.ts`, `tsconfig.app.json`, create `src/{core,landing,xr,app}/` |

### Core Infrastructure (Tasks 1.3-1.6)
| Task | Description | Files | Skill |
|------|-------------|-------|-------|
| 1.3 | Create TypeScript types | `src/core/types/index.ts` | — |
| 1.4 | Set up content data layer | `src/core/content/{projects,career,meta}.json`, `index.ts` | — |
| 1.5 | Create Zustand store | `src/core/state/useExperienceStore.ts` | react-three-fiber |
| 1.6 | Device capabilities hook | `src/core/hooks/useDeviceCapabilities.ts` | — |

### Scene Composition (Tasks 1.7-1.12)
| Task | Description | Files | Skill |
|------|-------------|-------|-------|
| 1.7 | Create Canvas + scene shell | `src/landing/LandingScene.tsx`, `CameraRig.tsx` | react-three-fiber |
| 1.8 | Update App entry point | `src/App.tsx`, `src/index.css` | — |
| 1.9 | Hero section | `src/landing/sections/HeroSection.tsx` | react-three-fiber |
| 1.10 | ProjectCard component | `src/landing/components/ProjectCard.tsx` | react-three-fiber |
| 1.11 | Projects section (floating layout) | `src/landing/sections/ProjectsSection.tsx` | react-three-fiber |
| 1.12 | Wire sections into scene | `src/landing/LandingScene.tsx` | — |

### Finishing (Tasks 1.13-1.16)
| Task | Description | Files | Skill |
|------|-------------|-------|-------|
| 1.13 | Responsive viewport handling | `src/core/hooks/useResponsive.ts` | react-three-fiber |
| 1.14 | Loading state | `src/landing/components/LoadingScreen.tsx` | react-three-fiber |
| 1.15 | Placeholder assets | `public/assets/projects/*/`, `public/fonts/` | asset-pipeline |
| 1.16 | **Validation checkpoint** | Test all criteria | — |

**Phase 1 Exit Criteria:**
- [x] Scroll moves camera through scene
- [x] Hero displays name/title
- [x] 5 project cards in floating arrangement
- [x] Cards hover with scale/cursor change
- [x] Works on mobile viewport
- [x] FPS > 50

---

## Phase 2: Landing Polish

### Setup (Task 2.1)
| Task | Description |
|------|-------------|
| 2.1 | Install physics/animation deps | `npm install @react-three/rapier @react-spring/three` |

### Interactions (Tasks 2.2-2.6)
| Task | Description | Files | Skill |
|------|-------------|-------|-------|
| 2.2 | Project detail panel | `src/landing/components/ProjectDetail.tsx` | react-three-fiber |
| 2.3 | Enhanced hover states | Modify `ProjectCard.tsx` | react-three-fiber |
| 2.4 | Career section | `src/landing/sections/CareerSection.tsx` | react-three-fiber |
| 2.5 | Playful physics object | `src/landing/components/PlayfulObject.tsx` | rapier-physics |
| 2.6 | Physics provider | Modify `LandingScene.tsx` | rapier-physics |

### Polish (Tasks 2.7-2.11)
| Task | Description | Skill |
|------|-------------|-------|
| 2.7 | Lighting/atmosphere refinement | react-three-fiber |
| 2.8 | Section transition animations | react-three-fiber |
| 2.9 | Contact/footer section | react-three-fiber |
| 2.10 | HTML overlay for links | react-three-fiber |
| 2.11 | Mobile touch optimization | — |

### Validation (Tasks 2.12-2.13)
| Task | Description |
|------|-------------|
| 2.12 | Performance optimization pass |
| 2.13 | **Validation checkpoint** |

**Phase 2 Exit Criteria:**
- [x] Project cards expand to detail view (click opens ProjectDetail modal)
- [x] Interactive playful orbs (not physics-based Rapier, but spring-animated crystal orbs)
- [x] Career section with 3 roles (timeline with glowing nodes)
- [x] Contact links working (LinkedIn, GitHub, Email with hover effects)
- [x] Enhanced hover states with spring animations and sparkles
- [x] Magical atmosphere (particles, colored lights, ethereal glows)
- [x] FPS: 60 desktop, 50+ mobile
- [x] Bundle 367KB gzipped (< 500KB budget)

---

## Phase 3: XR Foundation (Future)

| Task | Description |
|------|-------------|
| 3.1 | Install `@react-three/xr` |
| 3.2 | XR scene shell |
| 3.3 | Experience gate/router |
| 3.4 | Project anchor component |
| 3.5 | Spatial layout system |
| 3.6 | Controller ray interaction |
| 3.7 | XR session entry flow |
| 3.8 | Validation checkpoint |

---

## Phase 4: XR Interactions (Future)

| Task | Description |
|------|-------------|
| 4.1 | Grabbable objects with Rapier |
| 4.2 | Hand tracking support |
| 4.3 | Proximity-based hover |
| 4.4 | Haptic feedback |
| 4.5 | Audio polish (optional) |
| 4.6 | Validation checkpoint |

---

## Floating Gallery Implementation Notes

### Fog/Atmosphere
```tsx
<fog attach="fog" args={['#0a0a0f', 5, 30]} />
<color attach="background" args={['#0a0a0f']} />
```

### Card Layout Pattern
```typescript
// Staggered 3D arrangement
const x = col === 0 ? -2.5 : 2.5;
const y = -row * 3.5;
const z = -2 - (i % 3) * 1.5; // Depth variation
const rotationY = col === 0 ? 0.1 : -0.1; // Angle toward center
```

### Camera Path
- Vertical descent along Y axis
- Y=0 (Hero) → Y=-10 (Projects) → Y=-25 (Career) → Y=-32 (Contact)
- Damping: 0.1 for smooth momentum

---

## Task Dependencies

```
Phase 1:
1.1 → 1.2 → 1.3 → 1.4
         ↘ 1.5
         ↘ 1.7 → 1.8 → 1.9 ─┬→ 1.11 → 1.12 → 1.13 → 1.16
                            └→ 1.10 ┘
              ↘ 1.14
1.6 (parallel)
1.15 (parallel)

Phase 2:
2.1 → 2.5 → 2.6
    ↘ 2.2 → 2.3
    ↘ 2.4, 2.7-2.11 (parallel after 2.1)
→ 2.12 → 2.13
```

---

## Critical Files

| File | Purpose |
|------|---------|
| `src/landing/LandingScene.tsx` | Main scene, Canvas, fog/lighting |
| `src/core/state/useExperienceStore.ts` | Global state (scroll, selection) |
| `src/landing/components/ProjectCard.tsx` | Core content display |
| `src/core/types/index.ts` | TypeScript interfaces |
| `.claude/refs/content_data.json` | Source content |

---

## Subagent Ownership

| Agent | Triggers |
|-------|----------|
| react-three-fiber | R3F, drei, scroll, animation, scene composition |
| rapier-physics | Physics, grabbables (Phase 2+) |
| react-three-xr | XR sessions, hands, controllers (Phase 3+) |
| asset-pipeline | GLTF optimization, textures |

---

## Next Step

Phase 2 complete. Ready for **Phase 3: XR Foundation** when needed:
- Install `@react-three/xr`
- Create XR scene shell and experience gate
- Implement project anchors in spatial layout
- Add controller ray interaction

Or continue refining the landing experience with:
- Real project thumbnails/images
- Mobile touch optimization
- Additional polish and micro-interactions
