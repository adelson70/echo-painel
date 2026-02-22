<template>
    <el-table :data="filteredRamais" style="width: 100%" :loading="loading"
        empty-text="Nenhum ramal encontrado" :default-sort="{ prop: 'ramal', order: 'ascending' }">
        <el-table-column prop="status" label="Status" width="120">
            <template #default="scope">
                <span class="status-dot" :class="getStatusClass(scope.row.status)"></span>
                {{ getStatusText(scope.row.status) }}
            </template>
        </el-table-column>
        <el-table-column prop="nome" label="Nome" :sortable="true" />
        <el-table-column prop="ramal" label="Ramal" :sortable="true" />
        <el-table-column prop="senha" label="Senha">
            <template #default="scope">
                <el-tooltip content="Clique para copiar" placement="right-end">
                    <span class="password-cell" @click="copyPassword(scope.row.senha)">
                        <span class="password-hidden">{{ '•'.repeat(scope.row.senha.length)
                        }}</span>
                        <span class="password-visible">{{ scope.row.senha }}</span>
                    </span>
                </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column prop="regraSaida" label="Regra Saída">
            <template #default="scope">
                {{ scope.row.regraSaida?.nome ?? scope.row.regraSaida }}
            </template>
        </el-table-column>
        <el-table-column prop="maximoContatos" label="Máximo Contatos" />
        <el-table-column prop="dod" label="DOD" />
        <el-table-column label="Ações">
            <template #default="scope">
                <el-tooltip content="Editar">
                    <el-button size="medium" @click="handleEdit(scope.row)" type="primary"
                        :icon="Edit" circle />
                </el-tooltip>
                <el-tooltip content="Excluir">
                    <el-button size="medium" type="danger" @click="handleDelete(scope.row)"
                        :icon="Trash2" circle />
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'
import type { RamalDto } from '../services/ramal.service'

const props = defineProps<{
    filteredRamais: RamalDto[]
    loading: boolean
}>()

const emit = defineEmits<{
    edit_ramal: [ramal: RamalDto]
    delete_ramal: [ramal: RamalDto]
}>()

const getStatusClass = (status: string) => {
    switch (status) {
        case 'ativo': return 'status-green'
        case 'em uso':
        case 'chamando': return 'status-yellow'
        case 'tocando': return 'status-blue'
        case 'offline': return 'status-red'
        default: return ''
    }
}

const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
}

const handleEdit = (ramal: RamalDto) => {
    emit('edit_ramal', ramal)
}

const handleDelete = (ramal: RamalDto) => {
    emit('delete_ramal', ramal)
}

const copyPassword = async (senha: string) => {
    try {
        await navigator.clipboard.writeText(senha)
        ElMessage.success('Senha copiada!')
    } catch (err) {
        ElMessage.error('Erro ao copiar senha')
    }
}
</script>

<style scoped>
.status-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
}

.status-green {
    background-color: green;
}

.status-yellow {
    background-color: yellow;
}

.status-blue {
    background-color: blue;
}

.status-red {
    background-color: red;
}

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