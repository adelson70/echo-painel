/**
 * Padrões de rota (exten) válidos para regra de saída.
 * Ajuda o usuário a construir a rota corretamente (Asterisk).
 */
export const ROTA_PADROES: { value: string; label: string }[] = [
  { value: 's', label: 's (início)' },
  { value: '_X.', label: '_X. (qualquer dígito + qualquer coisa)' },
  { value: '_NXXNXXXXXX', label: '_NXXNXXXXXX (10 dígitos, ex.: fixo)' },
  { value: '_9NXXNXXXXXX', label: '_9NXXNXXXXXX (9 + 10 dígitos)' },
  { value: '_XXXX', label: '_XXXX (4 dígitos)' },
]

export const ROTA_AJUDA_TEXTO =
  'Rota (exten) no Asterisk: use "s" para início ou padrões com _ (X=0-9, N=2-9, Z=1-9). Ex.: _X., _9NXXNXXXXXX. Máx. 40 caracteres.'
