import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { STORE_LOGO_URL } from '../../data/initialData';
import {
  ChefHat,
  Clock,
  CheckCircle2,
  PackageCheck,
  Bike,
  Sparkles,
  Flame,
  Bell,
  Volume2,
  Calendar,
  AlertCircle,
  ArrowRight,
  Check
} from 'lucide-react';

export const ConfectionerView: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    assignDriverToOrder,
    drivers,
    settings
  } = useStore();

  const [chefStatus, setChefStatus] = useState<'produzindo' | 'pausa'>('produzindo');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationNotice, setNotificationNotice] = useState<string | null>(null);

  // Filter orders by production stages
  const newOrders = orders.filter(o => o.status === 'recebido');
  const inPrepOrders = orders.filter(o => o.status === 'em_preparo');
  const readyOrders = orders.filter(o => o.status === 'pronto');

  const triggerChime = (text: string) => {
    setNotificationNotice(text);
    setTimeout(() => setNotificationNotice(null), 3500);
  };

  const handleAcceptOrder = (orderId: string, orderNumber: string) => {
    updateOrderStatus(orderId, 'em_preparo', 'Chef Maitê iniciou o preparo dos ingredientes e massa artesanal.');
    triggerChime(`Pedido ${orderNumber} aceito! Status atualizado para "Em Preparo no Ateliê".`);
  };

  const handleFinishPreparation = (orderId: string, orderNumber: string) => {
    updateOrderStatus(orderId, 'pronto', 'Bolo finalizado e embalado em caixa nivelada.');
    triggerChime(`Pedido ${orderNumber} finalizado e embalado na caixa protetora!`);
  };

  const handleDispatchDriver = (orderId: string, orderNumber: string) => {
    const availableDriver = drivers.find(d => d.status === 'disponivel') || drivers[0];
    assignDriverToOrder(orderId, availableDriver.id);
    triggerChime(`Pedido ${orderNumber} despachado! ${availableDriver.name} assumiu a rota de entrega.`);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-20">
      {/* Top Bar for Confectioner App */}
      <div className="bg-[#2D2118] text-white p-3.5 sm:p-4 sticky top-[42px] sm:top-[44px] z-30 shadow-md">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={STORE_LOGO_URL}
                alt="Chef Confeiteira Maitê"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7243]"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#2D2118]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7243] block">
                Cozinha & Produção Automatizada
              </span>
              <h2 className="font-bold text-sm text-white">
                Chef Maitê · Confeitaria
              </h2>
              <span className="text-[11px] text-[#A1A1AA]">
                Americana, SP · Forno & Decoração
              </span>
            </div>
          </div>

          {/* Sound & Status toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Som ativado' : 'Som silenciado'}
              className={`p-2 rounded-xl transition-colors ${
                soundEnabled ? 'bg-[#FF7243] text-white' : 'bg-white/10 text-white/50'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => setChefStatus(chefStatus === 'produzindo' ? 'pausa' : 'produzindo')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                chefStatus === 'produzindo'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              {chefStatus === 'produzindo' ? 'Em Produção' : 'Pausa'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Real-time automated chime banner */}
        {notificationNotice && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-950 p-3.5 rounded-2xl text-xs flex items-center gap-2 shadow-sm animate-in fade-in duration-200">
            <Bell className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
            <span className="font-medium">{notificationNotice}</span>
          </div>
        )}

        {/* 3 Kanban Counter Badges */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white rounded-2xl p-3 border border-[#EDE2D6] shadow-xs">
            <span className="text-[10px] font-bold text-[#FF7243] uppercase block">
              Novos
            </span>
            <span className="text-xl font-extrabold text-[#18181B] tabular-nums">
              {newOrders.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-[#EDE2D6] shadow-xs">
            <span className="text-[10px] font-bold text-amber-600 uppercase block">
              No Forno
            </span>
            <span className="text-xl font-extrabold text-[#18181B] tabular-nums">
              {inPrepOrders.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl p-3 border border-[#EDE2D6] shadow-xs">
            <span className="text-[10px] font-bold text-purple-600 uppercase block">
              Embalados
            </span>
            <span className="text-xl font-extrabold text-[#18181B] tabular-nums">
              {readyOrders.length}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: NOVOS PEDIDOS (CONVITES DE PRODUÇÃO) */}
        {/* ========================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#18181B] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF7243] animate-pulse" />
              <span>Novos Pedidos para Produzir ({newOrders.length})</span>
            </h3>
            <span className="text-[11px] text-[#71717A]">Fila automática</span>
          </div>

          {newOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center border border-[#F4F4F5] text-xs text-[#A1A1AA]">
              Nenhum novo pedido na fila no momento.
            </div>
          ) : (
            newOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-4 border-2 border-[#FFD7C9] shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#18181B]">
                    {order.orderNumber}
                  </span>
                  <span className="text-[11px] font-bold bg-[#FFF3EC] text-[#FF7243] px-2.5 py-0.5 rounded-full">
                    Previsão: {order.scheduledDate} ({order.scheduledTimeSlot})
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#71717A]">
                    <span>Cliente: <strong>{order.customer.name}</strong></span>
                    <span>{order.customer.phone}</span>
                  </div>

                  {/* Cake Items */}
                  <div className="bg-[#FAF7F2] p-2.5 rounded-2xl border border-[#EDE2D6] space-y-1.5">
                    {order.items.map(it => (
                      <div key={it.cartItemId} className="flex gap-2">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <strong className="block text-[#18181B] truncate">{it.quantity}x {it.product.name}</strong>
                          <span className="text-[11px] text-[#71717A] block">
                            Tamanho: {it.selectedSize.code} ({it.selectedSize.servings}) · Sabor: {it.selectedFlavor}
                          </span>
                          {it.customerNotes && (
                            <span className="text-[10px] text-[#C85A32] font-semibold block italic mt-0.5">
                              Dedicatória: "{it.customerNotes}"
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automated Accept CTA */}
                <button
                  type="button"
                  onClick={() => handleAcceptOrder(order.id, order.orderNumber)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#FF7243] hover:bg-[#E85D30] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95"
                >
                  <Flame className="w-4 h-4 fill-white" />
                  <span>Aceitar & Iniciar Preparo na Cozinha</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: EM PREPARO / FORNO & MONTAGEM */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#18181B] flex items-center gap-1.5">
              <ChefHat className="w-4 h-4 text-amber-600" />
              <span>Em Produção no Ateliê ({inPrepOrders.length})</span>
            </h3>
            <span className="text-[11px] text-[#71717A]">Timer ativo</span>
          </div>

          {inPrepOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center border border-[#F4F4F5] text-xs text-[#A1A1AA]">
              Nenhum bolo sendo confeitado no momento.
            </div>
          ) : (
            inPrepOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-4 border border-[#FDE68A] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-[#18181B] block">
                      {order.orderNumber} · {order.customer.name}
                    </span>
                    <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Em forno e montagem
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#FF7243] bg-orange-50 px-2 py-0.5 rounded-full">
                    {order.deliveryType === 'delivery' ? 'Delivery' : 'Retirada'}
                  </span>
                </div>

                {/* Recipe details */}
                <div className="text-xs text-[#5D473A] space-y-1">
                  {order.items.map(it => (
                    <div key={it.cartItemId} className="p-2 bg-[#FFFDF9] rounded-xl border border-[#F4EBE2]">
                      <span className="font-bold text-[#18181B]">{it.product.name}</span>
                      <span className="text-[11px] block text-[#71717A]">
                        {it.selectedSize.name} · Massa: {it.selectedFlavor}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Finish Preparation CTA */}
                <button
                  type="button"
                  onClick={() => handleFinishPreparation(order.id, order.orderNumber)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>Concluir Decoração & Embalar na Caixa</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: PRONTOS / DESPACHO DE ENTREGA */}
        {/* ========================================================= */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#18181B] flex items-center gap-1.5">
              <PackageCheck className="w-4 h-4 text-purple-600" />
              <span>Prontos para Expedição ({readyOrders.length})</span>
            </h3>
            <span className="text-[11px] text-[#71717A]">Embalados</span>
          </div>

          {readyOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-4 text-center border border-[#F4F4F5] text-xs text-[#A1A1AA]">
              Nenhum bolo aguardando despacho no momento.
            </div>
          ) : (
            readyOrders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-4 border border-[#DDD6FE] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-sm text-[#18181B] block">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-[#71717A]">
                      {order.deliveryType === 'delivery' ? `Para entrega em ${order.address?.neighborhood || 'Americana'}` : 'Cliente vem retirar no ateliê'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                    Embalado
                  </span>
                </div>

                {order.deliveryType === 'delivery' ? (
                  <button
                    type="button"
                    onClick={() => handleDispatchDriver(order.id, order.orderNumber)}
                    className="w-full py-2.5 px-4 rounded-2xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Bike className="w-4 h-4 text-[#FF7243]" />
                    <span>Chamar Entregador Automatizado</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateOrderStatus(order.id, 'entregue', 'Cliente retirou o pedido no balcão.')}
                    className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirmar Retirada pelo Cliente</span>
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
