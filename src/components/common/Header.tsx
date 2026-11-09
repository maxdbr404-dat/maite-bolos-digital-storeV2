import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Menu,
  MapPin,
  ShoppingBag
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    settings,
    cartItemsCount,
    setIsCartOpen,
    setActiveView
  } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-[#F4F4F5] max-w-md sm:max-w-2xl lg:max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between">
        {/* Left: Clean Menu Icon (Identical to reference: 3 horizontal bars) */}
        <button
          type="button"
          onClick={() => setActiveView('admin')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
          aria-label="Menu"
          title="Abrir Menu / Painel de Gestão"
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center: Location (Identical to reference: 📍 California, USA -> 📍 Americana, SP) */}
        <div className="flex items-center gap-1.5 text-xs text-[#18181B] font-semibold">
          <MapPin className="w-3.5 h-3.5 text-[#18181B] fill-[#18181B]" />
          <span>Americana, SP</span>
        </div>

        {/* Right: Cart Icon with Black Circle Badge (Identical to reference Screen 2) */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-[#FF7243] hover:bg-[#FFF3EC] transition-colors"
          aria-label="Abrir Sacola"
        >
          <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
          {cartItemsCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#18181B] text-white text-[9px] font-bold flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
