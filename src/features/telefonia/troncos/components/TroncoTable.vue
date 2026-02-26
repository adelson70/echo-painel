<template>
    <el-table
        :data="filteredTroncos"
        style="width: 100%"
        :loading="loading"
        empty-text="Nenhum tronco encontrado"
        :default-sort="{ prop: 'username', order: 'ascending' }"
    >
        <el-table-column prop="username" label="Nome" sortable />
        <el-table-column prop="provedorHost" label="Provedor" sortable show-overflow-tooltip />
        <el-table-column prop="password" label="Senha">
            <template #default="scope">
                <el-tooltip content="Clique para copiar" placement="right-end">
                    <span class="password-cell" @click="copyPassword(scope.row.password)">
                        <span class="password-hidden">{{ '•'.repeat(scope.row.password?.length ?? 0) }}</span>
                        <span class="password-visible">{{ scope.row.password }}</span>
                    </span>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column label="Ações" width="180" fixed="right">
            <template #default="scope">
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
import { Edit, Trash2 } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import type { TroncoDto } from '../services/tronco.service'

const props = defineProps<{
    filteredTroncos: TroncoDto[]
    loading: boolean
}>()

const emit = defineEmits<{
    edit_tronco: [tronco: TroncoDto]
    delete_tronco: [tronco: TroncoDto]
}>()

const handleEdit = (tronco: TroncoDto) => {
    emit('edit_tronco', tronco)
}

const handleDelete = (tronco: TroncoDto) => {
    emit('delete_tronco', tronco)
}

const copyPassword = async (password: string) => {
    try {
        await navigator.clipboard.writeText(password)
        ElMessage.success('Senha copiada!')
    } catch (err) {
        ElMessage.error('Erro ao copiar senha')
    }
}
</script>

<style scoped>
.password-cell {
    cursor: pointer;
    font-family: monospace;
}

.password-hidden {
    display: inline;
}

.password-visible {
    display: none;
}

.password-cell:hover .password-hidden {
    display: none;
}

.password-cell:hover .password-visible {
    display: inline;
}
</style>
