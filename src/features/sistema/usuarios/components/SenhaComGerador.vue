<template>
    <div class="senha-com-gerador">
        <el-input
            :model-value="modelValue"
            type="password"
            :placeholder="placeholder"
            show-password
            class="senha-input"
            @update:model-value="emit('update:modelValue', $event)"
        />
        <el-button type="default" @click="gerarSenha">
            Gerar senha
        </el-button>
    </div>
</template>

<script setup lang="ts">
/**
 * Gera senha conforme o decorator PasswordValidator da API:
 * /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,20}$/
 * - 8 a 20 caracteres
 * - Pelo menos uma minúscula, uma maiúscula, um número e um especial (@$!%*?&)
 * - Apenas A-Za-z, dígitos e @$!%*?&#
 */
const props = defineProps<{
    modelValue: string
    placeholder?: string
}>()

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const MAIUSCULAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const MINUSCULAS = 'abcdefghijklmnopqrstuvwxyz'
const NUMEROS = '0123456789'
const ESPECIAIS = '@$!%*?&#'
const POOL_PERMITIDO = MAIUSCULAS + MINUSCULAS + NUMEROS + ESPECIAIS

function shuffle(str: string): string {
  const arr = str.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr.join('')
}

function gerarSenha(): void {
  const tamanho = 8 + Math.floor(Math.random() * 13) // 8 a 20
  const garantidos = [
    MAIUSCULAS[Math.floor(Math.random() * MAIUSCULAS.length)]!,
    MINUSCULAS[Math.floor(Math.random() * MINUSCULAS.length)]!,
    NUMEROS[Math.floor(Math.random() * NUMEROS.length)]!,
    ESPECIAIS[Math.floor(Math.random() * ESPECIAIS.length)]!
  ]
  let senha = garantidos.join('')
  for (let i = 4; i < tamanho; i++) {
    senha += POOL_PERMITIDO[Math.floor(Math.random() * POOL_PERMITIDO.length)]
  }
  emit('update:modelValue', shuffle(senha))
}
</script>

<style scoped>
.senha-com-gerador {
  display: flex;
  gap: 10px;
  width: 100%;
}

.senha-input {
  flex: 1;
}
</style>
