# Plano de Evolução — ai-react-base

> Arquivo de rastreamento do plano de melhoria do projeto.
> Marque cada item com [x] conforme for concluído.

---

## Status Geral

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | Design System — tokens e variáveis | [x] |
| 2 | Setup shadcn/ui + Tailwind | [x] |
| 3 | Feature E2E de exemplo | [x] |
| 4 | CLAUDE.md files | [x] |
| 5 | README.md | [x] |

---

## Fase 1 — Design System

Criar a fundação de estilo do projeto: cores, tipografia, espaçamento e sombras como tokens centralizados.

### Arquivos a criar

- [x] `src/styles/globals.css` — CSS variables para dark/light mode (cores como variáveis CSS)
- [x] `src/shared/design/tokens.ts` — paleta de cores, border-radius, z-index
- [x] `src/shared/design/typography.ts` — font family, sizes (xs → 4xl), weights, line-heights
- [x] `src/shared/design/spacing.ts` — escala base 4px (0.5, 1, 1.5, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24)
- [x] `src/shared/design/shadows.ts` — elevações (sm, md, lg, xl)
- [x] `src/shared/design/breakpoints.ts` — sm(640), md(768), lg(1024), xl(1280), 2xl(1536)
- [x] `src/shared/design/index.ts` — barrel export de todos os tokens

### Regras do design system

- Nunca usar valores hardcoded de cor (hex, rgb) fora dos tokens
- Nunca usar valores de px de espaçamento fora da escala definida
- Dark mode é o modo padrão do projeto

---

## Fase 2 — Setup shadcn/ui + Tailwind

Instalar shadcn **sem remover Chakra UI**. Os dois coexistem durante a transição.
Novos componentes e telas usam shadcn. Componentes legados Chakra ficam intactos.

### Passos

- [x] Instalar Tailwind CSS v4 + configurar `tailwind.config.ts`
- [x] Configurar `components.json` do shadcn
- [x] Rodar `shadcn init` para setup inicial
- [x] Instalar componentes shadcn base: `button`, `card`, `input`, `label`, `badge`, `table`, `skeleton`, `dialog`, `drawer`, `select`, `checkbox`, `avatar`, `tooltip`, `sonner` (toast)
- [x] Mapear tokens do Design System (Fase 1) como CSS variables no `globals.css`
- [x] Validar que Chakra e shadcn coexistem sem conflito de estilos

### Convenção pós-setup

- Novos componentes `ui/` → shadcn (em `src/shared/components/ui/`)
- Componentes Chakra legados → mantidos, migrados sob demanda
- Variantes customizadas → usar `class-variance-authority` (CVA)

---

## Fase 3 — Feature E2E de Exemplo

Criar uma feature completa de ponta a ponta usando a **API pública JSONPlaceholder** (`https://jsonplaceholder.typicode.com`).

> Esta feature serve como referência canônica de como construir qualquer feature no projeto.

### API escolhida

**JSONPlaceholder** — `https://jsonplaceholder.typicode.com`

Endpoints usados:
- `GET /users` — lista de usuários
- `GET /users/:id` — detalhe do usuário
- `GET /users/:id/posts` — posts do usuário
- `GET /users/:id/albums` — álbuns do usuário

### Tela a construir

**Tela de Usuários** (`/platform/users`)

Layout:
- Header da página com título e total de usuários
- Grid de cards de usuário (nome, email, empresa, cidade)
- Filtro por nome (input de busca client-side)
- Clique no card → drawer lateral com detalhes do usuário
- Aba "Posts" e aba "Álbuns" dentro do drawer (tabs)
- Loading skeleton nos cards
- Estado de erro com mensagem amigável

Componentes shadcn usados na tela:
- `Card` — card de usuário no grid
- `Input` — campo de busca
- `Badge` — tag com cidade do usuário
- `Drawer` — painel lateral de detalhes
- `Skeleton` — loading state
- `Avatar` — iniciais do nome do usuário
- `Tabs` — Posts / Álbuns dentro do drawer

### Arquivos a criar (seguindo o padrão Controller/UseCase/Repository)

```
src/routes/_platform/users/
├── index.tsx                    # Página principal (grid de usuários + filtro)
├── -users.schema.ts             # Schemas Zod: User, Post, Album
├── -users.repository.ts         # Chamadas HTTP com HttpClient + Result
├── -users.use-case.ts           # Orquestração: buscar usuários, buscar detalhes
├── -users.controller.ts         # Lógica de UI: estado, filtros, queries
└── _components/
    ├── user-card.tsx            # Card individual de usuário
    ├── user-drawer.tsx          # Drawer de detalhes
    ├── user-posts-tab.tsx       # Aba de posts
    └── user-albums-tab.tsx      # Aba de álbuns
```

