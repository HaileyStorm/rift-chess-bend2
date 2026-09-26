import * as program from "./bend-77d80270fe5ce1c4.program.mjs";
import {createWorkerSession} from "./bend-77d80270fe5ce1c4.runtime.mjs";
export const manifest = program.manifest;
export function createSession(options = {}) {
  return createWorkerSession(program, new URL("./bend-77d80270fe5ce1c4.worker.mjs", import.meta.url), options);
}
