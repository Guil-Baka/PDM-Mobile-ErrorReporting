import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NovaOcorrenciaInput,
  Ocorrencia,
  ResumoOcorrenciaPrincipal,
  Usuario,
} from '../domain/types';

const OCORRENCIAS_KEY = '@ocorrencias';
const USUARIO_KEY = '@usuario_atual';

const USUARIOS_MOCK: Usuario[] = [
  { id: 'u1', nome: 'Ana Silva', email: 'ana@faculdade.edu', perfil: 'aluno' },
  { id: 'u2', nome: 'Prof. Carlos', email: 'carlos@faculdade.edu', perfil: 'professor' },
  { id: 'u3', nome: 'Mariana TI', email: 'mariana@faculdade.edu', perfil: 'ti' },
];

function gerarId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function criarOcorrenciaInicial(input: NovaOcorrenciaInput): Ocorrencia {
  const agora = new Date().toISOString();
  return {
    id: gerarId(),
    titulo: input.titulo,
    descricao: input.descricao,
    localizacao: input.localizacao,
    status: 'aberta',
    solicitanteId: input.solicitanteId,
    solicitanteNome: input.solicitanteNome,
    referenciaOcorrenciaEncerradaId: input.referenciaOcorrenciaEncerradaId,
    respostasSolicitante: [],
    historico: [
      {
        id: gerarId(),
        tipo: 'abertura',
        descricao: `${input.solicitanteNome} abriu a ocorrência.`,
        autorId: input.solicitanteId,
        autorNome: input.solicitanteNome,
        criadoEm: agora,
      },
    ],
    abertaEm: agora,
    atualizadaEm: agora,
  };
}

const OCORRENCIAS_INICIAIS: Ocorrencia[] = [
  {
    id: 'oc1',
    titulo: 'Projetor com imagem distorcida',
    descricao: 'O projetor da sala 204 exibe imagem distorcida nas bordas.',
    localizacao: { escopo: 'especifica', referencia: 'Bloco A — Sala 204' },
    status: 'aberta',
    solicitanteId: 'u1',
    solicitanteNome: 'Ana Silva',
    respostasSolicitante: [],
    historico: [
      {
        id: 'ev1',
        tipo: 'abertura',
        descricao: 'Ana Silva abriu a ocorrência.',
        autorId: 'u1',
        autorNome: 'Ana Silva',
        criadoEm: '2026-06-01T10:00:00.000Z',
      },
    ],
    abertaEm: '2026-06-01T10:00:00.000Z',
    atualizadaEm: '2026-06-01T10:00:00.000Z',
  },
  {
    id: 'oc2',
    titulo: 'Ar-condicionado barulhento',
    descricao: 'Unidade do corredor do 2º andar faz ruído contínuo.',
    localizacao: { escopo: 'geral', referencia: 'Bloco B — 2º andar' },
    status: 'em_atendimento',
    solicitanteId: 'u2',
    solicitanteNome: 'Prof. Carlos',
    responsavelTiId: 'u3',
    responsavelTiNome: 'Mariana TI',
    respostasSolicitante: [],
    historico: [
      {
        id: 'ev2',
        tipo: 'abertura',
        descricao: 'Prof. Carlos abriu a ocorrência.',
        autorId: 'u2',
        autorNome: 'Prof. Carlos',
        criadoEm: '2026-05-28T14:30:00.000Z',
      },
      {
        id: 'ev3',
        tipo: 'assumir_atendimento',
        descricao: 'Mariana TI assumiu o atendimento.',
        autorId: 'u3',
        autorNome: 'Mariana TI',
        criadoEm: '2026-05-29T09:00:00.000Z',
      },
    ],
    abertaEm: '2026-05-28T14:30:00.000Z',
    atualizadaEm: '2026-05-29T09:00:00.000Z',
  },
  {
    id: 'oc3',
    titulo: 'Tomada sem energia',
    descricao: 'Tomada próxima à janela não funciona.',
    localizacao: { escopo: 'especifica', referencia: 'Laboratório de Informática — Estação 12' },
    status: 'aguardando_solicitante',
    solicitanteId: 'u1',
    solicitanteNome: 'Ana Silva',
    responsavelTiId: 'u3',
    responsavelTiNome: 'Mariana TI',
    respostasSolicitante: [],
    historico: [
      {
        id: 'ev4',
        tipo: 'abertura',
        descricao: 'Ana Silva abriu a ocorrência.',
        autorId: 'u1',
        autorNome: 'Ana Silva',
        criadoEm: '2026-06-05T08:00:00.000Z',
      },
      {
        id: 'ev5',
        tipo: 'assumir_atendimento',
        descricao: 'Mariana TI assumiu o atendimento.',
        autorId: 'u3',
        autorNome: 'Mariana TI',
        criadoEm: '2026-06-05T10:00:00.000Z',
      },
      {
        id: 'ev6',
        tipo: 'aguardando_solicitante',
        descricao: 'Precisamos confirmar se o problema persiste após reinício.',
        autorId: 'u3',
        autorNome: 'Mariana TI',
        criadoEm: '2026-06-06T11:00:00.000Z',
      },
    ],
    abertaEm: '2026-06-05T08:00:00.000Z',
    atualizadaEm: '2026-06-06T11:00:00.000Z',
  },
];

