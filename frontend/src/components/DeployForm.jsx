function DeployForm({
    repoUrl,
    setRepoUrl,
    handleDeploy,
    loading
}) {

    return (
        <div className="deploy-form">
            
            <input className="repo-input"
                type="text"
                placeholder="Paste your GitHub Repo Link here"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}

            />

            <button className="deploy-button"
                onClick={handleDeploy}
                disabled={loading}
            >
                {loading ? "Deploying...": "Deploy"}
            </button>

        </div>
    );
}

export default DeployForm;