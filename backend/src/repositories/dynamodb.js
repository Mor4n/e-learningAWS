// DynamoDB Repository - Capa de acceso a datos para DynamoDB
const { docClient, TABLES } = require('../config/aws');
const { PutCommand, GetCommand, QueryCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

/**
 * Usuarios Repository
 */
const usersRepository = {
  // Crear usuario
  async create(user) {
    const Item = {
      userId: user.userId,
      email: user.email,
      name: user.name,
      password: user.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.USERS,
      Item,
    }));
    
    return Item;
  },

  // Buscar usuario por email
  async findByEmail(email) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.USERS,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    }));

    return result.Items[0] || null;
  },

  // Buscar usuario por ID
  async findById(userId) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.USERS,
      Key: { userId },
    }));

    return result.Item || null;
  },

  // Actualizar usuario
  async update(userId, updates) {
    const result = await docClient.send(new UpdateCommand({
      TableName: TABLES.USERS,
      Key: { userId },
      UpdateExpression: 'set #name = :name, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name',
      },
      ExpressionAttributeValues: {
        ':name': updates.name,
        ':updatedAt': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes;
  },
};

/**
 * Cursos Repository
 */
const coursesRepository = {
  // Crear curso
  async create(course) {
    const Item = {
      ...course,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.COURSES,
      Item,
    }));

    return Item;
  },

  // Obtener todos los cursos (con filtros opcionales)
  async getAll(filters = {}) {
    // Si hay filtro por categoría, usar GSI
    if (filters.category) {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLES.COURSES,
        IndexName: 'CategoryIndex',
        KeyConditionExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': filters.category,
        },
      }));
      return result.Items;
    }

    // Scan completo (no recomendado en producción, mejor usar paginación)
    const result = await docClient.send(new ScanCommand({
      TableName: TABLES.COURSES,
    }));
    return result.Items;
  },

  // Obtener curso por ID
  async getById(courseId) {
    const result = await docClient.send(new GetCommand({
      TableName: TABLES.COURSES,
      Key: { courseId },
    }));

    return result.Item || null;
  },

  // Actualizar curso
  async update(courseId, updates) {
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    Object.keys(updates).forEach((key, index) => {
      updateExpression.push(`#field${index} = :value${index}`);
      expressionAttributeNames[`#field${index}`] = key;
      expressionAttributeValues[`:value${index}`] = updates[key];
    });

    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    updateExpression.push('updatedAt = :updatedAt');

    const result = await docClient.send(new UpdateCommand({
      TableName: TABLES.COURSES,
      Key: { courseId },
      UpdateExpression: `set ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }));

    return result.Attributes;
  },

  // Eliminar curso
  async delete(courseId) {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.COURSES,
      Key: { courseId },
    }));
  },

  // Buscar cursos por instructor
  async getByInstructor(instructorId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.COURSES,
      IndexName: 'InstructorIndex',
      KeyConditionExpression: 'instructorId = :instructorId',
      ExpressionAttributeValues: {
        ':instructorId': instructorId,
      },
    }));

    return result.Items;
  },
};

/**
 * Inscripciones Repository
 */
const enrollmentsRepository = {
  // Crear inscripción
  async create(enrollment) {
    const Item = {
      enrollmentId: enrollment.enrollmentId,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      enrolledAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.ENROLLMENTS,
      Item,
    }));

    return Item;
  },

  // Obtener inscripciones de un usuario
  async getByUser(userId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.ENROLLMENTS,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    return result.Items;
  },

  // Verificar si un usuario está inscrito en un curso
  async checkEnrollment(userId, courseId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.ENROLLMENTS,
      IndexName: 'UserCourseIndex',
      KeyConditionExpression: 'userId = :userId AND courseId = :courseId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':courseId': courseId,
      },
    }));

    return result.Items.length > 0 ? result.Items[0] : null;
  },

  // Eliminar inscripción
  async delete(enrollmentId) {
    await docClient.send(new DeleteCommand({
      TableName: TABLES.ENROLLMENTS,
      Key: { enrollmentId },
    }));
  },

  // Obtener inscripciones de un curso
  async getByCourse(courseId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.ENROLLMENTS,
      IndexName: 'CourseIndex',
      KeyConditionExpression: 'courseId = :courseId',
      ExpressionAttributeValues: {
        ':courseId': courseId,
      },
    }));

    return result.Items;
  },
};

/**
 * Progreso Repository
 */
const progressRepository = {
  // Guardar progreso
  async save(progress) {
    const Item = {
      progressId: progress.progressId,
      userId: progress.userId,
      courseId: progress.courseId,
      lessonId: progress.lessonId,
      completed: progress.completed,
      completedAt: progress.completedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: TABLES.PROGRESS,
      Item,
    }));

    return Item;
  },

  // Obtener progreso de un usuario en un curso
  async getByCourse(userId, courseId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.PROGRESS,
      IndexName: 'UserCourseIndex',
      KeyConditionExpression: 'userId = :userId AND courseId = :courseId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':courseId': courseId,
      },
    }));

    return result.Items;
  },

  // Obtener todo el progreso de un usuario
  async getByUser(userId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.PROGRESS,
      IndexName: 'UserIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
    }));

    return result.Items;
  },

  // Verificar si una lección está completada
  async checkLesson(userId, courseId, lessonId) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLES.PROGRESS,
      IndexName: 'CourseLessonIndex',
      KeyConditionExpression: 'courseId = :courseId AND lessonId = :lessonId',
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':courseId': courseId,
        ':lessonId': lessonId,
      },
    }));

    return result.Items[0] || null;
  },
};

module.exports = {
  usersRepository,
  coursesRepository,
  enrollmentsRepository,
  progressRepository,
};
