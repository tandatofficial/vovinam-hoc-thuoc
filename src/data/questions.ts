export type QuestionStatus = 'mastered' | 'learning' | 'review' | 'unlearned';

export interface ClozeItem {
  prompt: string;        // Text with {0}, {1}, etc. as placeholders
  answers: string[];     // Correct answers matching {0}, {1}
  distractors: string[]; // Extra wrong choices for word bank
}

export interface QuestionData {
  id: number;
  number: number;
  title: string;
  category: string;
  status: QuestionStatus;
  score: number; // 0, 1, or 2
  dayAssigned: number;
  keywords: string;
  hintWords: string;
  easyAnswer: {
    headlineQuote: string;
    coreMeaning: string;
    mnemonic: string;
  };
  fullAnswer: {
    intro: string;
    quote?: string;
    paragraphs: string[];
    bulletPoints?: { label: string; text: string; color?: string }[];
  };
  visualDetails?: {
    fourColors?: { name: string; colorClass: string; meaning: string }[];
    threeShapes?: { name: string; meaning: string }[];
    threeObjectives?: { name: string; desc: string }[];
    fivePrinciples?: { name: string; desc: string }[];
  };
  accuracyPercent?: number;
  readCount?: number;

  chunks?: string[];
  clozeData?: ClozeItem[];
  keyPoints?: string[];
  commonMistakes?: string[];
  userNote?: string;
  isBookmarked?: boolean;
}

