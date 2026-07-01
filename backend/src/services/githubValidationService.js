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

const checkFileExists = async ( owner, repo, path) => {
    const url =
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    
    try {
        await axios.get(url);

        return true;
    } catch (error) {
        return false;
    }

};


const validateDockerfiles = async (repoUrl) => {
    const parts = repoUrl.split("/");

    const owner = parts[3];
    const repo = parts[4].replace(".git","");

    const [frontendExists, backendExists] = await Promise.all([
        checkFileExists(owner,repo, "frontend/Dockerfile"),
        checkFileExists(owner,repo,"backend/Dockerfile")
    ]);
    return {
        frontendExists,
        backendExists,
        hasdockerfile: frontendExists || backendExists

    }
    
};

module.exports = {
    validateGithubRepo,
    validateDockerfiles
};
