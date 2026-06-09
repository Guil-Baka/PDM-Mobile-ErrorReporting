import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useApp } from '../../src/context/AppContext';
import { EscopoLocalizacao, ESCOPO_LABELS } from '../../src/domain/types';
import { obterPrePreenchimento } from '../../src/services/ocorrenciaService';
import { colors, radius, spacing, typography } from '../../src/theme';

export default function NovaOcorrenciaScreen() {
  const { referenciaId } = useLocalSearchParams<{ referenciaId?: string }>();
  const { usuario, abrirOcorrencia, buscarOcorrencia } = useApp();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [referenciaTextual, setReferenciaTextual] = useState('');
  const [escopo, setEscopo] = useState<EscopoLocalizacao>('especifica');
  const [referenciaEncerradaId, setReferenciaEncerradaId] = useState<string | undefined>();
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function preencher() {
      if (!referenciaId) return;
      const encerrada = await buscarOcorrencia(referenciaId);
      if (!encerrada || encerrada.status !== 'encerrada') return;

      const pre = obterPrePreenchimento(encerrada);
      setTitulo(pre.titulo);
      setEscopo(pre.localizacao.escopo);
      setReferenciaTextual(pre.localizacao.referencia);
      setReferenciaEncerradaId(pre.referenciaOcorrenciaEncerradaId);
      // Descrição sob Confirmação Manual — não pré-preenchemos
    }
    preencher();
  }, [referenciaId, buscarOcorrencia]);

  const validar = (): boolean => {
    if (!titulo.trim()) {
      Alert.alert('Validação', 'Informe o título da ocorrência.');
      return false;
    }
    if (!descricao.trim()) {
      Alert.alert('Validação', 'Informe a descrição do problema.');
      return false;
    }
    if (!referenciaTextual.trim()) {
      Alert.alert('Validação', 'Informe a referência de localização.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!usuario || !validar()) return;
    setSalvando(true);
    try {
      const nova = await abrirOcorrencia({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        localizacao: { escopo, referencia: referenciaTextual.trim() },
        solicitanteId: usuario.id,
        solicitanteNome: usuario.nome,
        referenciaOcorrenciaEncerradaId: referenciaEncerradaId,
      });
      router.replace(`/ocorrencia/${nova.id}`);
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a ocorrência.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {referenciaEncerradaId ? (
          <View style={styles.aviso}>
            <Text style={styles.avisoTexto}>
              Nova Ocorrência vinculada à ocorrência encerrada anterior. Título e localização
              foram pré-preenchidos; confirme ou edite a descrição manualmente.
            </Text>
          </View>
        ) : null}

        <Input
          label="Título"
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Ex: Projetor com imagem distorcida"
        />

        <Input
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descreva o problema com detalhes..."
          multiline
          numberOfLines={4}
          style={styles.descricaoInput}
        />

        <View style={styles.campo}>
          <Text style={styles.label}>Escopo de Localização</Text>
          <View style={styles.escopoRow}>
            {(['especifica', 'geral'] as EscopoLocalizacao[]).map((e) => (
              <Pressable
                key={e}
                onPress={() => setEscopo(e)}
                style={[styles.escopoBtn, escopo === e && styles.escopoBtnAtivo]}
              >
                <Text
                  style={[styles.escopoTexto, escopo === e && styles.escopoTextoAtivo]}
                >
                  {ESCOPO_LABELS[e]}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Input
          label={escopo === 'especifica' ? 'Local específico' : 'Área geral'}
          value={referenciaTextual}
          onChangeText={setReferenciaTextual}
          placeholder={
            escopo === 'especifica' ? 'Ex: Bloco A — Sala 204' : 'Ex: Bloco B — 2º andar'
          }
        />

        <Button
          title="Abrir Ocorrência"
          onPress={handleSubmit}
          disabled={salvando}
          style={styles.submit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  aviso: {
    backgroundColor: `${colors.info}15`,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.info}30`,
  },
  avisoTexto: {
    ...typography.caption,
    color: colors.info,
    lineHeight: 18,
  },
  campo: { gap: spacing.xs },
  label: {
    ...typography.label,
    color: colors.textSecondary,
  },
  escopoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  escopoBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  escopoBtnAtivo: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  escopoTexto: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  escopoTextoAtivo: {
    color: colors.primary,
    fontWeight: '600',
  },
  descricaoInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: spacing.sm,
  },
});
