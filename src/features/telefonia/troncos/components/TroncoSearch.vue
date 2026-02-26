<template>
    <div class="tronco-search">
        <el-input
            v-model="searchQuery"
            placeholder="Pesquisar troncos..."
            clearable
            style="flex: 1;"
        />
        <el-button type="primary" style="margin-left: 10px;" @click="handleCreate">
            Criar tronco
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
.tronco-search {
    display: flex;
    margin-bottom: 20px;
}
</style>