### Passos de implementação

- [x] Criar schemas Zod (`-users.schema.ts`)
- [x] Criar repository com HttpClient (`-users.repository.ts`)
- [x] Criar use cases (`-users.use-case.ts`)
- [x] Criar controller com TanStack Query (`-users.controller.ts`)
- [x] Criar componentes da tela (`_components/`)
- [x] Criar página principal (`index.tsx`)
- [x] Adicionar rota no sidebar
- [x] Adicionar traduções (EN + PT-BR)
- [x] Testar loading, erro e happy path

---

## Fase 4 — CLAUDE.md Files

Documentação para orientar a IA em qualquer tarefa no projeto.

### Arquivos a criar

- [x] `/CLAUDE.md` — visão geral do projeto, stack, convenções globais, regras absolutas
- [x] `/src/routes/CLAUDE.md` — como criar rotas, telas, layouts, loaders
- [x] `/src/routes/_platform/users/CLAUDE.md` — feature E2E como referência canônica
- [x] `/src/shared/CLAUDE.md` — HttpClient, Result monad, i18n, utilitários
- [x] `/src/shared/design/CLAUDE.md` — tokens, shadcn, CVA, dark mode

### Conteúdo de cada arquivo

#### `/CLAUDE.md`
- O que é o projeto e seu propósito
- Stack com versões (React 19, TanStack Router/Query/Form, Zod, Biome, shadcn, Chakra legado)
- Como rodar (`pnpm dev` → porta 3001, proxy pra API)
- Estrutura de pastas comentada
- Path aliases: `#/*` → `src/*`
- Regras absolutas:
  - Usar `Result` monad (Ok/Err), nunca try/catch nas camadas
  - Zod obrigatório em toda resposta de API
  - Sem `any` ou `as unknown`
  - Biome para lint/format (não ESLint, não Prettier)
  - Novos componentes → shadcn; nunca criar componente do zero sem checar shadcn
  - i18n: sempre adicionar chave em EN e PT-BR simultaneamente

#### `/src/routes/CLAUDE.md`
- Como funciona o file-based routing do TanStack Router
- Convenções de nome de arquivo (`__root`, `_platform`, `$param`)
- Como criar rota pública vs protegida
- Como usar `loader` vs React Query na rota
- Como configurar o header da página via `usePlatformContext`
- Como criar sub-rotas aninhadas

#### `/src/routes/_platform/users/CLAUDE.md`
- Esta é a feature de referência — siga este padrão para toda nova feature
- Diagrama das camadas e responsabilidades
- Schema → Repository → Use Case → Controller → View
- Como usar o HttpClient com Result
- Como tipar com inferência do Zod (`z.infer<typeof Schema>`)
- Como usar TanStack Query no controller
- Como estruturar componentes internos em `_components/`

#### `/src/shared/CLAUDE.md`
- HttpClient: interface, métodos disponíveis, como usar
- Result monad: `Ok(data)`, `Err(error)`, `result.match()`, `isOk()`, `isErr()`
- i18n: como adicionar chave, como usar `useTranslation`, namespaces
- Como criar componente ui/ com shadcn
- Quando usar CVA para variantes

#### `/src/shared/design/CLAUDE.md`
- Tokens disponíveis e como importar
- Regra: nunca hardcode, sempre token
- Como o dark mode funciona (CSS variables)
- Escala de espaçamento
- Tipografia: hierarquia e quando usar cada tamanho

---

## Fase 5 — README.md

- [x] Badges (tech stack)
- [x] O que é o projeto
- [x] Stack e versões
- [x] Pré-requisitos
- [x] Como rodar localmente
- [x] Estrutura de pastas (árvore comentada)
- [x] Guia rápido: como adicionar uma feature nova (referência à feature users)
- [x] Design system: tokens, shadcn, dark mode
- [x] Convenções de código
- [x] Contribuição

---

## Decisões de Arquitetura Registradas

| Data | Decisão | Motivo |
|------|---------|--------|
| 2026-04-27 | Migrar UI para shadcn/ui | Mais flexível, código próprio, melhor pra AI-guided dev |
| 2026-04-27 | Coexistência Chakra + shadcn | Evitar reescrita desnecessária de componentes legados |
| 2026-04-27 | JSONPlaceholder como API de exemplo | Pública, estável, sem auth, cobre vários casos de uso |
| 2026-04-27 | Feature "users" como referência canônica | E2E completo que serve como template pra novas features |

---

## Próximo passo

✅ **Plano concluído!** Todos os itens foram implementados.
