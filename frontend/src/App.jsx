import { useState } from 'react';
import Navbar        from './components/Navbar';
import HeroSection   from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import WorkflowSection from './components/WorkflowSection';
import PipelineFlow  from './components/PipelineFlow';
import DeploySection from './components/DeploySection';
import FooterSection from './components/FooterSection';

export default function App() {
  const [repoUrl,      setRepoUrl]      = useState('');
  const [appName,      setAppName]      = useState('');
  const [message,      setMessage]      = useState('');
  const [loading,      setLoading]      = useState(false);
  const [applications, setApplications] = useState([]);

  const handleDeploy = async () => {
    if (!repoUrl || !appName) { setMessage('Repository URL and Application Name are required'); return; }
    if (!/^[a-z0-9-]+$/.test(appName)) { setMessage('App name: lowercase letters, numbers and hyphens only'); return; }
    setLoading(true); setMessage('');
    try {
      const res  = await fetch('http://localhost:5050/deploy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ repoUrl, appName }) });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        setApplications(prev => [...prev, { name: appName, url: `https://${appName}.hardikdevportal.duckdns.org` }]);
        setRepoUrl(''); setAppName('');
      }
    } catch { setMessage('Deployment failed — is the backend running on port 5050?'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (name) => {
    try {
      const res  = await fetch(`http://localhost:5050/apps/${name}`, { method: 'DELETE' });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) setApplications(prev => prev.filter(a => a.name !== name));
    } catch { setMessage('Failed to delete the application'); }
  };

  return (
    <div style={{ background: '#040D18', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DeploySection
        repoUrl={repoUrl}      setRepoUrl={setRepoUrl}
        appName={appName}      setAppName={setAppName}
        handleDeploy={handleDeploy}
        loading={loading}      message={message}
        applications={applications} handleDelete={handleDelete}
      />
      <WorkflowSection />
      <PipelineFlow />
      <FooterSection />
    </div>
  );
}
