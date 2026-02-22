<template>
    <div class="perfis-view">
        <h1>Gerenciamento de Perfis</h1>

        <PerfilSearch v-model:search-query="perfilStore.searchQuery" @create="handleCreate" />

        <PerfilTable
            :filtered-perfis="perfilStore.filteredPerfis"
            :loading="perfilStore.loading"
            @edit_perfil="editPerfil"
            @delete_perfil="deletePerfil"
            @permissoes_perfil="openPermissoes"
        />

        <PerfilModal
            v-model:dialog-visible="dialogVisible"
            :form-data="formData"
            :is-edit="isEdit"
            :modal-title="modalTitle"
            :submitting="submitting"
            @submit="submitForm"
            @close="resetForm"
        />

        <PerfilPermissoesModal
            v-model:dialog-visible="permModalVisible"
            :perfil="perfilSelecionado"
            :submitting="permSubmitting"
            @save="savePermissoes"
            @close="perfilSelecionado = null"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { usePerfilStore } from '../stores/perfil.store'
import { MODULOS, type ListPerfilDto, type PermissaoDto } from '../services/perfil.service'
import PerfilSearch from '../components/PerfilSearch.vue'
import PerfilTable from '../components/PerfilTable.vue'
import PerfilModal from '../components/PerfilModal.vue'
import PerfilPermissoesModal from '../components/PerfilPermissoesModal.vue'

const perfilStore = usePerfilStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingPerfil = ref<ListPerfilDto | null>(null)
const submitting = ref(false)
const permModalVisible = ref(false)
const perfilSelecionado = ref<ListPerfilDto | null>(null)
const permSubmitting = ref(false)

const formData = reactive<{
  nome: string
  descricao: string
  permissoes: PermissaoDto[]
}>({
  nome: '',
  descricao: '',
  permissoes: []
})

const modalTitle = computed(() => (isEdit.value ? 'Editar perfil' : 'Criar perfil'))

onMounted(() => {
  perfilStore.fetchPerfis()
})

function defaultPermissoes(): PermissaoDto[] {
  return MODULOS.map(modulo => ({
    modulo,
    criar: false,
    ler: false,
    editar: false,
    deletar: false
  }))
}

const handleCreate = () => {
  isEdit.value = false
  editingPerfil.value = null
  resetForm()
  dialogVisible.value = true
}

const editPerfil = (perfil: ListPerfilDto) => {
  isEdit.value = true
  editingPerfil.value = perfil
  formData.nome = perfil.nome
  formData.descricao = perfil.descricao ?? ''
  dialogVisible.value = true
}

const deletePerfil = async (perfil: ListPerfilDto) => {
  try {
    await ElMessageBox.confirm(
      `Tem certeza que deseja excluir o perfil ${perfil.nome}?`,
      'Confirmação',
      {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )
    await perfilStore.deletePerfil(perfil.id)
  } catch {
    // Cancelled or error
  }
}

const openPermissoes = (perfil: ListPerfilDto) => {
  perfilSelecionado.value = perfil
  permModalVisible.value = true
}

const resetForm = () => {
  formData.nome = ''
  formData.descricao = ''
  formData.permissoes = defaultPermissoes()
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEdit.value && editingPerfil.value) {
      await perfilStore.updatePerfil(editingPerfil.value.id, {
        nome: formData.nome,
        descricao: formData.descricao
      })
    } else {
      await perfilStore.createPerfil({
        nome: formData.nome,
        descricao: formData.descricao || undefined,
        permissoes: formData.permissoes
      })
    }
    dialogVisible.value = false
    resetForm()
  } catch {
    // Error handled in store/service
  } finally {
    submitting.value = false
  }
}

const savePermissoes = async (permissoes: PermissaoDto[]) => {
  if (!perfilSelecionado.value) return
  permSubmitting.value = true
  try {
    await perfilStore.togglePermissao({
      perfil_id: perfilSelecionado.value.id,
      permissoes
    })
    permModalVisible.value = false
    perfilSelecionado.value = null
  } catch {
    // Error handled in store/service
  } finally {
    permSubmitting.value = false
  }
}
</script>

<style scoped>
.perfis-view {
  padding: 20px;
}
</style>
