<div align="center">

# 🌿 HortSoy — Central Logística

**Inteligência Geoespacial e Otimização de Rotas para o Agronegócio**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9.4-199903?logo=leaflet)](https://leafletjs.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff0055?logo=framer)](https://motion.dev/)
[![Status](https://img.shields.io/badge/Status-Senior_Master_Verified-075000)]()

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Algoritmo de Roteirização](#-algoritmo-de-roteirização)
- [Paleta de Cores](#-paleta-de-cores)
- [Performance](#-performance)
- [Instalação](#-instalação)
- [Deploy na Vercel](#-deploy-na-vercel)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [SEO](#-seo)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

O **HortSoy Central Logística** é uma plataforma de inteligência geoespacial de alto nível projetada para a gestão e otimização da malha logística da corporação. O sistema resolve o desafio de conectar múltiplas unidades produtivas e centros de distribuição da forma mais eficiente possível, reduzindo custos operacionais e tempo de percurso.

### Destaques

- 📍 **Geolocalização de Precisão** — 16 unidades HortSoy geocodificadas com coordenadas exatas.
- 🛣️ **Otimização Inteligente** — Algoritmo TSP (Nearest Neighbor) para reordenação automática de trajetos.
- 📋 **Relatório de Telemetria** — Resumo detalhado com distâncias por trecho (legs) e tempo estimado.
- 🚛 **Exportação para GPS** — Integração direta com Google Maps para navegação em tempo real.
- 🌓 **Interface Adaptativa** — Design Premium com suporte a Dark e Light themes.
- ⚡ **Performance Senior** — Mapa com carregamento dinâmico (Lazy Loading) e zero gray-void.

---

## ✨ Funcionalidades

- 🌐 **Mapas Dual-Layer** — Alternância entre OpenStreetMap (Standard) e CartoDB (Voyager/Dark).
- 🍱 **Sidebar Colapsável** — Gerenciamento de rotas e unidades sem obstruir a visão tática.
- 🔍 **Foco Inteligente** — Centralização automática e zoom dinâmico ao selecionar unidades.
- 📏 **Métricas Reais** — Integração com API OSRM para distâncias baseadas em malha rodoviária real.
- 📱 **Responsive Design** — Interface otimizada para tablets e desktops de monitoramento.

---

## 🛠 Tecnologias

### Core
| Tecnologia | Versão | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15.x | Framework principal com App Router e SSR |
| [React](https://react.dev/) | 19.x | Biblioteca de UI declarativa |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tipagem estática e segurança de master-code |

### Mapas e Geoprocessamento
| Tecnologia | Uso |
|---|---|
| [Leaflet](https://leafletjs.com/) | Motor de renderização de mapas interativos |
| [React Leaflet](https://react-leaflet.js.org/) | Abstração React para componentes cartográficos |
| [OSRM API](http://project-osrm.org/) | Motor de roteirização externa para distâncias reais |

### Styling e Animação
| Tecnologia | Uso |
|---|---|
| [Framer Motion](https://motion.dev/) | Animações de interface, modais e transições |
| [Lucide React](https://lucide.dev/) | Iconografia técnica e profissional |
| [Vanilla CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) | Variáveis CSS para temas dinâmicos (Zero Overhead) |

---

## 🏗 Arquitetura

```
User Input (Sidebar Selection) 
    → Local State (RouteIds Update)
        → TSP Heuristic (Nearest Neighbor Sorting)
            → OSRM API Call (Road Network Geometry)
                → Map Renderer (GeoJSON + Marker Updates)
                    → Final Report (Distance + Duration Stats)
```

### Padrões Implementados
- **Dynamic Imports** — O componente de Mapa é carregado apenas no cliente (`ssr: false`).
- **Composition Pattern** — Separação clara entre lógica de roteirização e componentes de UI.
- **Theme Provider via CSS Custom Properties** — Troca de tema sem re-renderização pesada.
- **Strict Boundaries** — Travamento de coordenadas mundiais e viscosidade de limite.

---

## 📂 Estrutura de Arquivos

```
📦 HortSoy-Logistica/
├── 📂 app/
│   ├── layout.tsx         # Configuração de Metadados e Fontes (HortSoy Brand)
│   ├── page.tsx           # Dashboard principal e controle de estado
│   └── globals.css        # Design System (Tonalidades de Verde e Temas)
│
├── 📂 components/
│   ├── Map.tsx            # Motor Leaflet com GeoJSON e Interatividade
│   └── Sidebar.tsx        # Seletor de unidades e visualização de rota
│
├── 📂 data/
│   └── filiais.ts         # Base de dados geocodificada (16 Unidades)
│
├── 📂 public/
│   ├── favicon.png        # Ícone de caminhão minimalista
│   └── hortsoy-logo.png   # Identidade oficial da marca
│
├── 📂 utils/
│   └── routing.ts         # Algoritmos TSP e Integração OSRM/Google Maps
│
├── tailwind.config.ts     # Configurações de cores (Verde #075000)
├── next.config.ts         # Otimizações de Build Next.js
└── package.json           # Dependências verificadas
```

---

## 🧮 Algoritmo de Roteirização

O sistema utiliza a heurística **Nearest Neighbor** (Vizinho Mais Próximo) para resolver o Problema do Caixeiro Viajante (TSP) de forma eficiente em tempo real:

1. Inicia no ponto de origem selecionado.
2. Calcula a distância de Haversine para todas as unidades não visitadas.
3. Move para a unidade mais próxima disponível.
4. Repete até que todos os pontos estejam na sequência otimizada.
5. Solicita a geometria rodoviária exata via OSRM.

---

## 🎨 Paleta de Cores

Definida em `globals.css` para garantir a identidade visual **HortSoy**:

| Token | Hex | Uso |
|---|---|---|
| `Primary` | `#075000` | **Verde Floresta** — Botões, títulos, logos |
| `Secondary` | `#0d8c00` | **Verde Lima** — Ícones, destaques, rotas |
| `Background` | `#f0f2f5` | **Cinza Suave** — Fundo Light Theme |
| `Dark BG` | `#0a0a0c` | **Preto Profundo** — Fundo Dark Theme |
| `Accent` | `#0d8c00` | **Verde Vivo** — Marcadores de unidades |

---

## ⚡ Performance

### Otimizações Senior
- ✅ **Dynamic Tiles** — Tiles carregadas de forma otimizada conforme o nível de zoom.
- ✅ **Vector Rendering** — Geometria de rota via GeoJSON para fluidez visual rápida.
- ✅ **Debounced Interactions** — Controle de zoom e pan otimizados para evitar lag.
- ✅ **Asset Compression** — Favicon e logos otimizados para carregamento instantâneo.

---

## 🚀 Instalação

### Pré-requisitos
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### Setup

```bash
# 1. Clone o repositório
git clone https://github.com/Christyan95/Central-Logistica-HortSoy.git
cd Central-Logistica-HortSoy

# 2. Instale as dependências
npm install

# 3. Execute o servidor de desenvolvimento
npm run dev
```

---

## ▲ Deploy na Vercel

O projeto está configurado para deploy "Zero Config" na Vercel:

1. Conecte seu repositório GitHub à Vercel.
2. O framework Next.js será detectado automaticamente.
3. Clique em **Deploy**.

---

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|---|---|---|
| `dev` | `npm run dev` | Inicia o servidor de desenvolvimento |
| `build` | `npm run build` | Compila para produção |
| `start` | `npm run start` | Inicia o servidor de produção |
| `lint` | `npm run lint` | Executa o ESLint para auditoria de código |

---

## 🔍 SEO

Configurado no `layout.tsx` para máxima visibilidade:

- ✅ **Título Dinâmico**: Central Logística HortSoy.
- ✅ **Description**: Sistema inteligente de gestão e geolocalização.
- ✅ **Mobile-Ready**: Viewport configurada para dispositivos de monitoramento.
- ✅ **Favicon Temático**: Visualização clara em abas de múltiplos dashboards.

---

## 👤 Autor & Arquiteto

**Christyan Silva**
