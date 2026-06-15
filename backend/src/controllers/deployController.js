


const { triggerGithubWorkflow } = require("../services/githubService");

const deployRepo = async (req, res) => {

    const repoUrl = req.body.repoUrl;
    console.log("Deployment Request Recieved for:", repoUrl);

    if(!repoUrl.includes("github.com")) {
            return res.status(400).json({
                success: false,
                message:"Please Enter a valid github url"
            });
        }

        const parts = repoUrl.split("/");

        if (parts.length < 5) {

            console.log("Incomplete Github repository URL ");

            return res.status(400).json({
                success: false,
                message: "Please enter compelete Github Repository URL"
        });
        }

    try {
        await triggerGithubWorkflow(repoUrl);

        console.log("Recieved Data:", repoUrl);

        res.json({
            success: true,
            message: "GitHub action is trigger successfully"
        });

    } catch ( error ) {
        console.error(
            "Deployment Error:",
            error.response?.data || error.message
            );

        res.status(500).json({
            success: false,
            message: "Failed to trigger workflow"
        });
    }
};

module.exports = {
    deployRepo
};