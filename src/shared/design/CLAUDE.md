# CLAUDE.md — src/shared/design/

Design system do projeto. Tokens centralizados que mapeiam para CSS variables definidas em `src/styles/globals.css`.

## Regra principal

**Nunca use valores hardcoded de cor, espaçamento ou tamanho de fonte.** Use sempre classes Tailwind (que mapeiam os tokens) ou as variáveis CSS diretamente.

```tsx
// ✅ correto — classe Tailwind mapeada para token
<div className="bg-card text-foreground border border-border rounded-lg p-4" />

// ❌ errado — valor hardcoded
<div style={{ backgroundColor: '#1a202e', color: '#f1f5f9' }} />
```

## Cores semânticas

As variáveis são definidas em `:root` em `src/styles/globals.css` e mapeadas para utilitários Tailwind via `@theme inline`.

| CSS Variable | Classe Tailwind | Valor hex | Uso |
|---|---|---|---|
| `--background` | `bg-background` | `#101922` | Fundo da página |
| `--foreground` | `text-foreground` | `#f1f5f9` | Texto principal |
| `--card` | `bg-card` | `#1a202e` | Superfície de card |
| `--card-foreground` | `text-card-foreground` | `#f1f5f9` | Texto em card |
| `--popover` | `bg-popover` | `#1a202e` | Popovers e dropdowns |
| `--primary` | `bg-primary`, `text-primary` | `#137fec` | Cor de destaque, ações principais |
| `--primary-foreground` | `text-primary-foreground` | `#ffffff` | Texto sobre primário |
| `--secondary` | `bg-secondary` | `#1e2a3a` | Elementos secundários |
| `--muted` | `bg-muted` | `#1e2a3a` | Fundo sutil |
| `--muted-foreground` | `text-muted-foreground` | `#94a3b8` | Texto secundário |
| `--accent` | `bg-accent` | `#1e2a3a` | Hover states |
| `--destructive` | `bg-destructive`, `text-destructive` | `#ef4444` | Erros, ações destrutivas |
| `--border` | `border-border`, `divide-border` | `#2a3245` | Bordas |
| `--ring` | `ring-ring` | `#137fec` | Focus ring |

### Tokens TypeScript

Para usar tokens em código TypeScript (ex: inline styles, configs de biblioteca):

```ts
import { colors, rawColors, radius, shadows } from '@/shared/design';

// colors referencia as CSS variables (funciona com dark/light mode)
colors.primary        // 'var(--primary)'
colors.muted          // 'var(--muted)'
colors.destructive    // 'var(--destructive)'

// rawColors tem valores hex (para quando CSS vars não funcionam — ex: canvas, svg)
rawColors.primary     // '#137fec'
rawColors.background  // '#101922'
rawColors.card        // '#1a202e'
```

## Tipografia

### Escala de tamanho de fonte

| Token | Classe Tailwind | Valor |
|-------|----------------|-------|
| `fontSize.xs` | `text-xs` | 12px (0.75rem) |
| `fontSize.sm` | `text-sm` | 14px (0.875rem) |
| `fontSize.base` | `text-base` | 16px (1rem) |
| `fontSize.lg` | `text-lg` | 18px (1.125rem) |
| `fontSize.xl` | `text-xl` | 20px (1.25rem) |
| `fontSize['2xl']` | `text-2xl` | 24px (1.5rem) |
| `fontSize['3xl']` | `text-3xl` | 30px (1.875rem) |
| `fontSize['4xl']` | `text-4xl` | 36px (2.25rem) |
| `fontSize['5xl']` | `text-5xl` | 48px (3rem) |

### Pesos de fonte

| Token | Classe Tailwind | Valor |
|-------|----------------|-------|
| `fontWeight.normal` | `font-normal` | 400 |
| `fontWeight.medium` | `font-medium` | 500 |
| `fontWeight.semibold` | `font-semibold` | 600 |
| `fontWeight.bold` | `font-bold` | 700 |

### Famílias de fonte

- **Sans (padrão):** Inter — `font-sans`
- **Mono:** JetBrains Mono / Fira Code — `font-mono`

```ts
import { fontSize, fontWeight, lineHeight } from '@/shared/design';
// use apenas quando Tailwind não for suficiente (ex: config de lib terceira)
```

## Espaçamento

Escala base de **4px**. Via Tailwind: `p-4` = 16px, `gap-6` = 24px, `m-2` = 8px.

