import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { LuArrowRight, LuFileText } from 'react-icons/lu';

import { useSetPlatformHeader } from '@/shared/components/layout/platform-context';
import { iconSizes } from '@/shared/theme/theme';

export const Route = createFileRoute('/_platform/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();

  useSetPlatformHeader({ title: t('screens.dashboard.title') });

  return (
    <VStack align="stretch" gap="8" maxW="2xl">
      <Box>
        <Heading size="xl" color="white" mb="3">
          {t('screens.dashboard.welcome')}
        </Heading>
        <Text color="gray.400" fontSize="md">
          {t('screens.dashboard.subtitle')}
        </Text>
      </Box>

      <Link to="/posts" style={{ textDecoration: 'none' }}>
        <Box
          p="6"
          bg="app.surface-dark"
          borderRadius="lg"
          borderWidth="1px"
          borderColor="app.surface-border"
          cursor="pointer"
          transition="all 0.15s"
          _hover={{ borderColor: 'app.primary', bg: 'app.primary/5' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap="4">
              <Box
                p="3"
                bg="app.primary/10"
                borderRadius="md"
                color="app.primary"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <LuFileText size={iconSizes.s24} />
              </Box>
              <Box>
                <Text fontWeight="semibold" color="white" mb="1">
                  {t('screens.posts.title')}
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Infinite scroll demo with TanStack Query
                </Text>
              </Box>
            </Box>
            <Box color="gray.500">
              <LuArrowRight size={iconSizes.s20} />
            </Box>
          </Box>
        </Box>
      </Link>
    </VStack>
  );
}
