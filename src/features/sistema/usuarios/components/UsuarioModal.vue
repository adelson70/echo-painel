<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="640px"
        @close="$emit('close')"
    >
        <el-form ref="formRef" :model="formData" label-position="top">
            <el-form-item label="Nome" prop="nome" :rules="[{ required: true, message: 'Nome é obrigatório' }]">
                <el-input v-model="formData.nome" placeholder="Nome do usuário" />
            </el-form-item>
            <el-form-item label="Email" prop="email" :rules="[{ required: true, message: 'Email é obrigatório' }, { type: 'email', message: 'Email inválido' }]">
                <el-input v-model="formData.email" type="email" placeholder="email@exemplo.com" />
            </el-form-item>
            <el-form-item
                v-if="!isEdit"
                label="Senha"
                prop="senha"
                :rules="[{ required: true, message: 'Senha é obrigatória' }]"
            >
                <SenhaComGerador
                    v-model="formData.senha"
                    placeholder="Senha (8–20 caracteres, maiúscula, minúscula, número e especial)"
                />
            </el-form-item>
            <el-form-item v-else label="Senha" prop="senha">
                <SenhaComGerador
                    v-model="formData.senha"
                    placeholder="Deixar em branco para não alterar"
                />
            </el-form-item>
            <el-form-item label="Administrador" prop="is_admin">
                <el-checkbox v-model="formData.is_admin">Usuário é administrador</el-checkbox>
            </el-form-item>
            <el-form-item label="Perfil" prop="perfil_id">
                <el-select
                    v-model="formData.perfil_id"
                    placeholder="Nenhum"
                    clearable
                    style="width: 100%"
                >
                    <el-option label="Nenhum" :value="''" />
                    <el-option
                        v-for="p in perfis"
                        :key="p.id"
                        :label="p.nome"
                        :value="p.id"
                    />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="$emit('update:dialogVisible', false)">Cancelar</el-button>
            <el-button type="primary" :loading="submitting" @click="handleSubmit">
                {{ isEdit ? 'Atualizar' : 'Criar' }}
            </el-button>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import SenhaComGerador from './SenhaComGerador.vue'
import type { ListPerfilDto } from '@/features/sistema/perfis/services/perfil.service'

const props = defineProps<{
    dialogVisible: boolean
    formData: { nome: string; email: string; senha: string; is_admin: boolean; perfil_id: string | null }
    isEdit: boolean
    modalTitle: string
    submitting: boolean
    perfis: ListPerfilDto[]
}>()

const emit = defineEmits<{
    'update:dialogVisible': [value: boolean]
    submit: []
    close: []
}>()

const formRef = ref()

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  emit('submit')
}
</script>
