const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Simulación de inscripciones (en producción: DynamoDB)
const enrollments = [];

// POST /api/enrollments - Inscribirse a un curso
router.post('/', authenticateToken, (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.userId;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Verificar si ya está inscrito
    const existingEnrollment = enrollments.find(
      e => e.userId === userId && e.courseId === courseId
    );

    if (existingEnrollment) {
      return res.status(409).json({ 
        error: 'Already enrolled in this course' 
      });
    }

    // Crear inscripción
    const enrollment = {
      enrollmentId: `${userId}-${courseId}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completed: false
    };

    enrollments.push(enrollment);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in course',
      enrollment
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Failed to enroll in course' });
  }
});

// GET /api/enrollments - Obtener cursos inscritos del usuario
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const userEnrollments = enrollments.filter(e => e.userId === userId);

    res.json({
      success: true,
      count: userEnrollments.length,
      enrollments: userEnrollments
    });

  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

// GET /api/enrollments/:courseId - Verificar inscripción en curso específico
router.get('/:courseId', authenticateToken, (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const enrollment = enrollments.find(
      e => e.userId === userId && e.courseId === courseId
    );

    res.json({
      success: true,
      enrolled: !!enrollment,
      enrollment: enrollment || null
    });

  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ error: 'Failed to check enrollment' });
  }
});

// DELETE /api/enrollments/:courseId - Desinscribirse de un curso
router.delete('/:courseId', authenticateToken, (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.userId;

    const index = enrollments.findIndex(
      e => e.userId === userId && e.courseId === courseId
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    enrollments.splice(index, 1);

    res.json({
      success: true,
      message: 'Successfully unenrolled from course'
    });

  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ error: 'Failed to unenroll from course' });
  }
});

module.exports = router;
