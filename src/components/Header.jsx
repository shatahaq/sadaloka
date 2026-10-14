import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, ClipboardList, LayoutDashboard, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useData } from '../data'
import { rupiah, cn } from '../lib/format'
import { useI18n } from '../i18n'
import { useAuth } from '../lib/auth'
import { Button, LangSwitch, Logo, Monogram } from './ui'

const links = [
  { to: '/paket', key: 'nav.packages' },
  { to: '/guide', key: 'nav.guides' },
  { to: '/smart-match', key: 'nav.smartMatch' },
  { to: '/transparansi', key: 'nav.transparency' },
]

/** Tombol akun di header: menu kecil berisi nama, "Perjalanan saya", dan "Keluar". */
function AccountMenu({ light, onLogout }) {
  const { user, guideId, isAdmin } = useAuth()
  const { t } = useI18n()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onDown = (e) => !ref.current?.contains(e.target) && setOpen(false)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={t('nav.account')}
        className={cn('flex items-center gap-1 rounded-full p-0.5 pr-2 transition-colors', light ? 'hover:bg-paper/10' : 'hover:bg-ink/5')}
      >
        <Monogram name={user.name} size="sm" />
        <ChevronDown className={cn('size-3.5 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_24px_48px_-20px_rgb(22_26_20/0.35)] ring-1 ring-line">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-[12.5px] text-muted">{user.email}</p>
          </div>
          <Link to="/akun" className="flex items-center gap-2.5 px-4 py-3 text-[14px] hover:bg-ink/[0.04]">
            <UserRound className="size-4 text-muted" />{t('nav.myTrips')}
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2.5 border-t border-line px-4 py-3 text-[14px] hover:bg-ink/[0.04]">
              <LayoutDashboard className="size-4 text-muted" />{t('nav.admin')}
            </Link>
          )}
          {guideId && (
            <Link to="/portal-pemandu" className="flex items-center gap-2.5 border-t border-line px-4 py-3 text-[14px] hover:bg-ink/[0.04]">
              <ClipboardList className="size-4 text-muted" />{t('nav.guidePortal')}
            </Link>
          )}
          <button type="button" onClick={onLogout} className="flex w-full items-center gap-2.5 border-t border-line px-4 py-3 text-left text-[14px] text-clay-600 hover:bg-ink/[0.04]">
            <LogOut className="size-4" />{t('nav.logout')}
          </button>
        </div>
      )}
    </div>
  )
}

