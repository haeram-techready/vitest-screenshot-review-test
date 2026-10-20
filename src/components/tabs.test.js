import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createTabs } from "./tabs.js";

test("tabs", async () => {
  await matchScreenshot(mount(createTabs(["Overview", "Files", "Settings"], 0)));
});
