import { expect } from "vitest";
import { page } from "vitest/browser";

import "./theme.css";

export function mount(element) {
  document.body.replaceChildren(element);
  return element;
}

// Captures only the component's box, not the page.
export async function matchScreenshot(element) {
  const locator = page.elementLocator(element);
  await expect.element(locator).toBeVisible();
  if (import.meta.env.SKIP_SCREENSHOTS) {
    return;
  }
  await expect.element(locator).toMatchScreenshot();
}
