# 🚀 Guía de Configuración AWS DynamoDB

## 📋 Prerrequisitos

1. **Cuenta de AWS**: https://aws.amazon.com/free/
2. **AWS CLI instalado**: https://aws.amazon.com/cli/
3. **Credenciales de AWS configuradas**

## 🔐 Paso 1: Configurar Credenciales AWS

### Opción A: AWS CLI (Recomendado)

```powershell
# Instalar AWS CLI si no lo tienes
# Descarga desde: https://aws.amazon.com/cli/

# Configurar credenciales
aws configure
```

Te pedirá:
- **AWS Access Key ID**: Tu access key de IAM
- **AWS Secret Access Key**: Tu secret key
- **Default region name**: `us-east-1`
- **Default output format**: `json`

### Opción B: Variables de Entorno

Edita el archivo `backend/.env`:

```env
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
```

## 👤 Paso 2: Crear Usuario IAM

1. **Ir a AWS Console** → IAM → Users → Add User

2. **Nombre del usuario**: `mini-udemy-app`

3. **Access type**: ✅ Programmatic access

4. **Permissions**: Attach existing policies directly
   - ✅ `AmazonDynamoDBFullAccess`
   - ✅ `AmazonS3FullAccess` (para futuro)
   - ✅ `CloudWatchFullAccess` (para futuro)

5. **Guardar las credenciales**:
   - Access Key ID
   - Secret Access Key
   - ⚠️ Solo se muestran una vez!

## 🗄️ Paso 3: Crear Tablas en DynamoDB

### Verificar Configuración

```powershell
cd backend
npm run aws:create-tables
```

Este comando:
- ✅ Crea 4 tablas en DynamoDB
- ✅ Configura índices secundarios globales (GSI)
- ✅ Establece capacidad de lectura/escritura

### Tablas Creadas

1. **mini-udemy-users**
   - Partition Key: `userId`
   - GSI: `EmailIndex` (email)

2. **mini-udemy-courses**
   - Partition Key: `courseId`
   - GSI: `CategoryIndex` (category)
   - GSI: `InstructorIndex` (instructorId)

3. **mini-udemy-enrollments**
   - Partition Key: `enrollmentId`
   - GSI: `UserIndex` (userId)
   - GSI: `CourseIndex` (courseId)
   - GSI: `UserCourseIndex` (userId + courseId)

4. **mini-udemy-progress**
   - Partition Key: `progressId`
   - GSI: `UserIndex` (userId)
   - GSI: `UserCourseIndex` (userId + courseId)
   - GSI: `CourseLessonIndex` (courseId + lessonId)

## 📦 Paso 4: Poblar Base de Datos

```powershell
npm run aws:seed-data
```

Este comando inserta:
- ✅ 4 cursos de ejemplo
- ✅ Información completa (título, instructor, curriculum, etc.)

## ✅ Paso 5: Verificar en AWS Console

1. **Ir a DynamoDB Console**: https://console.aws.amazon.com/dynamodb

2. **Verificar tablas**:
   - Tables → Deberías ver las 4 tablas
   - Clic en cada tabla → Items → Ver datos

3. **Verificar índices**:
   - Cada tabla → Indexes
   - Verificar que los GSI están activos

## 🔧 Paso 6: Configurar Backend

### Actualizar archivo .env

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu-access-key-aqui
AWS_SECRET_ACCESS_KEY=tu-secret-key-aqui

# DynamoDB Tables
DYNAMODB_TABLE_USERS=mini-udemy-users
DYNAMODB_TABLE_COURSES=mini-udemy-courses
DYNAMODB_TABLE_ENROLLMENTS=mini-udemy-enrollments
DYNAMODB_TABLE_PROGRESS=mini-udemy-progress

# Para desarrollo local con DynamoDB Local
DYNAMODB_LOCAL=false
```

## 🧪 Paso 7: Probar Conexión

### Test de Lectura

```javascript
// Crear archivo: backend/src/scripts/test-connection.js
require('dotenv').config();
const { coursesRepository } = require('../repositories/dynamodb');

