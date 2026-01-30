import { 
  LayoutDashboard, Home, Phone, PhoneCall, Server, List, Users, Target, Settings, MessageCircle, FileText, BarChart2, PieChart, User, UserCheck, Clipboard, ArrowDown, ArrowUp,
  PhoneIncoming,
  PhoneOutgoing,
} from 'lucide-vue-next'
import type { Component } from "vue"

export interface MenuItem {
  name: string
  route?: string
  icon?: Component
  children?: MenuItem[]
}

export const sidebarItems: MenuItem[] = [
  { name: "Dashboard", route: "/", icon: Home },
  {
    name: "Telefonia",
    icon: Phone,
    children: [
      { name: "Ramais", route: "/telefonia/ramais", icon: PhoneCall },
      { name: "Troncos", route: "/telefonia/troncos", icon: Server },
      { name: "Filas", route: "/telefonia/filas", icon: List },
      { name: "Grupos de Captura", route: "/telefonia/grupos-de-captura", icon: Target },
    ],
  },
  {
    name: "Regras",
    icon: Settings,
    children: [
      { name: "Entrada", route: "/regras/entrada", icon: PhoneIncoming },
      { name: "Saida", route: "/regras/saida", icon: PhoneOutgoing },
      { name: "Ura", route: "/regras/ura", icon: MessageCircle },
    ],
  },
  { name: "Relatórios", route: "/relatorios", icon: BarChart2 },
  {
    name: "Sistema",
    icon: Settings,
    children: [
      { name: "Usuarios", route: "/sistema/usuarios", icon: User },
      { name: "Perfis", route: "/sistema/perfis", icon: Users },
      { name: "Logs", route: "/sistema/logs", icon: FileText },
    ],
  },
]
