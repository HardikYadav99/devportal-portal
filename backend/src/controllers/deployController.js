const { triggerGithubWorkflow } = require("../services/githubService");

const deployRepo = async (req, res) => {

    const repo_url = req.body.repoUrl;

    try {
        await triggerGithubWorkflow(repoUrl);

        console.log("Recieved Data:", repoUrl);

        res.json({
            success: true,
            message: "GitHub action is trigger successfully"
        });

    } catch ( error ) {
        console.error(error.response?.data || error.message );

        res.status(500).json({
            success: false,
            message: "Failed to trigger workflow"
        });
    }
};

module.exports = {
    deployRepo
};