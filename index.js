const core = require("@actions/core");
const github = require("@actions/github");

let githubClient;

const getGithubClient = async (token) => {
  if (!githubClient) {
    githubClient = await github.getOctokit(token);
  }
  return getGithubClient;
};

const exec = async () => {
  const token = core.getInput("token");
  if (!token) throw new Error("You should provide a personal github token");

  //const client = await getGithubClient(token);
  console.log(JSON.stringify(github.context));
  const baseBranch = core.getInput("baseBranch");

  if (!baseBranch)
    throw new Error("You are missing the base branch as parameter");

  return "action finished";
};

exec()
  .then((output) => core.setOutput("result", output))
  .catch((err) => core.setFailed(err.message));
