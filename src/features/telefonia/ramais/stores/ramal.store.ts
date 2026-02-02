import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ListRamais,
  CreateRamal,
  CreateLoteRamal,
  UpdateRamal,
  DeleteRamal,
  type RamalDto,
  type CreateRamalDto,
  type CreateLoteRamalDto,
  type UpdateRamalDto
} from '@/features/telefonia/ramais/services/ramal.service'

export const useRamalStore = defineStore('ramal', () => {
  const ramais = ref<RamalDto[]>([])
  const loading = ref(false)
  const searchQuery = ref('')

const filteredRamais = computed(() => {
    if (!searchQuery.value) return ramais.value

    const query = searchQuery.value.toString().toLowerCase()

    return ramais.value.filter(ramal => {
        const nome = (ramal.nome || '').toString().toLowerCase()
        const numero = (ramal.ramal || '').toString()

        return nome.includes(query) || numero.includes(query)
    })
  })

  async function fetchRamais() {
    loading.value = true
    try {
      const fetched = await ListRamais()
      const statuses = ['ativo', 'em uso', 'chamando', 'tocando', 'offline']
      ramais.value = fetched.map((r, index) => ({ ...r, status: statuses[index % statuses.length] })) // mock status
    } catch (error) {
      ElMessage.error('Erro ao carregar ramais.')
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  async function createRamal(data: CreateRamalDto) {
    try {
      const newRamal = await CreateRamal(data)
      ramais.value.push({ ...newRamal, status: 'ativo', dod: newRamal.dod ?? null })
      ElMessage.success('Ramal criado com sucesso.')
    } catch (error) {
      throw error
    }
  }

  async function createLoteRamal(data: CreateLoteRamalDto) {
    try {
      const newRamais = await CreateLoteRamal(data)
      ramais.value.push(...newRamais.map(r => ({ ...r, status: 'ativo', dod: r.dod ?? null })))
      ElMessage.success('Lote de ramais criado com sucesso.')
    } catch (error) {
      throw error
    }
  }

  async function updateRamal(ramalId: string, data: UpdateRamalDto) {
    try {
      const updated = await UpdateRamal(ramalId, data)
      const index = ramais.value.findIndex(r => r.ramal === ramalId)
      if (index !== -1) {
        const current = ramais.value[index]!
        ramais.value[index] = {
          ramal: current.ramal,
          nome: updated.nome ?? current.nome,
          senha: updated.senha ?? current.senha,
          regraSaida: updated.regraSaida ?? current.regraSaida,
          maximoContatos: updated.maximoContatos ?? current.maximoContatos,
          dod: updated.dod ?? current.dod,
          status: current.status
        }
      }
      ElMessage.success('Ramal atualizado com sucesso.')
    } catch (error) {
      throw error
    }
  }

  async function deleteRamal(ramalId: string) {
    try {
      await DeleteRamal(ramalId)
      ramais.value = ramais.value.filter(r => r.ramal !== ramalId)
      ElMessage.success('Ramal deletado com sucesso.')
    } catch (error) {
      throw error
    }
  }

  return {
    ramais,
    loading,
    searchQuery,
    filteredRamais,
    fetchRamais,
    createRamal,
    createLoteRamal,
    updateRamal,
    deleteRamal
  }
})