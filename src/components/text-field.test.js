import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createTextField } from "./text-field.js";

test("text-field", async () => {
  await matchScreenshot(mount(createTextField("Email", "user@example.com")));
});
