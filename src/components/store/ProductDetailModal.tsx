import React, { useState } from 'react';
import { Product, ProductSize } from '../../types';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeft,
  Heart,
  Star,
  Flame,
  Clock,
  Scale,
  Minus,
  Plus,
  Check,
  ShoppingBag
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useStore();

  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes[0] || {
      id: 'default',
      name: 'Padrão',
      code: 'S',
      servings: '12 fatias',
      weight: '1.5 kg',
      priceDelta: 0
    }
  );

  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product.availableFlavors[0] || 'Strawberry'
  );

  const [selectedFilling, setSelectedFilling] = useState<string>(
    product.availableFillings[0] || 'Creme Artesanal'
  );

  const [selectedToppings, setSelectedToppings] = useState<{ name: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [isFavorited, setIsFavorited] = useState<boolean>(false);

  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState<string>(product.image);

  // Price calculations
  const basePrice = product.promotionalPrice || product.basePrice;
  const toppingsPrice = selectedToppings.reduce((acc, t) => acc + t.price, 0);
  const unitPrice = basePrice + selectedSize.priceDelta + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const handleToggleTopping = (topping: { name: string; price: number }) => {
    setSelectedToppings(prev => {
      const exists = prev.some(t => t.name === topping.name);
      if (exists) {
        return prev.filter(t => t.name !== topping.name);
      }
      return [...prev, topping];
    });
  };

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      product,
      quantity,
      selectedSize,
      selectedFlavor,
      selectedFilling,
      selectedToppings,
      customerNotes: customerNotes.trim() || undefined,
      unitPrice
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-md max-h-[92vh] sm:rounded-3xl rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 border border-[#EAE0D5]">
        {/* Mobile Drag Indicator Handle */}
        <div className="w-12 h-1.5 rounded-full bg-[#E4E4E7] mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Top Header Bar: Back arrow on left, favorite heart on right (Identical to reference) */}
        <div className="sticky top-0 z-20 bg-white/95 px-5 py-3 border-b border-[#F4F4F5] flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#F4F4F5] hover:bg-[#EAEAEA] active:scale-95 text-[#18181B] flex items-center justify-center transition-all"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <span className="text-xs font-bold text-[#18181B] truncate max-w-[180px]">
            {product.name}
          </span>

          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className={`w-10 h-10 rounded-full bg-[#F4F4F5] hover:bg-[#EAEAEA] active:scale-95 flex items-center justify-center transition-all ${
              isFavorited ? 'text-rose-500' : 'text-[#71717A]'
            }`}
            aria-label="Favoritar"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain touch-pan-y px-5 py-4 space-y-4">
          {/* Main Visual with Size Selector Pills on Right (Identical to reference Screen 4) */}
          <div className="relative flex items-center justify-center pt-1">
            <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-lg transition-all duration-300"
              />
            </div>

            {/* Size Selector in vertical circular stack on right: S, M, L */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2.5">
              {(['S', 'M', 'L'] as const).map((code, idx) => {
                const sizeOption = product.sizes[idx] || {
                  id: code.toLowerCase(),
                  name: `Tamanho ${code}`,
                  code,
                  servings: code === 'S' ? '10 fatias' : code === 'M' ? '20 fatias' : '30 fatias',
                  weight: code === 'S' ? '1.5 kg' : code === 'M' ? '2.5 kg' : '3.5 kg',
                  priceDelta: idx * 45
                };
                const isSelected = selectedSize.code === code;

                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedSize(sizeOption)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isSelected
                        ? 'bg-[#18181B] text-white scale-105'
                        : 'bg-white text-[#71717A] border border-[#E4E4E7] hover:bg-[#F4F4F5]'
                    }`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multiple Photos Thumbnails Selector */}
          {allImages.length > 1 && (
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImage === img
                      ? 'border-[#FF7243] scale-105 shadow-md shadow-[#FF7243]/20 ring-2 ring-[#FF7243]/30'
                      : 'border-[#E4E4E7] opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Stepper Underneath Photo (Orange pill stepper with white - 1 + in reference) */}
          <div className="flex justify-center -mt-2">
            <div className="inline-flex items-center gap-5 bg-[#FF7243] text-white px-5 py-2 rounded-full shadow-md shadow-[#FF7243]/20">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-white hover:opacity-80 active:scale-90 transition-transform font-bold text-base"
              >
                <Minus className="w-4 h-4 stroke-[3]" />
              </button>
              <span className="font-bold text-base min-w-[20px] text-center tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-white hover:opacity-80 active:scale-90 transition-transform font-bold text-base"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Product Title & Rating (Identical to reference) */}
          <div className="text-center space-y-1 pt-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
              {product.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#71717A]">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < 4 ? 'fill-amber-400' : 'text-[#D4D4D8]'
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold text-[#18181B]">(47 Review)</span>
            </div>
          </div>

          {/* 3 Metric Specs Badges with Icons (Flame, Clock, Scale) */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#FAFAFA] border border-[#F4F4F5]">
              <Flame className="w-5 h-5 text-[#FF7243] mb-1 fill-[#FF7243]" />
              <span className="text-xs font-bold text-[#18181B]">
                {product.calories || '180 Cal'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#FAFAFA] border border-[#F4F4F5]">
              <Clock className="w-5 h-5 text-[#FF7243] mb-1" />
              <span className="text-xs font-bold text-[#18181B]">
                {product.prepTime || '40 - 50 Min'}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-[#FAFAFA] border border-[#F4F4F5]">
              <Scale className="w-5 h-5 text-[#FF7243] mb-1" />
              <span className="text-xs font-bold text-[#18181B]">
                {selectedSize.weight || '3 kg'}
              </span>
            </div>
          </div>

          {/* Orange Description Card with Black "Add to Cart" Pill (Identical to reference Screen 4) */}
          <div className="bg-[#FF7243] rounded-3xl p-5 text-white space-y-4 shadow-lg shadow-[#FF7243]/20">
            <div className="space-y-1.5">
              <p className="text-xs text-white/95 leading-relaxed">
                <strong className="text-white">Description :</strong> {product.description}
              </p>
              <p className="text-xs font-semibold text-white/90">
                Flavor : {selectedFlavor}
              </p>
            </div>

            {/* Flavor selector pills inside the card */}
            {product.availableFlavors.length > 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.availableFlavors.map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setSelectedFlavor(f)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                      selectedFlavor === f
                        ? 'bg-white text-[#FF7243] shadow-xs'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Add to Cart Black Pill and Total Price Row (Identical to reference) */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/20">
              <button
                type="button"
                onClick={handleAddToCart}
                className="py-3.5 px-6 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <span>Add to Cart</span>
              </button>

              <span className="font-extrabold text-xl sm:text-2xl text-white tabular-nums">
                R$ {totalPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
