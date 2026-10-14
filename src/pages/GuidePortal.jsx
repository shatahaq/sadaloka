import { useCallback, useEffect, useMemo, useState } from 'react'
import { CalendarDays, Camera, Car, Check, Copy, KeyRound, LogOut, Mail, MessageCircle, StickyNote, Users, X } from 'lucide-react'
import { useData } from '../data'
import { fetchGuideAvailability, fetchGuideBookings, respondBooking, serverMessage, setMyAvailability, updateGuideTripStatus, watchBookings } from '../data/bookings'
import { cn, rupiah, todayISO } from '../lib/format'
import { bookingStatusCls } from '../lib/constants'
import { useI18n } from '../i18n'
import { useAuth } from '../lib/auth'
import { Button, Chip, Eyebrow, Monogram } from '../components/ui'

const ADMIN_WA = '6281200000000'

/** 0812… / +62 812… → 62812… untuk tautan wa.me */
const waNumber = (phone) => {
  const d = phone.replace(/\D/g, '')
  return d.startsWith('0') ? `62${d.slice(1)}` : d
}

/** Akun sudah login tapi belum dihubungkan admin ke profil pemandu. */
function NotLinked({ email }) {
  const { t } = useI18n()
  const k = (key, vars) => t(`portal.${key}`, vars)
  const { logout } = useAuth()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      /* clipboard tidak tersedia — email tetap terlihat untuk disalin manual */
    }
  }
  return (
    <div className="mx-auto max-w-xl rounded-[var(--radius-card)] bg-bone p-6 text-center ring-1 ring-line sm:p-10">
      <Eyebrow className="justify-center">{k('eyebrow')}</Eyebrow>
      <h1 className="mt-4 font-display text-[32px] leading-tight sm:text-[40px]">{k('notLinkedTitle')}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{k('notLinkedText')}</p>
      <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-line-strong bg-paper px-4 py-3 text-left">
        <span className="min-w-0 truncate font-mono text-[14px]">{email}</span>
        <button type="button" onClick={copy} className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-moss-600">
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {k(copied ? 'copied' : 'copy')}
        </button>
      </div>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href={`https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(k('adminMessage', { email }))}`} variant="dark">
          <MessageCircle className="size-4" />{k('contactAdmin')}
        </Button>
        <Button variant="outline" onClick={logout}><LogOut className="size-4" />{t('nav.logout')}</Button>
      </div>
    </div>
  )
}

