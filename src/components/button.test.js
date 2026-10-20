import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createButton } from "./button.js";

test("button", async () => {
  await matchScreenshot(mount(createButton("Save")));
});
