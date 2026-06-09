/** Perfil do Solicitante ou integrante da Equipe de TI */
export type PerfilUsuario = 'aluno' | 'professor' | 'ti';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
}

/** Status canônicos da Ocorrência de Infraestrutura */
export type StatusOcorrencia =
  | 'aberta'
  | 'em_atendimento'
  | 'aguardando_solicitante'
  | 'solicitacao_encerramento'
  | 'encerrada';

/** Escopo de Localização canônico */
export type EscopoLocalizacao = 'especifica' | 'geral';

/** Motivo de Encerramento */
export type MotivoEncerramento = 'resolvido' | 'duplicata' | 'invalido' | 'outro';

export interface Localizacao {
  escopo: EscopoLocalizacao;
  referencia: string;
}

export interface RespostaSolicitante {
  id: string;
  autorId: string;
  autorNome: string;
  conteudo: string;
  criadoEm: string;
}

export interface EventoOcorrencia {
  id: string;
  tipo: string;
  descricao: string;
  autorId: string;
  autorNome: string;
  criadoEm: string;
}

/** Resumo da Ocorrência Principal visível ao Solicitante da duplicata */
export interface ResumoOcorrenciaPrincipal {
  id: string;
  titulo: string;
  localizacao: Localizacao;
  status: StatusOcorrencia;
  abertaEm: string;
  atualizadaEm: string;
}

export interface Ocorrencia {
  id: string;
  titulo: string;
  descricao: string;
  localizacao: Localizacao;
  status: StatusOcorrencia;
  solicitanteId: string;
  solicitanteNome: string;
  responsavelTiId?: string;
  responsavelTiNome?: string;
  motivoEncerramento?: MotivoEncerramento;
  justificativaEncerramento?: string;
  /** Referência da Ocorrência Principal (encerramento por Duplicata) */
  referenciaOcorrenciaPrincipalId?: string;
  /** Referência Imediata de Ocorrência Encerrada (nova ocorrência após encerramento) */
  referenciaOcorrenciaEncerradaId?: string;
  respostasSolicitante: RespostaSolicitante[];
  historico: EventoOcorrencia[];
  abertaEm: string;
  atualizadaEm: string;
  encerradaEm?: string;
}

export interface NovaOcorrenciaInput {
  titulo: string;
  descricao: string;
  localizacao: Localizacao;
  solicitanteId: string;
  solicitanteNome: string;
  referenciaOcorrenciaEncerradaId?: string;
}

export const STATUS_LABELS: Record<StatusOcorrencia, string> = {
  aberta: 'Aberta',
  em_atendimento: 'Em Atendimento',
  aguardando_solicitante: 'Aguardando Solicitante',
  solicitacao_encerramento: 'Solicitação de Encerramento',
  encerrada: 'Encerrada',
};

export const ESCOPO_LABELS: Record<EscopoLocalizacao, string> = {
  especifica: 'Específica',
  geral: 'Geral',
};

export const MOTIVO_ENCERRAMENTO_LABELS: Record<MotivoEncerramento, string> = {
  resolvido: 'Resolvido',
  duplicata: 'Duplicata',
  invalido: 'Inválido',
  outro: 'Outro',
};

export const PERFIL_LABELS: Record<PerfilUsuario, string> = {
  aluno: 'Aluno',
  professor: 'Professor',
  ti: 'Equipe de TI',
};

export function isEquipeTi(perfil: PerfilUsuario): boolean {
  return perfil === 'ti';
}

export function podeGerirOcorrencia(perfil: PerfilUsuario): boolean {
  return isEquipeTi(perfil);
}

export function podeAbrirOcorrencia(_perfil: PerfilUsuario): boolean {
  return true;
}

export function isOcorrenciaAtiva(status: StatusOcorrencia): boolean {
  return status !== 'encerrada';
}
