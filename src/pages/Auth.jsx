import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, MailCheck } from 'lucide-react'
import { cn } from '../lib/format'
import { useI18n } from '../i18n'
import { safeNext, useAuth } from '../lib/auth'
import { Button, Logo } from '../components/ui'

const inputCls = 'mt-1.5 h-12 w-full rounded-xl border border-line-strong bg-bone px-4 text-[15px] focus:border-forest-900 focus:outline-none'

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-clay-600">{error}</span>}
    </label>
  )
}

const errKey = { exists: 'errExists', invalid: 'errInvalid', unconfirmed: 'errUnconfirmed', weak: 'errWeak', rateLimit: 'errRateLimit', notAuthorized: 'errNotAuthorized', badEmail: 'errBadEmail', failed: 'errFailed' }

/** Halaman masuk & daftar (mode: 'login' | 'register'). `portal` = versi untuk pemandu. */
export default function Auth({ mode, portal = false }) {
  const { t } = useI18n()
  const k = (key, vars) => t(`auth.${key}`, vars)
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'), portal ? '/portal-pemandu' : '/akun')
  const base = portal ? '/portal-pemandu' : ''
  const copy = (key) => k(portal ? `portal${key[0].toUpperCase()}${key.slice(1)}` : key)
  const isRegister = mode === 'register'

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false) // pendaftaran perlu konfirmasi email
  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  // sudah masuk (mis. membuka /masuk lewat tombol kembali) → langsung ke tujuan
  if (user && !busy) return <Navigate to={next} replace />

  const submit = async (e) => {
    e.preventDefault()
    const errs = {}
    if (isRegister && form.name.trim().length < 3) errs.name = t('checkout.errName')
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = t('checkout.errEmail')
    if (isRegister && form.phone.replace(/\D/g, '').length < 9) errs.phone = t('checkout.errPhone')
    if (form.password.length < (isRegister ? 6 : 1)) errs.password = k(isRegister ? 'errPasswordShort' : 'errPassword')
    setErrors(errs)
    if (Object.keys(errs).length) return

    setBusy(true)
    const err = isRegister ? await register(form, `${base}/masuk`) : await login(form)
    if (err === 'confirm') {
      setBusy(false)
      setSent(true)
      return
    }
    if (err) {
      setBusy(false)
      setErrors({ form: k(errKey[err] ?? 'errFailed') })
      return
    }
    navigate(next, { replace: true })
  }

  const switchTo = `${base}${isRegister ? '/masuk' : '/daftar'}${params.get('next') ? `?${new URLSearchParams({ next: params.get('next') })}` : ''}`

  return (
    <section className="paper-grain min-h-screen bg-paper pb-20 pt-[72px]">
      <div className="container-x flex justify-center pt-12 sm:pt-16">
        <div className="w-full max-w-[440px]">
          <Logo className="justify-center" />
          {portal && <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-moss-600">{k('portalEyebrow')}</p>}
          <h1 className={cn('text-center font-display text-[36px] leading-tight sm:text-[44px]', portal ? 'mt-2' : 'mt-8')}>{copy(isRegister ? 'registerTitle' : 'loginTitle')}</h1>
          <p className="mt-2 text-center text-[15px] text-ink-soft">{copy(isRegister ? 'registerIntro' : 'loginIntro')}</p>

          {sent ? (
            <div className="mt-8 rounded-[var(--radius-card)] bg-bone p-6 text-center ring-1 ring-line sm:p-8" role="status">
              <span className="mx-auto grid size-12 place-items-center rounded-full bg-sage-100 text-moss-600"><MailCheck className="size-6" strokeWidth={1.75} /></span>
              <p className="mt-4 font-display text-[24px] leading-tight">{k('checkEmailTitle')}</p>
              <p className="mt-2 text-[14.5px] text-ink-soft">{k('checkEmailText', { email: form.email.trim() })}</p>
              <Button to={`${base}/masuk${params.get('next') ? `?${new URLSearchParams({ next: params.get('next') })}` : ''}`} variant="outline" className="mt-6">{k('toLogin')}</Button>
            </div>
          ) : (
            <>
              <form onSubmit={submit} noValidate className="mt-8 space-y-4 rounded-[var(--radius-card)] bg-bone p-6 ring-1 ring-line sm:p-8">
                {errors.form && <p role="alert" className="rounded-xl bg-clay-100 px-4 py-3 text-[13.5px] text-clay-600">{errors.form}</p>}
                {isRegister && (
                  <Field label={t('checkout.name')} error={errors.name}>
                    <input value={form.name} onChange={set('name')} className={inputCls} autoComplete="name" />
                  </Field>
                )}
                <Field label={t('checkout.email')} error={errors.email}>
                  <input type="email" value={form.email} onChange={set('email')} className={inputCls} autoComplete="email" />
                </Field>
                {isRegister && (
                  <Field label={t('checkout.phone')} error={errors.phone}>
                    <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+62" className={inputCls} autoComplete="tel" />
                  </Field>
                )}
                <Field label={k('password')} error={errors.password}>
                  <span className="relative block">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={form.password}
                      onChange={set('password')}
                      className={cn(inputCls, 'pr-12')}
                      autoComplete={isRegister ? 'new-password' : 'current-password'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-2 top-1/2 mt-[3px] grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted hover:text-ink"
                      aria-label={k(showPw ? 'hidePassword' : 'showPassword')}
                    >
                      {showPw ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </button>
                  </span>
                </Field>
                <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy}>
                  {k(isRegister ? 'registerCta' : 'loginCta')}
                </Button>
              </form>

              {portal ? (
                // akun pemandu dibuat admin — tidak ada pendaftaran mandiri
                <p className="mt-6 text-center text-[14px] text-ink-soft">{k('portalNoSignup')}</p>
              ) : (
                <p className="mt-6 text-center text-[14px] text-ink-soft">
                  {k(isRegister ? 'haveAccount' : 'noAccount')}{' '}
                  <Link to={switchTo} className="font-medium text-ink underline underline-offset-4">{k(isRegister ? 'toLogin' : 'toRegister')}</Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
