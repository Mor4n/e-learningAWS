const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

// Configuración del cliente de DynamoDB
const config = {
  region: process.env.AWS_REGION || 'us-east-2',
};

// Solo agregar credenciales si están definidas
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

// DynamoDB Local (solo para desarrollo)
if (process.env.DYNAMODB_LOCAL === 'true' && process.env.DYNAMODB_ENDPOINT) {
  config.endpoint = process.env.DYNAMODB_ENDPOINT;
}

// Cliente base de DynamoDB
const client = new DynamoDBClient(config);

// Cliente de documento (simplifica operaciones)
const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false,
  },
  unmarshallOptions: {
    wrapNumbers: false,
  },
});

// Nombres de las tablas (solo cursos, usuarios en Cognito)
const TABLES = {
  COURSES: process.env.DYNAMODB_TABLE_COURSES || 'Cursos',
};

module.exports = {
  client,
  docClient,
  TABLES,
};
