import { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BadgeCheck, CalendarDays, Check, Clock, Info, MapPin, MessageCircle, Minus, Plus, ShieldCheck, Users, X } from 'lucide-react'
import { useData } from '../data'
import { cn, rupiah, todayISO } from '../lib/format'
import { useI18n } from '../i18n'
import CostBreakdown from '../components/CostBreakdown'
import CorridorMap from '../components/CorridorMap'
import PackageCard from '../components/PackageCard'
import NotFound from './NotFound'
import { Button, DifficultyBars, Monogram } from '../components/ui'
import { difficultyLevels } from '../lib/constants'

function Section({ id, title, children, className = '' }) {
  return (
    <section id={id} className={cn('scroll-mt-28 border-t border-line py-10', className)}>
      <h2 className="font-display text-[28px] leading-tight sm:text-[32px]">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

export default function PackageDetail() {
  const { slug } = useParams()
  // key → state (tanggal, peserta, tab hari) di-reset saat berpindah paket
  return <PackageDetailView key={slug} slug={slug} />
}

function PackageDetailView({ slug }) {
  const { corridorBySlug, packageBySlug, packages, ethicsRules } = useData()
  const { t, tr, dur, drive, coords, zone, people } = useI18n()
  const navigate = useNavigate()
  const pkg = packageBySlug[slug]
  const [date, setDate] = useState('')
  const [pax, setPax] = useState(2)
  const [day, setDay] = useState(0)
  const [dateHint, setDateHint] = useState(false)
  const dateRef = useRef(null)
  if (!pkg) return <NotFound />

  const c = corridorBySlug[pkg.corridor]
  const level = difficultyLevels[pkg.difficulty]
  const total = pkg.price * pax
  const related = packages
    .filter((p) => p.slug !== pkg.slug && (p.corridor === pkg.corridor || p.interests.some((i) => pkg.interests.includes(i))))
    .slice(0, 3)
  const g = pkg.guide
  const minPax = pkg.group[0]
  const lowSlots = pkg.slots != null && pkg.slots <= 3
  const book = () => {
    if (!date) {
      setDateHint(true)
      dateRef.current?.focus()
      dateRef.current?.showPicker?.()
      return
    }
    navigate(`/pesan/${pkg.slug}?${new URLSearchParams({ tanggal: date, peserta: pax })}`)
  }

  const facts = [
    [Clock, t('detail.factDuration'), pkg.durationLabel ?? dur(pkg.days)],
    [null, t('detail.factDifficulty'), t(`difficulty.${pkg.difficulty}`)],
    [Users, t('detail.factGroup'), `${pkg.group[0]}–${people(pkg.group[1])}`],
    [MapPin, t('detail.factMeet'), tr(c.name)],
  ]

  return (
    <div className="bg-paper pb-24 lg:pb-0">
      {/* Kepala */}
      <section className="pt-[72px]">
        <div className="container-x pt-8">
          <nav aria-label={t('common.breadcrumb')} className="flex flex-wrap items-center gap-1.5 text-[12.5px] text-muted">
            <Link to="/" className="hover:text-ink">{t('common.home')}</Link><span>/</span>
            <Link to="/paket" className="hover:text-ink">{t('catalog.crumb')}</Link><span>/</span>
            <Link to={`/koridor/${c.slug}`} className="hover:text-ink">{tr(c.name)}</Link><span>/</span>
            <span className="text-ink">{tr(pkg.title)}</span>
          </nav>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-moss-600">{zone(c)}</p>
              <h1 className="mt-3 font-display text-[40px] leading-[1.02] sm:text-[60px]">{tr(pkg.title)}</h1>
              <p className="mt-4 text-[17px] leading-relaxed text-ink-soft">{tr(pkg.tagline)}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {pkg.familyFriendly && <span className="rounded-full bg-sage-100 px-3 py-1.5 text-[12.5px] font-medium text-moss-600">{t('common.familyFriendly')}</span>}
              {pkg.tripType && <span className="rounded-full bg-bone px-3 py-1.5 text-[12.5px] ring-1 ring-line">{t(`detail.tripType.${pkg.tripType}`)}</span>}
              {pkg.operator ? (
                <span className="rounded-full bg-bone px-3 py-1.5 text-[12.5px] ring-1 ring-line">{t('detail.operator', { name: pkg.operator })}</span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-bone px-3 py-1.5 text-[12.5px] ring-1 ring-line"><BadgeCheck className="size-3.5 text-moss-600" />{t('detail.hpiGuide')}</span>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="relative overflow-hidden rounded-[var(--radius-card)]">
              <img src={pkg.image ?? c.image} alt={pkg.image ? tr(pkg.title) : tr(c.imageAlt)} className="aspect-[16/10] size-full object-cover lg:aspect-auto lg:max-h-[520px]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-forest-950/70 to-transparent p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-paper/80">{coords(c.coords)} · {t('common.corridor')} {c.numeral}</p>
              </div>
            </div>
            <div className="hidden flex-col rounded-[var(--radius-card)] bg-forest-900 p-5 text-paper lg:flex">
              <CorridorMap active={c.slug} tone="dark" compact />
              <div className="mt-auto border-t border-line-dark pt-4">
                <p className="text-[13px] text-paper/60">± {c.access.km} km · {t('corridorPage.fromCity', { city: c.access.from })} · {drive(c.access.hours)}</p>
                <Link to={`/koridor/${c.slug}`} className="mt-2 inline-flex text-sm font-medium text-sun-500 underline underline-offset-4">{t('detail.aboutCorridor', { name: tr(c.name) })}</Link>
              </div>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-bone sm:grid-cols-4">
            {facts.map(([Icon, k, v], i) => (
              <div key={k} className={cn('p-4 sm:p-5', i % 2 === 0 && 'border-r border-line', i < 2 && 'border-b border-line sm:border-b-0', i === 1 && 'sm:border-r')}>
                <dt className="flex items-center gap-1.5 text-[12px] text-muted">
                  {Icon ? <Icon className="size-3.5" /> : <DifficultyBars level={level} className="text-moss-600" />}
                  {k}
                </dt>
                <dd className="mt-1 text-[15px] font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="container-x grid gap-12 pb-20 pt-4 lg:grid-cols-[1fr_380px] lg:gap-16">
        <div>
          <Section title={t('detail.highlights')}>
            <ul className="grid gap-3 sm:grid-cols-3">
              {pkg.highlights.map((h, i) => (
                <li key={tr(h)} className="rounded-2xl bg-bone p-5 ring-1 ring-line">
                  <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                  <p className="mt-3 text-[15px] leading-snug">{tr(h)}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-2xl whitespace-pre-line text-[15.5px] leading-relaxed text-ink-soft">{tr(pkg.about ?? c.long)}</p>
          </Section>

          <Section id="itinerary" title={t('detail.itinerary')}>
            {pkg.itinerary.length > 1 && (
              <div className="mb-6 flex flex-wrap gap-2" role="tablist">
                {pkg.itinerary.map((d, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={day === i}
                    onClick={() => setDay(i)}
                    className={cn('rounded-full px-4 py-2 text-[13px] font-medium transition-colors', day === i ? 'bg-forest-900 text-paper' : 'bg-bone ring-1 ring-line hover:ring-ink/30')}
                  >
                    {d.label ?? t('detail.day', { n: i + 1 })}
                    {tr(d.title) && <span className={cn('ml-1 font-normal', day === i ? 'text-paper/60' : 'text-muted')}>· {tr(d.title)}</span>}
                  </button>
                ))}
              </div>
            )}
            <ol className="relative">
              {pkg.itinerary[day].items.map(([time, text], i, arr) => (
                <li key={time + tr(text)} className="relative grid grid-cols-[72px_1fr] gap-4 pb-6 last:pb-0">
                  <span className="pt-0.5 font-mono text-[12.5px] leading-snug text-muted [overflow-wrap:anywhere]">{time}</span>
                  <div className="relative pl-6">
                    <span className="absolute left-0 top-1.5 size-2.5 rounded-full border-2 border-moss-600 bg-paper" />
                    {i < arr.length - 1 && <span className="absolute left-[4.5px] top-5 h-[calc(100%+0.25rem)] w-px bg-line-strong" />}
                    <p className="text-[15.5px] leading-snug">{tr(text)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section title={t('detail.included')}>
            <div className="grid gap-6 sm:grid-cols-2">
              <ul className="space-y-2.5">
                {pkg.includes.map((x) => (
                  <li key={tr(x)} className="flex gap-3 text-[15px]"><Check className="mt-0.5 size-4.5 shrink-0 text-moss-600" />{tr(x)}</li>
                ))}
              </ul>
              <ul className="space-y-2.5">
                {pkg.excludes.map((x) => (
                  <li key={tr(x)} className="flex gap-3 text-[15px] text-ink-soft"><X className="mt-0.5 size-4.5 shrink-0 text-muted" />{tr(x)}</li>
                ))}
              </ul>
            </div>
          </Section>

          {(pkg.notes.length > 0 || pkg.preparation.length > 0) && (
            <Section title={pkg.notes.length ? t('detail.notes') : t('detail.preparation')}>
              <div className="grid gap-6 sm:grid-cols-2">
                {pkg.notes.length > 0 && (
                  <ul className="space-y-2.5">
                    {pkg.notes.map((x) => (
                      <li key={tr(x)} className="flex gap-3 text-[15px]"><Info className="mt-0.5 size-4.5 shrink-0 text-muted" />{tr(x)}</li>
                    ))}
                  </ul>
                )}
                {pkg.preparation.length > 0 && (
                  <div>
                    {pkg.notes.length > 0 && <p className="mb-3 font-medium">{t('detail.preparation')}</p>}
                    <ul className="space-y-2.5">
                      {pkg.preparation.map((x) => (
                        <li key={tr(x)} className="flex gap-3 text-[15px] text-ink-soft"><Check className="mt-0.5 size-4.5 shrink-0 text-moss-600" />{tr(x)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Section>
          )}

          <Section id="biaya" title={t('detail.costTitle')}>
            <div className="rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-8">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-[14px] text-ink-soft">{t('detail.costFor', { people: people(pax) })}</p>
                <p className="text-[22px] font-semibold tracking-tight">{rupiah(total)}</p>
              </div>
              {pkg.breakdown ? (
                <>
                  <CostBreakdown breakdown={pkg.breakdown} total={total} />
                  <p className="mt-6 flex gap-2 border-t border-line pt-5 text-[13px] leading-relaxed text-muted">
                    <Info className="mt-0.5 size-4 shrink-0" />
                    {t('detail.costNote')}
                  </p>
                </>
              ) : (
                <p className="flex gap-2 text-[14px] leading-relaxed text-ink-soft">
                  <Info className="mt-0.5 size-4 shrink-0 text-muted" />
                  {t('detail.costPending')}
                </p>
              )}
            </div>
          </Section>

          <Section title={t('detail.ethicsTitle')}>
            <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {ethicsRules.slice(0, 4).map((r) => (
                <li key={tr(r.title)} className="flex gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-clay-500" strokeWidth={1.5} />
                  <div>
                    <p className="font-medium">{tr(r.title)}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-ink-soft">{tr(r.text)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Section>

          {g && (
            <Section title={t('detail.guideTitle')}>
              <div className="flex items-center gap-4 rounded-[var(--radius-card)] bg-bone p-5 ring-1 ring-line">
                <Monogram name={g.name} src={g.photo} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="font-display text-[22px] leading-tight">{g.name}</p>
                  <p className="text-[13px] text-muted">{tr(g.role)} · {t('detail.experience', { n: g.years })}</p>
                  <p className="mt-1 font-mono text-[11.5px] uppercase tracking-[0.06em] text-ink-soft">{g.languages.join(' · ')}</p>
                </div>
                <span className="hidden items-center gap-1.5 font-mono text-[11px] text-moss-600 sm:inline-flex">
                  <BadgeCheck className="size-3.5" strokeWidth={1.75} />
                  {g.license ?? g.organization}
                </span>
              </div>
              <p className="mt-3 text-[13px] text-muted">{t('detail.guideNote')}</p>
            </Section>
          )}

          <Section title={t('detail.meetTitle')}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="flex items-center gap-2 font-medium"><MapPin className="size-4 text-moss-600" />{tr(pkg.meetingPoint)}</p>
                <p className="mt-2 text-[14px] text-ink-soft">{t('detail.meetText', { km: c.access.km, from: c.access.from, time: drive(c.access.hours) })}</p>
              </div>
              <div>
                <p className="font-medium">{t('detail.cancelTitle')}</p>
                <p className="mt-2 text-[14px] text-ink-soft">{t('detail.cancelText')}</p>
              </div>
            </div>
          </Section>
        </div>

        {/* Kartu pemesanan */}
        <aside id="pesan" className="scroll-mt-24 lg:pt-10">
          <div className="sticky top-24 rounded-[var(--radius-card)] bg-bone p-6 shadow-[0_24px_48px_-28px_rgb(22_26_20/0.35)] ring-1 ring-line">
            <p className="text-[12px] text-muted">{t('detail.pricePer')}</p>
            <p className="text-[28px] font-semibold tracking-tight">{rupiah(pkg.price)}</p>
            {pkg.priceNote && <p className="mt-1 text-[12.5px] leading-snug text-muted">{pkg.priceNote}</p>}

            <div className="mt-5 overflow-hidden rounded-2xl border border-line-strong">
              <label className={cn('block border-b border-line-strong px-4 py-3 transition-colors', dateHint && !date && 'bg-clay-100')}>
                <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted"><CalendarDays className="size-3.5" />{t('detail.date')}</span>
                <input ref={dateRef} type="date" min={todayISO(1)} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full bg-transparent text-[15px] font-medium focus:outline-none" />
              </label>
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted"><Users className="size-3.5" />{t('detail.guests')}</span>
                  <span className="mt-1 block text-[15px] font-medium">{people(pax)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setPax((p) => Math.max(minPax, p - 1))} disabled={pax <= minPax} className="grid size-9 place-items-center rounded-full border border-line-strong hover:border-ink disabled:opacity-30" aria-label={t('common.decrease')}><Minus className="size-4" /></button>
                  <button type="button" onClick={() => setPax((p) => Math.min(pkg.group[1], p + 1))} disabled={pax >= pkg.group[1]} className="grid size-9 place-items-center rounded-full border border-line-strong hover:border-ink disabled:opacity-30" aria-label={t('common.increase')}><Plus className="size-4" /></button>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-[14px]">
              <div className="flex justify-between text-ink-soft"><span>{t('detail.times', { price: rupiah(pkg.price), people: people(pax) })}</span><span>{rupiah(total)}</span></div>
              {pkg.breakdown && (
                <div className="flex justify-between text-ink-soft">
                  <span>{t('detail.inclConservation')}</span>
                  <span className="text-clay-600">{rupiah(Math.round((total * pkg.breakdown.conservation) / 100))}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-[16px] font-semibold"><span>{t('detail.total')}</span><span>{rupiah(total)}</span></div>
            </div>

            {g && (
              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-paper px-4 py-3">
                <Monogram name={g.name} src={g.photo} size="sm" />
                <p className="text-[13px] leading-snug"><span className="block text-muted">{t('detail.guidedBy')}</span><span className="font-medium">{g.name}</span></p>
              </div>
            )}

            <Button variant="primary" size="lg" className="mt-5 w-full" onClick={book}>
              {t('detail.book')}
            </Button>
            <p className={cn('mt-3 text-center text-[12.5px]', (dateHint && !date) || lowSlots ? 'font-medium text-clay-600' : 'text-muted')}>
              {dateHint && !date ? t('detail.pickDate') : lowSlots ? t('detail.slotsLeft', { n: pkg.slots }) : t('detail.noPayment')}
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
              <MessageCircle className="size-5 text-moss-600" strokeWidth={1.5} />
              <p className="flex-1 text-[13px] text-ink-soft">{t('detail.question')}</p>
              <a href="https://wa.me/6281200000000" className="text-[13px] font-medium underline underline-offset-4">{t('detail.ask')}</a>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-line bg-paper-2 py-16 sm:py-20">
          <div className="container-x">
            <h2 className="font-display text-[32px] leading-tight sm:text-[40px]">{t('detail.related')}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <PackageCard key={p.slug} pkg={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Bar pemesanan mobile */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-line bg-bone/95 px-5 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="text-[11px] text-muted">{t('common.from')}</p>
          <p className="text-[17px] font-semibold">{rupiah(pkg.price)}<span className="text-[12px] font-normal text-muted"> {t('common.perPerson')}</span></p>
        </div>
        <Button href="#pesan" variant="primary">{t('detail.chooseDate')}</Button>
      </div>
    </div>
  )
}
