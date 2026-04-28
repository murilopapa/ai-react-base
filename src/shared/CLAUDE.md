# CLAUDE.md — src/shared/

Utilitários, componentes e infraestrutura compartilhados por todas as features.

## HttpClient

### Interface

O `HttpClient` (`src/shared/http/client.http.ts`) expõe:

```ts
get<T>(url, schema?, config?)   → Promise<Result<HttpResponse<T>, HttpError>>
post<T>(url, data, schema?, ...)
put<T>(url, data, schema?, ...)
patch<T>(url, data, schema?, ...)
delete<T>(url, schema?, ...)
setHeaders(headers)
setAuthorization(token)
addResponseInterceptor(onFulfilled?, onRejected?)
```

### Como usar

```ts
import { getInstance } from '@/shared/http/axios.http';

// Cria ou reutiliza uma instância para a baseURL
const HTTP = getInstance({ baseURL: '/api/', withCredentials: false });

// GET com schema Zod
const result = await HTTP.get<Product[]>('products', ProductsSchema);

// POST com body e schema de resposta
const result = await HTTP.post<Product>('products', { name: 'X', price: 10 }, ProductSchema);
```

### Por que `getInstance` e não `new AxiosClient`?

`getInstance` mantém um Map de instâncias por `baseURL`. Reutilizar a mesma instância garante que interceptors e headers globais sejam compartilhados.

## Result monad

`src/shared/result/index.ts` expõe `Ok`, `Err` e a interface `Result`.

### API

```ts
// Criação
new Ok(value)   // resultado de sucesso
new Err(error)  // resultado de falha

// Consumo — opção 1: getOrElse (mais comum no controller)
const { data } = result.getOrElse((error) => { throw error; });

// Consumo — opção 2: match
result.match(
  ({ data }) => console.log(data),
  (error) => console.error(error.message),
);

// Consumo — opção 3: checar tipo
if (result.isOk()) {
  const { data } = result.value;
}
if (result.isErr()) {
  const error = result.error;
}
```

### Onde usar cada opção

| Contexto | Método recomendado |
|----------|-------------------|
| Controller (queryFn) | `getOrElse((e) => { throw e; })` |
| Lógica condicional | `isOk()` / `isErr()` |
| UI com dois caminhos | `match()` |

## i18n

### Adicionar uma nova chave

Sempre edite os dois arquivos simultaneamente:

```json
// en_US.json
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
// pt_BR.json
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

## Componentes UI

### shadcn (novos)

Localização: `src/shared/components/ui/`
Instalação: `npx shadcn@latest add <nome>`

Componentes disponíveis:
- `button`, `card`, `input`, `label`, `badge`
- `skeleton`, `dialog`, `drawer`, `select`
- `checkbox`, `avatar`, `tooltip`
- `table`, `tabs`, `sonner` (toast)

### cn helper

```ts
import { cn } from '@/shared/lib/utils';

// Combina classes Tailwind sem conflito
<div className={cn('bg-card', isActive && 'bg-primary')} />
```

### Chakra UI (legado)

Componentes antigos usam Chakra. Não remova — migre apenas quando a tela for reescrita.

## Layout da plataforma

### useSetPlatformHeader

Define o título e ação do header da página. Deve ser chamado no componente de página:

```tsx
import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';

useSetPlatformHeader({
  title: 'Minha Página',
  rightAction: <Button>Criar</Button>, // opcional
});
```

### Sidebar

Para adicionar um item de navegação, edite o array `NAV_ITEMS` em `src/shared/components/layout/sidebar.tsx`.
