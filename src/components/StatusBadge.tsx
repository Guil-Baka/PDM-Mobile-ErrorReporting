import { StyleSheet, Text, View } from 'react-native';
import { StatusOcorrencia, STATUS_LABELS } from '../domain/types';
import { colors, radius, spacing, statusColors, typography } from '../theme';

interface StatusBadgeProps {
  status: StatusOcorrencia;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusColors[status] ?? colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{STATUS_LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: radius.full,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});
