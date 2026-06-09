import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { OcorrenciaCard } from '../../src/components/OcorrenciaCard';
import { useApp } from '../../src/context/AppContext';
import { colors, spacing, typography } from '../../src/theme';

export default function MinhasOcorrenciasScreen() {
  const { ocorrencias, usuario } = useApp();

  const minhas = ocorrencias.filter((o) => o.solicitanteId === usuario?.id);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Ocorrências abertas por você como Solicitante.
      </Text>
      <FlatList
        data={minhas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <OcorrenciaCard
            ocorrencia={item}
            onPress={() => router.push(`/ocorrencia/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Nenhuma ocorrência sua"
            description="Use o botão + na aba Ocorrências para abrir uma nova."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
