import { create } from 'zustand'
import { getUserByShortUuid, getUserByEmail, getUser } from '../api/users'

const STORAGE_KEY = 'eifavpn_session'

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY)
}

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  loginByShortUuid: async (shortUuid) => {
    set({ isLoading: true, error: null })
    try {
      const user = await getUserByShortUuid(shortUuid)
      saveSession({ shortUuid, uuid: user.uuid })
      set({ user, isAuthenticated: true, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.message, isLoading: false })
      return false
    }
  },

  loginByEmail: async (email) => {
    set({ isLoading: true, error: null })
    try {
      const user = await getUserByEmail(email)
      saveSession({ shortUuid: user.shortUuid, uuid: user.uuid })
      set({ user, isAuthenticated: true, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.message, isLoading: false })
      return false
    }
  },

  refresh: async () => {
    const session = loadSession()
    if (!session?.uuid) {
      set({ isAuthenticated: false })
      return
    }
    set({ isLoading: true })
    try {
      const user = await getUser(session.uuid)
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      clearSession()
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  restoreSession: async () => {
    const session = loadSession()
    if (!session?.uuid) {
      set({ isAuthenticated: false })
      return false
    }
    set({ isLoading: true })
    try {
      const user = await getUser(session.uuid)
      set({ user, isAuthenticated: true, isLoading: false })
      return true
    } catch {
      clearSession()
      set({ user: null, isAuthenticated: false, isLoading: false })
      return false
    }
  },

  logout: () => {
    clearSession()
    set({ user: null, isAuthenticated: false, error: null })
  },

  clearError: () => set({ error: null }),
}))
