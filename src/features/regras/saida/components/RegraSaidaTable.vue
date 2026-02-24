<template>
    <el-table
        :data="filteredRegras"
        style="width: 100%"
        :loading="loading"
        empty-text="Nenhuma regra de saída encontrada"
        :default-sort="{ prop: 'nome', order: 'ascending' }"
    >
        <el-table-column prop="nome" label="Nome" sortable />
        <el-table-column prop="descricao" label="Descrição" min-width="180" show-overflow-tooltip />
        <el-table-column label="Etapas" width="100">
            <template #default="scope">
                {{ scope.row.regra?.length ?? 0 }} etapa(s)
            </template>
        </el-table-column>
        <el-table-column label="Ações" width="220" fixed="right">
            <template #default="scope">
                <el-tooltip content="Gerenciamento das regras">
                    <el-button
                        size="medium"
                        :icon="ListOrdered"
                        circle
                        @click="handleGerenciarEtapas(scope.row)"
                    />
                </el-tooltip>
                <el-tooltip content="Editar">
                    <el-button
                        size="medium"
                        type="primary"
                        :icon="Edit"
                        circle
                        @click="handleEdit(scope.row)"
                    />
                </el-tooltip>
                <el-tooltip content="Excluir">
                    <el-button
                        size="medium"
                        type="danger"
                        :icon="Trash2"
                        circle
                        @click="handleDelete(scope.row)"
                    />
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { Edit, Trash2, ListOrdered } from 'lucide-vue-next'
import type { ListRegraDto } from '../services/regra-saida.service'

const props = defineProps<{
    filteredRegras: ListRegraDto[]
    loading: boolean
}>()

const emit = defineEmits<{
    edit_regra: [regra: ListRegraDto]
    delete_regra: [regra: ListRegraDto]
    gerenciar_etapas: [regra: ListRegraDto]
}>()

const handleGerenciarEtapas = (regra: ListRegraDto) => {
    emit('gerenciar_etapas', regra)
}

const handleEdit = (regra: ListRegraDto) => {
    emit('edit_regra', regra)
}

const handleDelete = (regra: ListRegraDto) => {
    emit('delete_regra', regra)
}
</script>
