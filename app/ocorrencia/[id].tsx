import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { StatusBadge } from '../../src/components/StatusBadge';
import { useApp } from '../../src/context/AppContext';
import {
  assumirAtendimento,
  definirAguardandoSolicitante,
  encerrarOcorrencia,
  negarSolicitacaoEncerramento,
  responderComoSolicitante,
  solicitarEncerramento,
  TransicaoInvalidaError,
} from '../../src/domain/transitions';
import {
  ESCOPO_LABELS,
  MOTIVO_ENCERRAMENTO_LABELS,
  MotivoEncerramento,
  Ocorrencia,
  STATUS_LABELS,
} from '../../src/domain/types';
import {
  obterResumoOcorrenciaPrincipal,
} from '../../src/services/ocorrenciaService';
import { colors, radius, spacing, typography } from '../../src/theme';

function formatarData(iso: string): string {
  return new Date(iso).toLocaleString('pt-BR');
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.secao}>
      <Text style={styles.secaoTitulo}>{titulo}</Text>
      {children}
    </View>
  );
}

export default function DetalheOcorrenciaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { usuario, isTi, buscarOcorrencia, salvarOcorrencia, ocorrencias } = useApp();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [resposta, setResposta] = useState('');
  const [justificativaEncerramento, setJustificativaEncerramento] = useState('');
  const [referenciaPrincipalId, setReferenciaPrincipalId] = useState('');
  const [motivoEncerramento, setMotivoEncerramento] = useState<MotivoEncerramento>('resolvido');
  const [processando, setProcessando] = useState(false);

  const carregar = useCallback(async () => {
    if (!id) return;
    const oc = await buscarOcorrencia(id);
    setOcorrencia(oc);
    setCarregando(false);
  }, [id, buscarOcorrencia]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const executarAcao = async (acao: () => Ocorrencia) => {
    if (!ocorrencia || !usuario) return;
    setProcessando(true);
    try {
      const atualizada = acao();
      await salvarOcorrencia(atualizada);
      setOcorrencia(atualizada);
    } catch (err) {
      const msg = err instanceof TransicaoInvalidaError ? err.message : 'Erro ao executar ação.';
      Alert.alert('Ação não permitida', msg);
    } finally {
      setProcessando(false);
    }
  };

  if (carregando || !ocorrencia) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const isSolicitante = usuario?.id === ocorrencia.solicitanteId;
  const ocorrenciaPrincipal = ocorrencia.referenciaOcorrenciaPrincipalId
    ? ocorrencias.find((o) => o.id === ocorrencia.referenciaOcorrenciaPrincipalId)
    : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{ocorrencia.titulo}</Text>
        <StatusBadge status={ocorrencia.status} />
      </View>

      <Secao titulo="Localização">
        <Text style={styles.texto}>
          {ESCOPO_LABELS[ocorrencia.localizacao.escopo]} — {ocorrencia.localizacao.referencia}
        </Text>
      </Secao>

      <Secao titulo="Descrição">
        <Text style={styles.texto}>{ocorrencia.descricao}</Text>
      </Secao>

      <Secao titulo="Informações">
        <InfoRow label="Solicitante" value={ocorrencia.solicitanteNome} />
        {ocorrencia.responsavelTiNome ? (
          <InfoRow label="Responsável TI" value={ocorrencia.responsavelTiNome} />
        ) : null}
        <InfoRow label="Aberta em" value={formatarData(ocorrencia.abertaEm)} />
        <InfoRow label="Atualizada em" value={formatarData(ocorrencia.atualizadaEm)} />
        {ocorrencia.encerradaEm ? (
          <InfoRow label="Encerrada em" value={formatarData(ocorrencia.encerradaEm)} />
        ) : null}
        {ocorrencia.motivoEncerramento ? (
          <InfoRow
            label="Motivo de Encerramento"
            value={MOTIVO_ENCERRAMENTO_LABELS[ocorrencia.motivoEncerramento]}
          />
        ) : null}
        {ocorrencia.justificativaEncerramento ? (
          <InfoRow label="Justificativa" value={ocorrencia.justificativaEncerramento} />
        ) : null}
      </Secao>

      {ocorrenciaPrincipal ? (
        <Secao titulo="Ocorrência Principal (Duplicata)">
          {(() => {
            const resumo = obterResumoOcorrenciaPrincipal(ocorrenciaPrincipal);
            return (
              <>
                <InfoRow label="Título" value={resumo.titulo} />
                <InfoRow
                  label="Localização"
                  value={`${ESCOPO_LABELS[resumo.localizacao.escopo]} — ${resumo.localizacao.referencia}`}
                />
                <InfoRow label="Status" value={STATUS_LABELS[resumo.status]} />
                <InfoRow label="Aberta em" value={formatarData(resumo.abertaEm)} />
                <InfoRow label="Atualizada em" value={formatarData(resumo.atualizadaEm)} />
              </>
            );
          })()}
        </Secao>
      ) : null}

      {ocorrencia.respostasSolicitante.length > 0 ? (
        <Secao titulo="Respostas do Solicitante">
          {ocorrencia.respostasSolicitante.map((r) => (
            <View key={r.id} style={styles.resposta}>
              <Text style={styles.respostaAutor}>{r.autorNome}</Text>
              <Text style={styles.texto}>{r.conteudo}</Text>
              <Text style={styles.respostaData}>{formatarData(r.criadoEm)}</Text>
            </View>
          ))}
        </Secao>
      ) : null}

      <Secao titulo="Histórico">
        {[...ocorrencia.historico].reverse().map((ev) => (
          <View key={ev.id} style={styles.evento}>
            <Text style={styles.eventoDesc}>{ev.descricao}</Text>
            <Text style={styles.eventoData}>{formatarData(ev.criadoEm)}</Text>
          </View>
        ))}
      </Secao>

      {/* Ações da Equipe de TI */}
      {isTi && ocorrencia.status === 'aberta' ? (
        <View style={styles.acoes}>
          <Button
            title="Assumir Atendimento"
            disabled={processando}
            onPress={() =>
              executarAcao(() =>
                assumirAtendimento(ocorrencia, usuario!.id, usuario!.nome)
              )
            }
          />
        </View>
      ) : null}

      {isTi && ocorrencia.status === 'em_atendimento' ? (
        <View style={styles.acoes}>
          <Button
            title="Aguardar Solicitante"
            variant="secondary"
            disabled={processando}
            onPress={() =>
              executarAcao(() =>
                definirAguardandoSolicitante(ocorrencia, usuario!.id, usuario!.nome)
              )
            }
          />
          <EncerramentoForm
            motivo={motivoEncerramento}
            onMotivoChange={setMotivoEncerramento}
            justificativa={justificativaEncerramento}
            onJustificativaChange={setJustificativaEncerramento}
            referenciaPrincipalId={referenciaPrincipalId}
            onReferenciaChange={setReferenciaPrincipalId}
            onEncerrar={() =>
              executarAcao(() =>
                encerrarOcorrencia(
                  ocorrencia,
                  usuario!.id,
                  usuario!.nome,
                  motivoEncerramento,
                  justificativaEncerramento,
                  motivoEncerramento === 'duplicata' ? referenciaPrincipalId : undefined
                )
              )
            }
            processando={processando}
          />
        </View>
      ) : null}

      {isTi && ocorrencia.status === 'solicitacao_encerramento' ? (
        <View style={styles.acoes}>
          <Button
            title="Negar Encerramento (voltar p/ Em Atendimento)"
            variant="outline"
            disabled={processando}
            onPress={() =>
              executarAcao(() =>
                negarSolicitacaoEncerramento(ocorrencia, usuario!.id, usuario!.nome)
              )
            }
          />
          <EncerramentoForm
            motivo={motivoEncerramento}
            onMotivoChange={setMotivoEncerramento}
            justificativa={justificativaEncerramento}
            onJustificativaChange={setJustificativaEncerramento}
            referenciaPrincipalId={referenciaPrincipalId}
            onReferenciaChange={setReferenciaPrincipalId}
            onEncerrar={() =>
              executarAcao(() =>
                encerrarOcorrencia(
                  ocorrencia,
                  usuario!.id,
                  usuario!.nome,
                  motivoEncerramento,
                  justificativaEncerramento,
                  motivoEncerramento === 'duplicata' ? referenciaPrincipalId : undefined
                )
              )
            }
            processando={processando}
          />
        </View>
      ) : null}

      {/* Ações do Solicitante */}
      {isSolicitante && ocorrencia.status === 'aguardando_solicitante' ? (
        <View style={styles.acoes}>
          <Input
            label="Sua resposta"
            value={resposta}
            onChangeText={setResposta}
            multiline
            numberOfLines={3}
            placeholder="Informe os detalhes solicitados..."
          />
          <Button
            title="Enviar Resposta"
            disabled={processando || !resposta.trim()}
            onPress={() =>
              executarAcao(() =>
                responderComoSolicitante(
                  ocorrencia,
                  usuario!.id,
                  usuario!.nome,
                  resposta.trim()
                )
              ).then(() => setResposta(''))
            }
          />
        </View>
      ) : null}

      {isSolicitante &&
      (ocorrencia.status === 'em_atendimento' ||
        ocorrencia.status === 'aguardando_solicitante') ? (
        <View style={styles.acoes}>
          <Button
            title="Solicitar Encerramento"
            variant="outline"
            disabled={processando}
            onPress={() =>
              Alert.alert(
                'Solicitar Encerramento',
                'A Equipe de TI irá avaliar se o problema foi resolvido.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  {
                    text: 'Confirmar',
                    onPress: () =>
                      executarAcao(() =>
                        solicitarEncerramento(ocorrencia, usuario!.id, usuario!.nome)
                      ),
                  },
                ]
              )
            }
          />
        </View>
      ) : null}

      {ocorrencia.status === 'encerrada' && isSolicitante ? (
        <View style={styles.acoes}>
          <Button
            title="Abrir Nova Ocorrência (mesmo problema)"
            onPress={() =>
              router.push({
                pathname: '/ocorrencia/nova',
                params: { referenciaId: ocorrencia.id },
              })
            }
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function EncerramentoForm({
  motivo,
  onMotivoChange,
  justificativa,
  onJustificativaChange,
  referenciaPrincipalId,
  onReferenciaChange,
  onEncerrar,
  processando,
}: {
  motivo: MotivoEncerramento;
  onMotivoChange: (m: MotivoEncerramento) => void;
  justificativa: string;
  onJustificativaChange: (v: string) => void;
  referenciaPrincipalId: string;
  onReferenciaChange: (v: string) => void;
  onEncerrar: () => void;
  processando: boolean;
}) {
  const motivos: MotivoEncerramento[] = ['resolvido', 'duplicata', 'invalido', 'outro'];

  return (
    <View style={styles.encerramentoForm}>
      <Text style={styles.secaoTitulo}>Encerramento</Text>
      <View style={styles.motivoRow}>
        {motivos.map((m) => (
          <Button
            key={m}
            title={MOTIVO_ENCERRAMENTO_LABELS[m]}
            variant={motivo === m ? 'primary' : 'outline'}
            onPress={() => onMotivoChange(m)}
            style={styles.motivoBtn}
          />
        ))}
      </View>
      {motivo === 'duplicata' ? (
        <Input
          label="ID da Ocorrência Principal"
          value={referenciaPrincipalId}
          onChangeText={onReferenciaChange}
          placeholder="Ex: oc1"
        />
      ) : null}
      <Input
        label="Justificativa"
        value={justificativa}
        onChangeText={onJustificativaChange}
        multiline
        numberOfLines={2}
        placeholder="Descreva o motivo do encerramento..."
      />
      <Button
        title="Encerrar Ocorrência"
        variant="danger"
        disabled={processando || !justificativa.trim()}
        onPress={onEncerrar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: { flex: 1 },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  header: { gap: spacing.sm },
  titulo: {
    ...typography.title,
    color: colors.text,
  },
  secao: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  secaoTitulo: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  texto: {
    ...typography.body,
    color: colors.text,
    lineHeight: 22,
  },
  infoRow: { gap: 2 },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
  },
  resposta: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.sm,
    gap: 4,
  },
  respostaAutor: {
    ...typography.label,
    color: colors.primary,
  },
  respostaData: {
    ...typography.caption,
    color: colors.textMuted,
  },
  evento: {
    borderLeftWidth: 3,
    borderLeftColor: colors.border,
    paddingLeft: spacing.sm,
    gap: 2,
    marginBottom: spacing.xs,
  },
  eventoDesc: {
    ...typography.caption,
    color: colors.text,
  },
  eventoData: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  acoes: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  encerramentoForm: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  motivoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  motivoBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
});
