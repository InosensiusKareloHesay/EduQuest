import { Item, Subject, QuestionCategory, QuizSettings, Question, Profile, PlayerEquipment } from '@/types';

export const INITIAL_ITEMS: Item[] = [
  // Hair
  {
    id: 'item-hair-1',
    name: 'Rambut Pendek Cokelat',
    category: 'hair',
    price: 0,
    asset_id: 'hair-short-brown',
    description: 'Gaya rambut rapi dan santai.',
    is_default: true,
    rarity: 'common'
  },
  {
    id: 'item-hair-2',
    name: 'Rambut Panjang Hitam',
    category: 'hair',
    price: 40,
    asset_id: 'hair-long-black',
    description: 'Rambut panjang lurus berkilau.',
    is_default: false,
    rarity: 'common'
  },
  {
    id: 'item-hair-3',
    name: 'Rambut Kriting Pirang',
    category: 'hair',
    price: 75,
    asset_id: 'hair-curly-blonde',
    description: 'Gaya rambut ikal ceria berenergi.',
    is_default: false,
    rarity: 'rare'
  },
  {
    id: 'item-hair-4',
    name: 'Rambut Spiky Biru',
    category: 'hair',
    price: 120,
    asset_id: 'hair-spiky-blue',
    description: 'Rambut ala pahlawan anime keren!',
    is_default: false,
    rarity: 'epic'
  },

  // Outfits
  {
    id: 'item-outfit-1',
    name: 'Kaos Biru EduQuest',
    category: 'outfit',
    price: 0,
    asset_id: 'outfit-blue-tee',
    description: 'Kaos santai berlogo EduQuest.',
    is_default: true,
    rarity: 'common'
  },
  {
    id: 'item-outfit-2',
    name: 'Kemeja Kotak Merah',
    category: 'outfit',
    price: 50,
    asset_id: 'outfit-red-flannel',
    description: 'Kemeja flanel modis dan hangat.',
    is_default: false,
    rarity: 'common'
  },
  {
    id: 'item-outfit-3',
    name: 'Hoodie Juara Ungu',
    category: 'outfit',
    price: 90,
    asset_id: 'outfit-purple-hoodie',
    description: 'Hoodie favorit para pemenang kuis.',
    is_default: false,
    rarity: 'rare'
  },
  {
    id: 'item-outfit-4',
    name: 'Jas Peneliti Pintar',
    category: 'outfit',
    price: 150,
    asset_id: 'outfit-lab-coat',
    description: 'Jas laboratorium ilmuwan cilik!',
    is_default: false,
    rarity: 'epic'
  },

  // Bottoms
  {
    id: 'item-bottom-1',
    name: 'Celana Denim Biru',
    category: 'bottom',
    price: 0,
    asset_id: 'bottom-denim-jeans',
    description: 'Celana jeans klasik nyaman.',
    is_default: true,
    rarity: 'common'
  },
  {
    id: 'item-bottom-2',
    name: 'Celana Cargo Khaki',
    category: 'bottom',
    price: 40,
    asset_id: 'bottom-cargo-khaki',
    description: 'Banyak kantong untuk simpan catatan.',
    is_default: false,
    rarity: 'common'
  },
  {
    id: 'item-bottom-3',
    name: 'Rok Lipit Kotak',
    category: 'bottom',
    price: 60,
    asset_id: 'bottom-pleated-skirt',
    description: 'Rok sekolah modis dan anggun.',
    is_default: false,
    rarity: 'rare'
  },

  // Shoes
  {
    id: 'item-shoes-1',
    name: 'Sneakers Merah',
    category: 'shoes',
    price: 0,
    asset_id: 'shoes-red-sneakers',
    description: 'Sepatu kasual yang lincah.',
    is_default: true,
    rarity: 'common'
  },
  {
    id: 'item-shoes-2',
    name: 'Sepatu Pantofel Cokelat',
    category: 'shoes',
    price: 45,
    asset_id: 'shoes-brown-loafers',
    description: 'Sepatu formal murid berprestasi.',
    is_default: false,
    rarity: 'common'
  },
  {
    id: 'item-shoes-3',
    name: 'Sepatu Bot Petualang',
    category: 'shoes',
    price: 80,
    asset_id: 'shoes-boots-yellow',
    description: 'Siap melangkah ke segala tantangan.',
    is_default: false,
    rarity: 'rare'
  },

  // Accessories
  {
    id: 'item-acc-1',
    name: 'Topi Baseball Kuning',
    category: 'head_accessory',
    price: 50,
    asset_id: 'acc-yellow-cap',
    description: 'Melindungi dari sinar matahari cerah.',
    is_default: false,
    rarity: 'common'
  },
  {
    id: 'item-acc-2',
    name: 'Mahkota Emas Juara',
    category: 'head_accessory',
    price: 200,
    asset_id: 'acc-gold-crown',
    description: 'Hanya untuk sang master trivia sejati!',
    is_default: false,
    rarity: 'legendary'
  },
  {
    id: 'item-acc-3',
    name: 'Kacamata Cerdas Bulat',
    category: 'face_accessory',
    price: 60,
    asset_id: 'acc-smart-glasses',
    description: 'Menambah aura kejeniusanmu +100.',
    is_default: false,
    rarity: 'rare'
  },
  {
    id: 'item-acc-4',
    name: 'Tas Ransel Penjelajah',
    category: 'back_accessory',
    price: 80,
    asset_id: 'acc-explorer-bag',
    description: 'Muat banyak buku dan camilan!',
    is_default: false,
    rarity: 'rare'
  },
  {
    id: 'item-acc-5',
    name: 'Sayap Peri Berkilau',
    category: 'back_accessory',
    price: 250,
    asset_id: 'acc-fairy-wings',
    description: 'Sayap ajaib pemancar cahaya bintang.',
    is_default: false,
    rarity: 'legendary'
  }
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'subj-1',
    name: 'Matematika',
    slug: 'matematika',
    icon: 'Calculator',
    color: '#3B82F6',
    description: 'Asah logika berhitung, bangun ruang, dan pecahan.',
    is_active: true
  },
  {
    id: 'subj-2',
    name: 'IPA (Sains)',
    slug: 'ipa',
    icon: 'FlaskConical',
    color: '#10B981',
    description: 'Jelajahi keajaiban alam, energi, dan tata surya.',
    is_active: true
  },
  {
    id: 'subj-3',
    name: 'Bahasa Indonesia',
    slug: 'bahasa-indonesia',
    icon: 'BookOpen',
    color: '#F59E0B',
    description: 'Kembangkan wawasan kosa kata, tata bahasa, dan membaca.',
    is_active: true
  }
];

