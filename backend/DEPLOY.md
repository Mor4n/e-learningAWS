# Deploy Mini-Udemy backend to EC2 (Free Tier t2.micro)

Este documento describe los pasos básicos para desplegar la parte backend en una instancia EC2 y configurar los servicios AWS necesarios (S3, CloudFront, DynamoDB, Cognito, CloudWatch, SNS). Se asume acceso a la consola AWS y que usarás la capa Free Tier.

1) Preparar la instancia EC2
- Lanzar una instancia Amazon Linux 2 o Ubuntu (t2.micro, Free Tier).
- Key pair: guarda la clave privada para SSH.
- Security Group: permitir al menos `TCP 22` (tu IP), `TCP 3001` (si quieres probar directo) y bloquear otros puertos. Para producción, expón solo el balanceador o CloudFront.

2) IAM Role para la instancia
- Crea un IAM Role con políticas mínimas:
  - `AmazonS3ReadOnlyAccess` (o más restrictivo a tu bucket)
  - `AmazonDynamoDBFullAccess` (o una política limitada a las tablas necesarias)
  - `AmazonSNSFullAccess` (si usarás SNS desde el servidor)
  - `CloudWatchAgentServerPolicy` para enviar logs/metrics
- Asigna ese Role a la instancia EC2 al lanzarla (o después).

3) Conexión por SSH y preparación
En PowerShell (Windows):

```powershell
ssh -i "path\to\your-key.pem" ec2-user@<EC2_PUBLIC_IP>
sudo yum update -y            # Amazon Linux
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs git
git clone <your-repo> && cd e-learningAWS/backend
npm install
cp .env.example .env
# Edita .env con los valores reales (o configurar variables de entorno)
node src/script.js
```

4) DynamoDB
- Crea las tablas (puedes usar nombres de `.env.example`). Para esquemas rápidos:
  - `CoursesTable` (PK: id)
  - `LessonsTable` (PK: id)
  - `EnrollmentsTable` (PK: userId, SK: courseId) o simplemente PK: composite
  - `ProgressTable` (PK: id o userId + courseId)

5) S3 + CloudFront (Frontend hosting)
- Crea un bucket S3 para tu frontend (sitio estático) y activa `Block Public Access` desactivado solo si usarás CloudFront.
- Subir archivos estáticos del `frontend` (build/static). Mejor usar CloudFront encima del bucket para HTTPS, políticas y caching.
- Crear distribución CloudFront apuntando al bucket S3 y configurar OAI (Origin Access Identity) o OAC para restringir acceso al bucket.

6) Cognito (autenticación)
- Crea un User Pool en Cognito y un App Client.
- Habilita los flujos que necesites (USER_PASSWORD_AUTH, etc.) y configura un Domain si usarás hosted UI.
- Copia `COGNITO_POOL_ID` y ponlo en `.env` en el servidor.

7) CloudWatch
- Para logs de la aplicación: instala el CloudWatch agent o configura que tu aplicación envíe logs usando la API.
- Configura alarmas básicas (CPU > 70% en 5 minutos) y suscripción SNS para alertas.

8) SNS (opcional)
- Crear Topic y suscripción de Email.
- Usa el `SNS_TOPIC_ARN` en `.env` para que el backend publique notificaciones de registro o inscripción.

9) Seguridad y buenas prácticas
- Usar IAM Role en la instancia EC2 en lugar de credenciales estáticas.
- Limitar Security Group por IP para SSH.
- Usar HTTPS en el frontend con CloudFront y un certificado ACM.

10) Costos y Free Tier
- Evita instancias más grandes que t2.micro y revisa el tamaño de S3/DynamoDB.
- Usa Cost Explorer y crea una alarma de Billing para evitar sorpresas.

11) Despliegue rápido
- En EC2: `npm install --production && node src/script.js` o usar PM2/systemd para mantener el proceso.

Si quieres, puedo generar comandos automatizados (CloudFormation / Terraform) para crear estas piezas con valores de ejemplo — dime si quieres ese siguiente paso.
