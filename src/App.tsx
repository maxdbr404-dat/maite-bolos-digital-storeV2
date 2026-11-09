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
    setSelectedProduct
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
          /* Full-width responsive mode (mobile & desktop) */
          <div className="flex-1 flex flex-col">
            <Header />
            <StoreView />
            <BottomNav />
          </div>
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
