import { test } from "vitest";

import { matchScreenshot, mount } from "../test-utils.js";
import { createAvatar } from "./avatar.js";

test("avatar", async () => {
  await matchScreenshot(mount(createAvatar("Ada Lovelace")));
});
