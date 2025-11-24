# 🚀 Guía de Implementación AWS - Mini Udemy

## Orden de Implementación Recomendado

### Fase 1: Configuración Inicial y Seguridad
1. **Billing Alerts** (Primero para evitar sorpresas)
2. **IAM Users y Policies**
3. **DynamoDB** (Base de datos)

### Fase 2: Backend
4. **EC2** (Servidor Node.js)
5. **Cognito** (Autenticación)
6. **S3 para Videos** (Almacenamiento de contenido)

### Fase 3: Frontend
7. **S3 para Frontend** (Hosting estático)
8. **CloudFront** (CDN)

### Fase 4: Monitoreo
9. **CloudWatch** (Logs y alarmas)
10. **SNS** (Notificaciones)

---

## 📋 FASE 1: CONFIGURACIÓN INICIAL

### 1️⃣ Configurar Billing Alerts (PRIMERO - MUY IMPORTANTE)

```bash
# Paso 1: Habilitar Billing Alerts
1. Ir a: AWS Console → Billing Dashboard
2. Click en "Billing preferences"
3. Activar: "Receive Free Tier Usage Alerts"
4. Activar: "Receive Billing Alerts"
5. Ingresar email
6. Guardar preferencias

# Paso 2: Crear Budget
1. Ir a: AWS Budgets
2. Click "Create budget"
3. Seleccionar "Cost budget"
4. Name: "Monthly-Free-Tier-Budget"
5. Amount: $5 USD
6. Alerts:
   - 80% threshold → Email
   - 100% threshold → Email
7. Create budget
```

### 2️⃣ Crear Usuario IAM (No usar root)

```bash
# Consola AWS → IAM
1. Click "Users" → "Add users"
2. Username: "udemy-admin"
3. Access type: ✓ AWS Management Console access
                ✓ Programmatic access
4. Password: (crear contraseña segura)
5. Permissions: "AdministratorAccess" (para desarrollo)
6. Create user
7. ⚠️ GUARDAR Access Key ID y Secret Access Key

# Configurar AWS CLI local
aws configure
  AWS Access Key ID: [tu-access-key]
  AWS Secret Access Key: [tu-secret-key]
  Default region name: us-east-1
  Default output format: json
```

---

## 🟩 FASE 2: BASE DE DATOS - DynamoDB

### 3️⃣ Crear Tablas DynamoDB

```bash
# Tabla 1: Users
aws dynamodb create-table \
  --table-name MiniUdemy-Users \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tabla 2: Courses
aws dynamodb create-table \
  --table-name MiniUdemy-Courses \
  --attribute-definitions \
    AttributeName=courseId,AttributeType=S \
  --key-schema \
    AttributeName=courseId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tabla 3: Enrollments
aws dynamodb create-table \
  --table-name MiniUdemy-Enrollments \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=courseId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=courseId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Tabla 4: Progress
aws dynamodb create-table \
  --table-name MiniUdemy-Progress \
  --attribute-definitions \
    AttributeName=userId,AttributeType=S \
    AttributeName=lessonId,AttributeType=S \
  --key-schema \
    AttributeName=userId,KeyType=HASH \
    AttributeName=lessonId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

**Opción GUI (Consola AWS):**
```
1. Ir a: DynamoDB → Tables → Create table
2. Table name: MiniUdemy-Users
3. Partition key: userId (String)
4. Table settings: Default settings
5. Read/write capacity: On-demand
6. Create table
7. Repetir para las otras tablas
```

### Insertar datos de prueba:

Crear archivo `seed-data.json`:
```json
{
  "MiniUdemy-Courses": [
    {
      "PutRequest": {
        "Item": {
          "courseId": {"S": "course-1"},
          "title": {"S": "React - La Guía Completa"},
          "instructor": {"S": "Juan Pérez"},
          "price": {"N": "14.99"},
          "rating": {"N": "4.7"},
          "students": {"N": "158340"}
        }
      }
    }
  ]
}
```

```bash
# Insertar datos
aws dynamodb batch-write-item --request-items file://seed-data.json
```

---

## 🟧 FASE 3: BACKEND - EC2

### 4️⃣ Crear y Configurar EC2

**Paso 1: Crear Key Pair**
```bash
# En consola AWS
EC2 → Key Pairs → Create key pair
Name: udemy-ec2-key
Type: RSA
Format: .pem (para Mac/Linux) o .ppk (para Windows/PuTTY)
Download y guardar en lugar seguro
```

**Paso 2: Crear Security Group**
```bash
# CLI
aws ec2 create-security-group \
  --group-name udemy-backend-sg \
  --description "Security group for Udemy backend" \
  --region us-east-1

