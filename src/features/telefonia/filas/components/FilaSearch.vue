<template>
    <div class="fila-search">
        <el-input
            v-model="searchQuery"
            placeholder="Pesquisar filas..."
            clearable
            style="flex: 1;"
        />
        <el-button type="primary" style="margin-left: 10px;" @click="handleCreate">
            Criar fila
        </el-button>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
    'update:search-query': [value: string]
    create: []
}>()

const searchQuery = defineModel<string>('search-query')

const handleCreate = () => {
    emit('create')
}
</script>

<style scoped>
.fila-search {
    display: flex;
    margin-bottom: 20px;
}
</style>
