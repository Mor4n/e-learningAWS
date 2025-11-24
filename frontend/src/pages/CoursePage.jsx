import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CourseDetail from '../components/courses/CourseDetail';
import { coursesAPI } from '../services/api';

const CoursePage = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await coursesAPI.getById(id);
        setCourse(courseData);
        setError(null);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError('No se pudo cargar el curso. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-udemy-purple mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando curso...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600 max-w-md">
          <p className="text-xl font-semibold mb-2">Error</p>
          <p>{error || 'Curso no encontrado'}</p>
        </div>
      </div>
    );
  }

  return <CourseDetail course={course} />;
};

export default CoursePage;
