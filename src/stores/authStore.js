import { create } from 'zustand'
import * as authApi from '../api/auth'
import { setOnUnauthorized } from '../api/client'

function saveTokens(tokens) {
  localStorage.setItem('eifavpn_access', tokens.access)
  localStorage.setItem('eifavpn_refresh', tokens.refresh)
}

function clearTokens() {
  localStorage.removeItem('eifavpn_access')
  localStorage.removeItem('eifavpn_refresh')
}

function hasTokens() {
  return !!localStorage.getItem('eifavpn_access')
}

export const useAuthStore = create((set, get) => {
  // Wire up auto-logout on 401
  setOnUnauthorized(() => {
    clearTokens()
    set({ user: null, isAuthenticated: false })
  })

  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null })
      try {
        const data = await authApi.login({ email, password })
        saveTokens(data.tokens)
        set({ user: data.user, isAuthenticated: true, isLoading: false })
        return true
      } catch (err) {
        set({ error: err.data?.error || err.message, isLoading: false })
        return false
      }
    },

    // Called after OAuth redirect returns with tokens in URL params
    loginWithTokens: async (access, refresh) => {
      saveTokens({ access, refresh })
      set({ isLoading: true })
      try {
        const user = await authApi.getMe()
        set({ user, isAuthenticated: true, isLoading: false })
        return true
      } catch {
        clearTokens()
        set({ isAuthenticated: false, isLoading: false })
        return false
      }
    },

    // Called after Telegram JS SDK returns tokens from POST
    loginWithData: (user, tokens) => {
      saveTokens(tokens)
      set({ user, isAuthenticated: true })
    },

    fetchMe: async () => {
      if (!hasTokens()) {
        set({ isAuthenticated: false })
        return false
      }
      set({ isLoading: true })
      try {
        const user = await authApi.getMe()
        set({ user, isAuthenticated: true, isLoading: false })
        return true
      } catch {
        clearTokens()
        set({ user: null, isAuthenticated: false, isLoading: false })
        return false
      }
    },

    logout: async () => {
      const refresh = localStorage.getItem('eifavpn_refresh')
      await authApi.logout(refresh)
      clearTokens()
      set({ user: null, isAuthenticated: false, error: null })
    },

    clearError: () => set({ error: null }),
  }
})
