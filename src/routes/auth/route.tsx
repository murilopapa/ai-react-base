import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/auth')({
  component: AppLayoutComponent,
});

function AppLayoutComponent() {
  return <Outlet />;
}
