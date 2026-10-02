import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from 'lucide-react'
import { corridors } from '../data/corridors'
import { todayISO } from '../lib/format'
import { useI18n } from '../i18n'
import heroImg from '../assets/img/batu-katak.webp'

export default function Hero() {
  const { t, tr, people } = useI18n()
  const navigate = useNavigate()
  const [corridor, setCorridor] = useState('')
  const [date, setDate] = useState('')
  const [pax, setPax] = useState(2)

  const trust = ['No Feeding • No Touching', ...[1, 2, 3, 4, 5, 6].map((i) => t(`hero.trust${i}`))]

  const submit = (e) => {
    e.preventDefault()
    const q = new URLSearchParams()
    if (corridor) q.set('koridor', corridor)
    if (date) q.set('tanggal', date)
    q.set('peserta', pax)
    navigate(`/paket?${q}`)
  }

  return (
    <section className="relative isolate overflow-hidden bg-forest-950 text-paper">
      <img src={heroImg} alt={t('hero.imgAlt')} className="absolute inset-0 -z-10 size-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(15_21_14/0.55)_0%,rgb(15_21_14/0.1)_30%,rgb(15_21_14/0.35)_60%,rgb(15_21_14/0.92)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(15_21_14/0.6)_0%,transparent_55%,rgb(15_21_14/0.45)_100%)]" />

      <div className="container-x flex min-h-[100svh] flex-col justify-end pb-10 pt-32 sm:pb-12 lg:min-h-[860px]">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_260px]">
          <div>
            <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-1 text-paper/75">
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-sun-500" />
                {t('hero.eyebrow1')}
              </span>
              <span className="text-paper/40">/</span>
              <span>{t('hero.eyebrow2')}</span>
            </p>
            <h1 className="font-display-tight mt-6 text-[clamp(3.1rem,8.6vw,8.25rem)] font-[380] leading-[0.98] text-paper">
              {t('hero.title1')}
              <br />
              <span className="italic font-[300] text-sun-100">{t('hero.title2')}</span>
            </h1>
            <p className="mt-7 max-w-[600px] text-[16px] leading-relaxed text-paper/80 sm:text-[17px]">{t('hero.body')}</p>
          </div>

          <aside className="hidden border-l border-paper/20 pl-6 lg:block">
            <dl className="space-y-5">
              {[
                ['05', t('hero.stat1')],
                ['HPI', t('hero.stat2')],
                ['0', t('hero.stat3')],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-display text-4xl leading-none text-paper">{k}</dt>
                  <dd className="mt-1.5 text-[13px] text-paper/65">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        {/* Pencarian cepat */}
        <form
          onSubmit={submit}
          className="mt-10 grid gap-1 rounded-[22px] bg-bone p-1.5 text-ink shadow-[0_30px_60px_-30px_rgb(0_0_0/0.6)] sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto]"
          aria-label={t('hero.formAria')}
        >
          <label className="group flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-paper focus-within:bg-paper">
            <MapPin className="size-5 shrink-0 text-moss-600" strokeWidth={1.5} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{t('hero.corridor')}</span>
              <select
                value={corridor}
                onChange={(e) => setCorridor(e.target.value)}
                className="-ml-0.5 w-full appearance-none bg-transparent text-[15px] font-medium focus:outline-none"
              >
                <option value="">{t('hero.allCorridors')}</option>
                {corridors.map((c) => (
                  <option key={c.slug} value={c.slug}>{c.numeral} · {tr(c.name)}</option>
                ))}
              </select>
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors hover:bg-paper focus-within:bg-paper lg:border-l lg:border-line">
            <CalendarDays className="size-5 shrink-0 text-moss-600" strokeWidth={1.5} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{t('hero.date')}</span>
              <input
                type="date"
                min={todayISO(1)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-transparent text-[15px] font-medium focus:outline-none"
              />
            </span>
          </label>

          <div className="flex items-center gap-3 rounded-2xl px-4 py-3 lg:border-l lg:border-line">
            <Users className="size-5 shrink-0 text-moss-600" strokeWidth={1.5} />
            <span className="flex flex-1 flex-col">
              <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-muted">{t('hero.guests')}</span>
              <span className="text-[15px] font-medium">{people(pax)}</span>
            </span>
            <span className="flex items-center gap-1">
              <button type="button" onClick={() => setPax((p) => Math.max(1, p - 1))} disabled={pax <= 1} className="grid size-8 place-items-center rounded-full border border-line-strong hover:border-ink disabled:opacity-30" aria-label={t('common.decrease')}>
                <Minus className="size-3.5" />
              </button>
              <button type="button" onClick={() => setPax((p) => Math.min(15, p + 1))} className="grid size-8 place-items-center rounded-full border border-line-strong hover:border-ink" aria-label={t('common.increase')}>
                <Plus className="size-3.5" />
              </button>
            </span>
          </div>

          <button
            type="submit"
            className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-clay-500 px-7 text-[15px] font-medium text-bone transition-colors hover:bg-clay-600 sm:col-span-2 lg:col-span-1 lg:h-auto"
          >
            <Search className="size-4.5" strokeWidth={2} />
            {t('hero.search')}
          </button>
        </form>

        <p className="mt-4 flex items-center gap-2 text-[12px] text-paper/55">
          <span className="font-mono tracking-wider">{t('hero.photo')}</span> {t('hero.photoCaption')}
        </p>
      </div>

      {/* Marquee prinsip */}
      <div className="relative border-t border-paper/10 bg-forest-950/80 py-4 backdrop-blur" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {[...trust, ...trust].map((item, i) => (
            <span key={i} className="flex items-center gap-10 font-mono text-[11.5px] uppercase tracking-[0.16em] text-paper/60">
              {item}
              <svg width="10" height="10" viewBox="0 0 10 10" className="text-sun-500"><path d="M5 0 C5 3 7 5 10 5 C7 5 5 7 5 10 C5 7 3 5 0 5 C3 5 5 3 5 0Z" fill="currentColor" /></svg>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
