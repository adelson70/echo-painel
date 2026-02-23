<template>
    <div class="fila-view">
        <h1>Gerenciamento de Filas</h1>

        <FilaSearch v-model:search-query="filaStore.searchQuery" @create="handleCreate" />

        <FilaTable
            :filtered-filas="filaStore.filteredFilas"
            :loading="filaStore.loading"
            @edit_fila="editFila"
            @delete_fila="deleteFila"
            @membros_fila="openMembros"
        />

        <FilaModal
            v-model:dialog-visible="dialogVisible"
            :form-data="formData"
            :is-edit="isEdit"
            :modal-title="modalTitle"
            :submitting="submitting"
            @submit="submitForm"
            @close="resetForm"
        />

        <FilaMembrosModal
            v-model:dialog-visible="membrosModalVisible"
            :fila="filaParaMembros"
            @close="filaParaMembros = null"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useFilaStore } from '../stores/fila.store'
import FilaSearch from '../components/FilaSearch.vue'
import FilaTable from '../components/FilaTable.vue'
import FilaModal from '../components/FilaModal.vue'
import FilaMembrosModal from '../components/FilaMembrosModal.vue'
import type { ListFilaDto, CreateFilaDto, UpdateFilaDto } from '../services/fila.service'

const filaStore = useFilaStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingFila = ref<ListFilaDto | null>(null)
const submitting = ref(false)
const membrosModalVisible = ref(false)
const filaParaMembros = ref<ListFilaDto | null>(null)

const formData = reactive<{
  nomeIdentificador: string
  nome: string
  estrategia: CreateFilaDto['estrategia']
  tempoEspera?: number
  tentativas?: number
  musicaDeEspera?: CreateFilaDto['musicaDeEspera']
}>({
  nomeIdentificador: '',
  nome: '',
  estrategia: 'ringall',
  tempoEspera: undefined,
  tentativas: undefined,
  musicaDeEspera: undefined,
})

const modalTitle = computed(() => (isEdit.value ? 'Editar fila' : 'Criar fila'))

onMounted(() => {
  filaStore.fetchFilas()
})

const handleCreate = () => {
  isEdit.value = false
  editingFila.value = null
  resetForm()
  dialogVisible.value = true
}

const editFila = (fila: ListFilaDto) => {
  isEdit.value = true
  editingFila.value = fila
  formData.nomeIdentificador = fila.nomeIdentificador
  formData.nome = fila.nome
  formData.estrategia = fila.estrategia
  formData.tempoEspera = fila.tempoEspera
  formData.tentativas = fila.tentativas
  formData.musicaDeEspera = fila.musicaDeEspera
  dialogVisible.value = true
}

const deleteFila = async (fila: ListFilaDto) => {
  try {
    await ElMessageBox.confirm(
      `Tem certeza que deseja excluir a fila ${fila.nome}?`,
      'Confirmação',
      {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning',
      }
    )
    await filaStore.deleteFila(fila.id)
  } catch {
    // Cancelled or error
  }
}

const openMembros = (fila: ListFilaDto) => {
  filaParaMembros.value = fila
  membrosModalVisible.value = true
}

const resetForm = () => {
  formData.nomeIdentificador = ''
  formData.nome = ''
  formData.estrategia = 'ringall'
  formData.tempoEspera = undefined
  formData.tentativas = undefined
  formData.musicaDeEspera = undefined
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEdit.value && editingFila.value) {
      const updateData: UpdateFilaDto = {
        nome: formData.nome,
        estrategia: formData.estrategia,
        tempoEspera: formData.tempoEspera,
        tentativas: formData.tentativas,
        musicaDeEspera: formData.musicaDeEspera,
      }
      await filaStore.updateFila(editingFila.value.id, updateData)
    } else {
      const createData: CreateFilaDto = {
        nomeIdentificador: formData.nomeIdentificador,
        nome: formData.nome,
        estrategia: formData.estrategia,
        tempoEspera: formData.tempoEspera,
        tentativas: formData.tentativas,
        musicaDeEspera: formData.musicaDeEspera,
      }
      await filaStore.createFila(createData)
    }
    dialogVisible.value = false
    resetForm()
  } catch {
    // Error handled in store/service
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.fila-view {
  padding: 20px;
}
</style>
