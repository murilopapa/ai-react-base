# CLAUDE.md — Feature Users (referência canônica)

Esta é a **feature de referência** do projeto. Siga este padrão exatamente ao criar qualquer nova feature.

## Visão geral da feature

- **API**: JSONPlaceholder (`/placeholder/` → `https://jsonplaceholder.typicode.com`)
- **Tela**: grid de cards de usuário com busca client-side e drawer lateral de detalhes
- **Tabs no drawer**: Posts e Álbuns do usuário

## Arquitetura em camadas

```
index.tsx (View)
    ↓ chama hooks de
-users.controller.ts (React Query hooks)
    ↓ chama
-users.use-case.ts (orquestração, regras de negócio)
    ↓ chama
-users.repository.ts (chamadas HTTP com HttpClient)
    ↓ valida com
-users.schema.ts (schemas Zod + tipos TypeScript)
```

**Responsabilidade de cada camada:**

| Arquivo | Responsabilidade |
|---------|-----------------|
| `schema` | Definir a forma dos dados. Só Zod aqui. |
| `repository` | Fazer chamadas HTTP. Retorna `Result`. Sem lógica. |
| `use-case` | Orquestrar chamadas. Pode combinar múltiplos repositories. |
| `controller` | Expor hooks React Query. Converter `Result` em throw para o Query. |
| `_components/` | Componentes visuais da feature. Recebem dados via props. |
| `index.tsx` | Monta a tela. Usa hooks do controller. Gerencia estado de UI (ex: selectedUser). |

## Convenção de nomenclatura

```
-users.schema.ts        # prefixo "-" = ignorado pelo TanStack Router
-users.repository.ts
-users.use-case.ts
-users.controller.ts
_components/            # prefixo "_" = pasta auxiliar, não vira rota
    user-card.tsx       # kebab-case, nome descritivo
    user-drawer.tsx
    user-posts-tab.tsx
    user-albums-tab.tsx
index.tsx               # página principal da rota
```

## Criar uma nova feature — passo a passo

### 1. Criar os schemas Zod

```ts
// -products.schema.ts
import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});

export const ProductsResponseSchema = z.array(ProductSchema);

export type Product = z.infer<typeof ProductSchema>;
```

**Regra:** todo tipo TypeScript vem de `z.infer<>`. Nunca declare tipos manualmente para dados de API.

### 2. Criar o repository

```ts
// -products.repository.ts
import { getInstance } from '@/shared/http/axios.http';
import { type Product, ProductSchema, ProductsResponseSchema } from './-products.schema';

const HTTP = getInstance({ baseURL: '/api/', withCredentials: false });

export const productsRepository = {
  list: () => HTTP.get<Product[]>('products', ProductsResponseSchema),
  getById: (id: number) => HTTP.get<Product>(`products/${id}`, ProductSchema),
  create: (data: Omit<Product, 'id'>) =>
    HTTP.post<Product>('products', data, ProductSchema),
};
```

**Regras:**
- Sempre passe o schema Zod como segundo argumento do `HTTP.get/post/put/patch/delete`
- Sem lógica aqui — apenas chamadas HTTP
- `getInstance` reutiliza a mesma instância Axios para a mesma `baseURL`

### 3. Criar o use-case

```ts
// -products.use-case.ts
import { productsRepository } from './-products.repository';

export const productsUseCase = {
  list: () => productsRepository.list(),
  getById: (id: number) => productsRepository.getById(id),
};
```

Se houver lógica de negócio (ex: filtrar, calcular, combinar dois repositórios), ela vai aqui.

### 4. Criar o controller com React Query

```ts
// -products.controller.ts
import { useQuery } from '@tanstack/react-query';
import { productsUseCase } from './-products.use-case';

export const productsQueryKeys = {
  all: ['products'] as const,
  detail: (id: number) => ['products', id] as const,
};

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKeys.all,
    queryFn: async () => {
      const result = await productsUseCase.list();
      return result.getOrElse((error) => { throw error; }).data;
    },
  });
}
```

**Regra:** o `getOrElse` converte o `Result` em throw — o TanStack Query captura e coloca em `isError`.

### 5. Criar componentes em `_components/`

Use componentes shadcn. Props tipadas com os tipos dos schemas:

```tsx
// _components/product-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { Product } from '../-products.schema';

type ProductCardProps = {
  product: Product;
  onClick: (product: Product) => void;
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card className="cursor-pointer hover:ring-2 hover:ring-primary/50" onClick={() => onClick(product)}>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">R$ {product.price}</p>
      </CardContent>
    </Card>
  );
}
```

### 6. Criar a página `index.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';
import { useProducts } from './-products.controller';

export const Route = createFileRoute('/_platform/products/')({
  component: ProductsPage,
});

function ProductsPage() {
  useSetPlatformHeader({ title: 'Products' });
  const { data, isLoading, isError } = useProducts();
  // ...
}
```

### 7. Adicionar ao sidebar e i18n

Ver `src/routes/CLAUDE.md` para sidebar.
Ver `src/shared/CLAUDE.md` para i18n.

## Padrão de Drawer com Tabs

O `user-drawer.tsx` é o padrão para drawers com abas:
- `Drawer` + `DrawerContent` com `direction="right"`
- `Tabs` dentro do drawer com `overflow-y-auto` em cada `TabsContent`
- Dados carregados por query separada dentro de cada tab (lazy loading automático pelo `enabled`)

## Estado de UI local

Estado que não precisa persistir (ex: `selectedUser`, `isOpen`) fica no `index.tsx` via `useState`. Não use Zustand/Context para isso.
