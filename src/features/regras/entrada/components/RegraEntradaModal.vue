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
        <el-input v-model="formData.nome" placeholder="Nome da regra de entrada" />
      </el-form-item>
      <el-form-item label="Descrição" prop="descricao">
        <el-input
          v-model="formData.descricao"
          type="textarea"
          :rows="2"
          placeholder="Descrição (opcional)"
        />
      </el-form-item>

      <el-form-item
        label="Número (exten)"
        prop="numero"
        :rules="[{ required: true, message: 'Número é obrigatório' }]"
      >
        <el-input
          v-model="formData.numero"
          placeholder="Ex: 0800, 4000, s"
          maxlength="40"
          show-word-limit
        />
      </el-form-item>

      <el-form-item
        label="Tipo de destino"
        prop="tipoDestino"
        :rules="[{ required: true, message: 'Selecione o tipo de destino' }]"
      >
        <el-select
          v-model="formData.tipoDestino"
          placeholder="Selecione o tipo"
          style="width: 100%"
          clearable
          @change="onTipoDestinoChange"
        >
          <el-option label="URA" value="ura" />
          <el-option label="Fila" value="fila" />
          <el-option label="Ramal" value="ramal" />
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="formData.tipoDestino === 'ura'"
        label="URA"
        prop="destinoValor"
        :rules="[{ required: true, message: 'Selecione uma URA' }]"
      >
        <el-select
          v-model="formData.destinoValor"
          placeholder="Selecione a URA"
          style="width: 100%"
          :loading="loadingUras"
          no-data-text="Nenhuma URA disponível"
        >
          <el-option
            v-for="r in urasFiltradas"
            :key="r.id"
            :label="r.nome"
            :value="r.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.tipoDestino === 'fila'"
        label="Fila"
        prop="destinoValor"
        :rules="[{ required: true, message: 'Selecione uma fila' }]"
      >
        <el-select
          v-model="formData.destinoValor"
          placeholder="Selecione a fila"
          style="width: 100%"
          :loading="loadingFilas"
          no-data-text="Nenhuma fila disponível"
        >
          <el-option
            v-for="f in filas"
            :key="f.nomeIdentificador"
            :label="f.nome"
            :value="f.nomeIdentificador"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="formData.tipoDestino === 'ramal'"
        label="Ramal"
        prop="destinoValor"
        :rules="[{ required: true, message: 'Selecione um ramal' }]"
      >
        <el-select
          v-model="formData.destinoValor"
          placeholder="Selecione o ramal"
          style="width: 100%"
          :loading="loadingRamais"
          no-data-text="Nenhum ramal disponível"
        >
          <el-option
            v-for="r in ramais"
            :key="r.ramal"
            :label="`${r.ramal} - ${r.nome}`"
            :value="r.ramal"
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
import { ref, computed, watch } from 'vue'
import BaseModal from '@/components/BaseModal.vue'
import {
  ListRegrasEntrada,
  ListFilas,
  ListRamais,
  type ListRegraEntradaDto,
  type ListFilaOptionDto,
  type ListRamalOptionDto,
  type RegraEntradaFormData
} from '@/features/regras/entrada/services/regra-entrada.service'

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean
    formData: RegraEntradaFormData
    isEdit: boolean
    modalTitle: string
    submitting: boolean
    editingRegraId?: string | null
  }>(),
  { editingRegraId: null }
)

const emit = defineEmits<{
  'update:dialogVisible': [value: boolean]
  submit: []
  close: []
}>()

const formRef = ref()

const regrasEntrada = ref<ListRegraEntradaDto[]>([])
const filas = ref<ListFilaOptionDto[]>([])
const ramais = ref<ListRamalOptionDto[]>([])
const loadingUras = ref(false)
const loadingFilas = ref(false)
const loadingRamais = ref(false)

const urasFiltradas = computed(() => {
  if (!props.editingRegraId) return regrasEntrada.value
  return regrasEntrada.value.filter(r => r.id !== props.editingRegraId)
})

function onTipoDestinoChange() {
  props.formData.destinoValor = ''
}

watch(
  () => props.formData.tipoDestino,
  () => {
    props.formData.destinoValor = ''
  }
)

async function loadOptions() {
  if (!props.dialogVisible) return
  loadingUras.value = true
  loadingFilas.value = true
  loadingRamais.value = true
  try {
    const [urasRes, filasRes, ramaisRes] = await Promise.all([
      ListRegrasEntrada().catch(() => [] as ListRegraEntradaDto[]),
      ListFilas().catch(() => [] as ListFilaOptionDto[]),
      ListRamais().catch(() => [] as ListRamalOptionDto[])
    ])
    regrasEntrada.value = Array.isArray(urasRes) ? urasRes : []
    filas.value = Array.isArray(filasRes) ? filasRes : []
    ramais.value = Array.isArray(ramaisRes) ? ramaisRes : []
  } finally {
    loadingUras.value = false
    loadingFilas.value = false
    loadingRamais.value = false
  }
}

watch(
  () => props.dialogVisible,
  visible => {
    if (visible) loadOptions()
  }
)

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
