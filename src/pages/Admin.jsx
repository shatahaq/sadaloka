import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarDays, Check, Copy, Pencil, Plus, RefreshCw, Search, ShieldAlert, Trash2, Unlink, UserPlus, Users, X } from 'lucide-react'
import { useData } from '../data'
import {
  BOOKING_STATUSES,
  adminCreateBooking,
  adminDeleteBooking,
  adminCreateGuideAccount,
  adminUnlinkGuide,
  adminUpdateBooking,
  fetchAllBookings,
  fetchGuideAccounts,
  fetchProfiles,
  serverMessage,
  watchBookings,
} from '../data/bookings'
import { cn, rupiah, todayISO } from '../lib/format'
import { bookingStatusCls } from '../lib/constants'
import { useI18n } from '../i18n'
import { useAuth } from '../lib/auth'
import { Button, Chip, Eyebrow, Monogram } from '../components/ui'

/** 'Vina Kahmila Saragih' → vina.saragih@sadaloka.id (pola yang sama dengan akun pemandu awal). */
const suggestEmail = (name) => {
  const parts = name.normalize('NFKD').replace(/[^\x00-\x7f]/g, '').toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter(Boolean)
  return `${parts.length > 1 ? `${parts[0]}.${parts.at(-1)}` : parts[0]}@sadaloka.id`
}

/** Kata sandi awal acak, mis. Sdl-Kp7x-m3Qa-9Rtz (tanpa huruf/angka yang mirip). */
const newPassword = () => {
  const abc = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(12))
  const chars = [...bytes].map((b) => abc[b % abc.length]).join('')
  return `Sdl-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`
}

const inputCls = 'mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-bone px-3.5 text-[14.5px] focus:border-forest-900 focus:outline-none'

