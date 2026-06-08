# CONTEXT

## Glossary

- **Ocorrência de Infraestrutura**: Registro formal de um problema relacionado à infraestrutura da faculdade.
- **Solicitante**: Pessoa que abre uma Ocorrência de Infraestrutura. Pode ser Aluno, Professor ou integrante da Equipe de TI.
- **Equipe de TI**: Grupo responsável por analisar, atualizar e encerrar Ocorrências de Infraestrutura.
- **Abertura da Ocorrência**: Ato de registrar uma nova Ocorrência de Infraestrutura. Pode ser executado por Aluno, Professor ou integrante da Equipe de TI.
- **Ações de Gestão da Ocorrência**: Conjunto de ações de análise, atualização e encerramento de uma Ocorrência de Infraestrutura. Só pode ser executado pela Equipe de TI.
- **Status da Ocorrência**: Estado atual de uma Ocorrência de Infraestrutura. Valores canônicos: Aberta, Em Atendimento, Aguardando Solicitante, Solicitação de Encerramento e Encerrada.
- **Escopo de Localização**: Nível de precisão do local associado à Ocorrência de Infraestrutura. Valores canônicos: Específica e Geral.
- **Específica**: Escopo de Localização em que a ocorrência aponta um local detalhado.
- **Geral**: Escopo de Localização em que a ocorrência aponta uma área ampla, sem ponto exato.
- **Aberta**: Ocorrência criada e ainda sem atendimento.
- **Em Atendimento**: Ocorrência assumida pela Equipe de TI.
- **Aguardando Solicitante**: Ocorrência que depende de retorno do Solicitante para continuar.
- **Solicitação de Encerramento**: Pedido feito pelo Solicitante para que a Equipe de TI avalie o encerramento de uma Ocorrência de Infraestrutura. A Equipe de TI pode negar a solicitação e manter a ocorrência ativa.
- **Encerrada**: Ocorrência finalizada pela Equipe de TI.
- **Motivo de Encerramento**: Justificativa registrada quando uma Ocorrência de Infraestrutura é encerrada.
- **Ocorrência Principal**: Ocorrência de Infraestrutura escolhida como registro de referência quando existem ocorrências duplicadas.
- **Referência da Ocorrência Principal**: Identificação da Ocorrência Principal exibida ao Solicitante da ocorrência encerrada como Duplicata.
- **Visão da Ocorrência Principal para Duplicata**: Conjunto de informações da Ocorrência Principal visível ao Solicitante da ocorrência encerrada como Duplicata. Exibe apenas resumo e status.
- **Resumo da Ocorrência Principal**: Conjunto mínimo de dados visíveis ao Solicitante da duplicata: título curto, localização (escopo + referência textual), data de abertura e última atualização.
- **Detalhes Restritos da Ocorrência Principal**: Informações não exibidas ao Solicitante da duplicata, como descrição completa, anexos e comentários internos.
- **Duplicata**: Valor de Motivo de Encerramento usado quando a ocorrência representa o mesmo problema já registrado em outra ocorrência principal.
- **Encerramento**: Ato de finalizar uma Ocorrência de Infraestrutura. Só pode ser executado pela Equipe de TI.
