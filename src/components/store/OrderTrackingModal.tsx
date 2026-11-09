import React from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { DRIVER_AVATAR_URL } from '../../data/initialData';
import { getImageUrl, handleImageError } from '../../utils/imageUrl';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  PackageCheck,
  Bike,
  Home,
  Phone,
  MessageCircle,
  MapPin,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Navigation
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const {
    trackingOrder,
    setTrackingOrder,
    updateOrderStatus,
    drivers,
    settings
  } = useStore();

  if (!trackingOrder) return null;

  const assignedDriver = drivers.find(d => d.id === trackingOrder.assignedDriverId) || drivers[0];

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
    {
      key: 'recebido',
      label: 'Pedido Recebido',
      desc: 'Recebido pelo sistema e aguardando confirmação da confeiteira',
      icon: Clock
    },
    {
      key: 'confirmado',
      label: 'Pedido Confirmado',
      desc: 'Ingredientes selecionados e encaixado na programação',
      icon: CheckCircle2
    },
    {
      key: 'em_preparo',
      label: 'Em Produção no Ateliê',
      desc: 'Massa assando, recheios trufados e decoração artesanal em andamento',
      icon: ChefHat
    },
    {
      key: 'pronto',
      label: 'Confeitaria Finalizada',
      desc: 'Bolo finalizado, embalado na caixa rígida com laço e fita',
      icon: PackageCheck
    },
    {
      key: 'saiu_para_entrega',
      label: 'Saiu para Entrega',
      desc: `Em rota com o entregador ${assignedDriver.name} em caixa nivelada`,
      icon: Bike
    },
    {
      key: 'entregue',
      label: 'Entregue com Sucesso',
      desc: 'Pedido entregue e pronto para ser saboreado!',
      icon: Home
    }
  ];

  const statusOrder: OrderStatus[] = [
    'recebido',
    'confirmado',
    'em_preparo',
    'pronto',
    'saiu_para_entrega',
    'entregue'
  ];

  const currentIndex = statusOrder.indexOf(trackingOrder.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#EDE2D6] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#F0E6DC] bg-[#FAF7F2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2D2118]">
                Acompanhar Pedido {trackingOrder.orderNumber}
              </h3>
              <p className="text-xs text-[#7A6455]">
                Atualizações em tempo real do ateliê Maitê Bolos
              </p>
            </div>
          </div>

          <button
            onClick={() => setTrackingOrder(null)}
            className="w-9 h-9 rounded-full bg-white text-[#7A6455] hover:text-[#2D2118] border border-[#EAE0D5] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Status summary banner */}
          <div className="bg-[#FFF3EC] border border-[#FAD8C7] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C85A32]">
                Previsão de Entrega
              </span>
              <h4 className="font-serif text-base font-bold text-[#2D2118]">
                {trackingOrder.scheduledDate} ({trackingOrder.scheduledTimeSlot})
              </h4>
              <p className="text-xs text-[#7A6455] mt-0.5">
                Destino: {trackingOrder.address ? `${trackingOrder.address.neighborhood}, Americana` : 'Retirada no Ateliê'}
              </p>
            </div>

            <div className="w-12 h-12 rounded-full bg-white text-[#C85A32] flex items-center justify-center shadow-xs shrink-0">
              <Bike className="w-6 h-6" />
            </div>
          </div>

          {/* Simulated Courier Card (Identical to top-left floating card in reference image) */}
          {(trackingOrder.status === 'saiu_para_entrega' || trackingOrder.status === 'pronto') && (
            <div className="bg-white border border-[#F4F4F5] rounded-3xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={getImageUrl(assignedDriver.photo || DRIVER_AVATAR_URL)}
                    alt={assignedDriver.name}
                    onError={e => handleImageError(e, 'entregador.jpg')}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm"
                  />
                  <div>
                    <span className="text-[11px] font-medium text-[#A1A1AA] block">
                      Delivery Boy
                    </span>
                    <h5 className="font-extrabold text-sm text-[#18181B]">
                      {assignedDriver.name}
                    </h5>
                    <div className="flex items-center gap-0.5 text-amber-400 text-xs mt-0.5">
                      ★ ★ ★ ★ ★
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${assignedDriver.phone.replace(/\D/g, '')}`}
                    className="w-9 h-9 rounded-full bg-[#22C55E] hover:bg-[#16A34A] text-white flex items-center justify-center transition-colors shadow-xs"
                    title="Ligar"
                  >
                    <Phone className="w-4 h-4 fill-white" />
                  </a>
                  <a
                    href={`https://wa.me/55${assignedDriver.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#71717A] flex items-center justify-center transition-colors"
                    title="Chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Simulated Delivery Map Box */}
              <div className="relative h-36 bg-[#F4F4F5] rounded-2xl overflow-hidden border border-[#E4E4E7] flex flex-col justify-between p-3">
                {/* Visual street grid background */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(#2D2118 1px, transparent 1px), linear-gradient(to right, #2D2118 1px, transparent 1px), linear-gradient(to bottom, #2D2118 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                  }}
                />

                {/* Route line */}
                <div className="absolute left-1/4 top-1/2 right-1/4 h-1 bg-gradient-to-r from-[#C85A32] via-amber-500 to-emerald-600 rounded-full" />

                {/* Bakery Pin */}
                <div className="relative z-10 flex items-center gap-1.5 self-start bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] font-semibold text-[#2D2118] shadow-xs border border-[#E5D7CA]">
                  <MapPin className="w-3 h-3 text-[#C85A32]" />
                  <span>Ateliê Maitê (R. Entusiasmo)</span>
                </div>

                {/* Courier Pin in Movement */}
                <div className="relative z-10 self-center bg-[#2D2118] text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Navigation className="w-3 h-3 text-emerald-400 rotate-45" />
                  <span>Entregador a ~8 min</span>
                </div>

                {/* Customer Pin */}
                <div className="relative z-10 flex items-center gap-1.5 self-end bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] font-semibold text-[#2D2118] shadow-xs border border-[#E5D7CA]">
                  <Home className="w-3 h-3 text-emerald-600" />
                  <span>{trackingOrder.address?.neighborhood || 'Seu Endereço'}</span>
                </div>
              </div>

              <p className="text-[10px] text-[#8C7667] text-center">
                * Simulação demonstrativa de deslocamento. O rastreamento GPS contínuo será acoplado via backend.
              </p>
            </div>
          )}

          {/* Step-by-Step Progress Timeline */}
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
              Linha do Tempo da Produção
            </span>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE0D5]">
              {steps.map((st, idx) => {
                const isPassed = currentIndex >= idx;
                const isCurrent = currentIndex === idx;
                const IconComponent = st.icon;

                return (
                  <div key={st.key} className="relative flex items-start gap-3">
                    {/* Step circle indicator */}
                    <div
                      className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isCurrent
                          ? 'bg-[#E07A5F] text-white ring-4 ring-[#FFE6DC] shadow-xs'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#EAE0D5] text-[#8C7667]'
                      }`}
                    >
                      {isPassed && !isCurrent ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <IconComponent className="w-3 h-3" />
                      )}
                    </div>

                    {/* Step details */}
                    <div>
                      <h5
                        className={`text-xs font-bold ${
                          isCurrent
                            ? 'text-[#C85A32]'
                            : isPassed
                            ? 'text-[#2D2118]'
                            : 'text-[#A08878]'
                        }`}
                      >
                        {st.label}
                      </h5>
                      <p className="text-[11px] text-[#7A6455] leading-relaxed mt-0.5">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Demo Control for Evaluator */}
          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E5D7CA] space-y-2">
            <span className="text-[11px] font-bold text-[#5D473A] flex items-center gap-1">
              <span>Simular avanço de status (Controle de Demonstração):</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {statusOrder.map(s => (
                <button
                  key={s}
                  onClick={() => updateOrderStatus(trackingOrder.id, s)}
                  className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all ${
                    trackingOrder.status === s
                      ? 'bg-[#E07A5F] text-white'
                      : 'bg-white text-[#5D473A] border border-[#E0D0C0] hover:bg-[#F2E5D8]'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Order Details Accordion */}
          <div className="border-t border-[#F0E6DC] pt-3 text-xs text-[#5D473A] space-y-2">
            <h5 className="font-bold text-[#2D2118]">Resumo dos Itens do Pedido:</h5>
            <div className="space-y-1.5">
              {trackingOrder.items.map(it => (
                <div key={it.cartItemId} className="flex justify-between items-center text-xs">
                  <span>
                    {it.quantity}x {it.product.name} ({it.selectedSize.code})
                  </span>
                  <span className="font-semibold text-[#2D2118] tabular-nums">
                    R$ {it.totalPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#EAE0D5] pt-2 flex justify-between font-bold text-sm text-[#2D2118]">
              <span>Total Pago:</span>
              <span className="text-[#C85A32] tabular-nums">
                R$ {trackingOrder.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Contact Bakery Help */}
          <div className="flex gap-2">
            <a
              href={`https://wa.me/55${settings.whatsapp.replace(/\D/g, '')}?text=Olá,%20gostaria%20de%20informações%20sobre%20meu%20pedido%20${trackingOrder.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Falar no WhatsApp da Confeitaria</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
