/**
 * Pilihan "pengalaman" di Smart Match. Setiap pilihan memetakan ke satu
 * atau lebih kunci minat paket — pengguna memilih bahasa manusia, bukan kategori teknis.
 * `corridor` = koridor yang fotonya dipakai sebagai gambar pilihan (lihat experienceImage).
 */
export const experienceOptions = [
  { key: 'wildlife', interests: ['primata'], corridor: 'bukit-lawang' },
  { key: 'elephants', interests: ['gajah'], corridor: 'tangkahan' },
  { key: 'water', interests: ['sungai'], corridor: 'pelaruga-teroh-teroh' },
  { key: 'forest', interests: ['flora', 'goa'], corridor: 'batu-katak' },
  { key: 'coast', interests: ['burung'], corridor: 'mangrove-pesisir' },
  { key: 'culture', interests: ['budaya', 'kuliner'] },
  { key: 'thrill', interests: ['petualangan'] },
]
const expByKey = Object.fromEntries(experienceOptions.map((o) => [o.key, o]))

export const experienceImage = (option, corridorBySlug) => {
  const c = corridorBySlug[option.corridor]
  return c ? c.imageSm ?? c.image : undefined
}

export const budgetOptions = {
  low: 300000,
  mid: 1000000,
  high: Infinity,
  any: Infinity,
}

/**
 * Skor kecocokan (0–100) dari jawaban kuis.
 * Jawaban yang dilewati (null / kosong) dianggap netral.
 * `reasons` = alasan dalam bahasa manusia (kunci i18n + variabel).
 */
export function scorePackage(pkg, a) {
  const reasons = []
  let score = 0

  // Pengalaman yang diinginkan — bobot terbesar
  if (!a.experiences.length) {
    score += 28
  } else {
    const hits = a.experiences.filter((k) => expByKey[k].interests.some((i) => pkg.interests.includes(i)))
    score += Math.round((hits.length / a.experiences.length) * 40)
    if (hits.length) reasons.push({ key: 'rInterests', items: hits })
  }

  // Durasi
  if (a.days == null) score += 12
  else {
    const diff = Math.abs(Math.min(pkg.days, 3) - a.days)
    score += diff === 0 ? 20 : diff === 1 ? 8 : 0
    if (diff === 0) reasons.push({ key: 'rDuration', days: pkg.days })
  }

  // Bersama siapa
  if (a.group === 'family') {
    if (pkg.familyFriendly) {
      score += 5
      reasons.push({ key: 'rFamily' })
    } else score -= 15
  } else score += 5

  // Tingkat aktivitas
  const lvl = { ringan: 1, sedang: 2, menantang: 3 }[pkg.difficulty]
  if (a.fitness == null) score += 7
  else if (lvl <= a.fitness) {
    score += 10
    if (lvl === a.fitness) reasons.push({ key: 'rFitness', difficulty: pkg.difficulty })
  } else if (lvl - a.fitness === 1) score += 2
  else score -= 5

  // Anggaran
  const max = budgetOptions[a.budget ?? 'any']
  if (pkg.price <= max) {
    score += 25
    if (a.budget === 'low' || a.budget === 'mid') reasons.push({ key: 'rBudget' })
  } else {
    const over = (pkg.price - max) / max
    score += Math.max(0, Math.round(25 * (1 - over * 2)))
  }

  return { pkg, score: Math.max(0, Math.min(100, score)), reasons }
}

export function matchPackages(packages, answers, limit = 3) {
  return packages
    .map((p) => scorePackage(p, answers))
    .sort((x, y) => y.score - x.score || x.pkg.price - y.pkg.price)
    .slice(0, limit)
}

/** Label pembeda alternatif dibanding pilihan teratas */
export function altLabel(alt, top) {
  if (alt.price < top.price * 0.8) return 'altCheaper'
  if (alt.days < top.days) return 'altShorter'
  if (alt.days > top.days) return 'altLonger'
  return 'altOther'
}
