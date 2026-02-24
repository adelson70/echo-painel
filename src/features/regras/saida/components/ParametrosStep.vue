<template>
    <div class="parametros-step">
        <template v-if="config && config.campos.length">
            <div v-for="campo in config.campos" :key="campo.key" class="param-campo">
                <el-input
                    v-if="campo.type === 'text'"
                    :model-value="(paramCampos || {})[campo.key]"
                    :placeholder="campo.placeholder"
                    size="small"
                    @update:model-value="(v: string) => emitCampo(campo.key, v)"
                />
                <el-input-number
                    v-else
                    :model-value="(paramCampos || {})[campo.key] ? Number((paramCampos || {})[campo.key]) : undefined"
                    :placeholder="campo.placeholder"
                    size="small"
                    controls-position="right"
                    style="width: 100%"
                    @update:model-value="(v: number | undefined) => emitCampo(campo.key, v != null ? String(v) : '')"
                />
            </div>
        </template>
        <template v-else>
            <el-input
                :model-value="(paramCampos || {}).valor"
                placeholder="Parâmetros (texto livre)"
                size="small"
                @update:model-value="(v: string) => emitCampo('valor', v ?? '')"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getConfigParametros } from '../constants/parametros-por-acao'
import type { RegraStep } from '../services/regra-saida.service'

const props = defineProps<{
    step: RegraStep
    index: number
    paramCampos: Record<string, string> | undefined
}>()

const emit = defineEmits<{
    'update:param-campos': [v: Record<string, string>]
}>()

const config = computed(() => getConfigParametros(props.step.acao ?? ''))

function emitCampo(key: string, value: string) {
    const next = { ...(props.paramCampos || {}), [key]: value }
    emit('update:param-campos', next)
}
</script>

<style scoped>
.parametros-step {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.param-campo {
    min-width: 0;
}
</style>
