import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Clock, Leaf, MapPin, Route, Sun } from 'lucide-react'
import { useData } from '../data'
import { rupiah } from '../lib/format'
import { useReveal } from '../lib/useReveal'
import { useI18n } from '../i18n'
import CorridorMap from '../components/CorridorMap'
import PackageCard from '../components/PackageCard'
import { Button, Eyebrow, Monogram } from '../components/ui'
import NotFound from './NotFound'

export default function Corridor() {
  const { slug } = useParams()
  return <CorridorView key={slug} slug={slug} />
}

function CorridorView({ slug }) {
  const { corridors, corridorBySlug, packagesByCorridor, guides } = useData()
  const { t, tr, coords, drive, zone } = useI18n()
  const ref = useReveal()
  const c = corridorBySlug[slug]
  if (!c) return <NotFound />

  const idx = corridors.findIndex((x) => x.slug === slug)
  const prev = corridors[(idx - 1 + corridors.length) % corridors.length]
  const next = corridors[(idx + 1) % corridors.length]
  const pkgs = packagesByCorridor(slug)
  // ringkasan; daftar lengkap ada di /guide
  const crew = guides.filter((g) => g.corridors.includes(slug)).slice(0, 6)

  return (
    <div ref={ref}>
      {/* Hero terbagi: teks di panel gelap, foto di bingkai — menjaga ketajaman foto beresolusi sedang */}
      <section className="relative overflow-hidden bg-forest-900 text-paper">
        <div className="topo-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative grid min-h-[640px] lg:grid-cols-2">
          <div className="container-x flex flex-col justify-end pb-12 pt-32 lg:mr-0 lg:max-w-[660px] lg:pb-16 lg:pr-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sage-300">{zone(c)}</p>
            <h1 className="font-display-tight mt-4 text-[clamp(3rem,7vw,6rem)] font-[380] leading-[0.95]">{tr(c.name)}</h1>
            <p className="mt-3 font-display text-2xl italic text-sun-500">{tr(c.theme)}</p>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-paper/75">{tr(c.summary)}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button href="#paket" variant="primary" size="lg">{t('corridorPage.seePackages', { n: pkgs.length })}</Button>
              <p className="text-[14px] text-paper/60">
                {t('common.from')} <span className="font-semibold text-paper">{rupiah(c.priceFrom)}</span> {t('common.perPerson')}
              </p>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-0">
            <img src={c.image} alt={tr(c.imageAlt)} className="absolute inset-0 size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-900 via-transparent to-transparent" />
            <span className="absolute bottom-4 right-6 font-display text-[140px] leading-[0.75] text-paper/20 sm:text-[200px]" aria-hidden>{c.numeral}</span>
          </div>
        </div>
      </section>

      {/* Ringkasan + peta */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[7fr_5fr] lg:gap-20">
          <div className="reveal">
            <Eyebrow>{t('corridorPage.about')}</Eyebrow>
            <p className="mt-5 font-display text-[26px] leading-[1.3] sm:text-[32px]">{tr(c.long)}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {c.tags.map((tag) => (
                <span key={tr(tag)} className="rounded-full border border-line-strong px-3 py-1.5 text-[13px] text-ink-soft">{tr(tag)}</span>
              ))}
            </div>

            <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-line sm:grid-cols-3">
              {[
                [Route, t('corridorPage.fromCity', { city: c.access.from }), `± ${c.access.km} km`],
                [Clock, t('corridorPage.travelTime'), drive(c.access.hours)],
                [Sun, t('corridors.bestSeason'), tr(c.bestSeason)],
              ].map(([Icon, k, v]) => (
                <div key={k} className="bg-bone p-5">
                  <dt className="flex items-center gap-1.5 text-[12px] text-muted"><Icon className="size-3.5" />{k}</dt>
                  <dd className="mt-1.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="reveal rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line" style={{ '--delay': '100ms' }}>
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 text-[13px] font-medium"><MapPin className="size-4 text-clay-500" />{t('corridorPage.position')}</p>
              <p className="font-mono text-[11px] text-muted">{coords(c.coords)}</p>
            </div>
            <CorridorMap active={c.slug} tone="light" compact />
          </div>
        </div>
      </section>

      {/* Aktivitas */}
      <section className="border-y border-line bg-paper-2 py-16 sm:py-20">
        <div className="container-x">
          <Eyebrow>{t('corridorPage.activities')}</Eyebrow>
          <ul className={`mt-8 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-line-strong sm:grid-cols-2 ${c.activities.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
            {c.activities.map((a, i) => (
              <li key={tr(a)} className="reveal flex min-h-[180px] flex-col justify-between bg-paper p-6" style={{ '--delay': `${i * 70}ms` }}>
                <Leaf className="size-5 text-moss-600" strokeWidth={1.5} />
                <div>
                  <span className="font-mono text-[11px] text-muted">0{i + 1}</span>
                  <p className="mt-1 font-display text-[24px] leading-tight">{tr(a)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Paket */}
      <section id="paket" className="scroll-mt-20 bg-paper py-16 sm:py-24">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[36px] leading-tight sm:text-[48px]">{t('corridorPage.packagesIn', { name: tr(c.name) })}</h2>
            <Link to={`/paket?koridor=${c.slug}`} className="text-sm font-medium underline underline-offset-4">{t('corridorPage.openCatalog')}</Link>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pkgs.map((p) => <PackageCard key={p.slug} pkg={p} />)}
          </div>
        </div>
      </section>

      {crew.length > 0 && (
        <section className="bg-paper pb-16 sm:pb-24">
          <div className="container-x">
            <div className="rounded-[var(--radius-card)] bg-forest-900 p-6 text-paper sm:p-10">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow tone="light">{t('corridorPage.guidesEyebrow', { n: c.numeral })}</Eyebrow>
                  <p className="mt-3 font-display text-[30px] leading-tight">{t('corridorPage.guidesTitle')}</p>
                </div>
                <Link to="/guide" className="text-sm font-medium text-sun-500 underline underline-offset-4">{t('corridorPage.allGuides')}</Link>
              </div>
              <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {crew.map((g) => (
                  <li key={g.id} className="flex flex-col rounded-2xl border border-line-dark p-5">
                    <div className="flex items-center gap-4">
                      <Monogram name={g.name} src={g.photo} tone="dark" />
                      <div>
                        <p className="font-medium">{g.name}</p>
                        <p className="text-[13px] text-paper/55">{tr(g.role)}</p>
                      </div>
                    </div>
                    <p className="mb-5 mt-4 text-[14px] leading-relaxed text-paper/70">{tr(g.bio ?? g.quote)}</p>
                    <p className="mt-auto inline-flex items-center gap-1.5 border-t border-line-dark pt-4 font-mono text-[11px] text-sage-300">
                      <BadgeCheck className="size-3.5" strokeWidth={1.75} />
                      {g.license ?? g.organization}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Navigasi antar koridor */}
      <nav className="grid border-t border-line bg-bone sm:grid-cols-2" aria-label={t('corridorPage.otherAria')}>
        {[[prev, t('corridorPage.prev'), ArrowLeft], [next, t('corridorPage.next'), ArrowRight]].map(([k, label, Icon], i) => (
          <Link key={label} to={`/koridor/${k.slug}`} className={'group flex items-center gap-5 p-8 transition-colors hover:bg-paper sm:p-10 ' + (i === 1 ? 'justify-end text-right sm:border-l sm:border-line' : '')}>
            {i === 0 && <Icon className="size-5 transition-transform group-hover:-translate-x-1" />}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{label} · {t('common.corridor')} {k.numeral}</p>
              <p className="mt-1 font-display text-[28px] leading-tight">{tr(k.name)}</p>
            </div>
            {i === 1 && <Icon className="size-5 transition-transform group-hover:translate-x-1" />}
          </Link>
        ))}
      </nav>
    </div>
  )
}
