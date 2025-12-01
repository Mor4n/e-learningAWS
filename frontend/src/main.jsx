import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from 'react-oidc-context'
import './index.css'
import App from './App.jsx'

// Configuración de AWS Cognito con OIDC
const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const redirectUri = import.meta.env.VITE_COGNITO_REDIRECT_URI;

const cognitoConfig = {
  authority: cognitoDomain,
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'openid email profile',
  
  // Endpoints de Cognito
  metadata: {
    issuer: cognitoDomain,
    authorization_endpoint: `${cognitoDomain}/oauth2/authorize`,
    token_endpoint: `${cognitoDomain}/oauth2/token`,
    userinfo_endpoint: `${cognitoDomain}/oauth2/userInfo`,
    end_session_endpoint: `${cognitoDomain}/logout`,
    jwks_uri: `${cognitoDomain}/.well-known/jwks.json`,
  },
  
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

console.log('Cognito Config:', {
  domain: cognitoDomain,
  clientId: clientId,
  redirectUri: redirectUri
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider {...cognitoConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
