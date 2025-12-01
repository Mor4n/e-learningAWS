const express = require('express');
const router = express.Router();
const { verifyCognitoToken, requireGroup } = require('../middleware/cognitoAuth');

/**
 * EJEMPLO DE RUTAS PROTEGIDAS CON COGNITO
 * 
 * Para usar estas rutas:
 * 
 * 1. Instalar dependencia:
 *    npm install jwks-rsa
 * 
 * 2. Configurar variables de entorno en .env:
 *    COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
 *    COGNITO_CLIENT_ID=1234567890abcdefghijklmnop
 *    AWS_REGION=us-east-1
 * 
 * 3. Importar en server.js o app.js:
 *    const cognitoRoutes = require('./routes/cognito-example');
 *    app.use('/api/cognito', cognitoRoutes);
 */

// Ruta pública - No requiere autenticación
router.get('/public', (req, res) => {
  res.json({ 
    success: true,
    message: 'Esta es una ruta pública',
    timestamp: new Date().toISOString()
  });
});

// Ruta protegida - Requiere token válido de Cognito
router.get('/protected', verifyCognitoToken, (req, res) => {
  res.json({ 
    success: true,
    message: 'Acceso autorizado',
    user: req.user
  });
});

// Obtener perfil del usuario autenticado
router.get('/me', verifyCognitoToken, (req, res) => {
  res.json({ 
    success: true,
    user: {
      userId: req.user.userId,
      email: req.user.email,
      name: req.user.name,
      username: req.user.username,
      groups: req.user.groups,
    }
  });
});

// Ruta solo para administradores
router.get('/admin', verifyCognitoToken, requireGroup(['Admins', 'Instructors']), (req, res) => {
  res.json({ 
    success: true,
    message: 'Acceso administrativo autorizado',
    user: req.user
  });
});

// Actualizar perfil de usuario
router.put('/profile', verifyCognitoToken, (req, res) => {
  const { name, preferences } = req.body;
  
  // Aquí actualizarías la base de datos con la información del perfil
  // usando req.user.userId como identificador

  res.json({ 
    success: true,
    message: 'Perfil actualizado',
    userId: req.user.userId,
    updates: { name, preferences }
  });
});

// Obtener cursos del usuario autenticado
router.get('/my-courses', verifyCognitoToken, async (req, res) => {
  try {
    // Aquí consultarías DynamoDB para obtener los cursos del usuario
    // usando req.user.userId
    
    res.json({ 
      success: true,
      userId: req.user.userId,
      courses: [] // Retornar cursos desde DynamoDB
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;
