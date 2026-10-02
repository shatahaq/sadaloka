import { Button } from '../components/ui'
import { useI18n } from '../i18n'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <section className="paper-grain grid min-h-[80vh] place-items-center pt-[72px]">
      <div className="container-x text-center">
        <p className="font-mono text-[12px] tracking-[0.16em] text-muted">{t('notFound.code')}</p>
        <h1 className="mt-4 font-display text-6xl sm:text-7xl">
          {t('notFound.title1')} <em className="text-moss-600">{t('notFound.title2')}</em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-soft">{t('notFound.text')}</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/" variant="dark">{t('notFound.home')}</Button>
          <Button to="/paket" variant="outline">{t('notFound.packages')}</Button>
        </div>
      </div>
    </section>
  )
}
