const express = require('express');
const router = express.Router();
const { coursesRepository } = require('../repositories/simple-dynamodb');

/**
 * GET /api/courses
 * Obtener todos los cursos de DynamoDB
 */
router.get('/', async (req, res) => {
  try {
    const courses = await coursesRepository.getAll();

    res.json({
      success: true,
      count: courses.length,
      courses
    });

  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener cursos'
    });
  }
});

/**
 * GET /api/courses/:id
 * Obtener curso por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const course = await coursesRepository.getById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Curso no encontrado'
      });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener curso'
    });
  }
});

/**
 * GET /api/courses/category/:category
 * Obtener cursos por categoría
 */
router.get('/category/:category', async (req, res) => {
  try {
    const courses = await coursesRepository.getByCategory(req.params.category);

    res.json({
      success: true,
      count: courses.length,
      courses
    });

  } catch (error) {
    console.error('Error al obtener cursos por categoría:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener cursos'
    });
  }
});

/**
 * POST /api/courses
 * Crear nuevo curso (admin)
 */
router.post('/', async (req, res) => {
  try {
    const course = await coursesRepository.create(req.body);

    res.status(201).json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Error al crear curso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear curso'
    });
  }
});

/**
 * PUT /api/courses/:id
 * Actualizar curso (admin)
 */
router.put('/:id', async (req, res) => {
  try {
    const course = await coursesRepository.update(req.params.id, req.body);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Curso no encontrado'
      });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Error al actualizar curso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar curso'
    });
  }
});

/**
 * DELETE /api/courses/:id
 * Eliminar curso (admin)
 */
router.delete('/:id', async (req, res) => {
  try {
    await coursesRepository.delete(req.params.id);

    res.json({
      success: true,
      message: 'Curso eliminado'
    });

  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar curso'
    });
  }
});

module.exports = router;
