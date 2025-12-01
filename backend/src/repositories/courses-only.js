const { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');

/**
 * ========================================
 * REPOSITORIO DE CURSOS
 * Tabla: Cursos
 * Partition Key: cursoId (String)
 * 
 * Usuarios se gestionan en AWS Cognito
 * ========================================
 */

const coursesRepository = {
  // Crear nuevo curso
  async create(courseData) {
    const cursoId = courseData.cursoId || `curso-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const item = {
      cursoId,
      titulo: courseData.titulo,
      descripcion: courseData.descripcion,
      imagen: courseData.imagen || '',
      instructor: courseData.instructor || '',
      precio: courseData.precio || 0,
      duracion: courseData.duracion || '',
      nivel: courseData.nivel || 'Principiante',
      categoria: courseData.categoria || '',
      rating: courseData.rating || 0,
      estudiantes: courseData.estudiantes || 0,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.COURSES,
      Item: item,
    }));

    return item;
  },

  // Obtener todos los cursos
  async getAll() {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.COURSES,
    }));

    return result.Items || [];
  },

  // Obtener curso por ID
  async getById(cursoId) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.COURSES,
      Key: { cursoId },
    }));

    return result.Item;
  },

  // Buscar cursos por categoría
  async getByCategory(categoria) {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.COURSES,
      FilterExpression: 'categoria = :categoria',
      ExpressionAttributeValues: {
        ':categoria': categoria,
      },
    }));

    return result.Items || [];
  },

  // Buscar cursos por instructor
  async getByInstructor(instructor) {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.COURSES,
      FilterExpression: 'instructor = :instructor',
      ExpressionAttributeValues: {
        ':instructor': instructor,
      },
    }));

    return result.Items || [];
  },

  // Actualizar curso
  async update(cursoId, updates) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((key, index) => {
      updateExpressions.push(`#attr${index} = :val${index}`);
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = updates[key];
    });

    await docClient.send(new UpdateCommand({
      TableName: TABLES.COURSES,
      Key: { cursoId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }));

    return this.getById(cursoId);
  },

  // Eliminar curso
  async delete(cursoId) {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.COURSES,
      Key: { cursoId },
    }));

    return { success: true };
  },
};

module.exports = {
  coursesRepository,
};
