import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createBadge } from "./badge.js";

test("badge", async () => {
  await matchScreenshot(mount(createBadge("New")));
});
