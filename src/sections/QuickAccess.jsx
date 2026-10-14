import { Link } from 'react-router-dom'
import { ArrowUpRight, BadgeCheck } from 'lucide-react'
import { useData } from '../data'
import { useI18n } from '../i18n'
import { Eyebrow, Monogram } from '../components/ui'

function GateShell({ to, index, label, title, cta, children, dark = false, visual }) {
  return (
    <Link
      to={to}
      className={
        'reveal group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] p-6 transition-transform duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 sm:p-7 ' +
        (dark ? 'bg-forest-900 text-paper' : 'bg-bone text-ink ring-1 ring-line')
      }
      style={{ '--delay': `${index * 90}ms` }}
    >
      <div className="flex items-start justify-between">
        <span className={'font-mono text-[11px] tracking-[0.16em] ' + (dark ? 'text-sage-300' : 'text-muted')}>
          {label} 0{index + 1}
        </span>
        <span
          className={
            'grid size-10 place-items-center rounded-full transition-colors ' +
            (dark ? 'bg-paper/10 group-hover:bg-sun-500 group-hover:text-forest-950' : 'bg-paper group-hover:bg-forest-900 group-hover:text-paper')
          }
        >
          <ArrowUpRight className="size-4.5 transition-transform duration-300 group-hover:rotate-45" strokeWidth={1.75} />
        </span>
      </div>
      <div className="mt-8 min-h-[140px]">{visual}</div>
      <h3 className="mt-6 font-display text-[30px] leading-none">{title}</h3>
      <div className={'mt-3 text-[14.5px] leading-relaxed ' + (dark ? 'text-paper/70' : 'text-ink-soft')}>{children}</div>
      <p className={'mt-6 border-t pt-4 text-sm font-medium ' + (dark ? 'border-line-dark text-sun-500' : 'border-line text-clay-600')}>
        {cta} →
      </p>
    </Link>
  )
}

export default function QuickAccess() {
  const { corridors, guides, packages } = useData()
  const { t, dur } = useI18n()
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <Eyebrow>{t('quick.eyebrow')}</Eyebrow>
            <h2 className="mt-4 font-display text-[40px] leading-[1.02] sm:text-[56px]">
              {t('quick.title1')} <em className="font-[350] text-moss-600">{t('quick.title2')}</em>
            </h2>
          </div>
          <p className="max-w-md text-[16px] leading-relaxed text-ink-soft lg:justify-self-end">{t('quick.intro')}</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <GateShell
            to="/paket"
            index={0}
            label={t('quick.gate')}
            title={t('quick.g1Title')}
            cta={t('quick.g1Cta')}
            visual={
              <div className="flex h-[140px] items-end gap-2">
                {corridors.slice(0, 4).map((c, i) => (
                  <div
                    key={c.slug}
                    className="relative flex-1 overflow-hidden rounded-xl transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:flex-[1.4] first:group-hover:flex-[2]"
                    style={{ height: `${100 - i * 12}%` }}
                  >
                    <img src={c.imageSm ?? c.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
                  </div>
                ))}
              </div>
            }
          >
            <p>{t('quick.g1Text')}</p>
            <span className="mt-3 block font-mono text-[11px] tracking-wider text-muted">{t('quick.g1Meta', { n: packages.length })}</span>
          </GateShell>

          <GateShell
            to="/guide"
            index={1}
            label={t('quick.gate')}
            title={t('quick.g2Title')}
            cta={t('quick.g2Cta')}
            visual={
              <div className="flex h-[140px] flex-col justify-end">
                <div className="flex -space-x-2">
                  {guides.slice(0, 5).map((g) => (
                    <Monogram key={g.id} name={g.name} className="ring-4 ring-bone" />
                  ))}
                </div>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-moss-600">
                  <BadgeCheck className="size-4" strokeWidth={1.75} />
                  {t('quick.g2Verified')}
                </p>
              </div>
            }
          >
            <p>{t('quick.g2Text')}</p>
          </GateShell>

          <GateShell
            to="/smart-match"
            index={2}
            dark
            label={t('quick.gate')}
            title="Smart Trip Match"
            cta={t('quick.g3Cta')}
            visual={
              <div className="rounded-xl border border-line-dark bg-forest-950/60 px-4 py-3 font-mono text-[11.5px]">
                {[
                  [t('quick.mInterests'), t('quick.mInterestsVal')],
                  [t('quick.mDuration'), dur(1)],
                  [t('quick.mWith'), t('quick.mWithVal')],
                  [t('quick.mBudget'), t('quick.mBudgetVal')],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-line-dark py-1 last:border-0">
                    <span className="text-paper/45">{k}</span>
                    <span className="text-paper/85">{v}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-center justify-between text-sun-500">
                  <span>{t('quick.mResult')}</span>
                  <span>96%</span>
                </div>
              </div>
            }
          >
            <p>{t('quick.g3Text')}</p>
          </GateShell>
        </div>
      </div>
    </section>
  )
}
