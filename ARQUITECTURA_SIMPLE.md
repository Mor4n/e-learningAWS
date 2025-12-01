# 🎯 Arquitectura Simplificada

## 📊 Estructura Actual

### **Autenticación: AWS Cognito** 🔐
- Registro de usuarios
- Login/Logout
- Tokens JWT
- Gestión de sesiones
- Todo manejado en el **frontend**

### **Base de Datos: DynamoDB** 🗄️
- **1 tabla**: `Cursos`
- Partition Key: `cursoId` (String)
- Sin índices secundarios
- Operaciones: CRUD de cursos

### **Storage: S3** 📦
- **1 bucket**: `frontend-e-learning`
- Hosting del frontend compilado
- Servido por CloudFront

---

## 🏗️ Flujo de la Aplicación

```
Usuario
  ↓
Frontend (CloudFront)
  ↓
┌─────────────────┐
│  AWS Cognito    │ → Autenticación
│  (Sign Up/In)   │ → Tokens JWT
└─────────────────┘
  ↓
Backend API (EC2)
  ↓
┌─────────────────┐
│  DynamoDB       │ → Tabla: Cursos
│  (Cursos)       │ → cursoId, titulo, etc.
└─────────────────┘
```

---

## 📁 Estructura de Datos

### Tabla: `Cursos`

```json
{
  "cursoId": "curso-aws-basico",
  "titulo": "Introducción a AWS",
  "descripcion": "Curso para principiantes sobre AWS",
  "imagen": "https://frontend-e-learning.s3.amazonaws.com/aws.png",
  "instructor": "Juan Pérez",
  "precio": 49.99,
  "duracion": "5 horas",
  "nivel": "Principiante",
  "categoria": "Cloud Computing",
  "rating": 4.5,
  "estudiantes": 1234,
  "createdAt": "2025-12-01T00:00:00.000Z"
}
```

---

## 🚀 API Endpoints

### **Cursos**
```
GET    /api/courses              → Obtener todos los cursos
GET    /api/courses/:id          → Obtener curso por ID
GET    /api/courses/category/:cat → Cursos por categoría
POST   /api/courses              → Crear curso
PUT    /api/courses/:id          → Actualizar curso
DELETE /api/courses/:id          → Eliminar curso
```

### **Health Check**
```
GET    /api/health               → Estado del servidor
```

---

## 🔐 Autenticación

**Frontend maneja todo con Cognito:**

```javascript
import { useAuth } from 'react-oidc-context';

function App() {
  const auth = useAuth();
  
  // Login
  auth.signinRedirect();
  
  // Datos del usuario
  console.log(auth.user?.profile.email);
  console.log(auth.user?.id_token);
  
  // Logout
  auth.signoutRedirect();
}
```

**Backend NO valida tokens** (simplificado para Free Tier)

---

## 📝 Comandos

### Backend
```bash
cd backend
npm install
npm start  # Puerto 3000
```

### Frontend
```bash
cd frontend
npm install
npm run build  # Compilar para producción
```

### Deploy a S3/CloudFront
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://frontend-e-learning --delete
aws cloudfront create-invalidation --distribution-id XXX --paths "/*"
```

---

## ✅ Checklist

- [x] DynamoDB: 1 tabla `Cursos`
- [x] S3: 1 bucket `frontend-e-learning`
- [x] Cognito: Configurado para auth
- [x] Backend: Solo API de cursos
- [x] Frontend: Integrado con Cognito
- [ ] Deploy a CloudFront
- [ ] Agregar cursos de prueba a DynamoDB

---

**Arquitectura optimizada para AWS Free Tier** ✨
