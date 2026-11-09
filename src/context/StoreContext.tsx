import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  DeliveryDriver,
  Coupon,
  StoreSettings,
  OrderStatus,
  PaymentMethod,
  ActiveView
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_DRIVERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS
} from '../data/initialData';
import { getImageUrl } from '../utils/imageUrl';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  orders: Order[];
  drivers: DeliveryDriver[];
  coupons: Coupon[];
  settings: StoreSettings;
  cart: CartItem[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: string;
  setSelectedCategory: (catId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  trackingOrder: Order | null;
  setTrackingOrder: (order: Order | null) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addToCart: (item: Omit<CartItem, 'cartItemId' | 'totalPrice'>) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;
  cartItemsCount: number;
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, driverNotes?: string) => void;
  assignDriverToOrder: (orderId: string, driverId: string) => void;
  registerPosSale: (items: CartItem[], paymentMethod: PaymentMethod, total: number, discount: number) => Order;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  toggleProductAvailability: (productId: string) => void;
  updateCategory: (category: Category) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (categoryId: string) => void;
  updateDriverStatus: (driverId: string, status: DeliveryDriver['status']) => void;
  updateSettings: (settings: Partial<StoreSettings>) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  toggleCouponActive: (couponId: string) => void;
  resetDemoData: () => void;
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;
  isTutorialOpen: boolean;
  setIsTutorialOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'maite_products_v3',
  CATEGORIES: 'maite_categories_v3',
  ORDERS: 'maite_orders_v3',
  DRIVERS: 'maite_drivers_v3',
  COUPONS: 'maite_coupons_v3',
  SETTINGS: 'maite_settings_v3',
  CART: 'maite_cart_v3',
  WELCOME: 'maite_welcome_seen_v3'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(prod => {
          const defaultMatch = INITIAL_PRODUCTS.find(p => p.id === prod.id);
          const image = defaultMatch ? defaultMatch.image : getImageUrl(prod.image);
          const images = defaultMatch
            ? defaultMatch.images
            : (prod.images && prod.images.length > 0
                ? prod.images.map(img => getImageUrl(img))
                : [image]);
          return { ...prod, image, images };
        });
      }
    } catch (e) {
      console.warn('Failed to parse saved products, resetting to defaults', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed: Category[] = JSON.parse(saved);
        return parsed.map(cat => {
          const defaultMatch = INITIAL_CATEGORIES.find(c => c.id === cat.id);
          const image = defaultMatch ? defaultMatch.image : getImageUrl(cat.image);
          return { ...cat, image };
        });
      }
    } catch (e) {
      console.warn('Failed to parse saved categories, resetting to defaults', e);
    }
    return INITIAL_CATEGORIES;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [drivers, setDrivers] = useState<DeliveryDriver[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DRIVERS);
      if (saved) {
        const parsed: DeliveryDriver[] = JSON.parse(saved);
        return parsed.map(d => {
          const defaultMatch = INITIAL_DRIVERS.find(item => item.id === d.id);
          return {
            ...d,
            photo: defaultMatch ? defaultMatch.photo : getImageUrl(d.photo)
          };
        });
      }
      return INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WELCOME);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });


  const [isTutorialOpen, setIsTutorialOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveView>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WELCOME, JSON.stringify(hasSeenWelcome));
  }, [hasSeenWelcome]);


  // Cart calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  const cartDeliveryFee = cartSubtotal >= settings.freeDeliveryThreshold || cart.length === 0
    ? 0
    : settings.defaultDeliveryFee;

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      cartDiscount = (cartSubtotal * appliedCoupon.discountValue) / 100;
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + (cart.length > 0 ? cartDeliveryFee : 0));
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (newItem: Omit<CartItem, 'cartItemId' | 'totalPrice'>) => {
    const itemTotal = newItem.unitPrice * newItem.quantity;
    const cartItemId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

    setCart(prev => [
      ...prev,
      {
        ...newItem,
        cartItemId,
        totalPrice: itemTotal
      }
    ]);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(c => c.code === clean && c.isActive);
    if (!found) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Este cupom exige pedido mínimo de R$ ${found.minOrderValue.toFixed(2).replace('.', ',')}.`
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Cupom ${found.code} aplicado com sucesso!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const orderNum = `#MB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedTime = `Hoje, às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: formattedTime,
      customer: orderData.customer || { name: 'Cliente', phone: '(19) 99999-0000' },
      deliveryType: orderData.deliveryType || 'delivery',
      address: orderData.address,
      scheduledDate: orderData.scheduledDate || 'Hoje',
      scheduledTimeSlot: orderData.scheduledTimeSlot || '14:00 - 15:00',
      paymentMethod: orderData.paymentMethod || 'pix',
      paymentStatus: orderData.paymentMethod === 'pix' ? 'aprovado' : 'na_entrega',
      items: orderData.items || [...cart],
      subtotal: orderData.subtotal || cartSubtotal,
      deliveryFee: orderData.deliveryFee ?? cartDeliveryFee,
      discount: orderData.discount ?? cartDiscount,
      total: orderData.total ?? cartTotal,
      couponCode: appliedCoupon?.code,
      status: 'recebido',
      driverNotes: orderData.driverNotes,
      changeFor: orderData.changeFor
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setTrackingOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, driverNotes?: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            ...(driverNotes !== undefined ? { driverNotes } : {})
          };
        }
        return ord;
      })
    );

    if (trackingOrder && trackingOrder.id === orderId) {
      setTrackingOrder(prev => (prev ? { ...prev, status, ...(driverNotes ? { driverNotes } : {}) } : null));
    }
  };

  const assignDriverToOrder = (orderId: string, driverId: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            assignedDriverId: driverId,
            status: ord.status === 'recebido' || ord.status === 'em_preparo' ? 'saiu_para_entrega' : ord.status
          };
        }
        return ord;
      })
    );
  };

  const registerPosSale = (items: CartItem[], paymentMethod: PaymentMethod, total: number, discount: number): Order => {
    const orderNum = `#BALCÃO-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();
    const formattedTime = `Hoje, às ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newOrder: Order = {
      id: `pos-${Date.now()}`,
      orderNumber: orderNum,
      createdAt: formattedTime,
      customer: { name: 'Venda Presencial (Balcão)', phone: settings.phone },
      deliveryType: 'retirada',
      scheduledDate: 'Hoje',
      scheduledTimeSlot: 'Retirada Imediata',
      paymentMethod,
      paymentStatus: 'aprovado',
      items,
      subtotal: total + discount,
      deliveryFee: 0,
      discount,
      total,
      status: 'entregue',
      isPosSale: true
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const resolvedImage = getImageUrl(prodData.image || 'bolo-morango.jpg');
    const newProd: Product = {
      ...prodData,
      image: resolvedImage,
      images: prodData.images && prodData.images.length > 0
        ? prodData.images.map(img => getImageUrl(img))
        : [resolvedImage],
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (updated: Product) => {
    const resolvedImage = getImageUrl(updated.image);
    const resolvedProd: Product = {
      ...updated,
      image: resolvedImage,
      images: updated.images && updated.images.length > 0
        ? updated.images.map(img => getImageUrl(img))
        : [resolvedImage]
    };
    setProducts(prev => prev.map(p => (p.id === resolvedProd.id ? resolvedProd : p)));
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const toggleProductAvailability = (productId: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, isAvailable: !p.isAvailable } : p))
    );
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      image: getImageUrl(catData.image || 'bolo-morango.jpg'),
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (updated: Category) => {
    setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const updateDriverStatus = (driverId: string, status: DeliveryDriver['status']) => {
    setDrivers(prev =>
      prev.map(d => (d.id === driverId ? { ...d, status } : d))
    );
  };

  const updateSettings = (updated: Partial<StoreSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  const addCoupon = (couponData: Omit<Coupon, 'id'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `c-${Date.now()}`
    };
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const toggleCouponActive = (couponId: string) => {
    setCoupons(prev =>
      prev.map(c => (c.id === couponId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const resetDemoData = () => {
    localStorage.clear();
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setDrivers(INITIAL_DRIVERS);
    setCoupons(INITIAL_COUPONS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);
    setAppliedCoupon(null);
    setSelectedCategory('todos');
    setSearchQuery('');
    setHasSeenWelcome(false);
    setTrackingOrder(null);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        orders,
        drivers,
        coupons,
        settings,
        cart,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        trackingOrder,
        setTrackingOrder,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        cartItemsCount,
        createOrder,
        updateOrderStatus,
        assignDriverToOrder,
        registerPosSale,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        updateCategory,
        addCategory,
        deleteCategory,
        updateDriverStatus,
        updateSettings,
        addCoupon,
        toggleCouponActive,
        resetDemoData,
        hasSeenWelcome,
        setHasSeenWelcome,
        isTutorialOpen,
        setIsTutorialOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
