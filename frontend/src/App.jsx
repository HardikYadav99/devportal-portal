import { useState } from "react";
import Header from "./components/Header"
import DeployForm from "./components/DeployForm";
import StatusMessage from "./components/StatusMessage";
import RequirementsTerminal from "./components/RequirementsTerminal";


function App() {

  const [repoUrl, setRepoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeploy = async() => {
    
    setLoading(true);

    const response = await fetch ("http://localhost:5050/deploy", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        repoUrl: repoUrl,
      }),  
    });

    const data = await response.json();

    setMessage(data.message);

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