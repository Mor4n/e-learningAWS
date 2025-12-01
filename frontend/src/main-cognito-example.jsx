import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import { cognitoConfig } from './config/cognito';
import App from './App';
import './index.css';

/**
 * EJEMPLO DE CONFIGURACIÓN CON COGNITO
 * 
 * Para usar Cognito en lugar del sistema de autenticación actual:
 * 
 * 1. Instalar dependencia:
 *    npm install react-oidc-context
 * 
 * 2. Configurar variables de entorno en .env:
 *    VITE_COGNITO_DOMAIN=https://tu-dominio.auth.us-east-1.amazoncognito.com
 *    VITE_COGNITO_CLIENT_ID=tu-client-id
 *    VITE_COGNITO_REDIRECT_URI=http://localhost:5173
 *    VITE_COGNITO_LOGOUT_URI=http://localhost:5173
 * 
 * 3. Renombrar este archivo de:
 *    main-cognito-example.jsx → main.jsx
 *    (y renombrar el main.jsx actual a main-original.jsx)
 * 
 * 4. Actualizar App.jsx para usar CognitoAuthProvider y CognitoLogin
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider {...cognitoConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
