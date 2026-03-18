import { Box, Flex, Heading, Input, Text, VStack } from '@chakra-ui/react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/shared/components/ui/button';
import { Field } from '@/shared/components/ui/field';
import { handleSessionInAuth } from '@/shared/handlers/handle-session';

export const Route = createFileRoute('/auth/')({
  beforeLoad: handleSessionInAuth,
  component: LoginPage,
});

function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Set a demo session cookie
    document.cookie = 'session=demo; path=/; max-age=86400';
    navigate({ to: '/' });
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="app.background-dark" p="4">
      <Box
        w="full"
        maxW="sm"
        bg="app.surface-dark"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="app.surface-border"
        p="8">
        <VStack gap="6" align="stretch">
          <Box textAlign="center">
            <Text fontWeight="bold" fontSize="2xl" color="app.primary" mb="2">
              React Base
            </Text>
            <Heading size="md" color="white" mb="2">
              {t('screens.auth.login.title')}
            </Heading>
            <Text color="gray.400" fontSize="sm">
              {t('screens.auth.login.description')}
            </Text>
          </Box>

          <Box as="form" onSubmit={handleLogin}>
            <VStack gap="4" align="stretch">
              <Field label={t('screens.auth.login.email')}>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  bg="app.background-dark"
                  borderColor="app.surface-border"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{ borderColor: 'app.primary', boxShadow: 'none' }}
                />
              </Field>
              <Field label={t('screens.auth.login.password')}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  bg="app.background-dark"
                  borderColor="app.surface-border"
                  color="white"
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{ borderColor: 'app.primary', boxShadow: 'none' }}
                />
              </Field>
              <Button type="submit" colorPalette="blue" w="full" mt="2">
                {t('screens.auth.login.submit')}
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
}
