import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Store,
  LayoutDashboard,
  ChefHat,
  Bike,
  RotateCcw,
  HelpCircle
} from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const {
    activeView,
    setActiveView,
    orders,
    cartItemsCount,
    resetDemoData,
    setIsTutorialOpen
  } = useStore();

  const newOrdersCount = orders.filter(o => o.status === 'recebido').length;
  const deliveriesInRouteCount = orders.filter(o => o.status === 'saiu_para_entrega').length;

  return (
    <header className="sticky top-0 z-50 bg-[#18181B] text-[#F4F4F5] border-b border-[#27272A] text-xs shadow-md select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x overscroll-x-contain sm:justify-between">
        {/* Left: Brand badge */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF7243] animate-pulse" />
          <span className="font-extrabold tracking-wide text-white uppercase text-[10px] sm:text-[11px] whitespace-nowrap">
            Maitê Bolos
          </span>
        </div>

        {/* Center: 4 Navigation Views Switcher (Store, Kitchen/Confectioner, Driver, Admin) */}
        <div className="flex items-center bg-[#27272A] p-1 rounded-xl border border-[#3F3F46] shrink-0 gap-0.5">
          <button
            onClick={() => {
              setActiveView('store');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap active:scale-95 ${
              activeView === 'store'
                ? 'bg-[#FF7243] text-white shadow-sm'
                : 'text-[#D4D4D8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span>Loja</span>
            {cartItemsCount > 0 && (
              <span className="bg-white text-[#FF7243] font-extrabold text-[9px] px-1.5 rounded-full">
                {cartItemsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveView('confectioner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap active:scale-95 ${
              activeView === 'confectioner'
                ? 'bg-[#FF7243] text-white shadow-sm'
                : 'text-[#D4D4D8] hover:text-white hover:bg-white/5'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5 shrink-0" />
            <span>Cozinha</span>
            {newOrdersCount > 0 && (
              <span className="bg-amber-400 text-amber-950 font-extrabold text-[9px] px-1.5 rounded-full animate-pulse">
                {newOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveView('driver');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap active:scale-95 ${
              activeView === 'driver'
                ? 'bg-[#FF7243] text-white shadow-sm'
                : 'text-[#D4D4D8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Bike className="w-3.5 h-3.5 shrink-0" />
            <span>Entregador</span>
            {deliveriesInRouteCount > 0 && (
              <span className="bg-emerald-400 text-emerald-950 font-extrabold text-[9px] px-1.5 rounded-full">
                {deliveriesInRouteCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveView('admin');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg font-bold text-xs transition-all whitespace-nowrap active:scale-95 ${
              activeView === 'admin'
                ? 'bg-[#FF7243] text-white shadow-sm'
                : 'text-[#D4D4D8] hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
            <span>Admin</span>
          </button>
        </div>

        {/* Right: Tutorial button, Frame mode, Reset */}
        <div className="flex items-center gap-1.5 shrink-0 pr-1">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-xl bg-[#FF7243]/20 hover:bg-[#FF7243]/30 text-[#FF7243] font-bold text-xs border border-[#FF7243]/40 transition-all whitespace-nowrap active:scale-95"
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Tutorial</span>
          </button>


          <button
            onClick={() => {
              if (window.confirm('Restaurar dados da demonstração para o estado inicial?')) {
                resetDemoData();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title="Restaurar dados iniciais"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#27272A] hover:bg-rose-950 text-[#D4D4D8] hover:text-rose-200 border border-[#3F3F46] text-xs transition-all active:scale-95 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Restaurar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
