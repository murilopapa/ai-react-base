# CLAUDE.md — src/shared/

Utilitários, componentes e infraestrutura compartilhados por todas as features.

## HttpClient

### Como usar

```ts
import { getInstance } from '@/shared/http/axios.http';

// Cria ou reutiliza instância para a baseURL
const HTTP = getInstance({ baseURL: '/api/', withCredentials: false });

// GET com schema Zod (obrigatório)
const result = await HTTP.get<Post[]>('posts', PostsSchema);

// GET com query params
const result = await HTTP.get<PostsResponse>('posts', PostsResponseSchema, {
  params: { limit: 10, skip: 0 },
});

// POST com body e schema de resposta
const result = await HTTP.post<Post>('posts', { title: 'X', body: 'Y' }, PostSchema);

// PUT / PATCH / DELETE — mesma assinatura
const result = await HTTP.put<Post>('posts/1', { title: 'Updated' }, PostSchema);
const result = await HTTP.delete<void>('posts/1');
```

### Interface completa

```ts
get<T>(url, schema?, config?)        → Promise<Result<HttpResponse<T>, HttpError>>
post<T>(url, data, schema?, ...)
put<T>(url, data, schema?, ...)
patch<T>(url, data, schema?, ...)
delete<T>(url, schema?, ...)
setHeaders(headers)                  → define headers globais na instância
setAuthorization(token)             → define Authorization: Bearer <token>
addResponseInterceptor(onFulfilled?, onRejected?)
```

### Por que `getInstance` e não `new AxiosClient`?

`getInstance` mantém um Map de instâncias por `baseURL`. Reutilizar a mesma instância garante que interceptors e headers globais sejam compartilhados entre todas as chamadas de uma feature.

### Interceptor 401 (global)

Configurado em `src/main.tsx`. Quando qualquer chamada HTTP retorna 401, redireciona para `/auth`:

```ts
HTTP.addResponseInterceptor(undefined, (error) => {
  if (isAxiosError(error) && error.response?.status === 401) {
    if (!router.state.location.pathname.startsWith('/auth')) {
      router.navigate({ to: '/auth' });
    }
  }
  return Promise.reject(error);
});
```

Para customizar o comportamento de 401, edite este trecho no `main.tsx`.

## Result monad

`src/shared/result/index.ts` expõe `Ok`, `Err` e a interface `Result`.

### API

```ts
// Criação (feita dentro do HttpClient — raramente você cria manualmente)
new Ok(value)   // resultado de sucesso
new Err(error)  // resultado de falha

// Consumo — opção 1: getOrElse (mais comum — controller/queryFn)
const { data } = result.getOrElse((error) => { throw error; });

// Consumo — opção 2: match / fold (dois caminhos de UI)
result.fold(
  ({ data }) => console.log(data),
  (error) => console.error(error.message),
);

// Consumo — opção 3: type narrowing
if (result.isOk()) {
  const { data } = result.value;
}
if (result.isErr()) {
  const error = result.error;
}

// Transformação — opção 4: map / flatMap (composição funcional)
const mapped = result.map(({ data }) => data.items);
```

### Onde usar cada opção

| Contexto | Método recomendado |
|----------|-------------------|
| Controller / `queryFn` | `getOrElse((e) => { throw e; })` — deixa o Query capturar o erro |
| Lógica condicional | `isOk()` / `isErr()` |
| UI com dois caminhos | `fold()` |
| Transformar dado de sucesso | `map()` |
| Encadear chamadas HTTP | `flatMap()` |

## i18n

### Adicionar uma nova chave

Sempre edite os dois arquivos simultaneamente:

```json
// src/shared/i18n/translations/en_US.json
{
  "screens": {
    "my_feature": {
      "title": "My Feature",
      "empty": "No items found"
    }
  }
}
```

```json
// src/shared/i18n/translations/pt_BR.json
{
  "screens": {
    "my_feature": {
      "title": "Minha Feature",
      "empty": "Nenhum item encontrado"
    }
  }
}
```

### Usar no componente

```tsx
import { useTranslation } from 'react-i18next';

function MyPage() {
  const { t } = useTranslation();
  return <h1>{t('screens.my_feature.title')}</h1>;
}
```

### Estrutura das traduções

```
common.*           → textos reutilizáveis (loading, error, save, cancel)
screens.<feature>  → textos específicos de cada tela
```

## nuqs — URL search params

Use `nuqs` para sincronizar estado com a URL (filtros, busca, paginação):

```tsx
import { useQueryState, parseAsString, parseAsInteger } from 'nuqs';

function MyPage() {
  // ?search=john persiste na URL
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));

  // ?page=2 persiste na URL
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
}
```

**Parsers disponíveis:** `parseAsString`, `parseAsInteger`, `parseAsBoolean`, `parseAsArrayOf(parseAsString)`.

**Regra:** Use `nuqs` para qualquer estado que o usuário possa querer bookmarkar ou compartilhar. Use `useState` para estado local de UI (modal aberto, item selecionado).

## cn helper

```ts
import { cn } from '@/shared/lib/utils';

// Combina classes Tailwind sem conflito (usa clsx + tailwind-merge)
<div className={cn('bg-card p-4', isActive && 'bg-primary', className)} />
```

Sempre use `cn` quando combinar classes condicionais ou receber `className` como prop.

## Toasts com Sonner

```tsx
import { toast } from 'sonner';

toast.success('Salvo com sucesso');
toast.error('Erro ao salvar');
toast.loading('Salvando...');
toast.promise(myPromise, {
  loading: 'Salvando...',
  success: 'Salvo!',
  error: 'Erro ao salvar',
});
```

O `<Toaster />` já está configurado em `src/routes/__root.tsx`. Não precisa adicionar em nenhuma outra página.

## Componentes UI

### shadcn (novos)

Localização: `src/shared/components/ui/`

**Como instalar um componente novo:**
```bash
npx shadcn@latest add <nome>
# Exemplo: npx shadcn@latest add date-picker
```
O arquivo vai automaticamente para `src/shared/components/ui/`.

Para a lista completa de componentes disponíveis e como usá-los → `src/shared/components/ui/CLAUDE.md`

### cn helper (uso em componentes)

```ts
import { cn } from '@/shared/lib/utils';
```

### Chakra UI (legado)

Componentes antigos usam Chakra. Não remova — migre apenas quando a tela for reescrita.

## Layout da plataforma

### useSetPlatformHeader

Define o título e ação do header. Chame no componente de página dentro de `_platform`:

```tsx
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';

useSetPlatformHeader({
  title: 'Minha Página',
  rightAction: <Button>Criar</Button>, // opcional
});
```

Para detalhes sobre layout, sidebar e context → `src/shared/components/layout/CLAUDE.md`
