import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Kit {
  id: string
  name: string
  description: string
  price: number
  stripe_price_id: string
  category: string
  assets: KitAsset[]
  image_url?: string
  created_at: string
  updated_at: string
}

export interface KitAsset {
  id: string
  name: string
  type: 'text' | 'graphic' | 'template'
  description: string
  content?: any // JSON content for the asset
}

export interface UserKit {
  id: string
  user_id: string
  kit_id: string
  purchased_at: string
  kit?: Kit
}

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

// Database helper functions
export const getKits = async () => {
  const { data, error } = await supabase
    .from('kits')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getKit = async (id: string) => {
  const { data, error } = await supabase
    .from('kits')
    .select('*')
    .eq('id', id)
    .single()
  
  return { data, error }
}

export const getUserKits = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_kits')
    .select(`
      *,
      kit:kits(*)
    `)
    .eq('user_id', userId)
  
  return { data, error }
}

export const addUserKit = async (userId: string, kitId: string) => {
  const { data, error } = await supabase
    .from('user_kits')
    .insert({ user_id: userId, kit_id: kitId })
    .select()
    .single()
  
  return { data, error }
}
