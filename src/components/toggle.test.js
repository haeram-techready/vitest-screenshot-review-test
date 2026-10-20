import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createToggle } from "./toggle.js";

test("toggle", async () => {
  await matchScreenshot(mount(createToggle(true)));
});
