import { getProject } from '@theatre/core'

/**
 * Theatre.js project for Perception Space animations
 *
 * This project orchestrates all timeline-based animations including:
 * - Hero section entrance animations
 * - Detail panel open/close transitions
 */
export const project = getProject('PerceptionSpace')

/**
 * Sheet for Hero section animations
 * Controls entrance sequences, text reveals, and initial scene setup
 */
export const heroSheet = project.sheet('Hero')

/**
 * Sheet for Detail Panel animations
 * Controls panel open/close, content transitions, and backdrop effects
 */
export const detailPanelSheet = project.sheet('DetailPanel')
