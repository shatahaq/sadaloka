import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, BadgeCheck, Check, Languages, Search, X } from 'lucide-react'
import { guides, allLanguages } from '../data/guides'
import { corridors, corridorBySlug } from '../data/corridors'
import { cn } from '../lib/format'
import { useI18n } from '../i18n'
import PageHeader from '../components/PageHeader'
import { Button, Chip, Monogram } from '../components/ui'

/** Status ketersediaan — titik kecil + teks, tanpa pill berwarna */
function Availability({ available }) {
  const { t } = useI18n()
  return (
    <span className={cn('inline-flex items-center gap-1.5', available ? 'text-ink-soft' : 'text-muted')}>
      <span className={cn('size-1.5 rounded-full', available ? 'bg-moss-500' : 'bg-line-strong')} />
      {available ? t('guides.available') : t('guides.full')}
    </span>
  )
}

function GuideCard({ guide: g, onOpen }) {
  const { t, tr, num } = useI18n()
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col rounded-[var(--radius-card)] bg-bone text-left ring-1 ring-line transition-[box-shadow] duration-300 hover:shadow-[0_22px_44px_-28px_rgb(22_26_20/0.5)] hover:ring-ink/20"
    >
      {/* Identitas */}
      <div className="flex items-start gap-4 p-6 pb-5">
        <Monogram name={g.name} />
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="font-display text-[21px] leading-tight text-ink">{g.name}</p>
          <p className="mt-1 text-[13.5px] text-muted">{tr(g.role)}</p>
        </div>
        <ArrowUpRight
          className="size-4.5 shrink-0 text-muted transition-[transform,color] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      {/* Angka kunci */}
      <dl className="mx-6 grid grid-cols-3 border-y border-line">
        <div className="py-3.5 pr-3">
          <dt className="text-[11.5px] text-muted">{t('guides.experience')}</dt>
          <dd className="mt-0.5 text-[15px] font-medium tabular-nums">
            {g.years} <span className="font-normal text-muted">{t('guides.yearsShort')}</span>
          </dd>
        </div>
        <div className="border-l border-line px-3 py-3.5">
          <dt className="text-[11.5px] text-muted">{t('guides.trips')}</dt>
          <dd className="mt-0.5 text-[15px] font-medium tabular-nums">{num(g.trips)}+</dd>
        </div>
        <div className="border-l border-line py-3.5 pl-3">
          <dt className="text-[11.5px] text-muted">{t('guides.languages')}</dt>
          <dd className="mt-1 font-mono text-[12.5px] uppercase tracking-[0.06em] text-ink">{g.languages.join(' · ')}</dd>
        </div>
      </dl>

      {/* Detail */}
      <dl className="flex-1 space-y-2.5 px-6 py-5 text-[13.5px] leading-snug">
        <div className="grid grid-cols-[84px_1fr] gap-3">
          <dt className="text-muted">{t('guides.specialties')}</dt>
          <dd className="text-ink-soft">{g.specialties.map(tr).join(', ')}</dd>
        </div>
        <div className="grid grid-cols-[84px_1fr] gap-3">
          <dt className="text-muted">{t('guides.corridors')}</dt>
          <dd className="text-ink-soft">{g.corridors.map((s) => tr(corridorBySlug[s].name)).join(', ')}</dd>
        </div>
      </dl>

      {/* Kredensial */}
      <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4 text-[12.5px]">
        <span className="inline-flex items-center gap-1.5 font-mono text-[11.5px] text-moss-600">
          <BadgeCheck className="size-3.5" strokeWidth={1.75} />
          {g.license}
        </span>
        <Availability available={g.available} />
      </div>
    </button>
  )
}

