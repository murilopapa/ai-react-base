import { Dialog as ChakraDialog, Portal } from '@chakra-ui/react';
import * as React from 'react';

import { CloseButton } from './close-button';

export const DialogRoot = ChakraDialog.Root;
export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;

export interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  backdrop?: boolean;
  closable?: boolean;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    const { children, portalled = true, portalRef, backdrop = true, closable, ...rest } = props;

    return (
      <Portal disabled={!portalled} container={portalRef}>
        {backdrop && <ChakraDialog.Backdrop />}
        <ChakraDialog.Positioner>
          <ChakraDialog.Content ref={ref} {...rest}>
            {children}
            {closable && (
              <ChakraDialog.CloseTrigger asChild position="absolute" top="2" insetEnd="2">
                <CloseButton size="sm" />
              </ChakraDialog.CloseTrigger>
            )}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    );
  },
);

export const DialogCloseTrigger = ChakraDialog.CloseTrigger;
