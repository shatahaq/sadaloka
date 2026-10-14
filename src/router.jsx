import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Corridor from './pages/Corridor'
import Guides from './pages/Guides'
import SmartMatch from './pages/SmartMatch'
import Transparency from './pages/Transparency'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Account from './pages/Account'
import GuidePortal from './pages/GuidePortal'
import Admin from './pages/Admin'
import TripDetail from './pages/TripDetail'
import RequireAuth from './components/RequireAuth'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/paket', element: <Packages /> },
      { path: '/paket/:slug', element: <PackageDetail /> },
      { path: '/koridor/:slug', element: <Corridor /> },
      { path: '/guide', element: <Guides /> },
      { path: '/smart-match', element: <SmartMatch /> },
      { path: '/transparansi', element: <Transparency /> },
      { path: '/pesan/:slug', element: <RequireAuth><Checkout /></RequireAuth> },
      { path: '/masuk', element: <Auth key="login" mode="login" /> },
      { path: '/daftar', element: <Auth key="register" mode="register" /> },
      { path: '/akun', element: <RequireAuth><Account /></RequireAuth> },
      { path: '/akun/pesanan/:code', element: <RequireAuth><TripDetail /></RequireAuth> },
      { path: '/portal-pemandu', element: <RequireAuth loginPath="/portal-pemandu/masuk"><GuidePortal /></RequireAuth> },
      { path: '/portal-pemandu/masuk', element: <Auth key="portal-login" mode="login" portal /> },
      { path: '/admin', element: <RequireAuth><Admin /></RequireAuth> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
