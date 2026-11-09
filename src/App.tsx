import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { DemoSwitcher } from './components/common/DemoSwitcher';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { StoreView } from './components/store/StoreView';
import { WelcomeScreen } from './components/store/WelcomeScreen';
import { ProductDetailModal } from './components/store/ProductDetailModal';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { OrderTrackingModal } from './components/store/OrderTrackingModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ConfectionerView } from './components/confectioner/ConfectionerView';
import { DriverView } from './components/driver/DriverView';
import { MiniTutorialModal } from './components/common/MiniTutorialModal';
import { ChevronUp } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeView,
    hasSeenWelcome,
    setHasSeenWelcome,
    selectedProduct,
    setSelectedProduct,
    mobileFrameMode
  } = useStore();

  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#18181B] selection:bg-[#FF7243] selection:text-white">
      {/* Top Demo Switcher (Instant view changing: Loja, Confeiteiro, Entregador, Admin, Tutorial) */}
      <DemoSwitcher />

      {/* Main View Router */}
      <div className="flex-1 flex flex-col">
        {activeView === 'store' && !hasSeenWelcome ? (
          <WelcomeScreen onStart={() => setHasSeenWelcome(true)} />
        ) : activeView === 'store' ? (
          mobileFrameMode ? (
            /* Smartphone simulator mode - responsivo e confortável como no celular real */
            <div className="py-2 sm:py-6 px-1 sm:px-4 flex justify-center items-center min-h-[calc(100vh-50px)] bg-[#F0F0F2]">
              <div className="relative w-full max-w-[425px] sm:max-w-[430px] h-[calc(100vh-70px)] max-h-[890px] min-h-[640px] bg-white rounded-[38px] sm:rounded-[46px] shadow-2xl border-[4px] sm:border-[7px] border-[#18181B] overflow-hidden flex flex-col">
                {/* Smartphone Status Bar (Clean Notch + Time + Indicators sem sobrepor o conteúdo) */}
                <div className="bg-white px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#18181B] select-none shrink-0 z-40 border-b border-[#F4F4F5]">
                  <span>9:41</span>
                  <div className="w-20 h-4 bg-[#18181B] rounded-full flex items-center justify-end px-2 shadow-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3F3F46]" />
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span>5G</span>
                    <div className="w-4 h-2 rounded-[2px] border border-[#18181B] p-[1px] flex items-center">
                      <div className="w-full h-full bg-[#18181B] rounded-[1px]" />
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
                  <Header />
                  <StoreView />
                </div>
                <BottomNav />

                {/* Smartphone Home Bar Indicator */}
                <div className="bg-white py-1.5 flex justify-center items-center shrink-0 z-40 border-t border-[#F4F4F5]">
                  <div className="w-32 h-1 bg-[#18181B]/80 rounded-full" />
                </div>
              </div>
            </div>
          ) : (
            /* Full-width responsive mode (mobile & desktop) */
            <div className="flex-1 flex flex-col">
              <Header />
              <StoreView />
              <BottomNav />
            </div>
          )
        ) : activeView === 'confectioner' ? (
          <ConfectionerView />
        ) : activeView === 'driver' ? (
          <DriverView />
        ) : (
          <AdminDashboard />
        )}
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 bg-[#18181B]/90 hover:bg-[#18181B] active:scale-90 text-white p-3 rounded-full shadow-2xl border border-white/20 transition-all animate-in fade-in zoom-in-90 duration-200"
          title="Subir para o topo"
          aria-label="Subir ao topo"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}

      {/* Global Modals & Drawers */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <MiniTutorialModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
