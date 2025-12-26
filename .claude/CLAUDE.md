# Perception Space — Claude Code Context

## What This Project Is

A portfolio website for Cyril Medabalimi, an XR Software Engineer. It has two tiers:

1. **Landing Experience** — A scroll-driven Three.js site that works on mobile, tablet, and desktop
2. **XR Experience** — A spatial environment for WebXR-capable browsers (Quest Browser, desktop + headset)

The landing experience is the priority. XR is an enhancement.

---

## Tech Stack

**Use these:**

- React 18+ with TypeScript
- Vite as build tool
- Three.js via @react-three/fiber (R3F)
- @react-three/drei for helpers (ScrollControls, Text, etc.)
- Zustand for state management
- @react-three/xr for WebXR (Phase 3+)
- @react-three/rapier for physics (Phase 2+)

**Do NOT use:**

- Theatre.js (use GSAP or R3F springs instead)
- Cannon.js (use Rapier)
- Troika-three-text initially (use drei Text3D first)
- Any CSS framework (minimal custom CSS only)

---

## Dev Server Management

**Do NOT start the dev server automatically.** Instead:

1. When changes are complete and ready to test, prompt the user: "Ready to test! Please run `npm run dev` to start the dev server."
2. When work is done and the user no longer needs the server, prompt: "You can stop the dev server now with Ctrl+C if you're done testing."

This keeps the user in control of long-running processes.

---

## Architecture Quick Reference

```
src/
├── core/           # Shared: content data, reusable components, state, types
├── landing/        # Scroll-driven 3D site (mobile + desktop)
├── xr/             # WebXR experience (Phase 3+)
└── app/            # Routing, device detection, entry points
```

---

## Current Phase Context

When working on this project, check which phase we're in:

### Phase 1: Landing Foundation

Focus: Basic scroll-driven scene, static project cards, responsive

- Set up Vite + React + R3F + TypeScript
- Implement scroll-driven camera with drei ScrollControls
- Display project cards in 3D space
- Make it work on mobile

### Phase 2: Landing Polish

Focus: Interactions, physics teaser, visual polish

- Project card expansion on click/tap
- Hover states
- One playful physics object (Rapier)
- Lighting and atmosphere

### Phase 3: XR Foundation

Focus: Basic WebXR session, spatial project display

- WebXR session management with @react-three/xr
- "Enter XR" button flow
- Project anchors in space
- Controller ray interaction

### Phase 4: XR Interactions

Focus: Physics, hand tracking, satisfying feedback

- Grabbable objects with mass/drag
- Hand tracking support
- Proximity-based hover states

---

## Key Implementation Notes

### Scroll-Driven Camera (Landing)

```tsx
import { ScrollControls, Scroll } from "@react-three/drei";

// In your scene:
<ScrollControls pages={4} damping={0.1}>
  <CameraRig /> {/* Moves camera based on scroll */}
  <Scroll>{/* Content sections at different Y positions */}</Scroll>
</ScrollControls>;
```

### State Management Pattern

```tsx
// src/core/state/useExperienceStore.ts
import { create } from "zustand";

interface ExperienceState {
  mode: "landing" | "xr";
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  mode: "landing",
  selectedProject: null,
  setSelectedProject: (id) => set({ selectedProject: id }),
}));
```

### Content Loading

Content lives in `src/core/content/`. Import JSON directly:

```tsx
import projectsData from "@/core/content/projects.json";
```

### Responsive Considerations

- Use `useThree()` hook to get viewport size
- Adjust camera FOV or position based on aspect ratio
- Touch events: drei handles most of this, but test on real devices

---

## Performance Budgets

| Metric         | Target          |
| -------------- | --------------- |
| Landing FPS    | 60              |
| XR FPS         | 72              |
| Initial bundle | < 500KB gzipped |
| Draw calls     | < 50 (landing)  |

Profile early. Use React DevTools + Chrome Performance tab.

---

## Content Schema Reference

Projects have this shape:

```typescript
interface Project {
  id: string;
  title: string;
  subtitle?: string;
  focus: (
    | "xr-systems"
    | "networking"
    | "performance"
    | "spatial-ui"
    | "experimental"
  )[];
  thumbnail: string;
  content: {
    problem: string;
    solution: string;
    technical: string[];
  };
  links: { github?: string; devpost?: string; live?: string };
  awards?: string[];
}
```

