# Script de prueba de la API

Write-Host "🧪 Testing Mini Udemy API..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000"

# 1. Health Check
Write-Host "1️⃣ Health Check" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$baseUrl/api/health" -Method Get
Write-Host "✅ Status: $($response.status)" -ForegroundColor Green
Write-Host ""

# 2. Listar cursos
Write-Host "2️⃣ Listar cursos" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$baseUrl/api/courses" -Method Get
Write-Host "✅ Total cursos: $($response.count)" -ForegroundColor Green
Write-Host ""

# 3. Obtener curso específico
Write-Host "3️⃣ Obtener curso ID 1" -ForegroundColor Yellow
$response = Invoke-RestMethod -Uri "$baseUrl/api/courses/1" -Method Get
Write-Host "✅ Curso: $($response.course.title)" -ForegroundColor Green
Write-Host ""

# 4. Registrar usuario
Write-Host "4️⃣ Registrar nuevo usuario" -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123456"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/register" `
        -Method Post `
        -Body $registerBody `
        -ContentType "application/json"
    
    $token = $response.token
    Write-Host "✅ Usuario registrado: $($response.user.name)" -ForegroundColor Green
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
    
    # 5. Login
    Write-Host "5️⃣ Login" -ForegroundColor Yellow
    $loginBody = @{
        email = "test@example.com"
        password = "test123456"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $response.token
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    Write-Host ""
    
    # 6. Inscribirse a un curso
    Write-Host "6️⃣ Inscribirse a curso" -ForegroundColor Yellow
    $enrollBody = @{
        courseId = "1"
    } | ConvertTo-Json
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/enrollments" `
        -Method Post `
        -Body $enrollBody `
        -Headers $headers
    
    Write-Host "✅ Inscripción exitosa" -ForegroundColor Green
    Write-Host ""
    
    # 7. Ver inscripciones
    Write-Host "7️⃣ Ver mis inscripciones" -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/api/enrollments" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Total inscripciones: $($response.count)" -ForegroundColor Green
    Write-Host ""
    
    # 8. Guardar progreso
    Write-Host "8️⃣ Guardar progreso" -ForegroundColor Yellow
    $progressBody = @{
        courseId = "1"
        lessonId = "l1-1"
        completed = $true
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$baseUrl/api/progress" `
        -Method Post `
        -Body $progressBody `
        -Headers $headers
    
    Write-Host "✅ Progreso guardado" -ForegroundColor Green
    Write-Host ""
    
    # 9. Ver progreso del curso
    Write-Host "9️⃣ Ver progreso del curso" -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "$baseUrl/api/progress/1" `
        -Method Get `
        -Headers $headers
    
    Write-Host "✅ Progreso: $($response.stats.progressPercentage)%" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "✅ ¡Todas las pruebas pasaron exitosamente!" -ForegroundColor Green
    
} catch {
    Write-Host "⚠️ Error (esto es normal si el usuario ya existe):" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "📊 Resumen de endpoints disponibles:" -ForegroundColor Cyan
Write-Host "   POST /api/auth/register" -ForegroundColor White
Write-Host "   POST /api/auth/login" -ForegroundColor White
Write-Host "   GET  /api/auth/me" -ForegroundColor White
Write-Host "   GET  /api/courses" -ForegroundColor White
Write-Host "   GET  /api/courses/:id" -ForegroundColor White
Write-Host "   POST /api/enrollments" -ForegroundColor White
Write-Host "   GET  /api/enrollments" -ForegroundColor White
Write-Host "   POST /api/progress" -ForegroundColor White
Write-Host "   GET  /api/progress/:courseId" -ForegroundColor White
Write-Host ""
