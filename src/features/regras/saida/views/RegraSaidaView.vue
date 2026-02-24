<template>
    <div class="regra-saida-view">
        <h1>Gerenciamento de Regras de Saída</h1>

        <RegraSaidaSearch v-model:search-query="regraStore.searchQuery" @create="handleCreate" />

        <RegraSaidaTable
            :filtered-regras="regraStore.filteredRegras"
            :loading="regraStore.loading"
            @edit_regra="editRegra"
            @delete_regra="deleteRegra"
            @gerenciar_etapas="abrirGerenciamentoEtapas"
        />

        <RegraSaidaModal
            v-model:dialog-visible="dialogVisible"
            :form-data="formData"
            :is-edit="isEdit"
            :modal-title="modalTitle"
            :submitting="submitting"
            @submit="submitForm"
            @close="resetForm"
            @gerenciar-etapas="abrirGerenciamentoEtapas"
        />

        <RegraSaidaEtapasModal
            v-model:dialog-visible="etapasModalVisible"
            :regra-id="regraParaEtapas?.id ?? ''"
            :regra-nome="regraParaEtapas?.nome"
            @close="regraParaEtapas = null"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRegraSaidaStore } from '../stores/regra-saida.store'
import type { ListRegraDto, RegraStep } from '../services/regra-saida.service'
import RegraSaidaSearch from '../components/RegraSaidaSearch.vue'
import RegraSaidaTable from '../components/RegraSaidaTable.vue'
import RegraSaidaModal from '../components/RegraSaidaModal.vue'
import RegraSaidaEtapasModal from '../components/RegraSaidaEtapasModal.vue'

const regraStore = useRegraSaidaStore()
const dialogVisible = ref(false)
const isEdit = ref(false)
const editingRegra = ref<ListRegraDto | null>(null)
const submitting = ref(false)
const etapasModalVisible = ref(false)
const regraParaEtapas = ref<ListRegraDto | null>(null)

const formData = reactive<{
    nome: string
    descricao: string
    regra: RegraStep[]
}>({
    nome: '',
    descricao: '',
    regra: []
})

const modalTitle = computed(() => (isEdit.value ? 'Editar regra de saída' : 'Criar regra de saída'))

onMounted(() => {
    regraStore.fetchRegras()
})

function mapStepsToForm(regra: RegraStep[]): RegraStep[] {
    return regra.map((s) => ({
        id: s.id,
        rota: s.rota ?? '',
        prioridade: s.prioridade ?? 1,
        acao: s.acao ?? '',
        parametros: s.parametros ?? ''
    }))
}

/** Ordem na lista = prioridade (1, 2, 3...). Não usa input de prioridade. */
function stepsForApi(regra: RegraStep[]): { rota: string; prioridade: number; acao: string; parametros: string }[] {
    return regra.map((s, index) => ({
        rota: (s.rota ?? '').trim(),
        prioridade: index + 1,
        acao: s.acao ?? '',
        parametros: (s.parametros ?? '').trim()
    }))
}

const handleCreate = () => {
    isEdit.value = false
    editingRegra.value = null
    resetForm()
    dialogVisible.value = true
}

const editRegra = async (regra: ListRegraDto) => {
    isEdit.value = true
    editingRegra.value = regra
    formData.nome = regra.nome ?? ''
    formData.descricao = regra.descricao ?? ''
    formData.regra = []
    dialogVisible.value = true
}

/** Abre o modal de etapas: a partir do botão na tabela (regra) ou do modal de edição (usa editingRegra). */
function abrirGerenciamentoEtapas(regra?: ListRegraDto) {
    const target = regra ?? editingRegra.value
    if (target) {
        regraParaEtapas.value = target
        dialogVisible.value = false
        etapasModalVisible.value = true
    }
}

const deleteRegra = async (regra: ListRegraDto) => {
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
        await regraStore.deleteRegra(regra.id)
    } catch {
        // Cancelled or error
    }
}

const resetForm = () => {
    formData.nome = ''
    formData.descricao = ''
    formData.regra = []
}

const submitForm = async () => {
    submitting.value = true
    try {
        if (isEdit.value && editingRegra.value) {
            await regraStore.updateRegra(editingRegra.value.id, {
                nome: formData.nome.trim(),
                descricao: formData.descricao?.trim() || undefined,
                tipo: 'saida'
            })
        } else {
            await regraStore.createRegra({
                nome: formData.nome.trim(),
                descricao: formData.descricao?.trim() || undefined,
                tipo: 'saida',
                regra: stepsForApi(formData.regra)
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
.regra-saida-view {
    padding: 20px;
}
</style>
