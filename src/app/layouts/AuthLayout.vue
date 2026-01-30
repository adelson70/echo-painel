<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-color-page);
}
</style>
