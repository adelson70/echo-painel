<template>
    <el-table
        :data="filteredUsuarios"
        style="width: 100%"
        :loading="loading"
        empty-text="Nenhum usuário encontrado"
        :default-sort="{ prop: 'nome', order: 'ascending' }"
    >
        <el-table-column prop="nome" label="Nome" sortable />
        <el-table-column prop="email" label="Email" sortable show-overflow-tooltip />
        <el-table-column label="Perfil" width="160">
            <template #default="scope">
                {{ perfilNome(scope.row.perfil_id) }}
            </template>
        </el-table-column>
        <el-table-column label="Admin" width="100" align="center">
            <template #default="scope">
                <el-tag :type="scope.row.is_admin ? 'danger' : 'info'" size="small">
                    {{ scope.row.is_admin ? 'Admin' : 'Usuário' }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="Último login" width="180">
            <template #default="scope">
                {{ formatLastLogin(scope.row.last_login) }}
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
import type { ListUsuarioDto } from '../services/usuario.service'
import type { ListPerfilDto } from '@/features/sistema/perfis/services/perfil.service'

const props = defineProps<{
    filteredUsuarios: ListUsuarioDto[]
    loading: boolean
    perfis: ListPerfilDto[]
}>()

const emit = defineEmits<{
    edit_usuario: [usuario: ListUsuarioDto]
    delete_usuario: [usuario: ListUsuarioDto]
    permissoes_usuario: [usuario: ListUsuarioDto]
}>()

function perfilNome(perfilId: string | null): string {
    if (!perfilId) return '-'
    const perfil = props.perfis.find(p => p.id === perfilId)
    return perfil?.nome ?? '-'
}

function formatLastLogin(lastLogin: string | null): string {
    if (!lastLogin) return '-'
    try {
        const date = new Date(lastLogin)
        return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('pt-BR')
    } catch {
        return '-'
    }
}

const handleEdit = (usuario: ListUsuarioDto) => {
    emit('edit_usuario', usuario)
}

const handleDelete = (usuario: ListUsuarioDto) => {
    emit('delete_usuario', usuario)
}

const handlePermissoes = (usuario: ListUsuarioDto) => {
    emit('permissoes_usuario', usuario)
}
</script>
