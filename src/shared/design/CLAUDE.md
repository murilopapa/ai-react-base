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

## CSS Variables (globals.css)

As variáveis são definidas em `:root` em `src/styles/globals.css` e mapeadas para utilitários Tailwind via `@theme inline`.

### Cores semânticas disponíveis como classes Tailwind

| CSS Variable | Classe Tailwind | Uso |
|---|---|---|
| `--background` | `bg-background` | Fundo da página |
| `--foreground` | `text-foreground` | Texto principal |
| `--card` | `bg-card` | Superfície de card |
| `--card-foreground` | `text-card-foreground` | Texto em card |
| `--popover` | `bg-popover` | Popovers e dropdowns |
| `--primary` | `bg-primary`, `text-primary` | Cor de destaque |
| `--primary-foreground` | `text-primary-foreground` | Texto sobre primário |
| `--secondary` | `bg-secondary` | Elementos secundários |
| `--muted` | `bg-muted` | Fundo sutil |
| `--muted-foreground` | `text-muted-foreground` | Texto secundário |
| `--accent` | `bg-accent` | Hover states |
| `--destructive` | `bg-destructive`, `text-destructive` | Erros e ações destrutivas |
| `--border` | `border-border`, `divide-border` | Bordas |
| `--ring` | `ring-ring` | Focus ring |

### Tokens TypeScript

Para usar tokens em código TypeScript (ex: inline styles, configs de biblioteca):

```ts
import { colors, radius, shadows } from '@/shared/design';

// colors referencia as CSS variables
colors.primary        // 'var(--primary)'
colors.muted          // 'var(--muted)'
colors.destructive    // 'var(--destructive)'

// rawColors tem os valores hex (para quando CSS vars não funcionam)
rawColors.primary     // '#137fec'
rawColors.background  // '#101922'
```

## Tokens de tipografia

```ts
import { fontSize, fontWeight, lineHeight } from '@/shared/design';

fontSize.xs     // '0.75rem'  (12px)
fontSize.sm     // '0.875rem' (14px)
fontSize.base   // '1rem'     (16px)
fontSize.lg     // '1.125rem' (18px)
fontSize.xl     // '1.25rem'  (20px)
fontSize['2xl'] // '1.5rem'   (24px)

fontWeight.normal    // '400'
fontWeight.medium    // '500'
fontWeight.semibold  // '600'
fontWeight.bold      // '700'
```

Via Tailwind: `text-sm`, `text-base`, `text-lg`, `font-medium`, `font-semibold`, etc.

## Tokens de espaçamento

Escala base de 4px. Via Tailwind: `p-4` = 16px, `gap-6` = 24px, `m-2` = 8px.

```ts
import { spacing } from '@/shared/design';
spacing[4]   // '1rem'    (16px)
spacing[6]   // '1.5rem'  (24px)
spacing[8]   // '2rem'    (32px)
```

## Border radius

```tsx
// Tailwind
<div className="rounded-sm" />  // calc(var(--radius) - 4px)
<div className="rounded-md" />  // calc(var(--radius) - 2px)
<div className="rounded-lg" />  // var(--radius) = 0.5rem
<div className="rounded-xl" />  // calc(var(--radius) + 4px)
<div className="rounded-full" />
```

## Sombras

```tsx
<div className="shadow-sm" />
<div className="shadow-md" />
<div className="shadow-lg" />
<div className="shadow-xl" />
```

## Breakpoints

```
sm  640px   md  768px   lg  1024px   xl  1280px   2xl  1536px
```

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />
```

## Dark mode

O projeto é **dark-first** — todos os tokens já estão calibrados para dark mode em `:root`.
Se futuramente implementar light mode, adicione um seletor `.light` ou `[data-theme=light]` em `globals.css` sobrescrevendo as variáveis.

## Componentes shadcn — variantes com CVA

Para criar variantes de um componente shadcn customizado:

```ts
import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const statusVariants = cva('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    status: {
      active: 'bg-success/10 text-success',
      inactive: 'bg-muted text-muted-foreground',
      error: 'bg-destructive/10 text-destructive',
    },
  },
  defaultVariants: { status: 'active' },
});
```
