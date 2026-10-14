/**
 * Konstanta UI yang terikat ke kamus i18n (label ada di dict.js), bukan data —
 * karena itu tetap di frontend, tidak di database.
 */
export const interestKeys = ['primata', 'gajah', 'flora', 'sungai', 'goa', 'burung', 'budaya', 'kuliner', 'petualangan']

export const difficultyLevels = { ringan: 1, sedang: 2, menantang: 3 }

export const breakdownColors = {
  guide: 'var(--color-moss-600)',
  stay: 'var(--color-sun-500)',
  logistics: 'var(--color-river-500)',
  conservation: 'var(--color-clay-500)',
  platform: 'var(--color-ink-soft)',
}

/** Warna lencana status pesanan */
export const bookingStatusCls = {
  pending: 'bg-sun-100 text-ink',
  approved: 'bg-sage-100 text-ink',
  confirmed: 'bg-moss-600 text-paper',
  preparing: 'bg-sun-100 text-ink',
  in_progress: 'bg-river-100 text-ink',
  declined: 'bg-clay-100 text-clay-600',
  cancelled: 'bg-clay-100 text-clay-600',
  completed: 'bg-forest-900 text-paper',
}
