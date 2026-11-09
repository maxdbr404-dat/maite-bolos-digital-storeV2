import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Sparkles,
  ShoppingBag,
  ChefHat,
  Bike,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Store,
  Compass
} from 'lucide-react';

export const MiniTutorialModal: React.FC = () => {
  const { isTutorialOpen, setIsTutorialOpen, setActiveView } = useStore();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isTutorialOpen) return null;

  const steps = [
    {
      title: '1. Vitrine de Bolos & Inspiração',
      subtitle: 'Composição idêntica ao design de referência',
      desc: 'Navegue pelo carrossel horizontal de categorias, use a barra de busca e explore os bolos mais pedidos em grade de 2 colunas com cartões em tons pastéis suaves (lavanda, rosa, dourado e azul).',
      actionView: 'store' as const,
      icon: Store,
      badge: 'Loja do Cliente'
    },
    {
      title: '2. Personalização & Detalhes do Bolo',
      subtitle: 'Tamanhos S, M, L e Stepper Laranja',
      desc: 'Abra qualquer bolo para ver a foto ampliada, selecione o tamanho nas pílulas circulares (S, M, L), ajuste a quantidade no stepper (- 1 +) e adicione à sacola com o card laranja vibrante.',
      actionView: 'store' as const,
      icon: ShoppingBag,
      badge: 'Cardápio Interativo'
    },
    {
      title: '3. Cozinha & Confeiteiro Automatizado',
      subtitle: 'Esteira de produção em tempo real',
      desc: 'Acesse a Área do Confeiteiro: a confeiteira recebe os convites de pedidos, aceita em 1 clique, acompanha o tempo de forno e finaliza a decoração, notificando o cliente automaticamente.',
      actionView: 'confectioner' as const,
      icon: ChefHat,
      badge: 'Produção Confeitaria'
    },
    {
      title: '4. Logística do Entregador & Rastreamento',
      subtitle: 'Rotas simuladas e caixa térmica nivelada',
      desc: 'O entregador recebe a rota no aplicativo móvel próprio, avisa quando chega ao endereço e confirma a entrega. O cliente acompanha cada etapa na linha do tempo com mapa demonstrativo.',
      actionView: 'driver' as const,
      icon: Bike,
      badge: 'Entrega Própria'
    }
  ];

  const active = steps[currentStep];
  const IconComponent = active.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTutorialOpen(false);
    }
  };

  const handleGoToView = () => {
    setActiveView(active.actionView);
    setIsTutorialOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#F4F4F5] space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#F4F4F5] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFF3EC] text-[#FF7243] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#18181B]">
                Mini Tutorial Interativo
              </h3>
              <span className="text-[11px] text-[#71717A]">Passo {currentStep + 1} de {steps.length}</span>
            </div>
          </div>

          <button
            onClick={() => setIsTutorialOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F4F4F5] text-[#71717A] hover:text-[#18181B] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Step Card */}
        <div className="bg-[#FAF7F2] p-5 rounded-3xl border border-[#EDE2D6] space-y-3 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FF7243] text-white flex items-center justify-center mx-auto shadow-md shadow-[#FF7243]/20">
            <IconComponent className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="inline-block bg-white text-[#FF7243] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#FFD7C9]">
              {active.badge}
            </span>
            <h4 className="font-extrabold text-base text-[#18181B]">
              {active.title}
            </h4>
            <p className="text-xs font-semibold text-[#FF7243]">
              {active.subtitle}
            </p>
          </div>

          <p className="text-xs text-[#52525B] leading-relaxed text-left pt-1">
            {active.desc}
          </p>

          <button
            type="button"
            onClick={handleGoToView}
            className="w-full py-2 px-3 rounded-xl bg-white border border-[#E4E4E7] text-[11px] font-bold text-[#18181B] hover:bg-[#F4F4F5] transition-colors"
          >
            Abrir tela: {active.badge} →
          </button>
        </div>

        {/* Stepper Dots & Navigation Buttons */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStep === idx ? 'w-6 bg-[#FF7243]' : 'w-2 bg-[#E4E4E7]'
                }`}
                aria-label={`Passo ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="p-2.5 rounded-full bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#18181B] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="py-2.5 px-5 rounded-full bg-[#FF7243] hover:bg-[#E85D30] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#FF7243]/20 transition-transform active:scale-95"
            >
              <span>{currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