async function testConnection() {
  try {
    console.log('Testing DynamoDB connection...');
    const courses = await coursesRepository.getAll();
    console.log(`✅ Success! Found ${courses.length} courses`);
    if (courses.length > 0) {
      console.log('First course:', courses[0]);
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Make sure your AWS credentials are configured correctly.');
  }
}

testConnection();
```

```powershell
node src/scripts/test-connection.js
```

## 📦 Dependencias AWS SDK

El proyecto usa **AWS SDK v3** (modular):

```json
{
  "dependencies": {
    "@aws-sdk/client-dynamodb": "^3.500.0",
    "@aws-sdk/lib-dynamodb": "^3.500.0"
  }
}
```

**¿Por qué v3?**
- ✅ Más ligero (solo instalas lo que necesitas)
- ✅ Mejor rendimiento
- ✅ TypeScript nativo
- ✅ Promesas nativas (no `.promise()`)
- ✅ Recomendado oficialmente por AWS

## 🔄 Comandos Disponibles

```powershell
# Crear todas las tablas
npm run aws:create-tables

# Poblar con datos iniciales
npm run aws:seed-data

# Hacer ambos (setup completo)
npm run aws:setup
```

## 💰 Costo y Free Tier

### DynamoDB Free Tier (12 meses gratis)
- ✅ 25 GB de almacenamiento
- ✅ 25 unidades de lectura/escritura provisionadas
- ✅ 2.5 millones de requests de DynamoDB Streams

### Nuestras Tablas
- **Configuración actual**: 5 RCU + 5 WCU por tabla
- **Total**: 20 RCU + 20 WCU
- **Estado**: ✅ Dentro del Free Tier

### Recomendaciones
- Usa **On-Demand Pricing** para desarrollo (paga por request)
- Para producción, considera **Provisioned Capacity** con autoscaling
- Habilita **Point-in-Time Recovery** para respaldos

## 🐛 Solución de Problemas

### Error: "Missing credentials"

**Solución**: Configura AWS CLI o variables de entorno

```powershell
aws configure
# O edita .env con tus credenciales
```

### Error: "Table already exists"

**Solución**: Las tablas ya fueron creadas. Verifica en AWS Console.

### Error: "Access Denied"

**Solución**: Verifica que tu usuario IAM tiene permisos de DynamoDB

### Error: "ResourceNotFoundException"

**Solución**: Las tablas no existen. Ejecuta:
```powershell
npm run aws:create-tables
```

## 📱 DynamoDB Local (Desarrollo Offline)

### Instalación

```powershell
# Opción 1: Docker
docker run -p 8000:8000 amazon/dynamodb-local

# Opción 2: Descarga directa
# https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
```

### Configuración

Edita `backend/.env`:
```env
DYNAMODB_LOCAL=true
DYNAMODB_ENDPOINT=http://localhost:8000
```

### Crear tablas localmente

```powershell
npm run aws:create-tables
npm run aws:seed-data
```

## 🔍 Verificar Datos en DynamoDB

### Usando AWS CLI

```powershell
# Listar tablas
aws dynamodb list-tables

# Ver items de una tabla
aws dynamodb scan --table-name mini-udemy-courses

# Obtener un item específico
aws dynamodb get-item \
  --table-name mini-udemy-courses \
  --key '{"courseId": {"S": "course-1"}}'
```

### Usando AWS Console

1. Ir a: https://console.aws.amazon.com/dynamodb
2. Tables → mini-udemy-courses
3. Items → Explore items

## 📊 Monitoreo

### CloudWatch Metrics

1. DynamoDB Console → Tables
2. Selecciona una tabla → Monitoring
3. Ver métricas:
   - Read/Write capacity utilization
   - Throttled requests
   - System errors

### Alarmas Recomendadas

```powershell
# Crear alarma para RCU alta
aws cloudwatch put-metric-alarm \
  --alarm-name mini-udemy-high-rcu \
  --metric-name ConsumedReadCapacityUnits \
  --namespace AWS/DynamoDB \
  --statistic Sum \
  --period 300 \
  --evaluation-periods 1 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

## 🔐 Seguridad

### Mejores Prácticas

1. **No commits credenciales**: ✅ .env está en .gitignore
2. **Rotación de keys**: Cambiar cada 90 días
3. **Principio de mínimo privilegio**: Solo permisos necesarios
4. **Usar IAM Roles** en producción (EC2)
5. **Habilitar encryption at rest** en DynamoDB

### Cifrado

```powershell
# Habilitar cifrado en tabla existente
aws dynamodb update-table \
  --table-name mini-udemy-users \
  --sse-specification Enabled=true
```

## 📖 Recursos

- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/)
- [AWS SDK para Node.js](https://docs.aws.amazon.com/sdk-for-javascript/)
- [DynamoDB Best Practices](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html)
- [DynamoDB Pricing](https://aws.amazon.com/dynamodb/pricing/)

## ✅ Checklist de Setup

- [ ] Cuenta de AWS creada
- [ ] AWS CLI instalado y configurado
- [ ] Usuario IAM creado con permisos
- [ ] Credenciales en .env
- [ ] npm install aws-sdk ejecutado
- [ ] Tablas de DynamoDB creadas
- [ ] Datos iniciales insertados
- [ ] Conexión verificada
- [ ] Datos visibles en AWS Console

## 🎯 Próximos Pasos

Una vez configurado DynamoDB:

1. **Migrar backend** de in-memory a DynamoDB
2. **Configurar S3** para videos
3. **Implementar Cognito** para autenticación
4. **Configurar CloudWatch** para logs
5. **Deploy en EC2**

---

**¿Listo para AWS?** 🚀 Sigue los pasos y tendrás tu base de datos en la nube!
