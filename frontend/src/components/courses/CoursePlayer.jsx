import { Play, CheckCircle, Lock } from 'lucide-react';
import { useState } from 'react';

const CoursePlayer = ({ course }) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());

  const { title, curriculum = [] } = course;

  const allLessons = curriculum.flatMap((section) =>
    section.lessons.map((lesson) => ({
      ...lesson,
      sectionTitle: section.title,
    }))
  );

  const handleLessonComplete = (lessonId) => {
    setCompletedLessons((prev) => new Set([...prev, lessonId]));
  };

  const progress = (completedLessons.size / allLessons.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-900">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        <div className="bg-black aspect-video lg:aspect-auto lg:flex-1 flex items-center justify-center">
          <div className="text-center text-white">
            <Play className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              {allLessons[currentLesson]?.title}
            </h2>
            <p className="text-gray-400">
              {allLessons[currentLesson]?.duration}
            </p>
          </div>
        </div>

        {/* Controles y descripción */}
        <div className="bg-gray-800 text-white p-6">
          <div className="max-w-4xl">
            <h1 className="text-xl font-bold mb-2">
              {allLessons[currentLesson]?.title}
            </h1>
            <p className="text-gray-400 mb-4">
              {allLessons[currentLesson]?.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso del curso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-udemy-purple h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() => {
                  handleLessonComplete(allLessons[currentLesson]?.id);
                  setCurrentLesson(
                    Math.min(allLessons.length - 1, currentLesson + 1)
                  );
                }}
                className="px-6 py-2 bg-udemy-purple hover:bg-udemy-purple-dark rounded"
              >
                {currentLesson === allLessons.length - 1
                  ? 'Finalizar'
                  : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Lista de lecciones */}
      <div className="lg:w-96 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-lg">Contenido del curso</h2>
          <p className="text-sm text-gray-600">
            {completedLessons.size} de {allLessons.length} lecciones completadas
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {curriculum.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="p-4 bg-gray-50">
                <h3 className="font-semibold">{section.title}</h3>
                <p className="text-sm text-gray-600">
                  {section.lectures} clases • {section.duration}
                </p>
              </div>
              <div>
                {section.lessons.map((lesson, lessonIndex) => {
                  const globalIndex = curriculum
                    .slice(0, sectionIndex)
                    .reduce((acc, s) => acc + s.lessons.length, 0) + lessonIndex;
                  const isCompleted = completedLessons.has(lesson.id);
                  const isCurrent = globalIndex === currentLesson;
                  const isLocked = lesson.locked;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => !isLocked && setCurrentLesson(globalIndex)}
                      disabled={isLocked}
                      className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition text-left ${
                        isCurrent ? 'bg-purple-50 border-l-4 border-udemy-purple' : ''
                      } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="shrink-0 mt-1">
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Play className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium mb-1 ${isCurrent ? 'text-udemy-purple' : ''}`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {lesson.duration}
                          {lesson.type && ` • ${lesson.type}`}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
