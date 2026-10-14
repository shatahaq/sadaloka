import { supabase } from '../lib/supabase'

/**
 * Ambil seluruh data situs dari Supabase lalu ubah ke bentuk yang dipakai komponen
 * (camelCase, `group: [min, max]`, URL gambar, dst.). Datanya kecil, jadi dimuat sekali di awal.
 */

// Kolom `image` berisi nama file di src/assets/img (di-hash Vite) atau URL penuh (mis. Supabase Storage)
const localImages = Object.fromEntries(
  Object.entries(import.meta.glob('../assets/img/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' })).map(([path, url]) => [
    path.split('/').pop(),
    url,
  ]),
)
const imageUrl = (v) => (v == null ? undefined : /^https?:\/\//.test(v) ? v : localImages[v] ?? v)

const mapCorridor = (r) => ({
  slug: r.slug,
  numeral: r.numeral,
  name: r.name,
  zone: r.zone,
  theme: r.theme,
  tags: r.tags,
  summary: r.summary,
  long: r.long,
  activities: r.activities,
  priceFrom: r.price_from,
  image: imageUrl(r.image),
  imageSm: imageUrl(r.image_sm),
  imageAlt: r.image_alt,
  access: r.access,
  bestSeason: r.best_season,
  coords: r.coords,
  map: r.map,
})

const mapPackage = (r, corridorBySlug, guideById) => ({
  slug: r.slug,
  corridor: r.corridor,
  title: r.title,
  tagline: r.tagline,
  // foto paket dari operator; undefined = komponen memakai foto koridor
  image: imageUrl(r.image),
  about: r.about,
  days: r.days,
  durationLabel: r.duration_label,
  price: r.price,
  priceNote: r.price_note,
  difficulty: r.difficulty,
  group: [r.group_min, r.group_max],
  interests: r.interests,
  familyFriendly: r.family_friendly,
  highlights: r.highlights,
  itinerary: r.itinerary,
  includes: r.includes,
  excludes: r.excludes,
  notes: r.notes,
  preparation: r.preparation,
  // titik kumpul belum diisi operator → pakai nama koridor
  meetingPoint: r.meeting_point ?? corridorBySlug[r.corridor]?.name,
  breakdown: r.breakdown,
  slots: r.slots,
  operator: r.operator,
  tripType: r.trip_type,
  // pemandu tetap paket ini — wisatawan yang memesan lewat halaman paket tidak memilih pemandu
  guide: guideById[r.guide_id] ?? null,
})

const mapGuide = (r) => ({
  id: r.id,
  name: r.name,
  photo: imageUrl(r.photo),
  role: r.role,
  organization: r.organization,
  license: r.license,
  years: r.years,
  trips: r.trips,
  rating: r.rating == null ? null : Number(r.rating),
  reviewCount: r.review_count,
  corridors: r.corridors,
  focus: r.focus,
  languages: r.languages,
  specialties: r.specialties,
  certs: r.certs,
  suitableFor: r.suitable_for,
  bio: r.bio,
  quote: r.quote,
  available: r.available,
})

const TABLES = ['corridors', 'packages', 'guides', 'journey_steps', 'journey_phases', 'pillars', 'safety_checks', 'ethics_rules', 'faqs']

export async function fetchSiteData() {
  if (!supabase) throw new Error('missing-config')

  const results = await Promise.all(TABLES.map((t) => supabase.from(t).select('*').order('sort_order')))
  const failed = results.find((r) => r.error)
  if (failed) throw failed.error
  const [corridorRows, packageRows, guideRows, steps, phases, pillars, checks, ethics, faqs] = results.map((r) => r.data)

  const corridors = corridorRows.map(mapCorridor)
  const corridorBySlug = Object.fromEntries(corridors.map((c) => [c.slug, c]))
  const guides = guideRows.map(mapGuide)
  const guideById = Object.fromEntries(guides.map((g) => [g.id, g]))
  const packages = packageRows.map((r) => mapPackage(r, corridorBySlug, guideById))

  return {
    corridors,
    corridorBySlug,
    packages,
    packageBySlug: Object.fromEntries(packages.map((p) => [p.slug, p])),
    packagesByCorridor: (slug) => packages.filter((p) => p.corridor === slug),
    guides,
    guideById,
    allLanguages: [...new Set(guides.flatMap((g) => g.languages))],
    journeySteps: steps.map((s) => ({ n: s.n, phase: s.phase, verb: s.verb, text: s.text })),
    journeyPhases: phases.map((p) => ({ key: p.key, label: p.label, range: [p.range_start, p.range_end] })),
    pillars: pillars.map((p) => ({ key: p.key, title: p.title, text: p.text, tag: p.tag, href: p.href ?? undefined })),
    safetyChecks: checks.map((c) => [c.title, c.note]),
    ethicsRules: ethics.map((e) => ({ title: e.title, text: e.text })),
    faqs: faqs.map((f) => ({ q: f.question, a: f.answer })),
  }
}
