import { createViteConfig } from "../../vite.config.shared.mts"

export default createViteConfig("hydra-viz", {
  // hydra-synth's audio dependency still references Node's `global` in the
  // browser bundle. Map it to the browser global for Vite builds.
  define: {
    global: "globalThis",
  },
})
