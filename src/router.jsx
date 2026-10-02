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
      { path: '/pesan/:slug', element: <Checkout /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
