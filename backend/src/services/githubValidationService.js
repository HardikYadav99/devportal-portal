const axios = require("axios");

const validateGithubRepo = async (repoUrl) => {
    const parts = repoUrl.split("/");

    const owner = parts[3];
    const repo = parts[4].replace(".git","");

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    try {

        const response = await axios.get(githubApiUrl);

        return {
            valid: true,
            data: response.data
        };
    } catch (error) {
        return {
            valid: false
        }; 
    }
};

const validateDockerfile = async (repoUrl) => {
    const parts = repoUrl.split("/");

    const owner = parts[3];
    const repo = parts[4].replace(".git","");

    const dockerfileApiUrl =
    `https://api.github.com/repos/${owner}/${repo}/contents/Dockerfile`;

    console.log("Checking Dockerfile:", dockerfileApiUrl);

    try {
        await axios.get(dockerfileApiUrl);

        return true;

    } catch(error) {

        return false
    }
};

module.exports = {
    validateGithubRepo,
    validateDockerfile
};
