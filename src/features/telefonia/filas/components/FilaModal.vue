<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="600px"
        @close="$emit('close')"
    >
        <el-form ref="formRef" :model="formData" label-position="top">
            <el-form-item
                label="Nome identificador"
                prop="nomeIdentificador"
                :rules="[
                    { required: true, message: 'Nome identificador é obrigatório' },
                    {
                        pattern: /^[a-zA-Z][a-zA-Z0-9_-]+$/,
                        message: 'Deve começar com letra e conter apenas letras, números, _ ou -',
                    },
                ]"
            >
                <el-input
                    v-model="formData.nomeIdentificador"
                    placeholder="Ex: fila-vendas"
                    :disabled="isEdit"
                />
            </el-form-item>
            <el-form-item
                label="Nome"
                prop="nome"
                :rules="[{ required: true, message: 'Nome é obrigatório' }]"
            >
                <el-input v-model="formData.nome" placeholder="Nome de exibição da fila" />
            </el-form-item>
            <el-form-item
                label="Estratégia"
                prop="estrategia"
                :rules="[{ required: true, message: 'Estratégia é obrigatória' }]"
            >
                <el-select
                    v-model="formData.estrategia"
                    placeholder="Selecione a estratégia"
                    style="width: 100%"
                >
                    <el-option
                        v-for="opt in estrategiaOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
                    />
                </el-select>
            </el-form-item>
            <el-row :gutter="16">
                <el-col :span="12">
                    <el-form-item label="Tempo de espera (s)" prop="tempoEspera">
                        <el-input-number
                            v-model="formData.tempoEspera"
                            :min="0"
                            placeholder="Opcional"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="Tentativas" prop="tentativas">
                        <el-input-number
                            v-model="formData.tentativas"
                            :min="0"
                            placeholder="Opcional"
                            style="width: 100%"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="Música de espera" prop="musicaDeEspera">
                <el-select
                    v-model="formData.musicaDeEspera"
                    placeholder="Opcional"
                    clearable
                    style="width: 100%"
                >
                    <el-option
                        v-for="opt in musicaOptions"
                        :key="opt.value"
                        :label="opt.label"
                        :value="opt.value"
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
import { ref, computed } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import {
  EstrategiaFila,
  MusicaDeEsperaFila,
  type EstrategiaFilaValue,
  type MusicaDeEsperaFilaValue,
} from '../services/fila.service'

const estrategiaOptions: { value: EstrategiaFilaValue; label: string }[] = [
  { value: EstrategiaFila.RING_ALL, label: 'Ring All' },
  { value: EstrategiaFila.LEAST_RECENT, label: 'Menos recente' },
  { value: EstrategiaFila.FEWEST_CALLS, label: 'Menos chamadas' },
  { value: EstrategiaFila.RANDOM, label: 'Aleatório' },
  { value: EstrategiaFila.RR_MEMORY, label: 'Round Robin (memória)' },
  { value: EstrategiaFila.LINEAR, label: 'Linear' },
  { value: EstrategiaFila.WRANDOM, label: 'Peso aleatório' },
  { value: EstrategiaFila.RR_ORDERED, label: 'Round Robin ordenado' },
]

const musicaOptions: { value: MusicaDeEsperaFilaValue; label: string }[] = [
  { value: MusicaDeEsperaFila.DEFAULT, label: 'Padrão' },
  { value: MusicaDeEsperaFila.NO_MUSIC_WHEN_EMPTY, label: 'Sem música quando vazia' },
  { value: MusicaDeEsperaFila.MUSIC_ON_HOLD, label: 'Música em espera' },
]

const props = defineProps<{
  dialogVisible: boolean
  formData: {
    nomeIdentificador: string
    nome: string
    estrategia: EstrategiaFilaValue
    tempoEspera?: number
    tentativas?: number
    musicaDeEspera?: MusicaDeEsperaFilaValue
  }
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
