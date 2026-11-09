import React from 'react';

/**
 * Normaliza e resolve o caminho de qualquer imagem da Maitê Bolos
 * garantindo compatibilidade total com GitHub Pages (subdiretório do repositório),
 * desenvolvimento local e domínios personalizados via import.meta.env.BASE_URL.
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path || typeof path !== 'string') {
    const base = import.meta.env.BASE_URL || '/';
    const cleanBase = base.endsWith('/') ? base : `${base}/`;
    return `${cleanBase}images/logo.png`;
  }

  const trimmed = path.trim();

  // URLs externas, data URIs ou blob URLs são mantidas diretamente
  if (
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://')
  ) {
    return trimmed;
  }

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;

  // Se já estiver com o prefixo do BASE_URL da build, retorna direto
  if (base !== '/' && trimmed.startsWith(base)) {
    return trimmed;
  }

  // Remove qualquer prefixo legado (ex: /src/assets/images/, /public/images/, etc.)
  let clean = trimmed
    .replace(/^(\/)?src\/assets\/images\//, '')
    .replace(/^(\/)?public\/images\//, '')
    .replace(/^(\/)?images\//, '')
    .replace(/^\//, '');

  // Mapeamento automático de nomes técnicos com timestamp para nomes semânticos
  const legacyToSemanticMap: Record<string, string> = {
    'maite_logo_patisserie_1794237555058.jpg': 'logo.png',
    'hero_welcome_bakery_1794237511122.jpg': 'banner-principal.jpg',
    'product_bolo_morango_1794237512290.jpg': 'bolo-morango.jpg',
    'product_bolo_brigadeiro_1794237511922.jpg': 'bolo-chocolate.jpg',
    'product_bolo_cenoura_1794237536926.jpg': 'bolo-vulcao.jpg',
    'product_red_velvet_1794237537894.jpg': 'bolo-red-velvet.jpg',
    'product_torta_merengue_1794237513024.jpg': 'torta-limao.jpg',
    'product_banoffee_1794237538172.jpg': 'torta-banoffee.jpg',
    'product_brigadeiros_box_1794237514941.jpg': 'brigadeiros.jpg',
    'product_brownies_1794237537889.jpg': 'brownies.jpg',
    'product_cupcakes_1794237538123.jpg': 'cupcakes.jpg',
    'product_kit_presente_1794237515315.jpg': 'kit-festa.jpg',
    'avatar_entregador_1794237540071.jpg': 'entregador.jpg'
  };

  const filename = legacyToSemanticMap[clean] || clean;

  return `${cleanBase}images/${filename}`;
};

/**
 * Trata erros de carregamento de imagem com fallback seguro
 */
export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackPath: string = 'logo.png'
) => {
  const target = e.currentTarget;
  if (!target.dataset.hasFallback) {
    target.dataset.hasFallback = 'true';
    target.src = getImageUrl(fallbackPath);
  }
};

/**
 * Componente de imagem seguro com auto-resolução de caminhos e fallback
 */
export const SafeImage: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { fallback?: string }
> = ({ src, fallback = 'logo.png', alt, onError, ...props }) => {
  const resolvedSrc = getImageUrl(src);

  return (
    <img
      src={resolvedSrc}
      alt={alt || 'Maitê Bolos e Doces'}
      onError={(e) => {
        handleImageError(e, fallback);
        if (onError) onError(e);
      }}
      {...props}
    />
  );
};
