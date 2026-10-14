import { createClient } from '@supabase/supabase-js'

const configuredUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const isHttpUrl = (value) => {
  try {
    const { protocol, hostname } = new URL(value)
    return (protocol === 'https:' || protocol === 'http:') && Boolean(hostname)
  } catch {
    return false
  }
}

// Jangan biarkan konfigurasi environment deploy yang salah membuat seluruh aplikasi crash.
// DataProvider akan menampilkan pesan konfigurasi bila nilainya belum valid.
export const supabaseUrl = isHttpUrl(configuredUrl) ? configuredUrl : null
export const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

/** null bila .env.local belum diisi — DataProvider menampilkan pesan yang jelas. Sesi login disimpan di browser. */
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null
