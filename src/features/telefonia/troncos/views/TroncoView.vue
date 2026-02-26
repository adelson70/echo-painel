<template>
    <div class="tronco-view">
        <h1>Gerenciamento de Troncos</h1>

        <TroncoSearch v-model:search-query="troncoStore.searchQuery" @create="handleCreate" />

        <TroncoTable
            :filtered-troncos="troncoStore.filteredTroncos"
            :loading="troncoStore.loading"
            @edit_tronco="editTronco"
            @delete_tronco="deleteTronco"
        />

        <TroncoModal
            v-model:dialog-visible="dialogVisible"
            :form-data="formData"
            :is-edit="isEdit"
            :modal-title="modalTitle"
            :submitting="submitting"
            @submit="submitForm"
            @close="resetForm"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useTroncoStore } from '../stores/tronco.store'
import TroncoSearch from '../components/TroncoSearch.vue'
import TroncoTable from '../components/TroncoTable.vue'
import TroncoModal from '../components/TroncoModal.vue'
import type { TroncoDto, CreateTroncoDto, UpdateTroncoDto } from '../services/tronco.service'

const troncoStore = useTroncoStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingTronco = ref<TroncoDto | null>(null)
const submitting = ref(false)

const formData = reactive({
    username: '',
    password: '',
    provedorHost: ''
})

const modalTitle = computed(() => (isEdit.value ? 'Editar tronco' : 'Criar tronco'))

onMounted(() => {
    troncoStore.fetchTroncos()
})

const handleCreate = () => {
    isEdit.value = false
    editingTronco.value = null
    resetForm()
    dialogVisible.value = true
}

const editTronco = (tronco: TroncoDto) => {
    isEdit.value = true
    editingTronco.value = tronco
    formData.username = tronco.username
    formData.password = tronco.password
    formData.provedorHost = tronco.provedorHost
    dialogVisible.value = true
}

const deleteTronco = async (tronco: TroncoDto) => {
    try {
        await ElMessageBox.confirm(
            `Tem certeza que deseja excluir o tronco ${tronco.username}?`,
            'Confirmação',
            {
                confirmButtonText: 'Excluir',
                cancelButtonText: 'Cancelar',
                type: 'warning'
            }
        )
        await troncoStore.deleteTronco(tronco.username)
    } catch {
        // Cancelled or error
    }
}

const resetForm = () => {
    formData.username = ''
    formData.password = ''
    formData.provedorHost = ''
}

const submitForm = async () => {
    submitting.value = true
    try {
        if (isEdit.value && editingTronco.value) {
            const updateData: UpdateTroncoDto = {
                username: formData.username,
                provedorHost: formData.provedorHost
            }
            if (formData.password.trim() !== '') {
                updateData.password = formData.password
            }
            await troncoStore.updateTronco(editingTronco.value.username, updateData)
        } else {
            await troncoStore.createTronco({
                username: formData.username,
                password: formData.password,
                provedorHost: formData.provedorHost
            } as CreateTroncoDto)
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
.tronco-view {
    padding: 20px;
}
</style>
