# CLAUDE.md — ai-react-base

Boilerplate React moderno, dark-first, pronto para produção. Serve como base para qualquer produto web com autenticação, rotas protegidas, dados remotos e design system próprio.

## Como rodar

```bash
pnpm dev        # dev server em http://localhost:3001
pnpm build      # build de produção
pnpm check      # lint + format (Biome)
pnpm test       # testes (Vitest)
```

O dev server faz proxy de `/api` → `https://dummyjson.com` e `/placeholder` → `https://jsonplaceholder.typicode.com`.

## Stack e versões

| Camada | Lib | Versão |
|--------|-----|--------|
| Framework | React | 19 |
| Build | Vite | 8 |
| Roteamento | TanStack Router | 1.x (file-based) |
| Data fetching | TanStack Query | 5.x |
| Forms | TanStack Form | 1.x |
| UI (legado) | Chakra UI | 3.x |
| UI (novo) | shadcn/ui + Base UI + Tailwind | v4 |
| Headless UI | @base-ui/react (substitui Radix) | 1.x |
| Drawer | vaul | — |
| URL params | nuqs | 2.x |
| Validação | Zod | 4.x |
| HTTP | Axios (wrapper próprio) | 1.x |
| i18n | i18next + react-i18next | — |
| Lint/Format | Biome | 2.x |
| Testes | Vitest + Testing Library | — |
| Linguagem | TypeScript | 5.x (strict) |

## Estrutura de pastas

```
src/
├── routes/                    # Rotas (file-based, TanStack Router)
│   ├── __root.tsx             # Layout raiz + devtools
│   ├── auth/                  # Rotas públicas (login)
│   └── _platform/             # Rotas protegidas (requerem sessão)
│       ├── route.tsx          # Layout da plataforma (sidebar + header)
│       ├── index.tsx          # Dashboard
│       ├── posts/             # Feature posts (referência de infinite scroll)
│       └── users/             # Feature users (referência canônica → leia CLAUDE.md desta pasta)
├── shared/
│   ├── components/
│   │   ├── ui/                # Componentes shadcn (novos) + Chakra wrappers (legados)
│   │   └── layout/            # Sidebar, TopHeader, PlatformLayout, PlatformContext
│   ├── design/                # Design system: tokens, tipografia, espaçamento
│   ├── handlers/              # Guards de rota (handleSession, handleSessionInAuth)
│   ├── http/                  # HttpClient (Axios wrapper) + tipos de erro
│   ├── i18n/                  # Config i18next + traduções EN/PT-BR
│   ├── lib/                   # utils.ts (cn helper do shadcn)
│   ├── result/                # Monad Ok/Err
│   └── theme/                 # Tema Chakra UI (legado) + iconSizes
└── styles/
    └── globals.css            # Tailwind v4 + CSS variables do design system
```

## Bootstrap da aplicação

O `src/main.tsx` inicializa a aplicação na seguinte ordem:

```
1. i18n config (import '@/shared/i18n/config')
2. Global styles (import '@/styles/globals.css')
3. QueryClient criado
4. Router criado com context: { queryClient }
5. Interceptor HTTP 401 → redireciona para /auth
6. Render:
   <Provider>                    ← Chakra + color mode
     <QueryClientProvider>       ← TanStack Query
       <NuqsAdapter>             ← URL search params (nuqs)
         <RouterProvider />      ← TanStack Router
       </NuqsAdapter>
     </QueryClientProvider>
   </Provider>
```

## Fluxo de autenticação

O projeto usa um **cookie de sessão simples** para controle de acesso (sem JWT real — boilerplate):

```
1. Usuário acessa qualquer rota de _platform/
2. beforeLoad: handleSession() verifica document.cookie.includes('session')
3. Se não tem cookie → redirect para /auth
4. Login: define cookie 'session=demo; path=/; max-age=86400'
5. Redirect para /
6. HTTP interceptor: resposta 401 → redirect para /auth (token expirado)
```

- Para proteger uma rota: coloque-a dentro de `_platform/` (proteção automática)
- Para proteger rota específica: adicione `beforeLoad: handleSession` no `createFileRoute`

## Path aliases

| Alias | Resolve para |
|-------|-------------|
| `@/*` | `src/*` |
| `#/*` | `src/*` (package.json imports) |

Use `@/` nos imports de código.

## Regras absolutas — sempre siga

### 1. Result monad — sem try/catch nas camadas de dados
```ts
// ✅ correto
const result = await usersUseCase.list();
return result.getOrElse((error) => { throw error; }).data;

// ❌ errado
try {
  const data = await fetch('/users');
} catch (e) { ... }
```

### 2. Zod obrigatório em toda resposta de API
```ts
// ✅ correto
HTTP.get<User[]>('users', UsersResponseSchema)

// ❌ errado — sem schema não há validação em runtime
HTTP.get('users')
```

### 3. Sem `any` ou `as unknown as T`
TypeScript strict está ativado. Use tipos explícitos ou inferência via `z.infer<typeof Schema>`.

### 4. Biome — não ESLint, não Prettier
```bash
pnpm check          # checar
pnpm check --write  # corrigir
```

### 5. Novos componentes → shadcn/ui
Antes de criar um componente do zero, verifique se existe no shadcn:
```bash
npx shadcn@latest add <component-name>
```
Componentes vão em `src/shared/components/ui/`.

### 6. i18n — sempre EN + PT-BR simultaneamente
Nunca adicione uma chave só em um idioma. Edite ambos:
- `src/shared/i18n/translations/en_US.json`
- `src/shared/i18n/translations/pt_BR.json`

### 7. Design tokens — nunca hardcode valores
```ts
// ✅ correto
className="bg-card text-muted-foreground border-border"

// ❌ errado
style={{ backgroundColor: '#1a202e', color: '#94a3b8' }}
```

## UI: Chakra (legado) vs shadcn (novo)

- **Chakra UI**: presente nos componentes e telas antigas. Não remova sem necessidade.
- **shadcn/ui + Tailwind**: use em toda tela e componente novo.
- Os dois coexistem sem conflito de estilos.

## Testes

O projeto usa **Vitest + Testing Library**. Testes ficam em arquivos `*.test.tsx` ao lado do código.

```bash
pnpm test          # roda todos os testes uma vez
pnpm test --watch  # modo watch
```

**O que testar:**
- Lógica de use-cases e repositories (funções puras, mocks de HTTP)
- Comportamento de componentes (interações, estados)
- Schemas Zod (validação de dados)

**O que não testar:**
- Componentes puramente visuais sem lógica
- Wrappers de terceiros

## Mais detalhes

- Como criar rotas → `src/routes/CLAUDE.md`
- Fluxo de auth → `src/routes/auth/CLAUDE.md`
- Padrão de feature E2E → `src/routes/_platform/users/CLAUDE.md`
- Padrão de infinite scroll → `src/routes/_platform/posts/CLAUDE.md`
- HttpClient, Result, i18n, nuqs → `src/shared/CLAUDE.md`
- Componentes UI disponíveis → `src/shared/components/ui/CLAUDE.md`
- Arquitetura de layout → `src/shared/components/layout/CLAUDE.md`
- Design system e tokens → `src/shared/design/CLAUDE.md`
