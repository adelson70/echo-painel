<template>
    <el-table
        :data="filteredGrupos"
        style="width: 100%"
        :loading="loading"
        empty-text="Nenhum grupo de captura encontrado"
        :default-sort="{ prop: 'nome', order: 'ascending' }"
    >
        <el-table-column prop="nome" label="Nome" sortable />
        <el-table-column label="Membros" width="120">
            <template #default="scope">
                {{ scope.row.membros?.length ?? 0 }} membros
            </template>
        </el-table-column>
        <el-table-column label="Ações" width="180" fixed="right">
            <template #default="scope">
                <el-tooltip content="Membros">
                    <el-button
                        size="medium"
                        :icon="Users"
                        circle
                        @click="handleMembros(scope.row)"
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
import { Edit, Trash2, Users } from 'lucide-vue-next'
import type { ListGrupoDeCapturaDto } from '../services/grupo-captura.service'

const props = defineProps<{
    filteredGrupos: ListGrupoDeCapturaDto[]
    loading: boolean
}>()

const emit = defineEmits<{
    membros_grupo: [grupo: ListGrupoDeCapturaDto]
    edit_grupo: [grupo: ListGrupoDeCapturaDto]
    delete_grupo: [grupo: ListGrupoDeCapturaDto]
}>()

const handleMembros = (grupo: ListGrupoDeCapturaDto) => {
    emit('membros_grupo', grupo)
}

const handleEdit = (grupo: ListGrupoDeCapturaDto) => {
    emit('edit_grupo', grupo)
}

const handleDelete = (grupo: ListGrupoDeCapturaDto) => {
    emit('delete_grupo', grupo)
}
</script>
