import { useRef, useEffect, useMemo, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import { useSpring, useTrail, animated } from '@react-spring/three'
import { LiquidGlassPanel } from '@/landing/components/LiquidGlassPanel'
import {
  useExperienceStore,
  useSelectedProject,
  useSelectedCardPosition,
} from '@/core/state/useExperienceStore'
import { getProjectById } from '@/core/content'
import * as THREE from 'three'
import type { Group } from 'three'

// Color palette for focus areas (aurora theme)
const FOCUS_COLORS: Record<string, string> = {
  'xr-systems': '#a855f7',
  'networking': '#22d3ee',
  'performance': '#fb7185',
  'spatial-ui': '#a855f7',
  'experimental': '#22d3ee',
}

// Panel dimensions
const PANEL_WIDTH = 3.5
const PANEL_HEIGHT = 4.5

/**
 * ProjectDetailPanel3D (ID-5 to ID-9)
 *
 * 3D detail panel that animates from the clicked card position to center.
 * Uses a Bezier curve path for elegant motion with scale and opacity effects.
 */
export function ProjectDetailPanel3D() {
  const groupRef = useRef<Group>(null)
  const selectedProjectId = useSelectedProject()
  const selectedCardPosition = useSelectedCardPosition()
  const setSelectedProject = useExperienceStore((s) => s.setSelectedProject)
  const setSelectedCardPosition = useExperienceStore((s) => s.setSelectedCardPosition)
  const { camera } = useThree()

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null
  const isOpen = !!project

  // Get accent color based on primary focus
  const accentColor = useMemo(() => {
    if (!project) return '#a855f7'
    const primaryFocus = project.focus[0]
    return FOCUS_COLORS[primaryFocus] || '#a855f7'
  }, [project])

  // ID-6: Bezier curve path animation
  // Create curve from card position to center (in front of camera)
  const curve = useMemo(() => {
    const startPos = selectedCardPosition || [0, -6, 0]
    const endPos = [0, camera.position.y, camera.position.z - 4]

    // Control points for an elegant arc upward
    const control1: [number, number, number] = [
      startPos[0] * 0.5,
      startPos[1] + 1.5,
      startPos[2] + 1,
    ]
    const control2: [number, number, number] = [
      endPos[0] * 0.5,
      endPos[1] + 0.5,
      endPos[2] - 1,
    ]

    return new THREE.CubicBezierCurve3(
      new THREE.Vector3(...startPos),
      new THREE.Vector3(...control1),
      new THREE.Vector3(...control2),
      new THREE.Vector3(...endPos)
    )
  }, [selectedCardPosition, camera.position])

  // ID-6 & ID-7: Spring animation for path progress and scale
  const { pathProgress, scale, contentOpacity } = useSpring({
    pathProgress: isOpen ? 1 : 0,
    scale: isOpen ? 1 : 0.5,
    contentOpacity: isOpen ? 1 : 0,
    config: {
      tension: 200,
      friction: 20,
    },
  })

  // ID-7: Staggered trail animation for content sections (4 items: title, subtitle, tags, awards/content)
  const contentTrail = useTrail(4, {
    opacity: isOpen ? 1 : 0,
    y: isOpen ? 0 : -0.1,
    config: {
      tension: 300,
      friction: 25,
    },
    delay: isOpen ? 150 : 0, // Delay start until panel has moved
  })

  // ID-6: Animate position along the Bezier curve
  useFrame(() => {
    if (groupRef.current && curve) {
      const progress = pathProgress.get()
      const position = curve.getPoint(progress)
      groupRef.current.position.copy(position)

      // Billboard effect: always face the camera
      groupRef.current.lookAt(camera.position)
    }
  })

  // ID-9: Close handler (defined with useCallback before useEffect)
  const handleClose = useCallback(() => {
    setSelectedProject(null)
    setSelectedCardPosition(null)
  }, [setSelectedProject, setSelectedCardPosition])

  // ID-9: Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleClose])

  // Don't render if no project is selected
  if (!project) return null

  return (
    <animated.group ref={groupRef} scale={scale}>
      <LiquidGlassPanel
        width={PANEL_WIDTH}
        height={PANEL_HEIGHT}
        tintColor={accentColor}
        opacity={0.6}
        radius={0.15}
      >
        {/* Close button (ID-9) */}
        <group position={[PANEL_WIDTH / 2 - 0.2, PANEL_HEIGHT / 2 - 0.2, 0.02]}>
          <mesh
            onClick={(e) => {
              e.stopPropagation()
              handleClose()
            }}
            onPointerOver={() => {
              document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto'
            }}
          >
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color="#2a2a3a" transparent opacity={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.12}
            color="#a0a0b0"
            anchorX="center"
            anchorY="middle"
          >
            X
          </Text>
        </group>

        {/* Project Title - ID-7: Staggered animation item 0 */}
        <animated.group
          position-x={0}
          position-y={contentTrail[0].y.to((y) => PANEL_HEIGHT / 2 - 0.5 + y)}
          position-z={0}
        >
          <animated.mesh>
            <Text
              fontSize={0.22}
              color="#f0f0f5"
              anchorX="center"
              anchorY="middle"
              maxWidth={PANEL_WIDTH - 0.6}
            >
              {project.title}
            </Text>
          </animated.mesh>
        </animated.group>

        {/* Subtitle with accent color - ID-7: Staggered animation item 1 */}
        <animated.group
          position-x={0}
          position-y={contentTrail[1].y.to((y) => PANEL_HEIGHT / 2 - 0.85 + y)}
          position-z={0}
        >
          <Text
            fontSize={0.12}
            color={accentColor}
            anchorX="center"
            anchorY="middle"
            maxWidth={PANEL_WIDTH - 0.6}
          >
            {project.subtitle || ''}
          </Text>
        </animated.group>

        {/* Focus tags - ID-7: Staggered animation item 2 */}
        <animated.group
          position-x={0}
          position-y={contentTrail[2].y.to((y) => PANEL_HEIGHT / 2 - 1.15 + y)}
          position-z={0}
        >
          {project.focus.map((tag, i) => {
            const tagColor = FOCUS_COLORS[tag] || '#a855f7'
            const offset = (i - (project.focus.length - 1) / 2) * 0.85
            return (
              <group key={tag} position={[offset, 0, 0]}>
                <mesh position={[0, 0, -0.01]}>
                  <planeGeometry args={[0.75, 0.18]} />
                  <meshBasicMaterial
                    color={tagColor}
                    transparent
                    opacity={0.15}
                  />
                </mesh>
                <Text
                  fontSize={0.08}
                  color={tagColor}
                  anchorX="center"
                  anchorY="middle"
                >
                  {tag}
                </Text>
              </group>
            )
          })}
        </animated.group>

        {/* Awards (if any) - ID-7: Staggered animation item 3 */}
        {project.awards && project.awards.length > 0 && (
          <animated.group
            position-x={0}
            position-y={contentTrail[3].y.to((y) => PANEL_HEIGHT / 2 - 1.5 + y)}
            position-z={0}
          >
            {project.awards.map((award, i) => (
              <Text
                key={i}
                position={[0, -i * 0.18, 0]}
                fontSize={0.1}
                color="#ffd700"
                anchorX="center"
                anchorY="middle"
                maxWidth={PANEL_WIDTH - 0.6}
              >
                {`★ ${award}`}
              </Text>
            ))}
          </animated.group>
        )}

        {/* Scrollable content using Html */}
        <Html
          position={[0, -0.3, 0.05]}
          transform
          distanceFactor={1.5}
          style={{
            width: `${PANEL_WIDTH * 100}px`,
            maxHeight: `${PANEL_HEIGHT * 60}px`,
            overflow: 'auto',
            pointerEvents: 'auto',
          }}
        >
          <animated.div
            style={{
              // Cast opacity interpolation to satisfy TypeScript
              opacity: contentOpacity.to((o) => o) as unknown as number,
              padding: '16px',
              color: '#c0c0d0',
              fontSize: '12px',
              lineHeight: '1.6',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {/* Problem/Challenge */}
            <div style={{ marginBottom: '16px' }}>
              <h3
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6a6a7a',
                  marginBottom: '8px',
                }}
              >
                The Challenge
              </h3>
              <p>{project.content.problem}</p>
            </div>

            {/* Solution */}
            <div style={{ marginBottom: '16px' }}>
              <h3
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6a6a7a',
                  marginBottom: '8px',
                }}
              >
                The Solution
              </h3>
              <p>{project.content.solution}</p>
            </div>

            {/* Technical Highlights */}
            <div style={{ marginBottom: '16px' }}>
              <h3
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#6a6a7a',
                  marginBottom: '8px',
                }}
              >
                Technical Highlights
              </h3>
              <ul style={{ paddingLeft: '16px', margin: 0 }}>
                {project.content.technical.map((tech, i) => (
                  <li key={i} style={{ marginBottom: '4px' }}>
                    <span style={{ color: accentColor }}>&#8226;</span> {tech}
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${accentColor}40`,
                    borderRadius: '6px',
                    color: '#a0a0b0',
                    textDecoration: 'none',
                    fontSize: '11px',
                    background: 'rgba(30, 30, 40, 0.5)',
                  }}
                >
                  GitHub
                </a>
              )}
              {project.links.devpost && (
                <a
                  href={project.links.devpost}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${accentColor}40`,
                    borderRadius: '6px',
                    color: '#a0a0b0',
                    textDecoration: 'none',
                    fontSize: '11px',
                    background: 'rgba(30, 30, 40, 0.5)',
                  }}
                >
                  Devpost
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    border: `1px solid ${accentColor}40`,
                    borderRadius: '6px',
                    color: '#a0a0b0',
                    textDecoration: 'none',
                    fontSize: '11px',
                    background: 'rgba(30, 30, 40, 0.5)',
                  }}
                >
                  Live Demo
                </a>
              )}
            </div>
          </animated.div>
        </Html>
      </LiquidGlassPanel>
    </animated.group>
  )
}
