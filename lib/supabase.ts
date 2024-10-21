import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://phfbtsfiziufheixrpup.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZmJ0c2Zpeml1ZmhlaXhycHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0NTk3MTMsImV4cCI6MjA0NTAzNTcxM30.bHPn5mOD4oBap_QcqceURhA5Bh4qfYPb8D_cLfAwTAA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})