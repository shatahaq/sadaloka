import { Link } from 'react-router-dom'
import { Clock, Users } from 'lucide-react'
import { useData } from '../data'
import { rupiah, cn } from '../lib/format'
import { useI18n } from '../i18n'
import { DifficultyBars } from './ui'
import { difficultyLevels } from '../lib/constants'

export default function PackageCard({ pkg, className = '', badge }) {
  const { corridorBySlug } = useData()
  const { t, tr, dur } = useI18n()
  const c = corridorBySlug[pkg.corridor]
  const low = pkg.slots != null && pkg.slots <= 3

  return (
    <Link
      to={`/paket/${pkg.slug}`}
      className={cn('group flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-bone ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgb(22_26_20/0.35)]', className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
        <img
          src={pkg.image ?? c.imageSm ?? c.image}
          alt={pkg.image ? tr(pkg.title) : tr(c.imageAlt)}
          loading="lazy"
          className="size-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <span className="rounded-full bg-forest-950/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper backdrop-blur">
            {t('common.corridor')} {c.numeral}
          </span>
          {badge ?? (pkg.familyFriendly && (
            <span className="rounded-full bg-bone/95 px-2.5 py-1 text-[11px] font-medium text-moss-600">{t('common.familyFriendly')}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[12px] text-muted">{tr(c.name)}</p>
        <h3 className="mt-1 font-display text-[22px] leading-[1.15] text-ink">{tr(pkg.title)}</h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-ink-soft">{tr(pkg.tagline)}</p>

        <div className="mb-5 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12.5px] text-ink-soft">
          <span className="inline-flex items-center gap-1.5"><Clock className="size-3.5" strokeWidth={1.75} />{dur(pkg.days)}</span>
          <span className="inline-flex items-center gap-1.5">
            <DifficultyBars level={difficultyLevels[pkg.difficulty]} className="text-moss-600" />
            {t(`difficulty.${pkg.difficulty}`)}
          </span>
          <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" strokeWidth={1.75} />{t('common.maxPeople', { n: pkg.group[1] })}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[11px] text-muted">{t('common.from')}</p>
            <p className="text-[17px] font-semibold tracking-tight text-ink">
              {rupiah(pkg.price)}
              <span className="text-[12px] font-normal text-muted"> {t('common.perPerson')}</span>
            </p>
          </div>
          {pkg.slots != null ? (
            <p className={cn('text-right text-[12px]', low ? 'font-medium text-clay-600' : 'text-muted')}>
              {low ? t('common.slotsLeft', { n: pkg.slots }) : t('common.slotsWeek', { n: pkg.slots })}
            </p>
          ) : (
            pkg.tripType && <p className="text-right text-[12px] text-muted">{t(`detail.tripType.${pkg.tripType}`)}</p>
          )}
        </div>
      </div>
    </Link>
  )
}
