import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

export const iconSizes = {
  s14: 14,
  s16: 16,
  s18: 18,
  s20: 20,
  s24: 24,
  s28: 28,
  s32: 32,
  s48: 48,
} as const;

const configs = defineConfig({
  theme: {
    tokens: {
      sizes: {
        s14: { value: '14px' },
        s16: { value: '16px' },
        s18: { value: '18px' },
        s20: { value: '20px' },
        s24: { value: '24px' },
        s28: { value: '28px' },
        s32: { value: '32px' },
        s48: { value: '48px' },
      },
      colors: {
        app: {
          primary: { value: '#137fec' },
          'primary-hover': { value: '#3b6bf6' },
          'background-light': { value: '#f6f7f8' },
          'background-dark': { value: '#101922' },
          'surface-dark': { value: '#1a202e' },
          'surface-border': { value: '#2a3245' },
          success: { value: '#10b981' },
          warning: { value: '#f59e0b' },
          error: { value: '#ef4444' },
          info: { value: '#3b82f6' },
        },
      },
      fonts: {
        heading: { value: 'Inter, sans-serif' },
        body: { value: 'Inter, sans-serif' },
      },
      radii: {
        sm: { value: '0.25rem' },
        md: { value: '0.5rem' },
        lg: { value: '0.75rem' },
        full: { value: '9999px' },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.app.primary}' },
          contrast: { value: 'white' },
          fg: { value: '{colors.app.primary}' },
          muted: { value: '{colors.app.primary}' },
          subtle: { value: '{colors.app.primary}' },
          emphasized: { value: '{colors.app.primary-hover}' },
          focusRing: { value: '{colors.app.primary}' },
        },
      },
    },
  },
  globalCss: {
    body: {
      bg: '{colors.app.background-dark}',
      color: 'white',
      fontFamily: 'body',
    },
    'input, textarea, select': {
      color: 'white',
    },
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      background: '#101522',
    },
    '::-webkit-scrollbar-thumb': {
      background: '#2a3245',
      borderRadius: '4px',
    },
    '::-webkit-scrollbar-thumb:hover': {
      background: '#3b4560',
    },
  },
});

export const system = createSystem(defaultConfig, configs);
