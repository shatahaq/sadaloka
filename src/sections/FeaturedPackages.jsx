import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useData } from '../data'
import { useI18n } from '../i18n'
import PackageCard from '../components/PackageCard'
import { ArrowLink, Eyebrow } from '../components/ui'

// satu paket per koridor + satu perjalanan panjang
const pickSlugs = [
  'bukit-lawang-jungle-river',
  'tangkahan-wild-harmony-2d1n',
  'rafflesia-riverland-day-trip',
  'pelaruga-three-pools-escape',
  'lubuk-kertang-mangrove-revival',
  'leuser-wild-five-orangutan-rafflesia-gibbon',
]

export default function FeaturedPackages() {
  const { packages, packageBySlug } = useData()
  // slug yang sudah dihapus dari database dilewati
  const picks = pickSlugs.map((s) => packageBySlug[s]).filter(Boolean)
  const { t } = useI18n()
  const track = useRef(null)
  const scroll = (dir) => {
    const el = track.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <section className="bg-paper py-20 sm:py-28">
      <div className="container-x">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Eyebrow>{t('featured.eyebrow')}</Eyebrow>
            <h2 className="mt-4 font-display text-[40px] leading-[1.02] sm:text-[56px]">
              {t('featured.title1')} <em className="font-[350] text-moss-600">{t('featured.title2')}</em>
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{t('featured.intro')}</p>
          </div>
          <div className="flex items-center gap-3">
            <ArrowLink to="/paket" className="mr-3">{t('featured.all', { n: packages.length })}</ArrowLink>
            <button type="button" onClick={() => scroll(-1)} className="grid size-11 place-items-center rounded-full border border-line-strong hover:border-ink" aria-label={t('featured.prev')}>
              <ArrowLeft className="size-4.5" strokeWidth={1.75} />
            </button>
            <button type="button" onClick={() => scroll(1)} className="grid size-11 place-items-center rounded-full border border-line-strong hover:border-ink" aria-label={t('featured.next')}>
              <ArrowRight className="size-4.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 sm:scroll-px-8 sm:px-8 lg:scroll-px-[max(3rem,calc((100vw-1320px)/2+3rem))] lg:px-[max(3rem,calc((100vw-1320px)/2+3rem))]"
      >
        {picks.map((p) => (
          <PackageCard key={p.slug} pkg={p} className="w-[300px] shrink-0 snap-start sm:w-[340px]" />
        ))}
      </div>
    </section>
  )
}
