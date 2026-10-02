import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CalendarDays, SlidersHorizontal, Sparkles, Users, X } from 'lucide-react'
import { corridors, corridorBySlug } from '../data/corridors'
import { difficultyLevels, interestKeys, packages } from '../data/packages'
import { cn, rupiah } from '../lib/format'
import { useI18n } from '../i18n'
import PageHeader from '../components/PageHeader'
import PackageCard from '../components/PackageCard'
import { Button, Chip, DifficultyBars } from '../components/ui'

const MAX_PRICE = 2500000
const durations = [1, 2, 3]
const sorts = {
  rec: { key: 'catalog.sortRec', fn: (a, b) => a.slots - b.slots },
  cheap: { key: 'catalog.sortCheap', fn: (a, b) => a.price - b.price },
  pricey: { key: 'catalog.sortPricey', fn: (a, b) => b.price - a.price },
  short: { key: 'catalog.sortShort', fn: (a, b) => a.days - b.days || a.price - b.price },
}

function FilterGroup({ title, children }) {
  return (
    <fieldset className="border-b border-line py-6 first:pt-0 last:border-0">
      <legend className="mb-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{title}</legend>
      {children}
    </fieldset>
  )
}

export default function Packages() {
  const { t, tr, dur, fmtDate, people } = useI18n()
  const [params, setParams] = useSearchParams()
  const corridorSel = params.get('koridor') ? params.get('koridor').split(',') : []
  const date = params.get('tanggal')
  const pax = params.get('peserta')

  const [days, setDays] = useState([])
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [difficulty, setDifficulty] = useState([])
  const [interests, setInterests] = useState([])
  const [family, setFamily] = useState(false)
  const [sort, setSort] = useState('rec')
  const [sheet, setSheet] = useState(false)

  const toggle = (list, set, v) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
  const setCorridors = (next) => {
    const p = new URLSearchParams(params)
    if (next.length) p.set('koridor', next.join(','))
    else p.delete('koridor')
    setParams(p, { replace: true })
  }

  const results = useMemo(
    () =>
      packages
        .filter((p) => !corridorSel.length || corridorSel.includes(p.corridor))
        .filter((p) => !days.length || days.includes(Math.min(p.days, 3)))
        .filter((p) => p.price <= maxPrice)
        .filter((p) => !difficulty.length || difficulty.includes(p.difficulty))
        .filter((p) => !interests.length || interests.some((i) => p.interests.includes(i)))
        .filter((p) => !family || p.familyFriendly)
        .sort(sorts[sort].fn),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [corridorSel.join(), days, maxPrice, difficulty, interests, family, sort],
  )

  const activeChips = [
    ...corridorSel.map((s) => ({ id: `c-${s}`, label: tr(corridorBySlug[s]?.name), clear: () => setCorridors(corridorSel.filter((x) => x !== s)) })),
    ...days.map((d) => ({ id: `d-${d}`, label: dur(d), clear: () => toggle(days, setDays, d) })),
    ...(maxPrice < MAX_PRICE ? [{ id: 'price', label: `≤ ${rupiah(maxPrice)}`, clear: () => setMaxPrice(MAX_PRICE) }] : []),
    ...difficulty.map((d) => ({ id: `x-${d}`, label: t(`difficulty.${d}`), clear: () => toggle(difficulty, setDifficulty, d) })),
    ...interests.map((i) => ({ id: `i-${i}`, label: t(`interests.${i}`), clear: () => toggle(interests, setInterests, i) })),
    ...(family ? [{ id: 'family', label: t('common.familyFriendly'), clear: () => setFamily(false) }] : []),
  ]
  const resetAll = () => {
    setCorridors([])
    setDays([])
    setMaxPrice(MAX_PRICE)
    setDifficulty([])
    setInterests([])
    setFamily(false)
  }

  const filters = (
    <div>
      <FilterGroup title={t('catalog.fCorridor')}>
        <div className="space-y-1">
          {corridors.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-[14px]">
              <input
                type="checkbox"
                checked={corridorSel.includes(c.slug)}
                onChange={() => setCorridors(corridorSel.includes(c.slug) ? corridorSel.filter((x) => x !== c.slug) : [...corridorSel, c.slug])}
                className="size-4 accent-[var(--color-moss-600)]"
              />
              <span className="w-6 font-display text-muted">{c.numeral}</span>
              <span className="flex-1">{tr(c.name)}</span>
              <span className="font-mono text-[11px] text-muted">{packages.filter((p) => p.corridor === c.slug).length}</span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t('catalog.fDuration')}>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => (
            <Chip key={d} active={days.includes(d)} onClick={() => toggle(days, setDays, d)}>{dur(d)}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t('catalog.fBudget')}>
        <div className="flex items-baseline justify-between text-[14px]">
          <span className="text-muted">{t('catalog.max')}</span>
          <span className="font-semibold">{maxPrice >= MAX_PRICE ? t('catalog.anyPrice') : rupiah(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={150000}
          max={MAX_PRICE}
          step={50000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="range mt-4"
          style={{ '--fill': `${((maxPrice - 150000) / (MAX_PRICE - 150000)) * 100}%` }}
          aria-label={t('catalog.fBudget')}
        />
        <div className="mt-2 flex justify-between font-mono text-[10.5px] text-muted">
          <span>Rp 150.000</span>
          <span>Rp 2.500.000</span>
        </div>
      </FilterGroup>

      <FilterGroup title={t('catalog.fDifficulty')}>
        <div className="space-y-1">
          {Object.entries(difficultyLevels).map(([k, level]) => (
            <label key={k} className="flex cursor-pointer items-start gap-3 py-1.5">
              <input type="checkbox" checked={difficulty.includes(k)} onChange={() => toggle(difficulty, setDifficulty, k)} className="mt-1 size-4 accent-[var(--color-moss-600)]" />
              <span>
                <span className="flex items-center gap-2 text-[14px]"><DifficultyBars level={level} className="text-moss-600" />{t(`difficulty.${k}`)}</span>
                <span className="block text-[12.5px] text-muted">{t(`difficulty.${k}Note`)}</span>
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t('catalog.fInterests')}>
        <div className="flex flex-wrap gap-2">
          {interestKeys.map((i) => (
            <Chip key={i} active={interests.includes(i)} onClick={() => toggle(interests, setInterests, i)}>{t(`interests.${i}`)}</Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title={t('catalog.fOther')}>
        <label className="flex cursor-pointer items-center justify-between gap-3 text-[14px]">
          {t('catalog.familyOnly')}
          <button
            type="button"
            role="switch"
            aria-checked={family}
            onClick={() => setFamily((v) => !v)}
            className={cn('relative h-6 w-11 rounded-full transition-colors', family ? 'bg-moss-600' : 'bg-line-strong')}
          >
            <span className={cn('absolute top-0.5 size-5 rounded-full bg-bone shadow transition-transform', family ? 'translate-x-[22px]' : 'translate-x-0.5')} />
          </button>
        </label>
      </FilterGroup>
    </div>
  )

  return (
    <>
      <PageHeader
        crumbs={[[t('catalog.crumb')]]}
        eyebrow={t('catalog.eyebrow')}
        title={<>{t('catalog.title1')} <em className="font-[350] text-moss-600">{t('catalog.title2')}</em></>}
        intro={t('catalog.intro')}
      >
        {(date || pax) && (
          <div className="flex flex-wrap gap-2 rounded-2xl border border-line bg-bone p-2 text-[13px]">
            {date && <span className="inline-flex items-center gap-2 rounded-xl bg-paper px-3 py-2"><CalendarDays className="size-4 text-moss-600" />{fmtDate(date)}</span>}
            {pax && <span className="inline-flex items-center gap-2 rounded-xl bg-paper px-3 py-2"><Users className="size-4 text-moss-600" />{people(+pax)}</span>}
          </div>
        )}
      </PageHeader>

      <section className="bg-paper py-10 sm:py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-3 [scrollbar-width:thin]">{filters}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[14px] text-ink-soft">
                <span className="font-semibold text-ink">{results.length}</span> {t(results.length === 1 ? 'catalog.foundOne' : 'catalog.found')}
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setSheet(true)}>
                  <SlidersHorizontal className="size-4" /> {t('catalog.filter')}
                  {activeChips.length > 0 && <span className="grid size-5 place-items-center rounded-full bg-forest-900 text-[10px] text-paper">{activeChips.length}</span>}
                </Button>
                <label className="flex items-center gap-2 text-[13px] text-muted">
                  <span className="hidden sm:inline">{t('catalog.sort')}</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 rounded-full border border-line-strong bg-bone px-3 text-[13px] text-ink focus:outline-none">
                    {Object.entries(sorts).map(([k, s]) => <option key={k} value={k}>{t(s.key)}</option>)}
                  </select>
                </label>
              </div>
            </div>

            {activeChips.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {activeChips.map((c) => (
                  <button key={c.id} type="button" onClick={c.clear} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-sage-100 pl-3 pr-2 text-[12.5px] text-moss-600 hover:bg-sage-200">
                    {c.label} <X className="size-3.5" />
                  </button>
                ))}
                <button type="button" onClick={resetAll} className="ml-1 text-[12.5px] text-muted underline underline-offset-4 hover:text-ink">{t('catalog.clearAll')}</button>
              </div>
            )}

            {results.length > 0 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p) => <PackageCard key={p.slug} pkg={p} />)}
              </div>
            ) : (
              <div className="mt-6 rounded-[var(--radius-card)] border border-dashed border-line-strong bg-bone px-6 py-16 text-center">
                <p className="font-display text-3xl">{t('catalog.emptyTitle')}</p>
                <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-soft">{t('catalog.emptyText')}</p>
                <div className="mt-6 flex justify-center gap-3">
                  <Button variant="outline" onClick={resetAll}>{t('catalog.reset')}</Button>
                  <Button to="/smart-match" variant="dark"><Sparkles className="size-4" /> {t('catalog.tryMatch')}</Button>
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-[var(--radius-card)] bg-forest-900 p-6 text-paper sm:flex-row sm:items-center sm:p-8">
              <div>
                <p className="font-display text-[24px] leading-tight">{t('catalog.customTitle')}</p>
                <p className="mt-1 text-[14px] text-paper/65">{t('catalog.customText')}</p>
              </div>
              <Button href="https://wa.me/6281200000000" variant="light">{t('catalog.customCta')}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sheet filter mobile */}
      <div className={cn('fixed inset-0 z-[60] lg:hidden', sheet ? 'visible' : 'invisible')} aria-hidden={!sheet}>
        <div className={cn('absolute inset-0 bg-forest-950/50 transition-opacity', sheet ? 'opacity-100' : 'opacity-0')} onClick={() => setSheet(false)} />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-paper transition-transform duration-500 ease-[var(--ease-out-expo)]',
            sheet ? 'translate-y-0' : 'translate-y-full',
          )}
          role="dialog"
          aria-label={t('catalog.sheetAria')}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="font-medium">{t('catalog.filter')}</p>
            <button type="button" onClick={() => setSheet(false)} className="grid size-9 place-items-center rounded-full hover:bg-ink/5" aria-label={t('catalog.closeFilter')}><X className="size-5" /></button>
          </div>
          <div className="overflow-y-auto px-5 py-6">{filters}</div>
          <div className="flex gap-3 border-t border-line p-4">
            <Button variant="outline" className="flex-1" onClick={resetAll}>{t('catalog.resetShort')}</Button>
            <Button variant="dark" className="flex-[2]" onClick={() => setSheet(false)}>{t('catalog.show', { n: results.length })}</Button>
          </div>
        </div>
      </div>
    </>
  )
}
