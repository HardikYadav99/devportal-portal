import { useState } from "react";
import Header from "./components/Header"
import DeployForm from "./components/DeployForm";
import StatusMessage from "./components/StatusMessage";
import RequirementsTerminal from "./components/RequirementsTerminal";


function App() {

  const [repoUrl, setRepoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [appName, setAppName] = useState("");

  const handleDeploy = async() => {

    if(!repoUrl || !appName) {
      setMessage("Repository URL and Application Name are required");
      return;
    }
    
    const appNameRegex = /^[a-z0-9-]+$/;
    
    if(!appNameRegex.test(appName)) {
      setMessage(
        "Application name must contain lowercase letters, numbers and hyphens"
      );
      return;
    }

    console.log("Repo Url: ", repoUrl);
    console.log("App Name:", appName);

    setLoading(true);

    const response = await fetch ("http://localhost:5050/deploy", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        repoUrl: repoUrl,
        appName: appName,
      }),  
    });

    const data = await response.json();

    setMessage(data.message);
    if (data.success){
      setRepoUrl("");
      setAppName("");
    }

    setLoading(false);
  };

  return (
    <div className="app-layout">
      <Header />

    <div className="main-content">

    <div className="deploy-section">
      <DeployForm
          repoUrl={repoUrl}
          setRepoUrl={setRepoUrl}
          handleDeploy={handleDeploy}
          loading={loading}
          appName={appName}
          setAppName={setAppName}
      />

      <StatusMessage message={message} />

      </div>
      <div className="terminal-section">
      <RequirementsTerminal />
      </div>
      </div>
      </div>
      
  );
}
export default App;