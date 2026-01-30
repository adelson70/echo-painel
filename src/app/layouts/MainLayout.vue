<template>
  <div class="layout">
    <aside class="sidebar">
      SIDEBAR
    </aside>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  background: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
}

.content {
  flex: 1;
  padding: 16px;
}
</style>
