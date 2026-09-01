import { defineConfig } from "eslint/config"
import coreWebVitals from "eslint-config-next/core-web-vitals"

const eslintConfig = defineConfig([
    ...coreWebVitals,
    {
        ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"]
    }
])

export default eslintConfig
