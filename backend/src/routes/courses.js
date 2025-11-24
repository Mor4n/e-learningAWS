const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

// Datos de cursos simulados (en producción vendrían de DynamoDB)
const courses = [
  {
    id: '1',
    title: 'React - La Guía Completa: Hooks, Router, Redux, Next.js +',
    subtitle: 'Aprende React desde cero hasta experto con proyectos reales',
    instructor: 'Juan Pérez',
    instructorId: 'instructor-1',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    rating: 4.7,
    ratingCount: 28450,
    price: 14.99,
    originalPrice: 89.99,
    bestseller: true,
    category: 'Desarrollo Web',
    duration: '45h',
    students: 158340,
    language: 'Español',
    lastUpdated: '2024-11',
    level: 'Todos los niveles',
    description: 'Este es el curso más completo de React en español. Aprenderás desde los fundamentos hasta las características más avanzadas.',
    whatYouWillLearn: [
      'Dominar React desde cero hasta nivel avanzado',
      'Crear aplicaciones web modernas y escalables',
      'Utilizar React Hooks de forma profesional',
      'Implementar gestión de estado con Redux',
      'Crear aplicaciones con Next.js',
      'Consumir APIs REST y GraphQL'
    ],
    requirements: [
      'Conocimientos básicos de HTML, CSS y JavaScript',
      'Familiaridad con ES6+',
      'Una computadora con acceso a internet'
    ],
    curriculum: [
      {
        sectionId: 's1',
        title: 'Introducción a React',
        lectures: 12,
        duration: '1h 30min',
        lessons: [
          { id: 'l1-1', title: 'Bienvenida al curso', duration: '5:30', type: 'Video', preview: true },
          { id: 'l1-2', title: '¿Qué es React?', duration: '8:45', type: 'Video', preview: true },
          { id: 'l1-3', title: 'Configurando el entorno', duration: '12:20', type: 'Video' }
        ]
      },
      {
        sectionId: 's2',
        title: 'Fundamentos de React',
        lectures: 18,
        duration: '3h 15min',
        lessons: [
          { id: 'l2-1', title: 'Componentes y Props', duration: '15:30', type: 'Video' },
          { id: 'l2-2', title: 'Estado y ciclo de vida', duration: '18:45', type: 'Video' }
        ]
      }
    ],
    createdAt: '2024-01-15',
    updatedAt: '2024-11-20'
  },
  {
    id: '2',
    title: 'Python para Data Science y Machine Learning',
    subtitle: 'Domina Python, NumPy, Pandas, Matplotlib y más',
    instructor: 'María García',
    instructorId: 'instructor-2',
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
    rating: 4.6,
    ratingCount: 15230,
    price: 12.99,
    originalPrice: 84.99,
    bestseller: true,
    category: 'Data Science',
    duration: '35h',
    students: 89250,
    language: 'Español',
    lastUpdated: '2024-10',
    level: 'Principiante',
    description: 'Aprende Python desde cero y conviértete en un científico de datos profesional.',
    whatYouWillLearn: [
      'Programación en Python desde cero',
      'Análisis de datos con Pandas',
      'Visualización con Matplotlib y Seaborn',
      'Machine Learning con Scikit-learn',
      'Crear modelos predictivos',
      'Trabajar con datos reales'
    ],
    requirements: [
      'No se requiere experiencia previa',
      'Computadora con Windows, Mac o Linux'
    ],
    curriculum: [
      {
        sectionId: 's1',
        title: 'Introducción a Python',
        lectures: 15,
        duration: '2h',
        lessons: [
          { id: 'l1-1', title: 'Instalación de Python', duration: '10:30', type: 'Video', preview: true },
          { id: 'l1-2', title: 'Variables y tipos de datos', duration: '15:45', type: 'Video' }
        ]
      }
    ],
    createdAt: '2024-02-10',
    updatedAt: '2024-10-15'
  },
  {
    id: '3',
    title: 'AWS Certified Solutions Architect - Associate 2024',
    subtitle: 'Prepárate para la certificación AWS con proyectos prácticos',
    instructor: 'Carlos Rodríguez',
    instructorId: 'instructor-3',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    rating: 4.8,
    ratingCount: 42180,
    price: 16.99,
    originalPrice: 94.99,
    bestseller: true,
    category: 'Cloud Computing',
    duration: '28h',
    students: 125680,
    language: 'Español',
    lastUpdated: '2024-11',
    level: 'Intermedio',
    description: 'Curso completo para aprobar la certificación AWS Solutions Architect Associate.',
    whatYouWillLearn: [
      'Arquitecturas en AWS',
      'EC2, S3, RDS, Lambda',
      'Redes y VPC',
      'Seguridad con IAM',
      'CloudFormation',
      'Casos de uso reales'
    ],
    requirements: [
      'Conocimientos básicos de redes',
      'Experiencia con servidores',
      'Cuenta de AWS (Free Tier)'
    ],
    curriculum: [
      {
        sectionId: 's1',
        title: 'Introducción a AWS',
        lectures: 10,
        duration: '1h 45min',
        lessons: [
          { id: 'l1-1', title: 'Qué es AWS', duration: '12:30', type: 'Video', preview: true },
          { id: 'l1-2', title: 'Crear cuenta de AWS', duration: '8:15', type: 'Video', preview: true }
        ]
      }
    ],
    createdAt: '2024-01-05',
    updatedAt: '2024-11-18'
  },
  {
    id: '4',
    title: 'Diseño Web Completo: HTML5, CSS3, JavaScript',
    subtitle: 'Aprende a crear sitios web modernos desde cero',
    instructor: 'Ana López',
    instructorId: 'instructor-4',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=225&fit=crop',
    rating: 4.5,
    ratingCount: 9870,
    price: 11.99,
    originalPrice: 79.99,
    category: 'Desarrollo Web',
    duration: '32h',
    students: 56230,
    language: 'Español',
    lastUpdated: '2024-09',
    level: 'Principiante',
    description: 'Domina HTML5, CSS3 y JavaScript para crear sitios web profesionales.',
    whatYouWillLearn: [
      'HTML5 semántico',
      'CSS3 y diseño responsivo',
      'JavaScript moderno',
      'Flexbox y Grid',
      'Animaciones CSS',
      'Proyectos reales'
    ],
    requirements: [
      'No se requiere experiencia previa',
      'Ganas de aprender'
    ],
    curriculum: [
      {
        sectionId: 's1',
        title: 'Fundamentos de HTML',
        lectures: 20,
        duration: '3h',
        lessons: [
          { id: 'l1-1', title: 'Estructura HTML', duration: '15:00', type: 'Video', preview: true }
        ]
      }
    ],
    createdAt: '2024-03-20',
    updatedAt: '2024-09-10'
  }
];

