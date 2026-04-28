export const colors = {
  primary: 'var(--primary)',
  primaryForeground: 'var(--primary-foreground)',

  background: 'var(--background)',
  foreground: 'var(--foreground)',
  card: 'var(--card)',
  cardForeground: 'var(--card-foreground)',
  popover: 'var(--popover)',
  popoverForeground: 'var(--popover-foreground)',
  secondary: 'var(--secondary)',
  secondaryForeground: 'var(--secondary-foreground)',
  muted: 'var(--muted)',
  mutedForeground: 'var(--muted-foreground)',
  accent: 'var(--accent)',
  accentForeground: 'var(--accent-foreground)',
  destructive: 'var(--destructive)',
  border: 'var(--border)',
  input: 'var(--input)',
  ring: 'var(--ring)',

  success: 'var(--success)',
  successSubtle: 'var(--success-subtle)',
  warning: 'var(--warning)',
  warningSubtle: 'var(--warning-subtle)',
  error: 'var(--error)',
  errorSubtle: 'var(--error-subtle)',
  info: 'var(--info)',
  infoSubtle: 'var(--info-subtle)',

  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  textDisabled: 'var(--text-disabled)',
  surfaceRaised: 'var(--surface-raised)',
  borderSubtle: 'var(--border-subtle)',
} as const;

export const rawColors = {
  primary: '#137fec',
  primaryHover: '#3b6bf6',
  background: '#101922',
  card: '#1a202e',
  surfaceRaised: '#212b3b',
  border: '#2a3245',
  foreground: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  textDisabled: '#475569',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
} as const;

export const radius = {
  sm: 'calc(var(--radius) - 4px)',
  md: 'calc(var(--radius) - 2px)',
  lg: 'var(--radius)',
  xl: 'calc(var(--radius) + 4px)',
  full: '9999px',
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
