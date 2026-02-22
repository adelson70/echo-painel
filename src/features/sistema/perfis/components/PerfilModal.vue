<template>
    <el-dialog
        :model-value="dialogVisible"
        @update:model-value="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="640px"
        @close="$emit('close')"
    >
        <el-form ref="formRef" :model="formData" label-position="top">
            <el-form-item label="Nome" prop="nome" :rules="[{ required: true, message: 'Nome é obrigatório' }]">
                <el-input v-model="formData.nome" placeholder="Nome do perfil" />
            </el-form-item>
            <el-form-item label="Descrição" prop="descricao">
                <el-input
                    v-model="formData.descricao"
                    type="textarea"
                    :rows="2"
                    placeholder="Descrição (opcional)"
                />
            </el-form-item>

            <template v-if="!isEdit">
                <el-divider content-position="left">Permissões</el-divider>
                <el-table
                    :data="formData.permissoes"
                    size="small"
                    max-height="320"
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
        </el-form>
        <template #footer>
            <el-button @click="$emit('update:dialogVisible', false)">Cancelar</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
                {{ isEdit ? 'Atualizar' : 'Criar' }}
            </el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MODULOS, type Modulos, type PermissaoDto } from '../services/perfil.service'

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

const props = defineProps<{
    dialogVisible: boolean
    formData: { nome: string; descricao: string; permissoes: PermissaoDto[] }
    isEdit: boolean
    modalTitle: string
    submitting: boolean
}>()

const permissoes = computed(() => props.formData.permissoes)

const allChecked = computed(
  () =>
    permissoes.value.length > 0 &&
    permissoes.value.every(p => p.criar && p.ler && p.editar && p.deletar)
)
const indeterminateTodos = computed(() => {
  const list = permissoes.value
  if (list.length === 0) return false
  const some = list.some(p => p.criar || p.ler || p.editar || p.deletar)
  return some && !allChecked.value
})

const allCriar = computed(() => permissoes.value.length > 0 && permissoes.value.every(p => p.criar))
const indeterminateCriar = computed(() => {
  const list = permissoes.value
  const n = list.filter(p => p.criar).length
  return n > 0 && n < list.length
})
const allLer = computed(() => permissoes.value.length > 0 && permissoes.value.every(p => p.ler))
const indeterminateLer = computed(() => {
  const list = permissoes.value
  const n = list.filter(p => p.ler).length
  return n > 0 && n < list.length
})
const allEditar = computed(() => permissoes.value.length > 0 && permissoes.value.every(p => p.editar))
const indeterminateEditar = computed(() => {
  const list = permissoes.value
  const n = list.filter(p => p.editar).length
  return n > 0 && n < list.length
})
const allDeletar = computed(() => permissoes.value.length > 0 && permissoes.value.every(p => p.deletar))
const indeterminateDeletar = computed(() => {
  const list = permissoes.value
  const n = list.filter(p => p.deletar).length
  return n > 0 && n < list.length
})

function setAll(value: boolean) {
  props.formData.permissoes.forEach(p => {
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
  props.formData.permissoes.forEach(p => {
    p[col] = value
  })
}

const emit = defineEmits<{
    'update:dialogVisible': [value: boolean]
    submit: []
    close: []
}>()

const formRef = ref()

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  emit('submit')
}
</script>

<style scoped>
.permissoes-table {
  width: 100%;
}

.header-label {
  margin-left: 6px;
  vertical-align: middle;
}
</style>
