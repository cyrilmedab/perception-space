# Dividing Tasks From Plans by Subagents

## Overview

This document defines how to transform a high-level development plan into a set of small, achievable, agent-owned tasks that can be executed using a specialized multi-agent architecture. Its purpose is to ensure correct task ownership, proper sequencing, and explicit user confirmation before any agent begins work.

---

## Context

You are working in a project that uses a **specialized multi-agent architecture** with clearly defined agent roles, ownership boundaries, and hand-off criteria.

You will be given:

1. A development plan (phases, features, files, implementation order)
2. A markdown document describing the available subagents, including:
   - Roles and ownership
   - Entry points
   - Skills potentially needed
   - Hand-off criteria

Your task is to **analyze the development plan and decompose it into agent-owned, achievable tasks** that can be executed by calling individual agents.

This step is **planning and orchestration only**. Do not implement code.

---

## Primary Objective

Restructure the development plan into:

- Agent-specific sections
- Each section containing a list of **small, concrete, achievable tasks**
- Each task must be sized so that a single agent could reasonably complete it in one focused work session

Avoid vague or composite tasks. If a task feels too large, split it further.

---

## Task Decomposition Rules

1. Every task must:
   - Belong to exactly one owning agent
   - Map clearly to that agent’s defined responsibilities
   - Have a concrete outcome that can be validated

2. Tasks should be written at the level of:
   - “Implement X in file Y”
   - “Refactor Z to support behavior W”
   - “Create new component A with constraints B”

   Not at the level of:
   - “Improve system”
   - “Polish experience”
   - “Add animations” (unless broken into specific, testable steps)

3. If a feature spans multiple concerns:
   - Assign ownership based on the **primary responsibility**
   - Note dependencies on other agents explicitly

---

## Agent Sections

For each agent, produce a section that includes:

- **Agent name**
- **Skills Needed**
- **Scope summary** (what this agent owns in this plan)
- **Numbered list of achievable tasks**, each including:
  - Task description
  - Files touched or created
  - Dependencies (if any)
  - Completion signal (how we know the task is done)
- **Hand-off criteria** to the next agent (if applicable)

---

## Mandatory Confirmation Step

After decomposing and assigning all tasks, **STOP**.

Before any execution or agent invocation, present:

- A concise table mapping **agents → responsibilities**
- A short checklist validating that:
  - Tasks are correctly scoped
  - No agent is overloaded
  - No task violates ownership boundaries

Then ask the user the following questions verbatim:

> Please confirm:
>
> 1. Are the correct agents assigned to the correct tasks?
> 2. Are the tasks broken down to a sufficient level of granularity?
> 3. How should I proceed once confirmed?  
>    (A) I should call each agent automatically when their task list begins  
>    (B) I should pause and ask you to manually invoke each agent

Do not proceed until confirmation is received.

---

## Execution Rules After Confirmation (For Future Steps)

Once confirmed:

- Work one agent at a time
- Explicitly announce when an agent’s task list begins
- Respect hand-off criteria before transitioning agents
- If performance risk or scope creep appears, pause and recommend involving the Optimizer
- Never silently reassign tasks to a different agent

---

## Goal

Produce a clean, auditable, agent-aligned task plan that:

- Can be executed sequentially
- Can be driven by human or automated agents
- Makes ownership, dependencies, and progress unambiguous

Correct task decomposition and agent alignment are more important than speed.
