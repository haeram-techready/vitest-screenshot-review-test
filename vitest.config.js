import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // CI sets SKIP_SCREENSHOTS=1 while no Linux reference exists yet (.github/scripts/screenshot-bootstrap.sh).
  define: {
    "import.meta.env.SKIP_SCREENSHOTS": JSON.stringify(process.env.SKIP_SCREENSHOTS === "1"),
  },
  test: {
    include: ["src/**/*.test.js"],
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
    },
  },
});
