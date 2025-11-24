# 🧪 Guía de Pruebas - Integración Frontend-Backend

## ✅ Estado Actual

### Servidores en Ejecución
- **Backend**: http://localhost:3000 ✅
- **Frontend**: http://localhost:5173 ✅

## 🔍 Funcionalidades Implementadas

### 1. Autenticación Completa
- ✅ Registro de usuarios
- ✅ Inicio de sesión
- ✅ Almacenamiento de tokens JWT
- ✅ Cierre de sesión
- ✅ Protección de rutas
- ✅ Visualización de estado de usuario en Header

### 2. Gestión de Cursos
- ✅ Listado de cursos desde API
- ✅ Detalles de cursos individuales
- ✅ Búsqueda y filtrado de cursos
- ✅ Inscripción en cursos
- ✅ Verificación de inscripción

### 3. Progreso del Usuario
- ✅ Mis cursos (enrollments)
- ✅ Seguimiento de progreso
- ✅ Estadísticas de aprendizaje

## 🧪 Flujo de Pruebas Paso a Paso

### Prueba 1: Registro y Autenticación

1. **Abrir la aplicación**
   - Ir a: http://localhost:5173

2. **Registrarse**
   - Clic en "Regístrate" en el header
   - Llenar el formulario:
     - Nombre: Test User
     - Email: test@example.com
     - Contraseña: password123
     - Confirmar contraseña: password123
   - Clic en "Crear cuenta"
   
   **Resultado esperado**: Redirección a la página principal, usuario logueado

3. **Verificar estado de sesión**
   - Verificar que aparece el avatar del usuario en el header
   - Clic en el avatar
   - Debería mostrar menú con nombre y email
   - Debería aparecer opción "Mi aprendizaje"

### Prueba 2: Navegación de Cursos

1. **Ver listado de cursos**
   - En la página principal, deberías ver 4 cursos:
     - React - La Guía Completa
     - Python para Data Science
     - AWS Certified Solutions Architect
     - Diseño Web Completo

2. **Ver detalles de un curso**
   - Clic en cualquier curso
   - Verificar que carga la información completa
   - Verificar que aparece el botón "Inscribirse ahora"

### Prueba 3: Inscripción en Cursos

1. **Inscribirse en un curso**
   - Estando en la página de detalles de un curso
   - Clic en "Inscribirse ahora" o "Comprar ahora"
   
   **Resultado esperado**: 
   - Redirección a `/course/:id/learn`
   - El botón cambia a "Continuar aprendiendo"

2. **Verificar inscripción**
   - Volver a la página del curso
   - Verificar que el botón ahora dice "Continuar aprendiendo"

### Prueba 4: Mis Cursos

1. **Acceder a "Mi aprendizaje"**
   - Clic en "Mi aprendizaje" en el header
   - O ir directamente a: http://localhost:5173/my-learning

2. **Verificar cursos inscritos**
   - Deberías ver los cursos en los que te inscribiste
   - Cada curso muestra:
     - Título e instructor
     - Barra de progreso (0% inicialmente)
     - Número de lecciones completadas
   
3. **Estadísticas**
   - Verificar las tarjetas de estadísticas:
     - Cursos en progreso
     - Horas totales
     - Certificados (0 hasta completar un curso)

### Prueba 5: Cierre de Sesión

1. **Cerrar sesión**
   - Clic en el avatar del usuario
   - Clic en "Cerrar sesión"
   
   **Resultado esperado**:
   - Redirección a la página principal
   - Header muestra botones "Iniciar sesión" y "Regístrate"
   - No hay acceso a "Mi aprendizaje" sin login

### Prueba 6: Protección de Rutas

1. **Intentar acceder a "Mi aprendizaje" sin login**
   - Ir a: http://localhost:5173/my-learning
   
   **Resultado esperado**:
   - Mensaje: "Inicia sesión para ver tus cursos"
   - Botón para ir a login

2. **Intentar inscribirse sin login**
   - Ver detalles de un curso
   - Clic en "Inscribirse ahora"
   
   **Resultado esperado**:
   - Redirección a página de login

## 🔧 Pruebas Técnicas (Consola del Navegador)

### Verificar Token JWT

1. Abrir DevTools (F12)
2. Ir a Console
3. Ejecutar:
```javascript
localStorage.getItem('token')
```

