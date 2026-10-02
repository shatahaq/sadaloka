const idr = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })

/** Rp 350.000 */
export const rupiah = (n) => idr.format(n).replace(/\u00a0/g, ' ')

/** 350rb / 1,2jt — untuk label ringkas */
export const rupiahShort = (n) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`
  return `${Math.round(n / 1000)} rb`
}

export const initials = (name) =>
  name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

export const cn = (...c) => c.filter(Boolean).join(' ')

export const todayISO = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  const pad = (x) => String(x).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}