function Field({ label, children, className = '' }) {
  return (
    <label className={cn('block', className)}>
      <span className="text-[12.5px] font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  )
}

/** Tombol hapus dua langkah: klik pertama minta konfirmasi. */
function ConfirmButton({ label, confirmLabel, onConfirm, icon: Icon = Trash2 }) {
  const { t } = useI18n()
  const [asking, setAsking] = useState(false)
  const [busy, setBusy] = useState(false)
  if (!asking) {
    return <Button variant="ghost" size="sm" className="text-clay-600" onClick={() => setAsking(true)}><Icon className="size-4" />{label}</Button>
  }
  return (
    <span className="inline-flex items-center gap-1">
      <Button variant="primary" size="sm" disabled={busy} onClick={async () => { setBusy(true); try { await onConfirm() } finally { setBusy(false); setAsking(false) } }}>{confirmLabel}</Button>
      <Button variant="ghost" size="sm" onClick={() => setAsking(false)} aria-label={t('account.cancel')}><X className="size-4" /></Button>
    </span>
  )
}

/** Dialog sederhana (Escape / klik latar menutup). */
function Modal({ title, onClose, children }) {
  const { t } = useI18n()
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-forest-950/50 p-4 sm:p-8" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-2xl rounded-[var(--radius-card)] bg-paper shadow-2xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-[24px]">{title}</h2>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-ink/5" aria-label={t('admin.close')}><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

const emptyForm = (packages) => ({
  slug: packages[0]?.slug ?? '',
  guideId: '',
  date: todayISO(7),
  pax: packages[0]?.group[0] ?? 1,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  notes: '',
  pickup: false,
  photo: false,
  status: 'pending',
  adminNote: '',
})

/** Form tambah / ubah pesanan. `booking` null = pesanan baru. */
function BookingForm({ booking, onClose, onSaved }) {
  const { packages, packageBySlug, guides, corridorBySlug } = useData()
  const { t, tr } = useI18n()
  const k = (key, vars) => t(`admin.${key}`, vars)
  const [f, setF] = useState(() => (booking ? { ...booking, notes: booking.notes ?? '', adminNote: booking.adminNote ?? '', guideId: booking.guideId ?? '' } : emptyForm(packages)))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const set = (field) => (e) => setF({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const pkg = packageBySlug[f.slug]
  const crew = pkg ? guides.filter((g) => g.corridors.includes(pkg.corridor)) : []
  const statuses = booking ? BOOKING_STATUSES : ['pending', 'approved']

  const save = async (e) => {
    e.preventDefault()
    if (f.contactName.trim().length < 3) return setError(t('checkout.errName'))
    if (!/^\S+@\S+\.\S+$/.test(f.contactEmail)) return setError(t('checkout.errEmail'))
    if (f.contactPhone.replace(/\D/g, '').length < 9) return setError(t('checkout.errPhone'))
    setSaving(true)
    setError('')
    const data = { ...f, pax: Number(f.pax) }
    try {
      const saved = booking
        ? await adminUpdateBooking(booking.id, data)
        : await adminCreateBooking({ ...data, name: f.contactName, email: f.contactEmail, phone: f.contactPhone })
      onSaved(saved)
    } catch (err) {
      setError(serverMessage(err, k('saveError')))
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} noValidate>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <Field label={k('fPackage')} className="sm:col-span-2">
          <select value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value, guideId: '' })} className={inputCls}>
            {packages.map((p) => <option key={p.slug} value={p.slug}>{tr(corridorBySlug[p.corridor].name)} — {tr(p.title)}</option>)}
          </select>
        </Field>
        <Field label={k('fGuide')} className="sm:col-span-2">
          <select value={f.guideId} onChange={set('guideId')} className={inputCls}>
            <option value="">{k('fGuideDefault', { name: pkg?.guide?.name ?? '—' })}</option>
            {crew.map((g) => <option key={g.id} value={g.id}>{g.name}{g.available ? '' : ` (${t('guides.full')})`}</option>)}
          </select>
        </Field>
        <Field label={k('fDate')}><input type="date" value={f.date} onChange={set('date')} className={inputCls} /></Field>
        <Field label={pkg ? k('fPax', { a: pkg.group[0], b: pkg.group[1] }) : k('fPax', { a: 1, b: '…' })}>
          <input type="number" min={pkg?.group[0] ?? 1} max={pkg?.group[1]} value={f.pax} onChange={set('pax')} className={inputCls} />
        </Field>
        <Field label={t('checkout.name')}><input value={f.contactName} onChange={set('contactName')} className={inputCls} /></Field>
        <Field label={t('checkout.phone')}><input type="tel" value={f.contactPhone} onChange={set('contactPhone')} className={inputCls} /></Field>
        <Field label={t('checkout.email')} className="sm:col-span-2"><input type="email" value={f.contactEmail} onChange={set('contactEmail')} className={inputCls} /></Field>
        <Field label={t('checkout.notes')} className="sm:col-span-2">
          <textarea rows={2} value={f.notes} onChange={set('notes')} className={cn(inputCls, 'h-auto py-2.5')} />
        </Field>
        <div className="flex flex-wrap gap-5 sm:col-span-2">
          <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" checked={f.pickup} onChange={set('pickup')} className="size-4 accent-[var(--color-moss-600)]" />{t('checkout.pickup')}</label>
          <label className="flex items-center gap-2 text-[14px]"><input type="checkbox" checked={f.photo} onChange={set('photo')} className="size-4 accent-[var(--color-moss-600)]" />{t('checkout.photo')}</label>
        </div>
        <Field label={k('fStatus')}>
          <select value={f.status} onChange={set('status')} className={inputCls}>
            {statuses.map((s) => <option key={s} value={s}>{k(`status.${s}`)}</option>)}
          </select>
        </Field>
        <Field label={k('fAdminNote')} className="sm:col-span-2">
          <textarea rows={2} maxLength={500} value={f.adminNote} onChange={set('adminNote')} placeholder={k('fAdminNotePh')} className={cn(inputCls, 'h-auto py-2.5')} />
        </Field>
        {booking && <p className="text-[12.5px] text-muted sm:col-span-2">{k('totalNote', { total: rupiah(booking.total) })}</p>}
      </div>
      {error && <p role="alert" className="mx-6 rounded-xl bg-clay-100 px-4 py-3 text-[13.5px] text-clay-600">{error}</p>}
      <div className="flex justify-end gap-2 border-t border-line px-6 py-4">
        <Button type="button" variant="ghost" onClick={onClose}>{t('account.cancel')}</Button>
        <Button type="submit" variant="dark" disabled={saving}>{saving ? t('account.saving') : booking ? t('account.save') : k('create')}</Button>
      </div>
    </form>
  )
}

function BookingsTab({ bookings, reload }) {
  const { packageBySlug, guideById, packages } = useData()
  const { t, tr, fmtDate, people } = useI18n()
  const k = (key, vars) => t(`admin.${key}`, vars)
  const [filter, setFilter] = useState('pending')
  const [q, setQ] = useState('')
  const [editing, setEditing] = useState(null) // null | 'new' | booking
  const [actionError, setActionError] = useState('')

  const counts = useMemo(() => Object.fromEntries(BOOKING_STATUSES.map((s) => [s, bookings.filter((b) => b.status === s).length])), [bookings])
  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return bookings.filter(
      (b) =>
        (filter === 'all' || b.status === filter) &&
        (!term || [b.code, b.contactName, b.contactEmail, b.contactPhone, b.slug].join(' ').toLowerCase().includes(term)),
    )
  }, [bookings, filter, q])

  const quick = async (b, status) => {
    setActionError('')
    try {
      await adminUpdateBooking(b.id, { ...b, status })
      reload()
    } catch (err) {
      setActionError(serverMessage(err, k('saveError')))
    }
  }
  const remove = async (b) => {
    setActionError('')
    try {
      await adminDeleteBooking(b.id)
      reload()
    } catch (err) {
      setActionError(serverMessage(err, k('saveError')))
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label={k('filterLabel')}>
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>{k('all')} <span className="font-mono text-[11px] opacity-70">{bookings.length}</span></Chip>
          {BOOKING_STATUSES.map((s) => (
            <Chip key={s} active={filter === s} onClick={() => setFilter(s)}>{k(`status.${s}`)} <span className="font-mono text-[11px] opacity-70">{counts[s]}</span></Chip>
          ))}
        </div>
        <div className="flex gap-2">
          <label className="flex h-10 flex-1 items-center gap-2 rounded-full border border-line-strong bg-bone px-4 lg:w-64">
            <Search className="size-4 text-muted" />
            <span className="sr-only">{k('search')}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={k('search')} className="h-full min-w-0 flex-1 bg-transparent text-[14px] focus:outline-none" />
          </label>
          <Button variant="primary" onClick={() => setEditing('new')} disabled={!packages.length}><Plus className="size-4" />{k('add')}</Button>
        </div>
      </div>
      {actionError && <p role="alert" className="mt-4 rounded-xl bg-clay-100 px-4 py-3 text-[13.5px] text-clay-600">{actionError}</p>}

      {list.length === 0 ? (
        <p className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong px-6 py-12 text-center text-ink-soft">{k('noBookings')}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-[var(--radius-card)] bg-bone ring-1 ring-line">
          {list.map((b) => {
            const pkg = packageBySlug[b.slug]
            const g = guideById[b.guideId]
            return (
              <li key={b.id} className="grid gap-3 p-5 lg:grid-cols-[1.4fr_1fr_auto] lg:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11.5px] tracking-[0.1em] text-muted">{b.code}</span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', bookingStatusCls[b.status])}>{k(`status.${b.status}`)}</span>
                    {!b.userId && <span className="rounded-full bg-paper-2 px-2 py-0.5 text-[11px] text-muted">{k('manual')}</span>}
                  </div>
                  <p className="mt-1 truncate font-medium">{pkg ? tr(pkg.title) : b.slug}</p>
                  <p className="mt-0.5 flex flex-wrap gap-x-4 text-[13px] text-ink-soft">
                    <span className="inline-flex items-center gap-1"><CalendarDays className="size-3.5" />{fmtDate(b.date)}</span>
                    <span className="inline-flex items-center gap-1"><Users className="size-3.5" />{people(b.pax)}</span>
                    <span className="font-medium text-ink">{rupiah(b.total)}</span>
                  </p>
                </div>
                <div className="min-w-0 text-[13px]">
                  <p className="truncate font-medium">{b.contactName}</p>
                  <p className="truncate text-ink-soft">{b.contactPhone} · {b.contactEmail}</p>
                  <p className="truncate text-muted">{k('guide')}: {g?.name ?? '—'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                  {b.status === 'pending' && <Button variant="dark" size="sm" onClick={() => quick(b, 'approved')}><Check className="size-4" />{k('approve')}</Button>}
                  {b.status === 'confirmed' && b.date < todayISO() && <Button variant="outline" size="sm" onClick={() => quick(b, 'completed')}>{k('complete')}</Button>}
                  <Button variant="ghost" size="sm" onClick={() => setEditing(b)}><Pencil className="size-4" />{k('edit')}</Button>
                  <ConfirmButton label={k('delete')} confirmLabel={k('confirmDelete')} onConfirm={() => remove(b)} />
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {editing && (
        <Modal title={editing === 'new' ? k('addTitle') : k('editTitle', { code: editing.code })} onClose={() => setEditing(null)}>
          <BookingForm booking={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload() }} />
        </Modal>
      )}
    </>
  )
}

function TravelersTab({ bookings }) {
  const { t, locale } = useI18n()
  const k = (key, vars) => t(`admin.${key}`, vars)
  const [state, setState] = useState({ status: 'loading', list: [] })
  const [q, setQ] = useState('')
  useEffect(() => {
    fetchProfiles().then((list) => setState({ status: 'ready', list }), () => setState({ status: 'error', list: [] }))
  }, [])
  const countBy = useMemo(() => bookings.reduce((m, b) => (b.userId ? { ...m, [b.userId]: (m[b.userId] ?? 0) + 1 } : m), {}), [bookings])
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  const term = q.trim().toLowerCase()
  const list = state.list.filter((p) => !term || [p.name, p.email, p.phone].join(' ').toLowerCase().includes(term))

  if (state.status === 'loading') return <p className="text-ink-soft" role="status">{t('data.loading')}</p>
  if (state.status === 'error') return <p className="rounded-xl bg-clay-100 px-4 py-3 text-[14px] text-clay-600" role="alert">{k('loadError')}</p>
  return (
    <>
      <label className="flex h-10 max-w-sm items-center gap-2 rounded-full border border-line-strong bg-bone px-4">
        <Search className="size-4 text-muted" /><span className="sr-only">{k('searchPeople')}</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={k('searchPeople')} className="h-full min-w-0 flex-1 bg-transparent text-[14px] focus:outline-none" />
      </label>
      <div className="mt-5 overflow-x-auto rounded-[var(--radius-card)] bg-bone ring-1 ring-line">
        <table className="w-full min-w-[640px] text-left text-[14px]">
          <thead className="border-b border-line text-[12px] uppercase tracking-[0.06em] text-muted">
            <tr><th className="px-5 py-3 font-medium">{t('checkout.name')}</th><th className="px-5 py-3 font-medium">{t('checkout.email')}</th><th className="px-5 py-3 font-medium">{t('checkout.phone')}</th><th className="px-5 py-3 font-medium">{k('joined')}</th><th className="px-5 py-3 text-right font-medium">{k('bookingsCount')}</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3 font-medium">{p.name || '—'}</td>
                <td className="px-5 py-3 text-ink-soft">{p.email}</td>
                <td className="px-5 py-3 text-ink-soft">{p.phone || '—'}</td>
                <td className="px-5 py-3 text-ink-soft">{fmt.format(new Date(p.createdAt))}</td>
                <td className="px-5 py-3 text-right font-mono">{countBy[p.id] ?? 0}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-ink-soft">{k('noPeople')}</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  )
}

function GuideAccountsTab() {
  const { guides, guideById } = useData()
  const { t, locale } = useI18n()
  const k = (key, vars) => t(`admin.${key}`, vars)
  const [state, setState] = useState({ status: 'loading', list: [] })
  const [form, setForm] = useState({ guideId: '', email: '', password: newPassword() })
  const [msg, setMsg] = useState(null) // { ok, text }
  const [created, setCreated] = useState(null) // { name, email, password } — ditampilkan sekali
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => fetchGuideAccounts().then((list) => setState({ status: 'ready', list }), () => setState({ status: 'error', list: [] })), [])
  useEffect(() => {
    load()
  }, [load])
  const linked = new Set(state.list.map((a) => a.guideId))
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' })

  const chooseGuide = (guideId) => setForm({ ...form, guideId, email: guideId ? suggestEmail(guideById[guideId].name) : '' })

  const create = async (e) => {
    e.preventDefault()
    if (!form.guideId || !/^\S+@\S+\.\S+$/.test(form.email)) return setMsg({ ok: false, text: k('linkInvalid') })
    if (form.password.length < 8) return setMsg({ ok: false, text: t('account.pwShort') })
    setBusy(true)
    setMsg(null)
    setCreated(null)
    const name = guideById[form.guideId].name
    try {
      const { created: isNew } = await adminCreateGuideAccount(form.guideId, name, form.email, form.password)
      if (isNew) {
        setCreated({ name, email: form.email.trim(), password: form.password })
        setCopied(false)
      } else {
        setMsg({ ok: true, text: k('linkedExisting', { name }) })
      }
      setForm({ guideId: '', email: '', password: newPassword() })
      load()
    } catch (err) {
      setMsg({ ok: false, text: serverMessage(err, k('saveError')) })
    } finally {
      setBusy(false)
    }
  }

  const copyCreated = async () => {
    try {
      await navigator.clipboard.writeText(`${created.name}\nEmail: ${created.email}\nKata sandi: ${created.password}\nMasuk di: ${window.location.origin}/portal-pemandu`)
      setCopied(true)
    } catch {
      /* clipboard tidak tersedia — data tetap terlihat untuk disalin manual */
    }
  }

  return (
    <>
      <form onSubmit={create} className="rounded-[var(--radius-card)] bg-bone p-5 ring-1 ring-line sm:p-6">
        <p className="font-medium">{k('createTitle')}</p>
        <p className="mt-1 flex gap-2 text-[13px] text-ink-soft"><ShieldAlert className="mt-0.5 size-4 shrink-0 text-sun-500" />{k('createNote')}</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <Field label={k('guide')}>
            <select value={form.guideId} onChange={(e) => chooseGuide(e.target.value)} className={inputCls}>
              <option value="">{k('chooseGuide')}</option>
              {guides.filter((g) => !linked.has(g.id)).map((g) => <option key={g.id} value={g.id}>{g.name} ({g.id})</option>)}
            </select>
          </Field>
          <Field label={k('accountEmail')}>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
          </Field>
          <Field label={k('initialPassword')}>
            <span className="flex gap-1.5">
              <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={cn(inputCls, 'font-mono')} />
              <button type="button" onClick={() => setForm({ ...form, password: newPassword() })} className="mt-1.5 grid size-11 shrink-0 place-items-center rounded-xl border border-line-strong hover:border-ink" aria-label={k('regenerate')}>
                <RefreshCw className="size-4" />
              </button>
            </span>
          </Field>
          <Button type="submit" variant="dark" disabled={busy}><UserPlus className="size-4" />{k('createAccount')}</Button>
        </div>
        {msg && <p role={msg.ok ? 'status' : 'alert'} className={cn('mt-3 text-[13.5px]', msg.ok ? 'text-moss-600' : 'text-clay-600')}>{msg.text}</p>}
        {created && (
          <div role="status" className="mt-4 rounded-2xl bg-sage-100 p-4 text-[13.5px]">
            <p className="font-medium text-moss-600">{k('createdTitle', { name: created.name })}</p>
            <p className="mt-2 font-mono text-[13px]">{created.email}<br />{created.password}</p>
            <p className="mt-2 text-ink-soft">{k('createdNote')}</p>
            <Button type="button" variant="outline" size="sm" className="mt-3" onClick={copyCreated}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />}{k(copied ? 'copied' : 'copyLogin')}</Button>
          </div>
        )}
      </form>

      {state.status === 'loading' ? (
        <p className="mt-6 text-ink-soft" role="status">{t('data.loading')}</p>
      ) : state.status === 'error' ? (
        <p className="mt-6 rounded-xl bg-clay-100 px-4 py-3 text-[14px] text-clay-600" role="alert">{k('loadError')}</p>
      ) : state.list.length === 0 ? (
        <p className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong px-6 py-10 text-center text-ink-soft">{k('noLinks')}</p>
      ) : (
        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-[var(--radius-card)] bg-bone ring-1 ring-line">
          {state.list.map((a) => {
            const g = guideById[a.guideId]
            return (
              <li key={a.guideId} className="flex flex-wrap items-center gap-4 p-4">
                {g && <Monogram name={g.name} src={g.photo} size="sm" />}
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{g?.name ?? a.guideId}</p>
                  <p className="truncate text-[13px] text-ink-soft">{a.email} · {k('since', { date: fmt.format(new Date(a.linkedAt)) })}</p>
                </div>
                <ConfirmButton label={k('unlink')} confirmLabel={k('confirmUnlink')} icon={Unlink} onConfirm={async () => { await adminUnlinkGuide(a.guideId); load() }} />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

/** Panel admin: kelola pesanan (CRUD), lihat akun wisatawan, dan hubungkan akun pemandu. */
export default function Admin() {
  const { isAdmin, guideReady } = useAuth()
  const { t } = useI18n()
  const k = (key, vars) => t(`admin.${key}`, vars)
  const [tab, setTab] = useState('bookings')
  const [data, setData] = useState({ status: 'loading', bookings: [] })

  const reload = useCallback(async () => {
    try {
      setData({ status: 'ready', bookings: await fetchAllBookings() })
    } catch {
      setData((d) => (d.status === 'ready' ? d : { status: 'error', bookings: [] }))
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    reload()
    return watchBookings('admin', reload)
  }, [isAdmin, reload])

  if (!guideReady) return <section className="min-h-screen bg-paper pt-[72px]"><p className="container-x pt-16 text-ink-soft" role="status">{t('data.loading')}</p></section>
  if (!isAdmin) {
    return (
      <section className="min-h-screen bg-paper pb-20 pt-[72px]">
        <div className="container-x max-w-xl pt-16 text-center">
          <ShieldAlert className="mx-auto size-10 text-clay-500" strokeWidth={1.5} />
          <h1 className="mt-4 font-display text-[36px] leading-tight">{k('denyTitle')}</h1>
          <p className="mt-3 text-ink-soft">{k('denyText')}</p>
          <Button to="/" variant="dark" className="mt-6">{t('checkout.home')}</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-paper pb-20 pt-[72px]">
      <div className="container-x pt-10">
        <Eyebrow>{k('eyebrow')}</Eyebrow>
        <h1 className="mt-3 font-display text-[36px] leading-tight sm:text-[48px]">{k('title')}</h1>

        <div className="mt-8 flex gap-1 border-b border-line" role="tablist" aria-label={k('title')}>
          {['bookings', 'travelers', 'guides'].map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn('-mb-px border-b-2 px-4 py-3 text-[14.5px] font-medium', tab === key ? 'border-forest-900 text-ink' : 'border-transparent text-muted hover:text-ink')}
            >
              {k(`tab.${key}`)}
              {key === 'bookings' && data.bookings.some((b) => b.status === 'pending') && (
                <span className="ml-2 rounded-full bg-clay-500 px-1.5 py-0.5 font-mono text-[10.5px] text-bone">{data.bookings.filter((b) => b.status === 'pending').length}</span>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6" role="tabpanel">
          {tab === 'bookings' &&
            (data.status === 'loading' ? (
              <p className="text-ink-soft" role="status">{t('data.loading')}</p>
            ) : data.status === 'error' ? (
              <p className="rounded-xl bg-clay-100 px-4 py-3 text-[14px] text-clay-600" role="alert">{k('loadError')}</p>
            ) : (
              <BookingsTab bookings={data.bookings} reload={reload} />
            ))}
          {tab === 'travelers' && <TravelersTab bookings={data.bookings} />}
          {tab === 'guides' && <GuideAccountsTab />}
        </div>
      </div>
    </section>
  )
}
