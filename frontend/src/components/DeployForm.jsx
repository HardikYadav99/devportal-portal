function DeployForm({
    repoUrl,
    setRepoUrl,
    handleDeploy,
    loading,
    appName,
    setAppName,

}) {

    return (
        <div className="deploy-form">
            
            <input className="repo-input"
                type="text"
                placeholder="Paste your GitHub Repo Link here"
                value={repoUrl}
                onChange={(e) => {
                    setRepoUrl(e.target.value)
                    console.log("Repo Url:", e.target.value)
                }}

            />
        
             <input 
               className="repo-input"
               type="text"
               placeholder="Application Name (e.g. ecommerce)"
               value={appName}
               onChange={(e) => {
                   setAppName(e.target.value);
                   console.log("App Name: ", e.target.value);
                }}
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