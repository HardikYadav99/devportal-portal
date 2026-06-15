const axios = require("axios");

const triggerGithubWorkflow = async (repoUrl) => {

    await axios.post(
        "https://api.github.com/repos/HardikYadav99/devportal-portal/actions/workflow/ingest.yaml/dispatches",
        {
            ref: "main",
            inputs: {
                repo_Url: repoUrl
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