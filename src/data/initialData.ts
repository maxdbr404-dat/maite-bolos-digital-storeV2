import { Category, Product, DeliveryDriver, Coupon, StoreSettings, Order } from '../types';

import logoPatisserie from '../assets/images/maite_logo_patisserie_1794237555058.jpg';
import heroBakery from '../assets/images/hero_welcome_bakery_1794237511122.jpg';
import avatarEntregador from '../assets/images/avatar_entregador_1794237540071.jpg';
import boloMorango from '../assets/images/product_bolo_morango_1794237512290.jpg';
import boloBrigadeiro from '../assets/images/product_bolo_brigadeiro_1794237511922.jpg';
import boloCenoura from '../assets/images/product_bolo_cenoura_1794237536926.jpg';
import boloRedVelvet from '../assets/images/product_red_velvet_1794237537894.jpg';
import tortaMerengue from '../assets/images/product_torta_merengue_1794237513024.jpg';
import tortaBanoffee from '../assets/images/product_banoffee_1794237538172.jpg';
import brigadeirosBox from '../assets/images/product_brigadeiros_box_1794237514941.jpg';
import browniesBox from '../assets/images/product_brownies_1794237537889.jpg';
import cupcakesBox from '../assets/images/product_cupcakes_1794237538123.jpg';
import kitPresente from '../assets/images/product_kit_presente_1794237515315.jpg';

