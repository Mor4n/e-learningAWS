const { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { docClient, TABLES } = require('../config/dynamodb');
const bcrypt = require('bcryptjs');

/**
 * ========================================
 * REPOSITORIO DE USUARIOS
 * Tabla: Usuarios
 * Partition Key: userId (String)
 * ========================================
 */

const usersRepository = {
  // Crear nuevo usuario
  async create(userData) {
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const passwordHash = await bcrypt.hash(userData.password, 10);

    const item = {
      userId,
      nombre: userData.nombre,
      email: userData.email,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.USERS,
      Item: item,
    }));

    delete item.passwordHash;
    return item;
  },

  // Obtener todos los usuarios
  async getAll() {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.USERS,
    }));

    return result.Items.map(item => {
      delete item.passwordHash;
      return item;
    });
  },

  // Obtener usuario por ID
  async getById(userId) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.USERS,
      Key: { userId },
    }));

    if (result.Item) {
      delete result.Item.passwordHash;
    }

    return result.Item;
  },

  // Buscar usuario por email (usando Scan)
  async findByEmail(email) {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.USERS,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }));

    return result.Items[0] || null;
  },

  // Verificar contraseña
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  // Actualizar usuario
  async update(userId, updates) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((key, index) => {
      updateExpressions.push(`#attr${index} = :val${index}`);
      expressionAttributeNames[`#attr${index}`] = key;
      expressionAttributeValues[`:val${index}`] = updates[key];
    });

    await docClient.send(new UpdateCommand({
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    }));

    return this.getById(userId);
  },

  // Eliminar usuario
  async delete(userId) {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.USERS,
      Key: { userId },
    }));

    return { success: true };
  },
};

/**
 * ========================================
 * REPOSITORIO DE CURSOS
 * Tabla: Cursos
 * Partition Key: cursoId (String)
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

  // Buscar cursos por categoría (usando Scan con filtro)
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

  // Buscar cursos por instructor (usando Scan con filtro)
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
  usersRepository,
  coursesRepository,
};
