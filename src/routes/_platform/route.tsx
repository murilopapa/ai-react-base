import { createFileRoute, Outlet } from '@tanstack/react-router';

import { PlatformLayout } from '@/shared/components/layout/platform-layout';
import { handleSession } from '@/shared/handlers/handle-session';

export const Route = createFileRoute('/_platform')({
  beforeLoad: handleSession,
  component: PlatformLayoutRoute,
});

function PlatformLayoutRoute() {
  return (
    <PlatformLayout>
      <Outlet />
    </PlatformLayout>
  );
}
