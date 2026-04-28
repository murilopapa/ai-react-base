import { createFileRoute, Outlet } from '@tanstack/react-router';

import { PlatformLayout } from '@/shared/components/layout/platform-layout';

export const Route = createFileRoute('/_platform')({
  component: PlatformLayoutRoute,
});

function PlatformLayoutRoute() {
  return (
    <PlatformLayout>
      <Outlet />
    </PlatformLayout>
  );
}