# Obtener tu IP pública
curl https://checkip.amazonaws.com

# Agregar reglas
aws ec2 authorize-security-group-ingress \
  --group-name udemy-backend-sg \
  --protocol tcp --port 22 \
  --cidr TU-IP/32  # SSH solo desde tu IP

aws ec2 authorize-security-group-ingress \
  --group-name udemy-backend-sg \
  --protocol tcp --port 3000 \
  --cidr 0.0.0.0/0  # API accesible públicamente

aws ec2 authorize-security-group-ingress \
  --group-name udemy-backend-sg \
  --protocol tcp --port 80 \
  --cidr 0.0.0.0/0  # HTTP
```

**Paso 3: Crear IAM Role para EC2**
```bash
# Crear trust policy
cat > ec2-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "ec2.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
EOF

# Crear role
aws iam create-role \
  --role-name UdemyEC2Role \
  --assume-role-policy-document file://ec2-trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name UdemyEC2Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
  --role-name UdemyEC2Role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name UdemyEC2Role \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

# Crear instance profile
aws iam create-instance-profile \
  --instance-profile-name UdemyEC2InstanceProfile

aws iam add-role-to-instance-profile \
  --instance-profile-name UdemyEC2InstanceProfile \
  --role-name UdemyEC2Role
```

**Paso 4: Lanzar EC2 Instance**
```bash
# GUI (Recomendado para primera vez):
1. EC2 → Launch Instance
2. Name: udemy-backend-server
3. AMI: Amazon Linux 2023 (Free tier eligible)
4. Instance type: t2.micro
5. Key pair: udemy-ec2-key (el que creaste)
6. Network: Default VPC
7. Security group: udemy-backend-sg
8. Storage: 8 GB gp3 (Free tier)
9. Advanced details → IAM instance profile: UdemyEC2InstanceProfile
10. Launch instance

# Esperar 2-3 minutos
```

**Paso 5: Conectar y Configurar EC2**
```bash
# Conectar por SSH (Mac/Linux)
chmod 400 udemy-ec2-key.pem
ssh -i "udemy-ec2-key.pem" ec2-user@[IP-PUBLICA-EC2]

# Windows: usar PuTTY o Windows Terminal

# Una vez dentro:
# Actualizar sistema
sudo yum update -y

# Instalar Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verificar
node --version
npm --version

# Instalar Git
sudo yum install git -y

# Instalar PM2 (para mantener app corriendo)
sudo npm install -g pm2

# Clonar repositorio
cd /home/ec2-user
git clone https://github.com/tu-usuario/e-learningAWS.git
cd e-learningAWS/backend

# Instalar dependencias
npm install

# Crear archivo .env
cat > .env << EOF
PORT=3000
AWS_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=MiniUdemy
NODE_ENV=production
EOF

# Iniciar con PM2
pm2 start src/script.js --name udemy-api
pm2 save
pm2 startup

# Configurar PM2 para auto-inicio
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Ver logs
pm2 logs udemy-api
```

**Paso 6: Configurar Nginx (Opcional pero recomendado)**
```bash
# Instalar nginx
sudo yum install nginx -y

# Configurar como reverse proxy
sudo nano /etc/nginx/conf.d/udemy.conf
```

Contenido de `udemy.conf`:
```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Iniciar nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verificar
curl http://localhost
```

---

## 🟥 FASE 4: AUTENTICACIÓN - Cognito

### 5️⃣ Configurar AWS Cognito

**Paso 1: Crear User Pool**
```bash
# GUI:
1. Cognito → User Pools → Create user pool
2. Configure sign-in:
   - Provider types: Cognito user pool
   - Cognito user pool sign-in options: ✓ Email
