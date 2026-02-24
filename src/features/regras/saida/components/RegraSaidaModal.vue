<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        :width="isEdit ? '500px' : '1120px'"
        @close="$emit('close')"
    >
        <el-form ref="formRef" :model="formData" label-position="top">
            <el-form-item
                label="Nome"
                prop="nome"
                :rules="[{ required: true, message: 'Nome é obrigatório' }]"
            >
                <el-input v-model="formData.nome" placeholder="Nome da regra de saída" />
            </el-form-item>
            <el-form-item label="Descrição" prop="descricao">
                <el-input
                    v-model="formData.descricao"
                    type="textarea"
                    :rows="2"
                    placeholder="Descrição (opcional)"
                />
            </el-form-item>

            <div v-if="isEdit" class="gerenciar-etapas-row">
                <el-button type="primary" @click="$emit('gerenciarEtapas')">
                    Gerenciamento das regras
                </el-button>
            </div>

            <div v-if="!isEdit" class="etapas-section">
                <div class="etapas-header">
                    <span class="etapas-title">Etapas da regra</span>
                    <el-button type="primary" size="small" @click="addStep">
                        Adicionar etapa
                    </el-button>
                </div>
                <el-table :data="formData.regra" size="small" class="etapas-table">
                    <el-table-column label="Ordem" width="90" align="center">
                        <template #default="{ $index }">
                            <div class="ordem-buttons">
                                <el-tooltip content="Subir">
                                    <el-button
                                        :icon="ArrowUp"
                                        circle
                                        size="small"
                                        :disabled="$index === 0"
                                        @click="moveStep($index, -1)"
                                    />
                                </el-tooltip>
                                <el-tooltip content="Descer">
                                    <el-button
                                        :icon="ArrowDown"
                                        circle
                                        size="small"
                                        :disabled="$index === formData.regra.length - 1"
                                        @click="moveStep($index, 1)"
                                    />
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Rota" min-width="320">
                        <template #default="{ row, $index }">
                            <div class="rota-cell">
                                <div class="rota-row">
                                    <el-select
                                        v-model="rotaPadraoSelecionado[$index]"
                                        placeholder="Padrão ou personalizado"
                                        class="rota-select"
                                        @change="(v: string) => onRotaPadraoChange(row, v)"
                                    >
                                        <el-option
                                            v-for="p in rotaPadroes"
                                            :key="p.value"
                                            :label="p.label"
                                            :value="p.value"
                                        />
                                        <el-option label="Outro (digitar)" value="__outro__" />
                                    </el-select>
                                    <el-popover
                                        placement="top"
                                        :width="320"
                                        trigger="hover"
                                    >
                                        <template #reference>
                                            <el-button :icon="HelpCircle" circle size="small" class="rota-ajuda" />
                                        </template>
                                        <p class="ajuda-titulo">Padrões válidos (rota)</p>
                                        <p class="ajuda-texto">{{ rotaAjudaTexto }}</p>
                                        <ul class="ajuda-lista">
                                            <li v-for="p in rotaPadroes" :key="p.value"><code>{{ p.value }}</code> – {{ p.label }}</li>
                                        </ul>
                                    </el-popover>
                                </div>
                                <el-input
                                    v-if="rotaPadraoSelecionado[$index] === '__outro__' || (row.rota && !rotaPadroes.some(pp => pp.value === row.rota))"
                                    v-model="row.rota"
                                    placeholder="Ex: s, _X. (digite o padrão)"
                                    maxlength="40"
                                    show-word-limit
                                    class="rota-custom"
                                />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="Ação" min-width="180">
                        <template #default="{ row, $index }">
                            <el-select
                                v-model="row.acao"
                                placeholder="Selecione a ação"
                                filterable
                                style="width: 100%"
                                @change="onAcaoChange($index)"
                            >
                                <el-option
                                    v-for="opt in acaoOptions"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="Parâmetros" min-width="220">
                        <template #default="{ row, $index }">
                            <ParametrosStep
                                :step="row"
                                :index="$index"
                                :param-campos="paramCampos[$index]"
                                @update:param-campos="(v) => onParamCamposUpdate($index, v)"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="" width="56" fixed="right">
                        <template #default="{ $index }">
                            <el-button
                                type="danger"
                                :icon="Trash2"
                                circle
                                size="small"
                                @click="removeStep($index)"
                            />
                        </template>
                    </el-table-column>
                </el-table>
                <p v-if="formError" class="form-error">{{ formError }}</p>
            </div>
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
import { storeToRefs } from 'pinia'
import { Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useRegraSaidaStore } from '../stores/regra-saida.store'
import { APP_VALUES_SAIDA_FALLBACK } from '../constants/app-values-saida'
import { ROTA_PADROES, ROTA_AJUDA_TEXTO } from '../constants/rota-padroes'
import { getConfigParametros } from '../constants/parametros-por-acao'
import ParametrosStep from './ParametrosStep.vue'
import type { RegraStep } from '../services/regra-saida.service'

const props = defineProps<{
    dialogVisible: boolean
    formData: { nome: string; descricao: string; regra: RegraStep[] }
    isEdit: boolean
    modalTitle: string
    submitting: boolean
}>()

const emit = defineEmits<{
    'update:dialogVisible': [value: boolean]
    submit: []
    close: []
    gerenciarEtapas: []
}>()

const regraStore = useRegraSaidaStore()
const { metadata } = storeToRefs(regraStore)

