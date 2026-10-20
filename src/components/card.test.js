import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createCard } from "./card.js";

test("card", async () => {
  await matchScreenshot(mount(createCard("Weekly report", "Three tasks are done and one is open.")));
});
