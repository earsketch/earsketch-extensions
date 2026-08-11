import { createViteConfig } from "../../vite.config.shared.mts"

const config = createViteConfig("tip-of-the-day")

export default {
  ...config,
  base: "/",
}