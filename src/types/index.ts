export type ProductSize = {
  id: string;
  name: string;
  code: 'P' | 'M' | 'G';
  servings: string;
  weight: string;
  priceDelta: number;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  basePrice: number;
  promotionalPrice?: number;
  image: string;
  images?: string[];
  badge?: 'mais_vendido' | 'novidade' | 'destaque' | 'artesanal';
  rating: number;
  reviewsCount: number;
  prepTime: string;
  calories?: string;
  weightEstimate: string;
  sizes: ProductSize[];
  availableFlavors: string[];
  availableFillings: string[];
  availableToppings: { name: string; price: number }[];
  isAvailable: boolean;
  featured?: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  image: string;
  itemCount?: number;
  description: string;
};

export type CartItem = {
  cartItemId: string;
  productId: string;
  product: Product;
  quantity: number;
  selectedSize: ProductSize;
  selectedFlavor: string;
  selectedFilling?: string;
  selectedToppings: { name: string; price: number }[];
  customerNotes?: string;
  unitPrice: number;
  totalPrice: number;
};

export type OrderStatus =
  | 'recebido'
  | 'confirmado'
  | 'em_preparo'
  | 'pronto'
  | 'saiu_para_entrega'
  | 'entregue'
  | 'cancelado';

export type PaymentMethod =
  | 'pix'
  | 'cartao_entrega'
  | 'dinheiro'
  | 'cartao_retirada';

export type DeliveryType = 'delivery' | 'retirada';

export type CustomerInfo = {
  name: string;
  phone: string;
  email?: string;
};

export type DeliveryAddress = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
  referencePoint?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: CustomerInfo;
  deliveryType: DeliveryType;
  address?: DeliveryAddress;
  scheduledDate: string;
  scheduledTimeSlot: string;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pendente' | 'aprovado' | 'na_entrega';
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  isPosSale?: boolean;
  assignedDriverId?: string;
  driverNotes?: string;
  changeFor?: number;
};

export type DeliveryDriver = {
  id: string;
  name: string;
  phone: string;
  photo: string;
  rating: number;
  status: 'disponivel' | 'em_rota' | 'indisponivel';
  vehicle: string;
  activeDeliveriesCount: number;
  completedTodayCount: number;
};

export type Coupon = {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  isActive: boolean;
  expiresAt: string;
};

export type StoreSettings = {
  name: string;
  brandSlogan: string;
  instagram: string;
  whatsapp: string;
  phone: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  openingHours: string;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  minimumOrderValue: number;
  minimumNoticeHours: number;
  pixKey: string;
  pixKeyType: string;
  enablePix: boolean;
  enableCardOnDelivery: boolean;
  enableCash: boolean;
  enableCardOnPickup: boolean;
  allowPickup: boolean;
  allowDelivery: boolean;
};

export type ActiveView = 'store' | 'admin' | 'confectioner' | 'driver';
