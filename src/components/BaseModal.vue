<template>
    <el-dialog
        :model-value="effectiveVisible"
        v-bind="dialogAttrs"
        draggable
        overflow
        @update:model-value="onUpdateModelValue"
        @close="emit('close')"
    >
        <template v-if="$slots.header" #header>
            <slot name="header" />
        </template>
        <slot />
        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
    modelValue?: boolean
    dialogVisible?: boolean
    visible?: boolean
}>()

const attrs = useAttrs()

const effectiveVisible = computed(() => {
    return props.dialogVisible ?? props.visible ?? props.modelValue ?? false
})

const dialogAttrs = computed(() => {
    const { dialogVisible, visible, modelValue: _mv, ...rest } = attrs as Record<string, unknown>
    return rest
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'update:dialogVisible': [value: boolean]
    'update:visible': [value: boolean]
    close: []
}>()

function onUpdateModelValue(value: boolean) {
    emit('update:modelValue', value)
    emit('update:dialogVisible', value)
    emit('update:visible', value)
}
</script>
