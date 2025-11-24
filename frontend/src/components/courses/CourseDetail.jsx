import { Star, Users, Globe, Award, Clock, PlayCircle, FileText, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enrollmentsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CourseDetail = ({ course }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !course) return;
      
      try {
        const status = await enrollmentsAPI.checkEnrollment(course.id);
        setIsEnrolled(status.enrolled);
      } catch (err) {
        console.error('Error checking enrollment:', err);
      }
    };

    checkEnrollment();
  }, [user, course]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await enrollmentsAPI.enroll(course.id);
      setIsEnrolled(true);
      navigate(`/course/${course.id}/learn`);
    } catch (err) {
      console.error('Error enrolling:', err);
      setError(err.response?.data?.error || 'Error al inscribirse en el curso');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = () => {
    navigate(`/course/${course.id}/learn`);
  };

  const {
    title,
    subtitle,
    instructor,
    rating = 4.7,
    ratingCount = 15420,
    students = 58340,
    language = 'Español',
    lastUpdated = 'Noviembre 2024',
    description,
    whatYouWillLearn = [],
    requirements = [],
    curriculum = [],
    price,
    originalPrice,
  } = course;

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <span className="text-sm text-purple-400">Categoría: Desarrollo</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
              <p className="text-xl text-gray-300 mb-6">{subtitle}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-yellow-400">{rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-500'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-purple-300">
                    ({ratingCount.toLocaleString()} calificaciones)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>{students.toLocaleString()} estudiantes</span>
                </div>
              </div>

              <p className="text-sm">
                Creado por <span className="text-purple-300 underline">{instructor}</span>
              </p>

              <div className="flex items-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Última actualización {lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{language}</span>
                </div>
              </div>
            </div>

            {/* Card de compra flotante en mobile será posicionada diferente */}
            <div className="lg:col-span-1"></div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2">
            {/* Pestañas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-semibold whitespace-nowrap ${
                      activeTab === tab
                        ? 'border-b-2 border-udemy-purple text-udemy-purple'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'overview' && 'Descripción general'}
                    {tab === 'curriculum' && 'Contenido del curso'}
                    {tab === 'instructor' && 'Instructor'}
                    {tab === 'reviews' && 'Reseñas'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Lo que aprenderás</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {whatYouWillLearn.map((item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <svg
                            className="w-5 h-5 text-green-600 mt-0.5 shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Requisitos</h2>
                    <ul className="list-disc list-inside space-y-2 mb-8">
                      {requirements.map((req, index) => (
                        <li key={index} className="text-gray-700">{req}</li>
                      ))}
                    </ul>

                    <h2 className="text-2xl font-bold mb-4">Descripción</h2>
                    <div className="prose max-w-none text-gray-700">
                      <p>{description}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'curriculum' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Contenido del curso</h2>
                    <div className="space-y-4">
                      {curriculum.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg">
                          <button className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <PlayCircle className="w-5 h-5" />
                              <div className="text-left">
                                <h3 className="font-semibold">{section.title}</h3>
                                <p className="text-sm text-gray-600">
                                  {section.lectures} clases • {section.duration}
                                </p>
                              </div>
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'instructor' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Sobre el instructor</h2>
                    <div className="flex items-start gap-6">
                      <div className="w-24 h-24 bg-udemy-purple text-white rounded-full flex items-center justify-center text-3xl font-bold shrink-0">
                        {instructor?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{instructor}</h3>
                        <p className="text-gray-600 mb-4">Desarrollador Full Stack</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            <span>4.7 Calificación instructor</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span>125,340 Estudiantes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6">Reseñas de estudiantes</h2>
                    <div className="space-y-6">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                              E
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold">Estudiante {review}</span>
                                <span className="text-sm text-gray-500">hace 2 semanas</span>
                              </div>
                              <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700">
                                Excelente curso, muy bien explicado y con ejemplos prácticos.
                                Lo recomiendo totalmente.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Card de compra */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 sticky top-20">
              <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white" />
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              {isEnrolled ? (
                <button 
                  onClick={handleStartLearning}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded mb-4 transition"
                >
                  Continuar aprendiendo
                </button>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold">${price}</span>
                    {originalPrice && (
                      <span className="text-lg text-gray-500 line-through">${originalPrice}</span>
                    )}
                    <span className="text-sm text-red-600 font-semibold">
                      {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                    </span>
                  </div>

                  <button 
                    onClick={handleEnroll}
                    disabled={loading}
                    className="w-full bg-udemy-purple hover:bg-udemy-purple-dark text-white font-bold py-3 rounded mb-3 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Inscribiendo...' : 'Inscribirse ahora'}
                  </button>
                  <button 
                    onClick={handleEnroll}
                    disabled={loading}
                    className="w-full border-2 border-gray-900 hover:bg-gray-100 text-gray-900 font-bold py-3 rounded mb-4 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Inscribiendo...' : 'Comprar ahora'}
                  </button>
                </>
              )}

              <p className="text-center text-xs text-gray-600 mb-4">
                {isEnrolled ? 'Ya estás inscrito en este curso' : 'Garantía de devolución de dinero de 30 días'}
              </p>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-3">Este curso incluye:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>12 horas de vídeo bajo demanda</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>15 artículos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>23 recursos descargables</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Certificado de finalización</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
