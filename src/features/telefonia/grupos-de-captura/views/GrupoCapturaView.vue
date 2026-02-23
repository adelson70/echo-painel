<template>
    <div class="grupos-captura-view">
        <h1>Gerenciamento de Grupos de Captura</h1>

        <GrupoCapturaSearch v-model:search-query="grupoStore.searchQuery" @create="handleCreate" />

        <GrupoCapturaTable
            :filtered-grupos="grupoStore.filteredGrupos"
            :loading="grupoStore.loading"
            @membros_grupo="openMembros"
            @edit_grupo="editGrupo"
            @delete_grupo="deleteGrupo"
        />

        <GrupoCapturaModal
            v-model:dialog-visible="dialogVisible"
            :form-data="formData"
            :is-edit="isEdit"
            :modal-title="modalTitle"
            :submitting="submitting"
            @submit="submitForm"
            @close="resetForm"
        />

        <GrupoCapturaMembrosModal
            v-model:dialog-visible="membrosModalVisible"
            :grupo="grupoParaMembros"
            @close="grupoParaMembros = null"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useGrupoCapturaStore } from '../stores/grupo-captura.store'
import type { ListGrupoDeCapturaDto } from '../services/grupo-captura.service'
import GrupoCapturaSearch from '../components/GrupoCapturaSearch.vue'
import GrupoCapturaTable from '../components/GrupoCapturaTable.vue'
import GrupoCapturaModal from '../components/GrupoCapturaModal.vue'
import GrupoCapturaMembrosModal from '../components/GrupoCapturaMembrosModal.vue'

const grupoStore = useGrupoCapturaStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingGrupo = ref<ListGrupoDeCapturaDto | null>(null)
const submitting = ref(false)
const membrosModalVisible = ref(false)
const grupoParaMembros = ref<ListGrupoDeCapturaDto | null>(null)

const formData = reactive<{
    nome: string
    membros?: string[]
}>({
    nome: '',
    membros: []
})

const modalTitle = computed(() => (isEdit.value ? 'Editar grupo de captura' : 'Criar grupo de captura'))

onMounted(() => {
    grupoStore.fetchGrupos()
})

const handleCreate = () => {
    isEdit.value = false
    editingGrupo.value = null
    resetForm()
    dialogVisible.value = true
}

const editGrupo = (grupo: ListGrupoDeCapturaDto) => {
    isEdit.value = true
    editingGrupo.value = grupo
    formData.nome = grupo.nome
    formData.membros = []
    dialogVisible.value = true
}

const deleteGrupo = async (grupo: ListGrupoDeCapturaDto) => {
    try {
        await ElMessageBox.confirm(
            `Tem certeza que deseja excluir o grupo ${grupo.nome}?`,
            'Confirmação',
            {
                confirmButtonText: 'Excluir',
                cancelButtonText: 'Cancelar',
                type: 'warning'
            }
        )
        await grupoStore.deleteGrupo(grupo.id)
    } catch {
        // Cancelled or error
    }
}

const openMembros = (grupo: ListGrupoDeCapturaDto) => {
    grupoParaMembros.value = grupo
    membrosModalVisible.value = true
}

const resetForm = () => {
    formData.nome = ''
    formData.membros = []
}

const submitForm = async () => {
    submitting.value = true
    try {
        if (isEdit.value && editingGrupo.value) {
            await grupoStore.updateGrupo(editingGrupo.value.id, { nome: formData.nome })
        } else {
            await grupoStore.createGrupo({
                nome: formData.nome,
                membros: formData.membros?.length ? formData.membros : undefined
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
</script>

<style scoped>
.grupos-captura-view {
    padding: 20px;
}
</style>
