import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, TrendingUp } from 'lucide-react';
import CourseList from '../components/courses/CourseList';
import { enrollmentsAPI, progressAPI, coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyLearning = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Obtener inscripciones del usuario
        const enrollments = await enrollmentsAPI.getMyEnrollments();
        
        // Obtener el progreso de cada curso
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment) => {
            try {
              const courseData = await coursesAPI.getById(enrollment.courseId);
              const progressData = await progressAPI.getCourseProgress(enrollment.courseId);
              
              return {
                ...courseData,
                enrolledAt: enrollment.enrolledAt,
                progress: progressData.progressPercentage || 0,
                completedLessons: progressData.completedLessons || 0,
                totalLessons: progressData.totalLessons || 0,
              };
            } catch (err) {
              console.error(`Error fetching course ${enrollment.courseId}:`, err);
              return null;
            }
          })
        );

        setEnrolledCourses(coursesWithProgress.filter(course => course !== null));
        setError(null);
      } catch (err) {
        console.error('Error fetching enrollments:', err);
        setError('No se pudieron cargar tus cursos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Inicia sesión para ver tus cursos</h2>
          <p className="text-gray-600 mb-4">Accede a tu cuenta para ver y continuar tus cursos</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-udemy-purple text-white font-semibold rounded-lg hover:bg-udemy-purple-dark transition">
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-udemy-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus cursos...</p>
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

  const completedCourses = enrolledCourses.filter(course => course.progress === 100);
  const inProgressCourses = enrolledCourses.filter(course => course.progress < 100);

  const stats = [
    {
      icon: BookOpen,
      label: 'Cursos en progreso',
      value: inProgressCourses.length,
      color: 'bg-blue-500',
    },
    {
      icon: Clock,
      label: 'Horas totales',
      value: `${Math.floor(enrolledCourses.reduce((total, course) => {
        const hours = parseInt(course.duration) || 0;
        return total + hours;
      }, 0))}h`,
      color: 'bg-green-500',
    },
    {
      icon: Award,
      label: 'Certificados',
      value: completedCourses.length,
      color: 'bg-purple-500',
    },
    {
      icon: TrendingUp,
      label: 'Racha actual',
      value: '7 días',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi aprendizaje</h1>
          <p className="text-gray-600">
            Continúa donde lo dejaste o explora nuevos cursos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cursos en progreso */}
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes cursos inscritos aún</h3>
            <p className="text-gray-600 mb-6">Explora nuestro catálogo y comienza tu viaje de aprendizaje</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 bg-udemy-purple text-white font-semibold rounded-lg hover:bg-udemy-purple-dark transition"
            >
              Explorar cursos
            </Link>
          </div>
        ) : (
          <>
            {inProgressCourses.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Continúa aprendiendo</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inProgressCourses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}/learn`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition group"
              >
                <div className="relative aspect-video">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white text-udemy-purple p-3 rounded-full">
                        <BookOpen className="w-8 h-8" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-udemy-purple transition">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{course.instructor}</p>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-semibold text-udemy-purple">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-udemy-purple h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    {course.completedLessons} de {course.totalLessons} lecciones
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
            )}

            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Cursos completados</h2>
                <CourseList courses={completedCourses} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
