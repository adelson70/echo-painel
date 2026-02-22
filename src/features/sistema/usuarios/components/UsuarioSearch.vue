<template>
    <div class="usuario-search">
        <el-input
            v-model="searchQuery"
            placeholder="Pesquisar usuários..."
            clearable
            style="flex: 1;"
        />
        <el-button type="primary" style="margin-left: 10px;" @click="handleCreate">
            Criar usuário
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
.usuario-search {
    display: flex;
    margin-bottom: 20px;
}
</style>
