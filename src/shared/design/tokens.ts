export const colors = {
  primary: 'var(--color-primary)',
  primaryHover: 'var(--color-primary-hover)',
  primarySubtle: 'var(--color-primary-subtle)',

  bg: 'var(--color-bg)',
  surface: 'var(--color-surface)',
  surfaceRaised: 'var(--color-surface-raised)',
  border: 'var(--color-border)',
  borderSubtle: 'var(--color-border-subtle)',

  text: 'var(--color-text)',
  textSecondary: 'var(--color-text-secondary)',
  textMuted: 'var(--color-text-muted)',
  textDisabled: 'var(--color-text-disabled)',

  success: 'var(--color-success)',
  successSubtle: 'var(--color-success-subtle)',
  warning: 'var(--color-warning)',
  warningSubtle: 'var(--color-warning-subtle)',
  error: 'var(--color-error)',
  errorSubtle: 'var(--color-error-subtle)',
  info: 'var(--color-info)',
  infoSubtle: 'var(--color-info-subtle)',
} as const;

export const rawColors = {
  primary: '#137fec',
  primaryHover: '#3b6bf6',
  primarySubtle: '#1a3a5c',

  bg: '#101922',
  surface: '#1a202e',
  surfaceRaised: '#212b3b',
  border: '#2a3245',
  borderSubtle: '#1e2738',

  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textDisabled: '#475569',

  success: '#10b981',
  successSubtle: '#064e3b',
  warning: '#f59e0b',
  warningSubtle: '#451a03',
  error: '#ef4444',
  errorSubtle: '#450a0a',
  info: '#3b82f6',
  infoSubtle: '#1e3a5f',
} as const;

export const radius = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  full: 'var(--radius-full)',
} as const;

export const zIndex = {
  hide: -1,
  base: 0,
  raised: 1,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;
