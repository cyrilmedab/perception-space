import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react'
          }
          // Three.js core - largest dependency
          if (id.includes('node_modules/three/')) {
            return 'vendor-three'
          }
          // R3F fiber
          if (id.includes('node_modules/@react-three/fiber')) {
            return 'vendor-fiber'
          }
          // R3F drei helpers
          if (id.includes('node_modules/@react-three/drei')) {
            return 'vendor-drei'
          }
          // Rapier physics (WASM)
          if (id.includes('node_modules/@react-three/rapier') || id.includes('node_modules/@dimforge/rapier')) {
            return 'vendor-rapier'
          }
          // React Spring animation
          if (id.includes('node_modules/@react-spring')) {
            return 'vendor-spring'
          }
          // Zustand state
          if (id.includes('node_modules/zustand')) {
            return 'vendor-zustand'
          }
        },
      },
    },
    // Target modern browsers for smaller output
    target: 'esnext',
    // Increase chunk size warning limit (Three.js is inherently large)
    chunkSizeWarningLimit: 600,
  },
})
