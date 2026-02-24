<template>
  <el-table
    :data="filteredRegras"
    style="width: 100%"
    :loading="loading"
    empty-text="Nenhuma regra de entrada encontrada"
    :default-sort="{ prop: 'nome', order: 'ascending' }"
  >
    <el-table-column prop="nome" label="Nome" sortable />
    <el-table-column label="Número" width="120">
      <template #default="scope">
        {{ scope.row.regra?.[0]?.rota ?? '—' }}
      </template>
    </el-table-column>
    <el-table-column prop="descricao" label="Descrição" show-overflow-tooltip />
    <el-table-column prop="destino" label="Destino" width="220">
      <template #default="scope">
        {{ formatDestino(scope.row) }}
      </template>
    </el-table-column>
    <el-table-column label="Ações" width="140" fixed="right">
      <template #default="scope">
        <el-tooltip content="Editar">
          <el-button
            size="medium"
            type="primary"
            :icon="Edit"
            circle
            @click="handleEdit(scope.row)"
          />
        </el-tooltip>
        <el-tooltip content="Excluir">
          <el-button
            size="medium"
            type="danger"
            :icon="Trash2"
            circle
            @click="handleDelete(scope.row)"
          />
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { Edit, Trash2 } from 'lucide-vue-next'
import type { ListRegraEntradaDto } from '../services/regra-entrada.service'

function formatDestino(regra: ListRegraEntradaDto): string {
  const first = regra.regra?.[0]
  if (!first) return '—'
  const acao = (first.acao || '').toString()
  const params = (first.parametros || '').trim()
  if (acao === 'Goto') {
    return `URA${params ? ` (${params})` : ''}`
  }
  if (acao === 'Queue') {
    return params ? `Fila: ${params}` : 'Fila'
  }
  if (acao === 'Dial') {
    const match = params.match(/PJSIP[/](.+)/)
    return match ? `Ramal: ${match[1]}` : params || 'Ramal'
  }
  return acao ? `${acao}${params ? ` (${params})` : ''}` : '—'
}

const props = defineProps<{
  filteredRegras: ListRegraEntradaDto[]
  loading: boolean
}>()

const emit = defineEmits<{
  edit_regra: [regra: ListRegraEntradaDto]
  delete_regra: [regra: ListRegraEntradaDto]
}>()

const handleEdit = (regra: ListRegraEntradaDto) => {
  emit('edit_regra', regra)
}

const handleDelete = (regra: ListRegraEntradaDto) => {
  emit('delete_regra', regra)
}
</script>