3. Security requirements:
   - Password policy: Cognito defaults
   - MFA: No MFA (opcional: SMS)
4. Sign-up experience:
   - Self-registration: ✓ Enable
   - Attributes: email, name
5. Message delivery:
   - Email provider: Send email with Cognito
6. User pool name: MiniUdemyUserPool
7. App client name: MiniUdemyWebApp
   - ✓ Generate client secret: No
8. Create user pool

# Guardar:
- User Pool ID: us-east-1_XXXXXX
- App Client ID: XXXXXXXXXXXXXXXXXX
```

**Paso 2: Configurar App Integration**
```bash
# En User Pool → App integration
1. App client: MiniUdemyWebApp
2. Hosted UI: Optional (Skip for now)
3. Allowed callback URLs: http://localhost:5173/callback
4. Allowed sign-out URLs: http://localhost:5173/
5. OAuth 2.0 flows:
   ✓ Authorization code grant
   ✓ Implicit grant
6. OAuth scopes:
   ✓ email
   ✓ openid
   ✓ profile
```

---

## 🟨 FASE 5: ALMACENAMIENTO - S3 para Videos

### 6️⃣ Crear Bucket S3 para Videos

```bash
# Crear bucket
aws s3 mb s3://mini-udemy-videos-[tu-nombre-unico] --region us-east-1

# Configurar CORS
cat > cors-config.json << EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket mini-udemy-videos-[tu-nombre] \
  --cors-configuration file://cors-config.json

# Bloquear acceso público (usaremos presigned URLs)
aws s3api put-public-access-block \
  --bucket mini-udemy-videos-[tu-nombre] \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

**Subir videos de prueba:**
```bash
# Crear estructura de carpetas
mkdir test-videos
cd test-videos

# Subir archivos
aws s3 cp video1.mp4 s3://mini-udemy-videos-[tu-nombre]/courses/course-1/lesson-1.mp4
aws s3 cp material.pdf s3://mini-udemy-videos-[tu-nombre]/courses/course-1/materials/slides.pdf
```

---

## 🟦 FASE 6: FRONTEND - S3 + CloudFront

### 7️⃣ Deploy Frontend en S3

```bash
# Paso 1: Build del frontend
cd frontend
npm run build

# Paso 2: Crear bucket para frontend
aws s3 mb s3://mini-udemy-frontend-[tu-nombre] --region us-east-1

# Paso 3: Configurar como sitio web estático
aws s3 website s3://mini-udemy-frontend-[tu-nombre] \
  --index-document index.html \
  --error-document index.html

# Paso 4: Crear política de bucket
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::mini-udemy-frontend-[tu-nombre]/*"
  }]
}
EOF

aws s3api put-bucket-policy \
  --bucket mini-udemy-frontend-[tu-nombre] \
  --policy file://bucket-policy.json

# Paso 5: Subir archivos
aws s3 sync dist/ s3://mini-udemy-frontend-[tu-nombre] --delete

# URL: http://mini-udemy-frontend-[tu-nombre].s3-website-us-east-1.amazonaws.com
```

### 8️⃣ Configurar CloudFront

```bash
# GUI (más fácil):
1. CloudFront → Create distribution
2. Origin domain: mini-udemy-frontend-[tu-nombre].s3-website-us-east-1.amazonaws.com
3. Origin path: empty
4. Name: Mini-Udemy-Frontend
5. Viewer protocol policy: Redirect HTTP to HTTPS
6. Allowed HTTP methods: GET, HEAD
7. Cache policy: CachingOptimized
8. Price class: Use only North America and Europe
9. Default root object: index.html
10. Create distribution

# Esperar 15-20 minutos para deployment
# Guardar CloudFront URL: https://d111111abcdef8.cloudfront.net
```

**Configurar Error Pages:**
```bash
1. CloudFront → Tu distribution → Error pages
2. Create custom error response
   - HTTP error code: 403
   - Customize error response: Yes
   - Response page path: /index.html
   - HTTP response code: 200
3. Repetir para error 404
```

