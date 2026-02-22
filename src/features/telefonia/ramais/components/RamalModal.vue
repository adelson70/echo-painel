<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="600px"
        @close="$emit('close')"
    >
        <el-form ref="formRef" :model="formData" label-position="top">
            <template v-if="isBatch">
                <el-row>
                    <el-col :span="12" style="padding-right: 8px">
                        <el-form-item label="Quantidade de Ramais" prop="quantidadeRamais">
                            <el-input-number v-model="formData.quantidadeRamais" :min="1"
                                style="width: 100%" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 8px">
                        <el-form-item label="Ramal Inicial" prop="ramalInicial">
                            <el-input v-model="formData.ramalInicial" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="Regra de Saída" prop="regraSaida"
                            :rules="[{ required: true, message: 'Regra de saída é obrigatória' }]">
                            <el-select v-model="formData.regraSaida" placeholder="Selecione a regra"
                                style="width: 100%">
                                <el-option v-for="regra in regrasSaida" :key="regra.id"
                                    :label="regra.nome" :value="regra.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="padding-left: 20px">
                        <el-form-item label="Máximo de Contatos" prop="maximoContatos">
                            <el-input-number v-model="formData.maximoContatos" :min="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="DOD" prop="dod">
                            <el-input v-model="formData.dod" />
                        </el-form-item>
                    </el-col>
                </el-row>


            </template>
            <template v-else>
                <el-form-item label="Nome" prop="nome">
                    <el-input v-model="formData.nome" />
                </el-form-item>

                <el-row>
                    <el-col :span="12" style="padding-right: 8px">
                        <el-form-item label="Ramal" prop="ramal"
                            :rules="[{ required: !isEdit, message: 'Ramal é obrigatório' }]">
                            <el-input v-model="formData.ramal" :disabled="isEdit" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" style="padding-left: 8px">
                        <el-form-item label="Senha" prop="senha">
                            <el-input v-model="formData.senha" type="password" show-password />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="8">
                        <el-form-item label="Regra de Saída" prop="regraSaida"
                            :rules="[{ required: !isEdit, message: 'Regra de saída é obrigatória' }]">
                            <el-select v-model="formData.regraSaida"
                                placeholder="Selecione a regra">
                                <el-option v-for="regra in regrasSaida" :key="regra.id"
                                    :label="regra.nome" :value="regra.id" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" style="padding-left: 20px">
                        <el-form-item label="Máximo de Contatos" prop="maximoContatos">
                            <el-input-number v-model="formData.maximoContatos" :min="1" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="DOD" prop="dod">
                            <el-input v-model="formData.dod" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </template>
        </el-form>
        <template #footer>
            <el-button @click="$emit('update:dialogVisible', false)">Cancelar</el-button>
            <el-button type="primary" @click="handleSubmit" :loading="submitting">
                {{ isEdit ? 'Atualizar' : isBatch ? 'Criar lote' : 'Criar' }}
            </el-button>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import { z } from 'zod'
import { ElMessage } from 'element-plus'
import { useRamalStore } from '../stores/ramal.store'
import type { ListRegrasSaidaDto } from '../services/ramal.service'

const ramalStore = useRamalStore()
const regrasSaida = ref<ListRegrasSaidaDto[]>([])

const props = defineProps<{
    dialogVisible: boolean
    formData: any
    isBatch: boolean
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

const singleSchema = z.object({
    ramal: z.string().nonempty('Ramal é obrigatório'),
    nome: z.string().nonempty('Nome é obrigatório'),
    senha: z.string().nonempty('Senha é obrigatória'),
    regraSaida: z.string().nonempty('Regra de saída é obrigatória'),
    maximoContatos: z.number().min(1, 'Máximo de contatos deve ser pelo menos 1'),
    dod: z.string().optional()
})

const batchSchema = z.object({
    quantidadeRamais: z.number().min(1, 'Quantidade deve ser pelo menos 1'),
    ramalInicial: z.string().nonempty('Ramal inicial é obrigatório'),
    regraSaida: z.string().nonempty('Regra de saída é obrigatória'),
    maximoContatos: z.number().min(1, 'Máximo de contatos deve ser pelo menos 1'),
    dod: z.string().optional()
})

const editSchema = z.object({
    nome: z.string().optional(),
    senha: z.string().optional(),
    regraSaida: z.string().optional(),
    maximoContatos: z.number().optional(),
    dod: z.string().optional()
})

const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
    } catch (error) {
        return
    }

    let schema
    if (props.isBatch) {
        schema = batchSchema
    } else if (props.isEdit) {
        schema = editSchema
    } else {
        schema = singleSchema
    }

    const result = schema.safeParse(props.formData)
    if (!result.success) {
        ElMessage.error('Dados inválidos. Verifique os campos.')
        return
    }

    emit('submit')
}

onMounted(async () => {
    try {
        regrasSaida.value = await ramalStore.listRegrasRamal()
    } catch (error) {
        regrasSaida.value = []
    }
})
</script>