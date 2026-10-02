import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { cn } from '../lib/format'

export default function Accordion({ items, defaultOpen = 0, tone = 'dark' }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const light = tone === 'light'
  return (
    <div className={cn('border-t', light ? 'border-line-dark' : 'border-line')}>
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q} className={cn('border-b', light ? 'border-line-dark' : 'border-line')}>
            <h3>
              <button
                type="button"
                id={`${id}-h-${i}`}
                aria-controls={`${id}-p-${i}`}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span className="text-[16px] font-medium leading-snug sm:text-[17px]">{it.q}</span>
                <Plus
                  className={cn('mt-0.5 size-5 shrink-0 transition-transform duration-300', isOpen && 'rotate-45')}
                  strokeWidth={1.5}
                />
              </button>
            </h3>
            <div
              id={`${id}-p-${i}`}
              role="region"
              aria-labelledby={`${id}-h-${i}`}
              className="grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-expo)]"
              style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className={cn('max-w-2xl pb-6 text-[15px] leading-relaxed', light ? 'text-paper/70' : 'text-ink-soft')}>{it.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
