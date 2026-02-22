<template>
    <div class="ramal-view">
        <h1>Gerenciamento de Ramais</h1>

        <RamalSearch v-model:search-query="ramalStore.searchQuery" @create="handleCreate" />

        <RamalTable :filtered-ramais="ramalStore.filteredRamais" :loading="ramalStore.loading"
            @edit_ramal="editRamal" @delete_ramal="deleteRamal" />

        <RamalModal v-model:dialog-visible="dialogVisible" :form-data="formData" :is-batch="isBatch"
            :is-edit="isEdit" :modal-title="modalTitle" :submitting="submitting"
            @submit="submitForm" @close="resetForm" />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRamalStore } from '../stores/ramal.store'
import RamalSearch from '../components/RamalSearch.vue'
import RamalTable from '../components/RamalTable.vue'
import RamalModal from '../components/RamalModal.vue'
import type { RamalDto, CreateRamalDto, CreateLoteRamalDto, UpdateRamalDto } from '../services/ramal.service'

const ramalStore = useRamalStore()
const dialogVisible = ref(false)
const isBatch = ref(false)
const isEdit = ref(false)
const editingRamal = ref<RamalDto | null>(null)
const submitting = ref(false)

const formData = reactive({
    ramal: '',
    nome: '',
    senha: '',
    regraSaida: '',
    maximoContatos: 1,
    dod: '',
    quantidadeRamais: 1,
    ramalInicial: ''
})

const modalTitle = computed(() => {
    if (isEdit.value) return 'Editar Ramal'
    if (isBatch.value) return 'Criar Lote de Ramais'
    return 'Criar Ramal'
})

onMounted(() => {
    ramalStore.fetchRamais()
})

const handleCreate = (type: string) => {
    isBatch.value = type === 'batch'
    isEdit.value = false
    editingRamal.value = null
    resetForm()
    dialogVisible.value = true
}

const editRamal = (ramal: RamalDto) => {
    isEdit.value = true
    isBatch.value = false
    editingRamal.value = ramal
    formData.ramal = ramal.ramal
    formData.nome = ramal.nome
    formData.senha = ramal.senha
    formData.regraSaida = ramal.regraSaida!.id
    formData.maximoContatos = ramal.maximoContatos
    formData.dod = ramal.dod || ''
    dialogVisible.value = true
}

const deleteRamal = async (ramal: RamalDto) => {
    try {
        await ElMessageBox.confirm(`Tem certeza que deseja excluir o ramal ${ramal.ramal}?`, 'Confirmação', {
            confirmButtonText: 'Excluir',
            cancelButtonText: 'Cancelar',
            type: 'warning'
        })
        await ramalStore.deleteRamal(ramal.ramal)
    } catch (error) {
        // Cancelled or error
    }
}

const resetForm = () => {
    formData.ramal = ''
    formData.nome = ''
    formData.senha = ''
    formData.regraSaida = ''
    formData.maximoContatos = 1
    formData.dod = ''
    formData.quantidadeRamais = 1
    formData.ramalInicial = ''
}

const submitForm = async () => {
    submitting.value = true

    try {
        if (isBatch.value) {
            const updateData = {
                quantidadeRamais: formData.quantidadeRamais,
                ramalInicial: formData.ramalInicial,
                regraSaida: formData.regraSaida,
                maximoContatos: formData.maximoContatos,
                dod: formData.dod
            }
            await ramalStore.createLoteRamal(updateData as CreateLoteRamalDto)
        } else if (isEdit.value) {
            const updateData = {
                nome: formData.nome,
                senha: formData.senha,
                regraSaida: formData.regraSaida,
                maximoContatos: formData.maximoContatos,
                dod: formData.dod
            }
            await ramalStore.updateRamal(editingRamal.value!.ramal, updateData as UpdateRamalDto)
        } else {
            const updateData = {
                ramal: formData.ramal,
                nome: formData.nome,
                senha: formData.senha,
                regraSaida: formData.regraSaida,
                maximoContatos: formData.maximoContatos,
                dod: formData.dod
            }
            await ramalStore.createRamal(updateData as CreateRamalDto)
        }

        dialogVisible.value = false
        resetForm()
    } catch (error) {
        // Error handled in store
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.ramal-view {
    padding: 20px;
}
</style>