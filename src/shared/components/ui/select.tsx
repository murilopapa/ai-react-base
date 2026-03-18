import { Select as ChakraSelect, Portal } from '@chakra-ui/react';
import * as React from 'react';

interface SelectRootProps extends ChakraSelect.RootProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
}

export const SelectRoot = React.forwardRef<HTMLDivElement, SelectRootProps>(
  function SelectRoot(props, ref) {
    const { children, portalled = true, portalRef, ...rest } = props;
    return (
      <ChakraSelect.Root ref={ref} {...rest}>
        {children}
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraSelect.Positioner>
            <ChakraSelect.Content />
          </ChakraSelect.Positioner>
        </Portal>
      </ChakraSelect.Root>
    );
  },
);

export const SelectTrigger = ChakraSelect.Trigger;
export const SelectValueText = ChakraSelect.ValueText;
export const SelectLabel = ChakraSelect.Label;
export const SelectItem = ChakraSelect.Item;
export const SelectItemText = ChakraSelect.ItemText;
export const SelectItemIndicator = ChakraSelect.ItemIndicator;
export const SelectContent = ChakraSelect.Content;
export const SelectControl = ChakraSelect.Control;
export const SelectItemGroup = ChakraSelect.ItemGroup;
export const SelectItemGroupLabel = ChakraSelect.ItemGroupLabel;
export const SelectIndicator = ChakraSelect.Indicator;
export const SelectClearTrigger = ChakraSelect.ClearTrigger;
