import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CategorySlider } from './CategorySlider';
import { ProductCard } from './ProductCard';
import { HERO_IMAGE_URL } from '../../data/initialData';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import { Search, ArrowRight } from 'lucide-react';

export const StoreView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useStore();

  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategory === 'todos' || product.categoryId === selectedCategory;

    const matchesSearch =
      !searchQuery.trim() ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.availableFlavors.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#FFFFFF] min-h-screen pb-20 max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto w-full px-3.5 sm:px-6 pt-2">
      {/* Greeting & Artisanal Bakery Graphic (Identical to reference Screen 2) */}
      <div className="flex items-center justify-between gap-2 py-3">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight leading-[1.15]">
            What would you<br />
            like to eat?
          </h2>
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className="text-xs font-semibold text-[#FF7243] hover:text-[#E85D30] transition-colors flex items-center gap-1"
          >
            <span>View Menu →</span>
          </button>
        </div>

        {/* Artisanal Bakery Photo Thumbnail on Right */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-[#F4EBE2]">
          <img
            src={getImageUrl(HERO_IMAGE_URL)}
            alt="Artisanal Bakery"
            onError={e => handleImageError(e, 'banner-principal.jpg')}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Search Bar with Orange Circular Search Button on Right (Identical to Reference Screen 2) */}
      <div className="py-2">
        <div className="relative flex items-center bg-[#F4F4F5] rounded-full p-1.5 pl-4 border border-[#E4E4E7] shadow-inner">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search here ..."
            className="w-full bg-transparent text-xs sm:text-sm text-[#18181B] placeholder-[#A1A1AA] focus:outline-none"
          />
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[#FF7243] hover:bg-[#E85D30] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-95"
            aria-label="Buscar"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* "Discover by category" Horizontal Slider */}
      <CategorySlider />

      {/* "Popular Cakes" Section Header (Identical to reference Screen 2 & 6) */}
      <div className="pt-4 pb-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-extrabold text-base sm:text-lg text-[#18181B] tracking-tight">
            Popular Cakes
          </h3>
          <button
            type="button"
            onClick={() => setSelectedCategory('todos')}
            className="text-xs font-medium text-[#71717A] hover:text-[#FF7243] transition-colors"
          >
            See All →
          </button>
        </div>

        {/* 2-Column Grid of Pastel Cakes (Identical to Reference Screen 2 & 6) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#FAFAFA] rounded-3xl p-8 text-center border border-[#F4F4F5] space-y-2">
            <p className="font-bold text-sm text-[#18181B]">Nenhum bolo encontrado.</p>
            <button
              onClick={() => setSelectedCategory('todos')}
              className="text-xs font-semibold text-[#FF7243]"
            >
              Ver todos os bolos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                tintIndex={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