export const STORE_LOGO_URL = logoPatisserie;
export const HERO_IMAGE_URL = heroBakery;
export const DRIVER_AVATAR_URL = avatarEntregador;

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'bolos-decorados',
    name: 'Bolos Decorados',
    slug: 'bolos-decorados',
    image: boloMorango,
    description: 'Bolos artísticos e personalizados para momentos inesquecíveis'
  },
  {
    id: 'bolos-aniversario',
    name: 'Bolos de Festa',
    slug: 'bolos-aniversario',
    image: boloRedVelvet,
    description: 'Combinações clássicas com recheios generosos e acabamento fino'
  },
  {
    id: 'bolos-caseiros',
    name: 'Bolos Caseiros & Vulcão',
    slug: 'bolos-caseiros',
    image: boloCenoura,
    description: 'Receitas de família com muita calda artesanal e afeto'
  },
  {
    id: 'tortas-finas',
    name: 'Tortas Finas',
    slug: 'tortas-finas',
    image: tortaMerengue,
    description: 'Massa crocante de manteiga e recheios delicados'
  },
  {
    id: 'brigadeiros-doces',
    name: 'Brigadeiros Gourmet',
    slug: 'brigadeiros-doces',
    image: brigadeirosBox,
    description: 'Docinhos enrolados um a um com chocolate nobre belga'
  },
  {
    id: 'brownies-barras',
    name: 'Brownies & Barras',
    slug: 'brownies-barras',
    image: browniesBox,
    description: 'Casquinha craquelada crocante e interior cremoso fudgy'
  },
  {
    id: 'cupcakes',
    name: 'Cupcakes Delicados',
    slug: 'cupcakes',
    image: cupcakesBox,
    description: 'Minibolos individuais recheados com topo em rosetas'
  },
  {
    id: 'kits-festa',
    name: 'Kits & Presentes',
    slug: 'kits-festa',
    image: kitPresente,
    description: 'Kits completos prontos com bolo, doces e embalagem especial'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Bolo Floral Celebration & Frutas Vermelhas',
    categoryId: 'bolos-decorados',
    description: 'Bolo com massa amanteigada de baunilha, recheio trufado de chocolate branco com compota artesanal de frutas vermelhas e cobertura aveludada com macarons franceses.',
    basePrice: 165.0,
    promotionalPrice: 148.0,
    image: boloMorango,
    images: [boloMorango, heroBakery],
    badge: 'mais_vendido',
    rating: 4.9,
    reviewsCount: 48,
    prepTime: '24 horas',
    calories: '320 kcal / fatia',
    weightEstimate: '1.5 kg',
    featured: true,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Tamanho P', code: 'P', servings: '10 a 12 fatias', weight: '1.2 kg', priceDelta: 0 },
      { id: 'm', name: 'Tamanho M', code: 'M', servings: '18 a 22 fatias', weight: '2.0 kg', priceDelta: 65 },
      { id: 'g', name: 'Tamanho G', code: 'G', servings: '28 a 32 fatias', weight: '3.0 kg', priceDelta: 130 }
    ],
    availableFlavors: ['Baunilha com Frutas Vermelhas', 'Ninho Especial com Morangos Frescos', 'Quatro Leites Suave'],
    availableFillings: ['Trufa Branca & Frutas Silvestres', 'Brigadeiro de Ninho & Geleia Caseira', 'Doce de Leite Suave'],
    availableToppings: [
      { name: 'Topper "Parabéns" em Dourado', price: 15.0 },
      { name: 'Caixa Presente com Laço de Cetim', price: 18.0 },
      { name: 'Vela Palito Minimalista Champagne', price: 8.0 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Bolo Choco-Drip Brigadeiro Belga',
    categoryId: 'bolos-aniversario',
    description: 'Pão de ló 100% cacau Callebaut, camadas generosas de brigadeiro cremoso de colher e cobertura com drip ganache e dezenas de brigadeiros enrolados.',
    basePrice: 175.0,
    image: boloBrigadeiro,
    images: [boloBrigadeiro, browniesBox],
    badge: 'destaque',
    rating: 5.0,
    reviewsCount: 62,
    prepTime: '24 horas',
    calories: '380 kcal / fatia',
    weightEstimate: '1.8 kg',
    featured: true,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Tamanho P', code: 'P', servings: '10 a 12 fatias', weight: '1.2 kg', priceDelta: 0 },
      { id: 'm', name: 'Tamanho M', code: 'M', servings: '18 a 22 fatias', weight: '2.0 kg', priceDelta: 70 },
      { id: 'g', name: 'Tamanho G', code: 'G', servings: '30 fatias', weight: '3.2 kg', priceDelta: 140 }
    ],
    availableFlavors: ['100% Chocolate Belga', 'Dois Amores (Preto e Branco)', 'Brigadeiro com Pedaços de Nozes'],
    availableFillings: ['Brigadeiro Gourmet Intenso', 'Mousse de Chocolate com Pedaços', 'Brigadeiro Meio Amargo'],
    availableToppings: [
      { name: 'Brigadeiros Extras no Topo (6 un)', price: 20.0 },
      { name: 'Topper Personalizado com Nome', price: 18.0 },
      { name: 'Vela Faísca Comemorativa', price: 12.0 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Bolo Vulcão de Cenoura com Brigadeiro Quente',
    categoryId: 'bolos-caseiros',
    description: 'A clássica massa fofinha e dourada de cenoura fresca, com piscina transbordando de calda de brigadeiro artesanal que escorre ao cortar.',
    basePrice: 68.0,
    promotionalPrice: 59.0,
    image: boloCenoura,
    images: [boloCenoura],
    badge: 'mais_vendido',
    rating: 4.9,
    reviewsCount: 84,
    prepTime: 'Pronta entrega',
    calories: '290 kcal / fatia',
    weightEstimate: '1.1 kg',
    featured: true,
    isAvailable: true,
    sizes: [
      { id: 'm', name: 'Tamanho Médio', code: 'M', servings: '8 a 10 fatias', weight: '1.1 kg', priceDelta: 0 },
      { id: 'g', name: 'Tamanho Grande', code: 'G', servings: '14 a 16 fatias', weight: '1.7 kg', priceDelta: 28.0 }
    ],
    availableFlavors: ['Tradicional com Cenouras Frescas'],
    availableFillings: ['Vulcão de Brigadeiro Tradicional', 'Vulcão de Brigadeiro Ninho'],
    availableToppings: [
      { name: 'Granulado Belga Split Callebaut', price: 8.0 },
      { name: 'Pote Extra de Calda Quente (150ml)', price: 14.0 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Torta Francesa de Limão Siciliano com Merengue',
    categoryId: 'tortas-finas',
    description: 'Pâte sablée fininha e crocante, curd sedoso de limão siciliano colhido fresco e nuvem de merengue suíço maçaricado ao ponto de caramelo.',
    basePrice: 110.0,
    image: tortaMerengue,
    images: [tortaMerengue],
    badge: 'artesanal',
    rating: 4.8,
    reviewsCount: 39,
    prepTime: '24 horas',
    calories: '240 kcal / fatia',
    weightEstimate: '1.2 kg',
    featured: true,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Média (20cm)', code: 'P', servings: '8 a 10 fatias', weight: '1.0 kg', priceDelta: 0 },
      { id: 'm', name: 'Grande (26cm)', code: 'M', servings: '14 a 16 fatias', weight: '1.6 kg', priceDelta: 45.0 }
    ],
    availableFlavors: ['Limão Siciliano Fresco'],
    availableFillings: ['Curd Artesanal Cítrico Suave'],
    availableToppings: [
      { name: 'Raspas Frescas de Limão e Flor de Sal', price: 5.0 },
      { name: 'Embalagem Especial com Laço', price: 12.0 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Caixa Degustação 12 Brigadeiros Gourmet Nobres',
    categoryId: 'brigadeiros-doces',
    description: 'Caixa rígida premium com seleção de 12 doces enrolados à mão: Chocolate Belga, Pistache Siciliano, Ninho com Nutella e Churros com Doce de Leite.',
    basePrice: 62.0,
    promotionalPrice: 54.0,
    image: brigadeirosBox,
    images: [brigadeirosBox],
    badge: 'mais_vendido',
    rating: 5.0,
    reviewsCount: 97,
    prepTime: 'Pronta entrega',
    calories: '85 kcal / unid',
    weightEstimate: '320g',
    featured: true,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Caixa com 12 unidades', code: 'P', servings: '12 docinhos', weight: '320g', priceDelta: 0 },
      { id: 'm', name: 'Caixa com 24 unidades', code: 'M', servings: '24 docinhos', weight: '640g', priceDelta: 50.0 },
      { id: 'g', name: 'Cento para Festa (100 un)', code: 'G', servings: '100 docinhos', weight: '2.5kg', priceDelta: 195.0 }
    ],
    availableFlavors: ['Sortidos (3 Belga, 3 Pistache, 3 Ninho, 3 Churros)', 'Apenas Chocolate Belga', 'Especial Ninho e Pistache'],
    availableFillings: ['Recheios Nobres Artesanais'],
    availableToppings: [
      { name: 'Cartão com Mensagem Caligráfica', price: 6.0 },
      { name: 'Fita de Veludo Terracota Presente', price: 10.0 }
    ]
  },
  {
    id: 'prod-6',
    name: 'Kit Celebração: Bentô Cake + 4 Cupcakes Rosas',
    categoryId: 'kits-festa',
    description: 'O presente perfeito pronto para encantar: mini bolo decorado com frase personalizada à mão na tampa, acompanhado de 4 cupcakes roseta e velinha.',
    basePrice: 125.0,
    image: kitPresente,
    images: [kitPresente, cupcakesBox],
    badge: 'novidade',
    rating: 4.9,
    reviewsCount: 52,
    prepTime: '12 horas',
    calories: '280 kcal / porção',
    weightEstimate: '1.0 kg',
    featured: true,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Kit Individual / Dupla', code: 'P', servings: 'Até 4 pessoas', weight: '1.0 kg', priceDelta: 0 },
      { id: 'm', name: 'Kit Família (Bolo 1kg + 8 Cupcakes)', code: 'M', servings: '8 a 10 pessoas', weight: '1.8 kg', priceDelta: 75.0 }
    ],
    availableFlavors: ['Massa Baunilha & Recheio Brigadeiro Ninho', 'Massa Cacau & Recheio Brigadeiro Belga'],
    availableFillings: ['Creme de Ninho Suave', 'Brigadeiro Gourmet Callebaut'],
    availableToppings: [
      { name: 'Escrita Personalizada no Bentô Cake', price: 0.0 },
      { name: 'Bexiga Metalizada de Aniversário', price: 16.0 },
      { name: 'Garrafinha de Espumante Baby (187ml)', price: 32.0 }
    ]
  },
  {
    id: 'prod-7',
    name: 'Bolo Velvet Rubro com Frutas Vermelhas & Rosas',
    categoryId: 'bolos-aniversario',
    description: 'Camadas aveludadas de massa vermelha com toque sutil de cacau, recheadas com autêntico frosting de cream cheese aerado e decoradas com pétalas comestíveis.',
    basePrice: 155.0,
    image: boloRedVelvet,
    images: [boloRedVelvet],
    badge: 'destaque',
    rating: 4.9,
    reviewsCount: 31,
    prepTime: '24 horas',
    calories: '310 kcal / fatia',
    weightEstimate: '1.4 kg',
    featured: false,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Tamanho P', code: 'P', servings: '10 fatias', weight: '1.2 kg', priceDelta: 0 },
      { id: 'm', name: 'Tamanho M', code: 'M', servings: '18 fatias', weight: '2.0 kg', priceDelta: 60.0 }
    ],
    availableFlavors: ['Red Velvet Tradicional com Cream Cheese'],
    availableFillings: ['Frosting de Cream Cheese Suave'],
    availableToppings: [
      { name: 'Morangos e Mirtilos Frescos Adicionais', price: 16.0 }
    ]
  },
  {
    id: 'prod-8',
    name: 'Brownies Fudgy com Nozes & Fio de Caramelo Salgado',
    categoryId: 'brownies-barras',
    description: 'Quadrados artesanais de puro chocolate meio amargo nobre, textura densa e úmida, finalizados com nozes crocantes e flor de sal.',
    basePrice: 48.0,
    promotionalPrice: 42.0,
    image: browniesBox,
    images: [browniesBox],
    badge: 'mais_vendido',
    rating: 4.8,
    reviewsCount: 45,
    prepTime: 'Pronta entrega',
    calories: '220 kcal / unid',
    weightEstimate: '450g',
    featured: false,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Caixa com 4 Brownies Grandes', code: 'P', servings: '4 porções', weight: '450g', priceDelta: 0 },
      { id: 'm', name: 'Caixa com 8 Brownies Grandes', code: 'M', servings: '8 porções', weight: '900g', priceDelta: 38.0 }
    ],
    availableFlavors: ['Caramelo Salgado e Nozes Pecan', 'Brigadeiro Belga Cremoso', 'Nutella Pura'],
    availableFillings: ['Recheio Cremoso na Casca'],
    availableToppings: [
      { name: 'Calda Extra de Brigadeiro', price: 12.0 }
    ]
  },
  {
    id: 'prod-9',
    name: 'Quarteto Cupcakes Roseta com Pérolas Douradas',
    categoryId: 'cupcakes',
    description: 'Massas fofas de baunilha de Madagascar recheadas com ganache e finalizadas com rosetas artesanais de buttercream suave.',
    basePrice: 46.0,
    image: cupcakesBox,
    images: [cupcakesBox],
    badge: 'artesanal',
    rating: 4.7,
    reviewsCount: 22,
    prepTime: 'Pronta entrega',
    calories: '180 kcal / unid',
    weightEstimate: '360g',
    featured: false,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Caixa com 4 unidades', code: 'P', servings: '4 unidades', weight: '360g', priceDelta: 0 },
      { id: 'm', name: 'Caixa com 8 unidades', code: 'M', servings: '8 unidades', weight: '720g', priceDelta: 40.0 }
    ],
    availableFlavors: ['Baunilha com Rosas Rosa e Dourado', 'Chocolate com Ninho'],
    availableFillings: ['Doce de Leite Caseiro', 'Brigadeiro Cremoso'],
    availableToppings: [
      { name: 'Topper em Mini Bandeirinhas', price: 8.0 }
    ]
  },
  {
    id: 'prod-10',
    name: 'Torta Banoffee Nobre com Doce de Leite & Chantilly',
    categoryId: 'tortas-finas',
    description: 'Base amanteigada crocante de biscoito, camadas fartas de doce de leite argentino, rodelas frescas de banana nanica e chantilly fresco com canela.',
    basePrice: 105.0,
    image: tortaBanoffee,
    images: [tortaBanoffee],
    badge: 'mais_vendido',
    rating: 5.0,
    reviewsCount: 73,
    prepTime: '12 horas',
    calories: '275 kcal / fatia',
    weightEstimate: '1.4 kg',
    featured: true,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Torta Média (22cm)', code: 'P', servings: '10 a 12 fatias', weight: '1.4 kg', priceDelta: 0 },
      { id: 'm', name: 'Torta Grande (28cm)', code: 'M', servings: '16 a 18 fatias', weight: '2.1 kg', priceDelta: 48.0 }
    ],
    availableFlavors: ['Banoffee Tradicional com Canela e Cacau'],
    availableFillings: ['Doce de Leite Cremoso em Ponto de Bico'],
    availableToppings: [
      { name: 'Extra Raspas de Chocolate Meio Amargo', price: 8.0 }
    ]
  },
  {
    id: 'prod-11',
    name: 'Bolo Caseiro de Fubá Cremoso com Goiabada Cascão',
    categoryId: 'bolos-caseiros',
    description: 'Receita tradicional caipira com milho e fubá fininho, queijo meia cura e pedaços derretidos de goiabada cascão do interior.',
    basePrice: 52.0,
    image: boloCenoura,
    images: [boloCenoura],
    badge: 'artesanal',
    rating: 4.8,
    reviewsCount: 29,
    prepTime: 'Pronta entrega',
    calories: '210 kcal / fatia',
    weightEstimate: '1.0 kg',
    featured: false,
    isAvailable: true,
    sizes: [
      { id: 'm', name: 'Tamanho Família (Padrão)', code: 'M', servings: '10 a 12 fatias', weight: '1.0 kg', priceDelta: 0 }
    ],
    availableFlavors: ['Fubá com Queijo e Goiabada'],
    availableFillings: ['Goiabada Derretida no Miolo'],
    availableToppings: [
      { name: 'Goiabada Cremosa Extra (120ml)', price: 10.0 }
    ]
  },
  {
    id: 'prod-12',
    name: 'Torta Mousse Três Chocolates Artesanal',
    categoryId: 'tortas-finas',
    description: 'Três camadas perfeitas de mousses aveludadas: chocolate meio amargo 70%, chocolate ao leite e chocolate branco sobre massa sablée de cacau.',
    basePrice: 120.0,
    image: heroBakery,
    images: [heroBakery],
    badge: 'destaque',
    rating: 4.9,
    reviewsCount: 34,
    prepTime: '24 horas',
    calories: '310 kcal / fatia',
    weightEstimate: '1.3 kg',
    featured: false,
    isAvailable: true,
    sizes: [
      { id: 's', name: 'Média (22cm)', code: 'P', servings: '10 fatias', weight: '1.3 kg', priceDelta: 0 },
      { id: 'm', name: 'Grande (28cm)', code: 'M', servings: '16 fatias', weight: '2.0 kg', priceDelta: 50.0 }
    ],
    availableFlavors: ['Três Chocolates Belgas Nobres'],
    availableFillings: ['Mousse Aerada com Cacau Puro'],
    availableToppings: [
      { name: 'Bombons Trufados na Decoração', price: 18.0 }
    ]
  }
];

