import { create } from 'zustand'
import { getNodes, getHosts } from '../api/servers'

export const useServersStore = create((set) => ({
  nodes: [],
  hosts: [],
  isLoading: false,
  error: null,

  fetchNodes: async () => {
    set({ isLoading: true })
    try {
      const nodes = await getNodes()
      set({ nodes: Array.isArray(nodes) ? nodes : [], isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchHosts: async () => {
    try {
      const hosts = await getHosts()
      set({ hosts: Array.isArray(hosts) ? hosts : [] })
    } catch {
      // hosts are supplementary, don't block UI
    }
  },

  fetchAll: async () => {
    set({ isLoading: true })
    try {
      const [nodes, hosts] = await Promise.all([getNodes(), getHosts()])
      set({
        nodes: Array.isArray(nodes) ? nodes : [],
        hosts: Array.isArray(hosts) ? hosts : [],
        isLoading: false,
      })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))
