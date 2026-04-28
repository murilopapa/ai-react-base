# CLAUDE.md — src/routes/

## Como funciona o roteamento

O projeto usa **TanStack Router com file-based routing**. O Vite plugin (`@tanstack/router-plugin`) gera `src/routeTree.gen.ts` automaticamente ao detectar mudanças nos arquivos de rota.

### Convenções de nome de arquivo

| Padrão | Significado |
|--------|------------|
| `__root.tsx` | Layout raiz — envolve toda a aplicação |
| `_platform/` | Grupo de rotas protegidas (prefixo `_` = sem segmento de URL) |
| `route.tsx` | Define o layout/loader do segmento sem ser uma página |
| `index.tsx` | Página padrão do segmento |
| `$postId/` | Segmento dinâmico (parâmetro de rota) |
| `-post.controller.ts` | Arquivo auxiliar (prefixo `-` = ignorado pelo router) |

## Criar uma rota nova

### 1. Rota pública

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

```
src/routes/
└── _platform/
    └── reports/
        └── index.tsx
```

```tsx
// src/routes/_platform/reports/index.tsx
import { createFileRoute } from '@tanstack/react-router';
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';

export const Route = createFileRoute('/_platform/reports/')({
  component: ReportsPage,
});

function ReportsPage() {
  useSetPlatformHeader({ title: 'Reports' });
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
  // ...
}
```

### 4. Rota com loader (prefetch de dados)

Use loader quando os dados são necessários antes de renderizar a página:

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

Use `useQuery` (no controller) quando os dados são carregados após renderização.

## Configurar o header da página

Use `useSetPlatformHeader` no início do componente de página:

```tsx
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';

function MyPage() {
  const { t } = useTranslation();

  useSetPlatformHeader({
    title: t('screens.my_page.title'),
    rightAction: <Button>Novo item</Button>, // opcional
  });
}
```

## Adicionar no sidebar

Edite `src/shared/components/layout/sidebar.tsx`:

```tsx
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LuLayoutDashboard },
  { label: 'Posts', to: '/posts', icon: LuFileText },
  { label: 'Users', to: '/users', icon: LuUsers },
  { label: 'Reports', to: '/reports', icon: LuBarChart }, // adicione aqui
];
```

## Proteção de rota (session guard)

O guard de sessão está em `src/shared/handlers/handle-session.ts` e é aplicado no `route.tsx` do grupo `_platform`. Qualquer rota dentro de `_platform/` já está automaticamente protegida.
