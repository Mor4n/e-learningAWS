import { Star, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const {
    id,
    title,
    instructor,
    image,
    rating = 4.5,
    ratingCount = 1250,
    price,
    originalPrice,
    bestseller = false,
    category,
    duration,
    students = 12450,
  } = course;

  return (
    <Link to={`/course/${id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        {/* Imagen del curso */}
        <div className="relative overflow-hidden aspect-video bg-gray-200">
          <img
            src={image || '/placeholder-course.jpg'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {bestseller && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
              Bestseller
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-udemy-purple transition">
            {title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-2">{instructor}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-sm text-yellow-600">{rating}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({ratingCount.toLocaleString()})</span>
          </div>

          {/* Información adicional */}
          <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{students.toLocaleString()}</span>
            </div>
          </div>

          {/* Precio */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">${price}</span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">${originalPrice}</span>
            )}
          </div>

          {category && (
            <div className="mt-2">
              <span className="inline-block bg-purple-100 text-udemy-purple text-xs px-2 py-1 rounded">
                {category}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
