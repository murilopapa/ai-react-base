import { Input, type InputProps } from '@chakra-ui/react';
import * as React from 'react';

function formatCPF(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatCNPJ(digits: string): string {
  const d = digits.slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function applyMask(digits: string): string {
  if (digits.length <= 11) return formatCPF(digits);
  return formatCNPJ(digits);
}

function formatPhone(digits: string): string {
  const d = digits.slice(0, 11);
  if (d.length === 0) return '';
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

type MaskedPhoneInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (rawDigits: string) => void;
};

export const MaskedPhoneInput = React.forwardRef<HTMLInputElement, Readonly<MaskedPhoneInputProps>>(
  function MaskedPhoneInput({ value = '', onChange, ...props }, ref) {
    const digits = value.replaceAll(/\D/g, '').slice(0, 11);
    const displayed = formatPhone(digits);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value.replaceAll(/\D/g, '').slice(0, 11);
      onChange?.(raw);
    }

    return <Input ref={ref} {...props} value={displayed} onChange={handleChange} />;
  },
);

type MaskedDocumentInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  value?: string;
  onChange?: (rawDigits: string) => void;
};

export const MaskedDocumentInput = React.forwardRef<
  HTMLInputElement,
  Readonly<MaskedDocumentInputProps>
>(function MaskedDocumentInput({ value = '', onChange, ...props }, ref) {
  const digits = value.replaceAll(/\D/g, '').slice(0, 14);
  const displayed = applyMask(digits);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replaceAll(/\D/g, '').slice(0, 14);
    onChange?.(raw);
  }

  return <Input ref={ref} {...props} value={displayed} onChange={handleChange} />;
});
