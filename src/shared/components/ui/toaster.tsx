'use client';

import {
  Toaster as ChakraToaster,
  createToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  type ToasterProps,
} from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
});

type ToastItemProps = ToasterProps['children'] extends (toast: infer T) => unknown ? T : never;

const ToastIndicator = ({ type }: Pick<ToastItemProps, 'type'>) => {
  if (type === 'loading') return <Spinner size="sm" color="blue.solid" />;
  return <Toast.Indicator />;
};

const ToastContent = ({ title, description }: Pick<ToastItemProps, 'title' | 'description'>) => (
  <Stack gap="1" flex="1" maxWidth="100%">
    {title && <Toast.Title>{title}</Toast.Title>}
    {description && <Toast.Description>{description}</Toast.Description>}
  </Stack>
);

const ToastAction = ({ action }: Pick<ToastItemProps, 'action'>) => {
  if (!action) return null;
  return <Toast.ActionTrigger>{action.label}</Toast.ActionTrigger>;
};

const ToastItem = ({ type, title, description, action, closable }: ToastItemProps) => (
  <Toast.Root width={{ md: 'sm' }}>
    <ToastIndicator type={type} />
    <ToastContent title={title} description={description} />
    <ToastAction action={action} />
    {closable && <Toast.CloseTrigger />}
  </Toast.Root>
);

export const Toaster = () => (
  <Portal>
    <ChakraToaster toaster={toaster} insetInline={{ mdDown: '4' }}>
      {(toast) => <ToastItem {...toast} />}
    </ChakraToaster>
  </Portal>
);