export const INITIAL_CATEGORIES: QuestionCategory[] = [
  {
    id: 'cat-pecahan',
    subject_id: 'subj-1',
    name: 'Pecahan',
    slug: 'pecahan',
    icon: 'PieChart',
    description: 'Belajar konsep setengah, seperempat, penjumlahan pecahan.',
    is_active: true
  },
  {
    id: 'cat-hitung',
    subject_id: 'subj-1',
    name: 'Operasi Hitung',
    slug: 'operasi-hitung',
    icon: 'PlusCircle',
    description: 'Penjumlahan, pengurangan, perkalian, dan pembagian cepat.',
    is_active: true
  },
  {
    id: 'cat-bangun',
    subject_id: 'subj-1',
    name: 'Bangun Datar',
    slug: 'bangun-datar',
    icon: 'Shapes',
    description: 'Mengenal persegi, segitiga, lingkaran, dan keliling.',
    is_active: true
  }
];

export const INITIAL_QUIZ_SETTINGS: Record<string, QuizSettings> = {
  'cat-pecahan': {
    id: 'qs-pecahan',
    category_id: 'cat-pecahan',
    total_questions: 10,
    easy_count: 4,
    medium_count: 4,
    hard_count: 2,
    reward_per_correct: 10,
    is_active: true
  },
  'cat-hitung': {
    id: 'qs-hitung',
    category_id: 'cat-hitung',
    total_questions: 10,
    easy_count: 4,
    medium_count: 4,
    hard_count: 2,
    reward_per_correct: 10,
    is_active: true
  },
  'cat-bangun': {
    id: 'qs-bangun',
    category_id: 'cat-bangun',
    total_questions: 10,
    easy_count: 4,
    medium_count: 4,
    hard_count: 2,
    reward_per_correct: 10,
    is_active: true
  }
};

