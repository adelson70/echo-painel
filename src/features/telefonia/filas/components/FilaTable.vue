<template>
    <el-table
        :data="filteredFilas"
        style="width: 100%"
        :loading="loading"
        empty-text="Nenhuma fila encontrada"
        :default-sort="{ prop: 'nome', order: 'ascending' }"
    >
        <el-table-column prop="nomeIdentificador" label="Nome identificador" sortable min-width="140" />
        <el-table-column prop="nome" label="Nome" sortable min-width="140" />
        <el-table-column prop="estrategia" label="Estratégia" min-width="140">
            <template #default="scope">
                {{ estrategiaLabel(scope.row.estrategia) }}
            </template>
        </el-table-column>
        <el-table-column prop="tempoEspera" label="Tempo espera (s)" width="120" />
        <el-table-column prop="tentativas" label="Tentativas" width="100" />
        <el-table-column prop="musicaDeEspera" label="Música de espera" width="140">
            <template #default="scope">
                {{ musicaLabel(scope.row.musicaDeEspera) }}
            </template>
        </el-table-column>
        <el-table-column label="Ramais" width="100">
            <template #default="scope">
                {{ scope.row.ramais?.length ?? 0 }} ramais
            </template>
        </el-table-column>
        <el-table-column label="Ações" width="180" fixed="right">
            <template #default="scope">
                <el-tooltip content="Membros">
                    <el-button
                        size="medium"
                        :icon="Users"
                        circle
                        @click="handleMembros(scope.row)"
                    />
                </el-tooltip>
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
import { Edit, Trash2, Users } from 'lucide-vue-next'
import type { ListFilaDto } from '../services/fila.service'
import { EstrategiaFila, MusicaDeEsperaFila } from '../services/fila.service'
import type { EstrategiaFilaValue, MusicaDeEsperaFilaValue } from '../services/fila.service'

const estrategiaLabels: Record<string, string> = {
  [EstrategiaFila.RING_ALL]: 'Ring All',
  [EstrategiaFila.LEAST_RECENT]: 'Menos recente',
  [EstrategiaFila.FEWEST_CALLS]: 'Menos chamadas',
  [EstrategiaFila.RANDOM]: 'Aleatório',
  [EstrategiaFila.RR_MEMORY]: 'Round Robin (memória)',
  [EstrategiaFila.LINEAR]: 'Linear',
  [EstrategiaFila.WRANDOM]: 'Peso aleatório',
  [EstrategiaFila.RR_ORDERED]: 'Round Robin ordenado',
}

const musicaLabels: Record<string, string> = {
  [MusicaDeEsperaFila.DEFAULT]: 'Padrão',
  [MusicaDeEsperaFila.NO_MUSIC_WHEN_EMPTY]: 'Sem música quando vazia',
  [MusicaDeEsperaFila.MUSIC_ON_HOLD]: 'Música em espera',
}

function estrategiaLabel(value?: EstrategiaFilaValue): string {
  return value ? (estrategiaLabels[value] ?? value) : '—'
}

function musicaLabel(value?: MusicaDeEsperaFilaValue): string {
  return value ? (musicaLabels[value] ?? value) : '—'
}

const props = defineProps<{
  filteredFilas: ListFilaDto[]
  loading: boolean
}>()

const emit = defineEmits<{
  edit_fila: [fila: ListFilaDto]
  delete_fila: [fila: ListFilaDto]
  membros_fila: [fila: ListFilaDto]
}>()

const handleEdit = (fila: ListFilaDto) => {
  emit('edit_fila', fila)
}

const handleDelete = (fila: ListFilaDto) => {
  emit('delete_fila', fila)
}

const handleMembros = (fila: ListFilaDto) => {
  emit('membros_fila', fila)
}
</script>
