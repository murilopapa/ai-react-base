# Plano 2 — Documentação Aprofundada

> Continuação do PLAN.md. Foco em documentar as partes que ficaram rasas ou faltaram.

---

## Status Geral

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 | CLAUDE.md — HttpClient detalhado | [ ] |
| 2 | CLAUDE.md — i18n aprofundado | [ ] |
| 3 | CLAUDE.md — TanStack Form com Zod | [ ] |
| 4 | CLAUDE.md — TanStack Query patterns | [ ] |
| 5 | CLAUDE.md — Tratamento de erros E2E | [ ] |
| 6 | CLAUDE.md — Criação de componentes shadcn customizados | [ ] |
| 7 | CLAUDE.md — Roteamento avançado (loaders, search params) | [ ] |
| 8 | CLAUDE.md — Testes (Vitest + Testing Library) | [ ] |

---

## Fase 1 — CLAUDE.md: HttpClient detalhado

Arquivo: `src/shared/http/CLAUDE.md`

O que documentar:
- [ ] Como o `AxiosClient` funciona internamente (parse de JSON, validação Zod, wrapping em Ok/Err)
- [ ] Diferença entre `HTTP` (singleton global) e `getInstance` (instância por baseURL)
- [ ] Como adicionar headers globais (`setHeaders`, `setAuthorization`)
- [ ] Como adicionar interceptors de request/response (`addResponseInterceptor`)
- [ ] Como o interceptor de 401 está configurado em `main.tsx` e por que
- [ ] Padrão de erro: `HttpError` (campos: `code`, `message`, `cause`, `url`)
- [ ] Como lidar com erros na UI (distinguir 401, 404, 500)
- [ ] Exemplos completos: GET com params, POST com body, PUT, DELETE
- [ ] Como testar chamadas HTTP (mock do getInstance vs MSW)

---

## Fase 2 — CLAUDE.md: i18n aprofundado

Arquivo: `src/shared/i18n/CLAUDE.md`

O que documentar:
- [ ] Como o i18next está configurado (`src/shared/i18n/config.ts`) — idioma padrão, detecção, fallback
- [ ] Estrutura de namespaces (atualmente tudo no namespace default)
- [ ] Como trocar o idioma em runtime (`i18n.changeLanguage('pt_BR')`)
- [ ] Como usar interpolação de variáveis: `t('welcome', { name: 'Murilo' })` → `"Olá, {{name}}"`
- [ ] Como usar pluralização: `t('items', { count: 5 })` → `"5 itens"`
- [ ] Como usar `Trans` para JSX dentro de traduções
- [ ] Onde adicionar um novo idioma (ES, por exemplo)
- [ ] Como tipar as chaves de tradução (TypeScript + i18next)
- [ ] Convenção de estrutura das chaves: `screens.<rota>.<chave>`, `common.<chave>`

---

## Fase 3 — CLAUDE.md: TanStack Form com Zod

Arquivo: `src/shared/CLAUDE.md` (seção Forms) ou arquivo próprio

O que documentar:
- [ ] Como criar um form básico com `useForm` do TanStack Form
- [ ] Como integrar schema Zod como validador (`zodValidator`)
- [ ] Como acessar estado do form (isSubmitting, isDirty, errors)
- [ ] Como fazer submit e integrar com o controller/use-case
- [ ] Exemplo completo: form de criação com POST para API
- [ ] Como mostrar erros de campo com os componentes shadcn (`Input` + `Label` + mensagem de erro)
- [ ] Diferença entre validação `onChange` e `onSubmit`
- [ ] Como resetar o form após submit

---

## Fase 4 — CLAUDE.md: TanStack Query patterns

Arquivo: `src/shared/CLAUDE.md` (seção Query) ou arquivo próprio

O que documentar:
- [ ] `useQuery` — quando usar, opções principais (`enabled`, `staleTime`, `gcTime`)
- [ ] `useInfiniteQuery` — padrão de infinite scroll (já existe em posts, documentar)
- [ ] `useMutation` — criar, editar, deletar dados; `onSuccess`, `onError`, `invalidateQueries`
- [ ] `queryClient.invalidateQueries` — quando e como usar para refetch
- [ ] `queryClient.setQueryData` — update otimista
- [ ] Estrutura de `queryKeys` — por que usar objeto de funções (`queryKeys.all`, `queryKeys.detail(id)`)
- [ ] Como usar `prefetchQuery` no loader da rota para SSR-like behavior
- [ ] Devtools do TanStack Query — como inspecionar cache

---

## Fase 5 — CLAUDE.md: Tratamento de erros E2E

Arquivo: `src/shared/http/CLAUDE.md` (seção Errors) ou `CLAUDE.md` raiz

O que documentar:
- [ ] Fluxo completo de erro: API → HttpError → Result.Err → Query.isError → UI
- [ ] Como distinguir tipos de erro na UI (`error.code === 404`, `error.message`)
- [ ] Como mostrar toast de erro com `sonner` (`toast.error(...)`)
- [ ] Como criar um Error Boundary para erros de render
- [ ] Padrão de estado de erro nos componentes: inline vs toast vs redirect
- [ ] Como o interceptor de 401 redireciona para `/auth` automaticamente
- [ ] `HttpErrorCode` e `HttpErrorKey` — quais são os valores disponíveis

---

## Fase 6 — CLAUDE.md: Componentes shadcn customizados

Arquivo: `src/shared/components/CLAUDE.md`

O que documentar:
- [ ] Como instalar um novo componente shadcn (`npx shadcn@latest add <nome>`)
- [ ] Como criar variantes com CVA (`class-variance-authority`) — exemplo completo
- [ ] Como estender um componente shadcn sem modificar o original (wrapper pattern)
- [ ] Como criar um componente composto (ex: `FormField` = Label + Input + mensagem de erro)
- [ ] Convenção de props: sempre `className` prop + `cn()` para merge
- [ ] Como usar `data-slot` para estilização por contexto (já usado nos shadcn components)
- [ ] Lista completa dos componentes instalados e quando usar cada um

---

## Fase 7 — CLAUDE.md: Roteamento avançado

Arquivo: `src/routes/CLAUDE.md` (ampliar o existente)

O que documentar:
- [ ] `search params` — como definir, validar com Zod e ler na rota (`Route.useSearch()`)
- [ ] `nuqs` — quando usar `useQueryState` vs `Route.useSearch()`
- [ ] Como passar `context` pelo router (já tem `queryClient`, como adicionar mais)
- [ ] `Link` vs `navigate` — quando usar cada um
- [ ] `notFound()` — como retornar 404 de um loader e renderizar a tela de not found
- [ ] Rotas paralelas e layouts aninhados
- [ ] Como fazer breadcrumb dinâmico a partir da rota ativa

---

## Fase 8 — CLAUDE.md: Testes

Arquivo: `src/shared/CLAUDE.md` (seção Tests) ou `CLAUDE.md` raiz

O que documentar:
- [ ] Estrutura de um arquivo de teste (co-located vs `__tests__/`)
- [ ] Como testar um componente React com Testing Library
- [ ] Como mockar o HttpClient em testes de controller/use-case
- [ ] Como testar um hook com `renderHook`
- [ ] Como testar com TanStack Query wrapper (`QueryClientProvider` no render)
- [ ] Como rodar testes: `pnpm test` (run) vs `pnpm test --watch`
- [ ] Como usar `vi.mock` do Vitest para mockar módulos

---

## Próximo passo

👉 **Fase 1** — `src/shared/http/CLAUDE.md`: documentar o HttpClient em detalhe.
