import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // hydra-synth's audio dependency still references Node's `global` in the
  // browser bundle. Map it to the browser global for Vite builds.
  define: {
    global: 'globalThis',
  },
  plugins: [react()],
})
