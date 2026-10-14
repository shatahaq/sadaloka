import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, Backpack, Baby, Check, CircleHelp, Clock, Coins, CookingPot, Gem, Heart,
  Pencil, RotateCcw, Sparkles, Sun, Tent, User, Users, Wallet, Zap,
} from 'lucide-react'
import { useData } from '../data'
import { altLabel, experienceImage, experienceOptions, matchPackages } from '../lib/match'
import { cn, rupiah } from '../lib/format'
import { useI18n } from '../i18n'
import PackageCard from '../components/PackageCard'
import { Button, DifficultyBars, Eyebrow } from '../components/ui'
import { difficultyLevels } from '../lib/constants'

const WA = 'https://wa.me/6281200000000'
const QUESTIONS = ['experiences', 'days', 'group', 'fitness', 'budget']
const EMPTY = { experiences: [], days: null, group: null, fitness: null, budget: null }

const groupOptions = [
  { v: 'solo', key: 'gSolo', Icon: User },
  { v: 'couple', key: 'gCouple', Icon: Heart },
  { v: 'family', key: 'gFamily', Icon: Baby },
  { v: 'group', key: 'gGroup', Icon: Users },
]
const dayOptions = [
  { v: 1, Icon: Sun },
  { v: 2, Icon: Tent },
  { v: 3, Icon: Backpack },
]
const budgetChoices = [
  { v: 'low', key: 'bLow', Icon: Coins },
  { v: 'mid', key: 'bMid', Icon: Wallet },
  { v: 'high', key: 'bHigh', Icon: Gem },
  { v: 'any', key: 'bAny', Icon: CircleHelp },
]
const fallbackIcons = { culture: CookingPot, thrill: Zap }

/* ── Komponen pilihan ─────────────────────────────────────── */

function ExperienceTile({ option, selected, onClick, title, note }) {
  const Icon = fallbackIcons[option.key]
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'group relative aspect-[4/5] overflow-hidden rounded-2xl text-left md:aspect-[5/4] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out-expo)]',
        selected ? 'shadow-[0_0_0_3px_var(--color-forest-950),0_0_0_5px_var(--color-sage-200)]' : 'hover:-translate-y-1',
      )}
    >
      {option.image ? (
        <>
          <img src={option.image} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
          <span className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-transparent" />
        </>
      ) : (
        <span className="topo-lines absolute inset-0 bg-forest-800">
          <Icon className="absolute left-4 top-4 size-7 text-sun-500" strokeWidth={1.5} />
        </span>
      )}
      <span
        className={cn(
          'absolute right-3 top-3 grid size-7 place-items-center rounded-full border-2 transition-colors',
          selected ? 'border-sage-200 bg-sage-200 text-forest-950' : 'border-paper/80 bg-forest-950/20 text-transparent',
        )}
        aria-hidden
      >
        <Check className="size-4" strokeWidth={3} />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-4">
        <span className="block font-display text-[19px] leading-[1.1] text-paper sm:text-[21px]">{title}</span>
        <span className="mt-1 block text-[12.5px] leading-snug text-paper/75">{note}</span>
      </span>
    </button>
  )
}

function Choice({ selected, onClick, icon, title, note }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        'match-choice flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-[border-color,box-shadow] duration-200 sm:p-5',
        selected ? 'border-sage-200 shadow-[0_0_0_1px_var(--color-sage-200)]' : 'hover:border-sage-300',
      )}
    >
      <span className={cn('grid size-12 shrink-0 place-items-center rounded-xl transition-colors', selected ? 'bg-forest-900 text-paper' : 'bg-paper-2 text-moss-600')}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-medium leading-snug">{title}</span>
        <span className="mt-0.5 block text-[14px] text-muted">{note}</span>
      </span>
      <span
        className={cn(
          'grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors',
          selected ? 'border-forest-900 bg-forest-900 text-paper' : 'border-line-strong text-transparent',
        )}
        aria-hidden
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
    </button>
  )
}

/* ── Halaman ──────────────────────────────────────────────── */

