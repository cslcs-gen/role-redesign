import { useMemo, useState } from 'react';
import Header from '../components/layout/Header.jsx';
import ShareCodeGate from '../components/auth/ShareCodeGate.jsx';
import ApprovalWaitingScreen from '../components/auth/ApprovalWaitingScreen.jsx';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen.jsx';
import ResultsDashboard from '../components/output/ResultsDashboard.jsx';
import AdminDashboard from '../components/admin/AdminDashboard.jsx';
import MultiStepForm from '../components/form/MultiStepForm.jsx';
import RoleCatalogBrowser from '../components/form/RoleCatalogBrowser.jsx';
import { requestAccess, analyseRole } from '../lib/apiClient.js';
import { useApprovalPolling } from '../hooks/useApprovalPolling.js';
import { mockOutputs } from '../data/mockOutputs.js';

export default function App() {
  const [authState, setAuthState] = useState('locked');
  const [sessionId, setSessionId] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisOutput, setAnalysisOutput] = useState(null);
  const [analysisError, setAnalysisError] = useState('');
  
  // Set default initial selection
  const [catalogSelection, setCatalogSelection] = useState({
    pillar: 'Policy Pillar',
    group: 'Regulation Group (RG)',
    role: 'Regulatory Policy Officer'
  });

  const activeOutput = useMemo(() => {
    if (!catalogSelection) return null;
    return mockOutputs.generate(catalogSelection.role, catalogSelection.group);
  }, [catalogSelection]);

  const isAdmin = typeof window !== 'undefined' && window.location.pathname === '/admin';

  useApprovalPolling(
    sessionId,
    authState === 'pending',
    (status) => {
      if (status === 'approved') setAuthState('approved');
      if (status === 'denied') setAuthState('denied');
    },
    (message) => setAuthError(message)
  );

  const handleUnlockRequest = async (shareCode) => {
    try {
      setAuthLoading(true);
      setAuthError('');
      const result = await requestAccess(shareCode);
      setSessionId(result.sessionId);
      setAuthState('pending');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAnalysisSubmit = async (formState) => {
    try {
      setAnalysisLoading(true);
      setAnalysisError('');
      const result = await analyseRole(formState);
      setAnalysisOutput(result);
    } catch (error) {
      setAnalysisError(error.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  if (isAdmin) {
    return (
      <main className="app-shell">
        <Header />
        <AdminDashboard />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <Header />
      
      <RoleCatalogBrowser onSelectRole={setCatalogSelection} />
      
      {catalogSelection && activeOutput ? (
        <ResultsDashboard 
          role={{ title: catalogSelection.role, summary: `${catalogSelection.group} · ${catalogSelection.pillar}` }} 
          output={activeOutput} 
        />
      ) : null}

      {authState === 'locked' && <ShareCodeGate onUnlockRequest={handleUnlockRequest} error={authError} loading={authLoading} />}
      {authState === 'pending' && <ApprovalWaitingScreen />}
      {authState === 'denied' && <AccessDeniedScreen />}
      {authState === 'approved' && (
        <>
          <MultiStepForm onSubmit={handleAnalysisSubmit} loading={analysisLoading} />
          {analysisError && <p className="error-text">{analysisError}</p>}
          {analysisOutput && (
            <ResultsDashboard 
              role={{ title: analysisOutput.suggestedTitle, summary: 'Generated analysis output' }} 
              output={analysisOutput} 
            />
          )}
        </>
      )}
    </main>
  );
}
