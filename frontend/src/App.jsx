import { useState } from "react";
import Header from "./components/Header";
import DeployForm from "./components/DeployForm";
import StatusMessage from "./components/StatusMessage";
import RequirementsTerminal from "./components/RequirementsTerminal";
import ApplicationsList from "./components/ApplicationsList";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [appName, setAppName] = useState("");
  const [applications, setApplications] = useState([]);

  const handleDeploy = async () => {
    if (!repoUrl || !appName) {
      setMessage("Repository URL and Application Name are required");
      return;
    }

    const appNameRegex = /^[a-z0-9-]+$/;

    if (!appNameRegex.test(appName)) {
      setMessage(
        "Application name must contain lowercase letters, numbers and hyphens"
      );
      return;
    }

    console.log("Repo Url:", repoUrl);
    console.log("App Name:", appName);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5050/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoUrl,
          appName,
        }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (data.success) {
        setApplications([
          ...applications,
          {
            name: appName,
            url: `https://${appName}.hardikdevportal.duckdns.org`,
          },
        ]);

        setRepoUrl("");
        setAppName("");
      }
    } catch (error) {
      console.error(error);
      setMessage("Deployment failed");
    }

    setLoading(false);
  };

  const handleDelete = async (appName) => {
    try {
      const response = await fetch(
        `http://localhost:5050/apps/${appName}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (data.success) {
        setApplications(
          applications.filter(
            (app) => app.name !== appName
          )
        );
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to delete the application");
    }
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

          <ApplicationsList
            applications={applications}
            handleDelete={handleDelete}
          />
        </div>

        <div className="terminal-section">
          <RequirementsTerminal />
        </div>
      </div>
    </div>
  );
}

export default App;