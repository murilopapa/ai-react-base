import type { QueryClient } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';

type QueryClientContext = { context: { queryClient: QueryClient } };

export async function handleSessionInAuth(_opts: QueryClientContext) {
  const hasSession = document.cookie.includes('session');
  if (hasSession) {
    throw redirect({ to: '/' });
  }
}

export async function handleSession(_opts: QueryClientContext) {
  const hasSession = document.cookie.includes('session');
  if (!hasSession) {
    throw redirect({ to: '/auth' });
  }
}
