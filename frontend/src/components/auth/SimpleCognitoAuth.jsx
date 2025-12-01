import { useAuth } from "react-oidc-context";

/**
 * Componente simplificado de autenticación con Cognito
 * 
 * Configuración necesaria en .env:
 * - VITE_COGNITO_DOMAIN: https://us-east-2bm8g4vufz.auth.us-east-2.amazoncognito.com
 * - VITE_COGNITO_CLIENT_ID: Tu Client ID de Cognito
 * - VITE_COGNITO_REDIRECT_URI: http://localhost:5173 (o tu CloudFront URL)
 * - VITE_COGNITO_LOGOUT_URI: http://localhost:5173 (o tu CloudFront URL)
 */

function SimpleCognitoAuth() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI || "http://localhost:5173";
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Error: {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <h2>Bienvenido, {auth.user?.profile.email}</h2>

        <p>ID Token:</p>
        <pre>{auth.user?.id_token}</pre>

        <p>Access Token:</p>
        <pre>{auth.user?.access_token}</pre>

        <button onClick={signOutRedirect}>Cerrar sesión</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Iniciar sesión</button>
    </div>
  );
}

export default SimpleCognitoAuth;
