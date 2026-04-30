# CLAUDE.md — src/routes/auth/

Rotas públicas da aplicação — acessíveis sem autenticação. Atualmente contém apenas a tela de login.

## Estrutura

```
src/routes/auth/
├── route.tsx       # Layout wrapper da área de auth (sem guard)
└── index.tsx       # Tela de login (/auth)
```

## Como funciona o login

O login é implementado como **simulação de sessão via cookie** — este é um boilerplate, não há integração real com backend:

```tsx
// src/routes/auth/index.tsx
function handleLogin(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  document.cookie = 'session=demo; path=/; max-age=86400'; // define cookie por 24h
  navigate({ to: '/' });
}
```

**Para integrar com backend real:**
1. Substitua a linha do cookie por uma chamada HTTP ao endpoint de auth
2. Use o Result monad para tratar erro de credenciais
3. Armazene o token/session recebido (cookie HttpOnly é o recomendado)

## Guard: `handleSessionInAuth`

A rota de login aplica `handleSessionInAuth` no `beforeLoad`:

```tsx
export const Route = createFileRoute('/auth/')({
  beforeLoad: handleSessionInAuth, // ← redireciona para / se já tem sessão
  component: LoginPage,
});
```

Isso evita que usuários logados acessem `/auth` — serão redirecionados para `/`.

## Adicionar nova rota pública

Para criar uma rota pública (sem guard de sessão), coloque dentro de `auth/`:

```
src/routes/auth/
└── forgot-password/
    └── index.tsx
```

```tsx
export const Route = createFileRoute('/auth/forgot-password/')({
  // sem beforeLoad = sem guard
  component: ForgotPasswordPage,
});
```

## Adicionar campos ao formulário de login

O formulário atual usa elementos HTML nativos com Chakra UI. Para adicionar campos:

1. Adicione o `<Field>` + `<Input>` no JSX
2. Adicione as chaves i18n em ambos os arquivos de tradução:

```json
// en_US.json → screens.auth.login
{ "remember_me": "Remember me" }

// pt_BR.json → screens.auth.login
{ "remember_me": "Lembrar de mim" }
```

**Para usar TanStack Form** (quando a validação for necessária):

```tsx
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const form = useForm({
  defaultValues: { email: '', password: '' },
  validators: { onChange: LoginSchema },
  onSubmit: async ({ value }) => {
    // value é tipado como z.infer<typeof LoginSchema>
  },
});
```

## Relação com proteção de rotas

```
/auth            → handleSessionInAuth (redireciona se logado)
/_platform/*     → handleSession (redireciona se não logado)
```

Ver `src/shared/handlers/handle-session.ts` para a implementação dos guards.
