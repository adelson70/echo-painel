/**
 * Subparâmetros por ação para construir o campo "parametros" (appdata) enviado à API.
 * Cada ação pode ter campos que são concatenados na ordem correta para o Asterisk.
 */

export interface CampoParametro {
  key: string
  label: string
  placeholder: string
  type: 'text' | 'number'
  optional?: boolean
}

export interface ConfigParametros {
  /** Campos exibidos para o usuário (subparâmetros) */
  campos: CampoParametro[]
  /**
   * Monta a string parametros a partir dos valores dos campos.
   * Valores são passados na ordem dos campos; vazios opcionais são omitidos.
   */
  build: (valores: Record<string, string>) => string
  /**
   * Opcional: interpreta a string parametros (vinda da API) para preencher os campos ao editar.
   */
  parse?: (parametros: string) => Record<string, string>
}

function parseSimples(parametros: string): Record<string, string> {
  const t = (parametros || '').trim()
  return { valor: t }
}

function parseDial(parametros: string): Record<string, string> {
  const t = (parametros || '').trim()
  const [destino, timeout] = t.split(',').map((s) => s.trim())
  return { destino: destino || '', timeout: timeout || '' }
}

function parseGoto(parametros: string): Record<string, string> {
  const t = (parametros || '').trim()
  const parts = t.split(',')
  return {
    contexto: parts[0] || '',
    exten: parts[1] || '',
    prioridade: parts[2] || ''
  }
}

export const PARAMETROS_POR_ACAO: Record<string, ConfigParametros> = {
  Answer: {
    campos: [],
    build: () => ''
  },
  Hangup: {
    campos: [],
    build: () => ''
  },
  NoOp: {
    campos: [{ key: 'mensagem', label: 'Mensagem (log)', placeholder: 'Texto para log', type: 'text', optional: true }],
    build: (v) => (v.mensagem || '').trim(),
    parse: parseSimples
  },
  Dial: {
    campos: [
      { key: 'destino', label: 'Destino', placeholder: 'Ex: PJSIP/1001 ou PJSIP/${EXTEN}', type: 'text' },
      { key: 'timeout', label: 'Timeout (s)', placeholder: 'Ex: 60', type: 'number', optional: true }
    ],
    build: (v) => {
      const dest = (v.destino || '').trim()
      const to = (v.timeout || '').trim()
      return to ? `${dest},${to}` : dest
    },
    parse: parseDial
  },
  Playback: {
    campos: [{ key: 'arquivo', label: 'Arquivo de áudio', placeholder: 'Ex: demo-congrats ou arquivo', type: 'text' }],
    build: (v) => (v.arquivo || '').trim(),
    parse: (p) => ({ arquivo: (p || '').trim() })
  },
  Wait: {
    campos: [{ key: 'segundos', label: 'Segundos', placeholder: 'Ex: 3', type: 'number' }],
    build: (v) => (v.segundos || '0').trim(),
    parse: (p) => ({ segundos: (p || '').trim() })
  },
  Set: {
    campos: [
      { key: 'variavel', label: 'Variável', placeholder: 'Ex: VARIAVEL', type: 'text' },
      { key: 'valor', label: 'Valor', placeholder: 'Ex: valor', type: 'text' }
    ],
    build: (v) => `${(v.variavel || '').trim()}=${(v.valor || '').trim()}`,
    parse: (p) => {
      const t = (p || '').trim()
      const eq = t.indexOf('=')
      if (eq < 0) return { variavel: t, valor: '' }
      return { variavel: t.slice(0, eq).trim(), valor: t.slice(eq + 1).trim() }
    }
  },
  Goto: {
    campos: [
      { key: 'contexto', label: 'Contexto', placeholder: 'Ex: default', type: 'text' },
      { key: 'exten', label: 'Exten', placeholder: 'Ex: s ou 100', type: 'text' },
      { key: 'prioridade', label: 'Prioridade', placeholder: 'Ex: 1', type: 'text', optional: true }
    ],
    build: (v) => {
      const parts = [(v.contexto || '').trim(), (v.exten || '').trim(), (v.prioridade || '').trim()].filter(Boolean)
      return parts.join(',')
    },
    parse: parseGoto
  },
  GotoIf: {
    campos: [
      { key: 'expressao', label: 'Expressão', placeholder: 'Ex: $["${x}" = "1"]?sim:nao', type: 'text' }
    ],
    build: (v) => (v.expressao || '').trim(),
    parse: parseSimples
  },
  Return: {
    campos: [{ key: 'valor', label: 'Valor de retorno', placeholder: 'Opcional', type: 'text', optional: true }],
    build: (v) => (v.valor || '').trim(),
    parse: parseSimples
  },
  Progress: {
    campos: [],
    build: () => ''
  },
  Ringing: {
    campos: [],
    build: () => ''
  },
  Exec: {
    campos: [
      { key: 'aplicacao', label: 'Aplicação', placeholder: 'Ex: Playback', type: 'text' },
      { key: 'parametros', label: 'Parâmetros', placeholder: 'Ex: demo-congrats', type: 'text', optional: true }
    ],
    build: (v) => {
      const app = (v.aplicacao || '').trim()
      const params = (v.parametros || '').trim()
      return params ? `${app},${params}` : app
    },
    parse: (p) => {
      const t = (p || '').trim()
      const comma = t.indexOf(',')
      if (comma < 0) return { aplicacao: t, parametros: '' }
      return { aplicacao: t.slice(0, comma).trim(), parametros: t.slice(comma + 1).trim() }
    }
  },
  ExecIf: {
    campos: [
      { key: 'expressao', label: 'Expressão', placeholder: 'Ex: condição?app:params', type: 'text' }
    ],
    build: (v) => (v.expressao || '').trim(),
    parse: parseSimples
  }
}

/** Para ações sem configuração, usar campo livre. */
export function getConfigParametros(acao: string): ConfigParametros | undefined {
  return PARAMETROS_POR_ACAO[acao]
}
