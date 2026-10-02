import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, HandHeart, Receipt, ShieldCheck, Trees } from 'lucide-react'
import { pillars, safetyChecks } from '../data/content'
import { packageBySlug } from '../data/packages'
import { useI18n } from '../i18n'
import CostBreakdown from '../components/CostBreakdown'
import { Eyebrow } from '../components/ui'

const icons = { ethics: Trees, community: HandHeart, transparency: Receipt, safety: ShieldCheck }
const sample = packageBySlug['bukit-lawang-jungle-trek-harian']

export default function WhySadaloka() {
  const { t, tr } = useI18n()
  return (
    <section className="paper-grain bg-paper-2 py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-16">
          <div>
            <Eyebrow>{t('why.eyebrow')}</Eyebrow>
            <h2 className="mt-4 font-display text-[40px] leading-[1.02] sm:text-[56px]">
              {t('why.title1')} <em className="font-[350] text-clay-600">{t('why.title2')}</em>
            </h2>
          </div>
          <p className="self-end text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">{t('why.intro')}</p>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-bone md:grid-cols-2">
          {pillars.map((p, i) => {
            const Icon = icons[p.key]
            return (
              <div
                key={p.key}
                className={
                  'reveal flex flex-col p-7 sm:p-10 ' +
                  (i % 2 === 0 ? 'md:border-r md:border-line ' : '') +
                  (i < 2 ? 'border-b border-line ' : i === 2 ? 'border-b border-line md:border-b-0' : '')
                }
                style={{ '--delay': `${i * 80}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-12 place-items-center rounded-full bg-paper text-moss-600">
                    <Icon className="size-5.5" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.16em] text-muted">0{i + 1} / 04</span>
                </div>
                <h3 className="mt-7 font-display text-[28px] leading-tight">{tr(p.title)}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{tr(p.text)}</p>

                {p.key === 'transparency' && (
                  <div className="mt-6 rounded-2xl bg-paper p-5">
                    <p className="mb-3 text-[12px] text-muted">{t('why.example', { title: tr(sample.title) })}</p>
                    <CostBreakdown breakdown={sample.breakdown} total={sample.price} />
                  </div>
                )}

                {p.key === 'safety' && (
                  <ul className="mt-6 divide-y divide-line rounded-2xl bg-paper px-5">
                    {safetyChecks.map(([title, note]) => (
                      <li key={tr(title)} className="flex items-center gap-3 py-3 text-[13.5px]">
                        <span className="grid size-5 place-items-center rounded-full bg-moss-600 text-paper">
                          <Check className="size-3" strokeWidth={2.5} />
                        </span>
                        <span className="flex-1 font-medium">{tr(title)}</span>
                        <span className="hidden text-[12.5px] text-muted sm:inline">{tr(note)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-auto pt-7">
                  {p.href ? (
                    <Link to={p.href} className="group inline-flex items-center gap-1.5 text-sm font-medium text-clay-600">
                      <span className="link-underline">{tr(p.tag)}</span>
                      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </Link>
                  ) : (
                    <span className="inline-flex rounded-full border border-moss-600/30 bg-sage-100 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-moss-600">
                      {tr(p.tag)}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