function BookingCard({ booking: b, onRespond, onProgress }) {
  const { packageBySlug, corridorBySlug } = useData()
  const { t, tr, fmtDate, people } = useI18n()
  const k = (key, vars) => t(`portal.${key}`, vars)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(null) // 'confirmed' | 'declined' saat menunggu server
  const [error, setError] = useState('')
  const pkg = packageBySlug[b.slug]
  const c = pkg && corridorBySlug[pkg.corridor]

  const respond = async (status) => {
    setBusy(status)
    setError('')
    try {
      await onRespond(b.id, status, note)
    } catch (err) {
      setError(serverMessage(err, k('respondError')))
    } finally {
      setBusy(null)
    }
  }

  return (
    <li className="overflow-hidden rounded-[var(--radius-card)] bg-bone ring-1 ring-line">
      <div className="grid gap-5 p-5 sm:grid-cols-[120px_1fr] sm:p-6">
        {pkg && <img src={pkg.image ?? c.imageSm ?? c.image} alt="" className="h-28 w-full rounded-2xl object-cover sm:h-full" />}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-[11.5px] tracking-[0.12em] text-muted">{b.code}</p>
            <span className={cn('rounded-full px-2.5 py-1 text-[11.5px] font-medium', bookingStatusCls[b.status])}>{k(`status.${b.status}`)}</span>
          </div>
          <p className="mt-1 font-display text-[22px] leading-tight">{pkg ? tr(pkg.title) : b.slug}</p>
          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-[13.5px] text-ink-soft">
            <span className="inline-flex items-center gap-1.5 font-medium text-ink"><CalendarDays className="size-4" />{fmtDate(b.date)}</span>
            <span className="inline-flex items-center gap-1.5"><Users className="size-4" />{people(b.pax)}</span>
            {b.pickup && <span className="inline-flex items-center gap-1.5"><Car className="size-4" />{k('pickup')}</span>}
            {b.photo && <span className="inline-flex items-center gap-1.5"><Camera className="size-4" />{k('photo')}</span>}
          </div>

          <div className="mt-4 grid gap-3 rounded-2xl bg-paper p-4 text-[13.5px] sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-[12px] text-muted">{k('traveller')}</p>
              <p className="font-medium">{b.contactName}</p>
              <p className="truncate text-ink-soft">{b.contactPhone} · {b.contactEmail}</p>
            </div>
            <div className="flex gap-2">
              <Button href={`https://wa.me/${waNumber(b.contactPhone)}`} variant="outline" size="sm" target="_blank" rel="noreferrer"><MessageCircle className="size-4" />WhatsApp</Button>
              <Button href={`mailto:${b.contactEmail}`} variant="ghost" size="sm" aria-label={k('emailTraveller')}><Mail className="size-4" /></Button>
            </div>
          </div>

          {b.notes && (
            <p className="mt-3 flex gap-2 text-[13.5px] text-ink-soft">
              <StickyNote className="mt-0.5 size-4 shrink-0 text-sun-500" />
              <span><span className="font-medium text-ink">{k('travellerNote')}</span> {b.notes}</span>
            </p>
          )}
          {b.adminNote && <p className="mt-3 text-[13.5px] text-ink-soft"><span className="font-medium text-ink">{k('adminNote')}</span> {b.adminNote}</p>}
          {b.guideNote && <p className="mt-3 text-[13.5px] text-ink-soft"><span className="font-medium text-ink">{k('yourNote')}</span> {b.guideNote}</p>}

          <p className="mt-4 text-[13px] text-muted">{k('total')} <span className="text-[15px] font-semibold text-ink">{rupiah(b.total)}</span></p>
          {['confirmed', 'preparing', 'in_progress'].includes(b.status) && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
            <span className="mr-1 text-[13px] font-medium">{k('progressLabel')}</span>
            {b.status === 'confirmed' && <Button size="sm" variant="outline" onClick={() => onProgress(b.id, 'preparing')}>{k('progress.preparing')}</Button>}
            {b.status === 'preparing' && <Button size="sm" variant="outline" onClick={() => onProgress(b.id, 'in_progress')}>{k('progress.in_progress')}</Button>}
            {b.status === 'in_progress' && <Button size="sm" variant="dark" onClick={() => onProgress(b.id, 'completed')}>{k('progress.completed')}</Button>}
          </div>}
        </div>
      </div>

      {b.status === 'approved' && (
        <div className="border-t border-line bg-paper-2/60 p-5 sm:p-6">
          <label className="block">
            <span className="text-[13px] font-medium">{k('noteLabel')}</span>
            <textarea
              rows={2}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={k('notePh')}
              className="mt-1.5 w-full rounded-xl border border-line-strong bg-bone px-4 py-3 text-[14.5px] focus:border-forest-900 focus:outline-none"
            />
          </label>
          {error && <p role="alert" className="mt-2 text-[13px] text-clay-600">{error}</p>}
          <div className="mt-3 flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => respond('declined')} disabled={busy != null}><X className="size-4" />{k(busy === 'declined' ? 'sending' : 'decline')}</Button>
            <Button variant="dark" onClick={() => respond('confirmed')} disabled={busy != null}><Check className="size-4" />{k(busy === 'confirmed' ? 'sending' : 'accept')}</Button>
          </div>
        </div>
      )}
    </li>
  )
}

