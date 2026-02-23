<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="500px"
        @close="$emit('close')"
    >
        <template v-if="fila">
            <div class="membros-add">
                <el-select
                    v-model="selectedRamalToAdd"
                    placeholder="Adicionar ramal à fila"
                    filterable
                    clearable
                    style="width: 100%"
                    @change="handleAddMember"
                >
                    <el-option
                        v-for="r in ramaisDisponiveis"
                        :key="r.ramal"
                        :label="`${r.ramal} - ${r.nome}`"
                        :value="r.ramal"
                    />
                </el-select>
            </div>
            <el-table :data="membersWithNames" style="width: 100%; margin-top: 16px" max-height="320">
                <el-table-column prop="ramal" label="Ramal" width="100" />
                <el-table-column prop="nome" label="Nome" />
                <el-table-column label="" width="80" align="right">
                    <template #default="scope">
                        <el-tooltip content="Remover da fila">
                            <el-button
                                size="small"
                                type="danger"
                                :icon="Trash2"
                                circle
                                @click="handleRemoveMember(scope.row.ramal)"
                            />
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <p v-if="membersWithNames.length === 0" class="empty-members">
                Nenhum ramal nesta fila.
            </p>
        </template>
        <template #footer>
            <el-button @click="$emit('update:dialogVisible', false)">Fechar</el-button>
        </template>
    </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Trash2 } from 'lucide-vue-next'
import BaseModal from '@/components/BaseModal.vue'
import { useFilaStore } from '../stores/fila.store'
import { useRamalStore } from '@/features/telefonia/ramais/stores/ramal.store'
import type { ListFilaDto } from '../services/fila.service'

const props = defineProps<{
  dialogVisible: boolean
  fila: ListFilaDto | null
}>()

const emit = defineEmits<{
  'update:dialogVisible': [value: boolean]
  close: []
}>()

const filaStore = useFilaStore()
const ramalStore = useRamalStore()
const selectedRamalToAdd = ref('')

const modalTitle = computed(() =>
  props.fila ? `Membros da fila: ${props.fila.nome}` : 'Membros da fila'
)

const ramaisDisponiveis = computed(() => {
  if (!props.fila) return []
  const memberIds = new Set(props.fila.ramais ?? [])
  return ramalStore.ramais.filter((r) => !memberIds.has(r.ramal))
})

const membersWithNames = computed(() => {
  if (!props.fila?.ramais?.length) return []
  return props.fila.ramais.map((ramalId) => {
    const r = ramalStore.ramais.find((x) => x.ramal === ramalId)
    return { ramal: ramalId, nome: r?.nome ?? ramalId }
  })
})

watch(
  () => props.dialogVisible,
  (visible) => {
    if (visible && !ramalStore.ramais.length) {
      ramalStore.fetchRamais()
    }
    if (!visible) {
      selectedRamalToAdd.value = ''
    }
  }
)

async function handleAddMember(ramal: string) {
  if (!ramal || !props.fila) return
  try {
    await filaStore.toggleMemberFila(props.fila.id, ramal)
    selectedRamalToAdd.value = ''
  } catch {
    // Error handled in store/service
  }
}

async function handleRemoveMember(ramal: string) {
  if (!props.fila) return
  try {
    await filaStore.toggleMemberFila(props.fila.id, ramal)
  } catch {
    // Error handled in store/service
  }
}
</script>

<style scoped>
.membros-add {
  margin-bottom: 8px;
}
.empty-members {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-top: 12px;
}
</style>
