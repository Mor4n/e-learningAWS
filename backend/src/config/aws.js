// AWS Configuration
require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configuración del cliente
const config = {
  region: process.env.AWS_REGION || 'us-east-1',
};

// Si hay credenciales configuradas
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

// Si estamos en desarrollo local con DynamoDB Local
if (process.env.NODE_ENV === 'development' && process.env.DYNAMODB_LOCAL === 'true') {
  config.endpoint = process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000';
}

// Crear cliente de DynamoDB
const client = new DynamoDBClient(config);

// DynamoDBDocumentClient simplifica el manejo de datos
const docClient = DynamoDBDocumentClient.from(client);

// Nombres de las tablas
const TABLES = {
  USERS: process.env.DYNAMODB_TABLE_USERS || 'mini-udemy-users',
  COURSES: process.env.DYNAMODB_TABLE_COURSES || 'mini-udemy-courses',
  ENROLLMENTS: process.env.DYNAMODB_TABLE_ENROLLMENTS || 'mini-udemy-enrollments',
  PROGRESS: process.env.DYNAMODB_TABLE_PROGRESS || 'mini-udemy-progress',
};

module.exports = {
  client,
  docClient,
  TABLES,
};
