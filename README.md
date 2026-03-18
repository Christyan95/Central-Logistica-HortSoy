# 🌿 HortSoy Central Logística

[![Tecnologias](https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20TS%20%7C%20Leaflet-green)](https://nextjs.org/)
[![Status](https://img.shields.io/badge/Status-Senior%20Master%20Verified-075000)](/)

Uma plataforma de inteligência geoespacial de alto nível para a gestão e otimização da malha logística da **HortSoy**. Este sistema utiliza algoritmos avançados de roteirização (TSP) e integração em tempo real com motores de mapas globais.

![HortSoy Banner](/hortsoy-logo.png)

## 🚀 Visão Geral do Sistema

O **HortSoy Central Logística** foi desenvolvido para resolver o problema clássico de logística: como conectar múltiplas filiais da forma mais eficiente possível. Através de uma interface baseada em *Glassmorphism* e *Dark/Light themes*, o gestor pode planejar, otimizar e exportar rotas operacionais em segundos.

### ✨ Principais Funcionalidades (Master Edition)

- **📍 Geolocalização de Precisão**: 16 unidades geocodificadas com coordenadas exatas.
- **🛣️ Otimização via TSP (Nearest Neighbor)**: Algoritmo que reordena as paradas para minimizar a distância percorrida.
- **🗺️ Mapas Híbridos**: Alternância entre estilos Clássico (OSM) e Voyager/Dark de alta performance.
- **📋 Relatório Logístico Detalhado**: Janela de telemetria com distâncias por trecho (legs), tempo estimado e distância total.
- **🚛 Integração Google Maps**: Botão para exportar a rota completa diretamente para o GPS do dispositivo móvel.
- **🌓 Temas Adaptativos**: UI inteligente que se adapta ao ambiente de trabalho do gestor.

## 🏗️ Arquitetura Técnica

O projeto segue os princípios de **Clean Architecture** e **SOLID**:

- **Core Logic (`/utils/routing.ts`)**: Independente de UI, lida com cálculos matemáticos (Haversine) e integração com a API OSRM.
- **Componentes (`/components`)**: Modulares e desacoplados, utilizando `react-leaflet` para renderização vetorial.
- **Tipagem Forte**: 100% TypeScript, garantindo segurança em tempo de compilação e eliminando erros de runtime.
- **Design System (`/app/globals.css`)**: Centralizado em variáveis CSS, facilitando a manutenção e escala das cores da marca.

## 🔒 Segurança & Performance

- **Zero API Keys Exposed**: Utilização de provedores Open Source (OSRM/OSM) para evitar custos inesperados e exposição de chaves.
- **SSR Optimization**: Carregamento dinâmico do mapa para evitar bloqueios de renderização no servidor.
- **Lazy Loading**: Componentes pesados são carregados on-demand para garantir um First Contentful Paint (FCP) ultra-rápido.
- **Sanitização de Dados**: Todas as entradas e coordenadas são tratadas para evitar inconsistências no processamento da rota.

## 🛠️ Guia do Desenvolvedor

### Requisitos
- Node.js 18+
- NPM ou Yarn

### Instalação
```bash
npm install
```

### Script de Execução
```bash
npm run dev
```

### Adicionando Novas Unidades
Para adicionar novas filiais, basta atualizar o arquivo `data/filiais.ts` seguindo a interface `Filial`. As coordenadas são processadas automaticamente pelo motor de mapas.

---

**Desenvolvido por Antigravity AI - Senior Master Scan Approved.**
