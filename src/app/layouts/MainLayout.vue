<template>
  <el-container style="height: 100vh">
    <!-- Sidebar -->
    <el-aside width="240px">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        class="sidebar-menu"
        @select="handleSelect"
        @open="handleOpen"
        @close="handleClose"
      >
        <template v-for="item in sidebarItems" :key="item.name">
          <!-- Submenu -->
          <el-sub-menu
            v-if="item.children"
            :index="item.name"
            :class="{ 'sidebar-submenu-parent-active': activeParentName === item.name }"
          >
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
import { ref, computed } from "vue"
import { sidebarItems } from "@/constants/sidebar"
import type { MenuItem } from "@/constants/sidebar"
import { useRouter, useRoute } from "vue-router"
import { LogOut } from "lucide-vue-next"
import { useThemeStore } from "@/app/stores/theme.store"
import { useAuthStore } from "../stores/auth.store"

const SIDEBAR_OPENEDS_KEY = "sidebar-openeds"

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)
const activeParentName = computed(() => getParentNameByPath(route.path))

function getParentNameByPath(path: string): string | null {
  for (const item of sidebarItems) {
    if (item.children?.some((child: MenuItem) => child.route === path)) {
      return item.name
    }
  }
  return null
}

function getStoredOpeneds(): string[] {
  try {
    const raw = localStorage.getItem(SIDEBAR_OPENEDS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : []
  } catch {
    return []
  }
}

function getInitialOpeneds(): string[] {
  const stored = getStoredOpeneds()
  const parent = getParentNameByPath(route.path)
  if (parent && !stored.includes(parent)) {
    return [...stored, parent]
  }
  return stored
}

const defaultOpeneds = ref<string[]>(getInitialOpeneds())

function persistOpeneds(openeds: string[]) {
  localStorage.setItem(SIDEBAR_OPENEDS_KEY, JSON.stringify(openeds))
}

function handleOpen(index: string) {
  const current = getStoredOpeneds()
  if (!current.includes(index)) {
    persistOpeneds([...current, index])
  }
}

function handleClose(index: string) {
  const current = getStoredOpeneds().filter((x) => x !== index)
  persistOpeneds(current)
}

function handleSelect(index: string) {
  router.push(index)
}

async function logout() {
  await authStore.logout()
  router.push({ name: "Login" })
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

/* Pai com mesma cor de seleção quando o filho está ativo */
.sidebar-menu :deep(.sidebar-submenu-parent-active > .el-sub-menu__title) {
  color: var(--el-menu-active-color) !important;
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
