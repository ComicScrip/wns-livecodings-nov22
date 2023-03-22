import { test, expect } from "@playwright/test";
import db from "../../server/src/db";
import Wilder from "../../server/src/entity/Wilder";
import { clearDB, connect, disconnect } from "./dbHelpers";

test.beforeAll(connect);
test.beforeEach(clearDB);
test.afterAll(disconnect);

test("can view wilders in db", async ({ page }) => {});

test("can add a wilder", async ({ page }) => {});
