import { createClient } from '@supabase/supabase-js'
import { supabase, supabaseKey, supabaseUrl } from '../lib/supabase'

/**
 * Pesanan, akun wisatawan, dan panel admin di Supabase. Aturan akses ada di database
 * (migrasi guide_portal & admin_crud): wisatawan hanya melihat pesanannya, pemandu hanya pesanan
 * yang sudah diteruskan admin, admin mengelola semuanya. Harga/kode/status dihitung server.
 *
 * Alur status: pending (cek admin) → approved (diteruskan ke pemandu) → confirmed / declined,
 * atau cancelled oleh admin; completed setelah perjalanan selesai.
 */
export const BOOKING_STATUSES = ['pending', 'approved', 'confirmed', 'preparing', 'in_progress', 'declined', 'cancelled', 'completed']

const mapBooking = (r) => ({
  id: r.id,
  code: r.code,
  userId: r.user_id,
  slug: r.package_slug,
  guideId: r.guide_id,
  date: r.trip_date,
  pax: r.pax,
  contactName: r.contact_name,
  contactEmail: r.contact_email,
  contactPhone: r.contact_phone,
  notes: r.notes,
  pickup: r.pickup,
  photo: r.photo,
  total: r.total,
  status: r.status,
  guideNote: r.guide_note,
  adminNote: r.admin_note,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
})

const mapEvent = (r) => ({ id: r.id, bookingId: r.booking_id, status: r.status, note: r.note, actor: r.actor, at: r.created_at })

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

/** Pesan galat dari validasi server (RAISE di trigger/fungsi) aman ditampilkan; selain itu pakai pesan umum. */
export const serverMessage = (err, fallback) => (err?.code === 'P0001' && err.message ? err.message : fallback)

// ───────────────────────── wisatawan

/** Buat pesanan. `guideId` diisi hanya bila wisatawan memilih pemandu dari halaman Pemandu. */
export async function createBooking({ slug, guideId, date, pax, name, email, phone, notes, pickup, photo }) {
  const row = unwrap(
    await supabase
      .from('bookings')
      .insert({
        package_slug: slug,
        guide_id: guideId ?? null,
        trip_date: date,
        pax,
        contact_name: name.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim(),
        notes: notes.trim() || null,
        pickup,
        photo,
        total: 0, // dihitung ulang server
      })
      .select()
      .single(),
  )
  return mapBooking(row)
}

/** Pesanan milik wisatawan yang login (bukan pesanan yang ditugaskan kepadanya sebagai pemandu). */
export async function fetchMyBookings(userId) {
  return unwrap(await supabase.from('bookings').select('*').eq('user_id', userId).order('created_at', { ascending: false })).map(mapBooking)
}

/** Satu pesanan milik wisatawan yang login, berdasarkan kodenya (null bila tidak ada / bukan miliknya). */
export async function fetchMyBooking(userId, code) {
  const row = unwrap(await supabase.from('bookings').select('*').eq('user_id', userId).eq('code', code).maybeSingle())
  return row && mapBooking(row)
}

/** Riwayat status untuk beberapa pesanan → { [bookingId]: event[] } (urut waktu). */
export async function fetchEvents(bookingIds) {
  if (!bookingIds.length) return {}
  const rows = unwrap(await supabase.from('booking_events').select('*').in('booking_id', bookingIds).order('created_at'))
  const out = {}
  for (const e of rows.map(mapEvent)) (out[e.bookingId] ??= []).push(e)
  return out
}

export async function fetchProfile(userId) {
  const row = unwrap(await supabase.from('profiles').select('name, phone, email').eq('id', userId).maybeSingle())
  return row && { name: row.name, phone: row.phone, email: row.email }
}

export async function updateProfile(userId, { name, phone }) {
  unwrap(await supabase.from('profiles').update({ name: name.trim(), phone: phone.trim() }).eq('id', userId))
}

/**
 * Pantau perubahan pesanan & riwayatnya secara realtime (hanya baris yang boleh dilihat akun ini).
 * Mengembalikan fungsi untuk berhenti memantau.
 */
