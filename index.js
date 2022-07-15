const core = require("@actions/core");
const github = require("@actions/github");

let client;

const getOpenedPrs = async (baseBranch) => {
  const prs = await client.request("GET /repos/{owner}/{repo}/pulls", {
    owner: github.context.payload.repository.owner.name,
    repo: github.context.payload.repository.name,
    state: "open",
    base: baseBranch,
  });
  return prs.data;
};

const updatePRBranch = async (pr) => {
  await client.request(
    "PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch",
    {
      owner: github.context.payload.repository.owner.name,
      repo: github.context.payload.repository.name,
      pull_number: pr.number,
      expected_head_sha: pr.head.sha,
    }
  );
};

const exec = async () => {
  const token = core.getInput("token");
  if (!token) throw new Error("You should provide a personal github token");

  client = await github.getOctokit(token);
  if (!client) throw new Error("Invalid personal access token");

  const baseBranch = core.getInput("baseBranch");
  if (!baseBranch)
    throw new Error("You are missing the base branch as parameter");

  const prs = await getOpenedPrs();
  let updated = 0;
  let failed = 0;

  for (const pr of prs) {
    console.log(
      `Updating the pull request #${pr.number} (${pr.title}) with the base branch ${pr.base.ref}`
    );
    try {
      await updatePRBranch(pr);
      updated++;
    } catch (err) {
      console.log(
        `The pr #${pr.number} with title "${pr.title}" can't be synched due to ${err.message}`
      );
    }
  }
  const result = `Updated ${updated} pull requests, failed ${failed}`;
  return result;
};

exec()
  .then((output) => core.setOutput("result", output))
  .catch((err) => core.setFailed(err.message));
