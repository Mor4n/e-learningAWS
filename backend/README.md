# Backend API - Mini Udemy

API REST construida con Node.js + Express para la plataforma de e-learning.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en http://localhost:3000
```

## 📋 Endpoints Disponibles

### Autenticación

#### POST /api/auth/register
Registrar nuevo usuario

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "userId": "uuid",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "createdAt": "2024-11-24T..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST /api/auth/login
Iniciar sesión

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### GET /api/auth/me
Obtener usuario actual (requiere token)

**Headers:**
```
Authorization: Bearer {token}
```

---

### Cursos

#### GET /api/courses
Listar todos los cursos

**Query Parameters:**
- `category` - Filtrar por categoría
- `search` - Buscar por título/instructor
- `sort` - Ordenar: `rating`, `students`, `price-low`, `price-high`, `newest`
- `limit` - Limitar número de resultados

**Response:**
```json
{
  "success": true,
  "count": 4,
  "courses": [...]
}
```

#### GET /api/courses/:id
Obtener un curso específico

**Response:**
```json
{
  "success": true,
  "course": {
    "id": "1",
    "title": "React - La Guía Completa",
    "instructor": "Juan Pérez",
    "price": 14.99,
    ...
  }
}
```

#### GET /api/courses/category/:category
Cursos por categoría

**Response:**
```json
{
  "success": true,
  "category": "Desarrollo Web",
  "count": 2,
  "courses": [...]
}
```

#### GET /api/courses/:id/curriculum
Obtener currículum del curso

---

### Inscripciones (requiere autenticación)

#### POST /api/enrollments
Inscribirse a un curso

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "courseId": "1"
}
```

#### GET /api/enrollments
Obtener cursos inscritos del usuario

#### GET /api/enrollments/:courseId
Verificar inscripción en curso específico

#### DELETE /api/enrollments/:courseId
Desinscribirse de un curso

---

### Progreso (requiere autenticación)

#### POST /api/progress
Actualizar progreso de una lección

**Body:**
```json
{
  "courseId": "1",
  "lessonId": "l1-1",
  "completed": true
}
```

#### GET /api/progress/:courseId
Obtener progreso de un curso

**Response:**
```json
{
  "success": true,
  "courseId": "1",
  "stats": {
    "completedLessons": 5,
    "totalLessons": 10,
    "progressPercentage": 50
  },
  "progress": [...]
}
```

#### GET /api/progress
Obtener todo el progreso del usuario

#### DELETE /api/progress/:courseId/:lessonId
Eliminar progreso de una lección

---

### Utilidades

#### GET /api/health
Health check del servidor

**Response:**
```json
{
  "status": "OK",
  "message": "Mini Udemy API is running",
  "timestamp": "2024-11-24T...",
  "environment": "development"
}
```

#### GET /
Información de la API

---

## 🧪 Testing con cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Listar cursos
curl http://localhost:3000/api/courses

# Buscar cursos
curl "http://localhost:3000/api/courses?search=react&limit=2"

# Obtener curso específico
curl http://localhost:3000/api/courses/1

# Inscribirse (reemplazar TOKEN)
curl -X POST http://localhost:3000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"courseId":"1"}'

# Ver mis inscripciones
curl http://localhost:3000/api/enrollments \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

1. Registrarse o hacer login para obtener un token
2. Incluir el token en el header `Authorization: Bearer {token}`
3. Los tokens expiran en 7 días

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── middleware/
│   │   └── auth.js          # Middleware de autenticación
│   ├── routes/
│   │   ├── auth.js          # Rutas de autenticación
│   │   ├── courses.js       # Rutas de cursos
│   │   ├── enrollments.js   # Rutas de inscripciones
│   │   └── progress.js      # Rutas de progreso
│   └── script.js            # Punto de entrada
├── .env                     # Variables de entorno
├── .env.example            # Ejemplo de variables
└── package.json
```

---

## 🔧 Variables de Entorno

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
AWS_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=MiniUdemy
S3_VIDEOS_BUCKET=mini-udemy-videos
```

---

## 📝 Notas de Desarrollo

- Los datos están en memoria (arrays). En producción se usará DynamoDB
- Las contraseñas se guardan en texto plano. En producción usar bcrypt
- JWT simple sin refresh tokens. En producción implementar refresh
- CORS habilitado para todos los orígenes. En producción restringir

---

## 🚀 Deploy a EC2

Ver `AWS_DEPLOYMENT_GUIDE.md` en la raíz del proyecto para instrucciones detalladas.

Resumen:
```bash
# En EC2
git clone https://github.com/tu-usuario/e-learningAWS.git
cd e-learningAWS/backend
npm install
pm2 start src/script.js --name udemy-api
```

---

## 📊 Próximas Mejoras

- [ ] Integrar con DynamoDB
- [ ] Hashear passwords con bcrypt
- [ ] Implementar refresh tokens
- [ ] Paginación en listado de cursos
- [ ] Filtros avanzados
- [ ] Rate limiting
- [ ] Validación con Joi/Zod
- [ ] Tests con Jest
- [ ] Integrar S3 para videos
- [ ] Cognito para autenticación
- [ ] CloudWatch para logs

---

## 📄 Licencia

MIT
