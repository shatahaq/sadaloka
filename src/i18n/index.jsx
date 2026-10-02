import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { dict } from './dict'

/**
 * i18n ringan tanpa library.
 * - t('path.key', { var })  → string UI dari kamus
 * - tr(value)               → konten data: string biasa atau { id, en }
 */
const I18nContext = createContext(null)
const STORAGE_KEY = 'sadaloka-lang'
export const LANGS = ['id', 'en']

function readStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(v)) return v
  } catch {
    /* storage tidak tersedia */
  }
  return 'id'
}

const lookup = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj)
const interpolate = (str, vars) => (vars ? str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`)) : str)

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(readStoredLang)

  const setLang = useCallback((next) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* abaikan */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = dict[lang].meta.title
  }, [lang])

  const value = useMemo(() => {
    const locale = lang === 'id' ? 'id-ID' : 'en-GB'
    const t = (key, vars) => {
      const s = lookup(dict[lang], key) ?? lookup(dict.id, key)
      return typeof s === 'string' ? interpolate(s, vars) : key
    }
    const tr = (v) => (v == null ? '' : typeof v === 'object' && !Array.isArray(v) ? v[lang] ?? v.id : v)
    const num = (n, opts) => n.toLocaleString(locale, opts)
    const dateFmt = new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    const fmtDate = (iso) => (iso ? dateFmt.format(new Date(`${iso}T00:00:00`)) : '')
    const dur = (days) => (days === 1 ? t('common.oneDay') : t('common.daysNights', { d: days, n: days - 1 }))
    const coords = (c) => `${c.lat} ${t('geo.n')} · ${c.lon} ${t('geo.e')}`
    const drive = (hours) => t('common.drive', { h: num(hours) })
    const zone = (c) => `${t('common.corridor')} ${c.numeral} — ${tr(c.zone)}`
    const people = (n) => (lang === 'id' ? `${n} orang` : n === 1 ? '1 guest' : `${n} guests`)
    return { lang, setLang, locale, t, tr, num, fmtDate, dur, coords, drive, zone, people }
  }, [lang, setLang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n harus dipakai di dalam <I18nProvider>')
  return ctx
}
