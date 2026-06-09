import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ocorrencia, ESCOPO_LABELS } from '../domain/types';
import { colors, radius, spacing, typography } from '../theme';
import { StatusBadge } from './StatusBadge';

interface OcorrenciaCardProps {
  ocorrencia: Ocorrencia;
  onPress: () => void;
}

function formatarData(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function OcorrenciaCard({ ocorrencia, onPress }: OcorrenciaCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.titulo} numberOfLines={2}>
          {ocorrencia.titulo}
        </Text>
        <StatusBadge status={ocorrencia.status} />
      </View>
      <Text style={styles.local} numberOfLines={1}>
        {ESCOPO_LABELS[ocorrencia.localizacao.escopo]} · {ocorrencia.localizacao.referencia}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{ocorrencia.solicitanteNome}</Text>
        <Text style={styles.meta}>{formatarData(ocorrencia.atualizadaEm)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  pressed: { opacity: 0.92 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titulo: {
    ...typography.subtitle,
    color: colors.text,
    flex: 1,
  },
  local: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  meta: {
    ...typography.caption,
    color: colors.textMuted,
  },
});
