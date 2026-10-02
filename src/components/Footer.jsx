import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { corridors } from '../data/corridors'
import { useI18n } from '../i18n'
import mark from '../assets/img/logo-mark.webp'
import wordmarkCream from '../assets/img/logo-wordmark-cream.webp'

export default function Footer() {
  const { t, tr } = useI18n()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const cols = [
    {
      title: t('footer.colExplore'),
      links: [
        [t('footer.allPackages'), '/paket'],
        [t('footer.guideDirectory'), '/guide'],
        ['Smart Trip Match', '/smart-match'],
        [t('footer.costTransparency'), '/transparansi'],
      ],
    },
    {
      title: t('footer.colCorridors'),
      links: corridors.map((c) => [tr(c.name), `/koridor/${c.slug}`]),
    },
    {
      title: t('footer.colSadaloka'),
      links: [
        [t('footer.ethics'), '/transparansi#etika'],
        [t('footer.homestay'), '/transparansi#mitra'],
        [t('footer.joinGuide'), '/guide'],
        [t('footer.help'), '/#faq'],
      ],
    },
  ]

  return (
    <footer className="relative overflow-hidden bg-forest-950 text-paper">
      <div className="topo-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="container-x relative">
        <div className="grid gap-12 border-b border-line-dark py-16 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <p className="max-w-xl font-display text-4xl leading-[1.05] text-paper sm:text-5xl">
            {t('footer.quote1')}
            <br />
            <em className="text-sun-500">{t('footer.quote2')}</em>
          </p>
          <div className="lg:pt-2">
            <p className="text-[15px] text-paper/70">{t('footer.newsletter')}</p>
            <form
              className="mt-5 flex items-center gap-2 rounded-full border border-paper/20 bg-paper/5 p-1.5 pl-5 focus-within:border-paper/50"
              onSubmit={(e) => {
                e.preventDefault()
                if (email) setSent(true)
              }}
            >
              <label htmlFor="newsletter" className="sr-only">Email</label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="h-10 min-w-0 flex-1 bg-transparent text-[15px] text-paper placeholder:text-paper/40 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink transition-colors hover:bg-white"
              >
                {sent ? (
                  <>
                    <Check className="size-4" /> {t('footer.subscribed')}
                  </>
                ) : (
                  <>
                    {t('footer.subscribe')} <ArrowRight className="size-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src={mark} alt="" className="h-14 w-auto" />
              <img src={wordmarkCream} alt="Sadaloka" className="h-5 w-auto" />
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/60">{t('footer.about')}</p>
            <dl className="mt-6 space-y-1.5 font-mono text-[12px] text-paper/50">
              <div className="flex gap-3"><dt className="w-14">WA</dt><dd className="text-paper/80">+62 812-0000-0000</dd></div>
              <div className="flex gap-3"><dt className="w-14">EMAIL</dt><dd className="text-paper/80">halo@sadaloka.id</dd></div>
              <div className="flex gap-3"><dt className="w-14">BASE</dt><dd className="text-paper/80">Stabat, Langkat — 3°44′ {t('geo.n')} 98°27′ {t('geo.e')}</dd></div>
            </dl>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-sage-300">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, to]) => (
                  <li key={to + label}>
                    <Link to={to} className="link-underline text-[14px] text-paper/80 hover:text-paper">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-line-dark py-6 text-[12px] text-paper/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Sadaloka. {t('footer.rights')}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="hover:text-paper">Instagram ↗</a>
            <a href="#" className="hover:text-paper">TikTok ↗</a>
            <a href="#" className="hover:text-paper">YouTube ↗</a>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:text-paper">{t('footer.terms')}</a>
            <a href="#" className="hover:text-paper">{t('footer.privacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
