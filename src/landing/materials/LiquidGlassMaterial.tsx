import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { useDeviceCapabilities } from '@/core/hooks/useDeviceCapabilities'

/**
 * LiquidGlassMaterial - Custom shader material with glass-like appearance
 *
 * Features:
 * - Fresnel edge glow effect
 * - Subtle iridescence (desktop only)
 * - Animated time-based distortion
 * - Configurable tint and opacity
 *
 * O-2: Mobile uses simplified shader without iridescence for better performance
 */

// Shared vertex shader
const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`

// Desktop fragment shader (full features)
const desktopFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uTintColor;
  uniform float uOpacity;
  uniform vec3 uBackgroundColor;
  uniform float uFresnelPower;
  uniform float uIridescenceIntensity;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;

  void main() {
    // Normalized view direction
    vec3 viewDir = normalize(vViewPosition);

    // Fresnel effect - stronger at edges
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);

    // Subtle iridescence based on view angle and time
    float iridescence = sin(dot(vNormal, viewDir) * 10.0 + uTime * 0.5) * 0.5 + 0.5;
    vec3 iridColor = mix(
      vec3(0.4, 0.2, 0.8), // Purple
      vec3(0.2, 0.8, 0.8), // Cyan
      iridescence
    );

    // Base color with tint
    vec3 baseColor = mix(uBackgroundColor, uTintColor, 0.3);

    // Add fresnel glow
    vec3 fresnelColor = mix(baseColor, uTintColor, fresnel * 0.8);

    // Add subtle iridescence
    vec3 finalColor = mix(fresnelColor, iridColor, fresnel * uIridescenceIntensity);

    // Add edge highlight
    float edgeGlow = fresnel * 0.5;
    finalColor += vec3(edgeGlow * 0.3);

    // Calculate opacity - more opaque at edges (fresnel), base opacity in center
    float finalOpacity = uOpacity + fresnel * 0.3;

    gl_FragColor = vec4(finalColor, finalOpacity);
  }
`

// O-2: Mobile fragment shader (simplified - no iridescence, simpler fresnel)
const mobileFragmentShader = /* glsl */ `
  uniform vec3 uTintColor;
  uniform float uOpacity;
  uniform vec3 uBackgroundColor;
  uniform float uFresnelPower;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    // Normalized view direction
    vec3 viewDir = normalize(vViewPosition);

    // Simplified fresnel - single calculation
    float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), uFresnelPower);

    // Base color with tint - simpler blending
    vec3 baseColor = mix(uBackgroundColor, uTintColor, 0.3 + fresnel * 0.5);

    // Simpler opacity calculation
    float finalOpacity = uOpacity + fresnel * 0.2;

    gl_FragColor = vec4(baseColor, finalOpacity);
  }
`

// Create the desktop shader material (full features)
const LiquidGlassShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uTintColor: new THREE.Color('#ffffff'),
    uOpacity: 0.5,
    uBackgroundColor: new THREE.Color('#0a0a12'),
    uFresnelPower: 2.0,
    uIridescenceIntensity: 0.15,
  },
  vertexShader,
  desktopFragmentShader
)

// Create the mobile shader material (simplified)
const LiquidGlassMobileMaterial = shaderMaterial(
  {
    uTintColor: new THREE.Color('#ffffff'),
    uOpacity: 0.5,
    uBackgroundColor: new THREE.Color('#0a0a12'),
    uFresnelPower: 2.0,
  },
  vertexShader,
  mobileFragmentShader
)

// Extend R3F to recognize both materials
extend({ LiquidGlassShaderMaterial, LiquidGlassMobileMaterial })

// Declare the JSX element types using module augmentation
declare module '@react-three/fiber' {
  interface ThreeElements {
    liquidGlassShaderMaterial: ThreeElements['shaderMaterial'] & {
      uTime?: number
      uTintColor?: THREE.Color
      uOpacity?: number
      uBackgroundColor?: THREE.Color
      uFresnelPower?: number
      uIridescenceIntensity?: number
    }
    liquidGlassMobileMaterial: ThreeElements['shaderMaterial'] & {
      uTintColor?: THREE.Color
      uOpacity?: number
      uBackgroundColor?: THREE.Color
      uFresnelPower?: number
    }
  }
}

interface LiquidGlassMaterialProps {
  /** Tint color for the glass */
  tintColor?: string | THREE.Color
  /** Base opacity (0-1) */
  opacity?: number
  /** Background color seen through the glass */
  backgroundColor?: string | THREE.Color
  /** Fresnel power (higher = sharper edge glow) */
  fresnelPower?: number
  /** Iridescence intensity (0-1) */
  iridescenceIntensity?: number
  /** Whether to animate the material */
  animate?: boolean
}

/**
 * LiquidGlassMaterial component - Use as a child of a mesh
 *
 * O-2: Automatically uses simplified shader on mobile for better performance
 *
 * Usage:
 * <mesh>
 *   <boxGeometry />
 *   <LiquidGlassMaterial tintColor="#a855f7" opacity={0.6} />
 * </mesh>
 */
export function LiquidGlassMaterial({
  tintColor = '#ffffff',
  opacity = 0.5,
  backgroundColor = '#0a0a12',
  fresnelPower = 2.0,
  iridescenceIntensity = 0.15,
  animate = true,
}: LiquidGlassMaterialProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { isMobile } = useDeviceCapabilities()

  // Animate time uniform (desktop only - mobile shader doesn't use time)
  useFrame((state) => {
    if (materialRef.current && animate && !isMobile) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  // Prepare common color values
  const tintColorValue =
    tintColor instanceof THREE.Color ? tintColor : new THREE.Color(tintColor)
  const backgroundColorValue =
    backgroundColor instanceof THREE.Color
      ? backgroundColor
      : new THREE.Color(backgroundColor)

  // O-2: Use simplified mobile shader on mobile devices
  if (isMobile) {
    return (
      <liquidGlassMobileMaterial
        ref={materialRef}
        uTintColor={tintColorValue}
        uOpacity={opacity}
        uBackgroundColor={backgroundColorValue}
        uFresnelPower={fresnelPower}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    )
  }

  // Desktop: Full shader with iridescence and time-based animation
  return (
    <liquidGlassShaderMaterial
      ref={materialRef}
      uTime={0}
      uTintColor={tintColorValue}
      uOpacity={opacity}
      uBackgroundColor={backgroundColorValue}
      uFresnelPower={fresnelPower}
      uIridescenceIntensity={iridescenceIntensity}
      transparent
      side={THREE.DoubleSide}
      depthWrite={false}
    />
  )
}

// Export the raw shader material for advanced use
export { LiquidGlassShaderMaterial }
