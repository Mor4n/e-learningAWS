const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Simulación de progreso (en producción: DynamoDB)
const progress = [];

// POST /api/progress - Actualizar progreso de una lección
router.post('/', authenticateToken, (req, res) => {
  try {
    const { courseId, lessonId, completed } = req.body;
    const userId = req.user.userId;

    if (!courseId || !lessonId) {
      return res.status(400).json({ 
        error: 'Course ID and Lesson ID are required' 
      });
    }

    // Buscar progreso existente
    const existingProgress = progress.find(
      p => p.userId === userId && 
           p.courseId === courseId && 
           p.lessonId === lessonId
    );

    if (existingProgress) {
      // Actualizar progreso existente
      existingProgress.completed = completed !== undefined ? completed : true;
      existingProgress.lastAccessed = new Date().toISOString();

      return res.json({
        success: true,
        message: 'Progress updated',
        progress: existingProgress
      });
    }

    // Crear nuevo progreso
    const newProgress = {
      progressId: `${userId}-${courseId}-${lessonId}`,
      userId,
      courseId,
      lessonId,
      completed: completed !== undefined ? completed : true,
      startedAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    };

    progress.push(newProgress);

    res.status(201).json({
      success: true,
      message: 'Progress saved',
      progress: newProgress
    });

  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// GET /api/progress/:courseId - Obtener progreso de un curso
router.get('/:courseId', authenticateToken, (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const courseProgress = progress.filter(
      p => p.userId === userId && p.courseId === courseId
    );

    // Calcular estadísticas
    const completedLessons = courseProgress.filter(p => p.completed).length;
    const totalLessons = courseProgress.length;
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;

    res.json({
      success: true,
      courseId,
      stats: {
        completedLessons,
        totalLessons,
        progressPercentage
      },
      progress: courseProgress
    });

  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// GET /api/progress - Obtener todo el progreso del usuario
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const userProgress = progress.filter(p => p.userId === userId);

    // Agrupar por curso
    const progressByCourse = {};
    userProgress.forEach(p => {
      if (!progressByCourse[p.courseId]) {
        progressByCourse[p.courseId] = [];
      }
      progressByCourse[p.courseId].push(p);
    });

    res.json({
      success: true,
      totalLessons: userProgress.length,
      completedLessons: userProgress.filter(p => p.completed).length,
      progressByCourse
    });

  } catch (error) {
    console.error('Get all progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// DELETE /api/progress/:courseId/:lessonId - Eliminar progreso de una lección
router.delete('/:courseId/:lessonId', authenticateToken, (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const userId = req.user.userId;

    const index = progress.findIndex(
      p => p.userId === userId && 
           p.courseId === courseId && 
           p.lessonId === lessonId
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Progress not found' });
    }

    progress.splice(index, 1);

    res.json({
      success: true,
      message: 'Progress deleted'
    });

  } catch (error) {
    console.error('Delete progress error:', error);
    res.status(500).json({ error: 'Failed to delete progress' });
  }
});

module.exports = router;
