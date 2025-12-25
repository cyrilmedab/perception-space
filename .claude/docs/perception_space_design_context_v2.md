# Perception Space — Design Context v2

## Overview
This document captures the **creative vision, constraints, and high-level design decisions** behind *Perception Space*, an XR-native portfolio experience by Cyril Medabalimi. It serves as long-term context for implementation, iteration, and collaboration.

---

## Core Thesis

> **Space is interface. Proximity is selection. Depth is hierarchy.**

This portfolio demonstrates that spatial design is not decoration—it is interaction design. Navigation, selection, and information architecture emerge from how elements are positioned, how they respond to approach, and how they communicate affordance through physicality.

The portfolio exists as two complementary experiences:
1. **Landing Experience** — A polished, scroll-driven Three.js site accessible on any device
2. **XR Experience** — A hands-on spatial environment for WebXR-capable browsers and headsets

Both share content and design language. The XR experience extends the landing experience; it does not replace it.

---

## High-Level Goals

- Create a portfolio that feels like an **authored spatial experience**, not a website with 3D elements
- Demonstrate understanding of:
  - Spatial hierarchy and information architecture
  - Input abstraction (mouse, touch, hands, gaze)
  - Physics as interaction feedback
  - Performance-conscious 3D development
- Ensure **full usability on mobile and desktop** via the landing experience
- Provide an **elevated XR experience** for those with capable hardware
- Architect for **modular growth** as projects are added

---

## Two-Tier Experience Model

### Landing Experience (Primary)
**Audience:** Recruiters, hiring managers, general visitors on any device

**Characteristics:**
- Scroll-driven camera movement through a 3D scene
- Projects displayed as in-scene spatial cards with full content
- One interactive physics object as a "taste" of deeper interaction
- Responsive: works on mobile, tablet, desktop
- Fast load, 60fps target
- Clear call-to-action to enter XR experience (when available)

**Navigation:** Scroll controls camera path. Click/tap selects projects. Minimal traditional UI.

### XR Experience (Extended)
**Audience:** Visitors with WebXR-capable browsers (Quest Browser, desktop + headset, spatial browsers)

**Characteristics:**
- Room-scale or seated spatial environment
- Projects as physical anchors you approach and inspect
- Grabbable objects with weight and physics response
- Hand tracking support where available
- Hover states, springy UI, satisfying micro-interactions
- All content from landing experience, presented spatially

**Navigation:** Physical movement, gaze, hand interaction, controller rays.

---

## Experience Pillars

### 1. Spatial Hierarchy
Information architecture expressed through position and depth:
- Important content is closer, larger, or more central
- Secondary content recedes or requires approach
- Groupings are spatial clusters, not lists

### 2. Proximity-Based Interaction
Distance drives state:
- Approach reveals detail
- Withdrawal collapses complexity
- No menus required for primary navigation

### 3. Physicality as Feedback
Objects have presence and respond to interaction:
- Hover states with subtle motion
- Grabbables with mass and drag
- Springs and damping for UI elements
- One canonical "playful object" demonstrates physics vocabulary

### 4. Progressive Disclosure
Complexity reveals itself as you engage:
- Landing: scroll to reveal
- XR: approach to reveal
- Never overwhelming at first glance

### 5. Restraint
- Effects serve communication, not spectacle
- If an interaction feels clever instead of inevitable, remove it
- Calm, confident, intentional

---

## Experience Flow

### Landing Experience
1. **Arrival** — Scene loads with camera at starting position. Minimal UI. Atmosphere established.
2. **Scroll Discovery** — Scrolling moves camera through scene. Projects come into view.
3. **Project Selection** — Click/tap on project card expands detail view in-scene.
4. **Playful Moment** — One grabbable/interactive object invites experimentation.
5. **XR Invitation** — If WebXR available, clear prompt to "Enter Spatial Experience."

### XR Experience
1. **Entry** — Transition from landing or direct entry. Spatial orientation moment.
2. **Exploration** — Move through space. Projects visible as spatial anchors.
3. **Approach** — Nearing a project reveals more detail, activates hover state.
4. **Inspection** — Select/grab to fully engage. Content panels become readable.
5. **Interaction** — Physics objects invite play. Satisfying feedback throughout.
6. **Withdrawal** — Step back to see full landscape again.

---

## Content Architecture

### Projects (~5 initially, scalable)
Each project includes:
- Title
- Focus areas (tags: Spatial UI, Networking, Performance, etc.)
- Problem statement
- Solution summary
- Technical highlights
- Media (images, video if applicable)
- Links (GitHub, DevPost, live demo)

### Career Section
- Timeline or spatial representation of roles
- Key achievements per role
- Skills visualization

### About/Contact
- Brief bio
- Contact methods
- Resume download

---

## Project Organization

Projects are **clustered by capability**, not chronology:
- XR & Spatial Systems
- Real-time Networking
- Performance & Optimization
- Experimental / Research

This reinforces systems thinking over resume-style timelines.

---

## Visual & Interaction Language

### Aesthetic Direction
- Clean, minimal geometry
- Considered lighting (single key light, subtle fill, environment)
- Neutral palette with accent color for interactive elements
- Depth of field / atmospheric fog for spatial grounding

### Interaction Feedback
- Hover: subtle scale + emission change
- Select: spring animation to "selected" state
- Grab: object follows with mass/drag, not 1:1
- Release: settles with damping

### The Playful Object
One canonical object in the landing experience demonstrates:
- Grabbability (click-drag on desktop, touch-drag on mobile)
- Physics response (falls, bounces, settles)
- Personality (satisfying weight, not floaty)

This primes visitors for the richer XR interactions available.

---

## Platform Behavior

| Aspect | Mobile | Desktop | XR Headset |
|--------|--------|---------|------------|
| Experience | Landing | Landing (+ XR entry) | XR (or Landing) |
| Navigation | Touch scroll, tap | Scroll, click, drag | Movement, hands/controllers |
| Physics Object | Touch-drag | Click-drag | Grab |
| Project Detail | In-scene panels | In-scene panels | Spatial panels |

---

## Guiding Rules

1. **Recruiters spend 30 seconds.** The landing experience must communicate competence immediately.
2. **Mobile is not optional.** The landing experience must be fully functional on phones.
3. **XR is a bonus, not a gate.** All content accessible without headset.
4. **If it feels clever, cut it.** Calm confidence over flashy tricks.
5. **Physicality earns trust.** Satisfying interactions signal engineering depth.

---

## Success Criteria

- A recruiter on mobile can view all projects and contact info in under 60 seconds
- A hiring manager on desktop is intrigued enough to try the XR experience
- The XR experience demonstrates spatial interaction design mastery
- Adding a new project requires only content changes, not code changes
- Performance: 60fps landing, 72fps XR target

