// Configuración de AWS Cognito para OIDC
export const cognitoConfig = {
  authority: import.meta.env.VITE_COGNITO_DOMAIN,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI || 'http://localhost:5173',
  response_type: 'code',
  scope: 'openid email profile',
  
  // URLs de Cognito
  metadata: {
    authorization_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/oauth2/userInfo`,
    end_session_endpoint: `${import.meta.env.VITE_COGNITO_DOMAIN}/logout`,
  },

  // Configuración adicional
  automaticSilentRenew: true,
  loadUserInfo: true,
  
  // Callback después de login/logout
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

// Función para construir URL de logout
export const getLogoutUrl = () => {
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
  const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI || 'http://localhost:5173';
  const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;

  return `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};
