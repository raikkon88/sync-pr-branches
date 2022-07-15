const core = require("@actions/core");
const github = require("@actions/github");

const showHello = (baseBranch, token) => {
  console.log(`hello ${target} with ${token}`);
};

const exec = async () => {
  const baseBranch = core.getInput("baseBranch");
  const token = core.getInput("token");

  if (!baseBranch || !token)
    throw new Error("You are missing base branch or token");
  return showHello(baseBranch, token);
};

exec()
  .then((output) => core.setOutput(output))
  .catch((err) => core.setFailed(err.message));
