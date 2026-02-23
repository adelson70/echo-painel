<template>
    <div class="grupo-captura-search">
        <el-input
            v-model="searchQuery"
            placeholder="Pesquisar grupos de captura..."
            clearable
            style="flex: 1;"
        />
        <el-button type="primary" style="margin-left: 10px;" @click="handleCreate">
            Criar grupo
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
.grupo-captura-search {
    display: flex;
    margin-bottom: 20px;
}
</style>
