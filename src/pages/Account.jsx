import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, KeyRound, LogOut, Mail, MessageSquareQuote, Pencil, Phone, Users } from 'lucide-react'
import { useData } from '../data'
import { fetchEvents, fetchMyBookings, watchBookings } from '../data/bookings'
import { cn, rupiah } from '../lib/format'
import { bookingStatusCls } from '../lib/constants'
import { useI18n } from '../i18n'
import { useAuth } from '../lib/auth'
import { Button, Eyebrow, Monogram } from '../components/ui'

const inputCls = 'mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-bone px-4 text-[15px] focus:border-forest-900 focus:outline-none'

/** Nama & WhatsApp — tampil, atau form ubah. */
function ProfileCard() {
  const { user, updateProfile } = useAuth()
  const { t } = useI18n()
  const k = (key, vars) => t(`account.${key}`, vars)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const start = () => {
    setForm({ name: user.name, phone: user.phone })
    setError('')
    setEditing(true)
  }
  const save = async (e) => {
    e.preventDefault()
    if (form.name.trim().length < 3) return setError(t('checkout.errName'))
    if (form.phone.replace(/\D/g, '').length < 9) return setError(t('checkout.errPhone'))
    setSaving(true)
    try {
      await updateProfile(form)
      setEditing(false)
    } catch {
      setError(k('saveError'))
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <form onSubmit={save} className="mt-8 rounded-2xl bg-bone p-5 ring-1 ring-line sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="text-[13px] font-medium">{t('checkout.name')}</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} autoComplete="name" /></label>
          <label className="block"><span className="text-[13px] font-medium">{t('checkout.phone')}</span>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputCls} autoComplete="tel" /></label>
        </div>
        {error && <p role="alert" className="mt-3 text-[13px] text-clay-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>{k('cancel')}</Button>
          <Button type="submit" variant="dark" disabled={saving}>{k(saving ? 'saving' : 'save')}</Button>
        </div>
      </form>
    )
  }
  return (
    <div className="mt-8 grid gap-px overflow-hidden rounded-2xl bg-line ring-1 ring-line sm:grid-cols-[1fr_1fr_auto]">
      <p className="flex items-center gap-3 bg-bone p-5 text-[14.5px]"><Mail className="size-4 text-moss-600" />{user.email}</p>
      <p className="flex items-center gap-3 bg-bone p-5 text-[14.5px]"><Phone className="size-4 text-moss-600" />{user.phone || '—'}</p>
      <button type="button" onClick={start} className="flex items-center justify-center gap-2 bg-bone px-5 py-4 text-[14px] font-medium hover:bg-paper">
        <Pencil className="size-4" />{k('editProfile')}
      </button>
    </div>
  )
}

/** Ganti kata sandi (penting untuk akun pemandu yang kata sandi awalnya dibuat admin). */
function PasswordCard() {
  const { changePassword } = useAuth()
  const { t } = useI18n()
  const k = (key, vars) => t(`account.${key}`, vars)
  const [open, setOpen] = useState(false)
  const [pw, setPw] = useState({ next: '', again: '' })
  const [msg, setMsg] = useState(null) // { ok, text }
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    if (pw.next.length < 8) return setMsg({ ok: false, text: k('pwShort') })
    if (pw.next !== pw.again) return setMsg({ ok: false, text: k('pwMismatch') })
    setSaving(true)
    const err = await changePassword(pw.next)
    setSaving(false)
    if (err) return setMsg({ ok: false, text: err === 'samePassword' ? k('pwSame') : t(`auth.${err === 'weak' ? 'errWeak' : 'errFailed'}`) })
    setPw({ next: '', again: '' })
    setOpen(false)
    setMsg({ ok: true, text: k('pwChanged') })
  }

  return (
    <div id="sandi" className="mt-4 scroll-mt-24 rounded-2xl bg-bone p-5 ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[14.5px] font-medium"><KeyRound className="size-4 text-moss-600" />{k('password')}</p>
        {!open && <Button variant="outline" size="sm" onClick={() => { setOpen(true); setMsg(null) }}>{k('changePassword')}</Button>}
      </div>
      {open && (
        <form onSubmit={save} className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="text-[13px] font-medium">{k('newPassword')}</span>
            <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputCls} autoComplete="new-password" /></label>
          <label className="block"><span className="text-[13px] font-medium">{k('repeatPassword')}</span>
            <input type="password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} className={inputCls} autoComplete="new-password" /></label>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button type="button" variant="ghost" onClick={() => { setOpen(false); setMsg(null) }}>{k('cancel')}</Button>
            <Button type="submit" variant="dark" disabled={saving}>{k(saving ? 'saving' : 'save')}</Button>
          </div>
        </form>
      )}
      {msg && <p role={msg.ok ? 'status' : 'alert'} className={cn('mt-3 text-[13px]', msg.ok ? 'text-moss-600' : 'text-clay-600')}>{msg.text}</p>}
    </div>
  )
}

