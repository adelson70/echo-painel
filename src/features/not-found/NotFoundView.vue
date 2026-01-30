<template>
    <div class="page-not-found">
        <div class="content">
            <h1>404</h1>
            <h2>Oops, esta página não existe</h2>
            <el-button type="primary" size="large" @click="goHome">
                Voltar para a página inicial
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElButton } from 'element-plus'

const router = useRouter()

function goHome() {
    router.push('/')
}
</script>

<style scoped>
.page-not-found {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--el-bg-color-page);
    text-align: center;
    padding: 16px;
}

.content h1 {
    font-size: 6rem;
    margin: 0;
    color: var(--el-text-color-primary);
}

.content h2 {
    font-size: 1.8rem;
    margin: 8px 0 24px;
    color: var(--el-text-color-secondary);
}

/* Responsividade */
@media (max-width: 600px) {
    .content h1 {
        font-size: 4rem;
    }

    .content h2 {
        font-size: 1.4rem;
    }

    .icon-404 {
        font-size: 4rem;
    }
}
</style>
