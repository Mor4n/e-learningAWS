import { useParams } from 'react-router-dom';
import CoursePlayer from '../components/courses/CoursePlayer';

const Learn = () => {
  const { id } = useParams();

  // Datos del curso - vendrían de la API
  const course = {
    id: id,
    title: 'React - La Guía Completa: Hooks, Router, Redux, Next.js +',
    curriculum: [
      {
        title: 'Introducción a React',
        lectures: 3,
        duration: '1h 30min',
        lessons: [
          {
            id: '1-1',
            title: 'Bienvenida al curso',
            duration: '5:30',
            type: 'Video',
            description: 'Introducción al curso y lo que aprenderás',
          },
          {
            id: '1-2',
            title: '¿Qué es React?',
            duration: '8:45',
            type: 'Video',
            description: 'Conceptos básicos de React y su ecosistema',
          },
          {
            id: '1-3',
            title: 'Configurando el entorno',
            duration: '12:20',
            type: 'Video',
            description: 'Instalación de Node.js, npm y creación del primer proyecto',
          },
        ],
      },
      {
        title: 'Fundamentos de React',
        lectures: 3,
        duration: '3h 15min',
        lessons: [
          {
            id: '2-1',
            title: 'Componentes y Props',
            duration: '15:30',
            type: 'Video',
            description: 'Aprende a crear componentes y pasar datos con props',
          },
          {
            id: '2-2',
            title: 'Estado y ciclo de vida',
            duration: '18:45',
            type: 'Video',
            description: 'Manejo de estado y ciclo de vida en componentes',
          },
          {
            id: '2-3',
            title: 'Eventos en React',
            duration: '12:20',
            type: 'Video',
            description: 'Manejo de eventos del usuario en React',
          },
        ],
      },
      {
        title: 'React Hooks',
        lectures: 4,
        duration: '2h 45min',
        lessons: [
          {
            id: '3-1',
            title: 'Introducción a Hooks',
            duration: '10:30',
            type: 'Video',
            description: 'Qué son los Hooks y por qué usarlos',
          },
          {
            id: '3-2',
            title: 'useState Hook',
            duration: '15:45',
            type: 'Video',
            description: 'Manejo de estado con useState',
          },
          {
            id: '3-3',
            title: 'useEffect Hook',
            duration: '20:20',
            type: 'Video',
            description: 'Efectos secundarios y ciclo de vida con useEffect',
          },
          {
            id: '3-4',
            title: 'Custom Hooks',
            duration: '18:15',
            type: 'Video',
            description: 'Creación de hooks personalizados',
            locked: true,
          },
        ],
      },
      {
        title: 'React Router',
        lectures: 2,
        duration: '2h',
        lessons: [
          {
            id: '4-1',
            title: 'Configuración de React Router',
            duration: '12:30',
            type: 'Video',
            description: 'Instalación y configuración básica',
            locked: true,
          },
          {
            id: '4-2',
            title: 'Rutas y navegación',
            duration: '16:45',
            type: 'Video',
            description: 'Creación de rutas y navegación entre páginas',
            locked: true,
          },
        ],
      },
    ],
  };

  return <CoursePlayer course={course} />;
};

export default Learn;
