import { Check, X } from 'lucide-react'
import { cn, todayISO } from '../lib/format'
import { useI18n } from '../i18n'

const STEPS = ['created', 'review', 'guide', 'prep', 'day', 'after']

const daysUntil = (iso) => Math.round((new Date(`${iso}T00:00:00`) - new Date(`${todayISO()}T00:00:00`)) / 86400000)

/**
 * Posisi perjalanan pada linimasa: indeks langkah yang sedang berjalan (`current`) dan,
 * bila pesanan ditolak/dibatalkan, indeks langkah tempat perjalanan berhenti (`failed`).
 */
function progress(b, events) {
  const has = (s) => events.some((e) => e.status === s)
  switch (b.status) {
    case 'pending':
      return { current: 1 }
    case 'approved':
      return { current: 2 }
    case 'confirmed': {
      const d = daysUntil(b.date)
      return { current: d < 0 ? 5 : d === 0 ? 4 : 3 }
    }
    case 'preparing': return { current: 3 }
    case 'in_progress': return { current: 4 }
    case 'completed':
      return { current: STEPS.length }
    case 'declined':
      return { failed: 2 }
    case 'cancelled':
      return { failed: has('confirmed') ? 3 : has('approved') ? 2 : 1 }
    default:
      return { current: 0 }
  }
}

/**
 * Linimasa perjalanan wisatawan (gaya sama dengan halaman "Terima kasih").
 * Langkah selesai = hijau + centang, berjalan = oranye, berikutnya = abu-abu,
 * berhenti (ditolak/dibatalkan) = silang merah. Waktu & pesan admin/pemandu diambil dari riwayat status.
 */
export default function TripTimeline({ booking: b, events = [], guideName, place, className = '' }) {
  const { t, fmtDate, locale } = useI18n()
  const k = (key, vars) => t(`trip.${key}`, vars)
  const fmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  const last = (s) => [...events].reverse().find((e) => e.status === s)
  const { current = -1, failed = -1 } = progress(b, events)
  const guide = guideName ?? k('yourGuide')
  const cancelled = last('cancelled')

  // isi tiap langkah: teks sesuai keadaan, waktu & catatan dari riwayat status
  const detail = {
    created: { text: k('created.d', { code: b.code }), at: last('pending')?.at ?? b.createdAt },
    review:
      failed === 1
        ? { text: k('cancelledD'), at: cancelled?.at, note: cancelled?.note }
        : { text: k(current > 1 || failed > 1 ? 'review.done' : 'review.wait', { guide }), at: last('approved')?.at, note: last('approved')?.note },
    guide:
      b.status === 'declined'
        ? { text: k('guide.declined', { guide }), at: last('declined')?.at, note: last('declined')?.note }
        : failed === 2
          ? { text: k('cancelledD'), at: cancelled?.at, note: cancelled?.note }
          : { text: k(current > 2 || failed > 2 ? 'guide.done' : current === 2 ? 'guide.wait' : 'guide.later', { guide }), at: last('confirmed')?.at, note: last('confirmed')?.note },
    prep: failed === 3 ? { text: k('cancelledD'), at: cancelled?.at, note: cancelled?.note } : { text: k('prep.d') },
    day: { title: k('day.t', { date: fmtDate(b.date) }), text: k('day.d', { place }) },
    after: { text: k('after.d'), at: last('completed')?.at },
  }

  return (
    <ol className={cn('rounded-[var(--radius-card)] bg-bone p-6 text-left ring-1 ring-line sm:p-8', className)}>
      {STEPS.map((key, i) => {
        const state = i === failed ? 'failed' : failed >= 0 && i > failed ? 'skipped' : i < current || (failed >= 0 && i < failed) ? 'done' : i === current ? 'current' : 'upcoming'
        const d = detail[key]
        return (
          <li key={key} className="relative grid grid-cols-[28px_1fr] gap-4 pb-6 last:pb-0" aria-current={state === 'current' ? 'step' : undefined}>
            <span
              className={cn(
                'relative z-10 grid size-7 place-items-center rounded-full font-mono text-[11px]',
                state === 'done' && 'bg-moss-600 text-paper',
                state === 'current' && 'bg-clay-500 text-bone',
                state === 'failed' && 'bg-clay-600 text-bone',
                (state === 'upcoming' || state === 'skipped') && 'bg-paper-2 text-ink-soft',
                state === 'skipped' && 'opacity-50',
              )}
            >
              {state === 'done' ? <Check className="size-3.5" strokeWidth={2.5} /> : state === 'failed' ? <X className="size-3.5" strokeWidth={2.5} /> : i + 1}
              <span className="sr-only">{k(`state.${state}`)}</span>
            </span>
            {i < STEPS.length - 1 && <span className={cn('absolute left-[13.5px] top-7 h-full w-px', state === 'done' ? 'bg-moss-600' : 'bg-line-strong')} />}
            <div className={cn(state === 'skipped' && 'opacity-50')}>
              <p className={cn('font-medium', state === 'upcoming' && 'text-ink-soft')}>{d.title ?? k(`${key}.t`)}</p>
              <p className="mt-0.5 text-[14px] text-ink-soft">{d.text}</p>
              {d.at && state !== 'upcoming' && state !== 'skipped' && <p className="mt-1 text-[12.5px] text-muted">{fmt.format(new Date(d.at))}</p>}
              {d.note && state !== 'upcoming' && <p className="mt-2 rounded-xl bg-paper px-3.5 py-2.5 text-[13.5px] text-ink-soft">“{d.note}”</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
