import React from 'react';
import { useStore } from '../../context/StoreContext';
import { HERO_IMAGE_URL } from '../../data/initialData';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import { ArrowRight } from 'lucide-react';

export const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { setHasSeenWelcome, setSelectedCategory } = useStore();

  const handleFinish = () => {
    setHasSeenWelcome(true);
    onStart();
  };

  return (
    <div className="relative min-h-screen bg-white flex flex-col justify-between p-6 overflow-hidden max-w-md mx-auto w-full">
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-end pt-2">
        <button
          onClick={handleFinish}
          className="text-xs font-medium text-[#71717A] hover:text-[#FF7243] bg-[#F4F4F5] hover:bg-[#F0EBE7] px-3.5 py-1.5 rounded-full transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Center Pastry Visual (Identical to reference: arranged dessert pieces) */}
      <div className="relative flex-1 flex items-center justify-center py-4">
        <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
          {/* Circular soft shadow */}
          <div className="absolute inset-4 bg-[#FFEDD5]/40 rounded-full blur-2xl -z-10" />

          {/* Pastry Collection Photo */}
          <img
            src={getImageUrl(HERO_IMAGE_URL)}
            alt="Delicious Bakery Pastries"
            onError={e => handleImageError(e, 'banner-principal.jpg')}
            className="w-full h-full object-cover rounded-3xl shadow-xl border border-[#F4EBE2]"
          />
        </div>
      </div>

      {/* Bottom Typography & Actions (Faithful to Reference Screen 1) */}
      <div className="space-y-6 pb-4">
        {/* Headline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] tracking-tight leading-[1.15]">
            Quick, Fresh &<br />
            <span className="text-[#FF7243]">Delicious Bakery</span>
          </h1>
          <p className="text-sm text-[#71717A] font-medium leading-relaxed">
            Made by hand, from scratch, with love.
          </p>
        </div>

        {/* Stepper Dashes Indicator (Matches reference 3 orange dashes) */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-1.5 rounded-full bg-[#FF7243]" />
          <div className="w-4 h-1.5 rounded-full bg-[#FFD7C9]" />
          <div className="w-4 h-1.5 rounded-full bg-[#FFD7C9]" />
        </div>

        {/* "Go" Circular Button on Bottom Left (Matches reference layout) */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleFinish}
            className="w-14 h-14 rounded-2xl bg-[#FF7243] hover:bg-[#E85D30] text-white font-bold text-base shadow-lg shadow-[#FF7243]/30 flex items-center justify-center transition-transform active:scale-90"
            aria-label="Iniciar navegação"
          >
            Go
          </button>

          <button
            onClick={handleFinish}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-[#18181B] hover:bg-[#27272A] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Ver Cardápio Maitê Bolos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mini categories preview strip at bottom of welcome (matches reference bottom icons) */}
        <div className="pt-2 border-t border-[#F4F4F5] flex items-center justify-between px-2 text-[11px] text-[#71717A]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#FF7243]" />
            <span className="font-semibold text-[#18181B]">Americana - SP</span>
          </div>
          <span>Bolos · Tortas · Doces · Kits</span>
        </div>
      </div>
    </div>
  );
};
