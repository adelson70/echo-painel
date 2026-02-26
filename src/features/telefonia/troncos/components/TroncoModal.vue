<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="640px"
        @close="$emit('close')"
    >
        <el-form ref="formRef" :model="formData" label-position="top">
            <el-form-item
                label="Nome do tronco"
                prop="username"
                :rules="[{ required: true, message: 'Nome do tronco é obrigatório' }]"
            >
                <el-input v-model="formData.username" placeholder="Ex: tronco1" />
            </el-form-item>
            <el-form-item
                label="Senha"
                prop="password"
                :rules="isEdit ? [] : [{ required: true, message: 'Senha é obrigatória' }]"
            >
                <el-input
                    v-model="formData.password"
                    type="password"
                    show-password
                    :placeholder="isEdit ? 'Deixar em branco para não alterar' : undefined"
                />
            </el-form-item>
            <el-form-item
                label="URI do provedor"
                prop="provedorHost"
                :rules="[{ required: true, message: 'URI do provedor é obrigatória' }]"
            >
                <el-input v-model="formData.provedorHost" placeholder="Ex: provedor.sip.com" />
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

const props = defineProps<{
    dialogVisible: boolean
    formData: { username: string; password: string; provedorHost: string }
    isEdit: boolean
    modalTitle: string
    submitting: boolean
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
