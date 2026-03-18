import type { SkeletonProps as ChakraSkeletonProps } from '@chakra-ui/react';
import { Skeleton as ChakraSkeleton, Stack } from '@chakra-ui/react';
import * as React from 'react';

export interface SkeletonCircleProps extends ChakraSkeletonProps {}

export const SkeletonCircle = (props: Readonly<SkeletonCircleProps>) => {
  return <ChakraSkeleton variant="pulse" borderRadius="full" {...props} />;
};

export interface SkeletonTextProps extends ChakraSkeletonProps {
  noOfLines?: number;
}

export const SkeletonText = React.forwardRef<HTMLDivElement, Readonly<SkeletonTextProps>>(
  function SkeletonText(props, ref) {
    const { noOfLines = 3, gap = '2', ...rest } = props;
    return (
      <Stack gap={gap} width="full" ref={ref}>
        {Array.from({ length: noOfLines }).map((_, index) => (
          <ChakraSkeleton height="4" key={`skeleton-${index}`} {...rest} />
        ))}
      </Stack>
    );
  },
);

export { Skeleton } from '@chakra-ui/react';
