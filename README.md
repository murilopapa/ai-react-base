# ai-react-base

Boilerplate React moderno, dark-first e pronto para produção. Base para construir produtos web com autenticação, rotas protegidas, design system próprio e integração com APIs externas.

## Stack

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![TanStack](https://img.shields.io/badge/TanStack-Router%20%7C%20Query%20%7C%20Form-FF4154)
![shadcn](https://img.shields.io/badge/shadcn%2Fui-base--nova-000000)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1)
![Biome](https://img.shields.io/badge/Biome-2-60A5FA)

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| Roteamento | TanStack Router 1.x (file-based) |
| Data fetching | TanStack Query 5.x |
| Forms | TanStack Form 1.x |
| UI | shadcn/ui + Tailwind v4 |
| Validação | Zod 4 |
| HTTP | Axios (wrapper próprio com Result monad) |
| i18n | i18next (EN / PT-BR) |
| Lint & Format | Biome 2 |
| Testes | Vitest + Testing Library |

## Pré-requisitos

- Node 22+
- pnpm 10+

## Como rodar

```bash
# Instalar dependências
pnpm install

# Dev server (http://localhost:3001)
pnpm dev

# Build de produção
pnpm build

# Preview do build
pnpm preview

# Lint e format
pnpm check

# Testes
pnpm test
```

## Estrutura de pastas

```
src/
├── routes/                          # Rotas (file-based, TanStack Router)
│   ├── __root.tsx                   # Layout raiz + devtools
│   ├── auth/                        # Rotas públicas (login)
│   └── _platform/                   # Rotas protegidas (sidebar + header)
│       ├── route.tsx                # Layout da plataforma
│       ├── index.tsx                # Dashboard
│       ├── posts/                   # Feature posts (referência legada)
│       └── users/                   # Feature users (referência canônica ★)
│           ├── -users.schema.ts     # Schemas Zod
│           ├── -users.repository.ts # Chamadas HTTP
│           ├── -users.use-case.ts   # Orquestração
│           ├── -users.controller.ts # Hooks React Query
│           ├── index.tsx            # Página principal
│           └── _components/         # Componentes da feature
├── shared/
│   ├── components/
│   │   ├── ui/                      # Componentes shadcn/ui
│   │   └── layout/                  # Sidebar, Header, Platform layout
│   ├── design/                      # Design system: tokens, tipografia, espaçamento
│   ├── http/                        # HttpClient (Axios wrapper) + Result monad
│   ├── i18n/                        # Config i18next + traduções EN/PT-BR
│   ├── lib/                         # cn helper (tailwind-merge + clsx)
│   └── result/                      # Monad Ok/Err
└── styles/
    └── globals.css                  # Tailwind v4 + CSS variables do design system
```

## Como adicionar uma feature nova

A feature `users` é a referência canônica. Siga este fluxo:

```
1. Criar schema Zod           → -feature.schema.ts
2. Criar repository           → -feature.repository.ts
3. Criar use-case             → -feature.use-case.ts
4. Criar controller (hooks)   → -feature.controller.ts
5. Criar componentes          → _components/
6. Criar página               → index.tsx
7. Adicionar ao sidebar       → src/shared/components/layout/sidebar.tsx
8. Adicionar i18n             → en_US.json + pt_BR.json
```

Veja o guia completo em [`src/routes/_platform/users/CLAUDE.md`](src/routes/_platform/users/CLAUDE.md).

## Design System

O projeto tem um design system próprio baseado em CSS variables e Tailwind v4.

### Tokens disponíveis

```ts
import { colors, fontSize, spacing, shadows, breakpoints } from '@/shared/design';
```

### Classes Tailwind principais

| Propósito | Classes |
|-----------|---------|
| Fundo | `bg-background`, `bg-card`, `bg-muted` |
| Texto | `text-foreground`, `text-muted-foreground` |
| Borda | `border-border` |
| Primário | `bg-primary`, `text-primary` |
| Erro | `text-destructive`, `bg-destructive` |
| Radius | `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` |

### Componentes shadcn disponíveis

`button` · `card` · `input` · `label` · `badge` · `skeleton` · `dialog` · `drawer` · `select` · `checkbox` · `avatar` · `tooltip` · `table` · `tabs` · `sonner`

Para adicionar um novo:
```bash
npx shadcn@latest add <nome>
```

## Convenções

- **Result monad** — sem try/catch nas camadas de dados. Use `Ok`/`Err` e `getOrElse`.
- **Zod obrigatório** — toda resposta de API é validada com schema.
- **Sem `any`** — TypeScript strict ativado.
- **Biome** — lint e format. Não use ESLint nem Prettier.
- **i18n sempre em dupla** — toda chave nova vai nos dois arquivos de tradução.
- **Tailwind para novos componentes** — Chakra UI é legado, não adicione mais.

## Documentação por camada

| Arquivo | Conteúdo |
|---------|----------|
| [`CLAUDE.md`](CLAUDE.md) | Visão geral, regras absolutas, aliases |
| [`src/routes/CLAUDE.md`](src/routes/CLAUDE.md) | Como criar rotas, loaders, sidebar |
| [`src/routes/_platform/users/CLAUDE.md`](src/routes/_platform/users/CLAUDE.md) | Padrão de feature E2E completo |
| [`src/shared/CLAUDE.md`](src/shared/CLAUDE.md) | HttpClient, Result monad, i18n, componentes |
| [`src/shared/design/CLAUDE.md`](src/shared/design/CLAUDE.md) | Tokens, Tailwind, dark mode, CVA |
