const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

// Cliente JWKS para obtener claves públicas de Cognito
const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 86400000, // 24 horas
});

/**
 * Obtiene la clave pública para verificar el JWT
 */
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

/**
 * Middleware para verificar tokens JWT de AWS Cognito
 * 
 * Valida:
 * - Firma del token usando JWKS
 * - Audience (client_id)
 * - Issuer (user pool)
 * - Expiración
 */
const verifyCognitoToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      error: 'No token provided' 
    });
  }

  const token = authHeader.split(' ')[1];

  // Configuración de verificación
  const options = {
    audience: process.env.COGNITO_CLIENT_ID,
    issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
    algorithms: ['RS256'],
  };

  jwt.verify(token, getKey, options, (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ 
        success: false,
        error: 'Invalid or expired token',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    // Adjuntar información del usuario al request
    req.user = {
      userId: decoded.sub,
      email: decoded.email,
      name: decoded.name || decoded.email,
      username: decoded['cognito:username'],
      groups: decoded['cognito:groups'] || [],
      tokenUse: decoded.token_use, // 'id' o 'access'
    };

    next();
  });
};

/**
 * Middleware opcional: Verifica que el usuario pertenezca a grupos específicos
 */
const requireGroup = (allowedGroups) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Authentication required' 
      });
    }

    const userGroups = req.user.groups || [];
    const hasAccess = allowedGroups.some(group => userGroups.includes(group));

    if (!hasAccess) {
      return res.status(403).json({ 
        success: false,
        error: 'Insufficient permissions',
        required: allowedGroups,
        current: userGroups
      });
    }

    next();
  };
};

module.exports = { 
  verifyCognitoToken,
  requireGroup
};
