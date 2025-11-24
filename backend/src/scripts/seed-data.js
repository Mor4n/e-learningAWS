// Script para poblar DynamoDB con datos iniciales
require('dotenv').config();
const { coursesRepository } = require('../repositories/dynamodb');

// Cursos iniciales
const initialCourses = [
  {
    courseId: 'course-1',
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
      'Consumir APIs REST y GraphQL',
    ],
    requirements: [
      'Conocimientos básicos de HTML, CSS y JavaScript',
      'Familiaridad con ES6+',
      'Una computadora con acceso a internet',
    ],
    curriculum: [
      {
        title: 'Introducción a React',
        lectures: 12,
        duration: '1h 30min',
        lessons: [
          { id: '1-1', title: 'Bienvenida al curso', duration: '5:30', type: 'Video' },
          { id: '1-2', title: '¿Qué es React?', duration: '8:45', type: 'Video' },
          { id: '1-3', title: 'Configurando el entorno', duration: '12:20', type: 'Video' },
        ],
      },
      {
        title: 'Fundamentos de React',
        lectures: 18,
        duration: '3h 15min',
        lessons: [
          { id: '2-1', title: 'Componentes y Props', duration: '15:30', type: 'Video' },
          { id: '2-2', title: 'Estado y ciclo de vida', duration: '18:45', type: 'Video' },
        ],
      },
    ],
  },
  {
    courseId: 'course-2',
    title: 'Python para Data Science y Machine Learning - Bootcamp',
    subtitle: 'Aprende Python, NumPy, Pandas, Matplotlib, Scikit-learn y más',
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
    level: 'Intermedio',
    description: 'Conviértete en un científico de datos con este bootcamp completo de Python.',
    whatYouWillLearn: [
      'Programación en Python desde cero',
      'Análisis de datos con Pandas y NumPy',
      'Visualización de datos con Matplotlib y Seaborn',
      'Machine Learning con Scikit-learn',
      'Deep Learning básico con TensorFlow',
      'Proyectos reales de Data Science',
    ],
    requirements: [
      'No se requieren conocimientos previos de programación',
      'Computadora con al menos 4GB de RAM',
      'Ganas de aprender',
    ],
    curriculum: [
      {
        title: 'Introducción a Python',
        lectures: 20,
        duration: '4h',
        lessons: [
          { id: '1-1', title: 'Instalación de Python', duration: '10:00', type: 'Video' },
          { id: '1-2', title: 'Variables y tipos de datos', duration: '15:30', type: 'Video' },
        ],
      },
    ],
  },
  {
    courseId: 'course-3',
    title: 'AWS Certified Solutions Architect - Associate 2024',
    subtitle: 'Prepárate para la certificación AWS con proyectos hands-on',
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
    description: 'Curso completo para aprobar el examen AWS Solutions Architect Associate.',
    whatYouWillLearn: [
      'Arquitectura de soluciones en AWS',
      'Servicios principales de AWS (EC2, S3, RDS, etc)',
      'Diseño de sistemas escalables y resilientes',
      'Seguridad y cumplimiento en AWS',
      'Optimización de costos',
      'Preparación completa para el examen',
    ],
    requirements: [
      'Conocimientos básicos de redes',
      'Experiencia básica con servidores',
      'Cuenta de AWS (capa gratuita)',
    ],
    curriculum: [
      {
        title: 'Introducción a AWS',
        lectures: 15,
        duration: '2h 30min',
        lessons: [
          { id: '1-1', title: 'Creación de cuenta AWS', duration: '8:00', type: 'Video' },
          { id: '1-2', title: 'Consola de AWS', duration: '12:30', type: 'Video' },
        ],
      },
    ],
  },
  {
    courseId: 'course-4',
    title: 'Diseño Web Completo: HTML5, CSS3, JavaScript, jQuery, Bootstrap',
    subtitle: 'Aprende desarrollo web frontend desde cero',
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
    description: 'Curso completo de desarrollo web frontend con HTML, CSS y JavaScript.',
    whatYouWillLearn: [
      'HTML5 semántico',
      'CSS3 y animaciones',
      'JavaScript moderno (ES6+)',
      'jQuery y manipulación del DOM',
      'Bootstrap 5 y diseño responsivo',
      'Proyectos prácticos',
    ],
    requirements: [
      'No se requieren conocimientos previos',
      'Computadora con navegador web',
      'Editor de código (recomendado VS Code)',
    ],
    curriculum: [
      {
        title: 'HTML desde cero',
        lectures: 16,
        duration: '2h 45min',
        lessons: [
          { id: '1-1', title: 'Introducción a HTML', duration: '10:00', type: 'Video' },
          { id: '1-2', title: 'Etiquetas básicas', duration: '15:00', type: 'Video' },
        ],
      },
    ],
  },
];

// Función principal
async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Insertar cursos
    console.log('📚 Inserting courses...');
    for (const course of initialCourses) {
      await coursesRepository.create(course);
      console.log(`  ✅ Created course: ${course.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nInserted ${initialCourses.length} courses`);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, initialCourses };
