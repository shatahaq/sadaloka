import bukitLawang from '../assets/img/bukit-lawang.webp'
import tangkahan from '../assets/img/tangkahan.webp'
import batuKatak from '../assets/img/batu-katak.webp'
import batuKatakSm from '../assets/img/batu-katak-sm.webp'
import terohTeroh from '../assets/img/teroh-teroh.webp'
import mangrove from '../assets/img/mangrove-langkat.webp'

/**
 * Lima koridor ekowisata Sadaloka.
 * Teks yang diterjemahkan ditulis sebagai { id, en } dan dibaca lewat tr().
 * `map` = posisi skematik (0–100) pada peta Langkat, bukan koordinat presisi.
 */
export const corridors = [
  {
    slug: 'bukit-lawang',
    numeral: 'I',
    name: 'Bukit Lawang',
    zone: 'Bukit Lawang',
    theme: { id: 'Kanopi Hutan & Primata', en: 'Forest Canopy & Primates' },
    tags: [{ id: 'Taman Nasional Gunung Leuser', en: 'Gunung Leuser National Park' }, 'Orangutan Sanctuary'],
    summary: {
      id: 'Pusat pengamatan orangutan Sumatra (Pongo abelii) liar di habitat aslinya, ruang edukasi dan tradisi di sepanjang Sungai Bohorok, serta konservasi berbasis desa.',
      en: 'The place to observe wild Sumatran orangutans (Pongo abelii) in their natural habitat, with education and local tradition along the Bohorok River and village-based conservation.',
    },
    long: {
      id: 'Bukit Lawang adalah gerbang paling dikenal menuju Taman Nasional Gunung Leuser. Di sini kanopi hutan hujan tropis bertemu aliran Sungai Bohorok yang jernih. Bersama pemandu HPI, Anda menyusuri jalur trekking yang dikelola dengan kuota harian, mengamati orangutan liar dari jarak aman, lalu kembali ke desa untuk tinggal di homestay masyarakat.',
      en: 'Bukit Lawang is the best-known gateway to Gunung Leuser National Park, where the rainforest canopy meets the clear Bohorok River. With an HPI guide you follow trekking routes managed under daily quotas, watch wild orangutans from a safe distance, then return to the village to stay with a local homestay family.',
    },
    activities: [
      { id: 'Jungle Trekking Kanopi', en: 'Canopy Jungle Trekking' },
      { id: 'Pengamatan Pongo abelii Liar', en: 'Wild Pongo abelii Watching' },
      { id: 'Arung Jeram Bohorok', en: 'Bohorok River Rafting' },
    ],
    priceFrom: 350000,
    image: bukitLawang,
    imageAlt: {
      id: 'Orangutan Sumatra bergelantungan di dahan pohon kanopi hutan Leuser',
      en: 'A Sumatran orangutan hanging from a branch in the Leuser forest canopy',
    },
    access: { from: 'Medan', km: 86, hours: 3 },
    bestSeason: { id: 'Feb — Sep', en: 'Feb — Sep' },
    coords: { lat: '3°33′', lon: '98°07′' },
    map: { x: 34, y: 63 },
  },
  {
    slug: 'tangkahan',
    numeral: 'II',
    name: 'Tangkahan',
    zone: 'Batang Serangan',
    theme: { id: 'Sungai & Gajah', en: 'Rivers & Elephants' },
    tags: ['The Hidden Paradise', 'Conservation Response Unit'],
    summary: {
      id: 'Ketenangan di pertemuan Sungai Buluh dan Batang Serangan. Dampingi pemulihan gajah bersama para mahout pelindung gajah di tepian hutan alami.',
      en: 'Quiet waters where the Buluh and Batang Serangan rivers meet. Join the elephants’ recovery alongside the mahouts who protect them on the edge of natural forest.',
    },
    long: {
      id: 'Tangkahan dulu dikenal sebagai jalur pembalakan, kini menjadi contoh bagaimana desa memilih konservasi. Gajah-gajah CRU berpatroli menjaga batas hutan bersama mahout. Pengunjung bisa ikut kegiatan pagi, berendam di mata air panas di tepi sungai, dan menyusuri air terjun tersembunyi.',
      en: 'Tangkahan was once a logging route; today it shows how a village chose conservation. CRU elephants patrol the forest boundary with their mahouts. Visitors can join the morning routine, soak in riverside hot springs and walk to hidden waterfalls.',
    },
    activities: [
      { id: 'Elephant Walk & Patroli', en: 'Elephant Walk & Patrol' },
      { id: 'Air Terjun & Mata Air Panas', en: 'Waterfalls & Hot Springs' },
      { id: 'Sungai Jernih', en: 'Crystal-clear River' },
    ],
    priceFrom: 450000,
    image: tangkahan,
    imageAlt: {
      id: 'Tiga gajah Sumatra berendam di sungai berwarna hijau toska di Tangkahan',
      en: 'Three Sumatran elephants bathing in a turquoise river in Tangkahan',
    },
    access: { from: 'Medan', km: 120, hours: 4 },
    bestSeason: { id: 'Mar — Okt', en: 'Mar — Oct' },
    coords: { lat: '3°41′', lon: '98°04′' },
    map: { x: 27, y: 44 },
  },
  {
    slug: 'batu-katak',
    numeral: 'III',
    name: 'Batu Katak',
    zone: 'Bukit Kapur Leuser',
    theme: { id: 'Karst, Goa & Rafflesia', en: 'Karst, Caves & Rafflesia' },
    tags: [{ id: 'Lembah Karst Leuser', en: 'Leuser Karst Valley' }, { id: 'Flora Langka', en: 'Rare Flora' }],
    summary: {
      id: 'Habitat terlindung Rafflesia arnoldii dan Amorphophallus titanum. Susuri Goa Batu Kapal yang bersejarah dan aliran Sungai Bekail yang jernih.',
      en: 'Protected habitat of Rafflesia arnoldii and Amorphophallus titanum. Explore the historic Batu Kapal Cave and the clear Bekail River.',
    },
    long: {
      id: 'Lembah karst Batu Katak menyimpan goa, sungai berbatu kapur, dan titik-titik mekar bunga langka yang dipantau warga. Jadwal kunjungan disesuaikan dengan laporan mekar dari kelompok pemantau desa, sehingga Anda datang di waktu yang tepat tanpa mengganggu habitat.',
      en: 'The Batu Katak karst valley hides caves, limestone rivers and blooming sites of rare flowers monitored by villagers. Visits are scheduled around bloom reports from the village monitoring group, so you arrive at the right moment without disturbing the habitat.',
    },
    activities: [
      'Rafflesia Bloom Watch',
      { id: 'Caving Goa Batu Kapal', en: 'Batu Kapal Caving' },
      { id: 'Herpetofauna Rimba', en: 'Jungle Herpetofauna' },
    ],
    priceFrom: 280000,
    image: batuKatak,
    imageSm: batuKatakSm,
    imageAlt: {
      id: 'Pemandangan udara sungai jernih membelah lembah hutan tropis di Batu Katak',
      en: 'Aerial view of a clear river cutting through a tropical forest valley at Batu Katak',
    },
    access: { from: 'Medan', km: 95, hours: 3.5 },
    bestSeason: { id: 'Sepanjang tahun', en: 'Year-round' },
    coords: { lat: '3°30′', lon: '98°09′' },
    map: { x: 40, y: 72 },
  },
  {
    slug: 'pelaruga-teroh-teroh',
    numeral: 'IV',
    name: 'Pelaruga & Teroh-Teroh',
    zone: 'Sebangai',
    theme: { id: 'Kolam Abadi & Rafting', en: 'Natural Pools & Rafting' },
    tags: [{ id: 'Sungai Bahorok', en: 'Bahorok River' }, { id: 'Kolam Kaca Alami', en: 'Glass-clear Natural Pool' }],
    summary: {
      id: 'Sensasi berenang di Kolam Abadi berair sebening kaca di aliran Air Terjun Teroh-Teroh, bersama pemuda konservasi lokal.',
      en: 'Swim in Kolam Abadi, a glass-clear natural pool fed by the Teroh-Teroh Waterfall, alongside local youth conservationists.',
    },
    long: {
      id: 'Koridor ini dikelola oleh kelompok pemuda desa yang menjaga kebersihan aliran dan jalur menuju air terjun. Cocok untuk perjalanan singkat: berenang di kolam alami, body rafting di jeram ringan, lalu makan siang masakan rumahan di tepi sungai.',
      en: 'This corridor is run by a village youth group that keeps the stream and the waterfall trail clean. Ideal for a short trip: swim in natural pools, body-raft gentle rapids, then enjoy a home-cooked lunch by the river.',
    },
    activities: [
      { id: 'Kolam Abadi Jernih', en: 'Crystal-clear Kolam Abadi' },
      { id: 'Body Rafting Jeram', en: 'Rapids Body Rafting' },
      { id: 'Air Terjun Teroh-Teroh', en: 'Teroh-Teroh Waterfall' },
    ],
    priceFrom: 220000,
    image: terohTeroh,
    imageAlt: {
      id: 'Air terjun Teroh-Teroh jatuh di antara tebing berlumut ke kolam biru jernih',
      en: 'Teroh-Teroh waterfall falling between mossy cliffs into a clear blue pool',
    },
    access: { from: 'Medan', km: 70, hours: 2.5 },
    bestSeason: { id: 'Apr — Sep', en: 'Apr — Sep' },
    coords: { lat: '3°27′', lon: '98°14′' },
    map: { x: 52, y: 78 },
  },
  {
    slug: 'mangrove-pesisir',
    numeral: 'V',
    name: { id: 'Mangrove Pesisir Langkat', en: 'Langkat Coastal Mangroves' },
    zone: 'Lubuk Kertang & Pangkalan Susu',
    theme: { id: 'Restorasi Pantai & Edukasi', en: 'Coastal Restoration & Learning' },
    tags: [
      { id: 'Pesisir Langkat Timur', en: 'East Langkat Coast' },
      { id: 'Restorasi Rawa Bakau Adat', en: 'Customary Mangrove Restoration' },
    ],
    summary: {
      id: 'Susur muara dengan perahu dayung tradisional, amati kawasan bakau liar dan burung air migran, lalu tanam bibit bakau bersama masyarakat pesisir.',
      en: 'Paddle the estuary in a traditional rowing boat, observe wild mangroves and migratory waterbirds, then plant mangrove seedlings with the coastal community.',
    },
    long: {
      id: 'Di pesisir timur Langkat, kelompok nelayan memulihkan rawa bakau yang sempat rusak. Perjalanan di sini adalah perjalanan belajar: dari cara bakau menahan abrasi, jalur burung migran, hingga kuliner hasil tangkapan nelayan tradisional.',
      en: 'On Langkat’s east coast, fishing groups are restoring mangrove swamps that were once degraded. A trip here is a learning journey: how mangroves hold back erosion, the routes of migratory birds, and dishes made from the traditional fishermen’s catch.',
    },
    activities: [
      { id: 'Susur Perahu Mangrove', en: 'Mangrove Boat Tour' },
      { id: 'Birdwatching Burung Migran', en: 'Migratory Birdwatching' },
      { id: 'Adopsi Bibit Bakau', en: 'Adopt a Mangrove Seedling' },
      { id: 'Kuliner Pesisir', en: 'Coastal Cuisine' },
    ],
    priceFrom: 190000,
    image: mangrove,
    imageAlt: {
      id: 'Jembatan kayu dan pondok beratap ijuk di tengah hutan bakau muda Langkat',
      en: 'Wooden boardwalk and thatched huts among young mangroves in Langkat',
    },
    access: { from: 'Medan', km: 110, hours: 3 },
    bestSeason: { id: 'Mei — Sep', en: 'May — Sep' },
    coords: { lat: '4°04′', lon: '98°18′' },
    map: { x: 78, y: 22 },
  },
]

export const corridorBySlug = Object.fromEntries(corridors.map((c) => [c.slug, c]))
