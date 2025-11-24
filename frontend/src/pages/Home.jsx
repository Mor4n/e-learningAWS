import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, Play } from 'lucide-react';
import CategoryBar from '../components/layout/CategoryBar';
import CourseList from '../components/courses/CourseList';
import { coursesAPI } from '../services/api';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Obtener cursos destacados (todos los cursos)
        const featured = await coursesAPI.getAll();
        setFeaturedCourses(featured);
        
        // Para trending, podemos usar los mismos cursos u ordenar por estudiantes
        const trending = [...featured].sort((a, b) => b.students - a.students);
        setTrendingCourses(trending);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('No se pudieron cargar los cursos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-udemy-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center w-full'>{/*ESTO OCUPO QUE TOOODO ESTÉ CENTRADO */}
      {/* Hero Section */}
      <div className="bg-gray-100 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Aprende de los mejores instructores
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Accede a más de 210,000 cursos en video bajo demanda. Aprende habilidades
                valiosas que te ayudarán a alcanzar tus objetivos.
              </p>
            
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt="Estudiantes aprendiendo"
                className="rounded-lg shadow-2xl"
              />
             
            </div>
          </div>
        </div>
      </div>


      {/* Featured Courses */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CourseList
          courses={featuredCourses}
          title="Cursos más populares"
          subtitle="Elige entre más de 210,000 cursos en video con nuevas incorporaciones cada mes"
        />
      </div>

      


    </div>
  );
};

export default Home;