export const INITIAL_QUESTIONS: QuestionData[] = [
  {
    id: 1,
    number: 1,
    title: 'Ý nghĩa phù hiệu của Vovinam Việt Võ Ðạo?',
    category: 'Lý thuyết võ đạo',
    status: 'mastered',
    score: 2,
    dayAssigned: 1,
    keywords: 'phù hiệu màu sắc hình nét xanh vàng đỏ trắng vuông tròn âm tố dương tố đạo thể',
    hintWords: '4 màu sắc (Xanh, Vàng, Đỏ, Trắng) và 3 nét hình thể (Khung vuông tròn, Vòng âm dương chữ S, Vòng tròn trắng lớn).',
    easyAnswer: {
      headlineQuote: '“Phù hiệu Vovinam gồm 4 màu sắc tượng trưng âm dương vương đạo và 3 nét hình thể biểu thị nguyên lý Cương Nhu phối triển cùng Đạo thể huyền nhiệm.”',
      coreMeaning: 'Về màu sắc: Xanh (âm tố, biển cả & hy vọng), Vàng (vinh quang, Vương đạo Á đông), Đỏ (dương tố, lửa sống & đấu tranh hào hùng), Trắng (tinh khiết, thanh tịnh, cao cả - Không hình không sắc). Về hình nét: Nửa trên vuông nửa dưới tròn (Cương Nhu phối triển, toàn chân toàn thiện), Vòng tròn nhỏ xanh đỏ chữ S (âm dương tương giao, nguồn gốc môn phái), Vòng tròn lớn trắng bao quanh (Đạo thể huyền nhiệm, bao dung điều hòa).',
      mnemonic: 'Mẹo nhớ: 4 Màu (Xanh - Vàng - Đỏ - Trắng) & 3 Nét (Vuông tròn - Chữ S âm dương - Vòng tròn trắng lớn)'
    },
    fullAnswer: {
      intro: 'Phù hiệu (logo) của môn Vovinam Việt Võ Ðạo có ý nghĩa sâu sắc về màu sắc và hình nét:',
      paragraphs: [
        'Về màu sắc: Phù hiệu (logo) của môn Vovinam Việt Võ Ðạo có 4 màu:\n• Xanh: Nói về nguyên tố âm (âm tố), tượng trưng cho biển cả và hy vọng.\n• Vàng: Màu của sự vinh quang hiển hách, tượng trưng màu Vương đạo Á đông.\n• Ðỏ: Nói về nguyên tố dương (dương tố), tượng trưng cho lửa sống và sự đấu tranh hào hùng, kiên quyết.\n• Trắng: Màu của tinh khiết, thanh tịnh, cao cả. Với triết tính “Không hình không sắc”.',
        'Về hình nét:\n• Nền vàng, nửa trên vuông, nửa dưới hình tròn ghép lại tượng trưng cho nguyên lý Cương Nhu phối triển và biểu thị cổ truyền của sự toàn chân, toàn thiện.\n• Vòng tròn nhỏ xanh đỏ ở trong biểu thị cho âm và dương, hình chữ S (bản đồ) ở giữa với ý nghĩa tương giao, tương sinh và thường dịch của trời đất. Biểu thị nguồn gốc xuất phát của môn phái Vovinam Việt Võ Đạo.\n• Vòng tròn lớn màu trắng bao quanh vòng tròn nhỏ, biểu tượng cho Đạo thể huyền nhiệm, không hình không sắc. Với sứ vụ phối hợp, điều hoà, khắc chế, bao dung.'
      ],
      bulletPoints: [
        { label: 'Xanh', text: 'Âm tố, tượng trưng cho biển cả và hy vọng.', color: 'bg-primary' },
        { label: 'Vàng', text: 'Màu của vinh quang hiển hách, Vương đạo Á đông.', color: 'bg-secondary' },
        { label: 'Đỏ', text: 'Dương tố, lửa sống và sự đấu tranh hào hùng, kiên quyết.', color: 'bg-score-forgot' },
        { label: 'Trắng', text: 'Tinh khiết, thanh tịnh, cao cả (“Không hình không sắc”).', color: 'bg-outline-variant' }
      ]
    },
    visualDetails: {
      fourColors: [
        { name: 'Xanh', colorClass: 'bg-primary', meaning: 'Âm tố, biển cả & hy vọng' },
        { name: 'Vàng', colorClass: 'bg-secondary', meaning: 'Vinh quang, Vương đạo Á đông' },
        { name: 'Đỏ', colorClass: 'bg-score-forgot', meaning: 'Dương tố, lửa sống & đấu tranh hào hùng' },
        { name: 'Trắng', colorClass: 'bg-surface-card border border-outline', meaning: 'Tinh khiết, thanh tịnh (“Không hình không sắc”)' }
      ],
      threeShapes: [
        { name: 'Nửa trên vuông, nửa dưới tròn', meaning: 'Nguyên lý Cương Nhu phối triển, toàn chân toàn thiện.' },
        { name: 'Vòng tròn nhỏ xanh đỏ chữ S', meaning: 'Âm dương tương sinh, biểu thị nguồn gốc xuất phát môn phái.' },
        { name: 'Vòng tròn lớn màu trắng bao quanh', meaning: 'Đạo thể huyền nhiệm, phối hợp điều hòa, khắc chế, bao dung.' }
      ]
    },
    accuracyPercent: 95,
    readCount: 5,
    chunks: [
      'Về màu sắc: Phù hiệu Vovinam có 4 màu: Xanh (âm tố, biển cả & hy vọng), Vàng (vinh quang hiển hách, Vương đạo Á đông).',
      'Đỏ (dương tố, lửa sống và sự đấu tranh hào hùng, kiên quyết), Trắng (tinh khiết, thanh tịnh, cao cả, triết tính “Không hình không sắc”).',
      'Về hình nét: Nền vàng nửa trên vuông nửa dưới tròn tượng trưng nguyên lý Cương Nhu phối triển và sự toàn chân, toàn thiện.',
      'Vòng tròn nhỏ xanh đỏ chữ S ở giữa biểu thị âm dương tương giao, tương sinh, thường dịch và nguồn gốc xuất phát của Vovinam.',
      'Vòng tròn lớn màu trắng bao quanh tượng trưng cho Đạo thể huyền nhiệm, không hình không sắc, với sứ vụ phối hợp, điều hoà, khắc chế, bao dung.'
    ],
    keyPoints: [
      '4 Màu sắc: Xanh (âm tố, biển cả), Vàng (vinh quang, Vương đạo), Đỏ (dương tố, lửa sống), Trắng (tinh khiết, Đạo thể)',
      'Triết tính màu Trắng: “Không hình không sắc”',
      'Hình nét 1: Nền vàng nửa trên vuông, nửa dưới tròn (Cương Nhu phối triển, toàn chân toàn thiện)',
      'Hình nét 2: Vòng tròn nhỏ xanh đỏ hình chữ S (âm dương tương giao, nguồn gốc môn phái)',
      'Hình nét 3: Vòng tròn lớn màu trắng bao quanh (Đạo thể huyền nhiệm, phối hợp, điều hòa, khắc chế, bao dung)'
    ],
    clozeData: [
      {
        prompt: 'Nửa trên vuông, nửa dưới hình tròn ghép lại tượng trưng cho nguyên lý {0} phối triển và biểu thị cổ truyền của sự toàn chân, toàn thiện.',
        answers: ['Cương Nhu'],
        distractors: ['Âm Dương', 'Biển Cả', 'Vương Đạo']
      },
      {
        prompt: 'Vàng là màu của sự vinh quang hiển hách, tượng trưng màu {0} Á đông.',
        answers: ['Vương đạo'],
        distractors: ['Võ học', 'Dân tộc', 'Võ đạo']
      },
      {
        prompt: 'Vòng tròn lớn màu trắng bao quanh biểu tượng cho {0} huyền nhiệm, không hình không sắc.',
        answers: ['Đạo thể'],
        distractors: ['Sắc tộc', 'Khí phách', 'Hy vọng']
      }
    ],
    commonMistakes: [
      'Hay quên cụm: “nửa trên vuông, nửa dưới hình tròn” (nhầm thành nửa vuông nửa tròn)',
      'Quên triết tính màu Trắng là “Không hình không sắc” và sứ vụ: “phối hợp, điều hoà, khắc chế, bao dung”'
    ]
  },
  {
    id: 2,
    number: 2,
    title: 'Hãy cho biết môn phái Vovinam Việt Võ Đạo hoạt động có bao nhiêu mục đích và trình bày những mục đích đó?',
    category: 'Mục đích môn phái',
    status: 'learning',
    score: 1,
    dayAssigned: 1,
    keywords: 'mục đích 3 mục đích bảo tồn chấn hưng phát triển nguyễn lộc sưu tầm nghiên cứu huấn luyện võ lực võ thuật tinh thần võ đạo',
    hintWords: '3 Mục đích lớn: 1. Bảo tồn, chấn hưng & phát triển (Nguyễn Lộc 1938); 2. Sưu tầm, nghiên cứu & phát sinh thế võ; 3. Huấn luyện 3 phương diện (Võ lực – Võ thuật – Tinh thần Võ đạo).',
    easyAnswer: {
      headlineQuote: '“Môn phái Vovinam Việt Võ Đạo hoạt động có 3 mục đích: Bảo tồn chấn hưng phát triển, Sưu tầm nghiên cứu phát sinh thế võ, và Huấn luyện môn sinh trên ba phương diện.”',
      coreMeaning: '1. Bảo tồn, chấn hưng và phát triển môn phái Vovinam do cố võ sư Nguyễn Lộc sáng tạo năm 1938; 2. Sưu tầm, nghiên cứu và phát sinh các thế võ để tu bổ xây dựng môn phái; 3. Huấn luyện môn sinh trên ba phương diện: Võ lực – Võ thuật – Tinh thần Võ đạo.',
      mnemonic: 'Mẹo nhớ: 1. Phát triển môn phái (1938) — 2. Nghiên cứu thế võ — 3. Huấn luyện (Võ lực - Võ thuật - Tinh thần)'
    },
    fullAnswer: {
      intro: 'Môn phái Vovinam Việt võ đạo hoạt động có 3 mục đích. Những mục đích đó:',
      paragraphs: [
        '1. Bảo tồn, chấn hưng và phát triển môn phái Vovinam do cố võ sư Nguyễn Lộc sáng tạo năm 1938. Vovinam nêu cao tinh thần truyền thống bất khuất của dân tộc, khai thác trọn vẹn hai phần Cương và Nhu của con người, và phối hợp mọi tinh hoa võ thuật đã có trên thế giới.',
        '2. Sưu tầm, nghiên cứu và phát sinh các thế võ để tu bổ, xây dựng cho nền võ thuật Vovinam mỗi ngày một phong phú và tiến bộ.',
        '3. Huấn luyện môn sinh trên ba phương diện: Võ lực – Võ thuật – Tinh thần Võ đạo.'
      ],
      bulletPoints: [
        { label: 'Mục đích 1', text: 'Bảo tồn, chấn hưng và phát triển môn phái Vovinam do cố võ sư Nguyễn Lộc sáng tạo năm 1938.' },
        { label: 'Mục đích 2', text: 'Sưu tầm, nghiên cứu và phát sinh các thế võ để tu bổ, xây dựng nền võ thuật Vovinam.' },
        { label: 'Mục đích 3', text: 'Huấn luyện môn sinh trên 3 phương diện: Võ lực – Võ thuật – Tinh thần Võ đạo.' }
      ]
    },
    accuracyPercent: 85,
    readCount: 4,
    chunks: [
      'Môn phái Vovinam Việt võ đạo hoạt động có 3 mục đích chính.',
      'Mục đích 1: Bảo tồn, chấn hưng và phát triển môn phái Vovinam do cố võ sư Nguyễn Lộc sáng tạo năm 1938.',
      'Vovinam nêu cao tinh thần truyền thống bất khuất của dân tộc, khai thác trọn vẹn hai phần Cương và Nhu của con người, và phối hợp mọi tinh hoa võ thuật đã có trên thế giới.',
      'Mục đích 2: Sưu tầm, nghiên cứu và phát sinh các thế võ để tu bổ, xây dựng cho nền võ thuật Vovinam mỗi ngày một phong phú và tiến bộ.',
      'Mục đích 3: Huấn luyện môn sinh trên ba phương diện: Võ lực – Võ thuật – Tinh thần Võ đạo.'
    ],
    keyPoints: [
      'Khẳng định rõ: Môn phái Vovinam Việt võ đạo hoạt động có 3 mục đích',
      'Mục đích 1: Bảo tồn, chấn hưng và phát triển Vovinam do cố võ sư Nguyễn Lộc sáng tạo năm 1938',
      'Đặc điểm Vovinam: Nêu cao tinh thần bất khuất, khai thác trọn vẹn Cương - Nhu, phối hợp tinh hoa võ thuật thế giới',
      'Mục đích 2: Sưu tầm, nghiên cứu và phát sinh các thế võ tu bổ môn phái',
      'Mục đích 3: Huấn luyện môn sinh trên 3 phương diện: Võ lực – Võ thuật – Tinh thần Võ đạo'
    ],
    clozeData: [
      {
        prompt: 'Bảo tồn, chấn hưng và phát triển môn phái Vovinam do cố võ sư {0} sáng tạo năm {1}.',
        answers: ['Nguyễn Lộc', '1938'],
        distractors: ['Lê Sáng', '1945', 'Trần Huy']
      },
      {
        prompt: 'Huấn luyện môn sinh trên ba phương diện: {0} – {1} – {2}.',
        answers: ['Võ lực', 'Võ thuật', 'Tinh thần Võ đạo'],
        distractors: ['Võ công', 'Võ đức', 'Võ y']
      }
    ],
    commonMistakes: [
      'Quên tên cố võ sư Nguyễn Lộc và mốc năm 1938',
      'Quên 3 phương diện huấn luyện chuẩn xác: Võ lực – Võ thuật – Tinh thần Võ đạo'
    ]
  },
  {
    id: 3,
    number: 3,
    title: 'Danh dự võ sĩ là gì?',
    category: 'Đạo đức võ sinh',
    status: 'mastered',
    score: 2,
    dayAssigned: 2,
    keywords: 'danh dự võ sĩ tập thể tư tưởng hành động hiên ngang cao thượng bênh người yếu tự ái cá nhân',
    hintWords: 'Danh dự của tập thể người hiên ngang, cao thượng, bênh người yếu, vượt lên trên lòng tự ái cá nhân.',
    easyAnswer: {
      headlineQuote: '“Danh dự võ sĩ là danh dự của một tập thể người có tư tưởng và hành động hiên ngang, cao thượng, bênh người yếu bị kẻ mạnh hiếp đáp, đây là một thứ danh dự vượt lên trên lòng tự ái cá nhân để tự hòa mình vào nền võ đạo.”',
      coreMeaning: 'Là danh dự của tập thể người có tư tưởng và hành động hiên ngang, cao thượng, bênh người yếu bị kẻ mạnh hiếp đáp, vượt lên trên lòng tự ái cá nhân để tự hòa mình vào nền võ đạo.',
      mnemonic: 'Mẹo nhớ: Danh dự tập thể — Hiên ngang cao thượng — Bênh người yếu — Vượt tự ái cá nhân'
    },
    fullAnswer: {
      intro: 'Định nghĩa chuẩn xác danh dự võ sĩ:',
      paragraphs: [
        'Danh dự võ sĩ là danh dự của một tập thể người có tư tưởng và hành động hiên ngang, cao thượng, bênh người yếu bị kẻ mạnh hiếp đáp, đây là một thứ danh dự vượt lên trên lòng tự ái cá nhân để tự hòa mình vào nền võ đạo.'
      ]
    },
    accuracyPercent: 92,
    readCount: 3,
    chunks: [
      'Danh dự võ sĩ là danh dự của một tập thể người có tư tưởng và hành động hiên ngang, cao thượng.',
      'Bênh người yếu bị kẻ mạnh hiếp đáp.',
      'Đây là một thứ danh dự vượt lên trên lòng tự ái cá nhân để tự hòa mình vào nền võ đạo.'
    ],
    keyPoints: [
      'Danh dự của một tập thể người (không phải cá nhân đơn lẻ)',
      'Tư tưởng và hành động hiên ngang, cao thượng',
      'Hành động trượng nghĩa: Bênh người yếu bị kẻ mạnh hiếp đáp',
      'Vượt lên trên lòng tự ái cá nhân để tự hòa mình vào nền võ đạo'
    ],
    clozeData: [
      {
        prompt: 'Danh dự võ sĩ là danh dự của một {0} người có tư tưởng và hành động {1}, cao thượng.',
        answers: ['tập thể', 'hiên ngang'],
        distractors: ['cá nhân', 'dũng cảm', 'mạnh mẽ']
      },
      {
        prompt: 'Đây là một thứ danh dự vượt lên trên lòng {0} để tự hòa mình vào {1}.',
        answers: ['tự ái cá nhân', 'nền võ đạo'],
        distractors: ['tự trọng', 'môn phái', 'cuộc sống']
      }
    ],
    commonMistakes: [
      'Nói nhầm là danh dự của "cá nhân" thay vì "tập thể người"',
      'Quên vế: "bênh người yếu bị kẻ mạnh hiếp đáp" và "vượt lên trên lòng tự ái cá nhân"'
    ]
  },
  {
    id: 4,
    number: 4,
    title: 'Môn phái Vovinam Việt Võ Đạo để thực hiện 3 mục đích thì môn phái phải hoạt động theo 5 tôn chỉ, hãy trình bày những tôn chỉ đó?',
    category: 'Tôn chỉ môn phái',
    status: 'review',
    score: 0,
    dayAssigned: 2,
    keywords: 'tôn chỉ 5 tôn chỉ con người cứu cánh đạo hạnh phương châm kỹ thuật ý chí quật cường đại gia đình giáo dục thanh thiếu niên chính trị tôn giáo',
    hintWords: '5 Tôn chỉ: 1. Nền tảng (Con người - Đạo hạnh - Kỹ thuật & Ý chí); 2. Đại gia đình đoàn kết; 3. Giáo dục thanh thiếu niên; 4. Không chính trị/tôn giáo; 5. Tôn trọng võ phái khác.',
    easyAnswer: {
      headlineQuote: '“Năm tôn chỉ: 1. Con người - Đạo hạnh - Kỹ thuật & Ý chí quật cường; 2. Đại gia đình thương yêu kính trọng; 3. Giáo dục thanh thiếu niên; 4. Không chính trị và tôn giáo; 5. Tôn trọng các võ phái khác.”',
      coreMeaning: '1. Lấy CON NGƯỜI làm cứu cánh, ĐẠO HẠNH làm phương châm, KỸ THUẬT và Ý CHÍ QUẬT CƯỜNG làm phương tiện; 2. Là đại gia đình thương yêu kính trọng lẫn nhau, kỷ luật đoàn kết; 3. Tích cực góp phần giáo dục thanh thiếu niên; 4. Không có tính chất chính trị và tôn giáo; 5. Luôn luôn tôn trọng các võ phái khác.',
      mnemonic: 'Mẹo nhớ: 1. Con người & Đạo hạnh — 2. Đại gia đình — 3. Giáo dục thanh thiếu niên — 4. Phi chính trị tôn giáo — 5. Tôn trọng võ phái khác'
    },
    fullAnswer: {
      intro: 'Môn phái Vovinam Việt Võ Đạo hoạt động theo 5 tôn chỉ sau đây:',
      paragraphs: [
        '1. Mọi hoạt động của môn phái Vovinam đều dựa trên một nền tảng vững chắc: Lấy CON NGƯỜI làm cứu cánh, lấy ÐẠO HẠNH làm phương châm, lấy KỸ THUẬT và Ý CHÍ QUẬT CƯỜNG làm phương tiện.',
        '2. Môn phái Vovinam là một đại gia đình, trong đó môn đồ thương yêu kính trọng lẫn nhau. Sự kính trọng và lòng thương yêu ấy sẽ đan kết thành kỷ luật của môn phái, một rường mối vững chắc giúp các môn đồ đoàn kết chặt chẽ để nêu cao danh dự môn phái, phục vụ dân tộc và nhân loại.',
        '3. Môn phái Vovinam tích cực góp phần vào công cuộc giáo dục thanh thiếu niên.',
        '4. Hoạt động của môn phái không có tính chất chính trị và tôn giáo.',
        '5. Môn phái Vovinam luôn luôn tôn trọng các võ phái khác.'
      ]
    },
    accuracyPercent: 40,
    readCount: 6,
    chunks: [
      'Tôn chỉ 1: Mọi hoạt động đều dựa trên nền tảng: Lấy CON NGƯỜI làm cứu cánh, lấy ÐẠO HẠNH làm phương châm, lấy KỸ THUẬT và Ý CHÍ QUẬT CƯỜNG làm phương tiện.',
      'Tôn chỉ 2: Môn phái Vovinam là một đại gia đình, trong đó môn đồ thương yêu kính trọng lẫn nhau.',
      'Sự kính trọng và lòng thương yêu ấy đan kết thành kỷ luật, giúp các môn đồ đoàn kết chặt chẽ để nêu cao danh dự môn phái, phục vụ dân tộc và nhân loại.',
      'Tôn chỉ 3: Môn phái Vovinam tích cực góp phần vào công cuộc giáo dục thanh thiếu niên.',
      'Tôn chỉ 4: Hoạt động của môn phái không có tính chất chính trị và tôn giáo.',
      'Tôn chỉ 5: Môn phái Vovinam luôn luôn tôn trọng các võ phái khác.'
    ],
    keyPoints: [
      'Tôn chỉ 1: Con người (cứu cánh) – Đạo hạnh (phương châm) – Kỹ thuật và ý chí quật cường (phương tiện)',
      'Tôn chỉ 2: Vovinam là một đại gia đình, thương yêu kính trọng tạo thành kỷ luật đoàn kết',
      'Tôn chỉ 3: Tích cực góp phần vào công cuộc giáo dục thanh thiếu niên',
      'Tôn chỉ 4: Hoạt động không có tính chất chính trị và tôn giáo',
      'Tôn chỉ 5: Luôn luôn tôn trọng các võ phái khác'
    ],
    clozeData: [
      {
        prompt: 'Lấy {0} làm cứu cánh, lấy {1} làm phương châm, lấy {2} và {3} làm phương tiện.',
        answers: ['CON NGƯỜI', 'ÐẠO HẠNH', 'KỸ THUẬT', 'Ý CHÍ QUẬT CƯỜNG'],
        distractors: ['MÔN PHÁI', 'VÕ LỰC', 'TẬP THỂ', 'DANH DỰ']
      },
      {
        prompt: 'Hoạt động của môn phái không có tính chất {0} và {1}.',
        answers: ['chính trị', 'tôn giáo'],
        distractors: ['vụ lợi', 'bạo lực', 'kinh doanh']
      }
    ],
    commonMistakes: [
      'Rất hay nhầm bộ 3 của tôn chỉ 1: Cứu cánh (Con người), Phương châm (Đạo hạnh), Phương tiện (Kỹ thuật & Ý chí quật cường)',
      'Quên tôn chỉ 4 (không chính trị/tôn giáo) và tôn chỉ 5 (tôn trọng các võ phái khác)'
    ]
  },
  {
    id: 5,
    number: 5,
    title: 'Quan niệm về sống trong sạch của Việt Võ Đạo Sinh ra sao?',
    category: 'Võ đạo ứng dụng',
    status: 'unlearned',
    score: 0,
    dayAssigned: 3,
    keywords: 'quan niệm sống trong sạch tu dưỡng đạo đức không tiêu cực bưng tai bịt mắt lắng nghe nhìn thẳng sự thật',
    hintWords: 'Giữ gìn tu dưỡng đạo đức bản thân, không bưng tai bịt mắt trước cái xấu, lắng nghe nhìn thẳng sự thật để giải quyết cải tạo.',
    easyAnswer: {
      headlineQuote: '“Sống trong sạch của Việt Võ Đạo Sinh là giữ gìn, tu dưỡng đạo đức bản thân mình cho trong sạch, nhưng không tiêu cực, bưng tai bịt mắt trước cái xấu xa của xã hội, mà phải lắng nghe, nhìn thẳng vào sự thật của cuộc sống để hiểu, giải quyết và cải tạo nó theo hướng tốt đẹp.”',
      coreMeaning: 'Giữ gìn tu dưỡng đạo đức bản thân trong sạch, không tiêu cực bưng tai bịt mắt trước cái xấu xa, mà phải lắng nghe, nhìn thẳng vào sự thật để hiểu, giải quyết và cải tạo theo hướng tốt đẹp.',
      mnemonic: 'Mẹo nhớ: Tu dưỡng trong sạch — Không bưng tai bịt mắt — Nhìn thẳng sự thật — Cải tạo tốt đẹp'
    },
    fullAnswer: {
      intro: 'Quan niệm sống trong sạch của môn sinh Việt Võ Đạo:',
      paragraphs: [
        'Sống trong sạch của Việt Võ Đạo Sinh là giữ gìn, tu dưỡng đạo đức bản thân mình cho trong sạch, nhưng không tiêu cực, bưng tai bịt mắt trước cái xấu xa của xã hội, mà phải lắng nghe, nhìn thẳng vào sự thật của cuộc sống để hiểu, giải quyết và cải tạo nó theo hướng tốt đẹp.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      'Sống trong sạch của Việt Võ Đạo Sinh là giữ gìn, tu dưỡng đạo đức bản thân mình cho trong sạch.',
      'Nhưng không tiêu cực, bưng tai bịt mắt trước cái xấu xa của xã hội.',
      'Mà phải lắng nghe, nhìn thẳng vào sự thật của cuộc sống để hiểu, giải quyết và cải tạo nó theo hướng tốt đẹp.'
    ],
    keyPoints: [
      'Vế 1: Giữ gìn, tu dưỡng đạo đức bản thân mình cho trong sạch',
      'Vế 2: Không tiêu cực, bưng tai bịt mắt trước cái xấu xa của xã hội',
      'Vế 3: Lắng nghe, nhìn thẳng vào sự thật của cuộc sống',
      'Vế 4: Hiểu, giải quyết và cải tạo nó theo hướng tốt đẹp'
    ],
    clozeData: [
      {
        prompt: 'Giữ gìn, tu dưỡng đạo đức bản thân mình cho trong sạch, nhưng không tiêu cực, {0} trước cái xấu xa của xã hội.',
        answers: ['bưng tai bịt mắt'],
        distractors: ['làm ngơ', 'chùn bước', 'né tránh']
      },
      {
        prompt: 'Lắng nghe, nhìn thẳng vào sự thật của cuộc sống để {0}, {1} và {2} nó theo hướng tốt đẹp.',
        answers: ['hiểu', 'giải quyết', 'cải tạo'],
        distractors: ['phân tích', 'đấu tranh', 'thay đổi']
      }
    ],
    commonMistakes: [
      'Chỉ nói đến việc "giữ mình trong sạch" mà quên vế quan trọng: "không tiêu cực bưng tai bịt mắt" và "cải tạo xã hội theo hướng tốt đẹp"'
    ]
  },
  {
    id: 6,
    number: 6,
    title: 'Hãy trình bày Điều tâm niệm thứ 6 của môn sinh Vovinam?',
    category: '10 Điều tâm niệm',
    status: 'learning',
    score: 1,
    dayAssigned: 3,
    keywords: 'điều tâm niệm số 6 chuyên cần học tập rèn luyện tinh thần trau dồi đạo hạnh 5 điều 5 đức tính',
    hintWords: 'Điều 6: Chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh (5 điều học tập + 5 đức tính rèn luyện).',
    easyAnswer: {
      headlineQuote: '“Điều tâm niệm số 6: Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.”',
      coreMeaning: 'Học tập 5 điều cơ bản (học rộng, hỏi kỹ, nghĩ cẩn thận, luận sáng, làm hết sức). Rèn luyện 5 đức tính (sống khỏe, đức độ, cương trực, trầm tĩnh, tháo vát). Trau dồi đạo hạnh (phối hợp, khắc chế, điều hòa, bao dung Cương - Nhu).',
      mnemonic: 'Mẹo nhớ: 5 Điều học (Rộng - Kỹ - Cẩn thận - Sáng - Hết sức) & 5 Đức tính (Khỏe - Đức - Cương - Trầm - Tháo vát)'
    },
    fullAnswer: {
      intro: 'Nội dung và ý nghĩa Điều tâm niệm thứ 6:',
      quote: '“Điều tâm niệm số 6: Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.”',
      paragraphs: [
        'Ý nghĩa và giải thích:\nĐiều số 6 nhắc đến ý hướng học tập và đời sống tinh thần của võ sinh.\nKhông chỉ học đúng với những gì được dạy, Việt Võ Đạo sinh cần sẵn sàng nêu cao tinh thần ham học hỏi, trau dồi kiến thức và kĩ năng, đạo đức của mình. Sẵn sàng chủ động tìm hiểu mọi điều trong cuộc sống. Nắm rõ vấn đề, suy nghĩ kỹ càng và cố gắng hết sức mình. Thể chất và tinh thần luôn khỏe mạnh, dũng cảm đưa ra những ý kiến, quan điểm đúng đắn.',
        'Chuyên cần học tập ở đây gồm 5 điều cơ bản: học cho rộng, hỏi cho kỹ, nghĩ cẩn thận, luận cho sáng và làm hết sức mình. Đồng thời, võ sinh cũng phải phát triển và rèn luyện 5 đức tính: sống khỏe, đức độ, cương trực, trầm tĩnh và tháo vát.',
        'Đạo hạnh được hiểu chính là phẩm hạnh Việt Võ Đạo. Phối hợp, khắc chế, điều hòa, bao dung, những tính mềm (nhu), cứng (cương), tĩnh, động, tối, sáng của tạo vật, chính là những phẩm hạnh căn bản mà một Việt Võ Ðạo Sinh phải luôn luôn trau dồi để làm tròn sứ mệnh võ đạo của mình.'
      ]
    },
    accuracyPercent: 70,
    readCount: 3,
    chunks: [
      'Điều tâm niệm số 6: Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.',
      'Ý nghĩa: Nhắc đến ý hướng học tập và đời sống tinh thần của võ sinh; chủ động học hỏi kiến thức, kĩ năng, đạo đức, suy nghĩ kỹ càng và dũng cảm đưa ra quan điểm đúng đắn.',
      'Chuyên cần học tập gồm 5 điều cơ bản: học cho rộng, hỏi cho kỹ, nghĩ cẩn thận, luận cho sáng và làm hết sức mình.',
      'Rèn luyện 5 đức tính: sống khỏe, đức độ, cương trực, trầm tĩnh và tháo vát.',
      'Đạo hạnh: Là phẩm hạnh Việt Võ Đạo; phối hợp, khắc chế, điều hòa, bao dung những tính mềm, cứng, tĩnh, động, tối, sáng của tạo vật để làm tròn sứ mệnh võ đạo.'
    ],
    keyPoints: [
      'Đọc chính xác câu niệm: “Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.”',
      '5 điều học tập cơ bản: học cho rộng, hỏi cho kỹ, nghĩ cẩn thận, luận cho sáng, làm hết sức mình',
      '5 đức tính cần rèn luyện: sống khỏe, đức độ, cương trực, trầm tĩnh, tháo vát',
      'Ý nghĩa đạo hạnh: Phẩm hạnh Việt Võ Đạo (phối hợp, khắc chế, điều hòa, bao dung Cương - Nhu, Tĩnh - Động, Tối - Sáng)'
    ],
    clozeData: [
      {
        prompt: '5 điều cơ bản trong học tập: học cho {0}, hỏi cho {1}, nghĩ {2}, luận cho {3} và làm {4}.',
        answers: ['rộng', 'kỹ', 'cẩn thận', 'sáng', 'hết sức mình'],
        distractors: ['sâu', 'nhanh', 'thấu đáo', 'rõ']
      },
      {
        prompt: '5 đức tính cần rèn luyện: sống {0}, {1}, {2}, {3} và {4}.',
        answers: ['khỏe', 'đức độ', 'cương trực', 'trầm tĩnh', 'tháo vát'],
        distractors: ['mạnh', 'khiêm tốn', 'kiên trì', 'dũng cảm']
      }
    ],
    commonMistakes: [
      'Quên liệt kê 5 điều học tập (rộng, kỹ, cẩn thận, sáng, hết sức) hoặc 5 đức tính (khỏe, đức độ, cương trực, trầm tĩnh, tháo vát)'
    ]
  },
  {
    id: 7,
    number: 7,
    title: 'Hãy trình bày Điều tâm niệm thứ 7 của môn sinh Vovinam?',
    category: '10 Điều tâm niệm',
    status: 'mastered',
    score: 2,
    dayAssigned: 4,
    keywords: 'điều tâm niệm số 7 sống trong sạch giản dị trung thực cao thượng 4 đức tính',
    hintWords: 'Điều 7: Sống trong sạch, giản dị, trung thực và cao thượng (Giải thích chi tiết 4 đức tính).',
    easyAnswer: {
      headlineQuote: '“Điều tâm niệm số 7: Việt Võ Đạo Sinh Sống trong sạch, giản dị, trung thực và cao thượng.”',
      coreMeaning: 'Trong sạch: Làm đúng lẽ phải, lương tâm, ngăn chặn tội lỗi xấu xa. Giản dị: Hài lòng hoàn cảnh kinh tế, không hạch sách đua đòi. Trung thực: Sống chân thật, không dối trá. Cao thượng: Không chấp nhặt tầm thường nhỏ nhen, hành xử đúng đắn.',
      mnemonic: 'Mẹo nhớ: Trong sạch (lương tâm) — Giản dị (không đua đòi) — Trung thực (không dối trá) — Cao thượng (không nhỏ nhen)'
    },
    fullAnswer: {
      intro: 'Nội dung và ý nghĩa Điều tâm niệm thứ 7:',
      quote: '“- Điều tâm niệm số 7: Việt Võ Đạo Sinh Sống trong sạch, giản dị, trung thực và cao thượng.”',
      paragraphs: [
        'Ý nghĩa và giải thích:\nTrong sạch, giản dị, trung thực và cao thượng là 4 đức tính cần thiết không chỉ võ sinh cần có mà còn rất phù hợp với thực tế đời sống hàng ngày.',
        '• Trong sạch: Chính là làm những việc đúng với lẽ phải và lương tâm. Biết lắng nghe, nhìn thẳng vào sự thật và hướng tới điều tốt đẹp trong cuộc sống. Đó còn là hành động biết ngăn chặn, không để cho những điều tội lỗi, xấu xa có cơ hội phát triển.',
        '• Sống giản dị: Là phải biết hài lòng với hoàn cảnh kinh tế của bản thân, không được hạch sách hay đua đòi những thứ khó có được.',
        '• Trung thực: Việt Võ Đạo sinh phải biết sống trung thực với tất cả mọi người, không sống dối trá.',
        '• Phẩm chất cao thượng: Chính là không chấp nhặt những thứ tầm thường, nhỏ nhen và hành xử đúng đắn. Nó phải được nuôi dưỡng từng ngày và thường được ứng dụng trong trường hợp đặc biệt.'
      ]
    },
    accuracyPercent: 98,
    readCount: 4,
    chunks: [
      'Điều tâm niệm số 7: Việt Võ Đạo Sinh Sống trong sạch, giản dị, trung thực và cao thượng.',
      'Trong sạch: Làm những việc đúng với lẽ phải và lương tâm; biết lắng nghe, nhìn thẳng vào sự thật, ngăn chặn điều tội lỗi xấu xa.',
      'Giản dị: Hài lòng với hoàn cảnh kinh tế bản thân, không hạch sách đua đòi những thứ khó có được.',
      'Trung thực: Biết sống trung thực với tất cả mọi người, không sống dối trá.',
      'Cao thượng: Không chấp nhặt những thứ tầm thường, nhỏ nhen và hành xử đúng đắn; được nuôi dưỡng từng ngày.'
    ],
    keyPoints: [
      'Đọc chính xác: “Việt Võ Đạo Sinh Sống trong sạch, giản dị, trung thực và cao thượng.”',
      'Đức tính 1: Trong sạch (đúng lẽ phải, lương tâm, ngăn chặn điều tội lỗi xấu xa)',
      'Đức tính 2: Giản dị (hài lòng hoàn cảnh kinh tế, không đua đòi hạch sách)',
      'Đức tính 3: Trung thực (sống thật với mọi người, không dối trá)',
      'Đức tính 4: Cao thượng (không chấp nhặt tầm thường nhỏ nhen, hành xử đúng đắn)'
    ],
    clozeData: [
      {
        prompt: 'Sống giản dị là phải biết hài lòng với hoàn cảnh {0} của bản thân, không được {1} hay {2} những thứ khó có được.',
        answers: ['kinh tế', 'hạch sách', 'đua đòi'],
        distractors: ['gia đình', 'đòi hỏi', 'phung phí']
      },
      {
        prompt: 'Cao thượng chính là không {0} những thứ tầm thường, nhỏ nhen và {1} đúng đắn.',
        answers: ['chấp nhặt', 'hành xử'],
        distractors: ['tính toán', 'đối xử', 'bận tâm']
      }
    ],
    commonMistakes: [
      'Quên phân tích cụ thể 4 đức tính, đặc biệt là định nghĩa Giản dị (hoàn cảnh kinh tế, không đua đòi) và Cao thượng (không chấp nhặt nhỏ nhen)'
    ]
  },
  {
    id: 8,
    number: 8,
    title: 'Hãy trình bày Điều tâm niệm thứ 8 của môn sinh Vovinam?',
    category: '10 Điều tâm niệm',
    status: 'unlearned',
    score: 0,
    dayAssigned: 4,
    keywords: 'điều tâm niệm số 8 kiện toàn ý chí đanh thép nỗ lực tự thân cầu tiến kiên định dứt khoát không phụ thuộc',
    hintWords: 'Điều 8: Kiện toàn một ý chí đanh thép, nỗ lực tự thân cầu tiến (Cân nhắc kỹ, dứt khoát thực hiện, tự thân vận động).',
    easyAnswer: {
      headlineQuote: '“Điều tâm niệm số 8: Việt Võ Đạo Sinh kiện toàn một ý chí đanh thép, nỗ lực tự thân cầu tiến.”',
      coreMeaning: 'Nói về ý chí của võ sinh: Cân nhắc kỹ khi quyết định, kiên định dứt khoát tin tưởng khả năng bản thân, không bị kẻ phá hoại lung lay; bắt tay thực hiện ngay với ý chí đanh thép, tự thân vận động không phụ thuộc ai.',
      mnemonic: 'Mẹo nhớ: Ý chí đanh thép — Quyết định chín chắn — Làm ngay nghiêm túc — Tự thân không phụ thuộc'
    },
    fullAnswer: {
      intro: 'Nội dung và ý nghĩa Điều tâm niệm thứ 8:',
      quote: '“- Điều tâm niệm số 8: Việt Võ Đạo Sinh kiện toàn một ý chí đanh thép, nỗ lực tự thân cầu tiến.”',
      paragraphs: [
        'Ý nghĩa và giải thích:\nĐiều tâm niệm số 8 nói về ý chí của Việt Võ Đạo Sinh.',
        'Khi đưa ra quyết định cần cân nhắc và nghiên cứu kỹ vấn đề, sự việc. Kiên định, dứt khoát và tin tưởng vào chính khả năng của mình, không bị lung lay bởi những kẻ phá hoại.',
        'Đưa ra quyết định chín chắn phải bắt tay vào thực hiện ngay với thái độ nghiêm túc, ý chí vững mạnh và đanh thép. Tự thân vận động mà không cần phụ thuộc vào bất cứ ai.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      'Điều tâm niệm số 8: Việt Võ Đạo Sinh kiện toàn một ý chí đanh thép, nỗ lực tự thân cầu tiến.',
      'Ý nghĩa: Nói về ý chí của Việt Võ Đạo Sinh khi đưa ra quyết định.',
      'Cần cân nhắc nghiên cứu kỹ sự việc; kiên định, dứt khoát, tin vào khả năng mình, không bị lung lay bởi kẻ phá hoại.',
      'Khi quyết định chín chắn phải bắt tay vào thực hiện ngay với thái độ nghiêm túc, ý chí vững mạnh đanh thép.',
      'Tự thân vận động mà không cần phụ thuộc vào bất cứ ai.'
    ],
    keyPoints: [
      'Đọc chính xác: “Việt Võ Đạo Sinh kiện toàn một ý chí đanh thép, nỗ lực tự thân cầu tiến.”',
      'Ý 1: Cân nhắc và nghiên cứu kỹ vấn đề trước khi quyết định',
      'Ý 2: Kiên định, dứt khoát, tin vào năng lực mình, không bị lung lay bởi kẻ phá hoại',
      'Ý 3: Quyết định rồi phải bắt tay làm ngay với thái độ nghiêm túc, ý chí đanh thép',
      'Ý 4: Tự thân vận động mà không cần phụ thuộc vào bất cứ ai'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh kiện toàn một ý chí {0}, nỗ lực {1} cầu tiến.',
        answers: ['đanh thép', 'tự thân'],
        distractors: ['sắt đá', 'bản thân', 'vững mạnh']
      },
      {
        prompt: 'Bắt tay vào thực hiện ngay với thái độ nghiêm túc... {0} vận động mà không cần {1} vào bất cứ ai.',
        answers: ['Tự thân', 'phụ thuộc'],
        distractors: ['Bản thân', 'trông chờ', 'dựa dẫm']
      }
    ],
    commonMistakes: [
      'Nhầm câu niệm thành "rèn luyện ý chí..." (chính xác là: KIỆN TOÀN một ý chí đanh thép, nỗ lực tự thân cầu tiến)',
      'Quên vế "tự thân vận động không phụ thuộc vào bất cứ ai"'
    ]
  },
  {
    id: 9,
    number: 9,
    title: 'Hãy trình bày Điều tâm niệm thứ 9 của môn sinh Vovinam?',
    category: '10 Điều tâm niệm',
    status: 'unlearned',
    score: 0,
    dayAssigned: 5,
    keywords: 'điều tâm niệm số 9 sáng suốt nhận định bền gan tranh đấu tháo vát hành động khách quan tận mắt chứng kiến không khuất phục',
    hintWords: 'Điều 9: Sáng suốt nhận định, bền gan tranh đấu, tháo vát hành động (Đánh giá khách quan, không nản lòng, chủ động thích ứng).',
    easyAnswer: {
      headlineQuote: '“Điều tâm niệm số 9: Việt Võ Đạo Sinh sáng suốt nhận định, bền gan tranh đấu, tháo vát hành động.”',
      coreMeaning: 'Sáng suốt nhận định: Đánh giá khách quan, hợp lý, tận mắt chứng kiến không nghe lời đồn. Bền gan tranh đấu: Vượt thử thách, thất bại không nản lòng, không khuất phục cường quyền. Tháo vát hành động: Luôn chủ động, thích ứng nhanh, tính toán kế hoạch dự trù tình huống xấu.',
      mnemonic: 'Mẹo nhớ: Sáng suốt nhận định (khách quan) — Bền gan tranh đấu (không nản) — Tháo vát hành động (chủ động tính toán)'
    },
    fullAnswer: {
      intro: 'Nội dung và ý nghĩa Điều tâm niệm thứ 9:',
      quote: '“- Điều tâm niệm số 9: Việt Võ Đạo Sinh sáng suốt nhận định, bền gan tranh đấu, tháo vát hành động.”',
      paragraphs: [
        'Ý nghĩa và giải thích:\n• Sáng suốt nhận định: Việt Võ Đạo Sinh cần sáng suốt đưa ra cho mình đánh giá khách quan, hợp lý trên mọi khía cạnh. Cần có đủ lý trí để giải tỏa được khúc mắc, phân biệt cái gì nên làm và cái nào không. Bản thân phải tận mắt chứng kiến sự việc chứ không được lung lay khi nghe qua lời nói của người khác.',
        '• Bền gan tranh đấu: Là ý chí chịu đựng, vượt qua thử thách. Gặp thất bại sẽ không nản lòng, không chịu khuất phục trước cường quyền và tìm được biện pháp giải quyết đúng đắn.',
        '• Tháo vát hành động: Có nghĩa rằng người võ sinh phải luôn chủ động hành động và biết thích ứng nhanh chóng với mọi hoàn cảnh. Khi làm bất cứ việc gì, cần tính toán kỹ càng và có kế hoạch cụ thể, dự trù cả những tình huống xấu không mong muốn.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      'Điều tâm niệm số 9: Việt Võ Đạo Sinh sáng suốt nhận định, bền gan tranh đấu, tháo vát hành động.',
      'Sáng suốt nhận định: Đánh giá khách quan, hợp lý; có đủ lý trí phân biệt nên làm và không nên làm; tận mắt chứng kiến sự việc chứ không lung lay theo lời nói người khác.',
      'Bền gan tranh đấu: Ý chí chịu đựng, vượt qua thử thách; thất bại không nản lòng, không khuất phục trước cường quyền, tìm biện pháp giải quyết đúng đắn.',
      'Tháo vát hành động: Luôn chủ động hành động và thích ứng nhanh chóng với mọi hoàn cảnh; tính toán kỹ càng, có kế hoạch cụ thể và dự trù tình huống xấu.'
    ],
    keyPoints: [
      'Đọc chính xác: “Việt Võ Đạo Sinh sáng suốt nhận định, bền gan tranh đấu, tháo vát hành động.”',
      'Vế 1: Sáng suốt nhận định (đánh giá khách quan, tận mắt chứng kiến, không lung lay theo lời đồn)',
      'Vế 2: Bền gan tranh đấu (thất bại không nản, không khuất phục cường quyền, tìm giải pháp đúng)',
      'Vế 3: Tháo vát hành động (chủ động, thích ứng nhanh, có kế hoạch dự trù tình huống xấu)'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh sáng suốt {0}, bền gan {1}, tháo vát {2}.',
        answers: ['nhận định', 'tranh đấu', 'hành động'],
        distractors: ['suy nghĩ', 'hành động', 'ứng biến']
      },
      {
        prompt: 'Bền gan tranh đấu là ý chí chịu đựng... gặp thất bại không nản lòng, không chịu khuất phục trước {0}.',
        answers: ['cường quyền'],
        distractors: ['khó khăn', 'thất bại', 'kẻ thù']
      }
    ],
    commonMistakes: [
      'Nhầm "bền gan tranh đấu" thành "bền gan hành động"',
      'Nhầm "tháo vát hành động" thành "tháo vát ứng biến"'
    ]
  },
  {
    id: 10,
    number: 10,
    title: 'Hãy trình bày Điều tâm niệm thứ 10 của môn sinh Vovinam?',
    category: '10 Điều tâm niệm',
    status: 'unlearned',
    score: 0,
    dayAssigned: 5,
    keywords: 'điều tâm niệm số 10 tự tín tự thắng khiêm cung độ lượng luôn luôn kiểm điểm để tiến bộ đức sống',
    hintWords: 'Điều 10: Tự tín, tự thắng, khiêm cung, độ lượng, luôn luôn kiểm điểm để tiến bộ (Tự tin, thắng nhược điểm, khiêm nhường người trên, rộng lượng người dưới).',
    easyAnswer: {
      headlineQuote: '“Điều tâm niệm số 10: Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, độ lượng, luôn luôn kiểm điểm để tiến bộ.”',
      coreMeaning: 'Tập trung vào đức sống và không ngừng tiến bộ: Tự tin năng lực, chiến thắng loại bỏ nhược điểm bản thân; Khiêm cung với người trên, độ lượng với người dưới; Luôn luôn kiểm điểm lỗi lầm rút bài học để ngày càng tiến bộ.',
      mnemonic: 'Mẹo nhớ: Tự tín (tự tin) — Tự thắng (bỏ nhược điểm) — Khiêm cung (với người trên) — Độ lượng (với người dưới) — Kiểm điểm tiến bộ'
    },
    fullAnswer: {
      intro: 'Nội dung và ý nghĩa Điều tâm niệm thứ 10:',
      quote: '“- Điều tâm niệm số 10: Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, độ lượng, luôn luôn kiểm điểm để tiến bộ.”',
      paragraphs: [
        'Ý nghĩa và giải thích:\nViệt Võ Đạo Sinh cần phải tập trung vào đức sống và không ngừng tiến bộ, người học võ phải tự tin vào năng lực và có những ưu điểm tốt đẹp mà mình có. Đồng thời, Việt Võ Đạo Sinh cần phải chiến thắng và loại bỏ những nhược điểm của bản thân mình.',
        'Về đức sống, đối với người khác thì cần phải khiêm cung và độ lượng tức là khiêm nhường, cung kính với người trên, hay người cao tuổi hơn mình, và đức độ, rộng lượng với người dưới, hay người nhỏ tuổi hơn mình từ đó được nhiều người cảm mến và trở lên gần gũi, thân mật với mọi người.',
        'Ngoài ra, võ sinh phải biết kiểm điểm những lỗi lầm và rút ra những bài học và động viên bản thân ngày càng tiến bộ hơn.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      'Điều tâm niệm số 10: Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, độ lượng, luôn luôn kiểm điểm để tiến bộ.',
      'Tự tín & Tự thắng: Tự tin vào năng lực và ưu điểm bản thân; chiến thắng và loại bỏ những nhược điểm của chính mình.',
      'Khiêm cung & Độ lượng: Khiêm nhường, cung kính với người trên hoặc cao tuổi hơn; đức độ, rộng lượng với người dưới hoặc nhỏ tuổi hơn để được cảm mến, gần gũi.',
      'Kiểm điểm để tiến bộ: Luôn biết kiểm điểm những lỗi lầm, rút ra bài học và động viên bản thân ngày càng tiến bộ hơn.'
    ],
    keyPoints: [
      'Đọc chính xác: “Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, độ lượng, luôn luôn kiểm điểm để tiến bộ.”',
      'Tự tín: Tự tin vào năng lực và các ưu điểm của bản thân',
      'Tự thắng: Chiến thắng và loại bỏ những nhược điểm của bản thân mình',
      'Khiêm cung: Khiêm nhường, cung kính với người trên, người cao tuổi',
      'Độ lượng: Đức độ, rộng lượng với người dưới, người nhỏ tuổi',
      'Luôn luôn kiểm điểm: Kiểm điểm lỗi lầm, rút bài học để không ngừng tiến bộ'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh {0}, {1}, {2}, {3}, luôn luôn {4} để tiến bộ.',
        answers: ['tự tín', 'tự thắng', 'khiêm cung', 'độ lượng', 'kiểm điểm'],
        distractors: ['tự tin', 'vị tha', 'khiêm tốn', 'tu dưỡng', 'học hỏi']
      },
      {
        prompt: 'Khiêm cung tức là khiêm nhường, cung kính với {0}... độ lượng tức là rộng lượng với {1}.',
        answers: ['người trên', 'người dưới'],
        distractors: ['mọi người', 'bạn bè', 'thầy cô']
      }
    ],
    commonMistakes: [
      'Nhầm từ "độ lượng" thành "vị tha"',
      'Quên giải thích cặp từ: Khiêm cung (đối với người trên) và Độ lượng (đối với người dưới)'
    ]
  }
];

export interface DayPlan {
  day: number;
  label: string;
  focus: string;
  description: string;
  assignedQuestionIds: number[];
  isCompleted: boolean;
  isToday: boolean;
  isExamDay?: boolean;
}

export const TEN_DAY_PLAN: DayPlan[] = [
  {
    day: 1,
    label: 'Ngày 1: Câu 1–2',
    focus: 'Phù hiệu Vovinam & 3 Mục đích môn phái',
    description: 'Nền tảng triết lý võ đạo căn bản',
    assignedQuestionIds: [1, 2],
    isCompleted: true,
    isToday: false
  },
  {
    day: 2,
    label: 'Ngày 2: Câu 3–4',
    focus: 'Danh dự võ sĩ & 5 Tôn chỉ môn phái',
    description: 'Đạo đức và tôn chỉ hành đạo',
    assignedQuestionIds: [3, 4],
    isCompleted: true,
    isToday: false
  },
  {
    day: 3,
    label: 'Ngày 3: Câu 5–6',
    focus: 'Sống trong sạch & Điều tâm niệm số 6',
    description: 'Đạo hạnh và phương pháp học tập 5 điều',
    assignedQuestionIds: [5, 6],
    isCompleted: false,
    isToday: true
  },
  {
    day: 4,
    label: 'Ngày 4: Câu 7–8',
    focus: 'Điều tâm niệm số 7 & số 8',
    description: '4 Đức tính nếp sống & Ý chí đanh thép',
    assignedQuestionIds: [7, 8],
    isCompleted: false,
    isToday: false
  },
  {
    day: 5,
    label: 'Ngày 5: Câu 9–10',
    focus: 'Điều tâm niệm số 9 & số 10',
    description: 'Nhận định tháo vát & Đỉnh cao đức sống',
    assignedQuestionIds: [9, 10],
    isCompleted: false,
    isToday: false
  },
  {
    day: 6,
    label: 'Ngày 6: Ôn sâu Câu 1–5',
    focus: 'Rà soát phản xạ nhớ nửa đầu',
    description: 'Củng cố vững chắc 5 câu lý thuyết trọng tâm',
    assignedQuestionIds: [1, 2, 3, 4, 5],
    isCompleted: false,
    isToday: false
  },
  {
    day: 7,
    label: 'Ngày 7: Ôn sâu Câu 6–10',
    focus: 'Tâm niệm và phần phân tích chi tiết',
    description: 'Củng cố vững chắc 5 điều tâm niệm nửa sau',
    assignedQuestionIds: [6, 7, 8, 9, 10],
    isCompleted: false,
    isToday: false
  },
  {
    day: 8,
    label: 'Ngày 8: Đảo ngẫu nhiên 10 câu',
    focus: 'Luyện phản xạ chống học vẹt',
    description: 'Bốc thăm câu hỏi ngẫu nhiên tăng độ nhạy',
    assignedQuestionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isCompleted: false,
    isToday: false
  },
  {
    day: 9,
    label: 'Ngày 9: Thi thử vấn đáp',
    focus: 'Mô phỏng áp lực phòng thi (10 câu)',
    description: 'Bấm giờ thực tế 15 phút, tính điểm chuẩn sát hạch',
    assignedQuestionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isCompleted: false,
    isToday: false
  },
  {
    day: 10,
    label: 'Ngày 10: NGÀY THI THẬT',
    focus: 'Ôn siêu tốc 5 phút trước khi lên thảm',
    description: 'Tự tin, định tâm, bình tĩnh vấn đáp xuất sắc',
    assignedQuestionIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    isCompleted: false,
    isToday: false,
    isExamDay: true
  }
];
