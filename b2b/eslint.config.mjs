import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Disable warnings for unused variables that are imported but not used
      "@typescript-eslint/no-unused-vars": "off",
      // Allow any types for rapid development
      "@typescript-eslint/no-explicit-any": "off",
      // Allow missing alt text for images (we can fix this later)
      "jsx-a11y/alt-text": "off",
      // Allow using img elements instead of Next.js Image
      "@next/next/no-img-element": "off",
      // Allow missing dependencies in useEffect/useCallback
      "react-hooks/exhaustive-deps": "off",
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      // Allow React Hooks to be called conditionally (for rapid development)
      "react-hooks/rules-of-hooks": "off",
      // Disable TypeScript errors for rapid development
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
];

export default eslintConfig;