export default function SmartMatch() {
  const { corridorBySlug, packages } = useData()
  const { t, tr, dur, lang } = useI18n()
  const m = (k, vars) => t(`match.${k}`, vars)

  const [answers, setAnswers] = useState(EMPTY)
  const [step, setStep] = useState(0)
  const [view, setView] = useState('quiz')
  const [editing, setEditing] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  const results = useMemo(() => matchPackages(packages, answers), [packages, answers])
  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const advance = () => {
    if (editing || step === QUESTIONS.length - 1) {
      setEditing(false)
      setView('results')
    } else {
      setStep((s) => s + 1)
    }
    toTop()
  }

  // Pilihan tunggal → simpan lalu lanjut otomatis (jeda singkat agar pilihan terlihat)
  const pick = (field, value) => {
    setAnswers((a) => ({ ...a, [field]: value }))
    clearTimeout(timer.current)
    timer.current = setTimeout(advance, 280)
  }

  const toggleExperience = (key) =>
    setAnswers((a) => ({
      ...a,
      experiences: a.experiences.includes(key) ? a.experiences.filter((k) => k !== key) : [...a.experiences, key],
    }))

  const surpriseMe = () => {
    setAnswers((a) => ({ ...a, experiences: [] }))
    advance()
  }

  const editQuestion = (i) => {
    setEditing(true)
    setStep(i)
    setView('quiz')
    toTop()
  }

  const restart = () => {
    setAnswers(EMPTY)
    setStep(0)
    setEditing(false)
    setView('quiz')
    toTop()
  }

  /* ── Tampilan kuis ── */
  if (view === 'quiz') {
    const q = QUESTIONS[step]
    const n = step + 1
    return (
      <section className="smart-trip min-h-screen pt-[72px]">
        <div className={cn('mx-auto w-full max-w-[960px] px-5 pt-8 sm:px-8 sm:pt-12', q === 'experiences' ? 'pb-36' : 'pb-24')}>
          {/* Navigasi & progres */}
          <div className="flex h-9 items-center justify-between gap-4">
            {editing ? (
              <button type="button" onClick={() => { setEditing(false); setView('results') }} className="inline-flex items-center gap-1.5 text-[14px] text-ink-soft hover:text-ink">
                <ArrowLeft className="size-4" /> {m('backToResults')}
              </button>
            ) : step > 0 ? (
              <button type="button" onClick={() => { setStep(step - 1); toTop() }} className="inline-flex items-center gap-1.5 text-[14px] text-ink-soft hover:text-ink">
                <ArrowLeft className="size-4" /> {m('back')}
              </button>
            ) : (
              <span className="eyebrow text-sage-300">{m('eyebrow')}</span>
            )}
            <span className="font-mono text-[12px] tracking-[0.06em] text-muted">
              {editing ? m('editing') : m('qOf', { n, total: QUESTIONS.length })}
            </span>
          </div>
          {!editing && (
            <div className="mt-3 grid grid-cols-5 gap-1.5" aria-hidden>
              {QUESTIONS.map((x, i) => (
                <span key={x} className={cn('h-1 rounded-full transition-colors duration-500', i <= step ? 'bg-sage-200' : 'bg-paper/20')} />
              ))}
            </div>
          )}

          <div key={`${step}-${editing}`} className="q-enter mt-10 sm:mt-14">
            <h1 className="max-w-3xl font-display text-[34px] leading-[1.06] text-paper sm:text-[48px]">{m(`q${n}`)}</h1>
            <p className="mt-3 text-[16px] text-sage-200">{m(`q${n}h`)}</p>

            {q === 'experiences' && (
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {experienceOptions.map((o) => (
                  <ExperienceTile
                    key={o.key}
                    option={{ ...o, image: experienceImage(o, corridorBySlug) }}
                    selected={answers.experiences.includes(o.key)}
                    onClick={() => toggleExperience(o.key)}
                    title={m(`exp.${o.key}`)}
                    note={m(`exp.${o.key}N`)}
                  />
                ))}
                <button
                  type="button"
                  onClick={surpriseMe}
                  className="flex aspect-[4/5] flex-col justify-between rounded-2xl border-2 md:aspect-[5/4] border-dashed border-line-strong p-4 text-left transition-colors hover:border-ink/50 hover:bg-bone"
                >
                  <Sparkles className="size-7 text-clay-500" strokeWidth={1.5} />
                  <span>
                    <span className="block font-display text-[19px] leading-[1.1] sm:text-[21px]">{m('exp.surprise')}</span>
                    <span className="mt-1 block text-[12.5px] text-muted">{m('exp.surpriseN')}</span>
                  </span>
                </button>
              </div>
            )}

            {q === 'days' && (
              <div className="mt-8 grid max-w-[640px] gap-3" role="radiogroup" aria-label={m('q2')}>
                {dayOptions.map(({ v, Icon }) => (
                  <Choice key={v} selected={answers.days === v} onClick={() => pick('days', v)} icon={<Icon className="size-5.5" strokeWidth={1.5} />} title={m(`d${v}`)} note={m(`d${v}n`)} />
                ))}
              </div>
            )}

            {q === 'group' && (
              <div className="mt-8 grid max-w-[640px] gap-3" role="radiogroup" aria-label={m('q3')}>
                {groupOptions.map(({ v, key, Icon }) => (
                  <Choice key={v} selected={answers.group === v} onClick={() => pick('group', v)} icon={<Icon className="size-5.5" strokeWidth={1.5} />} title={m(key)} note={m(`${key}N`)} />
                ))}
              </div>
            )}

            {q === 'fitness' && (
              <div className="mt-8 grid max-w-[640px] gap-3" role="radiogroup" aria-label={m('q4')}>
                {[1, 2, 3].map((v) => (
                  <Choice key={v} selected={answers.fitness === v} onClick={() => pick('fitness', v)} icon={<DifficultyBars level={v} className="scale-[1.6]" />} title={m(`fit${v}`)} note={m(`fit${v}n`)} />
                ))}
              </div>
            )}

            {q === 'budget' && (
              <div className="mt-8 grid max-w-[640px] gap-3" role="radiogroup" aria-label={m('q5')}>
                {budgetChoices.map(({ v, key, Icon }) => (
                  <Choice key={v} selected={answers.budget === v} onClick={() => pick('budget', v)} icon={<Icon className="size-5.5" strokeWidth={1.5} />} title={m(key)} note={m(`${key}N`)} />
                ))}
              </div>
            )}

            {q !== 'experiences' && !editing && (
              <button type="button" onClick={advance} className="mt-6 text-[14px] text-muted underline underline-offset-4 hover:text-ink">
                {m('skip')}
              </button>
            )}
          </div>
        </div>

        {/* Bar aksi untuk pertanyaan pilihan-ganda */}
        {q === 'experiences' && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-paper/15 bg-forest-950/90 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[960px] items-center justify-between gap-4 px-5 py-4 sm:px-8">
              <p className="hidden text-[14px] text-sage-200 sm:block">{m('intro')}</p>
              <Button variant="light" size="lg" className="w-full sm:w-auto" onClick={advance} disabled={!answers.experiences.length}>
                {answers.experiences.length ? m('continueN', { n: answers.experiences.length }) : m('next')}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </section>
    )
  }

  /* ── Tampilan hasil ── */
  const [best, ...alts] = results
  const c = corridorBySlug[best.pkg.corridor]
  const fitKey = best.score >= 80 ? 'fitGreat' : best.score >= 60 ? 'fitGood' : 'fitOk'
  const lowMatch = best.score < 60

  const reasonText = (r) => {
    if (r.key === 'rInterests') return m('rInterests', { list: r.items.map((k) => m(`exp.${k}`)).join(', ') })
    if (r.key === 'rDuration') return m('rDuration', { dur: dur(r.days) })
    if (r.key === 'rFitness') {
      const level = t(`difficulty.${r.difficulty}`)
      return m('rFitness', { level: lang === 'id' ? level.toLowerCase() : level })
    }
    return m(r.key)
  }

  const expLabel = answers.experiences.length
    ? answers.experiences.length > 2
      ? `${m(`exp.${answers.experiences[0]}`)} +${answers.experiences.length - 1}`
      : answers.experiences.map((k) => m(`exp.${k}`)).join(', ')
    : m('any')
  const pills = [
    [m('pExp'), expLabel],
    [m('pDays'), answers.days ? m(`d${answers.days}`) : m('any')],
    [m('pGroup'), answers.group ? m(groupOptions.find((g) => g.v === answers.group).key) : m('any')],
    [m('pFitness'), answers.fitness ? m(`fit${answers.fitness}`) : m('any')],
    [m('pBudget'), answers.budget && answers.budget !== 'any' ? m(budgetChoices.find((b) => b.v === answers.budget).key) : m('any')],
  ]

  return (
    <section className="smart-trip min-h-screen pb-24 pt-[72px]">
      <div className="container-x pt-10 sm:pt-14">
        <div className="q-enter flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{m('rEyebrow')}</Eyebrow>
            <h1 className="mt-4 font-display text-[40px] leading-[1.02] text-paper sm:text-[56px]">{m('rTitle')}</h1>
            <p className="mt-3 text-[16px] text-sage-200">{m('rIntro')}</p>
          </div>
          <button type="button" onClick={restart} className="inline-flex items-center gap-2 text-[14px] text-ink-soft hover:text-ink">
            <RotateCcw className="size-4" /> {m('restart')}
          </button>
        </div>

        {/* Jawaban — tiap pill bisa diklik untuk mengubah */}
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[13px] text-muted">{m('yourAnswers')}</span>
          {pills.map(([label, value], i) => (
            <button
              key={label}
              type="button"
              onClick={() => editQuestion(i)}
              aria-label={`${m('edit')} ${label}: ${value}`}
              className="group inline-flex h-9 items-center gap-2 rounded-full border border-line-strong bg-bone pl-3.5 pr-3 text-[13px] transition-colors hover:border-ink"
            >
              <span className="text-muted">{label}</span>
              <span className="font-medium">{value}</span>
              <Pencil className="size-3.5 text-muted transition-colors group-hover:text-ink" />
            </button>
          ))}
        </div>

        {/* Pilihan terbaik */}
        <article className="q-enter mt-10 grid overflow-hidden rounded-[var(--radius-card)] bg-sage-100 ring-1 ring-sage-300 lg:grid-cols-[1.05fr_1fr]" style={{ animationDelay: '80ms' }}>
          <div className="relative min-h-[280px] sm:min-h-[360px]">
            <img src={c.imageSm ?? c.image} alt={tr(c.imageAlt)} className="absolute inset-0 size-full object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-clay-500 px-3 py-1.5 text-[12.5px] font-medium text-bone">{m('best')}</span>
          </div>
          <div className="flex flex-col p-6 sm:p-10">
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-2.5 py-1 font-medium text-moss-600">
                <span className="size-1.5 rounded-full bg-moss-500" />
                {m(fitKey)}
              </span>
              <span className="text-muted">{t('common.corridor')} {c.numeral} · {tr(c.name)}</span>
            </p>
            <h2 className="mt-4 font-display text-[32px] leading-[1.05] sm:text-[42px]">{tr(best.pkg.title)}</h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">{tr(best.pkg.tagline)}</p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5"><Clock className="size-4" strokeWidth={1.75} />{dur(best.pkg.days)}</span>
              <span className="inline-flex items-center gap-1.5"><DifficultyBars level={difficultyLevels[best.pkg.difficulty]} className="text-moss-600" />{t(`difficulty.${best.pkg.difficulty}`)}</span>
              <span className="inline-flex items-center gap-1.5"><Users className="size-4" strokeWidth={1.75} />{t('common.maxPeople', { n: best.pkg.group[1] })}</span>
            </div>

            {best.reasons.length > 0 && (
              <div className="mt-7 border-t border-line pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{m('why')}</p>
                <ul className="mt-3 space-y-2.5">
                  {best.reasons.slice(0, 4).map((r) => (
                    <li key={r.key} className="flex gap-3 text-[15px] leading-snug">
                      <Check className="mt-0.5 size-4.5 shrink-0 text-moss-600" strokeWidth={2.25} />
                      {reasonText(r)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-8">
              <div>
                <p className="text-[12px] text-muted">{t('common.from')}</p>
                <p className="text-[24px] font-semibold tracking-tight">
                  {rupiah(best.pkg.price)}
                  <span className="text-[13px] font-normal text-muted"> {t('common.perPerson')}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button href={WA} variant="outline">{m('ask')}</Button>
                <Button to={`/paket/${best.pkg.slug}`} variant="primary">
                  {m('seeDetail')} <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </article>

        {lowMatch && (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-sun-100 p-5 ring-1 ring-sun-500/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <p className="max-w-2xl text-[14.5px] leading-relaxed">{m('lowNote')}</p>
            <Button href={WA} variant="dark" size="sm">{m('custom')}</Button>
          </div>
        )}

        {/* Alternatif */}
        <h2 className="mt-16 font-display text-[28px] leading-tight sm:text-[34px]">{m('alternatives')}</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {alts.map((r) => (
            <PackageCard
              key={r.pkg.slug}
              pkg={r.pkg}
              badge={<span className="rounded-full bg-bone/95 px-2.5 py-1 text-[11px] font-medium text-ink">{m(altLabel(r.pkg, best.pkg))}</span>}
            />
          ))}
          <Link
            to="/paket"
            className="group flex min-h-[220px] flex-col justify-between rounded-[var(--radius-card)] border-2 border-dashed border-line-strong p-6 transition-colors hover:border-ink/50 hover:bg-bone"
          >
            <ArrowUpRight className="size-6 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
            <div>
              <p className="font-display text-[26px] leading-tight">{m('browseAll')}</p>
              <p className="mt-1 text-[14px] text-muted">{t('quick.g1Meta', { n: packages.length })}</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
