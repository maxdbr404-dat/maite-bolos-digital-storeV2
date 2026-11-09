import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Product,
  Category,
  Order,
  OrderStatus,
  PaymentMethod,
  CartItem,
  Coupon
} from '../../types';
import { STORE_LOGO_URL } from '../../data/initialData';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  UtensilsCrossed,
  Calculator,
  Bike,
  BarChart3,
  Settings,
  Tag,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  AlertCircle,
  Truck,
  DollarSign,
  CreditCard,
  QrCode,
  Banknote,
  X,
  Filter,
  Eye,
  Store,
  Phone,
  Calendar,
  Save,
  RotateCcw,
  MessageCircle,
  ChevronRight,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'categories'
  | 'pos'
  | 'deliveries'
  | 'financial'
  | 'coupons'
  | 'settings';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    categories,
    orders,
    drivers,
    coupons,
    settings,
    updateOrderStatus,
    assignDriverToOrder,
    registerPosSale,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    addCategory,
    updateCategory,
    deleteCategory,
    updateSettings,
    addCoupon,
    toggleCouponActive,
    updateDriverStatus,
    setActiveView
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [periodFilter, setPeriodFilter] = useState<'hoje' | '7dias' | '30dias' | 'mes'>('hoje');

  // Order Details Modal
  const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);

  // Order List Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('todos');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('todos');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Product List Filter & Modal
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCatFilter, setProductCatFilter] = useState<string>('todos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [productPhotos, setProductPhotos] = useState<string[]>([]);

  const handleProductPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProductPhotos(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setProductPhotos(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryPhoto = (indexToPrimary: number) => {
    setProductPhotos(prev => {
      const target = prev[indexToPrimary];
      const others = prev.filter((_, idx) => idx !== indexToPrimary);
      return [target, ...others];
    });
  };

  // Category Modal
  const [newCatName, setNewCatName] = useState('');

  // POS State
  const [posTab, setPosTab] = useState<'products' | 'cart'>('products');
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [posSearch, setPosSearch] = useState('');
  const [posPaymentMethod, setPosPaymentMethod] = useState<PaymentMethod>('dinheiro');
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posSuccessNotice, setPosSuccessNotice] = useState<string | null>(null);

  // Coupon Form Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponMin, setNewCouponMin] = useState(60);

  // Delivery view modal for assigning
  const [assigningOrder, setAssigningOrder] = useState<Order | null>(null);

  // Settings form local state
  const [settingsForm, setSettingsForm] = useState(settings);

  // --- Financial & Metric Calculations ---
  const todayOrders = orders.filter(o => o.createdAt.includes('Hoje') || o.scheduledDate === 'Hoje');
  const activeOrders = orders.filter(o => o.status !== 'entregue' && o.status !== 'cancelado');
  const inPrepOrders = orders.filter(o => o.status === 'em_preparo');
  const waitingDeliveryOrders = orders.filter(o => o.status === 'pronto' || o.status === 'saiu_para_entrega');

  const totalSalesToday = todayOrders.reduce((acc, o) => acc + o.total, 0);
  const totalMonthSales = orders.reduce((acc, o) => acc + o.total, 0);
  const averageTicket = orders.length > 0 ? totalMonthSales / orders.length : 0;

  // Payment Breakdown
  const pixSales = orders.filter(o => o.paymentMethod === 'pix').reduce((acc, o) => acc + o.total, 0);
  const cardSales = orders.filter(o => o.paymentMethod === 'cartao_entrega' || o.paymentMethod === 'cartao_retirada').reduce((acc, o) => acc + o.total, 0);
  const cashSales = orders.filter(o => o.paymentMethod === 'dinheiro').reduce((acc, o) => acc + o.total, 0);
  const posSalesTotal = orders.filter(o => o.isPosSale).reduce((acc, o) => acc + o.total, 0);
  const onlineSalesTotal = orders.filter(o => !o.isPosSale).reduce((acc, o) => acc + o.total, 0);
  const totalDeliveryFees = orders.reduce((acc, o) => acc + o.deliveryFee, 0);
  const totalDiscountsGiven = orders.reduce((acc, o) => acc + o.discount, 0);

  // Top Products Count
  const productSalesMap: Record<string, { product: Product; count: number; revenue: number }> = {};
  orders.forEach(ord => {
    ord.items.forEach(it => {
      if (!productSalesMap[it.productId]) {
        productSalesMap[it.productId] = { product: it.product, count: 0, revenue: 0 };
      }
      productSalesMap[it.productId].count += it.quantity;
      productSalesMap[it.productId].revenue += it.totalPrice;
    });
  });
  const topProductsList = Object.values(productSalesMap).sort((a, b) => b.count - a.count);

  // POS Add Item
  const handlePosAddItem = (prod: Product) => {
    const existing = posCart.find(i => i.productId === prod.id);
    if (existing) {
      setPosCart(prev =>
        prev.map(i =>
          i.productId === prod.id
            ? { ...i, quantity: i.quantity + 1, totalPrice: (i.quantity + 1) * i.unitPrice }
            : i
        )
      );
    } else {
      const price = prod.promotionalPrice || prod.basePrice;
      const newItem: CartItem = {
        cartItemId: `pos-item-${Date.now()}`,
        productId: prod.id,
        product: prod,
        quantity: 1,
        selectedSize: prod.sizes[0] || { id: 's', name: 'Padrão', code: 'M', servings: '12 fatias', weight: '1kg', priceDelta: 0 },
        selectedFlavor: prod.availableFlavors[0] || 'Tradicional',
        selectedToppings: [],
        unitPrice: price,
        totalPrice: price
      };
      setPosCart(prev => [...prev, newItem]);
    }
  };

  const posSubtotal = posCart.reduce((acc, i) => acc + i.totalPrice, 0);
  const posTotal = Math.max(0, posSubtotal - posDiscount);

  const handleFinishPosSale = () => {
    if (posCart.length === 0) return;
    const newOrd = registerPosSale(posCart, posPaymentMethod, posTotal, posDiscount);
    setPosSuccessNotice(`Venda de balcão ${newOrd.orderNumber} finalizada com sucesso!`);
    setPosCart([]);
    setPosDiscount(0);
    setPosTab('products');
    setTimeout(() => setPosSuccessNotice(null), 4000);
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = orderStatusFilter === 'todos' || o.status === orderStatusFilter;
    const matchesType = orderTypeFilter === 'todos' || o.deliveryType === orderTypeFilter;
    const matchesSearch =
      !orderSearch.trim() ||
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.includes(orderSearch);
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2D2118] flex flex-col pb-16">
      {/* Admin Top Navigation Bar */}
      <header className="bg-[#2D2118] text-[#F5ECE2] border-b border-[#4A382A] px-3 sm:px-6 py-2.5 sticky top-[42px] sm:top-[44px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img
              src={STORE_LOGO_URL}
              alt="Maitê Bolos"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#523D2E]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-sm sm:text-lg font-bold text-white tracking-tight">
                  Painel de Gestão
                </h1>
                <span className="bg-[#FF7243] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Americana - SP
                </span>
              </div>
              <p className="text-[11px] text-[#B8A394] hidden sm:block">
                Maitê Bolos e Doces Artesanais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="py-1.5 px-3 rounded-xl bg-[#3D2C20] hover:bg-[#4A382A] text-xs font-semibold text-[#F5ECE2] border border-[#523D2E] flex items-center gap-1.5 transition-colors active:scale-95"
            >
              <Store className="w-3.5 h-3.5 text-[#FF7243]" />
              <span className="hidden sm:inline">Ver Loja</span>
              <span className="sm:hidden">Loja</span>
            </button>
          </div>
        </div>

        {/* Tab Strip with smooth horizontal scroll and touch-friendly padding */}
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto scrollbar-none touch-pan-x overscroll-x-contain pt-2.5 -mb-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: `Pedidos (${orders.length})`, icon: ShoppingBag },
            { id: 'products', label: `Produtos (${products.length})`, icon: UtensilsCrossed },
            { id: 'pos', label: 'PDV Balcão', icon: Calculator },
            { id: 'deliveries', label: 'Entregadores', icon: Bike },
            { id: 'categories', label: 'Categorias', icon: Layers },
            { id: 'financial', label: 'Financeiro', icon: BarChart3 },
            { id: 'coupons', label: 'Cupons', icon: Tag },
            { id: 'settings', label: 'Configurações', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-1.5 py-2 px-3 sm:px-3.5 rounded-t-xl text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'bg-[#F7F4EF] text-[#2D2118] border-[#FF7243] shadow-xs'
                    : 'text-[#D5C4B5] hover:text-white border-transparent hover:bg-[#3D2C20]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF7243]' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 space-y-5">
        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD METRICS & CHARTS */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Filter Period Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-3 sm:p-4 rounded-2xl border border-[#EDE2D6] shadow-xs">
              <div className="flex items-center gap-2 text-xs text-[#5D473A]">
                <Clock className="w-4 h-4 text-[#FF7243]" />
                <span className="font-bold text-[#2D2118]">Filtrar Indicadores:</span>
              </div>
              <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#E5D7CA] overflow-x-auto no-scrollbar">
                {(['hoje', '7dias', '30dias', 'mes'] as const).map(period => (
                  <button
                    key={period}
                    onClick={() => setPeriodFilter(period)}
                    className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-colors whitespace-nowrap capitalize ${
                      periodFilter === period
                        ? 'bg-[#2D2118] text-white shadow-xs'
                        : 'text-[#7A6455] hover:text-[#2D2118]'
                    }`}
                  >
                    {period === 'hoje' ? 'Hoje' : period === '7dias' ? '7 dias' : period === '30dias' ? '30 dias' : 'Mês'}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Row (Responsive 2 cols on mobile, 4 on desktop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EDE2D6] shadow-xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#8C7667] uppercase block">
                  Vendas de Hoje
                </span>
                <span className="font-serif text-lg sm:text-2xl lg:text-3xl font-extrabold text-[#2D2118] tabular-nums block mt-1">
                  R$ {totalSalesToday.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1 truncate">
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                  {todayOrders.length} encomendas hoje
                </span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EDE2D6] shadow-xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#8C7667] uppercase block">
                  Faturamento Mês
                </span>
                <span className="font-serif text-lg sm:text-2xl lg:text-3xl font-extrabold text-[#FF7243] tabular-nums block mt-1">
                  R$ {totalMonthSales.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#7A6455] block mt-1 truncate">
                  {orders.length} pedidos totais
                </span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EDE2D6] shadow-xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#8C7667] uppercase block">
                  Em Produção
                </span>
                <span className="font-serif text-lg sm:text-2xl lg:text-3xl font-extrabold text-amber-600 tabular-nums block mt-1">
                  {inPrepOrders.length}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#7A6455] block mt-1 truncate">
                  {waitingDeliveryOrders.length} prontos para entrega
                </span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-[#EDE2D6] shadow-xs">
                <span className="text-[10px] sm:text-[11px] font-bold text-[#8C7667] uppercase block">
                  Ticket Médio
                </span>
                <span className="font-serif text-lg sm:text-2xl lg:text-3xl font-extrabold text-[#2D2118] tabular-nums block mt-1">
                  R$ {averageTicket.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#7A6455] block mt-1 truncate">
                  Por encomenda
                </span>
              </div>
            </div>

            {/* Demonstrative Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
              {/* Daily Sales Bar Chart */}
              <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE2D6] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                      Vendas por Dia da Semana (R$)
                    </h3>
                    <p className="text-[11px] text-[#7A6455]">
                      Picos em sexta, sábado e domingo (comemorações)
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-[#FF7243] bg-[#FFF3EC] px-2 py-0.5 rounded-full border border-[#FAD8C7]">
                    Americana
                  </span>
                </div>

                {/* Simulated Chart Bars */}
                <div className="pt-3 grid grid-cols-7 gap-1 sm:gap-3 items-end h-40 sm:h-48 border-b border-[#EAE0D5] pb-2">
                  {[
                    { day: 'Seg', val: 120, height: '18%' },
                    { day: 'Ter', val: 340, height: '35%' },
                    { day: 'Qua', val: 490, height: '48%' },
                    { day: 'Qui', val: 620, height: '58%' },
                    { day: 'Sex', val: 1150, height: '88%' },
                    { day: 'Sáb', val: 1420, height: '100%', highlight: true },
                    { day: 'Dom', val: 890, height: '72%' }
                  ].map(b => (
                    <div key={b.day} className="flex flex-col items-center gap-1 h-full justify-end group">
                      <span className="text-[9px] sm:text-[10px] font-bold text-[#7A6455] tabular-nums">
                        R${b.val}
                      </span>
                      <div
                        style={{ height: b.height }}
                        className={`w-full max-w-[34px] rounded-t-lg transition-all ${
                          b.highlight
                            ? 'bg-[#FF7243] shadow-sm'
                            : 'bg-[#EAE0D5] group-hover:bg-[#D5C4B5]'
                        }`}
                      />
                      <span className="text-[10px] sm:text-xs font-semibold text-[#5D473A]">{b.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Breakdown Donut/Pills */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE2D6] shadow-xs space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                    Pedidos por Status
                  </h3>
                  <p className="text-[11px] text-[#7A6455]">
                    Distribuição da esteira de produção
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {[
                    { label: 'Novos Recebidos', count: orders.filter(o => o.status === 'recebido').length, color: 'bg-blue-500' },
                    { label: 'Em Preparo / Forno', count: inPrepOrders.length, color: 'bg-amber-500' },
                    { label: 'Prontos / Embalados', count: orders.filter(o => o.status === 'pronto').length, color: 'bg-purple-500' },
                    { label: 'Saiu para Entrega', count: orders.filter(o => o.status === 'saiu_para_entrega').length, color: 'bg-[#FF7243]' },
                    { label: 'Entregues', count: orders.filter(o => o.status === 'entregue').length, color: 'bg-emerald-600' }
                  ].map(item => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-[#5D473A] flex items-center gap-1.5 text-[11px]">
                          <span className={`w-2 h-2 rounded-full ${item.color}`} />
                          {item.label}
                        </span>
                        <span className="font-bold text-[#2D2118] tabular-nums">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#FAF7F2] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${orders.length ? (item.count / orders.length) * 100 : 0}%` }}
                          className={`h-full ${item.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products Showcase Table & Mobile Cards */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE2D6] shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                Doces & Bolos Mais Vendidos
              </h3>

              {/* Mobile Card List (clean touch display) */}
              <div className="space-y-2 sm:hidden">
                {topProductsList.slice(0, 5).map(item => (
                  <div key={item.product.id} className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#EDE2D6] flex items-center justify-between gap-2">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-xs text-[#2D2118] block truncate">{item.product.name}</span>
                      <span className="text-[10px] text-[#7A6455]">{item.count} unidades vendidas</span>
                    </div>
                    <span className="font-extrabold text-xs text-[#FF7243] tabular-nums shrink-0">
                      R$ {item.revenue.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] text-[#7A6455] uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5 rounded-l-lg">Produto</th>
                      <th className="p-2.5">Categoria</th>
                      <th className="p-2.5 text-center">Unid. Vendidas</th>
                      <th className="p-2.5 text-right rounded-r-lg">Receita Gerada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E6DC]">
                    {topProductsList.slice(0, 5).map(item => (
                      <tr key={item.product.id} className="hover:bg-[#FFFDF9]">
                        <td className="p-2.5 flex items-center gap-2.5 font-medium text-[#2D2118]">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-9 h-9 rounded-lg object-cover"
                          />
                          <span className="truncate max-w-[220px] font-bold">{item.product.name}</span>
                        </td>
                        <td className="p-2.5 text-[#7A6455] capitalize">
                          {categories.find(c => c.id === item.product.categoryId)?.name || 'Geral'}
                        </td>
                        <td className="p-2.5 text-center font-bold text-[#2D2118] tabular-nums">
                          {item.count}
                        </td>
                        <td className="p-2.5 text-right font-bold text-[#FF7243] tabular-nums">
                          R$ {item.revenue.toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ORDERS MANAGEMENT (RESPONSIVE CARDS ON MOBILE) */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Filter toolbar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EDE2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 w-full sm:max-w-sm">
                <Search className="w-4 h-4 text-[#A89282] shrink-0" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={e => setOrderSearch(e.target.value)}
                  placeholder="Buscar cliente ou #pedido..."
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-1.5 text-xs text-[#2D2118] focus:outline-none focus:border-[#FF7243]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={orderStatusFilter}
                  onChange={e => setOrderStatusFilter(e.target.value)}
                  className="flex-1 sm:flex-initial bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2118]"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="recebido">Recebido</option>
                  <option value="em_preparo">Em Preparo</option>
                  <option value="pronto">Pronto</option>
                  <option value="saiu_para_entrega">Saiu p/ Entrega</option>
                  <option value="entregue">Entregue</option>
                </select>

                <select
                  value={orderTypeFilter}
                  onChange={e => setOrderTypeFilter(e.target.value)}
                  className="flex-1 sm:flex-initial bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2118]"
                >
                  <option value="todos">Todos Tipos</option>
                  <option value="delivery">Entrega</option>
                  <option value="retirada">Retirada</option>
                </select>
              </div>
            </div>

            {/* Mobile View: Responsive Order Cards (Clean & Touch-Friendly) */}
            <div className="space-y-3 md:hidden">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-xs text-[#8C7667]">
                  Nenhum pedido encontrado com esses filtros.
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl p-4 border border-[#EDE2D6] shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-sm text-[#2D2118] block">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] text-[#8C7667]">
                          {order.createdAt}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="font-extrabold text-sm text-[#FF7243] tabular-nums block">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          order.deliveryType === 'delivery' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                        }`}>
                          {order.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EDE2D6] text-xs text-[#5D473A] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#2D2118]">{order.customer.name}</span>
                        <a href={`tel:${order.customer.phone}`} className="text-[#FF7243] font-semibold text-[11px]">
                          {order.customer.phone}
                        </a>
                      </div>
                      <p className="text-[11px] text-[#7A6455] truncate">
                        {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                      </p>
                    </div>

                    {/* Status Changer & Detail Button */}
                    <div className="flex items-center gap-2 pt-1">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="flex-1 bg-white border border-[#E4E4E7] rounded-xl px-2.5 py-2 text-xs font-bold text-[#2D2118]"
                      >
                        <option value="recebido">Recebido</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="em_preparo">Em Preparo</option>
                        <option value="pronto">Pronto</option>
                        <option value="saiu_para_entrega">Saiu p/ Entrega</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                      </select>

                      <button
                        onClick={() => setSelectedOrderForDetails(order)}
                        className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EAE0D5] text-[#2D2118] border border-[#E5D7CA]"
                        title="Ver Detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {order.deliveryType === 'delivery' && (
                        <button
                          onClick={() => setAssigningOrder(order)}
                          className="p-2 rounded-xl bg-[#FFF3EC] hover:bg-[#FCE6DA] text-[#FF7243] border border-[#FFD7C9]"
                          title="Atribuir Entregador"
                        >
                          <Bike className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-2xl border border-[#EDE2D6] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#FAF7F2] text-[#7A6455] uppercase text-[10px] border-b border-[#EDE2D6]">
                    <tr>
                      <th className="p-3">Pedido</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Itens</th>
                      <th className="p-3">Valor</th>
                      <th className="p-3">Pagamento</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E6DC]">
                    {filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-[#FFFDF9] transition-colors">
                        <td className="p-3 font-bold text-[#2D2118]">
                          <span>{order.orderNumber}</span>
                          <span className="block text-[10px] font-normal text-[#8C7667]">
                            {order.createdAt}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="font-bold text-[#2D2118] block">{order.customer.name}</span>
                          <span className="text-[11px] text-[#7A6455]">{order.customer.phone}</span>
                        </td>

                        <td className="p-3 max-w-[200px] truncate">
                          <span className="text-[#5D473A]">
                            {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                          </span>
                        </td>

                        <td className="p-3 font-bold text-[#FF7243] tabular-nums">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </td>

                        <td className="p-3">
                          <span className="capitalize text-[11px] font-medium text-[#5D473A]">
                            {order.paymentMethod.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              order.deliveryType === 'delivery'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {order.deliveryType === 'delivery' ? 'Entrega' : 'Retirada'}
                          </span>
                        </td>

                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="px-2 py-1 rounded-lg text-[11px] font-bold border bg-white"
                          >
                            <option value="recebido">Recebido</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="em_preparo">Em Preparo</option>
                            <option value="pronto">Pronto</option>
                            <option value="saiu_para_entrega">Saiu p/ Entrega</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </td>

                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setSelectedOrderForDetails(order)}
                            className="p-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EDE2D6] text-[#5D473A] transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {order.deliveryType === 'delivery' && (
                            <button
                              onClick={() => setAssigningOrder(order)}
                              className="p-1.5 rounded-lg bg-[#FFF3EC] hover:bg-[#EDE2D6] text-[#FF7243] transition-colors"
                              title="Atribuir Entregador"
                            >
                              <Bike className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EDE2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 w-full sm:max-w-sm">
                <Search className="w-4 h-4 text-[#A89282]" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  placeholder="Pesquisar bolos, tortas..."
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-1.5 text-xs text-[#2D2118]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={productCatFilter}
                  onChange={e => setProductCatFilter(e.target.value)}
                  className="flex-1 sm:flex-initial bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2118]"
                >
                  <option value="todos">Todas Categorias</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setProductPhotos([]);
                    setIsNewProductModalOpen(true);
                  }}
                  className="py-1.5 px-3.5 rounded-xl bg-[#FF7243] hover:bg-[#E85D30] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Doce</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {products
                .filter(p => {
                  const matchesCat = productCatFilter === 'todos' || p.categoryId === productCatFilter;
                  const matchesSearch =
                    !productSearch.trim() ||
                    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                    p.description.toLowerCase().includes(productSearch.toLowerCase());
                  return matchesCat && matchesSearch;
                })
                .map(prod => (
                  <div
                    key={prod.id}
                    className="bg-white rounded-2xl p-3.5 border border-[#EDE2D6] shadow-xs flex gap-3 justify-between"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#EAE0D5] shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#FF7243] truncate max-w-[120px]">
                          {categories.find(c => c.id === prod.categoryId)?.name}
                        </span>
                        <button
                          onClick={() => toggleProductAvailability(prod.id)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            prod.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {prod.isAvailable ? 'Ativo' : 'Pausado'}
                        </button>
                      </div>

                      <h4 className="font-bold text-xs text-[#2D2118] truncate">
                        {prod.name}
                      </h4>

                      <div className="text-xs font-extrabold text-[#2D2118] tabular-nums">
                        R$ {prod.basePrice.toFixed(2).replace('.', ',')}
                      </div>

                      <div className="pt-1.5 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(prod);
                            setProductPhotos(prod.images && prod.images.length > 0 ? prod.images : [prod.image]);
                          }}
                          className="py-1 px-2.5 rounded-lg bg-[#FAF7F2] hover:bg-[#EDE2D6] text-[11px] font-bold text-[#5D473A] flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir o doce "${prod.name}"?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          className="py-1 px-2 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px]"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: PDV BALCÃO (COM SELETOR DE ABA MOBILE) */}
        {/* ======================================================== */}
        {activeTab === 'pos' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {posSuccessNotice && (
              <div className="bg-emerald-100 border border-emerald-300 p-3 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-bold">{posSuccessNotice}</span>
              </div>
            )}

            {/* Mobile Tab Switcher for POS */}
            <div className="flex sm:hidden bg-white p-1 rounded-2xl border border-[#EDE2D6]">
              <button
                onClick={() => setPosTab('products')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  posTab === 'products' ? 'bg-[#FF7243] text-white shadow-xs' : 'text-[#71717A]'
                }`}
              >
                1. Cardápio Balcão
              </button>
              <button
                onClick={() => setPosTab('cart')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  posTab === 'cart' ? 'bg-[#FF7243] text-white shadow-xs' : 'text-[#71717A]'
                }`}
              >
                <span>2. Caixa & Comanda</span>
                {posCart.length > 0 && (
                  <span className="bg-[#18181B] text-white text-[9px] px-1.5 rounded-full">
                    {posCart.length}
                  </span>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Product Picker */}
              <div className={`lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE2D6] shadow-xs space-y-3 ${
                posTab === 'cart' ? 'hidden sm:block' : 'block'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                    Lançamento Rápido no Balcão
                  </h3>
                  <span className="text-[11px] text-[#8C7667]">Toque para lançar</span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-[#A89282] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={posSearch}
                    onChange={e => setPosSearch(e.target.value)}
                    placeholder="Buscar doce por nome..."
                    className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D2118]"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[440px] overflow-y-auto pr-1">
                  {products
                    .filter(p => !posSearch || p.name.toLowerCase().includes(posSearch.toLowerCase()))
                    .map(prod => (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handlePosAddItem(prod)}
                        className="p-2 rounded-xl border border-[#EDE2D6] hover:border-[#FF7243] bg-[#FAF7F2] text-left transition-all flex flex-col justify-between group active:scale-95"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-18 sm:h-20 rounded-lg object-cover mb-1.5"
                        />
                        <span className="font-bold text-xs text-[#2D2118] line-clamp-1 group-hover:text-[#FF7243]">
                          {prod.name}
                        </span>
                        <span className="font-extrabold text-xs text-[#FF7243] tabular-nums mt-1">
                          R$ {(prod.promotionalPrice || prod.basePrice).toFixed(2).replace('.', ',')}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              {/* POS Cart Summary */}
              <div className={`lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE2D6] shadow-xs flex flex-col justify-between space-y-4 ${
                posTab === 'products' ? 'hidden sm:flex' : 'flex'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F0E6DC] pb-3">
                    <h4 className="font-bold text-sm text-[#2D2118]">
                      Comanda Presencial ({posCart.length} itens)
                    </h4>
                    {posCart.length > 0 && (
                      <button
                        onClick={() => setPosCart([])}
                        className="text-xs text-rose-600 font-bold hover:underline"
                      >
                        Limpar
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto">
                    {posCart.length === 0 ? (
                      <p className="text-xs text-[#A1A1AA] text-center py-8">
                        Nenhum doce na comanda do balcão.
                      </p>
                    ) : (
                      posCart.map(item => (
                        <div key={item.cartItemId} className="flex items-center justify-between text-xs py-1.5 border-b border-[#FAF4ED]">
                          <div className="flex-1 pr-2">
                            <span className="font-bold text-[#2D2118] block">{item.product.name}</span>
                            <span className="text-[10px] text-[#8C7667]">
                              {item.quantity}x R$ {item.unitPrice.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <span className="font-extrabold text-[#2D2118] tabular-nums">
                            R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Payment Method Selector */}
                  <div className="border-t border-[#F0E6DC] pt-3 space-y-2">
                    <label className="block text-xs font-bold text-[#2D2118]">
                      Forma de Recebimento no Caixa:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['pix', 'dinheiro', 'cartao_entrega'] as const).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setPosPaymentMethod(m)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold capitalize border ${
                            posPaymentMethod === m
                              ? 'bg-[#18181B] text-white border-[#18181B]'
                              : 'bg-[#FAF7F2] text-[#5D473A] border-[#E8DCCF]'
                          }`}
                        >
                          {m === 'cartao_entrega' ? 'Cartão' : m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Desconto */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="font-medium text-[#5D473A]">Desconto Balcão (R$):</span>
                    <input
                      type="number"
                      min="0"
                      value={posDiscount}
                      onChange={e => setPosDiscount(parseFloat(e.target.value) || 0)}
                      className="w-20 bg-[#FAF7F2] border border-[#E6DCD1] rounded-lg px-2 py-1 text-right text-xs font-bold text-[#2D2118]"
                    />
                  </div>
                </div>

                {/* POS Total & Confirm */}
                <div className="border-t border-[#F0E6DC] pt-3 space-y-3">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-sm text-[#2D2118]">Total a Receber:</span>
                    <span className="text-2xl text-[#FF7243] tabular-nums font-extrabold">
                      R$ {posTotal.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  <button
                    disabled={posCart.length === 0}
                    onClick={handleFinishPosSale}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#FF7243] hover:bg-[#E85D30] disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
                  >
                    Registrar Venda Presencial
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: DELIVERIES & DRIVERS */}
        {/* ======================================================== */}
        {activeTab === 'deliveries' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EDE2D6] shadow-xs">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118] mb-0.5">
                Entregadores & Logística em Americana
              </h3>
              <p className="text-xs text-[#7A6455]">
                Frota própria com caixa térmica nivelada para transporte seguro de bolos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {drivers.map(driver => {
                const assigned = orders.filter(
                  o => o.assignedDriverId === driver.id && o.status !== 'entregue' && o.status !== 'cancelado'
                );

                return (
                  <div
                    key={driver.id}
                    className="bg-white rounded-2xl p-4 border border-[#EDE2D6] shadow-xs space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={driver.photo}
                        alt={driver.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#EAE0D5] shadow-xs"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#2D2118] truncate">{driver.name}</h4>
                        <p className="text-[11px] text-[#7A6455]">{driver.phone}</p>
                        <p className="text-[10px] text-amber-500 font-bold mt-0.5">
                          ★ {driver.rating.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl text-xs space-y-0.5 text-[#5D473A]">
                      <span className="font-bold text-[#2D2118] block text-[11px]">Veículo:</span>
                      <span className="text-[11px]">{driver.vehicle}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[#7A6455]">Status:</span>
                      <select
                        value={driver.status}
                        onChange={e => updateDriverStatus(driver.id, e.target.value as any)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                          driver.status === 'em_rota'
                            ? 'bg-orange-100 text-orange-900'
                            : driver.status === 'disponivel'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <option value="disponivel">Disponível</option>
                        <option value="em_rota">Em Rota</option>
                        <option value="indisponivel">Indisponível</option>
                      </select>
                    </div>

                    <div className="border-t border-[#F0E6DC] pt-2 text-xs">
                      <span className="font-bold text-[#2D2118] text-[11px]">
                        Entregas Ativas: {assigned.length}
                      </span>
                      {assigned.map(ord => (
                        <div key={ord.id} className="mt-1 p-2 rounded-lg bg-[#FFF9F5] border border-[#FAD8C7] flex justify-between items-center text-[10px]">
                          <span className="font-bold">{ord.orderNumber}</span>
                          <span className="text-[#FF7243] font-bold">
                            {ord.address?.neighborhood || 'Americana'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: CATEGORIES MANAGEMENT */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EDE2D6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                  Gerenciar Categorias
                </h3>
                <p className="text-xs text-[#7A6455]">
                  Organize os grupos de doces exibidos no carrossel da loja
                </p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Nova categoria..."
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="flex-1 sm:flex-initial bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-1.5 text-xs text-[#2D2118]"
                />
                <button
                  onClick={() => {
                    if (!newCatName.trim()) return;
                    addCategory({
                      name: newCatName.trim(),
                      slug: newCatName.toLowerCase().replace(/\s+/g, '-'),
                      image: '/src/assets/images/product_bolo_morango_1794237512290.jpg',
                      description: 'Categoria adicionada no painel administrativo'
                    });
                    setNewCatName('');
                  }}
                  className="py-1.5 px-3.5 rounded-xl bg-[#18181B] text-white text-xs font-bold hover:bg-[#27272A] shrink-0"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(cat => {
                const count = products.filter(p => p.categoryId === cat.id).length;
                return (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl p-3.5 border border-[#EDE2D6] shadow-xs flex items-center gap-3 justify-between"
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#EAE0D5] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#2D2118] truncate">
                        {cat.name}
                      </h4>
                      <span className="text-[10px] text-[#7A6455]">
                        {count} produtos vinculados
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Deseja excluir a categoria "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="text-[#A89282] hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: FINANCIAL & REPORTS */}
        {/* ======================================================== */}
        {activeTab === 'financial' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EDE2D6] shadow-xs">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                Relatório Financeiro & Faturamento
              </h3>
              <p className="text-xs text-[#7A6455]">
                Discriminação por forma de pagamento e canal de atendimento
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EDE2D6]">
                <span className="text-[10px] font-bold text-[#8C7667] uppercase block">
                  Recebido via Pix
                </span>
                <span className="font-serif text-lg sm:text-2xl font-extrabold text-emerald-700 block mt-1 tabular-nums">
                  R$ {pixSales.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-[#8C7667]">Sem taxa maquininha</span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EDE2D6]">
                <span className="text-[10px] font-bold text-[#8C7667] uppercase block">
                  Cartão (Entrega / Loja)
                </span>
                <span className="font-serif text-lg sm:text-2xl font-extrabold text-blue-700 block mt-1 tabular-nums">
                  R$ {cardSales.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-[#8C7667]">Débito e crédito</span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EDE2D6]">
                <span className="text-[10px] font-bold text-[#8C7667] uppercase block">
                  Dinheiro Físico
                </span>
                <span className="font-serif text-lg sm:text-2xl font-extrabold text-[#2D2118] block mt-1 tabular-nums">
                  R$ {cashSales.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-[#8C7667]">Balcão ou entrega</span>
              </div>

              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EDE2D6]">
                <span className="text-[10px] font-bold text-[#8C7667] uppercase block">
                  Taxas de Entrega
                </span>
                <span className="font-serif text-lg sm:text-2xl font-extrabold text-amber-700 block mt-1 tabular-nums">
                  R$ {totalDeliveryFees.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-[10px] text-[#8C7667]">Logística própria</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE2D6] space-y-3">
                <h4 className="font-bold text-xs sm:text-sm text-[#2D2118]">
                  Canal de Venda: Online vs. Balcão Físico
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Loja Online / Cardápio Digital:</span>
                    <span className="font-bold tabular-nums">R$ {onlineSalesTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PDV Balcão (Venda Presencial):</span>
                    <span className="font-bold tabular-nums">R$ {posSalesTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Descontos Promocionais:</span>
                    <span className="font-bold tabular-nums">- R$ {totalDiscountsGiven.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7F2] rounded-2xl p-4 sm:p-5 border border-[#E8DCCF] space-y-1.5 text-xs text-[#5D473A]">
                <h4 className="font-bold text-xs sm:text-sm text-[#2D2118]">Transparência Financeira</h4>
                <p className="leading-relaxed text-[11px]">
                  Faturamento bruto das encomendas demonstrativas registradas. Custos de ingredientes nobres (cacau nobre, frutas frescas, embalagens térmicas) devem ser deduzidos para margem líquida real.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 8: COUPONS & CAMPAIGNS */}
        {/* ======================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EDE2D6] shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                  Cupons Promocionais
                </h3>
                <p className="text-xs text-[#7A6455]">
                  Descontos de primeira compra e campanhas
                </p>
              </div>

              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="py-1.5 px-3.5 rounded-xl bg-[#FF7243] hover:bg-[#E85D30] text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Cupom</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {coupons.map(coupon => (
                <div
                  key={coupon.id}
                  className="bg-white rounded-2xl p-4 border border-[#EDE2D6] shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#FF7243] bg-[#FFF3EC] px-2 py-0.5 rounded-lg border border-[#FFD7C9]">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => toggleCouponActive(coupon.id)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        coupon.isActive
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {coupon.isActive ? 'Ativo' : 'Pausado'}
                    </button>
                  </div>

                  <p className="text-xs text-[#5D473A] leading-relaxed">
                    {coupon.description}
                  </p>

                  <div className="text-[11px] space-y-0.5 text-[#7A6455] pt-1.5 border-t border-[#F0E6DC]">
                    <div className="flex justify-between">
                      <span>Desconto:</span>
                      <strong className="text-[#2D2118]">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `R$ ${coupon.discountValue.toFixed(2)}`}
                      </strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 9: STORE SETTINGS */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#EDE2D6] shadow-xs space-y-5 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#2D2118]">
                Configurações da Confeitaria
              </h3>
              <p className="text-xs text-[#7A6455]">
                Dados do ateliê em Americana, taxas de entrega e horários
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Nome Comercial:</label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Slogan:</label>
                <input
                  type="text"
                  value={settingsForm.brandSlogan}
                  onChange={e => setSettingsForm({ ...settingsForm, brandSlogan: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A382A] mb-1">WhatsApp de Encomendas:</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp}
                  onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Instagram:</label>
                <input
                  type="text"
                  value={settingsForm.instagram}
                  onChange={e => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[#4A382A] mb-1">Endereço do Ateliê:</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Taxa de Entrega (Americana):</label>
                <input
                  type="number"
                  value={settingsForm.defaultDeliveryFee}
                  onChange={e => setSettingsForm({ ...settingsForm, defaultDeliveryFee: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Frete Grátis Acima de (R$):</label>
                <input
                  type="number"
                  value={settingsForm.freeDeliveryThreshold}
                  onChange={e => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  updateSettings(settingsForm);
                  alert('Configurações salvas com sucesso!');
                }}
                className="py-2.5 px-6 rounded-2xl bg-[#FF7243] hover:bg-[#E85D30] text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-transform active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: ORDER DETAILS */}
      {/* ======================================================== */}
      {selectedOrderForDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto border border-[#EAE0D5]">
            <div className="flex items-center justify-between border-b border-[#F0E6DC] pb-3">
              <div>
                <h3 className="font-serif font-bold text-base text-[#2D2118]">
                  Pedido {selectedOrderForDetails.orderNumber}
                </h3>
                <span className="text-xs text-[#7A6455]">{selectedOrderForDetails.createdAt}</span>
              </div>
              <button
                onClick={() => setSelectedOrderForDetails(null)}
                className="text-[#8C7667] hover:text-[#2D2118]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#5D473A]">
              <div>
                <strong className="block text-[#2D2118]">Cliente:</strong>
                <span>{selectedOrderForDetails.customer.name} · {selectedOrderForDetails.customer.phone}</span>
              </div>

              {selectedOrderForDetails.address && (
                <div>
                  <strong className="block text-[#2D2118]">Endereço de Entrega:</strong>
                  <span>
                    {selectedOrderForDetails.address.street}, {selectedOrderForDetails.address.number}
                    {selectedOrderForDetails.address.complement ? ` (${selectedOrderForDetails.address.complement})` : ''} - {selectedOrderForDetails.address.neighborhood}, Americana - SP
                  </span>
                </div>
              )}

              <div>
                <strong className="block text-[#2D2118]">Agendamento:</strong>
                <span>{selectedOrderForDetails.scheduledDate} ({selectedOrderForDetails.scheduledTimeSlot})</span>
              </div>

              <div className="border-t border-[#F0E6DC] pt-2 space-y-1.5">
                <strong className="block text-[#2D2118]">Itens do Pedido:</strong>
                {selectedOrderForDetails.items.map(it => (
                  <div key={it.cartItemId} className="bg-[#FAF7F2] p-2 rounded-xl flex justify-between">
                    <div>
                      <span className="font-bold text-[#2D2118]">{it.quantity}x {it.product.name}</span>
                      <span className="block text-[10px] text-[#7A6455]">
                        {it.selectedSize.name} · {it.selectedFlavor}
                      </span>
                      {it.customerNotes && (
                        <span className="block text-[10px] text-[#C85A32] italic mt-0.5">
                          Dedicatória: "{it.customerNotes}"
                        </span>
                      )}
                    </div>
                    <span className="font-extrabold text-[#2D2118] tabular-nums">
                      R$ {it.totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#F0E6DC] pt-2 flex justify-between font-extrabold text-sm text-[#2D2118]">
                <span>Total a Pagar:</span>
                <span className="text-[#FF7243] tabular-nums">
                  R$ {selectedOrderForDetails.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderForDetails(null)}
              className="w-full py-2.5 rounded-xl bg-[#2D2118] text-white text-xs font-bold"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ASSIGN DRIVER */}
      {/* ======================================================== */}
      {assigningOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3.5 border border-[#EAE0D5]">
            <div className="flex items-center justify-between border-b border-[#F0E6DC] pb-3">
              <h3 className="font-bold text-xs sm:text-sm text-[#2D2118]">
                Atribuir Entregador · {assigningOrder.orderNumber}
              </h3>
              <button onClick={() => setAssigningOrder(null)}>
                <X className="w-4 h-4 text-[#8C7667]" />
              </button>
            </div>

            <div className="space-y-2">
              {drivers.map(d => (
                <button
                  key={d.id}
                  onClick={() => {
                    assignDriverToOrder(assigningOrder.id, d.id);
                    setAssigningOrder(null);
                  }}
                  className="w-full p-2.5 rounded-xl border border-[#EDE2D6] hover:border-[#FF7243] bg-[#FAF7F2] hover:bg-white text-left flex items-center gap-3 transition-colors"
                >
                  <img src={d.photo} alt={d.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-xs text-[#2D2118] block truncate">{d.name}</span>
                    <span className="text-[10px] text-[#7A6455] truncate block">{d.vehicle.split('-')[0]}</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${d.status === 'disponivel' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {d.status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE COUPON */}
      {/* ======================================================== */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-3 border border-[#EAE0D5]">
            <div className="flex items-center justify-between border-b border-[#F0E6DC] pb-2">
              <h3 className="font-bold text-sm text-[#2D2118]">Cadastrar Novo Cupom</h3>
              <button onClick={() => setIsCouponModalOpen(false)}>
                <X className="w-4 h-4 text-[#8C7667]" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[#4A382A] font-bold mb-1">Código do Cupom:</label>
                <input
                  type="text"
                  placeholder="EX: MAITE20"
                  value={newCouponCode}
                  onChange={e => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-1.5 font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#4A382A] font-bold mb-1">Tipo:</label>
                  <select
                    value={newCouponType}
                    onChange={e => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-2 py-1.5"
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#4A382A] font-bold mb-1">Valor:</label>
                  <input
                    type="number"
                    value={newCouponValue}
                    onChange={e => setNewCouponValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-2 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#4A382A] font-bold mb-1">Pedido Mínimo (R$):</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={e => setNewCouponMin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-1.5"
                />
              </div>
            </div>

            <button
              onClick={() => {
                if (!newCouponCode.trim()) return;
                addCoupon({
                  code: newCouponCode.trim(),
                  description: `Desconto de ${newCouponType === 'percentage' ? `${newCouponValue}%` : `R$ ${newCouponValue}`} para clientes`,
                  discountType: newCouponType,
                  discountValue: newCouponValue,
                  minOrderValue: newCouponMin,
                  isActive: true,
                  expiresAt: '2026-12-31'
                });
                setIsCouponModalOpen(false);
                setNewCouponCode('');
              }}
              className="w-full mt-3 py-2.5 rounded-xl bg-[#FF7243] hover:bg-[#E85D30] text-white font-bold text-xs"
            >
              Salvar Cupom
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT PRODUCT */}
      {/* ======================================================== */}
      {(isNewProductModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto border border-[#EAE0D5]">
            <div className="flex items-center justify-between border-b border-[#F0E6DC] pb-3">
              <h3 className="font-serif font-bold text-sm sm:text-base text-[#2D2118]">
                {editingProduct ? 'Editar Doce' : 'Cadastrar Novo Doce'}
              </h3>
              <button
                onClick={() => {
                  setIsNewProductModalOpen(false);
                  setEditingProduct(null);
                }}
              >
                <X className="w-5 h-5 text-[#8C7667]" />
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get('name') as string;
                const categoryId = formData.get('categoryId') as string;
                const basePrice = parseFloat(formData.get('basePrice') as string) || 50;
                const promo = formData.get('promotionalPrice') ? parseFloat(formData.get('promotionalPrice') as string) : undefined;
                const description = formData.get('description') as string;

                const mainPhoto = productPhotos[0] || editingProduct?.image || '/src/assets/images/product_bolo_morango_1794237512290.jpg';
                const allPhotos = productPhotos.length > 0 ? productPhotos : (editingProduct?.images || [mainPhoto]);

                if (editingProduct) {
                  updateProduct({
                    ...editingProduct,
                    name,
                    categoryId,
                    basePrice,
                    promotionalPrice: promo || undefined,
                    description,
                    image: mainPhoto,
                    images: allPhotos
                  });
                  setEditingProduct(null);
                  setProductPhotos([]);
                } else {
                  addProduct({
                    name,
                    categoryId,
                    basePrice,
                    promotionalPrice: promo || undefined,
                    description,
                    image: mainPhoto,
                    images: allPhotos,
                    badge: 'novidade',
                    rating: 5.0,
                    reviewsCount: 1,
                    prepTime: '24 horas',
                    weightEstimate: '1.2 kg',
                    isAvailable: true,
                    sizes: [
                      { id: 's', name: 'Tamanho P', code: 'P', servings: '10 fatias', weight: '1.2 kg', priceDelta: 0 },
                      { id: 'm', name: 'Tamanho M', code: 'M', servings: '20 fatias', weight: '2.0 kg', priceDelta: 55 }
                    ],
                    availableFlavors: ['Tradicional Especial'],
                    availableFillings: ['Brigadeiro Gourmet'],
                    availableToppings: [{ name: 'Topper Comemorativo', price: 15 }]
                  });
                  setIsNewProductModalOpen(false);
                  setProductPhotos([]);
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Nome do Produto:</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProduct?.name || ''}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-[#2D2118]"
                />
              </div>

              {/* Upload de Múltiplas Fotos */}
              <div className="space-y-2">
                <label className="block font-bold text-[#4A382A]">
                  Fotos do Produto (Você pode enviar mais de uma foto):
                </label>

                <input
                  type="file"
                  id="admin-product-file-input"
                  accept="image/*"
                  multiple
                  onChange={handleProductPhotoUpload}
                  className="hidden"
                />

                <label
                  htmlFor="admin-product-file-input"
                  className="border-2 border-dashed border-[#D5C4B5] hover:border-[#FF7243] bg-[#FAF7F2] hover:bg-[#FFF7F2] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group"
                >
                  <Upload className="w-6 h-6 text-[#FF7243] group-hover:scale-110 transition-transform mb-1" />
                  <span className="font-bold text-xs text-[#2D2118]">
                    Clique para carregar fotos do doce
                  </span>
                  <span className="text-[10px] text-[#7A6455]">
                    Selecione uma ou mais fotos do seu celular ou computador (JPG, PNG, WebP)
                  </span>
                </label>

                {/* Previews das fotos carregadas */}
                {productPhotos.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-[#7A6455] font-semibold block">
                      Fotos adicionadas ({productPhotos.length}) · A 1ª foto será a capa principal:
                    </span>
                    <div className="flex flex-wrap gap-2.5 max-h-36 overflow-y-auto p-1 bg-[#FAF7F2] rounded-xl border border-[#E6DCD1]">
                      {productPhotos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative w-18 h-18 rounded-xl overflow-hidden border-2 border-white shadow-xs group shrink-0"
                        >
                          <img
                            src={photo}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {index === 0 && (
                            <span className="absolute top-1 left-1 bg-[#FF7243] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs">
                              Capa
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryPhoto(index)}
                                title="Definir como capa"
                                className="p-1 bg-white/90 hover:bg-white text-[#2D2118] rounded-md text-[9px] font-bold"
                              >
                                Capa
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(index)}
                              title="Remover foto"
                              className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4A382A] mb-1">Categoria:</label>
                  <select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId || categories[0]?.id}
                    className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-2.5 py-2 text-[#2D2118]"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#4A382A] mb-1">Preço Base (R$):</label>
                  <input
                    type="number"
                    step="0.01"
                    name="basePrice"
                    required
                    defaultValue={editingProduct?.basePrice || ''}
                    className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-[#2D2118]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Preço Promocional (Opcional):</label>
                <input
                  type="number"
                  step="0.01"
                  name="promotionalPrice"
                  defaultValue={editingProduct?.promotionalPrice || ''}
                  placeholder="Deixe em branco se não houver"
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-[#2D2118]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A382A] mb-1">Descrição:</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingProduct?.description || ''}
                  className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl p-2.5 text-[#2D2118]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-[#7A6455]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 rounded-2xl bg-[#FF7243] hover:bg-[#E85D30] text-white font-bold text-xs"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Doce'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
