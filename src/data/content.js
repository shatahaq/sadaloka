/** Konten naratif beranda — diambil dari dokumen konten Sadaloka (ID) beserta terjemahan EN. */
const L = (id, en) => ({ id, en })

export const journeySteps = [
  { n: '01', phase: L('Inisiasi', 'Initiation'), verb: 'Discover', text: L('Kenali Langkat lebih dekat melalui pilihan destinasi, cerita, dan pengalaman yang telah dikurasi Sadaloka.', 'Get to know Langkat through destinations, stories and experiences curated by Sadaloka.') },
  { n: '02', phase: L('Penyelarasan', 'Alignment'), verb: 'Match', text: L('Temukan perjalanan yang sesuai dengan minat, waktu, dan gaya eksplorasimu melalui Smart Trip Match.', 'Find a trip that fits your interests, time and travel style with Smart Trip Match.') },
  { n: '03', phase: L('Kejujuran', 'Honesty'), verb: 'Compare', text: L('Lihat rincian harga dan kebutuhan perjalanan secara terbuka, tanpa biaya tersembunyi.', 'See the full price breakdown and what each trip needs — no hidden fees.') },
  { n: '04', phase: L('Kepastian', 'Certainty'), verb: 'Book', text: L('Pesan perjalanan dengan lebih tenang melalui slot yang jelas dan pemandu lokal yang terverifikasi.', 'Book with confidence: clear availability and verified local guides.') },
  { n: '05', phase: L('Persaudaraan', 'Kinship'), verb: 'Meet', text: L('Kenali pemandu dan masyarakat lokal yang akan menjadi bagian dari perjalananmu sejak langkah pertama.', 'Meet the guides and local people who will be part of your journey from the first step.') },
  { n: '06', phase: L('Petualangan', 'Adventure'), verb: 'Explore', text: L('Jelajahi hutan, sungai, satwa, dan lanskap Langkat dengan cara yang tetap menghargai alam.', 'Explore Langkat’s forests, rivers, wildlife and landscapes in a way that respects nature.') },
  { n: '07', phase: L('Resonansi', 'Resonance'), verb: 'Experience', text: L('Rasakan lebih dari sekadar pemandangan melalui kuliner, budaya, dan kehidupan masyarakat di sekitar destinasi.', 'Go beyond the view through food, culture and the daily life of communities around each destination.') },
  { n: '08', phase: L('Tanggung Jawab', 'Responsibility'), verb: 'Conserve', text: L('Biarkan setiap perjalanan memberi kembali melalui dukungan terhadap konservasi dan lingkungan setempat.', 'Let every trip give back by supporting local conservation and the environment.') },
  { n: '09', phase: L('Refleksi', 'Reflection'), verb: 'Return', text: L('Pulang bukan hanya membawa cerita, tetapi juga pemahaman baru tentang alam dan masyarakat Langkat.', 'Go home with more than stories — with a new understanding of Langkat’s nature and people.') },
  { n: '10', phase: L('Apresiasi', 'Appreciation'), verb: 'Review', text: L('Bagikan pengalamanmu untuk membantu menjaga kualitas layanan sekaligus mendukung pemandu dan komunitas lokal.', 'Share your experience to help keep quality high and support local guides and communities.') },
]

export const journeyPhases = [
  { key: 'before', label: L('Sebelum berangkat', 'Before you go'), range: [0, 4] },
  { key: 'during', label: L('Di Langkat', 'In Langkat'), range: [4, 8] },
  { key: 'after', label: L('Setelah pulang', 'After you return'), range: [8, 10] },
]