function GuideDrawer({ guide, onClose }) {
  const { t, tr, num } = useI18n()

  useEffect(() => {
    if (!guide) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [guide, onClose])

  return (
    <div className={cn('fixed inset-0 z-[60]', guide ? 'visible' : 'invisible')} aria-hidden={!guide}>
      <div className={cn('absolute inset-0 bg-forest-950/50 transition-opacity duration-300', guide ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={guide ? t('guides.profileOf', { name: guide.name }) : undefined}
        className={cn(
          'absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[var(--ease-out-expo)]',
          guide ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {guide && (
          <>
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-moss-600">
                <BadgeCheck className="size-4" strokeWidth={1.75} />
                {t('guides.verified')} · <span className="font-mono text-[11.5px]">{guide.license}</span>
              </span>
              <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-full hover:bg-ink/5" aria-label={t('guides.closeProfile')}>
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="px-6 pb-6 pt-8">
                <div className="flex items-center gap-5">
                  <Monogram name={guide.name} size="lg" />
                  <div>
                    <h2 className="font-display text-[30px] leading-tight">{guide.name}</h2>
                    <p className="text-ink-soft">{tr(guide.role)}</p>
                    <p className="mt-2 text-[13px]"><Availability available={guide.available} /></p>
                  </div>
                </div>
              </div>

              <dl className="mx-6 grid grid-cols-3 border-y border-line">
                <div className="py-4 pr-3">
                  <dt className="text-[12px] text-muted">{t('guides.experience')}</dt>
                  <dd className="mt-1 font-display text-[28px] leading-none">
                    {guide.years}
                    <span className="ml-1 font-sans text-[13px] text-muted">{t('guides.years')}</span>
                  </dd>
                </div>
                <div className="border-l border-line px-3 py-4">
                  <dt className="text-[12px] text-muted">{t('guides.tripsGuided')}</dt>
                  <dd className="mt-1 font-display text-[28px] leading-none">{num(guide.trips)}+</dd>
                </div>
                <div className="border-l border-line py-4 pl-3">
                  <dt className="text-[12px] text-muted">{t('guides.languages')}</dt>
                  <dd className="mt-1 font-display text-[28px] leading-none">{guide.languages.length}</dd>
                </div>
              </dl>

              <div className="px-6 py-7">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{t('guides.about')}</p>
                <p className="mt-2.5 text-[15.5px] leading-relaxed">{tr(guide.bio)}</p>
              </div>

              <dl className="mx-6 divide-y divide-line border-t border-line text-[14px]">
                <div className="grid grid-cols-[120px_1fr] gap-4 py-4">
                  <dt className="text-muted">{t('guides.specialties')}</dt>
                  <dd>{guide.specialties.map(tr).join(', ')}</dd>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 py-4">
                  <dt className="text-muted">{t('guides.languages')}</dt>
                  <dd>{guide.languages.map((l) => t(`langNames.${l}`)).join(', ')}</dd>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 py-4">
                  <dt className="text-muted">{t('guides.certs')}</dt>
                  <dd>
                    <ul className="space-y-1.5">
                      {guide.certs.map((c) => (
                        <li key={tr(c)} className="flex items-start gap-2">
                          <Check className="mt-0.5 size-4 shrink-0 text-moss-600" strokeWidth={2} />
                          {tr(c)}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-4 py-4">
                  <dt className="text-muted">{t('guides.corridors')}</dt>
                  <dd>
                    <ul className="space-y-2">
                      {guide.corridors.map((s) => {
                        const c = corridorBySlug[s]
                        return (
                          <li key={s} className="flex items-center gap-3">
                            <img src={c.imageSm ?? c.image} alt="" className="size-9 rounded-lg object-cover" />
                            <span className="flex-1">{tr(c.name)}</span>
                            <span className="font-display text-muted">{c.numeral}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="border-t border-line p-4">
              <Button to={`/paket?koridor=${guide.corridors.join(',')}`} variant={guide.available ? 'primary' : 'outline'} size="lg" className="w-full">
                {guide.available ? t('guides.cta', { name: guide.name.split(' ')[0] }) : t('guides.ctaFull')}
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default function Guides() {
  const { t, tr } = useI18n()
  const [q, setQ] = useState('')
  const [corridor, setCorridor] = useState('')
  const [lang, setLang] = useState('')
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return guides.filter(
      (g) =>
        // pencarian mencakup teks ID & EN agar "gajah" maupun "elephant" sama-sama ketemu
        (!term ||
          [g.name, g.role.id, g.role.en, ...g.specialties.flatMap((s) => (typeof s === 'string' ? [s] : [s.id, s.en]))]
            .join(' ')
            .toLowerCase()
            .includes(term)) &&
        (!corridor || g.corridors.includes(corridor)) &&
        (!lang || g.languages.includes(lang)) &&
        (!onlyAvailable || g.available),
    )
  }, [q, corridor, lang, onlyAvailable])

  const reset = () => {
    setQ('')
    setCorridor('')
    setLang('')
    setOnlyAvailable(false)
  }

  return (
    <>
      <PageHeader
        crumbs={[[t('guides.crumb')]]}
        eyebrow={t('guides.eyebrow')}
        title={<>{t('guides.title1')} <em className="font-[350] text-moss-600">{t('guides.title2')}</em></>}
        intro={t('guides.intro')}
      >
        <dl className="flex gap-8">
          <div><dt className="text-[12px] text-muted">{t('guides.active')}</dt><dd className="font-display text-4xl">{guides.length}</dd></div>
          <div>
            <dt className="text-[12px] text-muted">{t('guides.avgExp')}</dt>
            <dd className="font-display text-4xl">
              {Math.round(guides.reduce((a, g) => a + g.years, 0) / guides.length)}
              <span className="ml-1 font-sans text-sm text-muted">{t('guides.yearsShort')}</span>
            </dd>
          </div>
        </dl>
      </PageHeader>

      <section className="bg-paper py-10 sm:py-14">
        <div className="container-x">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex h-12 flex-1 items-center gap-3 rounded-full border border-line-strong bg-bone px-5 focus-within:border-ink">
              <Search className="size-4.5 text-muted" />
              <span className="sr-only">{t('guides.searchLabel')}</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('guides.searchPh')} className="h-full flex-1 bg-transparent text-[15px] placeholder:text-muted focus:outline-none" />
            </label>
            <div className="flex flex-wrap gap-2">
              <label className="flex h-12 items-center gap-2 rounded-full border border-line-strong bg-bone px-4 text-[14px]">
                <span className="sr-only">{t('guides.corridors')}</span>
                <select value={corridor} onChange={(e) => setCorridor(e.target.value)} className="bg-transparent focus:outline-none">
                  <option value="">{t('guides.allCorridors')}</option>
                  {corridors.map((c) => <option key={c.slug} value={c.slug}>{tr(c.name)}</option>)}
                </select>
              </label>
              <label className="flex h-12 items-center gap-2 rounded-full border border-line-strong bg-bone px-4 text-[14px]">
                <Languages className="size-4 text-muted" />
                <span className="sr-only">{t('guides.languages')}</span>
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent focus:outline-none">
                  <option value="">{t('guides.allLanguages')}</option>
                  {allLanguages.map((l) => <option key={l} value={l}>{t(`langNames.${l}`)}</option>)}
                </select>
              </label>
              <Chip active={onlyAvailable} onClick={() => setOnlyAvailable((v) => !v)} className="h-12 px-5">{t('guides.availableWeek')}</Chip>
            </div>
          </div>

          <p className="mt-6 text-[14px] text-ink-soft"><span className="font-semibold text-ink">{list.length}</span> {t(list.length === 1 ? 'guides.countOne' : 'guides.count')}</p>

          <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {list.map((g) => (
              <li key={g.id}>
                <GuideCard guide={g} onOpen={() => setOpen(g)} />
              </li>
            ))}
          </ul>

          {list.length === 0 && (
            <div className="mt-4 rounded-[var(--radius-card)] border border-dashed border-line-strong px-6 py-14 text-center">
              <p className="font-display text-2xl">{t('guides.noResult')}</p>
              <button type="button" className="mt-3 text-sm underline underline-offset-4" onClick={reset}>{t('guides.resetSearch')}</button>
            </div>
          )}

          <div className="mt-14 grid gap-6 rounded-[var(--radius-card)] border border-line-strong p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-display text-[28px] leading-tight">{t('guides.joinTitle')}</p>
              <p className="mt-2 max-w-xl text-[15px] text-ink-soft">{t('guides.joinText')}</p>
            </div>
            <Button href="https://wa.me/6281200000000" variant="dark" size="lg">{t('guides.joinCta')}</Button>
          </div>
        </div>
      </section>

      <GuideDrawer guide={open} onClose={close} />
    </>
  )
}
