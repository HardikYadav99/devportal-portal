

const {
     validateGithubRepo,
     validateDockerfile
    } = require("../services/githubValidationService");

const { triggerGithubWorkflow } = require("../services/githubService");

const deployRepo = async (req, res) => {

    const repoUrl = req.body.repoUrl;

    

    console.log("\nDeployment Request Recieved for:",)
    console.log(repoUrl);

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

        const validationResult = await validateGithubRepo(repoUrl);

        console.log("GitHub Repository Validated Successfully")

        if(!validationResult.valid) {
            return res.status(400).json({
                success: false,
                message: "Github Repo didnt exist"
            });
        }

        const dockerfileExists = await validateDockerfile(repoUrl);

        console.log("Docker File Existence Validation Successful")

        if (!dockerfileExists) {
            return res.status(400).json({
                success: false,
                message: "Docker File not found in the repository"
            })
        }
    try {
        console.log("Triggering GitHub workflow...");
        
        await triggerGithubWorkflow(repoUrl);

        console.log("Github workflow triggered Successfully")



        res.json({
            success: true,
            message: "Deployment Started Successfully"
        });

    } catch ( error ) {
        console.error(
            "Deployment Error:",
            error.response?.data || error.message
            );

        res.status(500).json({
            success: false,
            message: "Deployment service temporarily unavailable"
        });
    }
};

module.exports = {
    deployRepo
};