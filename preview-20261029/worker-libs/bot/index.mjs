import * as program from "./bend-106a48b57f632299.program.mjs";
import {createWorkerSession} from "./bend-106a48b57f632299.runtime.mjs";
export const manifest = program.manifest;
export function createSession(options = {}) {
  return createWorkerSession(program, new URL("./bend-106a48b57f632299.worker.mjs", import.meta.url), options);
}
