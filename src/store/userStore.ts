import { create } from 'zustand'
import { supabase, signOut, getUserKits, type UserKit } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

interface UserState {
  user: User | null
  isAuthenticated: boolean
  purchasedKits: UserKit[]
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  loadPurchasedKits: () => Promise<void>
  addPurchasedKit: (kitId: string) => void
  clearError: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  purchasedKits: [],
  loading: false,
  error: null,
  
  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      error: null 
    })
    if (user) {
      get().loadPurchasedKits()
    } else {
      set({ purchasedKits: [] })
    }
  },
  
  logout: async () => {
    set({ loading: true, error: null })
    try {
      const { error } = await signOut()
      if (error) throw error
      set({ 
        user: null, 
        isAuthenticated: false, 
        purchasedKits: [],
        loading: false
      })
    } catch (error) {
      console.error('Error signing out:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to sign out',
        loading: false
      })
    }
  },
  
  checkAuth: async () => {
    set({ loading: true, error: null })
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error && error.message !== 'Invalid JWT') {
        throw error
      }
      get().setUser(user)
    } catch (error) {
      console.error('Error checking auth:', error)
      set({ 
        error: error instanceof Error ? error.message : 'Failed to check authentication',
        user: null,
        isAuthenticated: false
      })
    } finally {
      set({ loading: false })
    }
  },
  
  loadPurchasedKits: async () => {
    const { user } = get()
    if (!user) return
    
    try {
      const { data, error } = await getUserKits(user.id)
      if (error) throw error
      set({ purchasedKits: data || [] })
    } catch (error) {
      console.error('Error loading purchased kits:', error)
      set({ error: error instanceof Error ? error.message : 'Failed to load purchased kits' })
    }
  },
  
  addPurchasedKit: (_kitId: string) => {
    // This will be called after successful purchase
    // Reload purchased kits to get the latest data
    get().loadPurchasedKits()
  },
  
  clearError: () => set({ error: null })
}))

// Initialize auth state on app start
supabase.auth.onAuthStateChange((_event, session) => {
  const { setUser } = useUserStore.getState()
  setUser(session?.user || null)
})
