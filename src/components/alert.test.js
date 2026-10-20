import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createAlert } from "./alert.js";

test("alert", async () => {
  await matchScreenshot(mount(createAlert("The file could not be saved.")));
});
