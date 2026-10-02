import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { Eyebrow } from './ui'
import { useI18n } from '../i18n'

/** Header halaman dalam (non-hero) dengan breadcrumb. */
export default function PageHeader({ crumbs = [], eyebrow, title, intro, children }) {
  const { t } = useI18n()
  return (
    <section className="paper-grain border-b border-line pt-[72px]">
      <div className="container-x pb-12 pt-10 sm:pb-14 sm:pt-14">
        {crumbs.length > 0 && (
          <nav aria-label={t('common.breadcrumb')} className="mb-8 flex flex-wrap items-center gap-1 text-[12.5px] text-muted">
            <Link to="/" className="hover:text-ink">{t('common.home')}</Link>
            {crumbs.map(([label, to]) => (
              <span key={label} className="inline-flex items-center gap-1">
                <ChevronRight className="size-3.5" />
                {to ? <Link to={to} className="hover:text-ink">{label}</Link> : <span className="text-ink">{label}</span>}
              </span>
            ))}
          </nav>
        )}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 className="mt-4 font-display text-[40px] leading-[1.02] text-ink sm:text-6xl">{title}</h1>
            {intro && <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">{intro}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
