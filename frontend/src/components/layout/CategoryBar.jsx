import { useState } from 'react';

const CategoryBar = () => {
  const categories = [
    'Desarrollo',
    'Negocios',
    'Finanzas y contabilidad',
    'Tecnología de la información',
    'Diseño',
    'Marketing',
    'Desarrollo personal',
    'Estilo de vida',
    'Fotografía y vídeo',
    'Salud y fitness',
    'Música',
  ];

  const [activeCategory, setActiveCategory] = useState('Desarrollo');

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 py-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap text-sm font-medium transition ${
                activeCategory === category
                  ? 'text-udemy-purple border-b-2 border-udemy-purple pb-2'
                  : 'text-gray-700 hover:text-udemy-purple pb-2'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
