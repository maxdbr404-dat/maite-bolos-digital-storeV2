# Maitê Bolos e Doces — Protótipo Frontend de Alta Fidelidade

Protótipo frontend profissional, interativo e mobile-first desenvolvido para a confeitaria artesanal **Maitê Bolos e Doces**, localizada em **Americana, São Paulo** (`@_maitebolos`).

O projeto reproduz a composição e a experiência do aplicativo de referência e das grandes lojas de chocolates e presentes, com identidade visual delicada e acolhedora, fotografias de produtos em alta resolução, estado local persistido (`localStorage`) e três ambientes de demonstração navegáveis.

---

## 🌟 Ambientes da Demonstração

O protótipo conta com uma barra superior de controle (**DemoSwitcher**) que permite ao cliente ou avaliador alternar instantaneamente entre três visões do negócio:

1. **🛍️ Loja Pública do Cliente**:
   - Tela de boas-vindas (*Welcome Screen*) com fotografia de confeitaria e apresentação da marca.
   - Vitrine de produtos em grade de 2 colunas no celular (e até 4 colunas em telas amplas).
   - Carrossel horizontal de categorias com imagens circulares.
   - Detalhe completo do produto com seletor de tamanho (P, M, G), massas, recheios, adicionais e cálculo de preço em tempo real.
   - Sacola de compras (*Cart Drawer*) com cálculo de subtotal, cupom promocional e frete.
   - Checkout completo com seleção de entrega em Americana ou retirada no ateliê.
   - Pagamento via Pix com QR Code demonstrativo, além de opções em cartão e dinheiro com troco.
   - Acompanhamento do pedido em tempo real (*Timeline*) com mapa de entrega simulado e dados do motoboy.

2. **👩‍🍳 Painel Administrativo da Confeitaria**:
   - **Dashboard**: Métricas de vendas de hoje, faturamento mensal, ticket médio e pedidos na esteira com filtros de período.
   - **Gráficos**: Vendas por dia da semana, pedidos por status e ranking de produtos mais vendidos.
   - **Gestão de Pedidos**: Tabela com filtros por status e tipo, visualização detalhada e alteração de status em 1 clique.
   - **Gestão de Produtos**: Catálogo interativo com cadastro de novos doces, edição de preços/tamanhos e pausa de disponibilidade.
   - **Gestão de Categorias**: Criação e listagem das categorias do cardápio.
   - **PDV Balcão**: Ponto de venda para atendimento físico presencial da confeiteira no balcão.
   - **Entregadores & Logística**: Atribuição de motoristas, controle de frotas e monitoramento de entregas.
   - **Financeiro & Relatórios**: Separação clara de faturamento por modalidade (Pix, Cartão, Dinheiro) e canal (Online vs. Balcão).
   - **Cupons & Campanhas**: Criação e ativação de cupons promocionais.
   - **Configurações da Loja**: WhatsApp, endereço em Americana, horários e taxas de entrega.

3. **🛵 Aplicativo do Entregador**:
   - Interface móvel dedicada aos motoristas da confeitaria.
   - Alternância de disponibilidade (*Disponível* / *Em Rota*).
   - Lista de entregas atribuídas com endereço do cliente em Americana e botão direto para chamada/WhatsApp.
   - Recomendações de transporte delicado em caixa nivelada.
   - Botões de avanço de entrega: *Iniciar Rota*, *Cheguei no Endereço* e *Confirmar Entrega Concluída*.

---

## 🎨 Identidade Visual e Design System

- **Marca**: Maitê Bolos e Doces (Confeitaria Artesanal)
- **Localização**: Rua Entusiasmo, 253 - Americana, SP (CEP: 13477-678)
- **WhatsApp Oficial**: (19) 98265-4053
- **Instagram**: [@_maitebolos](https://www.instagram.com/_maitebolos/)
- **Tipografia**:
  - Títulos & Marca: `Playfair Display` (Serif clássica de confeitaria)
  - Textos & Valores: `Plus Jakarta Sans` (Geométrica, limpa e com números tabulares)
- **Cores Oficiais**:
  - Terracota & Coral Quente (`#E07A5F`, `#C85A32`): Ação primária e aconchego
  - Baunilha & Creme Suave (`#FAF7F2`, `#FAF4ED`): Fundo limpo e acolhedor
  - Cacau Escuro (`#2D2118`): Tipografia e contraste nobre
  - Dourado & Ambar (`#F59E0B`): Selos artesanais e estrelas de avaliação
- **Fotografias Reais**: Imagens de produtos armazenadas localmente em `/src/assets/images/`, garantindo estabilidade e alta definição.

---

## 🔄 Simulação vs. Futura Integração com Backend

Como esta etapa é **estritamente frontend** para validação visual e de fluxo com a proprietária, todos os dados são gerenciados via React Context e armazenados no `localStorage` do navegador:

| Funcionalidade | Estado Atual no Protótipo | Futura Integração (Backend) |
|---|---|---|
| **Catálogo & Preços** | Local (Edição, adição e remoção persistidos localmente) | Banco de Dados relacional (PostgreSQL / Firestore) |
| **Carrinho & Pedidos** | Gerador de pedidos com numeração aleatória `#MB-XXXX` | API REST / GraphQL com processamento em fila |
| **Pagamento Pix** | QR Code demonstrativo e código Copia e Cola ilustrativo | Gateway de Pagamento (Mercado Pago, Asaas ou PagBank com webhook de confirmação automática) |
| **Rastreamento de Entrega** | Linha do tempo interativa e mapa com rota simulada em Americana | Integração GPS via WebSockets, Google Maps Platform / Mapbox e app mobile nativo |
| **Mensagens WhatsApp** | Links diretos `wa.me` com mensagem pré-formatada | API Oficial do WhatsApp Business (Z-API, Twilio ou Meta Cloud API) |

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js versão 18 ou superior
- Gerenciador de pacotes npm, yarn, pnpm ou bun

### Passos de Instalação

1. Clone o repositório ou faça o download dos arquivos:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd maite-bolos
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento na porta 3000:
   ```bash
   npm run dev
   ```

4. Acesse no navegador:
   ```
   http://localhost:3000
   ```

---

## 📦 Como Gerar a Versão de Produção (Build Estático)

Para gerar os arquivos estáticos otimizados para hospedagem (Vercel, Netlify, Cloudflare Pages, GitHub Pages ou Firebase Hosting):

1. Execute o comando de compilação:
   ```bash
   npm run build
   ```

2. Os arquivos estáticos prontos serão gerados na pasta `dist/`.

3. Para testar a versão compilada localmente:
   ```bash
   npm run preview
   ```
