<template>
    <BaseModal
        :dialog-visible="dialogVisible"
        @update:dialog-visible="$emit('update:dialogVisible', $event)"
        :title="modalTitle"
        width="500px"
        @close="$emit('close')"
    >
        <template v-if="grupo">
            <div class="membros-add">
                <el-select
                    v-model="selectedRamalToAdd"
                    placeholder="Adicionar ramal ao grupo"
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
                        <el-tooltip content="Remover do grupo">
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
                Nenhum ramal neste grupo.
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
import { useGrupoCapturaStore } from '../stores/grupo-captura.store'
import { useRamalStore } from '@/features/telefonia/ramais/stores/ramal.store'
import type { ListGrupoDeCapturaDto } from '../services/grupo-captura.service'

const props = defineProps<{
    dialogVisible: boolean
    grupo: ListGrupoDeCapturaDto | null
}>()

const emit = defineEmits<{
    'update:dialogVisible': [value: boolean]
    close: []
}>()

const grupoStore = useGrupoCapturaStore()
const ramalStore = useRamalStore()
const selectedRamalToAdd = ref('')

const modalTitle = computed(() =>
    props.grupo ? `Membros do grupo: ${props.grupo.nome}` : 'Membros do grupo'
)

const ramaisDisponiveis = computed(() => {
    if (!props.grupo) return []
    const memberIds = new Set(props.grupo.membros ?? [])
    return ramalStore.ramais.filter((r) => !memberIds.has(r.ramal))
})

const membersWithNames = computed(() => {
    if (!props.grupo?.membros?.length) return []
    return props.grupo.membros.map((membroId) => {
        const r = ramalStore.ramais.find((x) => x.ramal === membroId)
        return { ramal: membroId, nome: r?.nome ?? membroId }
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
    if (!ramal || !props.grupo) return
    try {
        await grupoStore.toggleMembro(props.grupo.id, ramal)
        selectedRamalToAdd.value = ''
    } catch {
        // Error handled in store/service
    }
}

async function handleRemoveMember(ramal: string) {
    if (!props.grupo) return
    try {
        await grupoStore.toggleMembro(props.grupo.id, ramal)
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
