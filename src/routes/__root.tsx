import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

const Devtools = import.meta.env.DEV
  ? lazy(async () => {
      const [
        { TanStackDevtools },
        { TanStackRouterDevtoolsPanel },
        { FormDevtoolsPanel },
        { ReactQueryDevtoolsPanel },
      ] = await Promise.all([
        import('@tanstack/react-devtools'),
        import('@tanstack/react-router-devtools'),
        import('@tanstack/react-form-devtools'),
        import('@tanstack/react-query-devtools'),
      ]);

      return {
        default: function DevtoolsComponent() {
          return (
            <TanStackDevtools
              config={{
                position: 'bottom-right',
              }}
              plugins={[
                {
                  name: 'TanStack Router',
                  render: <TanStackRouterDevtoolsPanel />,
                },
                {
                  name: 'TanStack Form',
                  render: <FormDevtoolsPanel />,
                },
                {
                  name: 'TanStack Query',
                  render: <ReactQueryDevtoolsPanel />,
                },
              ]}
            />
          );
        },
      };
    })
  : null;

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && Devtools ? (
        <Suspense fallback={null}>
          <Devtools />
        </Suspense>
      ) : null}
    </>
  );
}
