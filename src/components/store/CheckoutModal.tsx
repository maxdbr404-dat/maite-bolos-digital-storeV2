import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { DeliveryType, PaymentMethod, DeliveryAddress } from '../../types';
import {
  X,
  ArrowLeft,
  CheckCircle2,
  QrCode,
  CreditCard,
  Banknote,
  Truck,
  Store,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    createOrder,
    settings
  } = useStore();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('delivery');

  // Address
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [complement, setComplement] = useState('');

  // Schedule
  const [scheduledDate, setScheduledDate] = useState('Hoje');
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('15:00 às 16:30');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [needChange, setNeedChange] = useState<boolean>(false);
  const [changeFor, setChangeFor] = useState<string>('');

  // Pix demo copy state
  const [copiedPix, setCopiedPix] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const effectiveDeliveryFee = deliveryType === 'retirada' ? 0 : cartDeliveryFee;
  const effectiveTotal = Math.max(0, cartSubtotal - cartDiscount + effectiveDeliveryFee);

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(
      '00020126580014BR.GOV.BCB.PIX0136maitebolos.americana.demonstracao@pix520400005303986540' +
      effectiveTotal.toFixed(2) +
      '5802BR5920MAITE BOLOS E DOCES6009AMERICANA62070503***6304ABCD'
    );
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Por favor, informe seu nome completo.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Por favor, informe seu número de WhatsApp.');
      return;
    }
    if (deliveryType === 'delivery') {
      if (!street.trim() || !number.trim() || !neighborhood.trim()) {
        setFormError('Por favor, preencha o endereço de entrega completo em Americana.');
        return;
      }
    }

    const orderAddress: DeliveryAddress | undefined =
      deliveryType === 'delivery'
        ? {
            street: street.trim(),
            number: number.trim(),
            neighborhood: neighborhood.trim(),
            complement: complement.trim(),
            city: 'Americana',
            state: 'SP',
            zipCode: '13477-000'
          }
        : undefined;

    const newOrder = createOrder({
      customer: { name: name.trim(), phone: phone.trim() },
      deliveryType,
      address: orderAddress,
      scheduledDate,
      scheduledTimeSlot,
      paymentMethod,
      subtotal: cartSubtotal,
      deliveryFee: effectiveDeliveryFee,
      discount: cartDiscount,
      total: effectiveTotal,
      changeFor: needChange ? parseFloat(changeFor) || undefined : undefined
    });

    setCreatedOrderNumber(newOrder.orderNumber);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#EDE2D6] animate-in fade-in zoom-in-95 duration-200">
        {step === 'form' ? (
          <form onSubmit={handleSubmitOrder}>
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#F0E6DC] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2D2118]">
                  Finalizar Encomenda
                </h3>
                <p className="text-xs text-[#7A6455]">
                  Confirme seus dados e escolha como receber
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-9 h-9 rounded-full bg-white text-[#7A6455] hover:text-[#2D2118] border border-[#EAE0D5] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 max-h-[75vh] overflow-y-auto space-y-5">
              {/* Error banner */}
              {formError && (
                <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. Customer Info */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  1. Seus Dados
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#4A382A] mb-1">
                      Seu Nome:
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="Ex: Ana Clara Silva"
                      className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A382A] mb-1">
                      WhatsApp / Celular:
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value);
                        setFormError(null);
                      }}
                      placeholder="(19) 99999-0000"
                      className="w-full bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32] focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery vs Pickup Toggle */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  2. Como Deseja Receber?
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      deliveryType === 'delivery'
                        ? 'bg-[#FFF3EC] border-[#C85A32] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E8DCCF] text-[#7A6455]'
                    }`}
                  >
                    <Truck className={`w-5 h-5 shrink-0 ${deliveryType === 'delivery' ? 'text-[#C85A32]' : 'text-[#8C7667]'}`} />
                    <div>
                      <span className="block font-bold text-xs text-[#2D2118]">
                        Entrega em Casa
                      </span>
                      <span className="text-[11px] text-[#7A6455]">
                        Em toda Americana
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('retirada')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                      deliveryType === 'retirada'
                        ? 'bg-[#FFF3EC] border-[#C85A32] shadow-xs'
                        : 'bg-[#FAF7F2] border-[#E8DCCF] text-[#7A6455]'
                    }`}
                  >
                    <Store className={`w-5 h-5 shrink-0 ${deliveryType === 'retirada' ? 'text-[#C85A32]' : 'text-[#8C7667]'}`} />
                    <div>
                      <span className="block font-bold text-xs text-[#2D2118]">
                        Retirar no Ateliê
                      </span>
                      <span className="text-[11px] text-[#7A6455]">
                        Sem taxa de entrega
                      </span>
                    </div>
                  </button>
                </div>

                {/* Address inputs if Delivery */}
                {deliveryType === 'delivery' ? (
                  <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E8DCCF] space-y-2.5">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-medium text-[#4A382A] mb-1">
                          Rua / Avenida:
                        </label>
                        <input
                          type="text"
                          required
                          value={street}
                          onChange={e => setStreet(e.target.value)}
                          placeholder="Ex: Av. Brasil"
                          className="w-full bg-white border border-[#E5D7CA] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#4A382A] mb-1">
                          Número:
                        </label>
                        <input
                          type="text"
                          required
                          value={number}
                          onChange={e => setNumber(e.target.value)}
                          placeholder="123"
                          className="w-full bg-white border border-[#E5D7CA] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-medium text-[#4A382A] mb-1">
                          Bairro em Americana:
                        </label>
                        <input
                          type="text"
                          required
                          value={neighborhood}
                          onChange={e => setNeighborhood(e.target.value)}
                          placeholder="Ex: Jardim Ipiranga"
                          className="w-full bg-white border border-[#E5D7CA] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#4A382A] mb-1">
                          Complemento (Apt, Bloco):
                        </label>
                        <input
                          type="text"
                          value={complement}
                          onChange={e => setComplement(e.target.value)}
                          placeholder="Ex: Apt 32"
                          className="w-full bg-white border border-[#E5D7CA] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DCCF] text-xs text-[#5D473A]">
                    <span className="font-bold block text-[#2D2118]">Endereço para Retirada:</span>
                    <span>{settings.address} - {settings.neighborhood}, Americana - SP</span>
                    <span className="block text-[11px] text-[#8C7667] mt-0.5">
                      Horário: {settings.openingHours}
                    </span>
                  </div>
                )}
              </div>

              {/* 3. Schedule Date & Time */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C85A32]">
                  3. Data & Horário Desejado
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    className="bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="Hoje">Hoje</option>
                    <option value="Amanhã">Amanhã</option>
                    <option value="Próximo Sábado">Próximo Sábado</option>
                    <option value="Próximo Domingo">Próximo Domingo</option>
                  </select>

                  <select
                    value={scheduledTimeSlot}
                    onChange={e => setScheduledTimeSlot(e.target.value)}
                    className="bg-[#FAF7F2] border border-[#E6DCD1] rounded-xl px-3 py-2 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32]"
                  >
                    <option value="11:00 às 12:30">11:00 às 12:30 (Manhã)</option>
                    <option value="14:00 às 15:30">14:00 às 15:30 (Tarde)</option>
                    <option value="16:00 às 17:30">16:00 às 17:30 (Fim de Tarde)</option>
                    <option value="17:30 às 18:30">17:30 às 18:30 (Noite)</option>
                  </select>
                </div>
              </div>

              {/* 4. Payment Method (Identical to reference Screen 5) */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF7243]">
                  4. Payment Method
                </span>

                <div className="space-y-2">
                  {/* Pix (National Brazilian Payment) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-[#FFF3EC] border-[#FF7243] shadow-xs'
                        : 'bg-white border-[#E4E4E7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#18181B] block">Pix Instantâneo</span>
                        <span className="text-[10px] text-[#71717A]">Aprovação imediata</span>
                      </div>
                    </div>
                    {paymentMethod === 'pix' && <Check className="w-4 h-4 text-[#FF7243]" />}
                  </button>

                  {/* Google Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao_entrega')}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      paymentMethod === 'cartao_entrega'
                        ? 'bg-[#FFF3EC] border-[#FF7243] shadow-xs'
                        : 'bg-white border-[#E4E4E7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F4F4F5] flex items-center justify-center font-bold text-xs text-[#18181B]">
                        GPay
                      </div>
                      <span className="font-bold text-xs text-[#18181B]">Google Pay / Cartão</span>
                    </div>
                    {paymentMethod === 'cartao_entrega' && <Check className="w-4 h-4 text-[#FF7243]" />}
                  </button>

                  {/* Apple Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cartao_entrega')}
                    className="w-full p-3.5 rounded-2xl border border-[#E4E4E7] text-left flex items-center justify-between bg-white hover:bg-[#FAFAFA]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
                        Pay
                      </div>
                      <span className="font-bold text-xs text-[#18181B]">Apple Pay</span>
                    </div>
                  </button>

                  {/* Mastercard / Dinheiro */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('dinheiro')}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      paymentMethod === 'dinheiro'
                        ? 'bg-[#FFF3EC] border-[#FF7243] shadow-xs'
                        : 'bg-white border-[#E4E4E7]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#18181B] block">Dinheiro / Troco</span>
                        <span className="text-[10px] text-[#71717A]">Pagamento no recebimento</span>
                      </div>
                    </div>
                    {paymentMethod === 'dinheiro' && <Check className="w-4 h-4 text-[#FF7243]" />}
                  </button>

                  {/* "+ Add New" button matching reference */}
                  <button
                    type="button"
                    onClick={() => alert('Opção demonstrativa: cadastro de novos cartões de crédito')}
                    className="w-full py-3 rounded-2xl border-2 border-dashed border-[#D4D4D8] hover:border-[#FF7243] text-xs font-semibold text-[#71717A] hover:text-[#FF7243] flex items-center justify-center gap-1 transition-colors"
                  >
                    + Add New
                  </button>
                </div>

                {/* If Pix selected: show clear prototype Pix display */}
                {paymentMethod === 'pix' && (
                  <div className="bg-[#FAF7F2] border border-[#E5D7CA] rounded-2xl p-4 text-center space-y-3">
                    <div className="inline-block p-2 bg-white rounded-xl shadow-xs border border-[#E5D7CA]">
                      {/* Stylized QR Code SVG */}
                      <svg
                        className="w-32 h-32 mx-auto text-[#2D2118]"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                      >
                        <path d="M10 10h30v30H10zM15 15v20h20V15zM20 20h10v10H20zM60 10h30v30H60zM65 15v20h20V15zM70 20h10v10H70zM10 60h30v30H10zM15 65v20h20V65zM20 70h10v10H20zM50 15h5v5h-5zM45 25h10v5H45zM50 35h5v5h-5zM60 60h10v5H60zM75 60h15v5H75zM60 70h5v15h-5zM70 75h10v5H70zM85 70h5v20h-5zM65 85h15v5H65z" />
                      </svg>
                    </div>

                    <div className="text-xs text-[#7A6455]">
                      <span className="block font-semibold text-[#2D2118]">
                        Chave Pix Celular (Demonstrativa):
                      </span>
                      <span className="font-mono text-emerald-800 bg-emerald-50 px-2 py-1 rounded">
                        {settings.whatsapp} (Maitê Bolos)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyPix}
                      className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-[#D5C4B5] text-xs font-semibold text-[#4A382A] hover:bg-[#FAF3EC] transition-colors"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Código Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Código Pix Copia e Cola</span>
                        </>
                      )}
                    </button>

                    <p className="text-[10px] text-[#A08878] italic">
                      * Demonstração visual. O pagamento real com baixa automática será integrado no backend.
                    </p>
                  </div>
                )}

                {/* If Cash selected: change for field */}
                {paymentMethod === 'dinheiro' && (
                  <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#E8DCCF] space-y-2">
                    <label className="flex items-center gap-2 text-xs font-medium text-[#4A382A]">
                      <input
                        type="checkbox"
                        checked={needChange}
                        onChange={e => setNeedChange(e.target.checked)}
                        className="rounded text-[#C85A32] focus:ring-[#C85A32]"
                      />
                      <span>Precisa de troco?</span>
                    </label>

                    {needChange && (
                      <div>
                        <label className="block text-[11px] text-[#7A6455] mb-1">
                          Troco para quanto?
                        </label>
                        <input
                          type="number"
                          value={changeFor}
                          onChange={e => setChangeFor(e.target.value)}
                          placeholder="Ex: 200,00"
                          className="w-full bg-white border border-[#E6DCD1] rounded-xl px-3 py-1.5 text-xs text-[#2D2118] focus:outline-none focus:border-[#C85A32]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Order items review preview */}
              <div className="border-t border-[#F0E6DC] pt-3 text-xs text-[#5D473A] space-y-1">
                <div className="flex justify-between">
                  <span>Itens ({cart.length}):</span>
                  <span className="font-semibold text-[#2D2118] tabular-nums">
                    R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Desconto ({appliedCoupon?.code}):</span>
                    <span className="font-semibold tabular-nums">
                      - R$ {cartDiscount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Entrega ({deliveryType === 'delivery' ? 'Americana' : 'Retirada'}):</span>
                  <span className="font-semibold text-[#2D2118] tabular-nums">
                    {effectiveDeliveryFee === 0 ? 'Grátis' : `R$ ${effectiveDeliveryFee.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                <div className="border-t border-[#EAE0D5] pt-1.5 flex justify-between font-bold text-sm text-[#2D2118]">
                  <span>Total a Pagar:</span>
                  <span className="text-base text-[#C85A32] tabular-nums">
                    R$ {effectiveTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 border-t border-[#F0E6DC] bg-[#FAF7F2] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="py-3 px-4 rounded-xl text-xs font-semibold text-[#7A6455] hover:text-[#2D2118]"
              >
                Voltar à sacola
              </button>

              <button
                type="submit"
                className="py-3.5 px-6 rounded-2xl bg-[#E07A5F] hover:bg-[#C85A32] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
              >
                Confirmar Encomenda ({effectiveTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Pedido Registrado com Sucesso!
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#2D2118]">
                {createdOrderNumber}
              </h3>
              <p className="text-xs text-[#7A6455] max-w-sm mx-auto">
                Obrigado, {name}! Seu pedido foi recebido pelo ateliê da Maitê Bolos e já está em fila de produção.
              </p>
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EDE2D6] text-xs text-[#5D473A] text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8C7667]">Previsão de Entrega:</span>
                <span className="font-semibold text-[#2D2118]">{scheduledDate} ({scheduledTimeSlot})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7667]">Tipo de Atendimento:</span>
                <span className="font-semibold text-[#2D2118]">
                  {deliveryType === 'delivery' ? 'Entrega em Domicílio' : 'Retirada no Ateliê'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7667]">Forma de Pagamento:</span>
                <span className="font-semibold text-[#2D2118] uppercase">{paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#2D2118] hover:bg-[#1A130E] text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              Acompanhar Pedido na Linha do Tempo →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
