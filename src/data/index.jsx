import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useI18n } from '../i18n'
import { fetchSiteData } from './api'

/**
 * Data situs (koridor, paket, pemandu, konten beranda) dari Supabase.
 * Dimuat sekali saat aplikasi dibuka; komponen membacanya lewat useData().
 */
const DataContext = createContext(null)

export function DataProvider({ children }) {
  const { t } = useI18n()
  const [state, setState] = useState({ status: 'loading' })

  const load = useCallback(() => {
    setState({ status: 'loading' })
    fetchSiteData()
      .then((data) => setState({ status: 'ready', data }))
      .catch((error) => {
        console.error('Gagal memuat data Supabase:', error)
        setState({ status: 'error', missingConfig: error?.message === 'missing-config' })
      })
  }, [])

  useEffect(load, [load])

  if (state.status === 'ready') return <DataContext.Provider value={state.data}>{children}</DataContext.Provider>

  return (
    <div className="grid min-h-svh place-items-center bg-paper px-6 text-center" role={state.status === 'error' ? 'alert' : 'status'}>
      {state.status === 'loading' ? (
        <p className="flex items-center gap-3 text-[15px] text-ink-soft">
          <span className="size-2 animate-pulse rounded-full bg-moss-600" aria-hidden />
          {t('data.loading')}
        </p>
      ) : (
        <div className="max-w-md">
          <p className="text-[15px] leading-relaxed text-ink-soft">{t(state.missingConfig ? 'data.missingConfig' : 'data.error')}</p>
          {!state.missingConfig && (
            <button type="button" onClick={load} className="mt-5 h-11 rounded-full bg-forest-900 px-6 text-[14px] font-medium text-paper hover:bg-forest-950">
              {t('data.retry')}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData harus dipakai di dalam <DataProvider>')
  return ctx
}
