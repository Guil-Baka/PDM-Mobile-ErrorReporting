export const colors = {
  primary: '#1e3a5f',
  primaryLight: '#2d5a8e',
  secondary: '#0ea5e9',
  background: '#f8fafc',
  surface: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
  info: '#2563eb',
};

export const statusColors: Record<string, string> = {
  aberta: '#2563eb',
  em_atendimento: '#d97706',
  aguardando_solicitante: '#7c3aed',
  solicitacao_encerramento: '#0891b2',
  encerrada: '#64748b',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
};

export const typography = {
  title: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '600' as const },
};