export function watchBookings(key, onChange) {
  const channel = supabase
    // nama kanal unik per langganan: StrictMode memasang efek dua kali, kanal lama mungkin belum lepas
    .channel(`bookings-${key}-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, onChange)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'booking_events' }, onChange)
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// ───────────────────────── pemandu

/** Pesanan yang sudah diteruskan admin ke pemandu yang login. */
export async function fetchGuideBookings(guideId) {
  return unwrap(await supabase.from('bookings').select('*').eq('guide_id', guideId).neq('status', 'pending').order('trip_date')).map(mapBooking)
}

export async function respondBooking(id, status, note) {
  return mapBooking(unwrap(await supabase.rpc('respond_booking', { p_booking: id, p_status: status, p_note: note || null })))
}

/** Pemandu memperbarui progres trip yang telah ia terima. */
export async function updateGuideTripStatus(id, status, note) {
  return mapBooking(unwrap(await supabase.rpc('update_guide_trip_status', { p_booking: id, p_status: status, p_note: note || null })))
}

export async function setMyAvailability(available) {
  unwrap(await supabase.rpc('set_my_availability', { p_available: available }))
}

/** Ketersediaan terbaru (data situs dimuat sekali di awal, jadi bisa sudah berubah). */
export async function fetchGuideAvailability(guideId) {
  return unwrap(await supabase.from('guides').select('available').eq('id', guideId).single()).available
}

// ───────────────────────── admin (ditolak database bila akun bukan admin)

export async function fetchAllBookings() {
  return unwrap(await supabase.from('bookings').select('*').order('created_at', { ascending: false })).map(mapBooking)
}

/** Catat pesanan baru (mis. dari WhatsApp) tanpa akun wisatawan. */
export async function adminCreateBooking({ slug, guideId, date, pax, name, email, phone, notes, pickup, photo, status, adminNote }) {
  const row = unwrap(
    await supabase
      .from('bookings')
      .insert({
        user_id: null,
        package_slug: slug,
        guide_id: guideId || null,
        trip_date: date,
        pax,
        contact_name: name.trim(),
        contact_email: email.trim(),
        contact_phone: phone.trim(),
        notes: notes.trim() || null,
        pickup,
        photo,
        status,
        admin_note: adminNote.trim() || null,
        total: 0,
      })
      .select()
      .single(),
  )
  return mapBooking(row)
}

/** Ubah pesanan. Total dihitung ulang server bila paket/peserta/tambahan berubah. */
export async function adminUpdateBooking(id, b) {
  const row = unwrap(
    await supabase
      .from('bookings')
      .update({
        package_slug: b.slug,
        guide_id: b.guideId || null,
        trip_date: b.date,
        pax: b.pax,
        contact_name: b.contactName.trim(),
        contact_email: b.contactEmail.trim(),
        contact_phone: b.contactPhone.trim(),
        notes: b.notes?.trim() || null,
        pickup: b.pickup,
        photo: b.photo,
        status: b.status,
        admin_note: b.adminNote?.trim() || null,
      })
      .eq('id', id)
      .select()
      .single(),
  )
  return mapBooking(row)
}

export async function adminDeleteBooking(id) {
  unwrap(await supabase.from('bookings').delete().eq('id', id))
}

export async function fetchProfiles() {
  return unwrap(await supabase.from('profiles').select('*').order('created_at', { ascending: false })).map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone,
    email: r.email,
    createdAt: r.created_at,
  }))
}

/** Akun pemandu yang sudah terhubung, beserta email akunnya. */
export async function fetchGuideAccounts() {
  const links = unwrap(await supabase.from('guide_accounts').select('guide_id, user_id, created_at').order('guide_id'))
  const ids = links.map((l) => l.user_id)
  const profiles = ids.length ? unwrap(await supabase.from('profiles').select('id, email, name').in('id', ids)) : []
  const byId = Object.fromEntries(profiles.map((p) => [p.id, p]))
  return links.map((l) => ({ guideId: l.guide_id, userId: l.user_id, email: byId[l.user_id]?.email ?? '', linkedAt: l.created_at }))
}

/**
 * Buat akun pemandu (email + kata sandi awal) lalu hubungkan ke profilnya.
 * Pendaftaran memakai klien terpisah tanpa penyimpanan sesi, jadi sesi admin tidak tertimpa.
 * Bila email sudah terdaftar, akun yang ada itulah yang dihubungkan. → { created: boolean }
 */
export async function adminCreateGuideAccount(guideId, name, email, password) {
  const temp = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: 'sadaloka-admin-signup' },
  })
  const { data, error } = await temp.auth.signUp({ email: email.trim(), password, options: { data: { name, phone: '' } } })
  const exists = error && (error.code === 'user_already_exists' || error.code === 'email_exists')
  if (error && !exists) throw error
  if (data?.session) await temp.auth.signOut() // sesi akun baru tidak dipakai di sini
  await adminLinkGuide(guideId, email)
  return { created: !exists }
}

export async function adminLinkGuide(guideId, email) {
  unwrap(await supabase.rpc('admin_link_guide', { p_guide_id: guideId, p_email: email.trim() }))
}

export async function adminUnlinkGuide(guideId) {
  unwrap(await supabase.from('guide_accounts').delete().eq('guide_id', guideId))
}
