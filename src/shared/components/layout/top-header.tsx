import { Box, Flex, Heading, Input } from '@chakra-ui/react';
import { LuBell, LuSearch } from 'react-icons/lu';

import { usePlatformContext } from '@/shared/components/layout/platform-context';
import { InputGroup } from '@/shared/components/ui/input-group';
import { iconSizes } from '@/shared/theme/theme';

export function TopHeader() {
  const { title, rightAction } = usePlatformContext();

  return (
    <Box
      as="header"
      position="sticky"
      top="0"
      h="16"
      zIndex="docked"
      bg="app.surface-dark"
      borderBottom="1px solid"
      borderColor="app.surface-border"
      px="6"
      flexShrink="0">
      <Flex h="full" align="center" justify="space-between">
        <Heading size="md" fontWeight="semibold" color="white">
          {title}
        </Heading>

        <Flex align="center" gap="3">
          <InputGroup
            startElement={<LuSearch size={iconSizes.s16} color="var(--chakra-colors-gray-400)" />}>
            <Input
              placeholder="Search..."
              variant="subtle"
              size="sm"
              w="48"
              bg="app.background-dark"
              borderColor="app.surface-border"
              color="white"
              _placeholder={{ color: 'gray.500' }}
            />
          </InputGroup>

          <Box position="relative">
            <Box
              as="button"
              p="2"
              color="gray.400"
              _hover={{ color: 'white' }}
              transition="color 0.15s"
              cursor="pointer"
              borderRadius="md"
              aria-label="Notifications">
              <LuBell size={iconSizes.s20} />
            </Box>
            <Box
              position="absolute"
              top="1.5"
              right="1.5"
              w="2"
              h="2"
              bg="app.error"
              borderRadius="full"
              pointerEvents="none"
            />
          </Box>

          {rightAction}
        </Flex>
      </Flex>
    </Box>
  );
}