export const INITIAL_DRIVERS: DeliveryDriver[] = [
  {
    id: 'driver-1',
    name: 'Carlos Alberto Silva',
    phone: '(19) 99124-8832',
    photo: avatarEntregador,
    rating: 4.95,
    status: 'em_rota',
    vehicle: 'Honda CG 160 Fan - Placa EFA-4921 (Bolsa Térmica de Bolos)',
    activeDeliveriesCount: 2,
    completedTodayCount: 8
  },
  {
    id: 'driver-2',
    name: 'Lucas Henrique Dias',
    phone: '(19) 98845-2190',
    photo: avatarEntregador,
    rating: 4.88,
    status: 'disponivel',
    vehicle: 'Yamaha Fazer 250 - Placa DKO-3819 (Suporte Rígido Nivelado)',
    activeDeliveriesCount: 0,
    completedTodayCount: 6
  },
  {
    id: 'driver-3',
    name: 'Rafael Mendes Rocha',
    phone: '(19) 99763-4411',
    photo: avatarEntregador,
    rating: 4.92,
    status: 'disponivel',
    vehicle: 'Fiat Fiorino Climatizada - Placa MBT-1024',
    activeDeliveriesCount: 0,
    completedTodayCount: 5
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'BEMVINDO10',
    description: '10% de desconto na primeira encomenda na Maitê Bolos',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 80.0,
    isActive: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'c-2',
    code: 'MAITE15',
    description: 'R$ 15,00 de desconto em pedidos acima de R$ 120,00',
    discountType: 'fixed',
    discountValue: 15.0,
    minOrderValue: 120.0,
    isActive: true,
    expiresAt: '2026-12-31'
  },
  {
    id: 'c-3',
    code: 'DOCEAFETO',
    description: '5% de desconto para celebrações familiares',
    discountType: 'percentage',
    discountValue: 5,
    minOrderValue: 50.0,
    isActive: true,
    expiresAt: '2026-12-31'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  name: 'Maitê Bolos e Doces',
  brandSlogan: 'Confeitaria Artesanal com Sabor de Afeto',
  instagram: '@_maitebolos',
  whatsapp: '(19) 98265-4053',
  phone: '(19) 98265-4053',
  address: 'Rua Entusiasmo, 253',
  neighborhood: 'Jardim Ipiranga',
  city: 'Americana',
  state: 'SP',
  zipCode: '13477-678',
  openingHours: 'Terça a Sábado: 09h às 18h | Domingo: 09h às 13h',
  defaultDeliveryFee: 12.0,
  freeDeliveryThreshold: 200.0,
  minimumOrderValue: 40.0,
  minimumNoticeHours: 24,
  pixKey: '982654053',
  pixKeyType: 'Telefone Celular',
  enablePix: true,
  enableCardOnDelivery: true,
  enableCash: true,
  enableCardOnPickup: true,
  allowPickup: true,
  allowDelivery: true
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1042',
    orderNumber: '#MB-1042',
    createdAt: 'Hoje, às 10:15',
    customer: {
      name: 'Mariana Guimarães',
      phone: '(19) 99245-1102',
      email: 'mariana.guimaraes@gmail.com'
    },
    deliveryType: 'delivery',
    address: {
      street: 'Av. Brasil',
      number: '1420',
      neighborhood: 'Jardim Santo Antônio',
      city: 'Americana',
      state: 'SP',
      zipCode: '13465-000',
      complement: 'Apt 42 Torre Sol'
    },
    scheduledDate: 'Hoje',
    scheduledTimeSlot: '14:30 - 15:30',
    paymentMethod: 'pix',
    paymentStatus: 'aprovado',
    items: [
      {
        cartItemId: 'item-1',
        productId: 'prod-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedSize: INITIAL_PRODUCTS[0].sizes[0],
        selectedFlavor: 'Baunilha com Frutas Vermelhas',
        selectedFilling: 'Trufa Branca & Frutas Silvestres',
        selectedToppings: [{ name: 'Topper "Parabéns" em Dourado', price: 15.0 }],
        customerNotes: 'Por favor, escrever "Parabéns Helena" no cartãozinho.',
        unitPrice: 163.0,
        totalPrice: 163.0
      }
    ],
    subtotal: 163.0,
    deliveryFee: 12.0,
    discount: 10.0,
    total: 165.0,
    couponCode: 'BEMVINDO10',
    status: 'saiu_para_entrega',
    assignedDriverId: 'driver-1',
    driverNotes: 'Bolo na caixa térmica especial nivelada. Tocar interfone 42.'
  },
  {
    id: 'ord-1041',
    orderNumber: '#MB-1041',
    createdAt: 'Hoje, às 09:30',
    customer: {
      name: 'Felipe Siqueira Mendes',
      phone: '(19) 98711-3940'
    },
    deliveryType: 'delivery',
    address: {
      street: 'Rua das Palmeiras',
      number: '310',
      neighborhood: 'Vila Jones',
      city: 'Americana',
      state: 'SP',
      zipCode: '13466-210'
    },
    scheduledDate: 'Hoje',
    scheduledTimeSlot: '15:00 - 16:00',
    paymentMethod: 'cartao_entrega',
    paymentStatus: 'na_entrega',
    items: [
      {
        cartItemId: 'item-2',
        productId: 'prod-2',
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedSize: INITIAL_PRODUCTS[1].sizes[1],
        selectedFlavor: '100% Chocolate Belga',
        selectedFilling: 'Brigadeiro Gourmet Intenso',
        selectedToppings: [{ name: 'Brigadeiros Extras no Topo (6 un)', price: 20.0 }],
        customerNotes: 'Levar maquininha de cartão de crédito.',
        unitPrice: 265.0,
        totalPrice: 265.0
      }
    ],
    subtotal: 265.0,
    deliveryFee: 12.0,
    discount: 0,
    total: 277.0,
    status: 'em_preparo',
    assignedDriverId: 'driver-1'
  },
  {
    id: 'ord-1040',
    orderNumber: '#MB-1040',
    createdAt: 'Hoje, às 08:45',
    customer: {
      name: 'Beatriz Fonseca de Melo',
      phone: '(19) 99632-8419'
    },
    deliveryType: 'retirada',
    scheduledDate: 'Hoje',
    scheduledTimeSlot: '16:00 (Retirada no Ateliê)',
    paymentMethod: 'pix',
    paymentStatus: 'aprovado',
    items: [
      {
        cartItemId: 'item-3',
        productId: 'prod-5',
        product: INITIAL_PRODUCTS[4],
        quantity: 2,
        selectedSize: INITIAL_PRODUCTS[4].sizes[0],
        selectedFlavor: 'Sortidos (Belga, Pistache, Ninho, Churros)',
        selectedToppings: [{ name: 'Fita de Veludo Terracota Presente', price: 10.0 }],
        unitPrice: 64.0,
        totalPrice: 128.0
      }
    ],
    subtotal: 128.0,
    deliveryFee: 0,
    discount: 12.8,
    total: 115.2,
    couponCode: 'BEMVINDO10',
    status: 'pronto'
  },
  {
    id: 'ord-1039',
    orderNumber: '#MB-1039',
    createdAt: 'Hoje, às 08:10',
    customer: {
      name: 'Thiago Nogueira Alves',
      phone: '(19) 98112-7001'
    },
    deliveryType: 'delivery',
    address: {
      street: 'Rua Fortunato Faraone',
      number: '550',
      neighborhood: 'Jardim Girassol',
      city: 'Americana',
      state: 'SP',
      zipCode: '13465-660'
    },
    scheduledDate: 'Hoje',
    scheduledTimeSlot: '16:30 - 17:30',
    paymentMethod: 'pix',
    paymentStatus: 'aprovado',
    items: [
      {
        cartItemId: 'item-4',
        productId: 'prod-6',
        product: INITIAL_PRODUCTS[5],
        quantity: 1,
        selectedSize: INITIAL_PRODUCTS[5].sizes[0],
        selectedFlavor: 'Massa Baunilha & Recheio Brigadeiro Ninho',
        selectedToppings: [],
        customerNotes: 'Frase no Bentô Cake: "Você é o nosso doce favorito!"',
        unitPrice: 125.0,
        totalPrice: 125.0
      }
    ],
    subtotal: 125.0,
    deliveryFee: 12.0,
    discount: 15.0,
    total: 122.0,
    couponCode: 'MAITE15',
    status: 'recebido'
  },
  {
    id: 'ord-1038',
    orderNumber: '#MB-1038',
    createdAt: 'Ontem, às 16:20',
    customer: {
      name: 'Venda de Balcão (Presencial)',
      phone: '(19) 98265-4053'
    },
    deliveryType: 'retirada',
    scheduledDate: 'Ontem',
    scheduledTimeSlot: 'Retirada Imediata',
    paymentMethod: 'dinheiro',
    paymentStatus: 'aprovado',
    items: [
      {
        cartItemId: 'item-5',
        productId: 'prod-3',
        product: INITIAL_PRODUCTS[2],
        quantity: 1,
        selectedSize: INITIAL_PRODUCTS[2].sizes[0],
        selectedFlavor: 'Tradicional',
        selectedToppings: [],
        unitPrice: 59.0,
        totalPrice: 59.0
      }
    ],
    subtotal: 59.0,
    deliveryFee: 0,
    discount: 0,
    total: 59.0,
    status: 'entregue',
    isPosSale: true
  },
  {
    id: 'ord-1037',
    orderNumber: '#MB-1037',
    createdAt: 'Ontem, às 14:00',
    customer: {
      name: 'Juliana Paes Rodrigues',
      phone: '(19) 99318-6211'
    },
    deliveryType: 'delivery',
    address: {
      street: 'Rua das Rosas',
      number: '88',
      neighborhood: 'Jardim São Pedro',
      city: 'Americana',
      state: 'SP',
      zipCode: '13466-400'
    },
    scheduledDate: 'Ontem',
    scheduledTimeSlot: '17:00 - 18:00',
    paymentMethod: 'pix',
    paymentStatus: 'aprovado',
    items: [
      {
        cartItemId: 'item-6',
        productId: 'prod-4',
        product: INITIAL_PRODUCTS[3],
        quantity: 1,
        selectedSize: INITIAL_PRODUCTS[3].sizes[0],
        selectedFlavor: 'Limão Siciliano',
        selectedToppings: [],
        unitPrice: 110.0,
        totalPrice: 110.0
      }
    ],
    subtotal: 110.0,
    deliveryFee: 12.0,
    discount: 0,
    total: 122.0,
    status: 'entregue',
    assignedDriverId: 'driver-1'
  }
];
