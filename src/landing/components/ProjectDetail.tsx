import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Text, RoundedBox, Html } from '@react-three/drei'
import { useSpring, animated, config } from '@react-spring/three'
import { useExperienceStore, useSelectedProject } from '@/core/state/useExperienceStore'
import { getProjectById } from '@/core/content'
import type { Group, Mesh } from 'three'
import * as THREE from 'three'

// Panel dimensions
const PANEL_WIDTH = 5
const PANEL_HEIGHT = 4
const PANEL_DEPTH = 0.08

// Color palette for focus areas
const FOCUS_COLORS: Record<string, string> = {
  'xr-systems': '#7c3aed',
  'networking': '#06b6d4',
  'performance': '#10b981',
  'spatial-ui': '#ec4899',
  'experimental': '#f59e0b',
}

/**
 * ProjectDetail
 * Cinematic detail panel that expands when a project is selected
 * Floats in front of the camera with blur backdrop effect
 */
export function ProjectDetail() {
  const selectedProjectId = useSelectedProject()
  const setSelectedProject = useExperienceStore((s) => s.setSelectedProject)
  const { camera } = useThree()
  const groupRef = useRef<Group>(null)
  const backdropRef = useRef<Mesh>(null)

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null
  const isOpen = !!project

  // Get accent color
  const accentColor = project?.focus[0]
    ? FOCUS_COLORS[project.focus[0]] || '#4a9eff'
    : '#4a9eff'

  // Spring animations for cinematic entrance
  const { scale, backdropOpacity, rotationY } = useSpring({
    scale: isOpen ? 1 : 0.8,
    opacity: isOpen ? 1 : 0,
    backdropOpacity: isOpen ? 0.85 : 0,
    rotationY: isOpen ? 0 : 0.3,
    config: isOpen
      ? { ...config.gentle, tension: 200, friction: 25 }
      : { ...config.stiff, tension: 400, friction: 30 },
  })

  // Position panel in front of camera
  useFrame(() => {
    if (groupRef.current && isOpen) {
      // Get camera position and look at point
      const cameraPos = camera.position.clone()
      const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)

      // Position panel 4 units in front of camera
      const panelPos = cameraPos.clone().add(lookDir.multiplyScalar(4))
      groupRef.current.position.copy(panelPos)

      // Face the camera
      groupRef.current.quaternion.copy(camera.quaternion)
    }

    if (backdropRef.current && isOpen) {
      // Backdrop follows camera but further back
      const cameraPos = camera.position.clone()
      const lookDir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      const backdropPos = cameraPos.clone().add(lookDir.multiplyScalar(6))
      backdropRef.current.position.copy(backdropPos)
      backdropRef.current.quaternion.copy(camera.quaternion)
    }
  })

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setSelectedProject(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setSelectedProject])

  if (!project) return null

  return (
    <>
      {/* Dark backdrop */}
      <animated.mesh
        ref={backdropRef}
        visible={isOpen}
      >
        <planeGeometry args={[20, 20]} />
        <animated.meshBasicMaterial
          color="#000000"
          transparent
          opacity={backdropOpacity}
          depthWrite={false}
        />
      </animated.mesh>

      {/* Main panel */}
      <animated.group
        ref={groupRef}
        scale={scale}
        rotation-y={rotationY}
        visible={isOpen}
      >
        {/* Panel background */}
        <RoundedBox
          args={[PANEL_WIDTH, PANEL_HEIGHT, PANEL_DEPTH]}
          radius={0.12}
          smoothness={4}
        >
          <meshStandardMaterial
            color="#0a0a12"
            metalness={0.1}
            roughness={0.9}
          />
        </RoundedBox>

        {/* Glow border */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[PANEL_WIDTH + 0.2, PANEL_HEIGHT + 0.2]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.2} />
        </mesh>

        {/* Inner accent line at top */}
        <mesh position={[0, PANEL_HEIGHT / 2 - 0.15, PANEL_DEPTH / 2 + 0.01]}>
          <planeGeometry args={[PANEL_WIDTH - 0.4, 0.03]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.8} />
        </mesh>

        {/* Close button */}
        <group
          position={[PANEL_WIDTH / 2 - 0.25, PANEL_HEIGHT / 2 - 0.25, PANEL_DEPTH / 2 + 0.01]}
          onClick={() => setSelectedProject(null)}
          onPointerOver={() => { document.body.style.cursor = 'pointer' }}
          onPointerOut={() => { document.body.style.cursor = 'auto' }}
        >
          <mesh>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color="#2a2a3a" />
          </mesh>
          <Text
            fontSize={0.12}
            color="#8a8a9a"
            anchorX="center"
            anchorY="middle"
          >
            ✕
          </Text>
        </group>

        {/* Project title */}
        <Text
          position={[-PANEL_WIDTH / 2 + 0.3, PANEL_HEIGHT / 2 - 0.5, PANEL_DEPTH / 2 + 0.01]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="left"
          anchorY="middle"
          maxWidth={PANEL_WIDTH - 1}
        >
          {project.title}
        </Text>

        {/* Subtitle */}
        <Text
          position={[-PANEL_WIDTH / 2 + 0.3, PANEL_HEIGHT / 2 - 0.8, PANEL_DEPTH / 2 + 0.01]}
          fontSize={0.1}
          color={accentColor}
          anchorX="left"
          anchorY="middle"
        >
          {project.subtitle}
        </Text>

        {/* Focus tags */}
        <group position={[-PANEL_WIDTH / 2 + 0.3, PANEL_HEIGHT / 2 - 1.1, PANEL_DEPTH / 2 + 0.01]}>
          {project.focus.map((tag, i) => (
            <group key={tag} position={[i * 0.85, 0, 0]}>
              <mesh position={[0.35, 0, -0.005]}>
                <planeGeometry args={[0.7, 0.15]} />
                <meshBasicMaterial
                  color={FOCUS_COLORS[tag] || '#4a9eff'}
                  transparent
                  opacity={0.2}
                />
              </mesh>
              <Text
                fontSize={0.065}
                color={FOCUS_COLORS[tag] || '#4a9eff'}
                anchorX="left"
                anchorY="middle"
              >
                {tag}
              </Text>
            </group>
          ))}
        </group>

        {/* Awards */}
        {project.awards && project.awards.length > 0 && (
          <group position={[-PANEL_WIDTH / 2 + 0.3, PANEL_HEIGHT / 2 - 1.45, PANEL_DEPTH / 2 + 0.01]}>
            {project.awards.map((award, i) => (
              <group key={i} position={[0, -i * 0.18, 0]}>
                <Text
                  fontSize={0.08}
                  color="#ffd700"
                  anchorX="left"
                  anchorY="middle"
                >
                  ★ {award}
                </Text>
              </group>
            ))}
          </group>
        )}

        {/* Content sections */}
        <group position={[-PANEL_WIDTH / 2 + 0.3, 0, PANEL_DEPTH / 2 + 0.01]}>
          {/* Problem */}
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.09}
            color="#6a6a7a"
            anchorX="left"
            anchorY="top"
          >
            THE CHALLENGE
          </Text>
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.075}
            color="#aaaaaa"
            anchorX="left"
            anchorY="top"
            maxWidth={PANEL_WIDTH - 0.6}
          >
            {project.content.problem}
          </Text>

          {/* Solution */}
          <Text
            position={[0, -0.5, 0]}
            fontSize={0.09}
            color="#6a6a7a"
            anchorX="left"
            anchorY="top"
          >
            THE SOLUTION
          </Text>
          <Text
            position={[0, -0.7, 0]}
            fontSize={0.075}
            color="#aaaaaa"
            anchorX="left"
            anchorY="top"
            maxWidth={PANEL_WIDTH - 0.6}
          >
            {project.content.solution}
          </Text>
        </group>

        {/* Technical highlights */}
        <group position={[-PANEL_WIDTH / 2 + 0.3, -PANEL_HEIGHT / 2 + 0.8, PANEL_DEPTH / 2 + 0.01]}>
          <Text
            fontSize={0.09}
            color="#6a6a7a"
            anchorX="left"
            anchorY="top"
          >
            TECHNICAL HIGHLIGHTS
          </Text>
          {project.content.technical.slice(0, 3).map((tech, i) => (
            <Text
              key={i}
              position={[0, -0.2 - i * 0.15, 0]}
              fontSize={0.065}
              color="#8a8a9a"
              anchorX="left"
              anchorY="top"
              maxWidth={PANEL_WIDTH - 0.6}
            >
              • {tech}
            </Text>
          ))}
        </group>

        {/* Links */}
        <Html position={[PANEL_WIDTH / 2 - 0.5, -PANEL_HEIGHT / 2 + 0.3, PANEL_DEPTH / 2]} center>
          <div style={{
            display: 'flex',
            gap: '12px',
            transform: 'scale(0.7)',
            transformOrigin: 'center'
          }}>
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#8a8a9a',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  border: '1px solid #3a3a4a',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = accentColor
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a4a'
                  e.currentTarget.style.color = '#8a8a9a'
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
                  color: '#8a8a9a',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  border: '1px solid #3a3a4a',
                  borderRadius: '6px',
                  fontSize: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = accentColor
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a4a'
                  e.currentTarget.style.color = '#8a8a9a'
                }}
              >
                Devpost
              </a>
            )}
          </div>
        </Html>

        {/* Decorative corner accents */}
        {[
          [-PANEL_WIDTH / 2 + 0.15, -PANEL_HEIGHT / 2 + 0.15],
          [PANEL_WIDTH / 2 - 0.15, -PANEL_HEIGHT / 2 + 0.15],
        ].map(([x, y], i) => (
          <mesh key={i} position={[x, y, PANEL_DEPTH / 2 + 0.01]}>
            <circleGeometry args={[0.04, 8]} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.5} />
          </mesh>
        ))}
      </animated.group>
    </>
  )
}