/** Halaman akun wisatawan: profil, pesanan (realtime) beserta riwayat statusnya, dan tombol keluar. */
export default function Account() {
  const { user, guideId, isAdmin, logout } = useAuth()
  const { packageBySlug, guideById, corridorBySlug } = useData()
  const { t, tr, fmtDate, people } = useI18n()
  const k = (key, vars) => t(`account.${key}`, vars)
  const [state, setState] = useState({ status: 'loading', bookings: [], events: {} })

  const load = useCallback(async () => {
    try {
      const bookings = await fetchMyBookings(user.id)
      const events = await fetchEvents(bookings.map((b) => b.id))
      setState({ status: 'ready', bookings, events })
    } catch {
      setState((s) => (s.status === 'ready' ? s : { status: 'error', bookings: [], events: {} }))
    }
  }, [user.id])

  // muat sekali, lalu muat ulang setiap kali admin/pemandu mengubah pesanan
  useEffect(() => {
    load()
    const stopWatching = watchBookings(`traveler-${user.id}`, load)
    // Realtime memberi pembaruan seketika. Interval ini adalah fallback untuk koneksi
    // yang memblokir WebSocket (atau tab yang sempat tertidur), agar jawaban pemandu
    // tetap terlihat tanpa wisatawan harus memuat ulang halaman.
    const refreshTimer = window.setInterval(load, 15_000)
    return () => {
      stopWatching()
      window.clearInterval(refreshTimer)
    }
  }, [load, user.id])

  const { bookings, events } = state

  return (
    <section className="min-h-screen bg-paper pb-20 pt-[72px]">
      <div className="container-x max-w-4xl pt-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Monogram name={user.name} size="lg" />
            <div>
              <Eyebrow>{k('eyebrow')}</Eyebrow>
              <h1 className="mt-2 font-display text-[36px] leading-tight sm:text-[44px]">{k('hello', { name: user.name.split(' ')[0] })}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && <Button to="/admin" variant="dark">{t('nav.admin')}</Button>}
            {guideId && <Button to="/portal-pemandu" variant="dark">{t('nav.guidePortal')}</Button>}
            <Button variant="outline" onClick={logout}><LogOut className="size-4" />{t('nav.logout')}</Button>
          </div>
        </div>

        <ProfileCard />
        <PasswordCard />

        <div className="mt-14 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-[28px] leading-tight sm:text-[32px]">{k('trips')}</h2>
          <p className="inline-flex items-center gap-2 text-[12.5px] text-muted"><span className="size-1.5 animate-pulse rounded-full bg-moss-500" />{k('live')}</p>
        </div>
        {state.status === 'loading' ? (
          <p className="mt-6 text-ink-soft" role="status">{t('data.loading')}</p>
        ) : state.status === 'error' ? (
          <p className="mt-6 rounded-xl bg-clay-100 px-4 py-3 text-[14px] text-clay-600" role="alert">{k('loadError')}</p>
        ) : bookings.length === 0 ? (
          <div className="mt-6 rounded-[var(--radius-card)] bg-bone p-8 text-center ring-1 ring-line">
            <p className="text-ink-soft">{k('empty')}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button to="/paket" variant="dark">{k('browsePackages')}</Button>
              <Button to="/guide" variant="outline">{k('browseGuides')}</Button>
            </div>
          </div>
        ) : (
          <ul className="mt-6 space-y-4">
            {bookings.map((b) => {
              const pkg = packageBySlug[b.slug]
              const c = pkg && corridorBySlug[pkg.corridor]
              const g = guideById[b.guideId]
              const history = events[b.id] ?? []
              const latestNote = [...history].reverse().find((e) => e.note)
              return (
                <li key={b.id}>
                  <Link
                    to={`/akun/pesanan/${b.code}`}
                    className="group grid overflow-hidden rounded-[var(--radius-card)] bg-bone ring-1 ring-line transition-shadow hover:shadow-[0_18px_40px_-20px_rgb(22_26_20/0.35)] sm:grid-cols-[180px_1fr]"
                  >
                    {pkg && <img src={pkg.image ?? c.imageSm ?? c.image} alt="" className="h-40 w-full object-cover sm:h-full" />}
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-mono text-[11.5px] tracking-[0.12em] text-muted">{b.code}</p>
                        <span className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-medium', bookingStatusCls[b.status])}>{k(`status.${b.status}`)}</span>
                      </div>
                      <p className="mt-1 font-display text-[24px] leading-tight">{pkg ? tr(pkg.title) : b.slug}</p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[13.5px] text-ink-soft">
                        <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4" />{fmtDate(b.date)}</span>
                        <span className="inline-flex items-center gap-1.5"><Users className="size-4" />{people(b.pax)}</span>
                      </div>
                      {latestNote && (
                        <p className="mt-3 flex gap-2 rounded-xl bg-paper px-3.5 py-2.5 text-[13.5px] text-ink-soft">
                          <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-moss-600" />
                          <span><span className="font-medium text-ink">{t(`account.actor.${latestNote.actor}`)}:</span> {latestNote.note}</span>
                        </p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                        {g ? (
                          <span className="flex items-center gap-3">
                            <Monogram name={g.name} src={g.photo} size="sm" />
                            <span className="text-[13.5px]"><span className="block text-muted">{k('guidedBy')}</span><span className="font-medium">{g.name}</span></span>
                          </span>
                        ) : <span />}
                        <p className="text-[17px] font-semibold">{rupiah(b.total)}</p>
                      </div>
                      <p className="mt-3 inline-flex items-center gap-1 text-[13px] font-medium text-moss-600">
                        {k('viewTrip')} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}
