<template>
    <div class="ramal-search">
        <el-input v-model="searchQuery" placeholder="Pesquisar ramais..." clearable
            style="flex: 1;" />
        <el-select v-model="localCreateType" placeholder="Criar"
            style="width: 150px; margin-left: 10px;" @change="handleCreate">
            <el-option label="Único" value="single" />
            <el-option label="Em Lote" value="batch" />
        </el-select>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
    'update:search-query': [value: string]
    create: [type: string]
}>()

const searchQuery = defineModel<string>('search-query')

const localCreateType = ref('')

const handleCreate = () => {
    emit('create', localCreateType.value)
    localCreateType.value = ''
}
</script>

<style scoped>
.ramal-search {
    display: flex;
    margin-bottom: 20px;
}
</style>