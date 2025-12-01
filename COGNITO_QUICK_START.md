# 🚀 Guía Rápida - Cognito en 5 minutos

## 📍 Estado Actual

Ya tienes configurado:
- ✅ Dominio de Cognito: `https://us-east-2bm8g4vufz.auth.us-east-2.amazoncognito.com`
- ⏳ Client ID: **Pendiente**

## 🎯 Paso 1: Obtener Client ID (2 minutos)

1. Ve a: https://us-east-2.console.aws.amazon.com/cognito/v2/idp/user-pools
2. Selecciona tu User Pool
3. Pestaña **"App integration"**
4. Sección **"App client list"** → Clic en tu app client
5. **Copia el "Client ID"** (ejemplo: `7kp2m3n4o5p6q7r8s9t0u1v2w3`)

### Actualizar .env:

```env
VITE_COGNITO_CLIENT_ID=7kp2m3n4o5p6q7r8s9t0u1v2w3
```

---

## 🎯 Paso 2: Configurar Callback URLs (1 minuto)

En el mismo **App client**, clic en **"Edit"**:

### Allowed callback URLs:
```
http://localhost:5173
http://localhost:5173/callback
```

### Allowed sign-out URLs:
```
http://localhost:5173
http://localhost:5173/logout
```

### OAuth 2.0 grant types:
- ✅ Authorization code grant
- ✅ Implicit grant

### OpenID Connect scopes:
- ✅ openid
- ✅ email  
- ✅ profile

**Guardar cambios**

---

## 🎯 Paso 3: Instalar dependencia (30 segundos)

```bash
cd frontend
npm install react-oidc-context
```

---

## 🎯 Paso 4: Configurar main.jsx

Reemplaza tu `frontend/src/main.jsx` con:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-oidc-context';
import App from './App';
import './index.css';

// Configuración OIDC
const oidcConfig = {
  authority: import.meta.env.VITE_COGNITO_DOMAIN,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: 'code',
  scope: 'openid email profile',
  
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider {...oidcConfig}>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

---

## 🎯 Paso 5: Crear ruta de prueba

### Opción A: Usar componente simple

```jsx
// En App.jsx
import { Routes, Route } from 'react-router-dom';
import SimpleCognitoAuth from './components/auth/SimpleCognitoAuth';
// ... otros imports

function App() {
  return (
    <Routes>
      <Route path="/cognito" element={<SimpleCognitoAuth />} />
      {/* ... otras rutas */}
    </Routes>
  );
}

export default App;
```

### Opción B: Usar en cualquier componente

```jsx
import { useAuth } from "react-oidc-context";

function MiComponente() {
  const auth = useAuth();

  if (auth.isAuthenticated) {
    return <div>Hola, {auth.user?.profile.email}</div>;
  }

  return <button onClick={() => auth.signinRedirect()}>Login</button>;
}
```

---

## 🎯 Paso 6: Crear usuario de prueba (1 minuto)

1. Cognito Console → Tu User Pool → **"Users"** → **"Create user"**
2. Username: `testuser`
3. Email: `tu-email@gmail.com`
4. Temporary password: `Test123!@#`
5. ✅ **Mark email as verified**
6. **Create user**

---

## 🧪 Probar

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Abre: http://localhost:5173/cognito

1. Clic en "Iniciar sesión"
2. Te redirige a Cognito
3. Ingresa credenciales
4. Te devuelve a tu app con tokens

---

## 📋 Valores de ejemplo para .env

```env
VITE_API_URL=http://localhost:3000/api

# AWS Cognito Configuration
VITE_COGNITO_DOMAIN=https://us-east-2bm8g4vufz.auth.us-east-2.amazoncognito.com
VITE_COGNITO_CLIENT_ID=7kp2m3n4o5p6q7r8s9t0u1v2w3
VITE_COGNITO_REDIRECT_URI=http://localhost:5173
VITE_COGNITO_LOGOUT_URI=http://localhost:5173
```

---

## ❓ Troubleshooting

### Error: "Invalid redirect_uri"
- Verifica que `http://localhost:5173` esté en "Allowed callback URLs"

### Error: "Client does not have openid scope"
- En App client → Edit → Marca las 3 scopes (openid, email, profile)

### No redirige después de login
- Verifica que `onSigninCallback` esté configurado en `oidcConfig`

---

## 🎨 Para Producción

Cuando despliegues en CloudFront:

1. Obtén tu URL de CloudFront: `https://d1234567890.cloudfront.net`

2. Actualiza en Cognito:
   - Callback URLs: `https://d1234567890.cloudfront.net`
   - Sign-out URLs: `https://d1234567890.cloudfront.net`

3. Actualiza .env de producción:
   ```env
   VITE_COGNITO_REDIRECT_URI=https://d1234567890.cloudfront.net
   VITE_COGNITO_LOGOUT_URI=https://d1234567890.cloudfront.net
   ```

---

**¡Listo en 5 minutos!** 🎉
