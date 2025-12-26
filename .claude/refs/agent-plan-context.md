# Perception Space — Agent Plan Context

## Overview

This project uses a **specialized multi-agent architecture** with 7 agents designed for phase-specific and concern-specific development. Agents have clear ownership boundaries and hand-off criteria.

---

## Agent Roster

### Phase 1 Agents (Active)

**1. Scaffolder**

- **Role**: Project scaffolding and infrastructure
- **Owns**: Vite config, TypeScript setup, folder structure, routing, device detection
- **Entry Point**: Project initialization, build system issues
- **Hand-off To**: Scene-Director (after basic Canvas exists)

**2. Scene-Director**

- **Role**: 3D scene structure and camera control
- **Owns**: ScrollControls, camera rig, lighting, atmosphere, spatial layout
- **Skills**: react-three-fiber
- **Entry Point**: After Scaffolder completes basic setup
- **Hand-off To**: Content-Curator (for populating scene)

**3. Content-Curator**

- **Role**: Content data and display components
- **Owns**: JSON schemas, ProjectCard components, text rendering, content state
- **Skills**: react-three-fiber
- **Entry Point**: After scene structure exists
- **Hand-off To**: Interaction-Designer (for making cards interactive)

**4. Interaction-Designer**

- **Role**: User interactions and animations
- **Owns**: Hover states, card expansion, playful physics object, Zustand state
- **Skills**: react-three-fiber, rapier-physics
- **Entry Point**: After static content displays correctly
- **Hand-off To**: Optimizer (for optimization checks)

### Phase 2-4 Agents

**5. XR-Architect**

- **Role**: WebXR session and basic spatial setup
- **Owns**: XR session management, XRButton, controllers, project anchors in space
- **Skills**: react-three-xr
- **Entry Point**: Phase 3 start
- **Hand-off To**: XR-Interaction-Designer

**6. XR-Interaction-Designer**

- **Role**: XR-specific interactions and hand tracking
- **Owns**: Hand tracking, grab mechanics, proximity hover, spatial UI feedback
- **Skills**: react-three-xr, rapier-physics
- **Entry Point**: Phase 4 start
- **Hand-off To**: Optimizer

### Cross-Phase Agent

**7. Optimizer**

- **Role**: Optimization and performance budgets
- **Owns**: Bundle analysis, FPS profiling, asset optimization, draw call reduction
- **Skills**: asset-pipeline, react-three-fiber
- **Entry Point**: Any phase when performance issues arise or before phase completion
- **Hand-off To**: Any agent requiring optimization

---

## Agent Interaction Flow

```
Scaffolder → Scene-Director → Content-Curator → Interaction-Designer
                                                        ↓
                                                   Optimizer
                                                        ↓
                                                        ↑
                                         XR-Architect → XR-Interaction-Designer
```

---

## Hand-off Criteria

### Scaffolder → Scene-Director

- ✓ Vite builds without errors
- ✓ Basic Canvas renders
- ✓ Routing works
- ✓ TypeScript configured

### Scene-Director → Content-Curator

- ✓ ScrollControls working
- ✓ Camera path functional
- ✓ Lighting established
- ✓ Sections positioned in space

### Content-Curator → Interaction-Designer

- ✓ Projects display as cards
- ✓ Content loads from JSON
- ✓ Text renders correctly
- ✓ Basic layout responsive

### Interaction-Designer → Optimizer

- ✓ Hover states implemented
- ✓ Card expansion works
- ✓ Physics object functional
- ✓ State management stable

### Any Agent → Optimizer

- Bundle size exceeds targets
- FPS drops below 50
- Assets need optimization
- Before phase sign-off

---

## Agent Creation Status

| Agent                   | Status  | Created | Notes                               |
| ----------------------- | ------- | ------- | ----------------------------------- |
| Scaffolder              | Pending | —       | Create first                        |
| Scene-Director          | Pending | —       | Create second                       |
| Content-Curator         | Pending | —       | Create third                        |
| Interaction-Designer    | Pending | —       | Create fourth                       |
| Optimizer               | Pending | —       | Create fifth (available from start) |
| XR-Architect            | Pending | —       | Create at Phase 3 start             |
| XR-Interaction-Designer | Pending | —       | Create at Phase 4 start             |

---

## Usage Notes

- **Starting a task?** Check which agent owns that concern
- **Context switching?** Use hand-off criteria to know when to switch
- **Performance issue?** Always available to call Optimizer agent
- **Future subagent system:** This structure designed for automatic delegation

---

## Phase-Agent Mapping

| Phase   | Primary Agents                                                    | Support Agent         |
| ------- | ----------------------------------------------------------------- | --------------------- |
| Phase 1 | Scaffolder, Scene-Director, Content-Curator, Interaction-Designer | Optimizer             |
| Phase 2 | Interaction-Designer, Content-Curator                             | Optimizer             |
| Phase 3 | XR-Architect, Scene-Director                                      | Optimizer             |
| Phase 4 | XR-Interaction-Designer                                           | Optimizer             |
| Phase 5 | Content-Curator, Optimizer                                        | All (content updates) |

---

Last Updated: 2024-12-24
