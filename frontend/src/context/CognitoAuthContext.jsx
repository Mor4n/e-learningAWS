import { createContext, useContext } from 'react';
import { useAuth } from 'react-oidc-context';
import { getLogoutUrl } from '../config/cognito';

const CognitoAuthContext = createContext(null);

export const CognitoAuthProvider = ({ children }) => {
  const auth = useAuth();

  const signOutRedirect = () => {
    const logoutUrl = getLogoutUrl();
    // Limpiar localStorage antes de redirigir
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = logoutUrl;
  };

  const getUserInfo = () => {
    if (!auth.isAuthenticated || !auth.user) return null;

    return {
      userId: auth.user.profile.sub,
      email: auth.user.profile.email,
      name: auth.user.profile.name || auth.user.profile.email,
      idToken: auth.user.id_token,
      accessToken: auth.user.access_token,
    };
  };

  const value = {
    // Estados
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    error: auth.error,
    user: getUserInfo(),
    
    // Métodos
    signIn: () => auth.signinRedirect(),
    signOut: signOutRedirect,
    
    // Tokens
    getIdToken: () => auth.user?.id_token,
    getAccessToken: () => auth.user?.access_token,
    
    // Auth object completo por si se necesita
    authContext: auth,
  };

  return (
    <CognitoAuthContext.Provider value={value}>
      {children}
    </CognitoAuthContext.Provider>
  );
};

export const useCognitoAuth = () => {
  const context = useContext(CognitoAuthContext);
  if (!context) {
    throw new Error('useCognitoAuth must be used within CognitoAuthProvider');
  }
  return context;
};
