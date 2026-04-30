# CLAUDE.md — src/shared/components/layout/

Componentes de layout da área protegida (`_platform`). Define a estrutura visual com sidebar + header + conteúdo.

## Hierarquia de layout

```
src/routes/__root.tsx
  └─ Outlet
      ├─ src/routes/auth/ (layout sem sidebar)
      └─ src/routes/_platform/route.tsx
              └─ PlatformLayout
                  ├─ Sidebar (fixa, 256px, esquerda)
                  └─ Box (ml-64)
                      ├─ TopHeader (sticky, 64px topo)
                      └─ Box (p-8, conteúdo da página)
                          └─ <Outlet /> ← página renderizada aqui
```

## Arquivos

| Arquivo | Responsabilidade |
|---------|-----------------|
| `platform-layout.tsx` | Composição de Sidebar + TopHeader + Outlet |
| `platform-context.tsx` | Context com título e rightAction do header |
| `sidebar.tsx` | Navegação lateral fixa |
| `top-header.tsx` | Header com título, busca e ação direita |

## platform-context.tsx

Gerencia o título e `rightAction` do TopHeader de forma dinâmica. Cada página define seu próprio header ao montar.

### Hook `useSetPlatformHeader`

```tsx
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';

function MyPage() {
  const { t } = useTranslation();

  useSetPlatformHeader({
    title: t('screens.my_page.title'),         // obrigatório
    rightAction: <Button>Criar</Button>,        // opcional
  });

  return <div>...</div>;
}
```

**Como funciona internamente:**
- Chama `setTitle` e `setRightAction` via `useLayoutEffect`
- Usa `useRef` para o `rightAction` para evitar re-renders infinitos (JSX recria o objeto a cada render)
- Ao desmontar o componente, limpa título e rightAction (retorno do `useLayoutEffect`)

**Regra:** Chame sempre no início do componente de página, antes de qualquer return condicional.

## sidebar.tsx

Sidebar fixa com navegação principal e navegação de sistema.

### Como adicionar item de navegação

Edite o array `NAV_ITEMS` em `src/shared/components/layout/sidebar.tsx`:

```tsx
import { LuBarChart } from 'react-icons/lu'; // ícone Lucide

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LuLayoutDashboard },
  { label: 'Posts', to: '/posts', icon: LuFileText },
  { label: 'Users', to: '/users', icon: LuUsers },
  { label: 'Reports', to: '/reports', icon: LuBarChart }, // ← adicione aqui
];
```

**Regras:**
- Use sempre ícones de `react-icons/lu` (Lucide) para consistência
- O `to` deve corresponder exatamente à rota criada em `_platform/`
- `label` é o texto exibido — não usa i18n (sidebar usa labels hardcoded)

### Itens de sistema

`SYSTEM_ITEMS` (Settings, Help) ficam separados na parte inferior. Adicione lá itens de configuração, não features:

```tsx
const SYSTEM_ITEMS: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: LuSettings },
  { label: 'Help', to: '/help', icon: LuCircleHelp },
];
```

### Detecção de rota ativa

```tsx
function isActive(to: string) {
  if (to === '/') return pathname === '/';
  return pathname.startsWith(to); // /users e /users/123 ativam o mesmo item
}
```

## top-header.tsx

Header fixo no topo da área de conteúdo. Renderiza:
- **Título** — vem do `PlatformContext` (definido por `useSetPlatformHeader`)
- **Campo de busca** — presente mas sem lógica implementada (placeholder)
- **Sino de notificação** — presente mas sem lógica implementada (placeholder)
- **rightAction** — slot livre para botão de ação da página (ex: "Criar usuário")

### `rightAction` vs botão dentro da página

| Quando usar `rightAction` | Quando usar botão na página |
|---|---|
| Ação primária de criação (ex: "Novo usuário") | Ação contextual de um card/item |
| Ação que o usuário esperaria no header | Ação de formulário (submit) |
| Ação que sempre está visível | Ação que aparece condicionalmente |

```tsx
// ✅ rightAction — ação primária da tela
useSetPlatformHeader({
  title: 'Usuários',
  rightAction: <Button onClick={() => setCreateOpen(true)}>Novo usuário</Button>,
});

// ✅ botão na página — ação de um item específico
<Button variant="outline" size="sm" onClick={() => handleEdit(user)}>Editar</Button>
```

## Dimensões do layout

```
Sidebar:   width: 256px (w-64), position: fixed, z: sticky (1100)
TopHeader: height: 64px (h-16), position: sticky top-0, z: sticky
Conteúdo:  margin-left: 256px, padding-top: 64px, padding: 32px (p-8)
```

Ao criar componentes dentro de páginas, considere que o espaço útil já descontou sidebar e header.
