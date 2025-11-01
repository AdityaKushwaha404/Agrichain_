import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import LandingPage from './pages/LandingPage';
import TransparencyPage from './pages/TransparencyPage';
import SupplyChainDashboard from './pages/SupplyChainDashboard';
import BatchManagementPage from './pages/BatchManagementPage';
import TraceabilityExplorerPage from './pages/TraceabilityExplorerPage';
import TransferManagementPage from './pages/TransferManagementPage';
import MLAnalyticsPage from './pages/MLAnalyticsPage';
import QualityPricingPage from './pages/QualityPricingPage';
import QRCodeGeneratorPage from './pages/QRCodeGeneratorPage';
import RoleManagementPage from './pages/RoleManagementPage';
import ReportsInsightsPage from './pages/ReportsInsightsPage';
import BatchMLAnalytics from './components/BatchMLAnalytics';
import MLAnalytics from './components/MLAnalytics';
import RoleManager from './components/RoleManager';
import BatchForm from './components/BatchForm';
import BatchDetails from './components/BatchDetails';
import TransferForm from './components/TransferForm';
import TraceabilityView from './components/TraceabilityView.jsx';
import QRCodeDisplay from './components/QRCodeDisplay';
import PriceQualityForm from './components/PriceQualityForm';



function Dashboard() {
  const [qrBatchId, setQrBatchId] = useState(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const batchId = params.get('batchId');
    if (batchId) setQrBatchId(batchId);
  }, []);
  return (
    <div>
      <h1>AgriTrace Supply Chain Transparency</h1>
      <p>Welcome to the blockchain-based agricultural produce traceability platform.</p>
      {!qrBatchId && <>
        <BatchForm />
        <BatchDetails />
        <TransferForm />
        <PriceQualityForm />
        <RoleManager />
        <MLAnalytics />
        <BatchMLAnalytics />
      </>}
      <TraceabilityView initialBatchId={qrBatchId} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/transparency"
          element={
            <>
              <SignedIn>
                <SupplyChainDashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/transparency/legacy"
          element={
            <>
              <SignedIn>
                <TransparencyPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} />
              </SignedOut>
            </>
          }
        />
        <Route path="/transparency/batch-management" element={<>
          <SignedIn><BatchManagementPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
        <Route path="/transparency/traceability" element={<>
          <SignedIn><TraceabilityExplorerPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
        <Route path="/transparency/transfers" element={<>
          <SignedIn><TransferManagementPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
        <Route path="/transparency/analytics" element={<>
          <SignedIn><MLAnalyticsPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
        <Route path="/transparency/quality-pricing" element={<>
          <SignedIn><QualityPricingPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
        <Route path="/transparency/qr-codes" element={<>
          <SignedIn><QRCodeGeneratorPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
        <Route path="/transparency/roles" element={<>
          <SignedIn><RoleManagementPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
        <Route path="/transparency/reports" element={<>
          <SignedIn><ReportsInsightsPage /></SignedIn>
          <SignedOut><RedirectToSignIn redirectUrl={typeof window !== 'undefined' ? window.location.href : '/'} /></SignedOut>
        </>} />
      </Routes>
    </Router>
  );
}

export default App;