| Token | Classe Tailwind | Valor |
|-------|----------------|-------|
| `spacing[0]` | `p-0`, `m-0`, `gap-0` | 0px |
| `spacing[1]` | `p-1`, `m-1`, `gap-1` | 4px |
| `spacing[2]` | `p-2`, `m-2`, `gap-2` | 8px |
| `spacing[3]` | `p-3`, `m-3`, `gap-3` | 12px |
| `spacing[4]` | `p-4`, `m-4`, `gap-4` | 16px |
| `spacing[5]` | `p-5`, `m-5`, `gap-5` | 20px |
| `spacing[6]` | `p-6`, `m-6`, `gap-6` | 24px |
| `spacing[8]` | `p-8`, `m-8`, `gap-8` | 32px |
| `spacing[10]` | `p-10`, `m-10`, `gap-10` | 40px |
| `spacing[12]` | `p-12`, `m-12`, `gap-12` | 48px |
| `spacing[16]` | `p-16`, `m-16`, `gap-16` | 64px |
| `spacing[20]` | `p-20`, `m-20`, `gap-20` | 80px |
| `spacing[24]` | `p-24`, `m-24`, `gap-24` | 96px |

## Border radius

```tsx
// Tailwind
<div className="rounded-sm" />   // calc(var(--radius) - 4px) ≈ 4px
<div className="rounded-md" />   // calc(var(--radius) - 2px) ≈ 6px
<div className="rounded-lg" />   // var(--radius) = 0.5rem (8px)
<div className="rounded-xl" />   // calc(var(--radius) + 4px) ≈ 12px
<div className="rounded-full" /> // 9999px
```

## Sombras

```tsx
<div className="shadow-sm" />   // sutil (cards flat)
<div className="shadow-md" />   // cards, botões
<div className="shadow-lg" />   // dropdowns, popovers
<div className="shadow-xl" />   // modais, drawers
```

## Z-index

| Token | Valor | Uso |
|-------|-------|-----|
| `zIndex.hide` | -1 | Esconder atrás de outros elementos |
| `zIndex.base` | 0 | Fluxo normal |
| `zIndex.overlay` | 1000 | Overlays de fundo |
| `zIndex.sticky` | 1100 | Headers e sidebars fixos |
| `zIndex.modal` | 1300 | Modais e dialogs |
| `zIndex.toast` | 1500 | Toasts (sempre na frente) |

```ts
import { zIndex } from '@/shared/design';
// use apenas quando Tailwind não for suficiente
```

## Breakpoints

```
sm  640px   md  768px   lg  1024px   xl  1280px   2xl  1536px
```

```tsx
// Grid responsivo padrão do projeto
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
```

## Icon sizes (Chakra theme)

Importados de `src/shared/theme/theme.ts`. Use quando passar tamanho para `react-icons`:

```ts
import { iconSizes } from '@/shared/theme/theme';

<LuUsers size={iconSizes.s18} />   // 18px — padrão para nav items
<LuEye size={iconSizes.s14} />     // 14px — ícones inline em texto
<LuPlus size={iconSizes.s20} />    // 20px — botões de ação
```

| Constante | Valor |
|-----------|-------|
| `iconSizes.s14` | 14 |
| `iconSizes.s16` | 16 |
| `iconSizes.s18` | 18 |
| `iconSizes.s20` | 20 |
| `iconSizes.s24` | 24 |
| `iconSizes.s28` | 28 |
| `iconSizes.s32` | 32 |
| `iconSizes.s48` | 48 |

## Dark mode

O projeto é **dark-first** — todos os tokens já estão calibrados para dark mode em `:root`.

Se futuramente implementar light mode, adicione um seletor `.light` ou `[data-theme=light]` em `globals.css` sobrescrevendo as variáveis. Não há nada mais a fazer no código dos componentes.

## Variantes de componente com CVA

Para criar um componente shadcn com múltiplas variantes:

```ts
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const statusVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        active: 'bg-primary/10 text-primary',
        inactive: 'bg-muted text-muted-foreground',
        error: 'bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { status: 'active' },
  }
);

type StatusBadgeProps = VariantProps<typeof statusVariants> & { className?: string };

function StatusBadge({ status, className }: StatusBadgeProps) {
  return <span className={cn(statusVariants({ status }), className)} />;
}
```
