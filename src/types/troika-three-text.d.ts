// Type declarations for troika-three-text
declare module 'troika-three-text' {
  import type { Mesh, Color, Material } from 'three'

  export class Text extends Mesh {
    text: string
    fontSize: number
    color: Color | string | number
    anchorX: 'left' | 'center' | 'right' | number
    anchorY: 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom' | number
    letterSpacing: number
    lineHeight: number | 'normal'
    maxWidth: number
    textAlign: 'left' | 'center' | 'right' | 'justify'
    font: string | null
    material: Material

    sync(callback?: () => void): void
    dispose(): void
  }
}
