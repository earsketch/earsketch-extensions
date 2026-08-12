import react from "@vitejs/plugin-react"
import { defineConfig, mergeConfig, type UserConfig } from "vite"

export const createViteConfig = (
  extensionName: string,
  overrides: UserConfig = {},
) =>
  defineConfig(
    mergeConfig(
      {
        base: `/extensions/${extensionName}/`,
        plugins: [react()],
      },
      overrides,
    ),
  )
