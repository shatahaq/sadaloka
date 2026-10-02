/**
 * Katalog paket trip (data contoh untuk tahap frontend).
 * Harga "mulai" tiap koridor mengikuti dokumen konten; paket lain adalah
 * turunan realistis yang nanti diganti data dari backend.
 * Teks bilingual ditulis sebagai { id, en }; label minat/kesulitan/biaya ada di kamus i18n.
 */

export const interestKeys = ['primata', 'gajah', 'flora', 'sungai', 'goa', 'burung', 'budaya', 'kuliner', 'petualangan']

export const difficultyLevels = { ringan: 1, sedang: 2, menantang: 3 }

export const breakdownColors = {
  guide: 'var(--color-moss-600)',
  stay: 'var(--color-sun-500)',
  logistics: 'var(--color-river-500)',
  conservation: 'var(--color-clay-500)',
  platform: 'var(--color-ink-soft)',
}

const split = (guide, stay, logistics, conservation, platform) => ({ guide, stay, logistics, conservation, platform })
const L = (id, en) => ({ id, en })

export const packages = [
  // ── Koridor I — Bukit Lawang ───────────────────────────────
  {
    slug: 'bukit-lawang-jungle-trek-harian',
    corridor: 'bukit-lawang',
    title: L('Jungle Trek Kanopi Bohorok', 'Bohorok Canopy Jungle Trek'),
    tagline: L(
      'Setengah hari menyusuri jalur kanopi dan mengamati orangutan liar dari jarak aman.',
      'A half-day walk along canopy trails, watching wild orangutans from a safe distance.',
    ),
    days: 1,
    price: 350000,
    difficulty: 'sedang',
    group: [2, 8],
    interests: ['primata', 'flora', 'sungai'],
    familyFriendly: true,
    highlights: [
      L('Kuota harian jalur untuk menjaga habitat', 'Daily trail quotas to protect the habitat'),
      L('Maks. 8 orang per pemandu', 'Max. 8 guests per guide'),
      L('Makan siang buah tropis di tengah hutan', 'Tropical fruit lunch in the forest'),
    ],
    itinerary: [
      {
        title: L('Kanopi Bohorok', 'Bohorok canopy'),
        items: [
          ['07.30', L('Briefing etika rimba di pos HPI Bukit Lawang', 'Jungle ethics briefing at the HPI post, Bukit Lawang')],
          ['08.00', L('Trekking jalur kanopi bersama pemandu dan asisten', 'Canopy trail trek with guide and assistant')],
          ['11.00', L('Pengamatan orangutan dan siamang (jarak minimum 10 m)', 'Orangutan and siamang watching (min. 10 m distance)')],
          ['12.30', L('Istirahat makan siang di tepi Sungai Bohorok', 'Lunch break on the Bohorok riverbank')],
          ['14.00', L('Kembali ke desa', 'Return to the village')],
        ],
      },
    ],
    includes: [
      L('Pemandu HPI + asisten', 'HPI guide + assistant'),
      L('Tiket masuk TNGL', 'Leuser National Park entry'),
      L('Makan siang & air minum', 'Lunch & drinking water'),
      L('Asuransi perjalanan harian', 'Daily travel insurance'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan'), L('Penginapan', 'Accommodation'), L('Tip pemandu (opsional)', 'Guide tip (optional)')],
    meetingPoint: L('Pos HPI Bukit Lawang', 'HPI Post, Bukit Lawang'),
    breakdown: split(42, 12, 22, 14, 10),
    slots: 5,
  },
  {
    slug: 'bukit-lawang-jungle-camp-2h1m',
    corridor: 'bukit-lawang',
    title: L('Jungle Camp Leuser', 'Leuser Jungle Camp'),
    tagline: L(
      'Bermalam di tepi sungai di dalam hutan, lalu pulang dengan tubing menyusuri Bohorok.',
      'Spend a night by a river deep in the forest, then tube back down the Bohorok.',
    ),
    days: 2,
    price: 1250000,
    difficulty: 'menantang',
    group: [2, 6],
    interests: ['primata', 'sungai', 'petualangan', 'flora'],
    familyFriendly: false,
    highlights: [
      L('Kemah di tepian sungai dengan masakan pemandu', 'Riverside camp with meals cooked by your guide'),
      L('Peluang tinggi melihat orangutan & thomas leaf monkey', 'Good chances of orangutans & Thomas leaf monkeys'),
      L('Tubing pulang ke desa', 'Tubing back to the village'),
    ],
    itinerary: [
      {
        title: L('Masuk rimba', 'Into the jungle'),
        items: [
          ['08.00', L('Briefing etika & pengecekan perlengkapan', 'Ethics briefing & gear check')],
          ['08.30', L('Trekking 5–6 jam melintasi punggungan bukit', '5–6 hour trek across the ridges')],
          ['15.00', L('Tiba di camp tepi sungai, berenang', 'Arrive at riverside camp, swim')],
          ['19.00', L('Makan malam & cerita hutan bersama pemandu', 'Dinner & forest stories with your guide')],
        ],
      },
      {
        title: L('Sungai pulang', 'River home'),
        items: [
          ['07.00', L('Sarapan, pengamatan satwa pagi', 'Breakfast, morning wildlife watching')],
          ['09.00', L('Tubing menyusuri Sungai Bohorok', 'Tubing down the Bohorok River')],
          ['11.00', L('Tiba di desa, makan siang di homestay', 'Back in the village, lunch at a homestay')],
        ],
      },
    ],
    includes: [
      L('Pemandu HPI + porter', 'HPI guide + porter'),
      L('Tenda, matras, alat masak', 'Tent, mat, cooking gear'),
      L('Makan 4x & air minum', '4 meals & drinking water'),
      L('Tiket TNGL', 'National park entry'),
      L('Tubing & pelampung', 'Tubing & life jacket'),
    ],
    excludes: [
      L('Transport dari Medan', 'Transport from Medan'),
      L('Kantong tidur pribadi (bisa sewa)', 'Personal sleeping bag (rentable)'),
      L('Tip', 'Tips'),
    ],
    meetingPoint: L('Pos HPI Bukit Lawang', 'HPI Post, Bukit Lawang'),
    breakdown: split(40, 14, 24, 12, 10),
    slots: 3,
  },
  {
    slug: 'bukit-lawang-trek-rafting-3h2m',
    corridor: 'bukit-lawang',
    title: L('Leuser Lengkap: Trek, Kemah & Arung Jeram', 'Complete Leuser: Trek, Camp & Rafting'),
    tagline: L(
      'Paket paling lengkap: dua malam di rimba dan homestay, ditutup arung jeram Bohorok.',
      'Our most complete trip: two nights in the jungle and a homestay, finished with Bohorok rafting.',
    ),
    days: 3,
    price: 2450000,
    difficulty: 'menantang',
    group: [2, 6],
    interests: ['primata', 'sungai', 'petualangan', 'budaya'],
    familyFriendly: false,
    highlights: [
      L('Satu malam kemah, satu malam homestay', 'One night camping, one night in a homestay'),
      L('Arung jeram jeram kelas II–III', 'Class II–III rapids'),
      L('Kelas memasak rendang bersama induk semang', 'Rendang cooking class with your host'),
    ],
    itinerary: [
      {
        title: L('Masuk rimba', 'Into the jungle'),
        items: [
          ['08.00', L('Briefing & trekking ke camp', 'Briefing & trek to camp')],
          ['15.00', L('Tiba di camp, berenang', 'Arrive at camp, swim')],
          ['19.00', L('Makan malam di camp', 'Dinner at camp')],
        ],
      },
      {
        title: L('Kanopi & desa', 'Canopy & village'),
        items: [
          ['07.00', L('Trekking pagi, pengamatan primata', 'Morning trek, primate watching')],
          ['12.00', L('Tubing pulang ke desa', 'Tubing back to the village')],
          ['16.00', L('Kelas memasak di homestay', 'Cooking class at the homestay')],
        ],
      },
      {
        title: L('Arung jeram', 'Rafting'),
        items: [
          ['08.00', L('Briefing keselamatan arung jeram', 'Rafting safety briefing')],
          ['09.00', L('Arung jeram 2 jam', '2-hour rafting run')],
          ['12.00', L('Makan siang & selesai', 'Lunch & finish')],
        ],
      },
    ],
    includes: [
      L('Pemandu HPI & tim rescue sungai', 'HPI guide & river rescue team'),
      L('Perlengkapan kemah & rafting', 'Camping & rafting gear'),
      L('Homestay 1 malam', '1 night homestay'),
      L('Makan 7x', '7 meals'),
      L('Tiket TNGL & asuransi', 'Park entry & insurance'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan'), L('Tip', 'Tips')],
    meetingPoint: L('Pos HPI Bukit Lawang', 'HPI Post, Bukit Lawang'),
    breakdown: split(38, 18, 24, 12, 8),
    slots: 4,
  },

  // ── Koridor II — Tangkahan ─────────────────────────────────
  {
    slug: 'tangkahan-elephant-patrol',
    corridor: 'tangkahan',
    title: L('Pagi Bersama Mahout CRU', 'A Morning with the CRU Mahouts'),
    tagline: L(
      'Ikut rutinitas pagi gajah CRU: memandikan, memeriksa kesehatan, dan berjalan di batas hutan.',
      'Join the CRU elephants’ morning routine: bathing, health checks and a walk along the forest edge.',
    ),
    days: 1,
    price: 450000,
    difficulty: 'ringan',
    group: [2, 10],
    interests: ['gajah', 'sungai', 'budaya'],
    familyFriendly: true,
    highlights: [
      L('Tanpa tunggangan gajah — hanya berjalan berdampingan', 'No elephant riding — walking alongside only'),
      L('Penjelasan langsung dari mahout', 'Explained first-hand by the mahouts'),
      L('Berendam di mata air panas tepi sungai', 'Soak in riverside hot springs'),
    ],
    itinerary: [
      {
        title: L('Rutinitas pagi', 'Morning routine'),
        items: [
          ['07.30', L('Briefing etika interaksi gajah', 'Elephant interaction ethics briefing')],
          ['08.00', L('Membantu memandikan gajah di Sungai Batang Serangan', 'Help bathe the elephants in the Batang Serangan River')],
          ['09.30', L('Elephant walk di jalur patroli', 'Elephant walk along the patrol route')],
          ['11.30', L('Mata air panas & makan siang', 'Hot springs & lunch')],
        ],
      },
    ],
    includes: [
      L('Pemandu lokal & mahout CRU', 'Local guide & CRU mahouts'),
      L('Kontribusi pakan gajah', 'Elephant feed contribution'),
      L('Makan siang', 'Lunch'),
      L('Asuransi', 'Insurance'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan'), L('Penginapan', 'Accommodation')],
    meetingPoint: L('Visitor Center Tangkahan', 'Tangkahan Visitor Center'),
    breakdown: split(34, 10, 18, 28, 10),
    slots: 6,
  },
  {
    slug: 'tangkahan-hidden-paradise-2h1m',
    corridor: 'tangkahan',
    title: L('The Hidden Paradise 2H1M', 'The Hidden Paradise 2D1N'),
    tagline: L(
      'Dua hari pelan di Tangkahan: gajah, air terjun tersembunyi, dan malam di homestay tepi sungai.',
      'Two slow days in Tangkahan: elephants, hidden waterfalls and a night at a riverside homestay.',
    ),
    days: 2,
    price: 1150000,
    difficulty: 'sedang',
    group: [2, 8],
    interests: ['gajah', 'sungai', 'budaya', 'kuliner'],
    familyFriendly: true,
    highlights: [
      L('Air terjun & goa kelelawar', 'Waterfall & bat cave'),
      L('Tubing sungai jernih', 'Clear-river tubing'),
      L('Homestay keluarga mahout', 'Homestay with a mahout family'),
    ],
    itinerary: [
      {
        title: L('Sungai & air terjun', 'River & waterfall'),
        items: [
          ['10.00', L('Tiba & makan siang', 'Arrival & lunch')],
          ['13.00', L('Trekking ringan ke air terjun', 'Easy trek to the waterfall')],
          ['16.00', L('Tubing ke mata air panas', 'Tubing to the hot springs')],
        ],
      },
      {
        title: L('Pagi gajah', 'Elephant morning'),
        items: [
          ['07.30', L('Memandikan gajah bersama mahout', 'Bathe the elephants with the mahouts')],
          ['10.00', L('Elephant walk', 'Elephant walk')],
          ['12.00', L('Makan siang & selesai', 'Lunch & finish')],
        ],
      },
    ],
    includes: [
      L('Pemandu lokal & mahout', 'Local guide & mahouts'),
      L('Homestay 1 malam', '1 night homestay'),
      L('Makan 4x', '4 meals'),
      L('Tubing', 'Tubing'),
      L('Kontribusi CRU', 'CRU contribution'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan'), L('Tip', 'Tips')],
    meetingPoint: L('Visitor Center Tangkahan', 'Tangkahan Visitor Center'),
    breakdown: split(32, 20, 16, 22, 10),
    slots: 2,
  },

  // ── Koridor III — Batu Katak ───────────────────────────────
  {
    slug: 'batu-katak-rafflesia-watch',
    corridor: 'batu-katak',
    title: L('Rafflesia Bloom Watch', 'Rafflesia Bloom Watch'),
    tagline: L(
      'Dijadwalkan berdasarkan laporan mekar kelompok pemantau desa — datang di waktu yang tepat.',
      'Scheduled around bloom reports from the village monitoring group — arrive at the right time.',
    ),
    days: 1,
    price: 280000,
    difficulty: 'sedang',
    group: [2, 8],
    interests: ['flora', 'goa', 'budaya'],
    familyFriendly: true,
    highlights: [
      L('Notifikasi status mekar sebelum berangkat', 'Bloom status update before you travel'),
      L('Jalur karst & sungai Bekail', 'Karst trail & Bekail River'),
      L('Fotografi dengan aturan jarak', 'Photography with distance rules'),
    ],
    itinerary: [
      {
        title: L('Lembah karst', 'Karst valley'),
        items: [
          ['08.00', L('Briefing di rumah kelompok pemantau', 'Briefing at the monitoring group’s house')],
          ['08.30', L('Trekking lembah karst ± 2 jam', 'Karst valley trek, ± 2 hours')],
          ['10.30', L('Pengamatan Rafflesia / Amorphophallus (bila mekar)', 'Rafflesia / Amorphophallus viewing (if in bloom)')],
          ['12.30', L('Makan siang di tepi Sungai Bekail', 'Lunch on the Bekail riverbank')],
        ],
      },
    ],
    includes: [
      L('Pemandu HPI & pemantau desa', 'HPI guide & village monitor'),
      L('Makan siang', 'Lunch'),
      L('Retribusi desa', 'Village fee'),
      L('Asuransi', 'Insurance'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan'), L('Penginapan', 'Accommodation')],
    meetingPoint: L('Desa Batu Jongjong, Bahorok', 'Batu Jongjong Village, Bahorok'),
    breakdown: split(38, 12, 18, 22, 10),
    slots: 7,
  },
  {
    slug: 'batu-katak-caving-2h1m',
    corridor: 'batu-katak',
    title: L('Goa Batu Kapal & Herpetofauna Malam', 'Batu Kapal Cave & Night Herpetofauna'),
    tagline: L(
      'Caving di goa bersejarah, lalu night walk mencari katak dan reptil rimba bersama pemandu.',
      'Explore a historic cave, then join a night walk to find jungle frogs and reptiles with your guide.',
    ),
    days: 2,
    price: 950000,
    difficulty: 'sedang',
    group: [2, 6],
    interests: ['goa', 'flora', 'petualangan'],
    familyFriendly: false,
    highlights: [
      L('Caving dengan helm & headlamp', 'Caving with helmet & headlamp'),
      L('Night walk herpetofauna', 'Herpetofauna night walk'),
      L('Homestay di desa karst', 'Homestay in a karst village'),
    ],
    itinerary: [
      {
        title: L('Goa & malam', 'Cave & night'),
        items: [
          ['09.00', L('Briefing & caving Goa Batu Kapal', 'Briefing & Batu Kapal caving')],
          ['13.00', L('Makan siang & istirahat', 'Lunch & rest')],
          ['19.30', L('Night walk herpetofauna', 'Herpetofauna night walk')],
        ],
      },
      {
        title: L('Lembah', 'Valley'),
        items: [
          ['07.00', L('Birdwatching pagi', 'Morning birdwatching')],
          ['09.00', L('Susur Sungai Bekail', 'Bekail River walk')],
          ['12.00', L('Makan siang & selesai', 'Lunch & finish')],
        ],
      },
    ],
    includes: [
      L('Pemandu HPI', 'HPI guide'),
      L('Helm & headlamp', 'Helmet & headlamp'),
      L('Homestay 1 malam', '1 night homestay'),
      L('Makan 4x', '4 meals'),
      L('Asuransi', 'Insurance'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan'), L('Tip', 'Tips')],
    meetingPoint: L('Desa Batu Jongjong, Bahorok', 'Batu Jongjong Village, Bahorok'),
    breakdown: split(36, 20, 18, 16, 10),
    slots: 4,
  },

  // ── Koridor IV — Pelaruga & Teroh-Teroh ────────────────────
  {
    slug: 'teroh-teroh-kolam-abadi',
    corridor: 'pelaruga-teroh-teroh',
    title: L('Kolam Abadi & Teroh-Teroh', 'Kolam Abadi & Teroh-Teroh'),
    tagline: L(
      'Trip singkat paling ramah keluarga: berenang di kolam sebening kaca dan air terjun.',
      'Our most family-friendly short trip: swim in a glass-clear pool and under a waterfall.',
    ),
    days: 1,
    price: 220000,
    difficulty: 'ringan',
    group: [2, 12],
    interests: ['sungai', 'kuliner'],
    familyFriendly: true,
    highlights: [
      L('Jalur pendek ± 30 menit', 'Short trail, ± 30 minutes'),
      L('Pelampung untuk anak', 'Life jackets for children'),
      L('Makan siang masakan rumahan', 'Home-cooked lunch'),
    ],
    itinerary: [
      {
        title: L('Hari air', 'Water day'),
        items: [
          ['09.00', L('Tiba di basecamp pemuda konservasi', 'Arrive at the youth conservation basecamp')],
          ['09.30', L('Trekking ringan ke Kolam Abadi', 'Easy walk to Kolam Abadi')],
          ['10.00', L('Berenang & foto di Air Terjun Teroh-Teroh', 'Swim & photos at Teroh-Teroh Waterfall')],
          ['12.30', L('Makan siang di tepi sungai', 'Riverside lunch')],
        ],
      },
    ],
    includes: [
      L('Pemandu lokal', 'Local guide'),
      L('Pelampung', 'Life jacket'),
      L('Makan siang', 'Lunch'),
      L('Retribusi kebersihan', 'Cleanliness fee'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan')],
    meetingPoint: L('Basecamp Pemuda Konservasi Pelaruga', 'Pelaruga Youth Conservation Basecamp'),
    breakdown: split(34, 14, 20, 20, 12),
    slots: 9,
  },
  {
    slug: 'pelaruga-body-rafting',
    corridor: 'pelaruga-teroh-teroh',
    title: L('Body Rafting Jeram Pelaruga', 'Pelaruga Rapids Body Rafting'),
    tagline: L(
      'Hanyut mengikuti arus jeram ringan dengan pelampung, didampingi tim rescue bersertifikat.',
      'Float down gentle rapids in a life jacket, accompanied by a certified rescue team.',
    ),
    days: 1,
    price: 320000,
    difficulty: 'sedang',
    group: [2, 8],
    interests: ['sungai', 'petualangan'],
    familyFriendly: false,
    highlights: [
      L('Tim rescue sungai bersertifikat', 'Certified river rescue team'),
      L('Perlengkapan standar keselamatan', 'Standard safety gear'),
      L('Dokumentasi foto gratis', 'Free photo documentation'),
    ],
    itinerary: [
      {
        title: L('Arus jeram', 'Rapids'),
        items: [
          ['09.00', L('Briefing keselamatan', 'Safety briefing')],
          ['09.45', L('Body rafting ± 2 km', 'Body rafting, ± 2 km')],
          ['12.00', L('Makan siang', 'Lunch')],
        ],
      },
    ],
    includes: [
      L('Pemandu & rescue', 'Guide & rescue team'),
      L('Helm, pelampung, pelindung lutut', 'Helmet, life jacket, knee pads'),
      L('Makan siang', 'Lunch'),
      L('Asuransi', 'Insurance'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan')],
    meetingPoint: L('Basecamp Pemuda Konservasi Pelaruga', 'Pelaruga Youth Conservation Basecamp'),
    breakdown: split(38, 10, 24, 16, 12),
    slots: 6,
  },

  // ── Koridor V — Mangrove Pesisir ───────────────────────────
  {
    slug: 'mangrove-susur-muara',
    corridor: 'mangrove-pesisir',
    title: L('Susur Muara & Tanam Bakau', 'Estuary Paddle & Mangrove Planting'),
    tagline: L(
      'Naik perahu dayung tradisional, amati burung air, lalu tanam bibit bakau atas nama Anda.',
      'Ride a traditional rowing boat, watch waterbirds, then plant a mangrove seedling in your name.',
    ),
    days: 1,
    price: 190000,
    difficulty: 'ringan',
    group: [2, 15],
    interests: ['burung', 'budaya', 'kuliner'],
    familyFriendly: true,
    highlights: [
      L('1 bibit bakau tercatat atas nama Anda', '1 mangrove seedling registered in your name'),
      L('Cocok untuk rombongan sekolah', 'Great for school groups'),
      L('Makan siang hasil tangkapan nelayan', 'Lunch from the fishermen’s catch'),
    ],
    itinerary: [
      {
        title: L('Muara', 'Estuary'),
        items: [
          ['08.00', L('Pengenalan restorasi di pondok kelompok nelayan', 'Restoration intro at the fishing group’s hut')],
          ['08.45', L('Susur muara dengan perahu dayung', 'Paddle the estuary by rowing boat')],
          ['10.30', L('Menanam bibit bakau', 'Plant mangrove seedlings')],
          ['12.00', L('Kuliner pesisir', 'Coastal lunch')],
        ],
      },
    ],
    includes: [
      L('Pemandu kelompok nelayan', 'Fishing-group guide'),
      L('Perahu & pelampung', 'Boat & life jackets'),
      L('Bibit bakau', 'Mangrove seedling'),
      L('Makan siang', 'Lunch'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan')],
    meetingPoint: L('Ekowisata Mangrove Lubuk Kertang', 'Lubuk Kertang Mangrove Ecotourism'),
    breakdown: split(30, 16, 18, 26, 10),
    slots: 12,
  },
  {
    slug: 'mangrove-birdwatching-2h1m',
    corridor: 'mangrove-pesisir',
    title: L('Burung Migran Pesisir Timur', 'East Coast Migratory Birds'),
    tagline: L(
      'Dua hari untuk pengamat burung: subuh di muara, malam di rumah panggung nelayan.',
      'Two days for birders: dawn on the estuary, nights in a fisherman’s stilt house.',
    ),
    days: 2,
    price: 780000,
    difficulty: 'ringan',
    group: [2, 6],
    interests: ['burung', 'budaya', 'kuliner'],
    familyFriendly: true,
    highlights: [
      L('Sesi subuh & senja saat burung aktif', 'Dawn & dusk sessions when birds are active'),
      L('Teropong disediakan', 'Binoculars provided'),
      L('Homestay rumah panggung', 'Stilt-house homestay'),
    ],
    itinerary: [
      {
        title: L('Senja muara', 'Estuary dusk'),
        items: [
          ['13.00', L('Tiba & makan siang', 'Arrival & lunch')],
          ['16.00', L('Birdwatching senja', 'Dusk birdwatching')],
          ['19.00', L('Makan malam keluarga nelayan', 'Dinner with a fishing family')],
        ],
      },
      {
        title: L('Subuh', 'Dawn'),
        items: [
          ['05.30', L('Birdwatching subuh', 'Dawn birdwatching')],
          ['09.00', L('Tanam bakau', 'Mangrove planting')],
          ['11.30', L('Selesai', 'Finish')],
        ],
      },
    ],
    includes: [
      L('Pemandu & teropong', 'Guide & binoculars'),
      L('Homestay 1 malam', '1 night homestay'),
      L('Makan 4x', '4 meals'),
      L('Bibit bakau', 'Mangrove seedling'),
    ],
    excludes: [L('Transport dari Medan', 'Transport from Medan')],
    meetingPoint: L('Ekowisata Mangrove Lubuk Kertang', 'Lubuk Kertang Mangrove Ecotourism'),
    breakdown: split(32, 22, 16, 20, 10),
    slots: 3,
  },
]

export const packageBySlug = Object.fromEntries(packages.map((p) => [p.slug, p]))
export const packagesByCorridor = (slug) => packages.filter((p) => p.corridor === slug)