/** Halaman dengan hero foto gelap di bagian atas → header transparan + teks terang */
const DARK_HERO = [/^\/$/, /^\/koridor\//]

export default function Header() {
  const { corridors } = useData()
  const { t, tr } = useI18n()
  const { pathname, search } = useLocation()
  const { user, guideId, isAdmin, logout: handleLogout } = useAuth()
  // di area portal pemandu, tombol "Masuk" membuka halaman masuk khusus pemandu
  const loginBase = pathname.startsWith('/portal-pemandu') ? '/portal-pemandu/masuk' : '/masuk'
  const onAuthPage = /^\/(portal-pemandu\/)?(masuk|daftar)$/.test(pathname)
  const loginTo = onAuthPage ? loginBase : `${loginBase}?${new URLSearchParams({ next: pathname + search })}`
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const closeTimer = useRef()

  const overHero = DARK_HERO.some((r) => r.test(pathname)) && !scrolled && !megaOpen
  const light = overHero && !mobileOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
  }, [mobileOpen])

  const openMega = () => {
    clearTimeout(closeTimer.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    closeTimer.current = setTimeout(() => setMegaOpen(false), 120)
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color] duration-300',
        light ? 'text-paper' : 'text-ink',
        !overHero && 'bg-paper/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl',
      )}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link to="/" aria-label="Sadaloka" className="relative z-10">
          <Logo tone={light ? 'light' : 'dark'} />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={t('nav.mainNav')}>
          <div onMouseEnter={openMega} onMouseLeave={closeMega} className="relative">
            <button
              type="button"
              onClick={() => setMegaOpen((v) => !v)}
              aria-expanded={megaOpen}
              className={cn(
                'inline-flex h-10 items-center gap-1 rounded-full px-3.5 text-[14px] font-medium transition-colors',
                light ? 'hover:bg-paper/10' : 'hover:bg-ink/5',
              )}
            >
              {t('nav.corridors')}
              <ChevronDown className={cn('size-3.5 transition-transform', megaOpen && 'rotate-180')} />
            </button>
          </div>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'inline-flex h-10 items-center rounded-full px-3.5 text-[14px] font-medium transition-colors',
                  light ? 'hover:bg-paper/10' : 'hover:bg-ink/5',
                  isActive && (light ? 'bg-paper/10' : 'bg-ink/[0.06]'),
                )
              }
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitch tone={light ? 'light' : 'dark'} className="max-sm:hidden" />
          <Button to="/smart-match" variant={light ? 'light' : 'dark'} size="sm" className="max-sm:hidden">
            {t('nav.planTrip')}
          </Button>
          {user ? (
            <span className="max-sm:hidden"><AccountMenu light={light} onLogout={handleLogout} /></span>
          ) : (
            <Button to={loginTo} variant={light ? 'outline-light' : 'outline'} size="sm" className="max-sm:hidden">
              {t('nav.login')}
            </Button>
          )}
          <button
            type="button"
            className={cn('grid size-10 place-items-center rounded-full lg:hidden', light ? 'hover:bg-paper/10' : 'hover:bg-ink/5')}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mega menu koridor */}
      <div
        onMouseEnter={openMega}
        onMouseLeave={closeMega}
        className={cn(
          'absolute inset-x-0 top-full hidden origin-top border-t border-line bg-paper text-ink shadow-[0_24px_48px_-24px_rgb(22_26_20/0.25)] transition-[opacity,transform] duration-300 lg:block',
          megaOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0',
        )}
      >
        <div className="container-x grid grid-cols-[220px_1fr] gap-10 py-8">
          <div className="flex flex-col justify-between">
            <div>
              <p className="eyebrow text-moss-600">{t('nav.megaEyebrow')}</p>
              <p className="mt-3 font-display text-2xl leading-tight">{t('nav.megaTitle')}</p>
            </div>
            <Link to="/paket" className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
              <span className="link-underline">{t('nav.megaAll')}</span>
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <ul className="grid grid-cols-5 gap-4">
            {corridors.map((c) => (
              <li key={c.slug}>
                <Link to={`/koridor/${c.slug}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-paper-2">
                    <img
                      src={c.imageSm ?? c.image}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    {t('common.corridor')} {c.numeral}
                  </p>
                  <p className="mt-0.5 font-medium leading-snug">{tr(c.name)}</p>
                  <p className="text-[13px] text-muted">
                    {t('common.from')} {rupiah(c.priceFrom)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={cn(
          'fixed inset-0 top-[72px] overflow-y-auto bg-paper text-ink transition-opacity duration-300 lg:hidden',
          mobileOpen ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <div className="container-x flex min-h-full flex-col py-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="eyebrow text-muted">{t('nav.language')}</span>
            <LangSwitch />
          </div>
          <nav className="flex flex-col" aria-label={t('nav.mobileNav')}>
            {[{ to: '/', key: 'common.home' }, ...links].map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end
                className="flex items-center justify-between border-b border-line py-4 font-display text-3xl"
              >
                {t(l.key)}
                <ArrowUpRight className="size-5 text-muted" strokeWidth={1.5} />
              </NavLink>
            ))}
          </nav>
          <p className="eyebrow mt-8 text-moss-600">{t('nav.corridors')}</p>
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {corridors.map((c) => (
              <li key={c.slug}>
                <Link to={`/koridor/${c.slug}`} className="flex items-center gap-3 rounded-xl border border-line bg-bone p-2">
                  <img src={c.imageSm ?? c.image} alt="" className="size-11 rounded-lg object-cover" />
                  <span className="text-[13px] font-medium leading-tight">{tr(c.name)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-2xl border border-line bg-bone p-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  <Monogram name={user.name} size="sm" />
                  <Link to="/akun" className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{user.name}</span>
                    <span className="text-[13px] text-muted underline underline-offset-4">{t('nav.myTrips')}</span>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="size-4" />{t('nav.logout')}</Button>
                </div>
                {isAdmin && <Button to="/admin" variant="dark" className="mt-3 w-full"><LayoutDashboard className="size-4" />{t('nav.admin')}</Button>}
                {guideId && <Button to="/portal-pemandu" variant="dark" className="mt-3 w-full"><ClipboardList className="size-4" />{t('nav.guidePortal')}</Button>}
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button to={loginTo} variant="outline">{t('nav.login')}</Button>
                <Button to="/daftar" variant="dark">{t('nav.register')}</Button>
              </div>
            )}
          </div>
          <Button to="/smart-match" variant="primary" size="lg" className="mt-4 w-full">
            {t('nav.planTrip')}
          </Button>
        </div>
      </div>
    </header>
  )
}
