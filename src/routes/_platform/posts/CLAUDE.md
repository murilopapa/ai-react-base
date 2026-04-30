# CLAUDE.md — src/routes/_platform/posts/

Feature de listagem de posts usando a API `dummyjson.com`. É uma **feature legada** (usa Chakra UI) e serve como **referência canônica para o padrão de infinite scroll** com `useInfiniteQuery`.

## Estrutura

```
src/routes/_platform/posts/
├── index.tsx              # Página de listagem com infinite scroll
├── -post.schema.ts        # Zod schemas + tipos
├── -post.repository.ts    # Chamadas HTTP
├── -post.use-case.ts      # Orquestração de negócio
├── -post.controller.ts    # Funções diretas (sem hooks — padrão simplificado)
└── $postId/
    └── index.tsx          # Página de detalhe do post
```

> **Nota:** Posts usa `postController` como objeto com funções assíncronas (sem hooks de Query). A Query é feita direto no `index.tsx` com `useInfiniteQuery`. Isso é uma variação do padrão canônico de Users — ambos são válidos.

## Schema da resposta (dummyjson.com)

```ts
// -post.schema.ts
const PostsResponseSchema = z.object({
  posts: z.array(PostSchema),
  total: z.number(),   // total de itens no servidor
  skip: z.number(),    // quantos foram pulados (offset)
  limit: z.number(),   // quantos foram retornados nesta página
});
```

A API de paginação usa `skip` (offset) + `limit` (tamanho da página).

## Padrão de infinite scroll

### 1. Controller (funções simples, sem hooks)

```ts
// -post.controller.ts
export const postController = {
  list: async (params: { limit: number; skip: number }) => {
    const result = await postUseCase.list(params);
    return result.getOrElse((error) => { throw error; }).data;
  },
};
```

### 2. `useInfiniteQuery` na página

```tsx
// index.tsx
const LIMIT = 10;

const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
  queryKey: ['posts'],
  queryFn: ({ pageParam }) => postController.list({ limit: LIMIT, skip: pageParam }),
  initialPageParam: 0,
  getNextPageParam: (lastPage) => {
    const nextSkip = lastPage.skip + lastPage.limit;
    return nextSkip < lastPage.total ? nextSkip : undefined;
    // retorna undefined quando acabaram os itens → hasNextPage = false
  },
});

// "aplainar" as páginas em uma lista única
const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];
```

### 3. Scroll automático com IntersectionObserver

O projeto usa um **sentinel element** — um `<div>` invisível no fim da lista. Quando ele entra no viewport, a próxima página é carregada:

```tsx
const sentinelRef = useRef<HTMLDivElement>(null);

const handleIntersect = useCallback(
  (entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },
  [hasNextPage, isFetchingNextPage, fetchNextPage],
);

useEffect(() => {
  const el = sentinelRef.current;
  if (!el) return;
  const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
  observer.observe(el);
  return () => observer.disconnect();
}, [handleIntersect]);

// No JSX, no final da lista:
<Box ref={sentinelRef} py="2" />
```

### 4. Botão "Load more" (alternativa ao scroll automático)

Para listas onde o usuário deve controlar o carregamento manualmente:

```tsx
{hasNextPage && !isFetchingNextPage && (
  <Button variant="outline" onClick={() => fetchNextPage()}>
    {t('screens.posts.load_more')}
  </Button>
)}
```

### 5. Estados da lista

```tsx
{isLoading && <Spinner />}

{allPosts.map((post) => <PostCard key={post.id} post={post} />)}

{/* Sentinel para auto-load */}
<div ref={sentinelRef} />

{isFetchingNextPage && <Spinner />}

{!hasNextPage && allPosts.length > 0 && (
  <Text>{t('screens.posts.no_more')}</Text>
)}
```

## Quando usar infinite scroll vs paginação numérica

| Cenário | Solução |
|---------|---------|
| Feed / lista longa sem salto de posição | Infinite scroll (este padrão) |
| Tabela com navegação por número de página | Paginação numérica (`useQuery` com `page` param) |
| Busca com resultado finito | `useQuery` simples |

## Proxy da API

Posts usam o proxy `/api` → `https://dummyjson.com`:

```ts
// -post.repository.ts
const HTTP = getInstance({ baseURL: '/api/' });
const result = await HTTP.get('posts', PostsResponseSchema, { params: { limit, skip } });
```
