import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Plus } from 'lucide-react';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';

interface ProductCardProps {
  product: Product;
  tintIndex?: number;
}

// Exactly matches the 4 pastel tinted card backgrounds in reference screens 2 & 6:
// 1. Soft lavender/purple
// 2. Soft pastel pink/rose
// 3. Soft pastel golden/peach
// 4. Soft pastel sky blue
const CARD_PASTELS = [
  'bg-[#EDE9FE]', // Lavender
  'bg-[#FEE2E2]', // Soft Pink
  'bg-[#FEF3C7]', // Soft Golden Yellow
  'bg-[#E0F2FE]'  // Soft Sky Blue
];

export const ProductCard: React.FC<ProductCardProps> = ({ product, tintIndex = 0 }) => {
  const { setSelectedProduct } = useStore();

  const pastelBg = CARD_PASTELS[tintIndex % CARD_PASTELS.length];
  const displayPrice = product.promotionalPrice || product.basePrice;

  const flavorDisplay = product.availableFlavors[0]
    ? product.availableFlavors[0].split(' ')[0]
    : 'Artisanal';

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="bg-white rounded-3xl p-3 shadow-xs hover:shadow-md border border-[#F4F4F5] transition-all duration-200 cursor-pointer flex flex-col justify-between group active:scale-[0.98]"
    >
      <div>
        {/* Soft Pastel Image Box (Identical to reference) */}
        <div className={`relative ${pastelBg} rounded-2xl overflow-hidden aspect-square flex items-center justify-center p-2.5 mb-2.5`}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            loading="lazy"
            onError={e => handleImageError(e, 'bolo-morango.jpg')}
            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
          />
        </div>

        {/* Product Name & Flavor (Identical to reference layout) */}
        <div className="space-y-0.5 px-0.5">
          <h4 className="font-bold text-xs sm:text-sm text-[#18181B] line-clamp-1 leading-snug">
            {product.name}
          </h4>

          <p className="text-[11px] text-[#A1A1AA] font-normal truncate">
            Flavor : {flavorDisplay}
          </p>
        </div>
      </div>

      {/* Price & Action Button (Identical to reference: Orange price & Orange '+' square) */}
      <div className="mt-2.5 pt-1.5 flex items-center justify-between gap-1 px-0.5">
        <span className="font-bold text-xs sm:text-sm text-[#FF7243] tabular-nums">
          R$ {displayPrice.toFixed(2).replace('.', ',')}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FF7243] hover:bg-[#E85D30] text-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
          aria-label={`Personalizar ${product.name}`}
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
