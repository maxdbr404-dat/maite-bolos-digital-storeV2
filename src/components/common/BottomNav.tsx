import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  ChefHat,
  ClipboardList
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    cartItemsCount,
    setIsCartOpen,
    orders,
    setTrackingOrder,
    setActiveView,
    activeView,
    setSelectedCategory
  } = useStore();

  const newOrdersCount = orders.filter(o => o.status === 'recebido').length;
  const latestOrder = orders[0];

  return (
    <nav className="fixed bottom-0 sm:hidden left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F4F4F5] shadow-lg pb-safe">
      <div className="grid grid-cols-5 items-center h-15 px-1">
        {/* Início */}
        <button
          onClick={() => {
            setActiveView('store');
            setSelectedCategory('todos');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center justify-center py-1 text-[#71717A] hover:text-[#FF7243] active:scale-95 transition-all"
        >
          <Home className={`w-5 h-5 ${activeView === 'store' ? 'text-[#FF7243]' : ''}`} />
          <span className={`text-[10px] font-medium mt-0.5 ${activeView === 'store' ? 'text-[#FF7243] font-bold' : ''}`}>
            Início
          </span>
        </button>

        {/* Cardápio */}
        <button
          onClick={() => {
            setActiveView('store');
            setSelectedCategory('todos');
          }}
          className="flex flex-col items-center justify-center py-1 text-[#71717A] hover:text-[#FF7243] active:scale-95 transition-all"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">Cardápio</span>
        </button>

        {/* Sacola / Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-[#71717A] hover:text-[#FF7243] active:scale-95 transition-all relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-[#FF7243]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#18181B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-[#FF7243] mt-0.5">Sacola</span>
        </button>

        {/* Confeiteiro */}
        <button
          onClick={() => setActiveView('confectioner')}
          className="flex flex-col items-center justify-center py-1 text-[#71717A] hover:text-[#FF7243] active:scale-95 transition-all relative"
        >
          <div className="relative">
            <ChefHat className={`w-5 h-5 ${activeView === 'confectioner' ? 'text-[#FF7243]' : ''}`} />
            {newOrdersCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-amber-400 text-amber-950 text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse">
                {newOrdersCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-medium mt-0.5 ${activeView === 'confectioner' ? 'text-[#FF7243] font-bold' : ''}`}>
            Cozinha
          </span>
        </button>

        {/* Rastrear / Pedidos */}
        <button
          onClick={() => {
            if (latestOrder) {
              setTrackingOrder(latestOrder);
            } else {
              setActiveView('admin');
            }
          }}
          className="flex flex-col items-center justify-center py-1 text-[#71717A] hover:text-[#FF7243] active:scale-95 transition-all"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5">
            Rastrear
          </span>
        </button>
      </div>
    </nav>
  );
};