---

## 🟪 FASE 7: MONITOREO - CloudWatch

### 9️⃣ Configurar CloudWatch

**Logs de EC2:**
```bash
# SSH a EC2
ssh -i "udemy-ec2-key.pem" ec2-user@[IP-EC2]

# Instalar CloudWatch Agent
sudo yum install amazon-cloudwatch-agent -y

# Configurar
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Seleccionar:
# - Linux
# - EC2
# - Default answers para lo demás
# - Log file path: /home/ec2-user/.pm2/logs/udemy-api-out.log

# Iniciar agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
```

**Crear Alarmas:**
```bash
# Alarma de CPU
aws cloudwatch put-metric-alarm \
  --alarm-name udemy-high-cpu \
  --alarm-description "Alert when CPU exceeds 70%" \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 70 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

# Alarma de DynamoDB
aws cloudwatch put-metric-alarm \
  --alarm-name udemy-dynamodb-reads \
  --metric-name ConsumedReadCapacityUnits \
  --namespace AWS/DynamoDB \
  --statistic Sum \
  --period 300 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold
```

---

## 🟫 FASE 8: NOTIFICACIONES - SNS

### 🔟 Configurar SNS

```bash
# Crear topic
aws sns create-topic --name MiniUdemy-Notifications

# Suscribir email
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:ACCOUNT-ID:MiniUdemy-Notifications \
  --protocol email \
  --notification-endpoint tu-email@gmail.com

# Confirmar email (check inbox)

# Link alarmas a SNS
aws cloudwatch put-metric-alarm \
  --alarm-name udemy-high-cpu \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT-ID:MiniUdemy-Notifications
```

---

## ✅ VERIFICACIÓN FINAL

### Checklist de Testing:

```bash
# 1. Test DynamoDB
aws dynamodb scan --table-name MiniUdemy-Courses --limit 5

# 2. Test EC2
curl http://[IP-EC2]:3000/api/health

# 3. Test S3 Videos
aws s3 ls s3://mini-udemy-videos-[tu-nombre]/

# 4. Test Frontend
curl https://[cloudfront-url]

# 5. Test Cognito (desde frontend)
# Abrir navegador → Registro → Login

# 6. Test CloudWatch
aws logs describe-log-groups
aws cloudwatch describe-alarms
```

---

## 📊 COSTOS ESTIMADOS (Free Tier)

| Servicio | Free Tier | Límite Mensual |
|----------|-----------|----------------|
| EC2 | t2.micro | 750 hrs/mes |
| S3 | Storage | 5 GB |
| DynamoDB | On-Demand | 25 GB |
| CloudFront | Data Transfer | 1 TB salida |
| Cognito | Users | 50,000 MAU |
| CloudWatch | Logs | 5 GB ingestion |
| SNS | Notifications | 1,000 emails |

**Total esperado: $0 - $2 USD/mes** (si te mantienes en Free Tier)

---

## 🆘 TROUBLESHOOTING

### EC2 no responde:
```bash
# Check security group
aws ec2 describe-security-groups --group-names udemy-backend-sg

# Check instance
aws ec2 describe-instances --filters "Name=tag:Name,Values=udemy-backend-server"

# SSH y check logs
pm2 logs udemy-api
```

### Frontend no carga:
```bash
# Invalidar cache de CloudFront
aws cloudfront create-invalidation \
  --distribution-id [TU-DIST-ID] \
  --paths "/*"
```

### DynamoDB access denied:
```bash
# Verificar IAM role en EC2
aws iam list-attached-role-policies --role-name UdemyEC2Role
```

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Completar integración Cognito en frontend
2. ✅ Implementar subida de archivos a S3
3. ✅ Crear endpoints de API restantes
4. ✅ Agregar dominio personalizado (Route 53)
5. ✅ Configurar HTTPS con Certificate Manager
6. ✅ Implementar CI/CD con GitHub Actions

---

¿Todo listo? Empieza con la Fase 1 y avísame cuando llegues a cada paso! 🚀
