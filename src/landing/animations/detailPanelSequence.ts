import { detailPanelSheet } from '@/core/animation/theatreProject'

/**
 * Detail Panel Animation Sequence (ID-8)
 *
 * Theatre.js animation objects for the detail panel open/close transitions.
 * Controls path progress along Bezier curve, scale, and opacity.
 */

// Animation object for panel transition
export const panelTransitionObj = detailPanelSheet.object('PanelTransition', {
  // Progress along the Bezier curve (0 = card position, 1 = center)
  pathProgress: 0,
  // Scale multiplier during animation
  scale: 0.5,
  // Content opacity for reveal animation
  contentOpacity: 0,
  // Backdrop blur intensity (0-1)
  backdropBlur: 0,
})

/**
 * Animation timing constants
 * These define the feel of the panel animation
 */
export const PANEL_ANIMATION = {
  // Duration of the opening animation in seconds
  openDuration: 0.6,
  // Duration of the closing animation in seconds
  closeDuration: 0.4,
  // Delay before content starts revealing (in progress units)
  contentRevealStart: 0.6,
  // Bezier curve control point heights (for arc motion)
  curveHeight: 1.5,
  // Target Z position (in front of camera)
  targetZ: 4,
} as const
