# CLAUDE.md — src/routes/

Rotas da aplicação usando **TanStack Router com file-based routing**. O Vite plugin (`@tanstack/router-plugin`) gera `src/routeTree.gen.ts` automaticamente ao detectar mudanças nos arquivos de rota.

## Convenções de nome de arquivo

| Padrão | Significado |
|--------|------------|
| `__root.tsx` | Layout raiz — envolve toda a aplicação |
| `_platform/` | Grupo de rotas protegidas (prefixo `_` = sem segmento de URL) |
| `route.tsx` | Define o layout/guard do segmento sem ser uma página |
| `index.tsx` | Página padrão do segmento |
| `$postId/` | Segmento dinâmico (parâmetro de rota) |
| `-post.controller.ts` | Arquivo auxiliar (prefixo `-` = ignorado pelo router) |
| `_components/` | Pasta de componentes (prefixo `_` = ignorada pelo router) |

## Criar uma rota nova

### 1. Rota pública (sem autenticação)

```
src/routes/
└── auth/
    └── forgot-password/
        └── index.tsx
```

```tsx
// src/routes/auth/forgot-password/index.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/auth/forgot-password/')({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return <div>...</div>;
}
```

### 2. Rota protegida (dentro de `_platform`)

Qualquer arquivo dentro de `_platform/` é automaticamente protegido pelo guard de sessão do `_platform/route.tsx`.

```
src/routes/
└── _platform/
    └── reports/
        └── index.tsx
```

```tsx
// src/routes/_platform/reports/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';

export const Route = createFileRoute('/_platform/reports/')({
  component: ReportsPage,
});

function ReportsPage() {
  const { t } = useTranslation();
  useSetPlatformHeader({ title: t('screens.reports.title') });
  return <div>...</div>;
}
```

### 3. Rota com parâmetro dinâmico

```
src/routes/
└── _platform/
    └── users/
        └── $userId/
            └── index.tsx
```

```tsx
export const Route = createFileRoute('/_platform/users/$userId/')({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { userId } = Route.useParams();
  // userId é string — converta para number se necessário
}
```

### 4. `beforeLoad` vs `loader`

**`beforeLoad`** — executa antes de renderizar, ideal para guards e redirects:
```tsx
export const Route = createFileRoute('/_platform/')({
  beforeLoad: handleSession,  // redireciona se sem sessão
  component: DashboardPage,
});
```

**`loader`** — prefetch de dados antes de renderizar a página:
```tsx
export const Route = createFileRoute('/_platform/reports/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: reportsQueryKeys.all,
      queryFn: () => reportsController.list(),
    }),
  component: ReportsPage,
});
```

Use `loader` quando os dados são críticos para a página (evita loading state). Use `useQuery` (no controller) quando os dados são secundários ou carregados após render.

## Proteção de rota (session guard)

O guard está em `src/shared/handlers/handle-session.ts`:

```ts
// Para rotas protegidas: redireciona para /auth se não tem sessão
export async function handleSession(_opts) {
  if (!document.cookie.includes('session')) throw redirect({ to: '/auth' });
}

// Para rota de login: redireciona para / se já tem sessão
export async function handleSessionInAuth(_opts) {
  if (document.cookie.includes('session')) throw redirect({ to: '/' });
}
```

- `handleSession` → use em `_platform/route.tsx` (já está aplicado) ou em rota específica fora do grupo
- `handleSessionInAuth` → use na rota de login para evitar acesso duplicado

## Configurar o header da página

Use `useSetPlatformHeader` no início do componente de página dentro de `_platform`:

```tsx
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';

function MyPage() {
  const { t } = useTranslation();

  useSetPlatformHeader({
    title: t('screens.my_page.title'),
    rightAction: <Button>Novo item</Button>, // opcional — aparece no canto direito do header
  });
}
```

## Adicionar item no sidebar

Edite `src/shared/components/layout/sidebar.tsx`:

```tsx
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LuLayoutDashboard },
  { label: 'Posts', to: '/posts', icon: LuFileText },
  { label: 'Users', to: '/users', icon: LuUsers },
  { label: 'Reports', to: '/reports', icon: LuBarChart }, // ← adicione aqui
];
```

Ícones vêm de `react-icons/lu` (Lucide). Use sempre do mesmo pacote para consistência.

## URL search params com nuqs

Use `nuqs` para sincronizar filtros e busca com a URL (persiste no histórico do browser):

```tsx
import { useQueryState, parseAsString } from 'nuqs';

function UsersPage() {
  // ?search=john fica na URL — funciona com back/forward do browser
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));

  // ❌ não use useState para filtros que devem ser compartilháveis via URL
  // const [search, setSearch] = useState('');
}
```

**Quando usar `nuqs` vs `useState`:**
- `nuqs` → filtros, busca, paginação, qualquer estado que o usuário possa querer bookmarkar ou compartilhar
- `useState` → estado local de UI (modal aberto, item selecionado, toggle)

## Infinite scroll / paginação

Use `useInfiniteQuery` para listas com carregamento progressivo. O padrão completo está documentado em `src/routes/_platform/posts/CLAUDE.md`.

```ts
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['items'],
  queryFn: ({ pageParam }) => controller.list({ skip: pageParam, limit: LIMIT }),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
  },
});

// "aplainar" as páginas em uma lista única
const allItems = data?.pages.flatMap((page) => page.items) ?? [];
```
