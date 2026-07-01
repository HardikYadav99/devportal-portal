

const {
     validateGithubRepo,
     validateDockerfiles
    } = require("../services/githubValidationService");

const { triggerGithubWorkflow } = require("../services/githubService");

const deployRepo = async (req, res) => {

    const {repoUrl, appName } = req.body;

    const appNameRegex = /^[a-z0-9-]+$/;

//TODO: In later model shift app validation in another file of services to keep deploy controller clean. 

    console.log("\nDeployment Request Recieved for:",)
    console.log("Repository URL:", repoUrl);
    console.log("App Name:", appName);

    if (!appName){
        return res.status(400).json({
            success: false,
            message: "Application name is required"
        });
    }
    if (!appNameRegex.test(appName)) {
        return res.status(400).json({
            success: false,
            message:
                "Application name can only contain lowercase letters, numbers and hyphens"
        });
    }
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

        const dockervalidation = await validateDockerfiles(repoUrl);

        {`console.log("Docker File Existence validation successfull )
        
        if(!dockervalidation.hasDockerfile) {
            return res.status(400).json({
                success: false
                message: "Repository does not seem to have Dockerfile, reppository should contain either frontend/Dockerfile or backend/Docker. If deploying full stack it should have both"
            });
        }`}
    try {
        console.log("Triggering GitHub workflow...");
        
        await triggerGithubWorkflow(
            repoUrl,
            appName
            );

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