import { Redirect } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../src/context/AppContext';
import { PERFIL_LABELS, Usuario } from '../src/domain/types';
import { colors, radius, spacing, typography } from '../src/theme';

function UsuarioOption({ usuario, onSelect }: { usuario: Usuario; onSelect: () => void }) {
  const isTi = usuario.perfil === 'ti';
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
    >
      <View style={[styles.avatar, isTi && styles.avatarTi]}>
        <Text style={styles.avatarText}>{usuario.nome.charAt(0)}</Text>
      </View>
      <View style={styles.optionInfo}>
        <Text style={styles.optionNome}>{usuario.nome}</Text>
        <Text style={styles.optionPerfil}>{PERFIL_LABELS[usuario.perfil]}</Text>
      </View>
    </Pressable>
  );
}

export default function LoginScreen() {
  const { usuario, carregando, entrarComo, usuariosDisponiveis } = useApp();

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (usuario) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Ocorrências de{'\n'}Infraestrutura</Text>
        <Text style={styles.heroSubtitle}>
          Registre e acompanhe problemas de infraestrutura da faculdade.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionTitle}>Entrar como</Text>
        {usuariosDisponiveis.map((u) => (
          <UsuarioOption key={u.id} usuario={u} onSelect={() => entrarComo(u)} />
        ))}
        <Text style={styles.hint}>
          Selecione um perfil para simular o acesso. Em produção, use autenticação institucional.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 38,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 22,
  },
  list: {
    flexGrow: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg * 1.5,
    borderTopRightRadius: radius.lg * 1.5,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  optionPressed: { opacity: 0.9 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTi: { backgroundColor: colors.secondary },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  optionInfo: { flex: 1 },
  optionNome: {
    ...typography.subtitle,
    color: colors.text,
  },
  optionPerfil: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  hint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 18,
  },
});
