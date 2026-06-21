const axios = require("axios");

const triggerDeleteWorkflow = async (
    appName
) => {
    console.log(
        "Triggering Delete Workflow",
        appName
    );

    await axios.post(
        "https://api.github.com/repos/HardikYadav99/devoportal-portal/actions/workflow/deletea-app.yaml/dispatches",
        {
            ref: "main",
            inputs: {
                app_name: appName,
            },
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
        }
    );
};

module.exports = {
    triggerDeleteWorkflow,
};