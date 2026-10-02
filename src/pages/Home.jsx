import { useReveal } from '../lib/useReveal'
import Hero from '../sections/Hero'
import QuickAccess from '../sections/QuickAccess'
import Corridors from '../sections/Corridors'
import FeaturedPackages from '../sections/FeaturedPackages'
import WhySadaloka from '../sections/WhySadaloka'
import Journey from '../sections/Journey'
import { Faq, Quote } from '../sections/QuoteFaq'

export default function Home() {
  const ref = useReveal()
  return (
    <div ref={ref}>
      <Hero />
      <QuickAccess />
      <Corridors />
      <FeaturedPackages />
      <WhySadaloka />
      <Journey />
      <Quote />
      <Faq />
    </div>
  )
}
