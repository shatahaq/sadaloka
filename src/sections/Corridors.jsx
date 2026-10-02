import { useEffect, useRef, useState } from 'react'
import { Clock, Leaf, Sun } from 'lucide-react'
import { corridors, corridorBySlug } from '../data/corridors'
import { rupiah } from '../lib/format'
import { useI18n } from '../i18n'
import CorridorMap from '../components/CorridorMap'
import { ArrowLink, Eyebrow } from '../components/ui'

export default function Corridors() {
  const { t, tr, coords, drive, zone } = useI18n()
  const [active, setActive] = useState(corridors[0].slug)
  const refs = useRef({})

  // Koridor yang berada di tengah viewport menjadi aktif → pin peta ikut menyala
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.dataset.slug)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    Object.values(refs.current).forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const jumpTo = (slug) => {
    setActive(slug)
    refs.current[slug]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const a = corridorBySlug[active]

  return (
    <section id="koridor" className="relative bg-forest-900 py-20 text-paper sm:py-28">
      <div className="topo-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative">
        <div className="reveal max-w-3xl">
          <Eyebrow tone="light">{t('corridors.eyebrow')}</Eyebrow>
          <h2 className="mt-4 font-display text-[40px] leading-[1.02] sm:text-[56px]">
            {t('corridors.title1')} <em className="font-[350] text-sun-500">{t('corridors.title2')}</em>
          </h2>
          <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-paper/70 sm:text-[17px]">{t('corridors.intro')}</p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Peta (sticky di desktop) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--radius-card)] border border-line-dark bg-forest-950/50 p-5 sm:p-6">
              <CorridorMap active={active} onSelect={jumpTo} tone="dark" compact />
              <div className="mt-5 border-t border-line-dark pt-5" aria-live="polite">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sun-500">
                    {t('common.corridor')} {a.numeral}
                  </p>
                  <p className="font-mono text-[11px] text-paper/45">{coords(a.coords)}</p>
                </div>
                <p className="mt-2 font-display text-[28px] leading-tight">{tr(a.name)}</p>
                <dl className="mt-4 grid grid-cols-2 gap-4 text-[13px]">
                  <div>
                    <dt className="flex items-center gap-1.5 text-paper/50"><Clock className="size-3.5" />{t('corridors.fromCity', { city: a.access.from })}</dt>
                    <dd className="mt-1 text-paper/90">{drive(a.access.hours)}</dd>
                  </div>
                  <div>
                    <dt className="flex items-center gap-1.5 text-paper/50"><Sun className="size-3.5" />{t('corridors.bestSeason')}</dt>
                    <dd className="mt-1 text-paper/90">{tr(a.bestSeason)}</dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="mt-4 hidden gap-1.5 lg:flex">
              {corridors.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => jumpTo(c.slug)}
                  className={'h-1 flex-1 rounded-full transition-colors duration-300 ' + (c.slug === active ? 'bg-sun-500' : 'bg-paper/15 hover:bg-paper/30')}
                  aria-label={t('corridors.goTo', { name: tr(c.name) })}
                />
              ))}
            </div>
          </div>

          {/* Daftar koridor */}
          <div className="space-y-6 lg:space-y-10">
            {corridors.map((c) => (
              <article
                key={c.slug}
                data-slug={c.slug}
                ref={(el) => (refs.current[c.slug] = el)}
                className={
                  'grid overflow-hidden rounded-[var(--radius-card)] bg-forest-800 ring-1 transition-[box-shadow,opacity] duration-500 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] ' +
                  (c.slug === active ? 'ring-sun-500/40 lg:opacity-100' : 'ring-line-dark lg:opacity-60')
                }
              >
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-auto sm:min-h-[340px]">
                  <img src={c.imageSm ?? c.image} alt={tr(c.imageAlt)} loading="lazy" className="absolute inset-0 size-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 font-display text-[72px] leading-[0.8] text-paper/85" aria-hidden>
                    {c.numeral}
                  </span>
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-sage-300">{zone(c)}</p>
                  <h3 className="mt-2 font-display text-[32px] leading-none">{tr(c.name)}</h3>
                  <p className="mt-1.5 font-display text-[17px] italic text-sun-500">{tr(c.theme)}</p>
                  <p className="mt-3 text-[11.5px] text-paper/50">{c.tags.map(tr).join(' · ')}</p>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-paper/75">{tr(c.summary)}</p>

                  <ul className="mb-6 mt-5 flex flex-wrap gap-1.5">
                    {c.activities.map((act) => (
                      <li key={tr(act)} className="inline-flex items-center gap-1.5 rounded-full border border-line-dark px-2.5 py-1 text-[12.5px] text-paper/85">
                        <Leaf className="size-3 text-sage-300" strokeWidth={1.75} />
                        {tr(act)}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-line-dark pt-5">
                    <div>
                      <p className="text-[12px] text-paper/50">{t('corridors.startFrom')}</p>
                      <p className="text-[19px] font-semibold tracking-tight">
                        {rupiah(c.priceFrom)}
                        <span className="text-[13px] font-normal text-paper/50"> {t('common.perPerson')}</span>
                      </p>
                    </div>
                    <ArrowLink to={`/koridor/${c.slug}`} tone="light">{t('corridors.explore')}</ArrowLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
