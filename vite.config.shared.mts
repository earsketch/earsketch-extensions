import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export const createViteConfig = (extensionName: string) => defineConfig({
  base: `/extensions/${extensionName}/`,
  plugins: [react()],
})
