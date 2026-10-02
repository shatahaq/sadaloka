import { breakdownColors } from '../data/packages'
import { useI18n } from '../i18n'
import { rupiah, cn } from '../lib/format'

/** Bar bertumpuk + legenda: ke mana setiap rupiah pergi. */
export default function CostBreakdown({ breakdown, total, tone = 'dark', showAmounts = true, className = '' }) {
  const { t } = useI18n()
  const entries = Object.entries(breakdown)
  const light = tone === 'light'
  return (
    <div className={className}>
      <div className="flex h-3 w-full overflow-hidden rounded-full" role="img" aria-label={t('cost.aria')}>
        {entries.map(([k, pct]) => (
          <span
            key={k}
            style={{ width: `${pct}%`, background: breakdownColors[k] }}
            className={cn('h-full', light ? 'border-r border-forest-900 last:border-0' : 'border-r border-bone last:border-0')}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {entries.map(([k, pct]) => (
          <li key={k} className="flex items-baseline gap-3 text-[13.5px]">
            <span className="size-2.5 shrink-0 translate-y-[1px] rounded-[3px]" style={{ background: breakdownColors[k] }} />
            <span className={cn('flex-1', light ? 'text-paper/80' : 'text-ink-soft')}>{t(`breakdown.${k}`)}</span>
            <span className={cn('font-mono text-[12px] tabular-nums', light ? 'text-paper/50' : 'text-muted')}>{pct}%</span>
            {showAmounts && (
              <span className={cn('min-w-[5.5rem] shrink-0 text-right font-medium tabular-nums', light ? 'text-paper' : 'text-ink')}>
                {rupiah(Math.round((total * pct) / 100))}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
