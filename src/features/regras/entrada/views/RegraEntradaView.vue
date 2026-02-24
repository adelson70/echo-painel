<template>
  <div class="regra-entrada-view">
    <h1>Regras de Entrada</h1>

    <RegraEntradaSearch
      v-model:search-query="regraEntradaStore.searchQuery"
      @create="handleCreate"
    />

    <RegraEntradaTable
      :filtered-regras="regraEntradaStore.filteredRegras"
      :loading="regraEntradaStore.loading"
      @edit_regra="editRegra"
      @delete_regra="deleteRegra"
    />

    <RegraEntradaModal
      v-model:dialog-visible="dialogVisible"
      :form-data="formData"
      :is-edit="isEdit"
      :modal-title="modalTitle"
      :submitting="submitting"
      :editing-regra-id="editingRegra?.id ?? null"
      @submit="submitForm"
      @close="resetForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRegraEntradaStore } from '../stores/regra-entrada.store'
import { FindRegraEntrada } from '../services/regra-entrada.service'
import type { ListRegraEntradaDto, RegraEntradaFormData } from '../services/regra-entrada.service'
import RegraEntradaSearch from '../components/RegraEntradaSearch.vue'
import RegraEntradaTable from '../components/RegraEntradaTable.vue'
import RegraEntradaModal from '../components/RegraEntradaModal.vue'

const regraEntradaStore = useRegraEntradaStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingRegra = ref<ListRegraEntradaDto | null>(null)
const submitting = ref(false)

const formData = reactive<RegraEntradaFormData>({
  nome: '',
  descricao: '',
  numero: '',
  tipoDestino: '',
  destinoValor: ''
})

const modalTitle = computed(() =>
  isEdit.value ? 'Editar regra de entrada' : 'Criar regra de entrada'
)

onMounted(() => {
  regraEntradaStore.fetchList()
})

function inferFormFromRegra(regra: ListRegraEntradaDto) {
  const first = regra.regra?.[0]
  if (!first) return
  const acao = (first.acao || '').toString()
  const params = (first.parametros || '').trim()
  if (acao === 'Queue') {
    formData.tipoDestino = 'fila'
    formData.destinoValor = params
    return
  }
  if (acao === 'Dial') {
    const m = params.match(/PJSIP[/](.+)/)
    if (m) {
      formData.tipoDestino = 'ramal'
      formData.destinoValor = m[1] ?? ''
    }
    return
  }
  if (acao === 'Goto') {
    formData.tipoDestino = 'ura'
    formData.destinoValor = ''
  }
}

const handleCreate = () => {
  isEdit.value = false
  editingRegra.value = null
  resetForm()
  dialogVisible.value = true
}

const editRegra = (regra: ListRegraEntradaDto) => {
  isEdit.value = true
  editingRegra.value = regra
  formData.nome = regra.nome
  formData.descricao = regra.descricao ?? ''
  formData.numero = regra.regra?.[0]?.rota ?? ''
  formData.tipoDestino = ''
  formData.destinoValor = ''
  inferFormFromRegra(regra)
  dialogVisible.value = true
}

const deleteRegra = async (regra: ListRegraEntradaDto) => {
  try {
    await ElMessageBox.confirm(
      `Tem certeza que deseja excluir a regra "${regra.nome}"?`,
      'Confirmação',
      {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )
    await regraEntradaStore.remove(regra.id)
  } catch {
    // cancelled or error
  }
}

function resetForm() {
  formData.nome = ''
  formData.descricao = ''
  formData.numero = ''
  formData.tipoDestino = ''
  formData.destinoValor = ''
  editingRegra.value = null
}

async function buildRegraSteps(): Promise<{ rota: string; prioridade: number; acao: string; parametros: string }[]> {
  const tipo = formData.tipoDestino
  const valor = formData.destinoValor
  const rota = (formData.numero ?? '').trim() || 's'
  const prioridade = 1

  if (tipo === 'ura') {
    if (!valor) return [{ rota, prioridade, acao: 'Goto', parametros: 'entrada,s,1' }]
    try {
      const regraUra = await FindRegraEntrada(valor)
      const first = regraUra.regra?.[0]
      const ext = first?.rota ?? 's'
      const pri = first?.prioridade ?? 1
      return [{ rota, prioridade, acao: 'Goto', parametros: `entrada,${ext},${pri}` }]
    } catch {
      return [{ rota, prioridade, acao: 'Goto', parametros: 'entrada,s,1' }]
    }
  }

  if (tipo === 'fila') {
    return [{ rota, prioridade, acao: 'Queue', parametros: valor || '' }]
  }

  if (tipo === 'ramal') {
    return [{ rota, prioridade, acao: 'Dial', parametros: `PJSIP/${valor}` }]
  }

  return [{ rota, prioridade, acao: 'Goto', parametros: 'entrada,s,1' }]
}

const submitForm = async () => {
  submitting.value = true
  try {
    const regra = await buildRegraSteps()
    const payload = {
      nome: formData.nome,
      descricao: formData.descricao || undefined,
      tipo: 'entrada' as const,
      regra
    }

    if (isEdit.value && editingRegra.value) {
      await regraEntradaStore.update(editingRegra.value.id, payload)
    } else {
      await regraEntradaStore.create(payload)
    }
    dialogVisible.value = false
    resetForm()
  } catch {
    // error handled in store/service
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.regra-entrada-view {
  padding: 20px;
}
</style>