export const pillars = [
  {
    key: 'ethics',
    title: L('Etika Konservasi Rimba', 'Jungle Conservation Ethics'),
    text: L(
      'Menjelajah tanpa mengeksploitasi satwa. Sadaloka menerapkan aturan interaksi yang bertanggung jawab, menjaga jarak aman, serta memperhatikan kapasitas kunjungan agar ekosistem Leuser tetap terjaga.',
      'Explore without exploiting wildlife. Sadaloka enforces responsible interaction rules, safe distances and visitor capacity limits so the Leuser ecosystem stays intact.',
    ),
    tag: 'No Feeding • No Touching',
  },
  {
    key: 'community',
    title: L('Direct-to-Community', 'Direct-to-Community'),
    text: L(
      'Setiap pemesanan diarahkan langsung kepada pemandu dan pelaku usaha lokal melalui jejaring HPI Langkat dan homestay setempat, sehingga manfaat wisata dapat kembali ke masyarakat.',
      'Every booking goes straight to local guides and businesses through the HPI Langkat network and village homestays, so tourism benefits return to the community.',
    ),
    tag: L('Ekonomi yang Tumbuh Bersama Desa', 'An Economy That Grows With the Village'),
  },
  {
    key: 'transparency',
    title: L('Transparansi Biaya', 'Transparent Pricing'),
    text: L(
      'Tidak ada biaya tersembunyi. Wisatawan dapat melihat rincian penggunaan biaya perjalanan, mulai dari jasa pemandu, akomodasi, logistik, hingga kontribusi untuk kegiatan konservasi.',
      'No hidden fees. Travellers can see exactly how their money is used — guide fees, accommodation, logistics and the contribution to conservation.',
    ),
    tag: L('Lihat Rincian Biaya', 'See the Cost Breakdown'),
    href: '/transparansi',
  },
  {
    key: 'safety',
    title: L('Pemandu & Standar Keselamatan', 'Guides & Safety Standards'),
    text: L(
      'Perjalanan didampingi pemandu lokal terverifikasi dengan standar pelayanan dan keselamatan yang jelas, sehingga wisatawan dapat menjelajah dengan lebih aman dan nyaman.',
      'Every trip is led by verified local guides with clear service and safety standards, so you can explore safely and comfortably.',
    ),
    tag: L('Ranger Terverifikasi • Perjalanan Lebih Aman', 'Verified Rangers • Safer Journeys'),
  },
]

export const safetyChecks = [
  [L('Lisensi HPI Langkat', 'HPI Langkat licence'), L('Diverifikasi per pemandu', 'Verified per guide')],
  [L('First Aid / WFR', 'First Aid / WFR'), L('Wajib untuk pemandu utama', 'Required for lead guides')],
  [L('Rescue sungai', 'River rescue'), L('Di setiap trip air & rafting', 'On every water & rafting trip')],
  [L('Asuransi perjalanan', 'Travel insurance'), L('Termasuk dalam harga paket', 'Included in the package price')],
]

export const ethicsRules = [
  { title: L('Jarak minimum 10 meter', 'Minimum distance of 10 metres'), text: L('Dari orangutan dan primata liar lainnya. Pemandu akan menghentikan grup bila jarak terlalu dekat.', 'From orangutans and other wild primates. Guides will stop the group if it gets too close.') },
  { title: L('Tidak memberi makan', 'No feeding'), text: L('Makanan manusia mengubah perilaku dan membawa penyakit. Tidak ada pengecualian.', 'Human food changes behaviour and spreads disease. No exceptions.') },
  { title: L('Tidak menyentuh satwa liar', 'No touching wildlife'), text: L('Termasuk untuk foto. Primata rentan tertular flu dan penyakit pernapasan manusia.', 'Not even for photos. Primates easily catch human flu and respiratory illnesses.') },
  { title: L('Bawa pulang sampahmu', 'Carry out your rubbish'), text: L('Setiap grup membawa kantong sampah. Pemandu mencatat dan menimbangnya di akhir trip.', 'Every group carries a rubbish bag. Guides log and weigh it at the end of the trip.') },
  { title: L('Kuota harian jalur', 'Daily trail quotas'), text: L('Slot dibatasi per jalur agar satwa tidak terganggu. Karena itu slot bisa habis lebih cepat.', 'Slots are capped per trail so wildlife isn’t disturbed — which is why they can sell out quickly.') },
  { title: L('Tanpa tunggangan gajah', 'No elephant riding'), text: L('Di koridor Tangkahan, kami hanya menawarkan berjalan berdampingan dan membantu perawatan.', 'In Tangkahan we only offer walking alongside the elephants and helping with their care.') },
]

