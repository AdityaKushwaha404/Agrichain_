import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ClerkProvider } from '@clerk/clerk-react';

// Import your Publishable Key from env (CRA exposes REACT_APP_*)
// Prefer env var; fall back to known test key provided for development only
const PUBLISHABLE_KEY =
  process.env.REACT_APP_CLERK_PUBLISHABLE_KEY ||
  'pk_test_Y29uY3JldGUtb3dsLTU0LmNsZXJrLmFjY291bnRzLmRldiQ';

// Note: CRA needs a server restart to pick up new env vars.

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
