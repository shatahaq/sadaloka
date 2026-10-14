import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Car, Users } from 'lucide-react'
import { useData } from '../data'
import { fetchEvents, fetchMyBooking, watchBookings } from '../data/bookings'
import { cn, rupiah } from '../lib/format'
import { bookingStatusCls } from '../lib/constants'
import { useI18n } from '../i18n'
import { useAuth } from '../lib/auth'
import { Button, Monogram } from '../components/ui'
import TripTimeline from '../components/TripTimeline'

/** Detail satu perjalanan wisatawan + linimasa status yang diperbarui otomatis. */
export default function TripDetail() {
  const { code } = useParams()
  const { user } = useAuth()
  const { packageBySlug, corridorBySlug, guideById } = useData()
  const { t, tr, fmtDate, people } = useI18n()
  const k = (key, vars) => t(`trip.${key}`, vars)
  const [state, setState] = useState({ status: 'loading', booking: null, events: [] })

  const load = useCallback(async () => {
    try {
      const booking = await fetchMyBooking(user.id, code)
      const events = booking ? (await fetchEvents([booking.id]))[booking.id] ?? [] : []
      setState({ status: booking ? 'ready' : 'missing', booking, events })
    } catch {
      setState((s) => (s.status === 'ready' ? s : { status: 'error', booking: null, events: [] }))
    }
  }, [user.id, code])

  // muat sekali, lalu muat ulang setiap kali admin/pemandu memperbarui pesanan
  useEffect(() => {
    load()
    const stopWatching = watchBookings(`trip-${code}`, load)
    // Cadangan bila kanal Realtime tidak tersedia pada jaringan wisatawan.
    const refreshTimer = window.setInterval(load, 15_000)
    return () => {
      stopWatching()
      window.clearInterval(refreshTimer)
    }
  }, [load, code])

  const back = (
    <Link to="/akun" className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
      <ArrowLeft className="size-4" /> {k('back')}
    </Link>
  )

  if (state.status !== 'ready') {
    return (
      <section className="min-h-screen bg-paper pb-20 pt-[72px]">
        <div className="container-x max-w-3xl pt-8">
          {back}
          {state.status === 'loading' ? (
            <p className="mt-10 text-ink-soft" role="status">{t('data.loading')}</p>
          ) : (
            <div className="mt-10 rounded-[var(--radius-card)] bg-bone p-8 text-center ring-1 ring-line" role="alert">
              <p className="text-ink-soft">{k(state.status === 'missing' ? 'missing' : 'loadError')}</p>
              <Button to="/akun" variant="dark" className="mt-5">{k('back')}</Button>
            </div>
          )}
        </div>
      </section>
    )
  }

  const { booking: b, events } = state
  const pkg = packageBySlug[b.slug]
  const c = pkg && corridorBySlug[pkg.corridor]
  const g = guideById[b.guideId]

  return (
    <section className="paper-grain min-h-screen bg-paper pb-20 pt-[72px]">
      <div className="container-x max-w-3xl pt-8">
        {back}

        <div className="mt-6 overflow-hidden rounded-[var(--radius-card)] bg-bone ring-1 ring-line">
          {pkg && <img src={pkg.image ?? c.imageSm ?? c.image} alt="" className="h-48 w-full object-cover sm:h-60" />}
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-[12px] tracking-[0.14em] text-muted">{t('checkout.code')} · {b.code}</p>
              <span className={cn('rounded-full px-2.5 py-1 text-[12px] font-medium', bookingStatusCls[b.status])}>{t(`account.status.${b.status}`)}</span>
            </div>
            <h1 className="mt-2 font-display text-[32px] leading-[1.05] sm:text-[40px]">{pkg ? tr(pkg.title) : b.slug}</h1>
            {c && <p className="mt-1 text-[14px] text-muted">{t('common.corridor')} {c.numeral} · {tr(c.name)}</p>}

            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[14px] sm:grid-cols-4">
              <div><dt className="text-[12px] text-muted">{k('date')}</dt><dd className="mt-0.5 font-medium">{fmtDate(b.date)}</dd></div>
              <div><dt className="text-[12px] text-muted">{k('guests')}</dt><dd className="mt-0.5 inline-flex items-center gap-1.5 font-medium"><Users className="size-4" />{people(b.pax)}</dd></div>
              <div><dt className="text-[12px] text-muted">{k('meet')}</dt><dd className="mt-0.5 font-medium">{pkg ? tr(pkg.meetingPoint) : '—'}</dd></div>
              <div><dt className="text-[12px] text-muted">{t('checkout.total')}</dt><dd className="mt-0.5 font-semibold">{rupiah(b.total)}</dd></div>
            </dl>
            {(b.pickup || b.photo) && (
              <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-ink-soft">
                {b.pickup && <span className="inline-flex items-center gap-1.5"><Car className="size-4" />{t('checkout.pickup')}</span>}
                {b.photo && <span className="inline-flex items-center gap-1.5"><Camera className="size-4" />{t('checkout.photo')}</span>}
              </p>
            )}
          </div>
        </div>

        {g && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-bone py-2 pl-2 pr-5 ring-1 ring-line">
              <Monogram name={g.name} src={g.photo} size="sm" />
              <span className="text-[13.5px]"><span className="block text-muted">{t('detail.guidedBy')}</span><span className="font-medium">{g.name}</span></span>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-[26px] leading-tight">{k('timeline')}</h2>
          <p className="inline-flex items-center gap-2 text-[12.5px] text-muted"><span className="size-1.5 animate-pulse rounded-full bg-moss-500" />{t('account.live')}</p>
        </div>
        <TripTimeline booking={b} events={events} guideName={g?.name} place={pkg ? tr(pkg.meetingPoint) : ''} className="mt-4" />

        {b.notes && (
          <p className="mt-6 text-[13.5px] text-ink-soft"><span className="font-medium text-ink">{k('yourNote')}</span> {b.notes}</p>
        )}
      </div>
    </section>
  )
}
