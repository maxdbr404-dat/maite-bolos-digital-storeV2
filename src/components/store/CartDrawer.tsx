import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  ArrowRight,
  Tag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    setIsCheckoutOpen
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-center sm:justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header: "My Cart" with back arrow (Identical to reference Screen 3) */}
        <div className="p-5 border-b border-[#F4F4F5] flex items-center justify-between">
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full bg-[#F4F4F5] hover:bg-[#EAEAEA] flex items-center justify-center text-[#18181B]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="font-extrabold text-lg text-[#18181B]">
            My Cart
          </h2>

          <div className="w-10" />
        </div>

        {/* Item List (Matches Reference Screen 3 layout with pastel card and orange stepper) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#A1A1AA]">
              <p className="font-bold text-base text-[#18181B] mb-1">
                Sua sacola está vazia
              </p>
              <p className="text-xs mb-4">
                Explore os bolos mais pedidos no cardápio.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="py-2.5 px-6 rounded-full bg-[#FF7243] text-white text-xs font-bold"
              >
                Ver Bolos
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              const bgPastel = idx % 2 === 0 ? 'bg-[#EDE9FE]' : 'bg-[#FFE4E6]';

              return (
                <div
                  key={item.cartItemId}
                  className={`${bgPastel} rounded-3xl p-3.5 flex items-center justify-between gap-3 shadow-xs`}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-2xl bg-white p-1 overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs sm:text-sm text-[#18181B] truncate">
                      {item.product.name}
                    </h4>
                    <span className="font-bold text-xs sm:text-sm text-[#FF7243] tabular-nums block mt-1">
                      R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>

                  {/* Vertical / Horizontal Orange Stepper (Matches reference Screen 3) */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-center justify-between bg-[#FF7243] text-white rounded-2xl w-8 h-20 p-1 shadow-xs">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, 1)}
                        className="text-white hover:opacity-80 active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                      <span className="font-bold text-xs tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, -1)}
                        className="text-white hover:opacity-80 active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5 stroke-[3]" />
                      </button>
                    </div>

                    {/* Red Trash Button (Matches reference Screen 3) */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="w-8 h-8 rounded-full bg-[#FEE2E2] hover:bg-rose-200 text-rose-600 flex items-center justify-center transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

          {/* Coupon form */}
          {cart.length > 0 && (
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="bg-[#EBF7EE] border border-emerald-200 rounded-2xl p-3 flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-bold">Cupom {appliedCoupon.code} aplicado</span>
                  <button onClick={removeCoupon} className="font-semibold text-rose-600">
                    Remover
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Cupom (ex: BEMVINDO10)"
                    className="flex-1 bg-[#F4F4F5] border border-[#E4E4E7] rounded-2xl px-3 py-2 text-xs text-[#18181B] uppercase tracking-wider focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#18181B] text-white text-xs font-bold rounded-2xl"
                  >
                    Aplicar
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#F4F4F5] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#71717A]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-[#18181B] tabular-nums">
                  R$ {cartSubtotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Desconto:</span>
                  <span className="font-bold tabular-nums">
                    - R$ {cartDiscount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxa de Entrega:</span>
                <span className="font-bold text-[#18181B] tabular-nums">
                  {cartDeliveryFee === 0 ? 'Grátis' : `R$ ${cartDeliveryFee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
              <div className="border-t border-[#F4F4F5] pt-2 flex justify-between items-baseline font-extrabold text-base text-[#18181B]">
                <span>Total:</span>
                <span className="text-xl text-[#FF7243] tabular-nums">
                  R$ {cartTotal.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-4 px-6 rounded-full bg-[#FF7243] hover:bg-[#E85D30] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF7243]/20 transition-transform active:scale-95"
            >
              <span>Ir para Pagamento</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
