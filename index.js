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

const exec = async () => {
  const token = core.getInput("token");
  if (!token) throw new Error("You should provide a personal github token");

  client = await github.getOctokit(token);
  console.log(JSON.stringify(client));
  if (!client) throw new Error("Invalid personal token");

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
