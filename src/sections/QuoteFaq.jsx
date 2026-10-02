import { MessageCircle } from 'lucide-react'
import { faqs } from '../data/content'
import { useI18n } from '../i18n'
import Accordion from '../components/Accordion'
import { Button, Eyebrow } from '../components/ui'
import orangutan from '../assets/img/bukit-lawang.webp'
import mangrove from '../assets/img/mangrove-langkat.webp'

export function Quote() {
  const { t } = useI18n()
  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <figure className="reveal relative">
          <div className="overflow-hidden rounded-[var(--radius-card)]">
            <img src={orangutan} alt={t('quote.alt')} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="absolute -bottom-8 -right-4 hidden w-[44%] overflow-hidden rounded-2xl ring-8 ring-paper sm:block lg:-right-10">
            <img src={mangrove} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          </div>
          <figcaption className="mt-4 font-mono text-[11px] tracking-[0.12em] text-muted">{t('quote.caption')}</figcaption>
        </figure>

        <blockquote className="reveal" style={{ '--delay': '120ms' }}>
          <svg width="44" height="34" viewBox="0 0 44 34" className="text-clay-500" aria-hidden>
            <path fill="currentColor" d="M0 34V20.4C0 8.6 6.2 1.8 18.6 0l1.6 4.6C13.4 6.6 10.2 10.6 10 17h9.2v17H0Zm24 0V20.4C24 8.6 30.2 1.8 42.6 0l1.4 4.6C37.4 6.6 34.2 10.6 34 17h9.6v17H24Z" />
          </svg>
          <p className="font-display-tight mt-6 text-[44px] font-[350] leading-[1.02] sm:text-[64px]">
            {t('quote.text1')} <em className="text-moss-600">{t('quote.text2')}</em>
          </p>
          <footer className="mt-8 flex items-center gap-4 border-t border-line pt-6">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{t('quote.label')}</span>
            <span className="h-px flex-1 bg-line" />
            <span className="text-[13px] text-ink-soft">{t('quote.note')}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}

export function Faq() {
  const { t, tr } = useI18n()
  const items = faqs.map((f) => ({ q: tr(f.q), a: tr(f.a) }))
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line bg-paper py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{t('faq.eyebrow')}</Eyebrow>
          <h2 className="mt-4 font-display text-[40px] leading-[1.02] sm:text-[52px]">
            {t('faq.title1')} <em className="font-[350] text-moss-600">{t('faq.title2')}</em>
          </h2>
          <div className="mt-8 rounded-[var(--radius-card)] bg-forest-900 p-6 text-paper sm:p-7">
            <p className="font-display text-[22px] leading-snug">{t('faq.helpTitle')}</p>
            <p className="mt-2 text-[14px] leading-relaxed text-paper/70">{t('faq.helpText')}</p>
            <Button href="https://wa.me/6281200000000" variant="light" size="md" className="mt-5">
              <MessageCircle className="size-4" strokeWidth={1.75} />
              {t('faq.helpCta')}
            </Button>
          </div>
        </div>
        <div className="reveal" style={{ '--delay': '100ms' }}>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  )
}
