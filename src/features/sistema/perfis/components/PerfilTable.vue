<template>
    <el-table
        :data="filteredPerfis"
        style="width: 100%"
        :loading="loading"
        empty-text="Nenhum perfil encontrado"
        :default-sort="{ prop: 'nome', order: 'ascending' }"
    >
        <el-table-column prop="nome" label="Nome" sortable />
        <el-table-column prop="descricao" label="Descrição" show-overflow-tooltip />
        <el-table-column prop="quantidadeUsuarios" label="Quantidade de usuários" width="200" />
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
                <el-tooltip content="Permissões">
                    <el-button
                        size="medium"
                        :icon="ShieldCheck"
                        circle
                        @click="handlePermissoes(scope.row)"
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
import { Edit, ShieldCheck, Trash2 } from 'lucide-vue-next'
import type { ListPerfilDto } from '../services/perfil.service'

const props = defineProps<{
    filteredPerfis: ListPerfilDto[]
    loading: boolean
}>()

const emit = defineEmits<{
    edit_perfil: [perfil: ListPerfilDto]
    delete_perfil: [perfil: ListPerfilDto]
    permissoes_perfil: [perfil: ListPerfilDto]
}>()

const handleEdit = (perfil: ListPerfilDto) => {
    emit('edit_perfil', perfil)
}

const handleDelete = (perfil: ListPerfilDto) => {
    emit('delete_perfil', perfil)
}

const handlePermissoes = (perfil: ListPerfilDto) => {
    emit('permissoes_perfil', perfil)
}
</script>
