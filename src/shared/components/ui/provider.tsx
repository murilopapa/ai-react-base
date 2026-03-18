'use client';

import { ChakraProvider } from '@chakra-ui/react';

import { ColorModeProvider, type ColorModeProviderProps } from '@/shared/components/ui/color-mode';
import { system } from '@/shared/theme/theme';

export function Provider(props: Readonly<ColorModeProviderProps>) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
