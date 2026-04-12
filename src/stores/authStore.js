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
  setOnUnauthorized(() => {
    clearTokens()
    set({ user: null, isAuthenticated: false, isLoading: false, initialized: true })
  })

  return {
    user: null,
    // Start loading if tokens exist — prevents flash redirect to login
    isLoading: hasTokens(),
    isAuthenticated: false,
    initialized: !hasTokens(),
    error: null,

    login: async ({ email, password }) => {
      set({ isLoading: true, error: null })
      try {
        const data = await authApi.login({ email, password })
        saveTokens(data.tokens)
        set({ user: data.user, isAuthenticated: true, isLoading: false, initialized: true })
        return true
      } catch (err) {
        set({ error: err.data?.error || err.message, isLoading: false })
        return false
      }
    },

    loginWithTokens: async (access, refresh) => {
      saveTokens({ access, refresh })
      set({ isLoading: true })
      try {
        const user = await authApi.getMe()
        set({ user, isAuthenticated: true, isLoading: false, initialized: true })
        return true
      } catch {
        clearTokens()
        set({ isAuthenticated: false, isLoading: false, initialized: true })
        return false
      }
    },

    loginWithData: (user, tokens) => {
      saveTokens(tokens)
      set({ user, isAuthenticated: true, initialized: true })
    },

    fetchMe: async () => {
      if (!hasTokens()) {
        set({ isAuthenticated: false, isLoading: false, initialized: true })
        return false
      }
      set({ isLoading: true })
      try {
        const user = await authApi.getMe()
        set({ user, isAuthenticated: true, isLoading: false, initialized: true })
        return true
      } catch {
        // Don't clear tokens here — apiFetch already tried refresh
        // Only clear if refresh also failed (onUnauthorized handles that)
        set({ user: null, isAuthenticated: false, isLoading: false, initialized: true })
        return false
      }
    },

    logout: async () => {
      const refresh = localStorage.getItem('eifavpn_refresh')
      await authApi.logout(refresh)
      clearTokens()
      set({ user: null, isAuthenticated: false, error: null, initialized: true })
    },

    clearError: () => set({ error: null }),
  }
})
