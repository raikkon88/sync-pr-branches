const core = require("@actions/core");
const github = require("@actions/github");

let githubClient;

const getGithubClient = async () => {
  if (!githubClient) {
    const token = core.getInput("token");
    if (!token) throw new Error("You should provide a personal github token");
    githubClient = await github.getOctokit(token);
  }
  return getGithubClient;
};

const getOpenedPrs = async (baseBranch) => {
  const client = await getGihubClient();
  const prs = await client.request("GET /repos/{owner}/{repo}/pulls", {
    owner: github.context.payload.repository.owner.name,
    repo: github.context.payload.repository.name,
    state: "open",
    base: baseBranch,
  });
  return prs.data;
};

const exec = async () => {
  const baseBranch = core.getInput("baseBranch");
  if (!baseBranch)
    throw new Error("You are missing the base branch as parameter");

  const prs = await getOpenedPrs();
  console.log(prs);

  return "action finished";
};

exec()
  .then((output) => core.setOutput("result", output))
  .catch((err) => core.setFailed(err.message));
