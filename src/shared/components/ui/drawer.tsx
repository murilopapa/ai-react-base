import { Drawer as ChakraDrawer, Portal } from '@chakra-ui/react';
import * as React from 'react';

import { CloseButton } from './close-button';

export const DrawerRoot = ChakraDrawer.Root;
export const DrawerFooter = ChakraDrawer.Footer;
export const DrawerHeader = ChakraDrawer.Header;
export const DrawerBody = ChakraDrawer.Body;
export const DrawerBackdrop = ChakraDrawer.Backdrop;
export const DrawerTitle = ChakraDrawer.Title;
export const DrawerDescription = ChakraDrawer.Description;
export const DrawerTrigger = ChakraDrawer.Trigger;
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger;

export interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  backdrop?: boolean;
  closable?: boolean;
}

export const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(props, ref) {
    const { children, portalled = true, portalRef, backdrop = true, closable, ...rest } = props;

    return (
      <Portal disabled={!portalled} container={portalRef}>
        {backdrop && <ChakraDrawer.Backdrop />}
        <ChakraDrawer.Positioner>
          <ChakraDrawer.Content ref={ref} {...rest}>
            {children}
            {closable && (
              <ChakraDrawer.CloseTrigger asChild position="absolute" top="2" insetEnd="2">
                <CloseButton size="sm" />
              </ChakraDrawer.CloseTrigger>
            )}
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    );
  },
);

export const DrawerCloseTrigger = ChakraDrawer.CloseTrigger;
