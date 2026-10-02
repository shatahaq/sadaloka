import { useState } from 'react'
import { FileText, HandHeart, Home as HomeIcon, ShieldCheck } from 'lucide-react'
import { breakdownColors, packages, packageBySlug } from '../data/packages'
import { corridorBySlug } from '../data/corridors'
import { ethicsRules } from '../data/content'
import { rupiah } from '../lib/format'
import { useReveal } from '../lib/useReveal'
import { useI18n } from '../i18n'
import PageHeader from '../components/PageHeader'
import CostBreakdown from '../components/CostBreakdown'
import { Button, Eyebrow } from '../components/ui'

const keys = Object.keys(breakdownColors)
const average = Object.fromEntries(keys.map((k) => [k, Math.round(packages.reduce((a, p) => a + p.breakdown[k], 0) / packages.length)]))
// pastikan total tepat 100 setelah pembulatan
average.platform += 100 - Object.values(average).reduce((a, b) => a + b, 0)

const explainKey = {
  guide: 'exGuide',
  stay: 'exStay',
  logistics: 'exLogistics',
  conservation: 'exConservation',
  platform: 'exPlatform',
}

export default function Transparency() {
  const { t, tr } = useI18n()
  const ref = useReveal()
  const [sel, setSel] = useState(packages[0].slug)
  const pkg = packageBySlug[sel]
  const c = corridorBySlug[pkg.corridor]

  return (
    <div ref={ref}>
      <PageHeader
        crumbs={[[t('transp.crumb')]]}
        eyebrow={t('transp.eyebrow')}
        title={<>{t('transp.title1')} <em className="font-[350] text-moss-600">{t('transp.title2')}</em></>}
        intro={t('transp.intro')}
      />

      {/* Rata-rata */}
      <section className="bg-paper py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-20">
          <div className="reveal">
            <Eyebrow>{t('transp.avgEyebrow')}</Eyebrow>
            <p className="mt-5 font-display text-[64px] leading-none tracking-tight sm:text-[88px]">
              {100 - average.platform}<span className="text-moss-600">%</span>
            </p>
            <p className="mt-3 max-w-sm text-[16px] leading-relaxed text-ink-soft">{t('transp.avgText')}</p>
          </div>
          <div className="reveal" style={{ '--delay': '100ms' }}>
            <div className="flex h-16 w-full overflow-hidden rounded-2xl">
              {keys.map((k) => (
                <div key={k} className="flex items-end p-2.5 text-[12px] font-medium text-bone" style={{ width: `${average[k]}%`, background: breakdownColors[k] }}>
                  {average[k] >= 10 && `${average[k]}%`}
                </div>
              ))}
            </div>
            <dl className="mt-8 divide-y divide-line border-y border-line">
              {keys.map((k) => (
                <div key={k} className="grid grid-cols-[16px_1fr_auto] gap-4 py-4">
                  <span className="mt-1.5 size-3 rounded-[3px]" style={{ background: breakdownColors[k] }} />
                  <div>
                    <dt className="font-medium">{t(`breakdown.${k}`)}</dt>
                    <dd className="mt-1 text-[14px] leading-relaxed text-ink-soft">{t(`transp.${explainKey[k]}`)}</dd>
                  </div>
                  <span className="font-mono text-[14px] tabular-nums">{average[k]}%</span>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Per paket */}
      <section className="border-y border-line bg-paper-2 py-16 sm:py-24">
        <div className="container-x">
          <div className="reveal flex flex-wrap items-end justify-between gap-6">
            <div>
              <Eyebrow>{t('transp.perEyebrow')}</Eyebrow>
              <h2 className="mt-4 font-display text-[36px] leading-tight sm:text-[48px]">{t('transp.perTitle')}</h2>
            </div>
            <label className="flex h-12 items-center rounded-full border border-line-strong bg-bone px-4 text-[14px]">
              <span className="sr-only">{t('transp.pick')}</span>
              <select value={sel} onChange={(e) => setSel(e.target.value)} className="max-w-[300px] bg-transparent focus:outline-none">
                {packages.map((p) => <option key={p.slug} value={p.slug}>{tr(p.title)}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-10 grid gap-6 rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <p className="text-[13px] text-muted">{t('common.corridor')} {c.numeral} · {tr(c.name)}</p>
              <p className="mt-1 font-display text-[30px] leading-tight">{tr(pkg.title)}</p>
              <p className="mt-4 text-[14px] text-muted">{t('detail.pricePer')}</p>
              <p className="text-[28px] font-semibold tracking-tight">{rupiah(pkg.price)}</p>
              <Button to={`/paket/${pkg.slug}`} variant="outline" size="sm" className="mt-6">{t('transp.viewPkg')}</Button>
            </div>
            <CostBreakdown breakdown={pkg.breakdown} total={pkg.price} />
          </div>
        </div>
      </section>

      {/* Etika */}
      <section id="etika" className="scroll-mt-20 bg-forest-900 py-16 text-paper sm:py-24">
        <div className="container-x">
          <div className="reveal max-w-2xl">
            <Eyebrow tone="light">{t('transp.ethicsEyebrow')}</Eyebrow>
            <h2 className="mt-4 font-display text-[36px] leading-tight sm:text-[48px]">{t('transp.ethicsTitle')}</h2>
            <p className="mt-4 text-[16px] text-paper/70">{t('transp.ethicsIntro')}</p>
          </div>
          <ol className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-line-dark sm:grid-cols-2 lg:grid-cols-3">
            {ethicsRules.map((r, i) => (
              <li key={i} className="reveal bg-forest-900 p-7" style={{ '--delay': `${i * 60}ms` }}>
                <span className="font-mono text-[11px] text-sun-500">0{i + 1}</span>
                <p className="mt-4 font-display text-[24px] leading-tight">{tr(r.title)}</p>
                <p className="mt-2 text-[14.5px] leading-relaxed text-paper/65">{tr(r.text)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Laporan & mitra */}
      <section id="mitra" className="scroll-mt-20 bg-paper py-16 sm:py-24">
        <div className="container-x grid gap-5 lg:grid-cols-3">
          {[
            [FileText, 'report'],
            [HomeIcon, 'homestay'],
            [HandHeart, 'group'],
          ].map(([Icon, k]) => (
            <div key={k} className="reveal flex flex-col rounded-[var(--radius-card)] bg-bone p-7 ring-1 ring-line">
              <Icon className="size-6 text-moss-600" strokeWidth={1.5} />
              <p className="mt-6 font-display text-[24px] leading-tight">{t(`transp.${k}Title`)}</p>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{t(`transp.${k}Text`)}</p>
              <a href="https://wa.me/6281200000000" className="mt-auto pt-6 text-sm font-medium text-clay-600 underline underline-offset-4">{t(`transp.${k}Cta`)}</a>
            </div>
          ))}
        </div>
        <div className="container-x mt-10">
          <p className="flex items-start gap-2 text-[13px] text-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
            {t('transp.audit')}
          </p>
        </div>
      </section>
    </div>
  )
}
