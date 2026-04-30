# CLAUDE.md — src/shared/components/ui/

Componentes de UI do projeto. Mistura de **shadcn/ui com Base UI** (novos, base Tailwind) e **Chakra UI** (legados).

## Stack de UI (novo)

Os componentes novos usam **3 camadas**:

| Camada | Lib | Papel |
|--------|-----|-------|
| Primitivos headless | `@base-ui/react` | Acessibilidade, comportamento (substitui Radix UI) |
| Estilo | Tailwind v4 + CVA | Classes, variantes, tokens |
| Wrapper | shadcn/ui (padrão) | API amigável, composição |

> **Não é o shadcn tradicional com Radix UI.** Esta configuração usa `@base-ui/react` como primitivo. A API dos componentes é praticamente idêntica — a diferença é interna. O `Drawer` é exceção: usa `vaul`.

## Regra

**Todo componente novo usa este padrão (shadcn + Base UI).** Antes de criar do zero, verifique se existe no shadcn:

```bash
npx shadcn@latest add <nome>
# Exemplos: npx shadcn@latest add date-picker
#           npx shadcn@latest add combobox
#           npx shadcn@latest add data-table
```

O arquivo vai para `src/shared/components/ui/` automaticamente.

## Componentes shadcn instalados

### Ação / Interação

| Componente | Arquivo | Uso |
|-----------|---------|-----|
| `Button` | `button.tsx` | Botões com variants: default, outline, secondary, ghost, destructive, link |
| `Checkbox` | `checkbox.tsx` | Checkbox com label |
| `Select` | `select.tsx` | Dropdown de seleção |

### Layout / Estrutura

| Componente | Arquivo | Uso |
|-----------|---------|-----|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | `card.tsx` | Superfície de card composável |
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | `tabs.tsx` | Navegação por abas |
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `table.tsx` | Tabela de dados |
| `DataTable` | `data-table.tsx` | Tabela avançada (sorting, filtering) |

### Formulário

| Componente | Arquivo | Uso |
|-----------|---------|-----|
| `Input` | `input.tsx` | Campo de texto |
| `Label` | `label.tsx` | Label acessível |
| `Field` | `field.tsx` | Wrapper de campo com label + erro |
| `InputGroup` | `input-group.tsx` | Input com ícone/elemento no início ou fim |
| `PasswordInput` | `password-input.tsx` | Input de senha com toggle de visibilidade |
| `MaskedInput` | `masked-input.tsx` | Input com máscara (CPF, telefone, etc.) |

### Feedback / Overlay

| Componente | Arquivo | Uso |
|-----------|---------|-----|
| `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogFooter` | `dialog.tsx` | Modal de diálogo |
| `Drawer`, `DrawerContent`, `DrawerHeader`, `DrawerTitle` | `drawer.tsx` | Painel lateral deslizante |
| `Tooltip`, `TooltipContent`, `TooltipTrigger` | `tooltip.tsx` | Dica ao hover |
| `Skeleton` | `skeleton.tsx` | Placeholder de loading |
| `Badge` | `badge.tsx` | Tag/etiqueta |
| `Avatar`, `AvatarImage`, `AvatarFallback` | `avatar.tsx` | Avatar de usuário |
| `Status` | `status.tsx` | Indicador de status (ponto colorido) |

### Toast

```tsx
import { toast } from 'sonner';

toast.success('Salvo!');
toast.error('Erro ao salvar.');
toast.loading('Processando...');
```

O `<Toaster />` já está em `__root.tsx`. **Não adicione em outras páginas.**

### Utilitários

| Componente | Arquivo | Uso |
|-----------|---------|-----|
| `Provider` | `provider.tsx` | ChakraProvider wrapper — já usado no `main.tsx` |
| `ColorMode` | `color-mode.tsx` | Toggle dark/light (não em uso ativo — dark-first) |
| `CloseButton` | `close-button.tsx` | Botão X para fechar overlays |

## Como usar: exemplos por categoria

### Button

```tsx
import { Button } from '@/shared/components/ui/button';

<Button>Salvar</Button>
<Button variant="outline">Cancelar</Button>
<Button variant="destructive">Deletar</Button>
<Button variant="ghost" size="sm">...</Button>
<Button disabled>Processando</Button>
```

Variants disponíveis: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`
Sizes: `sm`, `default`, `lg`, `icon`

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo aqui
  </CardContent>
</Card>
```

### Dialog (modal)

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título do modal</DialogTitle>
    </DialogHeader>
    {/* conteúdo */}
  </DialogContent>
</Dialog>
```

### Drawer (painel lateral)

```tsx
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/components/ui/drawer';

<Drawer open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>{selectedItem?.name}</DrawerTitle>
    </DrawerHeader>
    {/* conteúdo */}
  </DrawerContent>
</Drawer>
```

### Tabs (com lazy loading)

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/components/ui/tabs';

<Tabs defaultValue="info">
  <TabsList>
    <TabsTrigger value="info">Informações</TabsTrigger>
    <TabsTrigger value="posts">Posts</TabsTrigger>
  </TabsList>
  <TabsContent value="info">...</TabsContent>
  <TabsContent value="posts">
    {/* useQuery com enabled={activeTab === 'posts'} para lazy load */}
    <PostsTab userId={user.id} />
  </TabsContent>
</Tabs>
```

### Skeleton (loading)

```tsx
import { Skeleton } from '@/shared/components/ui/skeleton';

{isLoading ? (
  <div className="grid grid-cols-3 gap-4">
    {Array.from({ length: 6 }).map((_, i) => (
      <Skeleton key={i} className="h-32 rounded-lg" />
    ))}
  </div>
) : (
  <UserGrid users={users} />
)}
```

## Padrão CVA para variantes

Ao criar um componente com variantes, use `cva`:

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        muted: 'bg-muted text-muted-foreground',
        destructive: 'bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

type MyBadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function MyBadge({ variant, className, ...props }: MyBadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

## Componentes Chakra (legado)

Componentes antigos (posts, auth, layout) usam Chakra UI. **Não remova** — migre apenas quando a tela for reescrita em shadcn.

Os dois sistemas coexistem sem conflito porque:
- Chakra usa CSS-in-JS próprio
- shadcn usa Tailwind com CSS variables
- As CSS variables são compartilhadas via `globals.css`
