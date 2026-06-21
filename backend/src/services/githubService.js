

const axios = require("axios");

const triggerGithubWorkflow = async (
    repoUrl,
    appName
    ) => {
      console.log("Triggering Github Workflow...");
    await axios.post(
        "https://api.github.com/repos/HardikYadav99/devportal-portal/actions/workflows/app-deploy.yaml/dispatches",
        {
            ref: "main",
            inputs: {
                repo_url: repoUrl,
                app_name: appName
            }
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        }
    );
};

module.exports = {
    triggerGithubWorkflow
};