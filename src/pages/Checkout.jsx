import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Building2, CalendarDays, Check, CreditCard, Lock, QrCode, Users } from 'lucide-react'
import { packageBySlug } from '../data/packages'
import { corridorBySlug } from '../data/corridors'
import { guides } from '../data/guides'
import { ethicsRules } from '../data/content'
import { cn, rupiah, todayISO } from '../lib/format'
import { useI18n } from '../i18n'
import { Button, Monogram } from '../components/ui'
import NotFound from './NotFound'

function Field({ label, error, children, className = '' }) {
  return (
    <label className={cn('block', className)}>
      <span className="text-[13px] font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-clay-600">{error}</span>}
    </label>
  )
}
const inputCls = 'mt-1.5 h-12 w-full rounded-xl border border-line-strong bg-bone px-4 text-[15px] focus:border-forest-900 focus:outline-none'

export default function Checkout() {
  const { t, tr, dur, fmtDate, people } = useI18n()
  const k = (key, vars) => t(`checkout.${key}`, vars)
  const { slug } = useParams()
  const [params] = useSearchParams()
  const pkg = packageBySlug[slug]

  const [step, setStep] = useState(1)
  const [date, setDate] = useState(params.get('tanggal') || '')
  const [pax, setPax] = useState(Math.max(pkg?.group[0] ?? 1, +params.get('peserta') || 2))
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [pickup, setPickup] = useState(false)
  const [photo, setPhoto] = useState(false)
  const [guide, setGuide] = useState('auto')
  const [pay, setPay] = useState('qris')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState({})
  const code = useMemo(() => `SDL-${Math.random().toString(36).slice(2, 7).toUpperCase()}`, [])

  if (!pkg) return <NotFound />
  const c = corridorBySlug[pkg.corridor]
  const crew = guides.filter((g) => g.corridors.includes(pkg.corridor) && g.available)

  const payments = [
    { v: 'qris', label: 'QRIS', note: k('qrisNote'), Icon: QrCode },
    { v: 'va', label: 'Virtual Account', note: k('vaNote'), Icon: Building2 },
    { v: 'card', label: k('card'), note: 'Visa, Mastercard, JCB', Icon: CreditCard },
  ]

  const base = pkg.price * pax
  const cars = Math.ceil(pax / 6)
  const pickupCost = pickup ? 450000 * cars : 0
  const photoCost = photo ? 150000 : 0
  const total = base + pickupCost + photoCost

  const next = () => {
    if (step === 1) {
      const e = {}
      if (!date) e.date = k('errDate')
      if (form.name.trim().length < 3) e.name = k('errName')
      if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = k('errEmail')
      if (form.phone.replace(/\D/g, '').length < 9) e.phone = k('errPhone')
      setErrors(e)
      if (Object.keys(e).length) return
    }
    if (step === 2 && !agree) {
      setErrors({ agree: k('errAgree') })
      return
    }
    setErrors({})
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (step === 3) {
    return (
      <section className="paper-grain min-h-screen bg-paper pb-20 pt-[72px]">
        <div className="container-x max-w-3xl pt-14 text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-moss-600 text-paper"><Check className="size-8" /></span>
          <p className="mt-6 font-mono text-[12px] tracking-[0.16em] text-muted">{k('code')} · {code}</p>
          <h1 className="mt-3 font-display text-[44px] leading-[1.02] sm:text-6xl">{k('thanks', { name: form.name.split(' ')[0] })}</h1>
          <p className="mx-auto mt-4 max-w-lg text-[16px] text-ink-soft">
            {k('confirm', { title: tr(pkg.title), people: people(pax), date: fmtDate(date), corridor: tr(c.name) })}
          </p>
        </div>
        <div className="container-x mt-12 max-w-3xl">
          <ol className="rounded-[var(--radius-card)] bg-bone p-6 text-left ring-1 ring-line sm:p-8">
            {[1, 2, 3, 4].map((n, i, arr) => (
              <li key={n} className="relative grid grid-cols-[28px_1fr] gap-4 pb-6 last:pb-0">
                <span className={cn('relative z-10 grid size-7 place-items-center rounded-full font-mono text-[11px]', i === 0 ? 'bg-clay-500 text-bone' : 'bg-paper-2')}>{n}</span>
                {i < arr.length - 1 && <span className="absolute left-[13.5px] top-7 h-full w-px bg-line-strong" />}
                <div>
                  <p className="font-medium">{k(`n${n}t`)}</p>
                  <p className="mt-0.5 text-[14px] text-ink-soft">{k(`n${n}d`, { place: tr(pkg.meetingPoint) })}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/" variant="dark">{k('home')}</Button>
            <Button to={`/koridor/${c.slug}`} variant="outline">{k('learn', { name: tr(c.name) })}</Button>
          </div>
          <p className="mt-6 text-center text-[12px] text-muted">{k('prototype')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-paper pb-20 pt-[72px]">
      <div className="container-x pt-8">
        <Link to={`/paket/${pkg.slug}`} className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-ink">
          <ArrowLeft className="size-4" /> {k('back')}
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-display text-[36px] leading-tight sm:text-[48px]">{step === 1 ? k('detailsTitle') : k('payTitle')}</h1>
          <ol className="flex items-center gap-2 text-[13px]">
            {[k('stepDetail'), k('stepPay'), k('stepDone')].map((s, i) => (
              <li key={s} className="flex items-center gap-2">
                <span className={cn('grid size-6 place-items-center rounded-full font-mono text-[11px]', i + 1 < step ? 'bg-moss-600 text-paper' : i + 1 === step ? 'bg-forest-900 text-paper' : 'bg-paper-2 text-muted')}>
                  {i + 1 < step ? <Check className="size-3.5" /> : i + 1}
                </span>
                <span className={i + 1 === step ? 'font-medium' : 'text-muted'}>{s}</span>
                {i < 2 && <span className="h-px w-6 bg-line-strong" />}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            {step === 1 && (
              <>
                <div className="rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-8">
                  <h2 className="font-display text-[22px]">{k('schedule')}</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label={k('date')} error={errors.date}>
                      <input type="date" min={todayISO(1)} value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                    </Field>
                    <Field label={k('guestsRange', { a: pkg.group[0], b: pkg.group[1] })}>
                      <select value={pax} onChange={(e) => setPax(+e.target.value)} className={inputCls}>
                        {Array.from({ length: pkg.group[1] - pkg.group[0] + 1 }, (_, i) => pkg.group[0] + i).map((n) => <option key={n} value={n}>{people(n)}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-8">
                  <h2 className="font-display text-[22px]">{k('contact')}</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label={k('name')} error={errors.name} className="sm:col-span-2">
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} autoComplete="name" />
                    </Field>
                    <Field label={k('email')} error={errors.email}>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} autoComplete="email" />
                    </Field>
                    <Field label={k('phone')} error={errors.phone}>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+62" className={inputCls} autoComplete="tel" />
                    </Field>
                    <Field label={k('notes')} className="sm:col-span-2">
                      <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={k('notesPh')} className={cn(inputCls, 'h-auto py-3')} />
                    </Field>
                  </div>
                </div>

                <div className="rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-8">
                  <h2 className="font-display text-[22px]">{k('chooseGuide')}</h2>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <button type="button" onClick={() => setGuide('auto')} className={cn('flex items-center gap-3 rounded-2xl border p-4 text-left', guide === 'auto' ? 'border-forest-900 bg-paper' : 'border-line-strong')}>
                      <span className="grid size-10 place-items-center rounded-full bg-paper-2 ring-1 ring-line-strong"><BadgeCheck className="size-5 text-moss-600" strokeWidth={1.75} /></span>
                      <span><span className="block font-medium">{k('auto')}</span><span className="text-[12.5px] text-muted">{k('autoNote')}</span></span>
                    </button>
                    {crew.map((g) => (
                      <button key={g.id} type="button" onClick={() => setGuide(g.id)} className={cn('flex items-center gap-3 rounded-2xl border p-4 text-left', guide === g.id ? 'border-forest-900 bg-paper' : 'border-line-strong')}>
                        <Monogram name={g.name} size="sm" />
                        <span>
                          <span className="block font-medium">{g.name}</span>
                          <span className="font-mono text-[11.5px] uppercase text-muted">{g.years} {t('guides.yearsShort')} · {g.languages.join(' · ')}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-8">
                  <h2 className="font-display text-[22px]">{k('extras')}</h2>
                  <div className="mt-4 divide-y divide-line">
                    {[
                      [pickup, setPickup, k('pickup'), k('pickupNote', { price: rupiah(450000), n: cars })],
                      [photo, setPhoto, k('photo'), k('photoNote', { price: rupiah(150000) })],
                    ].map(([v, setV, title, note]) => (
                      <label key={title} className="flex cursor-pointer items-center gap-4 py-4">
                        <input type="checkbox" checked={v} onChange={(e) => setV(e.target.checked)} className="size-5 accent-[var(--color-moss-600)]" />
                        <span className="flex-1"><span className="block font-medium">{title}</span><span className="text-[13px] text-muted">{note}</span></span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-8">
                  <h2 className="font-display text-[22px]">{k('payMethod')}</h2>
                  <div className="mt-5 grid gap-2">
                    {payments.map(({ v, label, note, Icon }) => (
                      <label key={v} className={cn('flex cursor-pointer items-center gap-4 rounded-2xl border p-4', pay === v ? 'border-forest-900 bg-paper' : 'border-line-strong')}>
                        <input type="radio" name="pay" value={v} checked={pay === v} onChange={() => setPay(v)} className="size-4 accent-[var(--color-moss-600)]" />
                        <Icon className="size-5 text-moss-600" strokeWidth={1.5} />
                        <span className="flex-1"><span className="block font-medium">{label}</span><span className="text-[13px] text-muted">{note}</span></span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="rounded-[var(--radius-card)] bg-forest-900 p-6 text-paper sm:p-8">
                  <h2 className="font-display text-[22px]">{k('ethics')}</h2>
                  <ul className="mt-4 space-y-2.5">
                    {ethicsRules.slice(0, 4).map((r) => (
                      <li key={tr(r.title)} className="flex gap-3 text-[14px] text-paper/80"><Check className="mt-0.5 size-4 shrink-0 text-sun-500" />{tr(r.title)}</li>
                    ))}
                  </ul>
                  <label className="mt-6 flex cursor-pointer items-start gap-3 border-t border-line-dark pt-5">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 size-5 accent-[var(--color-sun-500)]" />
                    <span className="text-[14px]">{k('agree')}</span>
                  </label>
                  {errors.agree && <p className="mt-2 text-[12.5px] text-sun-500">{errors.agree}</p>}
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              {step > 1 ? <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" /> {t('match.back')}</Button> : <span />}
              <Button variant="primary" size="lg" onClick={next}>
                {step === 1 ? k('continue') : <><Lock className="size-4" /> {k('pay', { total: rupiah(total) })}</>}
              </Button>
            </div>
          </div>

          {/* Ringkasan */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[var(--radius-card)] bg-bone ring-1 ring-line">
              <img src={c.imageSm ?? c.image} alt="" className="h-40 w-full object-cover" />
              <div className="p-6">
                <p className="text-[12px] text-muted">{t('common.corridor')} {c.numeral} · {tr(c.name)}</p>
                <p className="mt-1 font-display text-[22px] leading-tight">{tr(pkg.title)}</p>
                <div className="mt-4 space-y-1.5 text-[13.5px] text-ink-soft">
                  <p className="flex items-center gap-2"><CalendarDays className="size-4" />{date ? fmtDate(date) : k('noDate')} · {dur(pkg.days)}</p>
                  <p className="flex items-center gap-2"><Users className="size-4" />{people(pax)}</p>
                </div>
                <dl className="mt-5 space-y-2 border-t border-line pt-5 text-[14px]">
                  <div className="flex justify-between"><dt className="text-ink-soft">{rupiah(pkg.price)} × {pax}</dt><dd>{rupiah(base)}</dd></div>
                  {pickup && <div className="flex justify-between"><dt className="text-ink-soft">{k('transfer', { n: cars })}</dt><dd>{rupiah(pickupCost)}</dd></div>}
                  {photo && <div className="flex justify-between"><dt className="text-ink-soft">{k('photoShort')}</dt><dd>{rupiah(photoCost)}</dd></div>}
                  <div className="flex justify-between text-[13px]"><dt className="text-ink-soft">{k('inside')}</dt><dd className="text-clay-600">{rupiah(Math.round((base * pkg.breakdown.conservation) / 100))}</dd></div>
                  <div className="flex justify-between border-t border-line pt-3 text-[17px] font-semibold"><dt>{k('total')}</dt><dd>{rupiah(total)}</dd></div>
                </dl>
                <p className="mt-4 text-[12.5px] text-muted">{k('cancel')}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
