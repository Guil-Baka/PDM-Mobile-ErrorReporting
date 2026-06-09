import {
  MotivoEncerramento,
  Ocorrencia,
  StatusOcorrencia,
} from './types';

export class TransicaoInvalidaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TransicaoInvalidaError';
  }
}

function criarEvento(
  tipo: string,
  descricao: string,
  autorId: string,
  autorNome: string
) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tipo,
    descricao,
    autorId,
    autorNome,
    criadoEm: new Date().toISOString(),
  };
}

function atualizar(
  ocorrencia: Ocorrencia,
  patch: Partial<Ocorrencia>,
  evento: ReturnType<typeof criarEvento>
): Ocorrencia {
  return {
    ...ocorrencia,
    ...patch,
    atualizadaEm: new Date().toISOString(),
    historico: [...ocorrencia.historico, evento],
  };
}

/** Equipe de TI assume a ocorrência: Aberta → Em Atendimento */
export function assumirAtendimento(
  ocorrencia: Ocorrencia,
  responsavelId: string,
  responsavelNome: string
): Ocorrencia {
  if (ocorrencia.status !== 'aberta') {
    throw new TransicaoInvalidaError('Apenas ocorrências Abertas podem ser assumidas.');
  }
  return atualizar(
    ocorrencia,
    {
      status: 'em_atendimento',
      responsavelTiId: responsavelId,
      responsavelTiNome: responsavelNome,
    },
    criarEvento(
      'assumir_atendimento',
      `${responsavelNome} assumiu o atendimento.`,
      responsavelId,
      responsavelNome
    )
  );
}

/** Definição de Aguardando Solicitante: Em Atendimento → Aguardando Solicitante */
export function definirAguardandoSolicitante(
  ocorrencia: Ocorrencia,
  autorId: string,
  autorNome: string,
  mensagem?: string
): Ocorrencia {
  if (ocorrencia.status !== 'em_atendimento') {
    throw new TransicaoInvalidaError(
      'Apenas ocorrências Em Atendimento podem ir para Aguardando Solicitante.'
    );
  }
  return atualizar(
    ocorrencia,
    { status: 'aguardando_solicitante' },
    criarEvento(
      'aguardando_solicitante',
      mensagem ?? `${autorNome} aguarda retorno do Solicitante.`,
      autorId,
      autorNome
    )
  );
}

/** Resposta do Solicitante: Aguardando Solicitante → Em Atendimento */
export function responderComoSolicitante(
  ocorrencia: Ocorrencia,
  solicitanteId: string,
  solicitanteNome: string,
  conteudo: string
): Ocorrencia {
  if (ocorrencia.status !== 'aguardando_solicitante') {
    throw new TransicaoInvalidaError(
      'Resposta permitida apenas em ocorrências Aguardando Solicitante.'
    );
  }
  if (ocorrencia.solicitanteId !== solicitanteId) {
    throw new TransicaoInvalidaError('Apenas o Solicitante pode responder.');
  }
  const resposta = {
    id: `${Date.now()}-resp`,
    autorId: solicitanteId,
    autorNome: solicitanteNome,
    conteudo,
    criadoEm: new Date().toISOString(),
  };
  return atualizar(
    ocorrencia,
    {
      status: 'em_atendimento',
      respostasSolicitante: [...ocorrencia.respostasSolicitante, resposta],
    },
    criarEvento(
      'resposta_solicitante',
      `${solicitanteNome} respondeu ao pedido de informação.`,
      solicitanteId,
      solicitanteNome
    )
  );
}

/** Solicitação de Encerramento pelo Solicitante */
export function solicitarEncerramento(
  ocorrencia: Ocorrencia,
  solicitanteId: string,
  solicitanteNome: string
): Ocorrencia {
  const statusPermitidos: StatusOcorrencia[] = [
    'em_atendimento',
    'aguardando_solicitante',
  ];
  if (!statusPermitidos.includes(ocorrencia.status)) {
    throw new TransicaoInvalidaError(
      'Solicitação de Encerramento não permitida neste status.'
    );
  }
  if (ocorrencia.solicitanteId !== solicitanteId) {
    throw new TransicaoInvalidaError('Apenas o Solicitante pode solicitar encerramento.');
  }
  return atualizar(
    ocorrencia,
    { status: 'solicitacao_encerramento' },
    criarEvento(
      'solicitacao_encerramento',
      `${solicitanteNome} solicitou encerramento da ocorrência.`,
      solicitanteId,
      solicitanteNome
    )
  );
}

/** Decisão Final de Encerramento pela Equipe de TI */
export function encerrarOcorrencia(
  ocorrencia: Ocorrencia,
  autorId: string,
  autorNome: string,
  motivo: MotivoEncerramento,
  justificativa: string,
  referenciaOcorrenciaPrincipalId?: string
): Ocorrencia {
  const statusPermitidos: StatusOcorrencia[] = [
    'em_atendimento',
    'solicitacao_encerramento',
  ];
  if (!statusPermitidos.includes(ocorrencia.status)) {
    throw new TransicaoInvalidaError('Encerramento não permitido neste status.');
  }
  if (motivo === 'duplicata') {
    if (!referenciaOcorrenciaPrincipalId) {
      throw new TransicaoInvalidaError(
        'Encerramento por Duplicata exige Referência da Ocorrência Principal.'
      );
    }
    if (referenciaOcorrenciaPrincipalId === ocorrencia.id) {
      throw new TransicaoInvalidaError(
        'A ocorrência não pode referenciar a si mesma como Ocorrência Principal.'
      );
    }
  }
  const agora = new Date().toISOString();
  return atualizar(
    ocorrencia,
    {
      status: 'encerrada',
      motivoEncerramento: motivo,
      justificativaEncerramento: justificativa,
      referenciaOcorrenciaPrincipalId:
        motivo === 'duplicata' ? referenciaOcorrenciaPrincipalId : undefined,
      encerradaEm: agora,
    },
    criarEvento(
      'encerramento',
      `${autorNome} encerrou a ocorrência (${motivo}).`,
      autorId,
      autorNome
    )
  );
}

/** Retorno para Em Atendimento após negativa da Solicitação de Encerramento */
export function negarSolicitacaoEncerramento(
  ocorrencia: Ocorrencia,
  autorId: string,
  autorNome: string,
  motivo?: string
): Ocorrencia {
  if (ocorrencia.status !== 'solicitacao_encerramento') {
    throw new TransicaoInvalidaError(
      'Negativa de encerramento permitida apenas em Solicitação de Encerramento.'
    );
  }
  return atualizar(
    ocorrencia,
    { status: 'em_atendimento' },
    criarEvento(
      'negar_encerramento',
      motivo ?? `${autorNome} manteve a ocorrência ativa.`,
      autorId,
      autorNome
    )
  );
}

/** Não Reabertura: ocorrências encerradas não voltam para status ativo */
export function validarNaoReabertura(ocorrencia: Ocorrencia): void {
  if (ocorrencia.status === 'encerrada') {
    throw new TransicaoInvalidaError(
      'Ocorrências Encerradas não podem ser reabertas. Abra uma Nova Ocorrência.'
    );
  }
}
