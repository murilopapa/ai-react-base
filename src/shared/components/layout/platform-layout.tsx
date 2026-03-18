import { Box } from '@chakra-ui/react';
import type { ReactNode } from 'react';

import { PlatformProvider } from '@/shared/components/layout/platform-context';
import { Sidebar } from '@/shared/components/layout/sidebar';
import { TopHeader } from '@/shared/components/layout/top-header';

type PlatformLayoutProps = {
  children: ReactNode;
};

export function PlatformLayout({ children }: Readonly<PlatformLayoutProps>) {
  return (
    <PlatformProvider>
      <Box minH="100vh" bg="app.background-dark">
        <Sidebar />
        <Box ml="64" display="flex" flexDirection="column" minH="100vh">
          <TopHeader />
          <Box flex="1" p="8">
            {children}
          </Box>
        </Box>
      </Box>
    </PlatformProvider>
  );
}
