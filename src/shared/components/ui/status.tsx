import type { BadgeProps } from '@chakra-ui/react';
import { Badge as ChakraBadge } from '@chakra-ui/react';
import * as React from 'react';

export interface StatusProps extends BadgeProps {}

export const Status = React.forwardRef<HTMLSpanElement, StatusProps>(function Status(props, ref) {
  const { children, ...rest } = props;
  return (
    <ChakraBadge
      ref={ref}
      px="2"
      py="0.5"
      borderRadius="full"
      textTransform="none"
      fontWeight="semibold"
      fontSize="xs"
      {...rest}>
      {children}
    </ChakraBadge>
  );
});
