import { Checkbox as ChakraCheckbox } from '@chakra-ui/react';
import * as React from 'react';

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode;
  label?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    const { icon, label, inputProps, children, ...rest } = props;
    return (
      <ChakraCheckbox.Root {...rest}>
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
        <ChakraCheckbox.Control>{icon ?? <ChakraCheckbox.Indicator />}</ChakraCheckbox.Control>
        {label && <ChakraCheckbox.Label>{label}</ChakraCheckbox.Label>}
        {children && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
      </ChakraCheckbox.Root>
    );
  },
);
