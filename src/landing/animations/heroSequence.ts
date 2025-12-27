import { heroSheet } from '@/core/animation/theatreProject'

/**
 * Hero Section Animation Sequence
 *
 * Defines Theatre.js animation objects for the hero entrance sequence.
 * These objects can be controlled via Theatre.js Studio or played programmatically.
 */

/**
 * Create animation object for the main "Cyril" text
 */
export const heroTextObject = heroSheet.object(
  'Hero Text',
  {
    positionX: 0,
    positionY: 0,
    positionZ: -2, // Start behind
    scale: 0.8,
    opacity: 0,
  },
  {
    reconfigure: true,
  }
)

/**
 * Create animation objects for the three headset models
 */
export const visionProObject = heroSheet.object(
  'Vision Pro',
  {
    positionX: -1.8,
    positionY: -0.2,
    positionZ: -2,
    rotationY: 0.3, // Rotated toward center
    scale: 0,
    opacity: 0,
  },
  {
    reconfigure: true,
  }
)

export const quest3Object = heroSheet.object(
  'Quest 3',
  {
    positionX: 0,
    positionY: 0.6,
    positionZ: -1.5,
    rotationY: 0,
    scale: 0,
    opacity: 0,
  },
  {
    reconfigure: true,
  }
)

export const pico4Object = heroSheet.object(
  'Pico 4',
  {
    positionX: 1.8,
    positionY: -0.2,
    positionZ: -2,
    rotationY: -0.3, // Rotated toward center
    scale: 0,
    opacity: 0,
  },
  {
    reconfigure: true,
  }
)

/**
 * Default entrance animation values (end state)
 * These represent where elements should be after the entrance animation
 */
export const HERO_ENTRANCE_END_STATE = {
  text: {
    positionX: 0,
    positionY: 0,
    positionZ: 0.5,
    scale: 1,
    opacity: 1,
  },
  visionPro: {
    positionX: -1.8,
    positionY: -0.2,
    positionZ: -0.8,
    rotationY: 0.3,
    scale: 0.45,
    opacity: 1,
  },
  quest3: {
    positionX: 0,
    positionY: 0.6,
    positionZ: -0.3,
    rotationY: 0,
    scale: 0.45,
    opacity: 1,
  },
  pico4: {
    positionX: 1.8,
    positionY: -0.2,
    positionZ: -0.8,
    rotationY: -0.3,
    scale: 0.45,
    opacity: 1,
  },
}

/**
 * Play the hero entrance sequence
 * Note: In production, this would use Theatre.js sequence playback
 * For now, we provide the end state values for react-spring to animate to
 */
export function getHeroEntranceTargets() {
  return HERO_ENTRANCE_END_STATE
}
