// Script para crear las tablas de DynamoDB
require('dotenv').config();
const { client, TABLES } = require('../config/aws');
const { CreateTableCommand, DescribeTableCommand, waitUntilTableExists } = require('@aws-sdk/client-dynamodb');

// Definición de las tablas
const tableDefinitions = [
  {
    TableName: TABLES.USERS,
    KeySchema: [
      { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'email', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'EmailIndex',
        KeySchema: [
          { AttributeName: 'email', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: TABLES.COURSES,
    KeySchema: [
      { AttributeName: 'courseId', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'courseId', AttributeType: 'S' },
      { AttributeName: 'category', AttributeType: 'S' },
      { AttributeName: 'instructorId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'CategoryIndex',
        KeySchema: [
          { AttributeName: 'category', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'InstructorIndex',
        KeySchema: [
          { AttributeName: 'instructorId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: TABLES.ENROLLMENTS,
    KeySchema: [
      { AttributeName: 'enrollmentId', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'enrollmentId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'courseId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'UserIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'CourseIndex',
        KeySchema: [
          { AttributeName: 'courseId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'UserCourseIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'courseId', KeyType: 'RANGE' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
  {
    TableName: TABLES.PROGRESS,
    KeySchema: [
      { AttributeName: 'progressId', KeyType: 'HASH' }, // Partition key
    ],
    AttributeDefinitions: [
      { AttributeName: 'progressId', AttributeType: 'S' },
      { AttributeName: 'userId', AttributeType: 'S' },
      { AttributeName: 'courseId', AttributeType: 'S' },
      { AttributeName: 'lessonId', AttributeType: 'S' },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'UserIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'UserCourseIndex',
        KeySchema: [
          { AttributeName: 'userId', KeyType: 'HASH' },
          { AttributeName: 'courseId', KeyType: 'RANGE' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
      {
        IndexName: 'CourseLessonIndex',
        KeySchema: [
          { AttributeName: 'courseId', KeyType: 'HASH' },
          { AttributeName: 'lessonId', KeyType: 'RANGE' },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 5,
      WriteCapacityUnits: 5,
    },
  },
];

// Función para crear una tabla
async function createTable(tableDefinition) {
  try {
    console.log(`Creating table: ${tableDefinition.TableName}...`);
    
    // Verificar si la tabla ya existe
    try {
      await client.send(new DescribeTableCommand({ TableName: tableDefinition.TableName }));
      console.log(`✅ Table ${tableDefinition.TableName} already exists`);
      return;
    } catch (error) {
      if (error.name !== 'ResourceNotFoundException') {
        throw error;
      }
    }

    // Crear la tabla
    await client.send(new CreateTableCommand(tableDefinition));
    console.log(`✅ Table ${tableDefinition.TableName} created successfully`);

    // Esperar a que la tabla esté activa
    console.log(`Waiting for table ${tableDefinition.TableName} to be active...`);
    await waitUntilTableExists(
      { client, maxWaitTime: 300, minDelay: 5, maxDelay: 20 },
      { TableName: tableDefinition.TableName }
    );
    console.log(`✅ Table ${tableDefinition.TableName} is now active`);
  } catch (error) {
    console.error(`❌ Error creating table ${tableDefinition.TableName}:`, error.message);
    throw error;
  }
}

// Función principal
async function main() {
  console.log('🚀 Starting DynamoDB tables creation...\n');
  console.log(`Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  console.log(`Environment: ${process.env.NODE_ENV}\n`);

  try {
    // Crear todas las tablas
    for (const tableDefinition of tableDefinitions) {
      await createTable(tableDefinition);
      console.log('---');
    }

    console.log('\n✅ All tables created successfully!');
    console.log('\nCreated tables:');
    console.log(`  - ${TABLES.USERS}`);
    console.log(`  - ${TABLES.COURSES}`);
    console.log(`  - ${TABLES.ENROLLMENTS}`);
    console.log(`  - ${TABLES.PROGRESS}`);
  } catch (error) {
    console.error('\n❌ Failed to create tables:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = { createTable, tableDefinitions };
