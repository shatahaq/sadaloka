import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'

/** Halaman yang butuh akun: belum masuk → ke halaman masuk, lalu kembali ke halaman semula. */
export default function RequireAuth({ children, loginPath = '/masuk' }) {
  const { ready, user, signedOut } = useAuth()
  const { pathname, search } = useLocation()
  if (!ready) return <div className="min-h-screen bg-paper" aria-busy="true" />
  if (user) return children
  if (signedOut) return <Navigate to="/" replace />
  return <Navigate to={`${loginPath}?${new URLSearchParams({ next: pathname + search })}`} replace />
}
