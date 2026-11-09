import React from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_LOGO_URL } from '../../data/initialData';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

export const CategorySlider: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  return (
    <div className="py-2">
      {/* Header: "Discover by category" and "See All →" (Identical to Reference Screen 2) */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-extrabold text-base sm:text-lg text-[#18181B] tracking-tight">
          Discover by category
        </h3>
        <button
          onClick={() => setSelectedCategory('todos')}
          className="text-xs font-medium text-[#71717A] hover:text-[#FF7243] transition-colors"
        >
          See All →
        </button>
      </div>

      {/* Horizontal Carousel (Identical to reference active orange pill vs soft gray circles) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-4 px-4 scroll-smooth">
        {/* "All" Category Pill */}
        <button
          type="button"
          onClick={() => setSelectedCategory('todos')}
          className="flex flex-col items-center shrink-0 group focus:outline-none transition-transform active:scale-95"
        >
          {selectedCategory === 'todos' ? (
            <div className="bg-[#FF7243] text-white rounded-3xl p-2 w-16 h-22 flex flex-col items-center justify-between shadow-md shadow-[#FF7243]/20">
              <div className="w-12 h-12 rounded-full bg-white p-1 overflow-hidden shadow-xs flex items-center justify-center">
                <img
                  src={getImageUrl(STORE_LOGO_URL)}
                  alt="Todos"
                  onError={e => handleImageError(e, 'logo.png')}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[11px] font-bold tracking-tight">Todos</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 w-16">
              <div className="w-14 h-14 rounded-full bg-[#F4F4F5] hover:bg-[#EAEAEA] p-1.5 overflow-hidden border border-[#E4E4E7] transition-all flex items-center justify-center">
                <img
                  src={getImageUrl(STORE_LOGO_URL)}
                  alt="Todos"
                  onError={e => handleImageError(e, 'logo.png')}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-[11px] font-medium text-[#71717A] truncate">Todos</span>
            </div>
          )}
        </button>

        {/* Categories from initial data */}
        {categories.map(category => {
          const isSelected = selectedCategory === category.id;

          return (
            <button
              type="button"
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="flex flex-col items-center shrink-0 group focus:outline-none transition-transform active:scale-95"
            >
              {isSelected ? (
                /* Active: Orange tall rounded pill container with white circle */
                <div className="bg-[#FF7243] text-white rounded-3xl p-2 w-16 h-22 flex flex-col items-center justify-between shadow-md shadow-[#FF7243]/20">
                  <div className="w-12 h-12 rounded-full bg-white p-0.5 overflow-hidden shadow-xs flex items-center justify-center">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      onError={e => handleImageError(e, 'bolo-morango.jpg')}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight truncate max-w-[56px]">
                    {category.name.split(' ')[0]}
                  </span>
                </div>
              ) : (
                /* Inactive: Clean soft circular container with label below */
                <div className="flex flex-col items-center gap-1.5 w-16">
                  <div className="w-14 h-14 rounded-full bg-[#F4F4F5] hover:bg-[#EAEAEA] p-1 overflow-hidden border border-[#E4E4E7] transition-all flex items-center justify-center">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      onError={e => handleImageError(e, 'bolo-morango.jpg')}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-medium text-[#71717A] truncate max-w-[62px]">
                    {category.name.split(' ')[0]}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
