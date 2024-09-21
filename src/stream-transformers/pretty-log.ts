import {
  bold,
  cyan,
  gray,
  green,
  magenta,
  red,
  reset,
  yellow,
} from "@std/fmt/colors";
import { safeJsonParse, safeUpercase } from "../utils.ts";
import type { PrettyLogsRuntime } from "../types.ts";

const levelColor = {
  INFO: cyan,
  CRITICAL: (str: string) => bold(red(str)),
  DEBUG: magenta,
  ERROR: red,
  WARN: yellow,
  NOTSET: reset,
};

export class PrettyLogTransformStream extends TransformStream<string, string> {
  constructor({ inspect }: { inspect: PrettyLogsRuntime["inspect"] }) {
    super({
      transform: (line, controller) => {
        const jsonParsed = safeJsonParse(line);

        if (!jsonParsed || typeof jsonParsed !== "object") {
          controller.enqueue(line);
          controller.enqueue("\n");

          return;
        }

        const { datetime, name, level, message, ...rest } = jsonParsed;

        const logParts = [];

        if (datetime) logParts.push(gray(`[${datetime}]`));
        if (name) logParts.push(green(`(${name})`));
        if (level) {
          logParts.push(
            (levelColor[safeUpercase(level) as keyof typeof levelColor] ??
              reset)(
                `${level}`,
              ),
          );
        }
        if (message) logParts.push(reset(message));
        logParts.push(
          reset(
            `${Object.keys(rest ?? {}).length > 0 ? `\n${inspect(rest)}` : ""}`,
          ),
        );

        controller.enqueue(logParts.join(" "));
        controller.enqueue("\n");
      },
    });
  }
}
