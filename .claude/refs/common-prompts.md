# Common Prompts

## Overview

This contains common prompts that the user will feed to Claude Code.
Claude: IGNORE this file. DO NOT Explore it or read it without EXPLICITLY
asking the user if they want you to. ONLY Read the lines the user points you to.

---

## Prompt 1 - Customs

The hero section is currently rendering with a pure black background and flat, harsh lighting that doesn't match the reference image (HeroSectionRedesign.jpg).

Fix only the lighting and background in the hero section—don't refactor the layout or interaction framework. Do not explore or scan the full codebase unless necessary.

Ask clarifying questions to understand the idea.

Reference the design document (hero_redesign_plan.md) and the target image. Key fixes needed:
Background: Change from pure black to a dark charcoal/deep gray gradient (like the reference)
Lighting model: Add a warm key light (upper front-left) that clearly defines form, Add a subtle fill light opposite the key, Add thin rim lights behind the text and headsets for silhouette separation, The text extrusion should have clear depth and shadow definition (not flat)
Material tweaks: Ensure matte/semi-matte materials respond correctly to the new lighting (no harsh specular highlights)

Before making changes, determine:
What's the current lighting setup in the hero scene? (How many lights, what types?)
Are the text and headset materials using StandardMaterial or something else?
Should the rim lights be subtle (emission) or achieved through actual light positioning?

Then iterate on lighting only until it matches the reference feel. Don't touch interaction or layout.

## Prompt 2 - Subagent Task Division from Plan

Okay. Treat the design plan you just made as authoritative input.

You must follow the instructions in @/home/cyril/Websites/perception-space/.claude/refs/divide-tasks-by-subagents.md exactly. That document defines how tasks are to be decomposed, assigned to subagents, and validated. Its rules override default behavior. The file containing details about available agents is found at @ /home/cyril/Websites/perception-space/.claude/refs/agent-plan-context.md

Your goal is to divide the design plan into small, concrete, agent-callable tasks, such that: 1. Each task can be completed by a single subagent in one focused work session, 2. Each task has exactly one owning agent, 3. Dependencies and hand-offs are made explicit.

Use the available subagents only. Do not invent new roles or reassign ownership outside their defined responsibilities.

For understanding the current state of the project, treat @/home/cyril/Websites/perception-space/.claude/roadmaps/initial-implementation-roadmap.md as the primary source of truth.

Do not explore or scan the full codebase unless a specific task cannot be decomposed without inspecting a file.

You may ask clarifying questions if task ownership, skill constraints, or hand-off criteria are ambiguous.

After completing task decomposition, you must stop and request confirmation before proceeding, as defined in the instructions document.

## Prompt 3 - Redesign Requests

Okay, I'm not happy with the current design, it really looks janky and amateurish. Let's focus on just the Hero Section and the spatial panels for this redesign plan. IGNORE the WebXR components, DO NOT consider the Phase 3 and 4 aspects into this design plan.

For understanding the current state of the project, treat @/home/cyril/Websites/perception-space/.claude/roadmaps/initial-implementation-roadmap.md as the primary source of truth.

Do not explore or scan the full codebase unless a specific task cannot be decomposed without inspecting a file.

Ask many clarifying questions if there's any ambiguity in your design or interaction options. Present choices to the user and ask for their input. DO NOT assume without user input.

For the Hero Section, examine the sample plan and architecture thoughts @/home/cyril/Websites/perception-space/.claude/docs/hero_redesign_plan.md and @/home/cyril/Websites/perception-space/.claude/docs/hero_redesign_architecture.md. Let's create a new plan using these thoughts as authoritative input.

Consider using theatre.js if appropriate to add polish to animations and movement and style, and justify it if not. For a visual example of what the section should feel and almost look like, refer to the example pic @/home/cyril/Websites/perception-space/.claude/assets/HeroSectionRedesign.jpg

For the spatial panels, I want them to evoke the Liquid Glass aesthetic. Liquid Glass is Apple's futuristic, translucent UI design language, introduced in iOS 26 and across other platforms (macOS, iPadOS, etc.), that mimics real-world glass with dynamic reflections, refractions, and fluidity, creating layered, context-aware interfaces. For example pics, refer to @/home/cyril/Websites/perception-space/.claude/assets/LiquidGlassExamples.png . I'd like a similar aesthetic, as the current one is too dark and dreary.

Additionally, I'd like to animate the pop up window, so that when the user clicks on the panel, it lerps on a curved path towards the center of the screen. As it's doing so, it's rotating so that its back panel is facing the user, and the back panel contains all the information that the pop up did. This will make it feel more like an actual spatial panel than just a flat ui that can be clicked.
