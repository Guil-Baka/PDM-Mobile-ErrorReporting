import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../../src/components/EmptyState';
import { OcorrenciaCard } from '../../src/components/OcorrenciaCard';
import { useApp } from '../../src/context/AppContext';
import { isOcorrenciaAtiva } from '../../src/domain/types';
import { colors, radius, spacing, typography } from '../../src/theme';

export default function OcorrenciasScreen() {
  const { ocorrencias, isTi, usuario } = useApp();

  const visiveis = isTi
    ? ocorrencias
    : ocorrencias.filter((o) => isOcorrenciaAtiva(o.status));

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.greeting}>
          Olá, {usuario?.nome.split(' ')[0]}
        </Text>
        <Text style={styles.role}>{isTi ? 'Equipe de TI' : 'Solicitante'}</Text>
      </View>

      <FlatList
        data={visiveis}
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
            title="Nenhuma ocorrência"
            description="Abra uma nova ocorrência para registrar um problema."
          />
        }
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/ocorrencia/nova')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    ...typography.title,
    color: colors.text,
  },
  role: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  list: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
