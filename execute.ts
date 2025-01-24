import { Stagehand } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config.js";

export async function runStagehand({
  sessionID,
  method,
  instruction,
}: {
  sessionID: string;
  method: "GOTO" | "ACT" | "EXTRACT" | "CLOSE" | "SCREENSHOT" | "OBSERVE";
  instruction?: string;
}) {
  const stagehand = new Stagehand({
    ...StagehandConfig,
    browserbaseSessionID: sessionID,
  });
  await stagehand.init();

  const page = stagehand.page;
  const context = stagehand.context;

  if (method === "GOTO") {
    await page.goto(instruction!);
  }
  if (method === "ACT") {
    await page.act(instruction!);
  }
  if (method === "EXTRACT") {
    await page.extract(instruction!);
  }
  if (method === "OBSERVE") {
    await page.observe({
      instruction,
      useAccessibilityTree: true,
    });
  }
  if (method === "CLOSE") {
    await stagehand.close();
  }

  if (method === "SCREENSHOT") {
    const buffer = await page.screenshot();
    return buffer.toString("base64");
  }
}