async function lerOcorrencias(): Promise<Ocorrencia[]> {
  const raw = await AsyncStorage.getItem(OCORRENCIAS_KEY);
  if (!raw) {
    await AsyncStorage.setItem(OCORRENCIAS_KEY, JSON.stringify(OCORRENCIAS_INICIAIS));
    return OCORRENCIAS_INICIAIS;
  }
  return JSON.parse(raw) as Ocorrencia[];
}

async function salvarOcorrencias(ocorrencias: Ocorrencia[]): Promise<void> {
  await AsyncStorage.setItem(OCORRENCIAS_KEY, JSON.stringify(ocorrencias));
}

export async function listarUsuarios(): Promise<Usuario[]> {
  return USUARIOS_MOCK;
}

export async function obterUsuarioAtual(): Promise<Usuario | null> {
  const raw = await AsyncStorage.getItem(USUARIO_KEY);
  return raw ? (JSON.parse(raw) as Usuario) : null;
}

export async function definirUsuarioAtual(usuario: Usuario): Promise<void> {
  await AsyncStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export async function listarOcorrencias(): Promise<Ocorrencia[]> {
  const ocorrencias = await lerOcorrencias();
  return ocorrencias.sort(
    (a, b) => new Date(b.atualizadaEm).getTime() - new Date(a.atualizadaEm).getTime()
  );
}

export async function obterOcorrencia(id: string): Promise<Ocorrencia | null> {
  const ocorrencias = await lerOcorrencias();
  return ocorrencias.find((o) => o.id === id) ?? null;
}

export async function criarOcorrencia(input: NovaOcorrenciaInput): Promise<Ocorrencia> {
  const ocorrencias = await lerOcorrencias();
  const nova = criarOcorrenciaInicial(input);
  ocorrencias.push(nova);
  await salvarOcorrencias(ocorrencias);
  return nova;
}

export async function atualizarOcorrencia(ocorrencia: Ocorrencia): Promise<Ocorrencia> {
  const ocorrencias = await lerOcorrencias();
  const index = ocorrencias.findIndex((o) => o.id === ocorrencia.id);
  if (index === -1) {
    throw new Error('Ocorrência não encontrada.');
  }
  ocorrencias[index] = ocorrencia;
  await salvarOcorrencias(ocorrencias);
  return ocorrencia;
}

/** Campos de Pré-preenchimento da Nova Ocorrência a partir de ocorrência encerrada */
export function obterPrePreenchimento(ocorrenciaEncerrada: Ocorrencia): {
  titulo: string;
  localizacao: Ocorrencia['localizacao'];
  referenciaOcorrenciaEncerradaId: string;
} {
  return {
    titulo: ocorrenciaEncerrada.titulo,
    localizacao: { ...ocorrenciaEncerrada.localizacao },
    referenciaOcorrenciaEncerradaId: ocorrenciaEncerrada.id,
  };
}

/** Visão da Ocorrência Principal para Duplicata (resumo + status) */
export function obterResumoOcorrenciaPrincipal(
  ocorrencia: Ocorrencia
): ResumoOcorrenciaPrincipal {
  return {
    id: ocorrencia.id,
    titulo: ocorrencia.titulo,
    localizacao: ocorrencia.localizacao,
    status: ocorrencia.status,
    abertaEm: ocorrencia.abertaEm,
    atualizadaEm: ocorrencia.atualizadaEm,
  };
}

export async function listarOcorrenciasAtivas(): Promise<Ocorrencia[]> {
  const ocorrencias = await listarOcorrencias();
  return ocorrencias.filter((o) => o.status !== 'encerrada');
}
