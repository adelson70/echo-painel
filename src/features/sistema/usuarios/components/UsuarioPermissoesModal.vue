<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="`Permissões${usuario ? `: ${usuario.nome}` : ''}`"
        width="640px"
        @close="$emit('close')"
    >
        <div v-if="loadingPermissoes" class="loading-wrap">
            <el-icon class="is-loading"><Loading /></el-icon>
            Carregando permissões...
        </div>
        <template v-else>
            <el-table
                :data="permissoesLocais"
                size="small"
                max-height="400"
                class="permissoes-table"
                style="width: 100%"
            >
                <el-table-column prop="modulo" label="Módulo" min-width="140">
                    <template #header>
                        <el-checkbox
                            :model-value="allChecked"
                            :indeterminate="indeterminateTodos"
                            @update:model-value="setAll"
                        />
                        <span class="header-label">Todos</span>
                    </template>
                    <template #default="scope">
                        {{ moduloLabel(scope.row.modulo) }}
                    </template>
                </el-table-column>
                <el-table-column label="Criar" width="80" align="center">
                    <template #header>
                        <el-checkbox
                            :model-value="allCriar"
                            :indeterminate="indeterminateCriar"
                            @update:model-value="(v: boolean) => setAllCol('criar', v)"
                        />
                        <span class="header-label">Criar</span>
                    </template>
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.criar" />
                    </template>
                </el-table-column>
                <el-table-column label="Ler" width="80" align="center">
                    <template #header>
                        <el-checkbox
                            :model-value="allLer"
                            :indeterminate="indeterminateLer"
                            @update:model-value="(v: boolean) => setAllCol('ler', v)"
                        />
                        <span class="header-label">Ler</span>
                    </template>
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.ler" />
                    </template>
                </el-table-column>
                <el-table-column label="Editar" width="80" align="center">
                    <template #header>
                        <el-checkbox
                            :model-value="allEditar"
                            :indeterminate="indeterminateEditar"
                            @update:model-value="(v: boolean) => setAllCol('editar', v)"
                        />
                        <span class="header-label">Editar</span>
                    </template>
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.editar" />
                    </template>
                </el-table-column>
                <el-table-column label="Deletar" width="80" align="center">
                    <template #header>
                        <el-checkbox
                            :model-value="allDeletar"
                            :indeterminate="indeterminateDeletar"
                            @update:model-value="(v: boolean) => setAllCol('deletar', v)"
                        />
                        <span class="header-label">Deletar</span>
                    </template>
                    <template #default="scope">
                        <el-checkbox v-model="scope.row.deletar" />
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <template #footer>
            <el-button @click="$emit('update:dialogVisible', false)">Cancelar</el-button>
            <el-button type="primary" :loading="submitting" :disabled="!usuario" @click="handleSave">
                Salvar
            </el-button>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { Loading } from '@element-plus/icons-vue'
import { MODULOS, type Modulos, type PermissaoDto } from '@/features/sistema/perfis/services/perfil.service'
import type { ListUsuarioDto } from '../services/usuario.service'
import { FindUsuario } from '../services/usuario.service'

const MODULO_LABELS: Record<Modulos, string> = {
  RAMAL: 'Ramal',
  REGRA: 'Regra',
  TRONCO: 'Tronco',
  FILA: 'Fila',
  GRUPO_DE_CAPTURA: 'Grupo de Captura',
  USUARIO: 'Usuário',
  RELATORIO: 'Relatório',
  SISTEMA: 'Sistema',
  AUTH: 'Auth',
  LOG: 'Log',
  PERFIL: 'Perfil'
}

function moduloLabel(modulo: Modulos): string {
  return MODULO_LABELS[modulo] ?? modulo
}

function defaultPermissoes(): PermissaoDto[] {
  return MODULOS.map(modulo => ({
    modulo,
    criar: false,
    ler: false,
    editar: false,
    deletar: false
  }))
}

interface PermissaoUsuarioItem {
  modulo: string
  criar: boolean
  ler: boolean
  editar: boolean
  deletar: boolean
}

function mergePermissoes(existing: PermissaoUsuarioItem[]): PermissaoDto[] {
  const byModulo = new Map(existing.map(p => [p.modulo, { ...p }]))
  return MODULOS.map(modulo => {
    const cur = byModulo.get(modulo)
    return cur
      ? { modulo, criar: cur.criar, ler: cur.ler, editar: cur.editar, deletar: cur.deletar }
      : { modulo, criar: false, ler: false, editar: false, deletar: false }
  })
}

const props = defineProps<{
    dialogVisible: boolean
    usuario: ListUsuarioDto | null
    submitting: boolean
}>()

const emit = defineEmits<{
    'update:dialogVisible': [value: boolean]
    save: [permissoes: PermissaoDto[]]
    close: []
}>()

const permissoesLocais = ref<PermissaoDto[]>(defaultPermissoes())
const loadingPermissoes = ref(false)

const allChecked = computed(
  () =>
    permissoesLocais.value.length > 0 &&
    permissoesLocais.value.every(p => p.criar && p.ler && p.editar && p.deletar)
)
const indeterminateTodos = computed(() => {
  const list = permissoesLocais.value
  if (list.length === 0) return false
  const some = list.some(p => p.criar || p.ler || p.editar || p.deletar)
  return some && !allChecked.value
})

const allCriar = computed(() => permissoesLocais.value.length > 0 && permissoesLocais.value.every(p => p.criar))
const indeterminateCriar = computed(() => {
  const list = permissoesLocais.value
  const n = list.filter(p => p.criar).length
  return n > 0 && n < list.length
})
const allLer = computed(() => permissoesLocais.value.length > 0 && permissoesLocais.value.every(p => p.ler))
const indeterminateLer = computed(() => {
  const list = permissoesLocais.value
  const n = list.filter(p => p.ler).length
  return n > 0 && n < list.length
})
const allEditar = computed(() => permissoesLocais.value.length > 0 && permissoesLocais.value.every(p => p.editar))
const indeterminateEditar = computed(() => {
  const list = permissoesLocais.value
  const n = list.filter(p => p.editar).length
  return n > 0 && n < list.length
})
const allDeletar = computed(() => permissoesLocais.value.length > 0 && permissoesLocais.value.every(p => p.deletar))
const indeterminateDeletar = computed(() => {
  const list = permissoesLocais.value
  const n = list.filter(p => p.deletar).length
  return n > 0 && n < list.length
})

function setAll(value: boolean) {
  permissoesLocais.value.forEach(p => {
    p.criar = value
    p.ler = value
    p.editar = value
    p.deletar = value
  })
}

function setAllCol(
  col: 'criar' | 'ler' | 'editar' | 'deletar',
  value: boolean
) {
  permissoesLocais.value.forEach(p => {
    p[col] = value
  })
}

watch(
  () => [props.dialogVisible, props.usuario?.id] as const,
  async ([dialogVisible, id]) => {
    if (!dialogVisible || !id) {
      permissoesLocais.value = defaultPermissoes()
      return
    }
    loadingPermissoes.value = true
    try {
      const full = await FindUsuario(id)
      permissoesLocais.value = mergePermissoes(full.permissoesUsuario ?? [])
    } catch {
      permissoesLocais.value = defaultPermissoes()
    } finally {
      loadingPermissoes.value = false
    }
  },
  { immediate: true }
)

const handleSave = () => {
  if (!props.usuario) return
  emit('save', [...permissoesLocais.value])
}
</script>

<style scoped>
.loading-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 24px;
}

.permissoes-table {
  width: 100%;
}

.header-label {
  margin-left: 6px;
  vertical-align: middle;
}
</style>
