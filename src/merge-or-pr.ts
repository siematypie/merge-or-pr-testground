import * as core from "@actions/core";
import * as github from "@actions/github";

export async function mergeOrPr() {
  const myToken = core.getInput("repo_token");
  const headToMerge = core.getInput("sha_to_merge") || github.context.sha;
  const target = core.getInput("target_branch");
  const repo = github.context.repo;
  const octokit = github.getOctokit(myToken);
  const mergeBranch = core
    .getInput("merge_branch_name")
    .replace("refs/heads/", "");
  let createPr = false;
  try {
    await octokit.repos.merge({
      repo: repo.repo,
      owner: repo.owner,
      base: target,
      head: headToMerge,
    });
  } catch (error) {
    if (error.name !== "HttpError" || error.status !== 409) {
      throw Error(error);
    }
    createPr = true;
  }
  if (createPr) {
    await octokit.git.createRef({
      repo: repo.repo,
      owner: repo.owner,
      sha: headToMerge,
      ref: `refs/heads/${mergeBranch}`,
    });
  }
}
