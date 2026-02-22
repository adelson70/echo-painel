<template>
    <div class="usuarios-view">
        <h1>Gerenciamento de Usuários</h1>

        <UsuarioSearch v-model:search-query="usuarioStore.searchQuery" @create="handleCreate" />

        <UsuarioTable
            :filtered-usuarios="usuarioStore.filteredUsuarios"
            :loading="usuarioStore.loading"
            :perfis="perfilStore.perfis"
            @edit_usuario="editUsuario"
            @delete_usuario="deleteUsuario"
            @permissoes_usuario="openPermissoes"
        />

        <UsuarioModal
            v-model:dialog-visible="dialogVisible"
            :form-data="formData"
            :is-edit="isEdit"
            :modal-title="modalTitle"
            :submitting="submitting"
            :perfis="perfilStore.perfis"
            @submit="submitForm"
            @close="resetForm"
        />

        <UsuarioPermissoesModal
            v-model:dialog-visible="permModalVisible"
            :usuario="usuarioSelecionado"
            :submitting="permSubmitting"
            @save="savePermissoes"
            @close="usuarioSelecionado = null"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useUsuarioStore } from '../stores/usuario.store'
import { usePerfilStore } from '@/features/sistema/perfis/stores/perfil.store'
import type { ListUsuarioDto } from '../services/usuario.service'
import type { PermissaoDto } from '@/features/sistema/perfis/services/perfil.service'
import UsuarioSearch from '../components/UsuarioSearch.vue'
import UsuarioTable from '../components/UsuarioTable.vue'
import UsuarioModal from '../components/UsuarioModal.vue'
import UsuarioPermissoesModal from '../components/UsuarioPermissoesModal.vue'

const usuarioStore = useUsuarioStore()
const perfilStore = usePerfilStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingUsuario = ref<ListUsuarioDto | null>(null)
const submitting = ref(false)
const permModalVisible = ref(false)
const usuarioSelecionado = ref<ListUsuarioDto | null>(null)
const permSubmitting = ref(false)

const formData = reactive<{
  nome: string
  email: string
  senha: string
  is_admin: boolean
  perfil_id: string | null
}>({
  nome: '',
  email: '',
  senha: '',
  is_admin: false,
  perfil_id: ''
})

const modalTitle = computed(() => (isEdit.value ? 'Editar usuário' : 'Criar usuário'))

onMounted(() => {
  usuarioStore.fetchUsuarios()
  perfilStore.fetchPerfis()
})

const handleCreate = () => {
  isEdit.value = false
  editingUsuario.value = null
  resetForm()
  dialogVisible.value = true
}

const editUsuario = (usuario: ListUsuarioDto) => {
  isEdit.value = true
  editingUsuario.value = usuario
  formData.nome = usuario.nome
  formData.email = usuario.email
  formData.senha = ''
  formData.is_admin = usuario.is_admin
  formData.perfil_id = usuario.perfil_id ?? ''
  dialogVisible.value = true
}

const deleteUsuario = async (usuario: ListUsuarioDto) => {
  try {
    await ElMessageBox.confirm(
      `Tem certeza que deseja excluir o usuário ${usuario.nome}?`,
      'Confirmação',
      {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    )
    await usuarioStore.deleteUsuario(usuario.id)
  } catch {
    // Cancelled or error
  }
}

const openPermissoes = (usuario: ListUsuarioDto) => {
  usuarioSelecionado.value = usuario
  permModalVisible.value = true
}

const resetForm = () => {
  formData.nome = ''
  formData.email = ''
  formData.senha = ''
  formData.is_admin = false
  formData.perfil_id = ''
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEdit.value && editingUsuario.value) {
      const payload: { nome: string; email: string; is_admin: boolean; perfil_id?: string; senha?: string } = {
        nome: formData.nome,
        email: formData.email,
        is_admin: formData.is_admin,
        perfil_id: (formData.perfil_id ?? '') || undefined
      }
      if (formData.senha.trim()) payload.senha = formData.senha
      await usuarioStore.updateUsuario(editingUsuario.value.id, payload)
    } else {
      await usuarioStore.createUsuario({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        is_admin: formData.is_admin,
        perfil_id: (formData.perfil_id ?? '') || undefined
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
  if (!usuarioSelecionado.value) return
  permSubmitting.value = true
  try {
    await usuarioStore.togglePermissao({
      usuario_id: usuarioSelecionado.value.id,
      permissoes
    })
    permModalVisible.value = false
    usuarioSelecionado.value = null
  } catch {
    // Error handled in store/service
  } finally {
    permSubmitting.value = false
  }
}
</script>

<style scoped>
.usuarios-view {
  padding: 20px;
}
</style>
