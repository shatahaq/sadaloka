import { useData } from '../data'
import { cn } from '../lib/format'
import { useI18n } from '../i18n'

/**
 * Peta skematik Kabupaten Langkat.
 * Bukan peta berskala — dibuat untuk orientasi: pesisir di timur laut,
 * TN Gunung Leuser di barat daya, Medan di tenggara.
 */
export default function CorridorMap({ active, onSelect, tone = 'dark', className = '', compact = false }) {
  const { corridors } = useData()
  const { t, tr } = useI18n()
  const dark = tone === 'dark'
  const stroke = dark ? 'rgb(243 238 228 / 0.16)' : 'rgb(22 26 20 / 0.14)'
  const label = dark ? 'rgb(243 238 228 / 0.55)' : 'rgb(22 26 20 / 0.5)'

  return (
    <div className={cn('relative', className)}>
      <svg viewBox="0 0 100 100" className="block h-auto w-full" role="img" aria-label={t('map.aria')}>
        <defs>
          <pattern id={`hatch-${tone}`} width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="1.6" stroke={dark ? 'rgb(166 182 153 / 0.22)' : 'rgb(61 90 54 / 0.18)'} strokeWidth="0.45" />
          </pattern>
          <radialGradient id={`glow-${tone}`}>
            <stop offset="0%" stopColor="#d8923a" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d8923a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid lintang/bujur */}
        {[20, 40, 60, 80].map((v) => (
          <g key={v}>
            <line x1={v} y1="0" x2={v} y2="100" stroke={stroke} strokeWidth="0.15" strokeDasharray="0.6 1.2" />
            <line x1="0" y1={v} x2="100" y2={v} stroke={stroke} strokeWidth="0.15" strokeDasharray="0.6 1.2" />
          </g>
        ))}

        {/* Selat Malaka */}
        <path
          d="M52 0 C 56 6, 60 9, 63 13 S 70 22, 74 26 S 84 33, 88 38 S 96 46, 100 48 L 100 0 Z"
          fill={dark ? 'rgb(111 152 148 / 0.22)' : 'rgb(111 152 148 / 0.2)'}
        />
        <path
          d="M52 0 C 56 6, 60 9, 63 13 S 70 22, 74 26 S 84 33, 88 38 S 96 46, 100 48"
          fill="none"
          stroke={dark ? 'rgb(157 187 183 / 0.6)' : 'rgb(111 152 148 / 0.7)'}
          strokeWidth="0.35"
        />
        {[4, 8].map((o) => (
          <path
            key={o}
            d={`M${52 + o} 0 C ${56 + o} ${6 - o / 3}, ${60 + o} ${9 - o / 3}, ${63 + o} ${13 - o / 2} S ${70 + o} ${22 - o}, ${74 + o} ${26 - o}`}
            fill="none"
            stroke={dark ? 'rgb(157 187 183 / 0.25)' : 'rgb(111 152 148 / 0.3)'}
            strokeWidth="0.2"
          />
        ))}
        <text x="84" y="12" fontSize="2.3" fill={label} fontFamily="var(--font-mono)" letterSpacing="0.3" textAnchor="middle">
          {t('map.strait')}
        </text>

        {/* TN Gunung Leuser */}
        <path
          d="M0 34 C 10 32, 20 38, 26 50 S 30 66, 38 74 S 46 86, 44 100 L 0 100 Z"
          fill={`url(#hatch-${tone})`}
        />
        <path
          d="M0 34 C 10 32, 20 38, 26 50 S 30 66, 38 74 S 46 86, 44 100"
          fill="none"
          stroke={dark ? 'rgb(166 182 153 / 0.5)' : 'rgb(61 90 54 / 0.45)'}
          strokeWidth="0.3"
          strokeDasharray="1 0.8"
        />
        <text x="8" y="70" fontSize="2.3" fill={label} fontFamily="var(--font-mono)" letterSpacing="0.3" transform="rotate(-62 8 70)">
          {t('map.park')}
        </text>

        {/* Sungai: Wampu, Bohorok, Batang Serangan */}
        <path d="M24 46 C 34 46, 40 40, 48 38 S 60 34, 66 22" fill="none" stroke={dark ? 'rgb(157 187 183 / 0.55)' : 'rgb(111 152 148 / 0.6)'} strokeWidth="0.45" />
        <path d="M34 66 C 40 60, 44 52, 48 46 S 52 40, 48 38" fill="none" stroke={dark ? 'rgb(157 187 183 / 0.45)' : 'rgb(111 152 148 / 0.5)'} strokeWidth="0.35" />
        <path d="M52 80 C 58 70, 62 60, 70 52 S 82 40, 86 36" fill="none" stroke={dark ? 'rgb(157 187 183 / 0.35)' : 'rgb(111 152 148 / 0.45)'} strokeWidth="0.3" />

        {/* Medan sebagai titik referensi */}
        <g>
          <path d="M92 94 C 80 90, 68 84, 56 80" fill="none" stroke={label} strokeWidth="0.25" strokeDasharray="0.8 0.8" />
          <rect x="90.6" y="92.6" width="2.8" height="2.8" fill="none" stroke={label} strokeWidth="0.35" />
          <text x="89" y="99" fontSize="2.2" fill={label} fontFamily="var(--font-mono)" textAnchor="end">MEDAN</text>
        </g>

        {/* Kompas */}
        <g transform="translate(8 8)" fill={label}>
          <path d="M0 -4 L 1.2 0 L 0 -0.8 L -1.2 0 Z" />
          <text x="0" y="3.6" fontSize="2.2" fontFamily="var(--font-mono)" textAnchor="middle">{t('map.north')}</text>
        </g>

        {/* Pin koridor */}
        {corridors.map((c) => {
          const isActive = c.slug === active
          return (
            <g
              key={c.slug}
              transform={`translate(${c.map.x} ${c.map.y})`}
              className="cursor-pointer"
              onClick={() => onSelect?.(c.slug)}
              role="button"
              tabIndex={onSelect ? 0 : -1}
              aria-label={`${t('common.corridor')} ${c.numeral} — ${tr(c.name)}`}
              onKeyDown={(e) => e.key === 'Enter' && onSelect?.(c.slug)}
            >
              {isActive && <circle r="9" fill={`url(#glow-${tone})`} />}
              <circle
                r={isActive ? 3.4 : 2.6}
                fill={isActive ? '#d8923a' : dark ? '#172016' : '#fbf9f4'}
                stroke={isActive ? '#d8923a' : dark ? 'rgb(243 238 228 / 0.7)' : 'rgb(22 26 20 / 0.6)'}
                strokeWidth="0.35"
                style={{ transition: 'r 300ms cubic-bezier(.16,1,.3,1)' }}
              />
              <text
                y="0.85"
                fontSize={isActive ? 2.6 : 2.1}
                textAnchor="middle"
                fontFamily="var(--font-display)"
                fontWeight="500"
                fill={isActive ? '#172016' : dark ? '#f3eee4' : '#161a14'}
                style={{ pointerEvents: 'none' }}
              >
                {c.numeral}
              </text>
              {(!compact || isActive) && (
                <text
                  x={c.map.x > 70 ? -5 : 5}
                  y="0.8"
                  fontSize="2.4"
                  textAnchor={c.map.x > 70 ? 'end' : 'start'}
                  fontFamily="var(--font-sans)"
                  fontWeight={isActive ? 600 : 400}
                  fill={dark ? (isActive ? '#f3eee4' : 'rgb(243 238 228 / 0.6)') : isActive ? '#161a14' : 'rgb(22 26 20 / 0.55)'}
                  style={{ pointerEvents: 'none' }}
                >
                  {tr(c.name)}
                </text>
              )}
            </g>
          )
        })}
      </svg>
      <p className={cn('mt-2 font-mono text-[10px] tracking-[0.12em]', dark ? 'text-paper/40' : 'text-muted')}>
        {t('map.caption')}
      </p>
    </div>
  )
}
