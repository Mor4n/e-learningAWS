# 🎓 Mini Udemy - Plataforma de E-Learning

Sistema web de cursos estilo Udemy construido con arquitectura en la nube utilizando servicios fundamentales de AWS.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![AWS](https://img.shields.io/badge/AWS-DynamoDB%20%7C%20S3%20%7C%20EC2-orange)

## 🌟 Características

- ✅ Autenticación de usuarios (JWT)
- ✅ Catálogo de cursos con filtros y búsqueda
- ✅ Sistema de inscripción a cursos
- ✅ Seguimiento de progreso del estudiante
- ✅ Panel de "Mi aprendizaje"
- ✅ Interfaz responsiva tipo Udemy
- ⏳ Reproducción de videos (próximamente)
- ⏳ Sistema de certificados (próximamente)

## 🏗️ Arquitectura

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6
- **State Management**: Context API
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 20
- **Framework**: Express 5
- **Authentication**: JWT (jsonwebtoken)
- **Database**: DynamoDB (AWS)
- **Storage**: S3 (AWS) - próximamente
- **Hosting**: EC2 (AWS) - próximamente

### Servicios AWS Utilizados

| Servicio | Propósito | Estado |
|----------|-----------|--------|
| **DynamoDB** | Base de datos NoSQL | ✅ Configurado |
| **S3** | Almacenamiento de videos | ⏳ Pendiente |
| **EC2** | Hosting del backend | ⏳ Pendiente |
| **CloudFront** | CDN para frontend | ⏳ Pendiente |
| **Cognito** | Autenticación avanzada | ⏳ Pendiente |
| **CloudWatch** | Monitoreo y logs | ⏳ Pendiente |
| **SNS** | Notificaciones | ⏳ Pendiente |

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ y npm
- Cuenta de AWS (Free Tier)
- AWS CLI configurado
- Git

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Mor4n/e-learningAWS.git
cd e-learningAWS
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de AWS
```

### 3. Configurar Frontend

```bash
cd frontend
npm install

# Configurar variables de entorno
echo "VITE_API_URL=http://localhost:3000/api" > .env
```

### 4. Configurar AWS DynamoDB

```bash
cd backend

# Crear tablas en DynamoDB
npm run aws:create-tables

# Poblar con datos iniciales
npm run aws:seed-data

# O hacer todo en un comando
npm run aws:setup
```

📖 **Guía detallada**: Ver [AWS_DYNAMODB_SETUP.md](./AWS_DYNAMODB_SETUP.md)

### 5. Iniciar Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Servidor en http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Aplicación en http://localhost:5173
```

### 6. Acceder a la Aplicación

Abrir navegador en: **http://localhost:5173**

## 📚 Documentación

- **[INTEGRATION_TEST.md](./INTEGRATION_TEST.md)** - Guía de pruebas de la aplicación
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Resumen de la integración
- **[AWS_DYNAMODB_SETUP.md](./AWS_DYNAMODB_SETUP.md)** - Configuración de DynamoDB
- **[DEPLOY.md](./backend/DEPLOY.md)** - Guía de despliegue en AWS

## 🗂️ Estructura del Proyecto

```
e-learningAWS/
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── auth/       # Login, Register
│   │   │   ├── courses/    # CourseCard, CourseDetail
│   │   │   └── layout/     # Header, Footer, CategoryBar
│   │   ├── pages/          # Páginas principales
│   │   │   ├── Home.jsx
│   │   │   ├── CoursePage.jsx
│   │   │   ├── MyLearning.jsx
│   │   │   └── Learn.jsx
│   │   ├── context/        # Context API
│   │   │   └── AuthContext.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js      # Axios client
│   │   └── App.jsx
│   └── package.json
│
├── backend/                 # API REST con Express
│   ├── src/
│   │   ├── routes/         # Endpoints de la API
│   │   │   ├── auth.js     # Autenticación
│   │   │   ├── courses.js  # Cursos
│   │   │   ├── enrollments.js
│   │   │   └── progress.js
│   │   ├── middleware/     # Middlewares
│   │   │   └── auth.js     # JWT verification
│   │   ├── config/         # Configuración
│   │   │   └── aws.js      # AWS SDK config
│   │   ├── repositories/   # Acceso a datos
│   │   │   └── dynamodb.js # DynamoDB operations
│   │   ├── scripts/        # Scripts utilitarios
│   │   │   ├── create-tables.js
│   │   │   └── seed-data.js
│   │   └── script.js       # Servidor principal
│   ├── .env
│   └── package.json
│
├── AWS_DYNAMODB_SETUP.md
├── INTEGRATION_TEST.md
└── README.md
```

## 🔌 API Endpoints

### Autenticación
```http
POST   /api/auth/register    # Registrar usuario
POST   /api/auth/login        # Iniciar sesión
GET    /api/auth/me           # Obtener usuario actual (auth)
```

### Cursos
```http
GET    /api/courses           # Listar cursos
GET    /api/courses/:id       # Detalles de curso
GET    /api/courses/category/:category  # Filtrar por categoría
GET    /api/courses/:id/curriculum      # Obtener currículo
```

### Inscripciones
```http
POST   /api/enrollments       # Inscribirse (auth)
GET    /api/enrollments       # Mis inscripciones (auth)
GET    /api/enrollments/:courseId      # Verificar inscripción (auth)
DELETE /api/enrollments/:courseId      # Desinscribirse (auth)
```

### Progreso
```http
POST   /api/progress          # Guardar progreso (auth)
GET    /api/progress/:courseId         # Progreso de curso (auth)
GET    /api/progress          # Todo el progreso (auth)
```

📖 **Documentación completa**: Ver [backend/README.md](./backend/README.md)

## 🧪 Pruebas

### Flujo de Prueba Básico

1. **Registrar usuario**
   - Email: `test@example.com`
   - Contraseña: `password123`

2. **Ver catálogo de cursos**
   - 4 cursos disponibles

3. **Inscribirse en un curso**
   - Clic en curso → "Inscribirse ahora"

4. **Ver "Mi aprendizaje"**
   - Verificar curso inscrito
   - Ver progreso 0%

5. **Cerrar sesión**

📖 **Guía completa**: Ver [INTEGRATION_TEST.md](./INTEGRATION_TEST.md)

## 💾 Base de Datos (DynamoDB)

### Tablas

| Tabla | Partition Key | GSI |
|-------|--------------|-----|
| **users** | userId | EmailIndex |
| **courses** | courseId | CategoryIndex, InstructorIndex |
| **enrollments** | enrollmentId | UserIndex, CourseIndex, UserCourseIndex |
| **progress** | progressId | UserIndex, UserCourseIndex, CourseLessonIndex |

### Modelo de Datos

```javascript
// User
{
  userId: "uuid",
  email: "user@example.com",
  name: "Usuario",
  password: "hashed",
  createdAt: "2024-11-24T..."
}

// Course
{
  courseId: "course-1",
  title: "React - Guía Completa",
  instructor: "Juan Pérez",
  category: "Desarrollo Web",
  price: 14.99,
  curriculum: [...],
  ...
}

// Enrollment
{
  enrollmentId: "uuid",
  userId: "user-id",
  courseId: "course-1",
  enrolledAt: "2024-11-24T..."
}

// Progress
{
  progressId: "uuid",
  userId: "user-id",
  courseId: "course-1",
  lessonId: "1-1",
  completed: true,
  completedAt: "2024-11-24T..."
}
```

## 🔐 Seguridad

- ✅ Contraseñas sin hashear (TODO: bcrypt)
- ✅ JWT tokens con expiración (7 días)
- ✅ CORS habilitado (configurar para producción)
- ✅ Validación de inputs
- ✅ Variables de entorno para secrets
- ⏳ Rate limiting (pendiente)
- ⏳ HTTPS en producción (pendiente)

## 🌍 Variables de Entorno

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

DYNAMODB_TABLE_USERS=mini-udemy-users
DYNAMODB_TABLE_COURSES=mini-udemy-courses
DYNAMODB_TABLE_ENROLLMENTS=mini-udemy-enrollments
DYNAMODB_TABLE_PROGRESS=mini-udemy-progress
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 📦 Scripts Disponibles

### Backend
```bash
npm start              # Iniciar servidor
npm run dev            # Modo desarrollo
npm run aws:create-tables   # Crear tablas DynamoDB
npm run aws:seed-data  # Poblar datos iniciales
npm run aws:setup      # Setup completo de AWS
```

### Frontend
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
```

## 🚧 En Desarrollo

- [ ] Página de reproducción de videos
- [ ] Integración con S3 para videos
- [ ] Sistema de certificados
- [ ] Búsqueda en tiempo real
- [ ] Filtros avanzados
- [ ] Sistema de calificaciones
- [ ] Comentarios y reseñas
- [ ] Deploy en AWS
- [ ] CI/CD con GitHub Actions

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit cambios: `git commit -m 'Agregar funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 Licencia

Este proyecto es de código abierto bajo la licencia MIT.

## 👤 Autor

**Mor4n**
- GitHub: [@Mor4n](https://github.com/Mor4n)

## 🙏 Agradecimientos

- Udemy por la inspiración del diseño
- AWS Free Tier por los servicios
- Comunidad open source

---

**¿Preguntas?** Abre un issue o contacta al autor.
