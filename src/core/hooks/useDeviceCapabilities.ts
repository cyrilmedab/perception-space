import { useState, useEffect } from 'react'
import type { DeviceCapabilities } from '@/core/types'

// Mobile breakpoint (matches common mobile max-width)
const MOBILE_BREAKPOINT = 768
// Tablet breakpoint
const TABLET_BREAKPOINT = 1024

function detectCapabilities(): DeviceCapabilities {
  // SSR guard
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      supportsXR: false,
      supportsTouch: false,
      pixelRatio: 1,
    }
  }

  const width = window.innerWidth
  const isMobile = width < MOBILE_BREAKPOINT
  const isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT
  const isDesktop = width >= TABLET_BREAKPOINT

  // Check for touch support
  const supportsTouch =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0

  // Check for WebXR support (async, but we start with false)
  const supportsXR = 'xr' in navigator

  // Get pixel ratio, capped for performance
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

  return {
    isMobile,
    isTablet,
    isDesktop,
    supportsXR,
    supportsTouch,
    pixelRatio,
  }
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(
    detectCapabilities
  )

  useEffect(() => {
    // Update on resize
    function handleResize() {
      setCapabilities(detectCapabilities())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return capabilities
}

// Async check for immersive VR support
export async function checkXRSupport(): Promise<boolean> {
  if (!('xr' in navigator)) return false

  try {
    const supported = await navigator.xr?.isSessionSupported('immersive-vr')
    return supported ?? false
  } catch {
    return false
  }
}
