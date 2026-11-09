import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DRIVER_AVATAR_URL, STORE_LOGO_URL } from '../../data/initialData';
import {
  Bike,
  MapPin,
  Phone,
  MessageCircle,
  Navigation,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Package,
  ArrowRight,
  ChevronRight,
  Check
} from 'lucide-react';

export const DriverView: React.FC = () => {
  const {
    drivers,
    orders,
    updateOrderStatus,
    updateDriverStatus,
    settings
  } = useStore();

  const driver = drivers[0]; // Carlos Alberto Silva
  const [selectedDriverId, setSelectedDriverId] = useState(driver.id);

  const activeDriver = drivers.find(d => d.id === selectedDriverId) || driver;

  // Assigned deliveries for this driver
  const assignedOrders = orders.filter(
    o => o.assignedDriverId === activeDriver.id && o.status !== 'entregue' && o.status !== 'cancelado'
  );

  const completedTodayOrders = orders.filter(
    o => o.assignedDriverId === activeDriver.id && o.status === 'entregue'
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-16">
      {/* Mobile Top Header */}
      <div className="bg-[#2D2118] text-white p-3.5 sm:p-4 sticky top-[42px] sm:top-[44px] z-30 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={activeDriver.photo}
              alt={activeDriver.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-white/80"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E07A5F] block">
                App do Entregador · Maitê Bolos
              </span>
              <h2 className="font-bold text-sm leading-tight text-white">
                {activeDriver.name}
              </h2>
              <span className="text-[11px] text-[#B8A394]">
                ★ {activeDriver.rating.toFixed(2)} · {activeDriver.vehicle.split('-')[0]}
              </span>
            </div>
          </div>

          {/* Status Toggle Button */}
          <button
            onClick={() => {
              const nextStatus =
                activeDriver.status === 'disponivel'
                  ? 'em_rota'
                  : activeDriver.status === 'em_rota'
                  ? 'indisponivel'
                  : 'disponivel';
              updateDriverStatus(activeDriver.id, nextStatus);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              activeDriver.status === 'em_rota'
                ? 'bg-[#E07A5F] text-white'
                : activeDriver.status === 'disponivel'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-700 text-slate-300'
            }`}
          >
            {activeDriver.status === 'em_rota'
              ? 'Em Rota'
              : activeDriver.status === 'disponivel'
              ? 'Disponível'
              : 'Indisponível'}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Notice of simulated GPS */}
        <div className="bg-[#FAF3EC] border border-[#FAD8C7] rounded-2xl p-3 text-xs text-[#5D473A] flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Demonstração do Aplicativo de Entrega:</strong> Rotas simuladas em Americana, SP. A telemetria real com GPS e transmissão em tempo real será integrada na fase backend.
          </p>
        </div>

        {/* Courier Selector (For reviewer testing multiple drivers) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="text-xs text-[#7A6455] whitespace-nowrap">Trocar Motorista:</span>
          {drivers.map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDriverId(d.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDriverId === d.id
                  ? 'bg-[#2D2118] text-white font-bold'
                  : 'bg-white text-[#5D473A] border border-[#E5D7CA]'
              }`}
            >
              {d.name.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#EDE2D6] shadow-xs text-center">
            <span className="text-[11px] text-[#7A6455] block">Entregas em Rota</span>
            <span className="font-serif text-2xl font-bold text-[#C85A32] tabular-nums">
              {assignedOrders.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3.5 border border-[#EDE2D6] shadow-xs text-center">
            <span className="text-[11px] text-[#7A6455] block">Concluídas Hoje</span>
            <span className="font-serif text-2xl font-bold text-emerald-700 tabular-nums">
              {completedTodayOrders.length + activeDriver.completedTodayCount}
            </span>
          </div>
        </div>

        {/* Deliveries List */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-[#2D2118]">
            Entregas Atribuídas ({assignedOrders.length})
          </h3>

          {assignedOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-[#EDE2D6] space-y-2">
              <Package className="w-8 h-8 text-[#A89282] mx-auto" />
              <p className="font-serif font-bold text-sm text-[#2D2118]">
                Nenhuma entrega pendente no momento!
              </p>
              <p className="text-xs text-[#8C7667]">
                Quando a confeiteira despachar um novo pedido no painel de administração, ele aparecerá aqui automaticamente.
              </p>
            </div>
          ) : (
            assignedOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border border-[#EDE2D6] shadow-sm space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#F0E6DC] pb-3">
                  <div>
                    <span className="font-bold text-sm text-[#2D2118] block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#7A6455]">
                      Previsão: {order.scheduledDate} ({order.scheduledTimeSlot})
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'saiu_para_entrega'
                        ? 'bg-orange-100 text-orange-900 animate-pulse'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {order.status === 'saiu_para_entrega' ? 'Em Rota' : order.status}
                  </span>
                </div>

                {/* Customer Details & Actions */}
                <div className="space-y-2 text-xs text-[#5D473A]">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="block text-sm text-[#2D2118]">{order.customer.name}</strong>
                      <span className="text-[11px] text-[#7A6455]">{order.customer.phone}</span>
                    </div>

                    <div className="flex gap-1.5">
                      <a
                        href={`tel:${order.customer.phone.replace(/\D/g, '')}`}
                        className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs"
                        title="Ligar para o cliente"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/55${order.customer.phone.replace(/\D/g, '')}?text=Olá,%20sou%20o%20entregador%20da%20Maitê%20Bolos%20e%20estou%20a%20caminho%20do%20seu%20endereço!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-xs"
                        title="Mensagem no WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Destination Address in Americana */}
                  <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EDE2D6] space-y-1">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#2D2118] block">Endereço de Entrega:</strong>
                        <span>
                          {order.address?.street}, {order.address?.number}
                          {order.address?.complement ? ` (${order.address?.complement})` : ''}
                        </span>
                        <span className="block text-[#8C7667]">
                          {order.address?.neighborhood} · Americana - SP
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Driver Instructions / Cuidado com Bolos */}
                  <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-[11px] text-amber-900 space-y-0.5">
                    <span className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-700" />
                      Recomendação de Transporte:
                    </span>
                    <span>
                      {order.driverNotes || 'Manter a caixa nivelada no suporte térmico. Evitar freadas bruscas.'}
                    </span>
                  </div>

                  {/* Payment Info */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#F0E6DC]">
                    <div>
                      <span className="text-[11px] text-[#7A6455] block">Forma de Cobrança:</span>
                      <strong className="text-xs text-[#2D2118] uppercase">
                        {order.paymentMethod.replace('_', ' ')}
                      </strong>
                      {order.changeFor && (
                        <span className="block text-[10px] text-[#C85A32]">
                          Levar troco para R$ {order.changeFor.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[#7A6455] block">Valor do Pedido:</span>
                      <span className="font-bold text-base text-[#C85A32] tabular-nums">
                        R$ {order.total.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delivery Action Stepper Buttons */}
                <div className="pt-2 border-t border-[#F0E6DC] space-y-2">
                  {order.status !== 'saiu_para_entrega' ? (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'saiu_para_entrega')}
                      className="w-full py-3 px-4 rounded-2xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                    >
                      <Navigation className="w-4 h-4 rotate-45" />
                      <span>Iniciar Rota de Entrega</span>
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          alert(`Notificação simulada enviada ao cliente: "O entregador chegou em frente ao seu endereço!"`);
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#EDE2D6] text-[#2D2118] font-semibold text-xs border border-[#E5D7CA] flex items-center justify-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                        <span>Cheguei no Endereço (Avisar Cliente)</span>
                      </button>

                      <button
                        onClick={() => updateOrderStatus(order.id, 'entregue')}
                        className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirmar Entrega Concluída</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
