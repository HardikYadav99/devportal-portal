import { useState } from "react";

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
    <div>
      <h1>DevPortal</h1>

      <input
      type="text"
      placeholder="Enter GitHub Repository URL"
      value={repoUrl}
      onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button onClick={handleDeploy} disabled={loading}>
      {loading ? "Deploying..." : "Deploy"}
      <p>{message}</p>
      </button>
    </div>
  );
}

export default App;