/** Portal pemandu: pesanan untuk pemandu yang login, terima/tolak, dan status tersedia. */
export default function GuidePortal() {
  const { user, guideId, guideReady, logout } = useAuth()
  const { guideById } = useData()
  const { t, tr } = useI18n()
  const k = (key, vars) => t(`portal.${key}`, vars)
  const guide = guideById[guideId]
  const [data, setData] = useState({ status: 'loading', bookings: [] })
  const [available, setAvailable] = useState(null)
  const [savingAvail, setSavingAvail] = useState(false)
  const [availError, setAvailError] = useState(false)
  const [tab, setTab] = useState('pending')

  const loadBookings = useCallback(async () => {
    try {
      setData({ status: 'ready', bookings: await fetchGuideBookings(guideId) })
    } catch {
      setData((d) => (d.status === 'ready' ? d : { status: 'error', bookings: [] }))
    }
  }, [guideId])

  // muat sekali, lalu muat ulang setiap kali admin meneruskan / mengubah pesanan
  useEffect(() => {
    if (!guideId) return
    loadBookings()
    fetchGuideAvailability(guideId).then(setAvailable, () => setAvailError(true))
    return watchBookings(`guide-${guideId}`, loadBookings)
  }, [guideId, loadBookings])

  const today = todayISO()
  const groups = useMemo(() => {
    const list = data.bookings
    return {
      pending: list.filter((b) => b.status === 'approved'),
      upcoming: list.filter((b) => ['confirmed', 'preparing', 'in_progress'].includes(b.status) && b.date >= today),
      history: list.filter((b) => ['declined', 'cancelled', 'completed'].includes(b.status) || (['confirmed', 'preparing', 'in_progress'].includes(b.status) && b.date < today)).reverse(),
    }
  }, [data.bookings, today])

  const onRespond = async (id, status, note) => {
    const updated = await respondBooking(id, status, note)
    setData((d) => ({ ...d, bookings: d.bookings.map((b) => (b.id === id ? updated : b)) }))
  }
  const onProgress = async (id, status) => {
    const updated = await updateGuideTripStatus(id, status)
    setData((d) => ({ ...d, bookings: d.bookings.map((b) => (b.id === id ? updated : b)) }))
  }

  const toggleAvailability = async () => {
    setSavingAvail(true)
    setAvailError(false)
    try {
      await setMyAvailability(!available)
      setAvailable(!available)
    } catch {
      setAvailError(true)
    } finally {
      setSavingAvail(false)
    }
  }

  if (!guideReady) {
    return <section className="min-h-screen bg-paper pt-[72px]"><p className="container-x pt-16 text-ink-soft" role="status">{t('data.loading')}</p></section>
  }

  return (
    <section className="min-h-screen bg-paper pb-20 pt-[72px]">
      <div className="container-x max-w-5xl pt-10">
        {!guide ? (
          <NotLinked email={user.email} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <Monogram name={guide.name} src={guide.photo} size="lg" />
                <div>
                  <Eyebrow>{k('eyebrow')}</Eyebrow>
                  <h1 className="mt-2 font-display text-[34px] leading-tight sm:text-[42px]">{guide.name}</h1>
                  <p className="text-[14px] text-ink-soft">{tr(guide.role)}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button to="/akun#sandi" variant="ghost"><KeyRound className="size-4" />{t('account.changePassword')}</Button>
                <Button variant="outline" onClick={logout}><LogOut className="size-4" />{t('nav.logout')}</Button>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[1.3fr_1fr_1fr]">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-bone p-5 ring-1 ring-line">
                <div>
                  <p className="font-medium">{k('availability')}</p>
                  <p className="text-[13px] text-muted">{available == null ? '…' : k(available ? 'availableOn' : 'availableOff')}</p>
                  {availError && <p role="alert" className="mt-1 text-[12.5px] text-clay-600">{k('availError')}</p>}
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!!available}
                  aria-label={k('availability')}
                  onClick={toggleAvailability}
                  disabled={available == null || savingAvail}
                  className={cn('relative h-8 w-14 shrink-0 rounded-full transition-colors disabled:opacity-50', available ? 'bg-moss-600' : 'bg-line-strong')}
                >
                  <span
                    className={cn(
                      'absolute left-1 top-1 size-6 rounded-full bg-bone shadow transition-transform',
                      // Rel selebar 56px, thumb 24px, dan margin 4px di tiap sisi.
                      // Posisi eksplisit ini menjaga thumb tetap berada di dalam rel pada semua browser.
                      available ? 'translate-x-6' : 'translate-x-0',
                    )}
                  />
                </button>
              </div>
              <div className="rounded-2xl bg-bone p-5 ring-1 ring-line">
                <p className="text-[13px] text-muted">{k('statPending')}</p>
                <p className="font-display text-[36px] leading-none">{groups.pending.length}</p>
              </div>
              <div className="rounded-2xl bg-bone p-5 ring-1 ring-line">
                <p className="text-[13px] text-muted">{k('statUpcoming')}</p>
                <p className="font-display text-[36px] leading-none">{groups.upcoming.length}</p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-2" role="group" aria-label={k('tabsLabel')}>
              {['pending', 'upcoming', 'history'].map((key) => (
                <Chip key={key} active={tab === key} onClick={() => setTab(key)}>
                  {k(`tab.${key}`)} <span className="font-mono text-[11px] opacity-70">{groups[key].length}</span>
                </Chip>
              ))}
            </div>

            {data.status === 'loading' ? (
              <p className="mt-6 text-ink-soft" role="status">{t('data.loading')}</p>
            ) : data.status === 'error' ? (
              <p className="mt-6 rounded-xl bg-clay-100 px-4 py-3 text-[14px] text-clay-600" role="alert">{k('loadError')}</p>
            ) : groups[tab].length === 0 ? (
              <p className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong px-6 py-12 text-center text-ink-soft">{k(`empty.${tab}`)}</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {groups[tab].map((b) => <BookingCard key={b.id} booking={b} onRespond={onRespond} onProgress={onProgress} />)}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  )
}
