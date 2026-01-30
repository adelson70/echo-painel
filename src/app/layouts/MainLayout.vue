<template>
  <el-container style="height: 100vh">
    <!-- Sidebar -->
    <el-aside width="240px">
      <el-menu :default-active="activeMenu" class="sidebar-menu" @select="handleSelect">
        <template v-for="item in sidebarItems" :key="item.name">
          <!-- Submenu -->
          <el-sub-menu v-if="item.children" :index="item.name">
            <template #title>
              <el-icon v-if="item.icon">
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.name }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.name" :index="child.route">
              <el-icon v-if="child.icon">
                <component :is="child.icon" />
              </el-icon>
              <span>{{ child.name }}</span>
            </el-menu-item>
          </el-sub-menu>

          <!-- Menu normal -->
          <el-menu-item v-else :index="item.route">
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </el-menu-item>
        </template>
      </el-menu>
      <!-- Rodapé fixo -->
      <div class="sidebar-footer">
        <!-- Switch de tema -->
        <el-switch class="switch-theme" v-model="themeStore.isDark" active-text="Escuro"
          inactive-text="Claro" />

        <!-- Botão de logout -->
        <el-button type="danger" :icon="LogOut" @click="logout" class="logout-btn">
          Sair
        </el-button>
      </div>
    </el-aside>

    <!-- Conteúdo principal -->
    <el-container>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { sidebarItems } from "@/constants/sidebar"
import { useRouter } from "vue-router"
import { LogOut } from "lucide-vue-next"
import { useThemeStore } from "@/app/stores/theme.store"

const activeMenu = ref("/dashboard")
const router = useRouter()
const themeStore = useThemeStore()

function handleSelect(index: string) {
  activeMenu.value = index
  router.push(index)
}

function logout() {
  // Lógica de logout aqui
  console.log("Logout clicked")
}

</script>

<style scoped>
.el-aside {
  position: relative;
  /* necessário para posicionamento absoluto do rodapé */
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Menu ocupa o espaço restante, mas com padding para o rodapé */
.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px;
  /* altura do rodapé */
  border-right: none;
}

/* Rodapé fixo */
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color);
}

/* switch de tema cheio tamanho */
.switch-theme {
  width: 100%;
  justify-content: center;
}

/* botão de logout cheio tamanho */
.logout-btn {
  width: 100%;
}
</style>