export const faqs = [
  {
    q: L('Bagaimana cara menuju Langkat dari Medan atau Bandara Kualanamu?', 'How do I get to Langkat from Medan or Kualanamu Airport?'),
    a: L(
      'Bukit Lawang berjarak sekitar 3 jam berkendara dari Medan, Tangkahan sekitar 4 jam. Anda bisa memilih tambahan antar-jemput saat memesan, atau datang sendiri ke titik kumpul yang tertera di setiap paket.',
      'Bukit Lawang is about 3 hours by road from Medan and Tangkahan about 4 hours. You can add a transfer when booking, or make your own way to the meeting point listed on each package.',
    ),
  },
  {
    q: L('Apakah pemandu Sadaloka benar-benar berlisensi?', 'Are Sadaloka guides really licensed?'),
    a: L(
      'Ya. Setiap pemandu terdaftar di HPI (Himpunan Pramuwisata Indonesia) Langkat dan nomor lisensinya tercantum di profil. Kami juga memverifikasi sertifikat keselamatan seperti First Aid dan Rescue Sungai.',
      'Yes. Every guide is registered with HPI (the Indonesian Tour Guide Association) Langkat and their licence number is shown on their profile. We also verify safety certificates such as First Aid and River Rescue.',
    ),
  },
  {
    q: L('Ke mana uang saya sebenarnya pergi?', 'Where does my money actually go?'),
    a: L(
      'Setiap paket memiliki rincian biaya: jasa pemandu, homestay dan dapur warga, logistik lokal, kontribusi konservasi, dan biaya layanan Sadaloka. Persentasenya ditampilkan sebelum Anda membayar.',
      'Every package has a cost breakdown: guide fees, homestay and village kitchens, local logistics, the conservation contribution and Sadaloka’s service fee. The percentages are shown before you pay.',
    ),
  },
  {
    q: L('Apakah aman untuk anak-anak dan lansia?', 'Is it safe for children and older travellers?'),
    a: L(
      'Banyak paket bertanda "Ramah keluarga" dengan tingkat kesulitan ringan, seperti Kolam Abadi Teroh-Teroh dan Susur Muara Mangrove. Gunakan Smart Trip Match dan pilih tipe grup "Keluarga" untuk rekomendasi yang sesuai.',
      'Many packages are marked "Family-friendly" with an easy difficulty level, such as Kolam Abadi Teroh-Teroh and the Mangrove Estuary Paddle. Use Smart Trip Match and choose the "Family" group type for suitable suggestions.',
    ),
  },
  {
    q: L('Bagaimana kebijakan pembatalan?', 'What is the cancellation policy?'),
    a: L(
      'Pembatalan gratis hingga 72 jam sebelum keberangkatan. Jika cuaca ekstrem membuat jalur ditutup, Anda bisa menjadwalkan ulang atau menerima pengembalian dana penuh.',
      'Free cancellation up to 72 hours before departure. If extreme weather closes a trail, you can reschedule or get a full refund.',
    ),
  },
  {
    q: L('Kapan waktu terbaik berkunjung?', 'When is the best time to visit?'),
    a: L(
      'Musim kering (sekitar Februari–September) paling nyaman untuk trekking. Namun hutan hujan tetap bisa dikunjungi sepanjang tahun; pemandu akan menyesuaikan jalur dengan kondisi cuaca.',
      'The drier season (roughly February–September) is the most comfortable for trekking, but the rainforest can be visited year-round; guides adjust routes to the weather.',
    ),
  },
]
