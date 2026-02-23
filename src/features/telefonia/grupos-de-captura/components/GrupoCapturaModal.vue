<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="500px"
        @close="$emit('close')"
    >
        <el-form ref="formRef" :model="formData" label-position="top">
            <el-form-item
                label="Nome"
                prop="nome"
                :rules="[{ required: true, message: 'Nome é obrigatório' }]"
            >
                <el-input v-model="formData.nome" placeholder="Nome do grupo de captura" />
            </el-form-item>
            <template v-if="!isEdit">
                <el-form-item label="Membros iniciais (opcional)" prop="membros">
                    <el-select
                        v-model="formData.membros"
                        placeholder="Selecione ramais"
                        multiple
                        filterable
                        clearable
                        style="width: 100%"
                    >
                        <el-option
                            v-for="r in ramais"
                            :key="r.ramal"
                            :label="`${r.ramal} - ${r.nome}`"
                            :value="r.ramal"
                        />
                    </el-select>
                </el-form-item>
            </template>
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
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BaseModal from '@/components/BaseModal.vue'
import { useRamalStore } from '@/features/telefonia/ramais/stores/ramal.store'

const props = defineProps<{
    dialogVisible: boolean
    formData: { nome: string; membros?: string[] }
    isEdit: boolean
    modalTitle: string
    submitting: boolean
}>()

const emit = defineEmits<{
    'update:dialogVisible': [value: boolean]
    submit: []
    close: []
}>()

const ramalStore = useRamalStore()
const { ramais } = storeToRefs(ramalStore)

watch(
    () => props.dialogVisible,
    (visible) => {
        if (visible && !ramalStore.ramais.length) {
            ramalStore.fetchRamais()
        }
    }
)

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
