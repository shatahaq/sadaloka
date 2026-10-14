import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase } from './supabase'
import { fetchProfile, updateProfile as saveProfile } from '../data/bookings'

/**
 * Akun wisatawan, pemandu & admin lewat Supabase Auth (email + kata sandi).
 * Profil (nama, WhatsApp) ada di tabel profiles — dibuat otomatis saat daftar. Akun menjadi akun
 * pemandu bila admin menghubungkannya (guide_accounts), dan admin bila tercatat di tabel admins.
 */
const AuthContext = createContext(null)

const toUser = (session, profile) => {
  const u = session?.user
  if (!u) return null
  const meta = u.user_metadata ?? {}
  return { id: u.id, email: u.email, name: profile?.name || meta.name || u.email, phone: profile?.phone ?? meta.phone ?? '' }
}

/** Kode galat Supabase → kunci pesan di kamus (auth.err*). */
function authError(error) {
  const code = error?.code ?? ''
  if (code === 'invalid_credentials') return 'invalid'
  if (code === 'email_not_confirmed') return 'unconfirmed'
  if (code === 'user_already_exists' || code === 'email_exists') return 'exists'
  if (code === 'weak_password') return 'weak'
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit') return 'rateLimit'
  if (code === 'email_address_not_authorized') return 'notAuthorized'
  if (code === 'email_address_invalid' || code === 'validation_failed') return 'badEmail'
  return 'failed'
}

export function AuthProvider({ children }) {
  // undefined = sesi belum dibaca (jangan arahkan ke /masuk dulu)
  const [session, setSession] = useState(supabase ? undefined : null)
  // peran & profil akun: { userId, guideId, isAdmin, profile } — userId mencatat untuk akun mana hasil ini dibaca
  const [roles, setRoles] = useState({ userId: null, guideId: null, isAdmin: false, profile: null })
  // true sesaat setelah tombol "Keluar" ditekan → RequireAuth membawa ke beranda, bukan ke /masuk
  const [signedOut, setSignedOut] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const userId = session?.user?.id
  useEffect(() => {
    if (!userId) return
    let alive = true
    Promise.all([supabase.rpc('my_guide_id'), supabase.rpc('is_admin'), fetchProfile(userId).catch(() => null)]).then(([g, a, profile]) => {
      if (alive) setRoles({ userId, guideId: g.data ?? null, isAdmin: a.data === true, profile })
    })
    return () => {
      alive = false
    }
  }, [userId])
  const guideReady = !userId || roles.userId === userId
  const mine = guideReady && userId ? roles : { guideId: null, isAdmin: false, profile: null }

  /** Ganti kata sandi akun yang sedang login. null = berhasil, selain itu kode galat. */
  const changePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) return null
    return error.code === 'same_password' ? 'samePassword' : authError(error)
  }, [])

  /** Ubah nama & WhatsApp di profil sendiri. */
  const updateProfile = useCallback(
    async (fields) => {
      await saveProfile(userId, fields)
      setRoles((r) => (r.userId === userId ? { ...r, profile: { ...r.profile, name: fields.name.trim(), phone: fields.phone.trim() } } : r))
    },
    [userId],
  )

  /** null = berhasil & sudah masuk; 'confirm' = cek email dulu; selain itu kode galat. */
  const register = useCallback(async ({ name, email, phone, password }, redirectPath = '/masuk') => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim(), phone: phone.trim() }, emailRedirectTo: `${window.location.origin}${redirectPath}` },
    })
    if (error) return authError(error)
    if (!data.session) return 'confirm'
    setSignedOut(false)
    return null
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) return authError(error)
    setSignedOut(false)
    return null
  }, [])

  const logout = useCallback(async () => {
    setSignedOut(true)
    await supabase.auth.signOut()
    // setelah RequireAuth sempat mengarahkan ke beranda, kembali normal
    setTimeout(() => setSignedOut(false), 0)
  }, [])

  const value = useMemo(
    () => ({
      ready: session !== undefined,
      user: toUser(session, mine.profile),
      guideId: mine.guideId,
      isAdmin: mine.isAdmin,
      guideReady,
      signedOut,
      register,
      login,
      logout,
      updateProfile,
      changePassword,
    }),
    [session, mine.profile, mine.guideId, mine.isAdmin, guideReady, signedOut, register, login, logout, updateProfile, changePassword],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  return ctx
}

/** Hanya izinkan tujuan internal setelah login (mencegah open redirect). */
export const safeNext = (next, fallback = '/akun') => (next && next.startsWith('/') && !next.startsWith('//') ? next : fallback)