---

## Common Tasks

### "Add a new project"

1. Add entry to `src/core/content/projects.json`
2. Add thumbnail to `public/assets/projects/[id]/`
3. No code changes needed if schema is followed

### "Make something grabbable (XR)"

```tsx
import { RigidBody } from "@react-three/rapier";

<RigidBody colliders="cuboid" mass={1} linearDamping={0.5}>
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial />
  </mesh>
</RigidBody>;
```

### "Add hover effect"

```tsx
import { useState } from "react";

function HoverableMesh() {
  const [hovered, setHovered] = useState(false);
  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      {/* ... */}
    </mesh>
  );
}
```

---

## Design Principles (For Code Decisions)

1. **Recruiters spend 30 seconds.** Prioritize clarity over cleverness.
2. **Mobile is not optional.** Test every change on mobile viewport.
3. **Content is king.** Don't let architecture complexity obscure projects.
4. **If it feels clever, simplify.** Interactions should feel inevitable.

---

## Subagent Orchestration

### When to Delegate

**Use subagents when:**

- Task is clearly owned by one agent (see ownership below)
- Work is substantial (>7 min of focused effort)
- Context isolation benefits the main thread

**Handle directly when:**

- Quick answers or clarifications
- Cross-cutting decisions needing full context
- User explicitly wants main agent involvement

### Task Decomposition Protocol

Before starting multi-step work:

1. Identify which agent(s) own the work
2. Break into discrete, delegatable chunks
3. Present roadmap to user for approval
4. Spawn subagents sequentially or in parallel as appropriate

### Agent Ownership

| Agent             | Owns                                                  | Triggers                                    |
| ----------------- | ----------------------------------------------------- | ------------------------------------------- |
| foundation        | Vite, TS config, routing, folder structure            | "setup", "scaffold", "config", build errors |
| scene-composition | ScrollControls, camera, lighting, spatial layout      | "scene", "camera", "lighting", "scroll"     |
| content-system    | JSON schemas, ProjectCard, text rendering             | "content", "project data", "cards"          |
| interactions      | Hover, selection, animations, physics object, Zustand | "hover", "click", "animation", "state"      |
| performance       | Bundle size, FPS, profiling, optimization             | "slow", "optimize", "bundle", "FPS"         |
| xr-foundation     | XR sessions, controllers, anchors                     | "XR", "VR", "WebXR", "headset"              |
| xr-interactions   | Hand tracking, grab mechanics, spatial UI             | "hand tracking", "grab", "XR interaction"   |

### Subagent Instructions

When spawning a subagent, always include:

1. **Specific task** - What to accomplish
2. **Relevant file paths** - Where to look/modify
3. **Constraints** - Performance budgets, patterns to follow
4. **Exit criteria** - How to know when done

### Return Format

Subagents must return:

```
## Summary
[2-3 sentence description of what was done]

## Files Changed
- path/to/file.tsx - [what changed]

## Decisions Made
- [Any architectural or pattern choices]

## Open Items (if any)
- [Anything requiring main agent or user attention]
```

### Hand-off Triggers

| From              | To                | When                                        |
| ----------------- | ----------------- | ------------------------------------------- |
| foundation        | scene-composition | Basic Canvas renders, routing works         |
| scene-composition | content-system    | ScrollControls working, sections positioned |
| content-system    | interactions      | Static content displays correctly           |
| interactions      | performance       | Features complete, need optimization        |
| Any agent         | performance       | FPS < 50 or bundle > 500KB                  |

### Parallel vs Sequential

**Run in parallel:**

- Independent file creation
- Research tasks
- Multiple component scaffolds

**Run sequentially:**

- Dependent changes (A must exist before B)
- State management setup before consumers
- Schema before components using it

---

## Testing Checklist Before Commits

- [ ] Runs without errors in dev
- [ ] No TypeScript errors
- [ ] Works on mobile viewport (Chrome DevTools)
- [ ] FPS stays above 50 on mid-range hardware
- [ ] Content is readable

---

## Links to Full Documentation

- Design Context: `perception_space_design_context_v2.md`
- Technical Design: `perception_space_technical_design_v2.md`
- Content Data: `content_data.json`