const acaoOptions = computed(() => {
    if (metadata.value?.appValues?.length) {
        return metadata.value.appValues
    }
    return APP_VALUES_SAIDA_FALLBACK
})

const rotaPadroes = ROTA_PADROES
const rotaAjudaTexto = ROTA_AJUDA_TEXTO

/** Para cada linha: valor do select de rota (padrão ou __outro__). */
const rotaPadraoSelecionado = ref<string[]>([])

/** Campos de parâmetros por índice de etapa (synced com formData.regra). */
const paramCampos = ref<Record<string, string>[]>([])

const formRef = ref()
const formError = ref('')

function syncParamCamposFromRegra() {
    paramCampos.value = props.formData.regra.map((step) => parseStepParametros(step))
    rotaPadraoSelecionado.value = props.formData.regra.map((step) => {
        const rota = (step.rota ?? '').trim()
        const padrao = ROTA_PADROES.find((p) => p.value === rota)
        return padrao ? padrao.value : '__outro__'
    })
}

function parseStepParametros(step: RegraStep): Record<string, string> {
    const config = getConfigParametros(step.acao ?? '')
    const paramStr = (step.parametros ?? '').trim()
    if (config?.parse) return config.parse(paramStr)
    return { valor: paramStr }
}

function buildParametros(index: number, campos: Record<string, string>): string {
    const step = props.formData.regra[index]
    if (!step) return ''
    const config = getConfigParametros(step.acao ?? '')
    if (config) return config.build(campos)
    return (campos.valor ?? '').trim()
}

watch(
    () => [props.dialogVisible, props.formData.regra.length] as const,
    () => {
        formError.value = ''
        if (props.dialogVisible) {
            if (!metadata.value) regraStore.fetchMetadata()
            syncParamCamposFromRegra()
        }
    },
    { immediate: true }
)

function onRotaPadraoChange(row: RegraStep, value: string) {
    if (value !== '__outro__') row.rota = value
}

function onAcaoChange(index: number) {
    const step = props.formData.regra[index]
    if (!step) return
    paramCampos.value[index] = parseStepParametros(step)
    step.parametros = buildParametros(index, paramCampos.value[index] ?? {})
}

function onParamCamposUpdate(index: number, campos: Record<string, string>) {
    if (!paramCampos.value[index]) paramCampos.value[index] = {}
    Object.assign(paramCampos.value[index], campos)
    const step = props.formData.regra[index]
    if (step) step.parametros = buildParametros(index, paramCampos.value[index] ?? {})
}

function addStep() {
    props.formData.regra.push({
        rota: 's',
        prioridade: 1,
        acao: '',
        parametros: ''
    })
    syncParamCamposFromRegra()
}

function removeStep(index: number) {
    props.formData.regra.splice(index, 1)
    paramCampos.value.splice(index, 1)
    rotaPadraoSelecionado.value.splice(index, 1)
}

function moveStep(index: number, delta: number) {
    const newIndex = index + delta
    if (newIndex < 0 || newIndex >= props.formData.regra.length) return
    const regra = props.formData.regra
    const [step] = regra.splice(index, 1)
    if (!step) return
    regra.splice(newIndex, 0, step)
    const [campos] = paramCampos.value.splice(index, 1)
    if (campos) paramCampos.value.splice(newIndex, 0, campos)
    const [rotaSel] = rotaPadraoSelecionado.value.splice(index, 1)
    rotaPadraoSelecionado.value.splice(newIndex, 0, rotaSel ?? '__outro__')
}

function validateSteps(): boolean {
    formError.value = ''
    if (!props.formData.regra?.length) {
        formError.value = 'Adicione pelo menos uma etapa.'
        return false
    }
    for (let i = 0; i < props.formData.regra.length; i++) {
        const step = props.formData.regra[i]
        if (!step) continue
        if (!step.rota?.trim()) {
            formError.value = `Rota obrigatória na etapa ${i + 1}. Use "s" ou padrões como _X.`
            return false
        }
        if (!step.acao) {
            formError.value = `Ação obrigatória na etapa ${i + 1}.`
            return false
        }
    }
    return true
}

const handleSubmit = async () => {
    if (!formRef.value) return
    try {
        await formRef.value.validate()
    } catch {
        return
    }
    if (!props.isEdit && !validateSteps()) return
    emit('submit')
}
</script>

<style scoped>
.etapas-section {
    margin-top: 16px;
}
.etapas-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}
.etapas-title {
    font-weight: 500;
}
.etapas-table {
    margin-bottom: 8px;
}
.ordem-buttons {
    display: flex;
    gap: 4px;
    justify-content: center;
}
.rota-cell {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
}
.rota-row {
    display: flex;
    align-items: center;
    gap: 8px;
}
.rota-select {
    flex: 1;
    min-width: 140px;
}
.rota-custom {
    width: 100%;
    min-height: 32px;
}
.rota-ajuda {
    flex-shrink: 0;
}
.ajuda-titulo {
    font-weight: 600;
    margin: 0 0 6px 0;
}
.ajuda-texto {
    font-size: 12px;
    margin: 0 0 8px 0;
    color: var(--el-text-color-secondary);
}
.ajuda-lista {
    margin: 0;
    padding-left: 18px;
    font-size: 12px;
}
.ajuda-lista code {
    font-size: 11px;
    background: var(--el-fill-color-light);
    padding: 1px 4px;
    border-radius: 3px;
}
.form-error {
    color: var(--el-color-danger);
    font-size: 12px;
    margin: 0;
}
.gerenciar-etapas-row {
    margin-top: 16px;
}
</style>