// GET /api/courses - Listar todos los cursos
router.get('/', optionalAuth, (req, res) => {
  try {
    const { category, search, sort, limit } = req.query;

    let filteredCourses = [...courses];

    // Filtrar por categoría
    if (category) {
      filteredCourses = filteredCourses.filter(
        c => c.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Buscar por título o instructor
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        c => c.title.toLowerCase().includes(searchLower) ||
             c.instructor.toLowerCase().includes(searchLower) ||
             c.category.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar
    if (sort === 'rating') {
      filteredCourses.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'students') {
      filteredCourses.sort((a, b) => b.students - a.students);
    } else if (sort === 'price-low') {
      filteredCourses.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filteredCourses.sort((a, b) => b.price - a.price);
    } else if (sort === 'newest') {
      filteredCourses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Limitar resultados
    if (limit) {
      filteredCourses = filteredCourses.slice(0, parseInt(limit));
    }

    res.json({
      success: true,
      count: filteredCourses.length,
      courses: filteredCourses
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id - Obtener un curso específico
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const course = courses.find(c => c.id === id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// GET /api/courses/category/:category - Cursos por categoría
router.get('/category/:category', optionalAuth, (req, res) => {
  try {
    const { category } = req.params;
    const filteredCourses = courses.filter(
      c => c.category.toLowerCase() === category.toLowerCase()
    );

    res.json({
      success: true,
      category,
      count: filteredCourses.length,
      courses: filteredCourses
    });

  } catch (error) {
    console.error('Get courses by category error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id/curriculum - Obtener currículum del curso
router.get('/:id/curriculum', optionalAuth, (req, res) => {
  try {
    const { id } = req.params;
    const course = courses.find(c => c.id === id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      success: true,
      courseId: id,
      curriculum: course.curriculum
    });

  } catch (error) {
    console.error('Get curriculum error:', error);
    res.status(500).json({ error: 'Failed to fetch curriculum' });
  }
});

module.exports = router;
