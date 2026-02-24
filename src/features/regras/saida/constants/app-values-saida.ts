/**
 * Ações permitidas para regra de saída (fallback quando metadata do backend não está disponível).
 * Valores devem coincidir com APP_VALUES_PERMITIDOS_SAIDA no backend.
 * Labels em pt-BR para exibição no select.
 */
export const APP_VALUES_SAIDA_FALLBACK: { value: string; label: string }[] = [
  { value: 'Answer', label: 'Atender' },
  { value: 'Dial', label: 'Discar' },
  { value: 'Set', label: 'Definir variável' },
  { value: 'Hangup', label: 'Encerrar' },
  { value: 'Goto', label: 'Ir para' },
  { value: 'GotoIf', label: 'Ir para (condicional)' },
  { value: 'Playback', label: 'Reproduzir áudio' },
  { value: 'Wait', label: 'Aguardar' },
  { value: 'NoOp', label: 'Nenhuma operação' },
  { value: 'Return', label: 'Retornar' },
  { value: 'Progress', label: 'Indicar progresso' },
  { value: 'Ringing', label: 'Indicar toque' },
  { value: 'Exec', label: 'Executar aplicação' },
  { value: 'ExecIf', label: 'Executar aplicação (condicional)' },
]
