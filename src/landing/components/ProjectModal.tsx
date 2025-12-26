import { useEffect, useRef } from 'react'
import { useExperienceStore, useSelectedProject } from '@/core/state/useExperienceStore'
import { getProjectById } from '@/core/content'

// Color palette for focus areas (aurora theme)
const FOCUS_COLORS: Record<string, string> = {
  'xr-systems': '#a855f7', // Violet
  'networking': '#22d3ee', // Cyan
  'performance': '#fb7185', // Rose
  'spatial-ui': '#a855f7', // Violet
  'experimental': '#22d3ee', // Cyan
}

/**
 * ProjectModal
 * HTML overlay modal for displaying project details
 * Features glass-morphism styling with aurora accents
 */
export function ProjectModal() {
  const selectedProjectId = useSelectedProject()
  const setSelectedProject = useExperienceStore((s) => s.setSelectedProject)
  const modalRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const project = selectedProjectId ? getProjectById(selectedProjectId) : null
  const isOpen = !!project

  // Get accent color based on primary focus
  const accentColor = project?.focus[0]
    ? FOCUS_COLORS[project.focus[0]] || '#a855f7'
    : '#a855f7'

  // ID4: Escape key support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setSelectedProject(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, setSelectedProject])

  // ID5: Scroll lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ID3: Click-outside-to-close
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on the backdrop (not the panel)
    if (e.target === modalRef.current) {
      setSelectedProject(null)
    }
  }

  if (!project) return null

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {/* Modal Panel */}
      <div
        ref={panelRef}
        className="relative max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          width: 'min(90%, 600px)',
          background: 'rgba(15, 10, 30, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          boxShadow: `
            0 0 60px rgba(168, 85, 247, 0.15),
            0 0 120px rgba(34, 211, 238, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.05)
          `,
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Gradient top border */}
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{
            background: `linear-gradient(90deg, ${FOCUS_COLORS['xr-systems']}, ${FOCUS_COLORS['networking']})`,
          }}
        />

        {/* Close button */}
        <button
          onClick={() => setSelectedProject(null)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110"
          style={{
            background: 'rgba(42, 42, 58, 0.8)',
            color: '#a0a0b0',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.3)'
            e.currentTarget.style.color = '#ffffff'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(42, 42, 58, 0.8)'
            e.currentTarget.style.color = '#a0a0b0'
          }}
          aria-label="Close modal"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="1" y1="1" x2="13" y2="13" />
            <line x1="13" y1="1" x2="1" y2="13" />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 pt-8">
          {/* Title and subtitle */}
          <h2
            className="text-2xl font-semibold mb-1"
            style={{ color: '#f0f0f5' }}
          >
            {project.title}
          </h2>
          <p className="text-sm mb-4" style={{ color: accentColor }}>
            {project.subtitle}
          </p>

          {/* Focus tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.focus.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${FOCUS_COLORS[tag] || '#a855f7'}20`,
                  color: FOCUS_COLORS[tag] || '#a855f7',
                  border: `1px solid ${FOCUS_COLORS[tag] || '#a855f7'}40`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Awards */}
          {project.awards && project.awards.length > 0 && (
            <div className="mb-6">
              {project.awards.map((award, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm mb-1"
                  style={{ color: '#ffd700' }}
                >
                  <span>&#9733;</span>
                  <span>{award}</span>
                </div>
              ))}
            </div>
          )}

          {/* Divider */}
          <div
            className="h-px w-full mb-6"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}40, transparent)`,
            }}
          />

          {/* Problem section */}
          <div className="mb-5">
            <h3
              className="text-xs uppercase tracking-wider mb-2 font-medium"
              style={{ color: '#6a6a7a' }}
            >
              The Challenge
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#c0c0d0' }}>
              {project.content.problem}
            </p>
          </div>

          {/* Solution section */}
          <div className="mb-5">
            <h3
              className="text-xs uppercase tracking-wider mb-2 font-medium"
              style={{ color: '#6a6a7a' }}
            >
              The Solution
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: '#c0c0d0' }}>
              {project.content.solution}
            </p>
          </div>

          {/* Technical highlights */}
          <div className="mb-6">
            <h3
              className="text-xs uppercase tracking-wider mb-2 font-medium"
              style={{ color: '#6a6a7a' }}
            >
              Technical Highlights
            </h3>
            <ul className="space-y-1.5">
              {project.content.technical.map((tech, i) => (
                <li
                  key={i}
                  className="text-sm flex items-start gap-2"
                  style={{ color: '#a0a0b0' }}
                >
                  <span style={{ color: accentColor }}>&#8226;</span>
                  <span>{tech}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm rounded-lg transition-all duration-200"
                style={{
                  color: '#a0a0b0',
                  border: '1px solid #3a3a4a',
                  background: 'rgba(30, 30, 40, 0.5)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = accentColor
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.background = `${accentColor}20`
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a4a'
                  e.currentTarget.style.color = '#a0a0b0'
                  e.currentTarget.style.background = 'rgba(30, 30, 40, 0.5)'
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
                className="px-4 py-2 text-sm rounded-lg transition-all duration-200"
                style={{
                  color: '#a0a0b0',
                  border: '1px solid #3a3a4a',
                  background: 'rgba(30, 30, 40, 0.5)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = accentColor
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.background = `${accentColor}20`
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a4a'
                  e.currentTarget.style.color = '#a0a0b0'
                  e.currentTarget.style.background = 'rgba(30, 30, 40, 0.5)'
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
                className="px-4 py-2 text-sm rounded-lg transition-all duration-200"
                style={{
                  color: '#a0a0b0',
                  border: '1px solid #3a3a4a',
                  background: 'rgba(30, 30, 40, 0.5)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = accentColor
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.background = `${accentColor}20`
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#3a3a4a'
                  e.currentTarget.style.color = '#a0a0b0'
                  e.currentTarget.style.background = 'rgba(30, 30, 40, 0.5)'
                }}
              >
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Decorative corner accents */}
        <div
          className="absolute bottom-4 left-4 w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
        />
        <div
          className="absolute bottom-4 right-16 w-2 h-2 rounded-full"
          style={{ backgroundColor: accentColor, opacity: 0.5 }}
        />
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
