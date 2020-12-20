import * as core from "@actions/core";
import { mergeOrPr } from "./merge-or-pr";

async function run() {
  try {
    await mergeOrPr();
  } catch (error) {
    core.setFailed(error.message);
  }
}
run();
