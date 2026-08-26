import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets let one build work at any GitHub Pages repository path.
  base: './',
  plugins: [react()],
})
