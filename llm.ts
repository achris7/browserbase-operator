import { anthropic } from "@ai-sdk/anthropic";
import { CoreMessage, generateObject, UserContent } from "ai";
import { z } from "zod";
import { runStagehand } from "./execute.js";

const LLMClient = anthropic("claude-3-5-sonnet-latest");

type Step = {
  text: string;
  reasoning: string;
  tool: "GOTO" | "ACT" | "EXTRACT" | "OBSERVE" | "CLOSE";
  instruction: string;
};

export async function sendPrompt({
  goal,
  sessionID,
  previousSteps = [],
  previousExtraction,
}: {
  goal: string;
  sessionID: string;
  previousSteps?: Step[];
  previousExtraction?: string;
}) {
  const content: UserContent = [
    {
      type: "text",
      text: `Consider the following screenshot of a web page, with the goal being "${goal}".
${
  previousSteps.length > 0
    ? `
Previous steps taken:
${previousSteps
  .map(
    (step, index) => `
Step ${index + 1}:
- Action: ${step.text}
- Reasoning: ${step.reasoning}
- Tool Used: ${step.tool}
- Instruction: ${step.instruction}
`
  )
  .join("\n")}`
    : ""
}
Determine the immediate next step to take to achieve the goal. 
If the goal has been achieved, return "close".`,
    },
    {
      type: "image",
      image: (await runStagehand({
        sessionID,
        method: "SCREENSHOT",
      })) as string,
    },
  ];

  if (previousExtraction) {
    content.push({
      type: "text",
      text: `The result of the previous extraction is: ${previousExtraction}.`,
    });
  }

  const message: CoreMessage = {
    role: "user",
    content,
  };

  const result = await generateObject({
    model: LLMClient,
    schema: z.object({
      text: z
        .string()
        .describe(
          "The text to display. If the goal has been achieved and has an output, share it here. Otherwise use this to provide details about your observations. If you used an extraction, share what that extraction was here."
        ),
      reasoning: z
        .string()
        .describe(
          "The reasoning behind the tool call. If the tool is 'CLOSE', this should explain how and why the goal has been achieved."
        ),
      tool: z.enum(["GOTO", "ACT", "EXTRACT", "OBSERVE", "CLOSE"])
        .describe(`Use the following guidelines to pick which tool to use:
          GOTO: Navigate to a URL.
          ACT: Perform an action on the page.
          EXTRACT: Extract data from the page. Use this when you need to get information from the page, don't solely rely on a screenshot. If you choose this tool you will be provided with the result of the extraction.
          OBSERVE: Observe the potential actions on the page.
          CLOSE: Close the browser once the goal has been achieved.`),
      instruction: z
        .string()
        .describe(
          "The instruction to display, i.e. the url to navigate to, the action to perform, the data to extract, the observation to make, etc. If the tool is 'CLOSE', this should be an empty string."
        ),
    }),
    messages: [message],
  });

  return {
    result: result.object,
    previousSteps: [...previousSteps, result.object],
  };
}
