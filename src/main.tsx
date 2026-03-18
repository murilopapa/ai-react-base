import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';
import ReactDOM from 'react-dom/client';

import { Provider } from '@/shared/components/ui/provider';
import { HTTP } from '@/shared/http/axios.http';

import { routeTree } from './routeTree.gen';

import '@/shared/i18n/config';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: { queryClient },
});

HTTP.addResponseInterceptor(undefined, (error) => {
  if (isAxiosError(error) && error.response?.status === 401) {
    if (!router.state.location.pathname.startsWith('/auth')) {
      router.navigate({ to: '/auth' });
    }
  }
  return Promise.reject(error);
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <Provider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <RouterProvider router={router} context={{ queryClient }} />
        </NuqsAdapter>
      </QueryClientProvider>
    </Provider>,
  );
}
