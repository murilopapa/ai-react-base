import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import { Link, useRouterState } from '@tanstack/react-router';
import type { IconType } from 'react-icons';
import { LuCircleHelp, LuFileText, LuLayoutDashboard, LuSettings } from 'react-icons/lu';

import { iconSizes } from '@/shared/theme/theme';

type NavItem = {
  label: string;
  to: string;
  icon: IconType;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: LuLayoutDashboard },
  { label: 'Posts', to: '/posts', icon: LuFileText },
];

const SYSTEM_ITEMS: NavItem[] = [
  { label: 'Settings', to: '/settings', icon: LuSettings },
  { label: 'Help', to: '/help', icon: LuCircleHelp },
];

type NavLinkProps = NavItem & { isActive: boolean };

function NavLink({ to, icon: Icon, label, isActive }: NavLinkProps) {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
      <Flex
        px="3"
        py="2.5"
        borderRadius="md"
        align="center"
        gap="3"
        bg={isActive ? 'app.primary/10' : 'transparent'}
        color={isActive ? 'app.primary' : 'gray.400'}
        fontWeight={isActive ? 'medium' : 'normal'}
        fontSize="sm"
        cursor="pointer"
        transition="all 0.15s"
        _hover={isActive ? {} : { bg: 'whiteAlpha.100', color: 'white' }}>
        <Icon size={iconSizes.s18} />
        <Text>{label}</Text>
      </Flex>
    </Link>
  );
}

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function isActive(to: string) {
    if (to === '/') return pathname === '/';
    return pathname.startsWith(to);
  }

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      h="100vh"
      w="64"
      zIndex="sticky"
      bg="app.surface-dark"
      borderRight="1px solid"
      borderColor="app.surface-border"
      display="flex"
      flexDirection="column">
      {/* Logo */}
      <Flex h="16" align="center" px="5" borderBottom="1px solid" borderColor="app.surface-border">
        <Text fontWeight="bold" fontSize="lg" color="app.primary" letterSpacing="tight">
          React Base
        </Text>
      </Flex>

      {/* Nav */}
      <Box flex="1" py="4" px="3" overflowY="auto">
        <VStack gap="1" align="stretch">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} {...item} isActive={isActive(item.to)} />
          ))}
        </VStack>

        <Box my="4" borderTop="1px solid" borderColor="app.surface-border" />

        <Text
          px="3"
          fontSize="xs"
          fontWeight="semibold"
          color="gray.500"
          textTransform="uppercase"
          letterSpacing="wider"
          mb="2">
          System
        </Text>

        <VStack gap="1" align="stretch">
          {SYSTEM_ITEMS.map((item) => (
            <NavLink key={item.to} {...item} isActive={isActive(item.to)} />
          ))}
        </VStack>
      </Box>
    </Box>
  );
}
