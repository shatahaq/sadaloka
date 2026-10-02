import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { journeyPhases, journeySteps } from '../data/content'
import { useI18n } from '../i18n'
import { Eyebrow } from '../components/ui'
import { cn } from '../lib/format'

export default function Journey() {
  const { t, tr } = useI18n()
  const track = useRef(null)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('before')

  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth
      const p = max > 0 ? el.scrollLeft / max : 0
      setProgress(p)
      // fase aktif = fase dari kartu yang paling kiri terlihat
      const cards = [...el.querySelectorAll('[data-step]')]
      const pad = parseFloat(getComputedStyle(el).paddingLeft)
      const first = cards.findIndex((c) => c.offsetLeft + c.offsetWidth * 0.5 >= el.scrollLeft + pad)
      const idx = p > 0.98 ? cards.length - 1 : Math.max(0, first)
      const ph = journeyPhases.find((x) => idx >= x.range[0] && idx < x.range[1])
      if (ph) setPhase(ph.key)
    }
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const goToPhase = (ph) => {
    const el = track.current
    const card = el?.querySelector(`[data-step="${ph.range[0]}"]`)
    if (!card) return
    el.scrollTo({ left: card.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft), behavior: 'smooth' })
  }
  const nudge = (d) => track.current?.scrollBy({ left: d * 340, behavior: 'smooth' })

  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 text-paper sm:py-28">
      <div className="container-x">
        <div className="reveal grid gap-6 lg:grid-cols-[7fr_5fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow tone="light">{t('journey.eyebrow')}</Eyebrow>
            <h2 className="mt-4 font-display text-[40px] leading-[1.02] sm:text-[56px]">
              {t('journey.title1')} <em className="font-[350] text-sun-500">{t('journey.title2')}</em>
            </h2>
          </div>
          <p className="text-[16px] leading-relaxed text-paper/70">{t('journey.intro')}</p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1 rounded-full border border-line-dark p-1" role="tablist" aria-label={t('journey.phasesAria')}>
            {journeyPhases.map((ph) => (
              <button
                key={ph.key}
                type="button"
                role="tab"
                aria-selected={phase === ph.key}
                onClick={() => goToPhase(ph)}
                className={cn(
                  'h-9 rounded-full px-4 text-[13px] font-medium transition-colors',
                  phase === ph.key ? 'bg-paper text-ink' : 'text-paper/65 hover:text-paper',
                )}
              >
                {tr(ph.label)}
                <span className={cn('ml-2 font-mono text-[10.5px]', phase === ph.key ? 'text-muted' : 'text-paper/35')}>
                  {String(ph.range[0] + 1).padStart(2, '0')}–{String(ph.range[1]).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>
          <div className="hidden gap-2 sm:flex">
            <button type="button" onClick={() => nudge(-1)} className="grid size-11 place-items-center rounded-full border border-line-dark hover:border-paper/60" aria-label={t('journey.prev')}>
              <ArrowLeft className="size-4.5" strokeWidth={1.75} />
            </button>
            <button type="button" onClick={() => nudge(1)} className="grid size-11 place-items-center rounded-full border border-line-dark hover:border-paper/60" aria-label={t('journey.next')}>
              <ArrowRight className="size-4.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <ol
        ref={track}
        className="no-scrollbar relative mt-8 flex snap-x snap-mandatory overflow-x-auto scroll-px-5 px-5 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(3rem,calc((100vw-1320px)/2+3rem))] lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))]"
      >
        {journeySteps.map((s, i) => {
          const ph = journeyPhases.find((x) => i >= x.range[0] && i < x.range[1])
          const isPhaseStart = i === ph.range[0]
          return (
            <li key={s.n} data-step={i} className="relative w-[280px] shrink-0 snap-start pr-4 sm:w-[320px]">
              <div className="relative flex h-8 items-center">
                <span className="absolute inset-x-0 top-1/2 h-px bg-paper/15" />
                <span
                  className={cn(
                    'relative z-10 size-3 rounded-full border-2',
                    phase === ph.key ? 'border-sun-500 bg-sun-500' : 'border-paper/40 bg-forest-900',
                  )}
                />
                {isPhaseStart && (
                  <span className="relative z-10 ml-3 bg-forest-900 pr-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-paper/45">
                    {tr(ph.label)}
                  </span>
                )}
              </div>
              <div
                className={cn(
                  'mt-5 flex min-h-[270px] flex-col rounded-[var(--radius-card)] border p-6 transition-colors duration-500',
                  phase === ph.key ? 'border-paper/20 bg-forest-800' : 'border-line-dark bg-transparent',
                )}
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-[44px] leading-none text-paper/90">{s.n}</span>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-sage-300">{tr(s.phase)}</span>
                </div>
                <p className="mt-10 font-display text-[30px] italic leading-none text-sun-500">{s.verb}</p>
                <p className="mt-3 text-[14px] leading-relaxed text-paper/70">{tr(s.text)}</p>
              </div>
            </li>
          )
        })}
        <li className="w-px shrink-0" aria-hidden />
      </ol>

      <div className="container-x mt-8">
        <div className="h-px w-full bg-paper/10">
          <div className="h-px bg-sun-500 transition-[width] duration-150" style={{ width: `${Math.max(8, progress * 100)}%` }} />
        </div>
      </div>
    </section>
  )
}
