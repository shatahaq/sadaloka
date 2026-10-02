import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn, initials } from '../lib/format'
import { LANGS, useI18n } from '../i18n'
import mark from '../assets/img/logo-mark.webp'
import wordmark from '../assets/img/logo-wordmark.webp'
import wordmarkCream from '../assets/img/logo-wordmark-cream.webp'

export function Logo({ tone = 'dark', className = '' }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <img src={mark} alt="" className="h-10 w-auto shrink-0" width="36" height="40" />
      <img
        src={tone === 'light' ? wordmarkCream : wordmark}
        alt="Sadaloka"
        className="h-[18px] w-auto translate-y-px"
        width="94"
        height="18"
      />
    </span>
  )
}

const variants = {
  primary: 'bg-clay-500 text-bone hover:bg-clay-600 shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)]',
  dark: 'bg-forest-900 text-paper hover:bg-forest-800',
  light: 'bg-bone text-ink hover:bg-white',
  outline: 'border border-line-strong text-ink hover:border-ink hover:bg-ink/[0.03]',
  'outline-light': 'border border-paper/30 text-paper hover:border-paper hover:bg-paper/5',
  ghost: 'text-ink hover:bg-ink/5',
}
const sizes = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-6 text-[15px] gap-2.5',
}

/** Tombol serbaguna — otomatis menjadi <Link> bila diberi `to`. */
export function Button({ to, href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const cls = cn(
    'inline-flex shrink-0 items-center justify-center rounded-full font-medium tracking-[-0.005em] transition-colors duration-200 disabled:opacity-40',
    variants[variant],
    sizes[size],
    className,
  )
  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  if (href) return <a href={href} className={cls} {...rest}>{children}</a>
  return <button className={cls} {...rest}>{children}</button>
}

/** Tautan teks dengan panah — dipakai untuk CTA sekunder "Eksplorasi →" */
export function ArrowLink({ to, children, className = '', tone = 'dark' }) {
  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-1.5 text-sm font-medium',
        tone === 'light' ? 'text-paper' : 'text-ink',
        className,
      )}
    >
      <span className="link-underline pb-0.5">{children}</span>
      <ArrowUpRight
        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        strokeWidth={1.75}
      />
    </Link>
  )
}

export function Eyebrow({ children, className = '', tone = 'dark' }) {
  return (
    <p className={cn('eyebrow flex items-center gap-2.5', tone === 'light' ? 'text-sage-300' : 'text-moss-600', className)}>
      <span className={cn('h-px w-6', tone === 'light' ? 'bg-sage-300/60' : 'bg-moss-600/50')} />
      {children}
    </p>
  )
}

export function Chip({ active, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] transition-colors',
        active
          ? 'border-forest-900 bg-forest-900 text-paper'
          : 'border-line-strong bg-bone/60 text-ink-soft hover:border-ink/40 hover:text-ink',
        className,
      )}
    >
      {children}
    </button>
  )
}

/** Indikator tingkat kesulitan berupa tiga bar */
export function DifficultyBars({ level, className = '' }) {
  return (
    <span className={cn('inline-flex items-end gap-[3px]', className)} aria-hidden>
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn('w-[3px] rounded-full', i <= level ? 'bg-current' : 'bg-current opacity-25')}
          style={{ height: 4 + i * 3 }}
        />
      ))}
    </span>
  )
}

/**
 * Monogram pemandu — netral & tipografis, dipakai sampai foto resmi tersedia.
 * Sengaja tanpa warna acak agar tidak terasa seperti avatar generik.
 */
export function Monogram({ name, size = 'md', tone = 'light', className = '' }) {
  const sz = { sm: 'size-10 text-[15px]', md: 'size-14 text-[20px]', lg: 'size-20 text-[28px]' }[size]
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-display tracking-[-0.02em]',
        tone === 'dark' ? 'bg-forest-800 text-paper/90 ring-1 ring-line-dark' : 'bg-paper-2 text-ink-soft ring-1 ring-line-strong',
        sz,
        className,
      )}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}

/** Pengalih bahasa ID / EN — segmented control kecil */
export function LangSwitch({ tone = 'dark', className = '' }) {
  const { lang, setLang, t } = useI18n()
  const light = tone === 'light'
  return (
    <div
      role="group"
      aria-label={t('nav.language')}
      className={cn(
        'inline-flex h-9 items-center rounded-full p-0.5 font-mono text-[11px] tracking-[0.08em]',
        light ? 'bg-paper/10 ring-1 ring-paper/20' : 'bg-ink/[0.04] ring-1 ring-line-strong',
        className,
      )}
    >
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={cn(
            'h-8 rounded-full px-2.5 uppercase transition-colors',
            lang === l
              ? light
                ? 'bg-paper text-ink'
                : 'bg-forest-900 text-paper'
              : light
                ? 'text-paper/70 hover:text-paper'
                : 'text-muted hover:text-ink',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