**Resultado esperado**: Un token JWT (string largo)

### Verificar Datos de Usuario

```javascript
localStorage.getItem('user')
```

**Resultado esperado**: Objeto JSON con userId, email, name

### Verificar Llamadas a la API

1. Abrir DevTools (F12)
2. Ir a Network
3. Filtrar por "XHR/Fetch"
4. Realizar acciones (login, ver cursos, inscribirse)

**Resultado esperado**:
- Todas las llamadas van a `http://localhost:3000/api/...`
- Las llamadas autenticadas incluyen header `Authorization: Bearer <token>`
- Respuestas con status 200 (éxito) o 401 (no autorizado)

## 🐛 Problemas Comunes y Soluciones

### Error: "No se pudieron cargar los cursos"

**Causa**: Backend no está corriendo
**Solución**:
```powershell
cd backend
npm start
```

### Error: "Network Error" en consola

**Causa**: Frontend no encuentra el backend
**Solución**: Verificar que `.env` en frontend tiene:
```
VITE_API_URL=http://localhost:3000/api
```

### Error 401 (Unauthorized)

**Causa**: Token expirado o inválido
**Solución**: Cerrar sesión e iniciar sesión nuevamente

### Los cursos no aparecen en "Mi aprendizaje"

**Causa**: No te has inscrito en ningún curso
**Solución**: 
1. Ir a la página principal
2. Seleccionar un curso
3. Hacer clic en "Inscribirse ahora"

## 📊 Datos de Prueba

### Usuario de Prueba
```
Email: test@example.com
Contraseña: password123
```

### Cursos Disponibles (IDs)
- `course-1`: React - La Guía Completa
- `course-2`: Python para Data Science
- `course-3`: AWS Certified Solutions Architect
- `course-4`: Diseño Web Completo

## 🔐 Endpoints de la API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual (requiere auth)

### Cursos
- `GET /api/courses` - Listar todos los cursos
- `GET /api/courses/:id` - Obtener detalles de un curso
- `GET /api/courses/category/:category` - Filtrar por categoría
- `GET /api/courses/:id/curriculum` - Obtener currículo del curso

### Inscripciones
- `POST /api/enrollments` - Inscribirse en un curso (requiere auth)
- `GET /api/enrollments` - Obtener mis inscripciones (requiere auth)
- `GET /api/enrollments/:courseId` - Verificar inscripción (requiere auth)
- `DELETE /api/enrollments/:courseId` - Desinscribirse (requiere auth)

### Progreso
- `POST /api/progress` - Guardar progreso de lección (requiere auth)
- `GET /api/progress/:courseId` - Obtener progreso de un curso (requiere auth)
- `GET /api/progress` - Obtener todo el progreso (requiere auth)

## ✅ Checklist de Integración

- [x] Backend API funcionando
- [x] Frontend conectado al backend
- [x] Registro de usuarios
- [x] Inicio de sesión
- [x] Almacenamiento de tokens
- [x] Interceptores de Axios configurados
- [x] Listado de cursos desde API
- [x] Detalles de curso desde API
- [x] Inscripción en cursos
- [x] Página "Mi aprendizaje" con enrollments
- [x] Header muestra estado de usuario
- [x] Cierre de sesión funcional
- [x] Protección de rutas
- [x] Manejo de errores
- [x] Estados de carga (loading)

## 🎯 Próximos Pasos

1. **Reproducción de Videos** ⏭️
   - Implementar player de video
   - Guardar progreso automáticamente
   - Marcar lecciones como completadas

2. **Integración con AWS** ⏭️
   - Desplegar backend en EC2
   - Almacenar videos en S3
   - Migrar a DynamoDB
   - Configurar Cognito
   - Configurar CloudWatch

3. **Mejoras de UX** ⏭️
   - Búsqueda en tiempo real
   - Filtros avanzados
   - Recomendaciones de cursos
   - Sistema de calificaciones
   - Comentarios y reseñas

## 📞 Soporte

Si encuentras algún problema durante las pruebas:
1. Verifica que ambos servidores estén corriendo
2. Revisa la consola del navegador (F12)
3. Revisa los logs del backend en la terminal
4. Verifica la configuración de `.env` en el frontend

---

**¡Felicitaciones! Has integrado exitosamente el frontend con el backend!** 🎉