export const INITIAL_QUESTIONS: Question[] = [
  // EASY
  {
    id: 'q-pecahan-e1',
    category_id: 'cat-pecahan',
    question_text: 'Berapakah pecahan yang senilai dengan sebuah apel yang dibagi rata menjadi 2 bagian?',
    difficulty: 'easy',
    status: 'published',
    explanation: 'Sebuah benda utuh dibagi menjadi 2 bagian yang sama besar bernilai 1/2.',
    options: [
      { id: 'opt-e1-a', option_label: 'A', option_text: '1/4', is_correct: false, sort_order: 1 },
      { id: 'opt-e1-b', option_label: 'B', option_text: '1/2', is_correct: true, sort_order: 2 },
      { id: 'opt-e1-c', option_label: 'C', option_text: '2/1', is_correct: false, sort_order: 3 },
      { id: 'opt-e1-d', option_label: 'D', option_text: '3/4', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-e2',
    category_id: 'cat-pecahan',
    question_text: 'Berapakah hasil dari 1/4 + 2/4 ?',
    difficulty: 'easy',
    status: 'published',
    explanation: 'Karena penyebutnya sudah sama (4), jumlahkan pembilangnya: 1 + 2 = 3. Jadi 3/4.',
    options: [
      { id: 'opt-e2-a', option_label: 'A', option_text: '3/4', is_correct: true, sort_order: 1 },
      { id: 'opt-e2-b', option_label: 'B', option_text: '2/4', is_correct: false, sort_order: 2 },
      { id: 'opt-e2-c', option_label: 'C', option_text: '3/8', is_correct: false, sort_order: 3 },
      { id: 'opt-e2-d', option_label: 'D', option_text: '1/2', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-e3',
    category_id: 'cat-pecahan',
    question_text: 'Manakah pecahan berikut yang bernilai paling kecil?',
    difficulty: 'easy',
    status: 'published',
    explanation: 'Dengan pembilang 1, penyebut semakin besar bernilai semakin kecil: 1/8 adalah terkecil.',
    options: [
      { id: 'opt-e3-a', option_label: 'A', option_text: '1/2', is_correct: false, sort_order: 1 },
      { id: 'opt-e3-b', option_label: 'B', option_text: '1/3', is_correct: false, sort_order: 2 },
      { id: 'opt-e3-c', option_label: 'C', option_text: '1/4', is_correct: false, sort_order: 3 },
      { id: 'opt-e3-d', option_label: 'D', option_text: '1/8', is_correct: true, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-e4',
    category_id: 'cat-pecahan',
    question_text: 'Bentuk pecahan biasa dari bilangan desimal 0,5 adalah...',
    difficulty: 'easy',
    status: 'published',
    explanation: '0,5 = 5/10. Disederhanakan dengan membagi 5 menjadi 1/2.',
    options: [
      { id: 'opt-e4-a', option_label: 'A', option_text: '1/5', is_correct: false, sort_order: 1 },
      { id: 'opt-e4-b', option_label: 'B', option_text: '1/2', is_correct: true, sort_order: 2 },
      { id: 'opt-e4-c', option_label: 'C', option_text: '5/2', is_correct: false, sort_order: 3 },
      { id: 'opt-e4-d', option_label: 'D', option_text: '2/5', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-e5',
    category_id: 'cat-pecahan',
    question_text: 'Berapakah hasil dari 5/7 - 2/7 ?',
    difficulty: 'easy',
    status: 'published',
    explanation: 'Penyebut sama yaitu 7, kurangkan pembilang: 5 - 2 = 3. Hasilnya 3/7.',
    options: [
      { id: 'opt-e5-a', option_label: 'A', option_text: '3/7', is_correct: true, sort_order: 1 },
      { id: 'opt-e5-b', option_label: 'B', option_text: '2/7', is_correct: false, sort_order: 2 },
      { id: 'opt-e5-c', option_label: 'C', option_text: '3/14', is_correct: false, sort_order: 3 },
      { id: 'opt-e5-d', option_label: 'D', option_text: '7/7', is_correct: false, sort_order: 4 }
    ]
  },

  // MEDIUM
  {
    id: 'q-pecahan-m1',
    category_id: 'cat-pecahan',
    question_text: 'Berapakah hasil dari 1/2 + 1/4 ?',
    difficulty: 'medium',
    status: 'published',
    explanation: 'Samakan penyebut menjadi 4: 1/2 = 2/4. Maka 2/4 + 1/4 = 3/4.',
    options: [
      { id: 'opt-m1-a', option_label: 'A', option_text: '2/6', is_correct: false, sort_order: 1 },
      { id: 'opt-m1-b', option_label: 'B', option_text: '3/4', is_correct: true, sort_order: 2 },
      { id: 'opt-m1-c', option_label: 'C', option_text: '1/3', is_correct: false, sort_order: 3 },
      { id: 'opt-m1-d', option_label: 'D', option_text: '1', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-m2',
    category_id: 'cat-pecahan',
    question_text: 'Bentuk paling sederhana dari pecahan 12/18 adalah...',
    difficulty: 'medium',
    status: 'published',
    explanation: 'Bagi pembilang dan penyebut dengan FPB 6: 12:6 = 2, 18:6 = 3. Hasilnya 2/3.',
    options: [
      { id: 'opt-m2-a', option_label: 'A', option_text: '3/4', is_correct: false, sort_order: 1 },
      { id: 'opt-m2-b', option_label: 'B', option_text: '2/3', is_correct: true, sort_order: 2 },
      { id: 'opt-m2-c', option_label: 'C', option_text: '6/9', is_correct: false, sort_order: 3 },
      { id: 'opt-m2-d', option_label: 'D', option_text: '4/6', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-m3',
    category_id: 'cat-pecahan',
    question_text: 'Budi memiliki 8 potong pizza. Budi memakan 3 potong. Berapa bagian pizza yang tersisa?',
    difficulty: 'medium',
    status: 'published',
    explanation: 'Sisa potong = 8 - 3 = 5 potong dari 8, sehingga bernilai 5/8 bagian.',
    options: [
      { id: 'opt-m3-a', option_label: 'A', option_text: '3/8', is_correct: false, sort_order: 1 },
      { id: 'opt-m3-b', option_label: 'B', option_text: '5/8', is_correct: true, sort_order: 2 },
      { id: 'opt-m3-c', option_label: 'C', option_text: '1/2', is_correct: false, sort_order: 3 },
      { id: 'opt-m3-d', option_label: 'D', option_text: '8/3', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-m4',
    category_id: 'cat-pecahan',
    question_text: 'Berapakah hasil dari perkalian pecahan 2/3 x 3/5 ?',
    difficulty: 'medium',
    status: 'published',
    explanation: '2/3 x 3/5 = (2x3) / (3x5) = 6/15 = 2/5.',
    options: [
      { id: 'opt-m4-a', option_label: 'A', option_text: '2/5', is_correct: true, sort_order: 1 },
      { id: 'opt-m4-b', option_label: 'B', option_text: '5/8', is_correct: false, sort_order: 2 },
      { id: 'opt-m4-c', option_label: 'C', option_text: '6/8', is_correct: false, sort_order: 3 },
      { id: 'opt-m4-d', option_label: 'D', option_text: '1/2', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-m5',
    category_id: 'cat-pecahan',
    question_text: 'Pecahan campuran 2 1/3 jika diubah ke pecahan biasa adalah...',
    difficulty: 'medium',
    status: 'published',
    explanation: '(2 x 3) + 1 = 7, penyebut tetap 3. Jadi 7/3.',
    options: [
      { id: 'opt-m5-a', option_label: 'A', option_text: '6/3', is_correct: false, sort_order: 1 },
      { id: 'opt-m5-b', option_label: 'B', option_text: '5/3', is_correct: false, sort_order: 2 },
      { id: 'opt-m5-c', option_label: 'C', option_text: '7/3', is_correct: true, sort_order: 3 },
      { id: 'opt-m5-d', option_label: 'D', option_text: '8/3', is_correct: false, sort_order: 4 }
    ]
  },

  // HARD
  {
    id: 'q-pecahan-h1',
    category_id: 'cat-pecahan',
    question_text: 'Ibu memiliki 3/4 liter minyak. Digunakan 1/3 liter, lalu membeli lagi 1/2 liter. Berapa liter minyak Ibu sekarang?',
    difficulty: 'hard',
    status: 'published',
    explanation: '3/4 - 1/3 + 1/2 = 9/12 - 4/12 + 6/12 = 11/12 liter.',
    options: [
      { id: 'opt-h1-a', option_label: 'A', option_text: '11/12 liter', is_correct: true, sort_order: 1 },
      { id: 'opt-h1-b', option_label: 'B', option_text: '7/12 liter', is_correct: false, sort_order: 2 },
      { id: 'opt-h1-c', option_label: 'C', option_text: '1 liter', is_correct: false, sort_order: 3 },
      { id: 'opt-h1-d', option_label: 'D', option_text: '5/6 liter', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-h2',
    category_id: 'cat-pecahan',
    question_text: 'Berapakah hasil pembagian pecahan 3/4 : 2/5 ?',
    difficulty: 'hard',
    status: 'published',
    explanation: '3/4 : 2/5 = 3/4 x 5/2 = 15/8 = 1 7/8.',
    options: [
      { id: 'opt-h2-a', option_label: 'A', option_text: '6/20', is_correct: false, sort_order: 1 },
      { id: 'opt-h2-b', option_label: 'B', option_text: '15/8', is_correct: true, sort_order: 2 },
      { id: 'opt-h2-c', option_label: 'C', option_text: '8/15', is_correct: false, sort_order: 3 },
      { id: 'opt-h2-d', option_label: 'D', option_text: '5/8', is_correct: false, sort_order: 4 }
    ]
  },
  {
    id: 'q-pecahan-h3',
    category_id: 'cat-pecahan',
    question_text: 'Dalam sebuah kelas, 2/5 siswa adalah laki-laki. Jika jumlah siswa laki-laki 16 orang, berapa jumlah total siswa?',
    difficulty: 'hard',
    status: 'published',
    explanation: '2/5 x Total = 16 => Total = 16 x (5/2) = 40 siswa.',
    options: [
      { id: 'opt-h3-a', option_label: 'A', option_text: '32 siswa', is_correct: false, sort_order: 1 },
      { id: 'opt-h3-b', option_label: 'B', option_text: '36 siswa', is_correct: false, sort_order: 2 },
      { id: 'opt-h3-c', option_label: 'C', option_text: '40 siswa', is_correct: true, sort_order: 3 },
      { id: 'opt-h3-d', option_label: 'D', option_text: '48 siswa', is_correct: false, sort_order: 4 }
    ]
  }
];

export const DEFAULT_STUDENT_PROFILE: Profile = {
  id: 'student-demo-1',
  email: 'siswa@eduquest.id',
  full_name: 'Budi Petualang',
  role: 'student',
  coins: 100,
  avatar_skin: '#FFDFC4',
  avatar_expression: 'happy',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const DEFAULT_EQUIPMENT: PlayerEquipment = {
  hair_item_id: 'item-hair-1',
  outfit_item_id: 'item-outfit-1',
  bottom_item_id: 'item-bottom-1',
  shoes_item_id: 'item-shoes-1',
  head_accessory_id: null,
  face_accessory_id: null,
  back_accessory_id: null
};

