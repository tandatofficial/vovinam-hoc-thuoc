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

  // New features data
  chunks?: string[];              // Tính năng 1: Học từng đoạn
  clozeData?: ClozeItem[];        // Tính năng 2: Điền từ còn thiếu
  keyPoints?: string[];           // Tính năng 3: Checklist ý chính
  commonMistakes?: string[];      // Tính năng 4: Lỗi hay quên / sai
  userNote?: string;              // Sổ tay ghi chú cá nhân
  isBookmarked?: boolean;         // Ghim sổ tay lỗi sai
}

export const INITIAL_QUESTIONS: QuestionData[] = [
  {
    id: 1,
    number: 1,
    title: 'Ý nghĩa phù hiệu của Vovinam Việt Võ Đạo?',
    category: 'Lý thuyết võ đạo',
    status: 'mastered',
    score: 2,
    dayAssigned: 1,
    keywords: 'phù hiệu màu sắc hình nét âm dương đạo thể xanh vàng đỏ trắng vuông tròn',
    hintWords: '4 màu sắc (Xanh, Vàng, Đỏ, Trắng) và 3 nét hình thể (khung vuông tròn, vòng âm dương chữ S, vòng tròn trắng).',
    easyAnswer: {
      headlineQuote: '“Phù hiệu Vovinam kết hợp hài hòa giữa 4 màu sắc và 3 nét hình khối tượng trưng cho võ đạo dân tộc.”',
      coreMeaning: '4 Màu sắc: Xanh (Biển cả, hy vọng), Vàng (Đất mẹ, vinh quang), Đỏ (Lửa, huyết lệ oai hùng), Trắng (Đạo thể tinh khiết). 3 Nét hình: Nửa vuông nửa tròn (Cương nhu phối triển), Âm Dương chữ S (Bản sắc Việt Nam), Vòng tròn trắng (Đạo thể bao la).',
      mnemonic: 'Mẹo nhớ: 4 Màu (Xanh - Vàng - Đỏ - Trắng) & 3 Nét (Vuông tròn - Âm Dương - Đạo thể)'
    },
    fullAnswer: {
      intro: 'Phù hiệu Vovinam Việt Võ Đạo gồm 4 màu sắc và 3 nét hình thể mang ý nghĩa triết lý sâu sắc:',
      paragraphs: [
        'Ý nghĩa 4 màu sắc: Xanh lam tượng trưng cho màu hy vọng và biển cả, biểu trưng cho ý chí kiên định và đức tính bao dung rộng mở. Vàng là màu da người châu Á, biểu trưng cho sắc tộc và vinh dự võ học dân tộc. Đỏ là màu máu, lửa nhiệt huyết, lòng dũng cảm kiên cường bất khuất. Trắng là màu tinh khiết, thanh cao, tiêu biểu cho đức hạnh và tinh hoa võ đạo.',
        'Ý nghĩa 3 nét hình thể: Nền nửa vuông nửa tròn biểu thị nguyên lý Cương Nhu phối triển. Vòng tròn Âm Dương chữ S chia thành hai nửa phân định bản sắc Việt Nam và sự chuyển hóa không ngừng. Vòng tròn trắng viền ngoài biểu trưng cho Đạo thể bao la quy về sự thanh tịnh vô cùng.'
      ],
      bulletPoints: [
        { label: 'Xanh lam', text: 'Màu hy vọng và biển cả, ý chí kiên định, bao dung rộng mở.', color: 'bg-primary' },
        { label: 'Vàng', text: 'Màu sắc tộc Việt và đất mẹ, vinh dự võ học dân tộc.', color: 'bg-secondary' },
        { label: 'Đỏ', text: 'Màu nhiệt huyết, lòng quả cảm và tinh thần đấu tranh bất khuất.', color: 'bg-score-forgot' },
        { label: 'Trắng', text: 'Màu tinh khiết, thanh cao, đức hạnh tối thượng quy về Đạo thể.', color: 'bg-outline-variant' }
      ]
    },
    visualDetails: {
      fourColors: [
        { name: 'Xanh', colorClass: 'bg-primary', meaning: 'Biển cả, Hy vọng & Ý chí kiên định' },
        { name: 'Vàng', colorClass: 'bg-secondary', meaning: 'Đất mẹ, Vinh quang & Sắc tộc Việt' },
        { name: 'Đỏ', colorClass: 'bg-score-forgot', meaning: 'Lửa nhiệt huyết & Huyết lệ oai hùng' },
        { name: 'Trắng', colorClass: 'bg-surface-card border border-outline', meaning: 'Tinh khiết, Đạo thể thanh tịnh' }
      ],
      threeShapes: [
        { name: 'Nền nửa vuông nửa tròn', meaning: 'Cương nhu phối triển, vuông tròn trọn vẹn.' },
        { name: 'Vòng tròn Âm Dương chữ S', meaning: 'Bản sắc Việt Nam, sinh hóa không ngừng.' },
        { name: 'Vòng tròn trắng viền ngoài', meaning: 'Đạo thể bao la, quy về sự thanh tịnh.' }
      ]
    },
    accuracyPercent: 95,
    readCount: 5,
    chunks: [
      'Phù hiệu Vovinam kết hợp hài hòa giữa 4 màu sắc và 3 nét hình khối mang triết lý sâu sắc.',
      '4 Màu sắc: Xanh lam (Biển cả, hy vọng), Vàng (Đất mẹ, sắc tộc da vàng), Đỏ (Máu lửa, nhiệt huyết bất khuất), Trắng (Tinh khiết, thanh cao, quy về Đạo thể).',
      '3 Nét hình thể: Nửa vuông nửa tròn (Nguyên lý Cương Nhu phối triển), Vòng tròn Âm Dương chữ S (Bản sắc Việt Nam), Vòng tròn trắng viền ngoài (Đạo thể bao la thanh tịnh).'
    ],
    keyPoints: [
      'Phù hiệu gồm 4 màu sắc: Xanh lam, Vàng, Đỏ, Trắng',
      'Ý nghĩa màu Xanh (Hy vọng, biển cả) & Vàng (Sắc tộc, đất mẹ)',
      'Ý nghĩa màu Đỏ (Nhiệt huyết, kiên cường) & Trắng (Đạo thể tinh khiết)',
      '3 nét hình: Khung nửa vuông nửa tròn biểu thị Cương Nhu phối triển',
      'Vòng Âm Dương chữ S biểu trưng bản sắc Việt Nam',
      'Vòng tròn trắng viền ngoài tượng trưng Đạo thể bao la'
    ],
    clozeData: [
      {
        prompt: 'Nền nửa vuông nửa tròn biểu thị nguyên lý {0} phối triển.',
        answers: ['Cương Nhu'],
        distractors: ['Âm Dương', 'Biển Cả', 'Võ Đạo']
      },
      {
        prompt: 'Màu Trắng là màu tinh khiết, thanh cao, tiêu biểu cho đức hạnh và tinh hoa quy về {0}.',
        answers: ['Đạo thể'],
        distractors: ['Sắc tộc', 'Khí phách', 'Hy vọng']
      },
      {
        prompt: 'Vòng tròn Âm Dương chữ S phân định bản sắc {0} và sự chuyển hóa không ngừng.',
        answers: ['Việt Nam'],
        distractors: ['Á Đông', 'Võ học', 'Dân tộc']
      }
    ],
    commonMistakes: [
      'Thường quên ý nghĩa màu Trắng (tượng trưng cho Đạo thể tinh khiết cao cả)',
      'Nhầm lẫn tên gọi: "Nửa vuông nửa tròn" chứ không phải chỉ hình vuông'
    ]
  },
  {
    id: 2,
    number: 2,
    title: 'Môn phái có bao nhiêu mục đích? Trình bày những mục đích đó?',
    category: 'Mục đích môn phái',
    status: 'learning',
    score: 1,
    dayAssigned: 1,
    keywords: 'mục đích bảo tồn nghiên cứu huấn luyện môn phái 3 mục đích',
    hintWords: 'Bộ 3 từ khóa vàng: BẢO TỒN – NGHIÊN CỨU – HUẤN LUYỆN.',
    easyAnswer: {
      headlineQuote: '“Vovinam có 3 mục đích chính: Bảo tồn võ học dân tộc, Nghiên cứu phát triển và Huấn luyện môn sinh phụng sự xã hội.”',
      coreMeaning: '1. Bảo tồn: Thu thập và giữ gìn tinh hoa võ thuật cổ truyền. 2. Nghiên cứu: Hệ thống hóa, hiện đại hóa và sáng tạo đòn thế khoa học. 3. Huấn luyện: Đào tạo thế hệ môn sinh vừa giỏi võ công vừa giàu võ đức.',
      mnemonic: 'Mẹo nhớ: Bộ 3 hành động: BẢO TỒN – NGHIÊN CỨU – HUẤN LUYỆN'
    },
    fullAnswer: {
      intro: 'Môn phái Vovinam Việt Võ Đạo có 3 mục đích cơ bản:',
      paragraphs: [
        '1. Bảo tồn: Sưu tầm, bảo tồn và phát huy tinh hoa võ thuật truyền thống của tổ tiên Việt Nam qua các thời kỳ lịch sử dựng nước và giữ nước.',
        '2. Nghiên cứu: Nghiên cứu, cải tiến, hệ thống hóa và sáng tạo thêm các thế võ mới cho phù hợp với thể tạng người Việt, mang tính thực dụng và khoa học cao.',
        '3. Huấn luyện: Huấn luyện và đào tạo người võ sinh vừa kiện toàn thể chất, vừa tu dưỡng tinh thần và đạo hạnh, sẵn sàng cống hiến cho dân tộc và nhân loại.'
      ]
    },
    visualDetails: {
      threeObjectives: [
        { name: '1. BẢO TỒN', desc: 'Giữ gìn và phát huy tinh hoa võ thuật cổ truyền dân tộc.' },
        { name: '2. NGHIÊN CỨU', desc: 'Đổi mới, bổ sung, hệ thống hóa đòn thế khoa học, thực dụng.' },
        { name: '3. HUẤN LUYỆN', desc: 'Rèn luyện thế hệ môn sinh vừa giỏi võ thuật vừa giàu võ đức.' }
      ]
    },
    accuracyPercent: 85,
    readCount: 4,
    chunks: [
      'Môn phái Vovinam Việt Võ Đạo có 3 mục đích chính yếu: Bảo tồn, Nghiên cứu và Huấn luyện.',
      '1. Bảo tồn: Sưu tầm, bảo tồn và phát huy tinh hoa võ thuật truyền thống của tổ tiên Việt Nam qua các thời kỳ lịch sử.',
      '2. Nghiên cứu: Cải tiến, hệ thống hóa và sáng tạo thêm thế võ mới phù hợp thể tạng người Việt, thực dụng và khoa học.',
      '3. Huấn luyện: Đào tạo võ sinh vừa kiện toàn thể chất vừa tu dưỡng tinh thần, võ công đi đôi với võ đức để phụng sự xã hội.'
    ],
    keyPoints: [
      'Nêu đủ 3 mục đích: BẢO TỒN – NGHIÊN CỨU – HUẤN LUYỆN',
      'Mục đích 1: Bảo tồn tinh hoa võ thuật truyền thống tổ tiên Việt Nam',
      'Mục đích 2: Nghiên cứu, hệ thống hóa đòn thế khoa học, phù hợp thể tạng người Việt',
      'Mục đích 3: Huấn luyện môn sinh toàn diện thể chất và tinh thần (Võ công song hành Võ đức)'
    ],
    clozeData: [
      {
        prompt: 'Vovinam có 3 mục đích chính gồm: {0}, Nghiên cứu và {1}.',
        answers: ['Bảo tồn', 'Huấn luyện'],
        distractors: ['Chiến đấu', 'Tu thân', 'Phát triển']
      },
      {
        prompt: 'Nghiên cứu cải tiến đòn thế cho phù hợp với {0} người Việt, mang tính thực dụng và khoa học cao.',
        answers: ['thể tạng'],
        distractors: ['tập quán', 'vóc dáng', 'sức khỏe']
      }
    ],
    commonMistakes: [
      'Nêu thiếu mục đích "Nghiên cứu" (thường chỉ nhớ Bảo tồn và Huấn luyện)',
      'Quên nhấn mạnh vế "tu dưỡng tinh thần/võ đức" trong phần Huấn luyện'
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
    keywords: 'danh dự võ sĩ nghĩa khí tự trọng trung dũng chính trực',
    hintWords: 'Lòng tự trọng, đức nghĩa khí và tinh thần trung dũng của người luyện võ.',
    easyAnswer: {
      headlineQuote: '“Danh dự võ sĩ là lòng tự trọng, đức nghĩa khí và tinh thần trung dũng.”',
      coreMeaning: 'Người võ sĩ coi danh dự quý hơn tính mạng, luôn sống chính trực, không làm điều ô nhục đến bản thân, gia đình, sư môn và đại cuộc.',
      mnemonic: 'Mẹo nhớ: TỰ TRỌNG – NGHĨA KHÍ – TRUNG DŨNG'
    },
    fullAnswer: {
      intro: 'Định nghĩa danh dự cốt tử của người môn sinh Việt Võ Đạo:',
      paragraphs: [
        'Danh dự võ sĩ là lòng tự trọng, đức nghĩa khí và tinh thần trung dũng. Võ sĩ coi danh dự quý hơn tính mạng bản thân.',
        'Người có danh dự luôn sống đường hoàng, giữ lời hứa, bênh vực kẻ yếu, dám nhận lỗi khi sai, và không bao giờ dùng võ thuật để ức hiếp người khác hay mưu cầu lợi ích bất chính.'
      ]
    },
    accuracyPercent: 92,
    readCount: 3,
    chunks: [
      'Danh dự võ sĩ là lòng tự trọng, đức nghĩa khí và tinh thần trung dũng của người luyện võ.',
      'Người võ sĩ luôn coi danh dự quý hơn cả tính mạng bản thân.',
      'Biểu hiện: Sống đường hoàng chính trực, giữ lời hứa, bênh vực kẻ yếu, dám nhận lỗi khi sai, không bao giờ dùng võ để ức hiếp người khác.'
    ],
    keyPoints: [
      'Bộ 3 phẩm chất cốt lõi: TỰ TRỌNG – NGHĨA KHÍ – TRUNG DŨNG',
      'Quan niệm: Coi danh dự quý hơn tính mạng bản thân',
      'Hành động: Sống đường hoàng, giữ chữ tín, bênh vực kẻ yếu',
      'Cấm kỵ: Tuyệt đối không dùng võ thuật để ức hiếp người khác hoặc vụ lợi'
    ],
    clozeData: [
      {
        prompt: 'Danh dự võ sĩ là lòng {0}, đức {1} và tinh thần {2}.',
        answers: ['tự trọng', 'nghĩa khí', 'trung dũng'],
        distractors: ['khiêm tốn', 'tự tin', 'dũng cảm']
      },
      {
        prompt: 'Người võ sĩ coi {0} quý hơn tính mạng bản thân.',
        answers: ['danh dự'],
        distractors: ['chiến thắng', 'tiền tài', 'sức mạnh']
      }
    ],
    commonMistakes: [
      'Chỉ nói "tự trọng" mà quên 2 yếu tố: "nghĩa khí" và "trung dũng"'
    ]
  },
  {
    id: 4,
    number: 4,
    title: 'Năm (5) tôn chỉ của môn phái Vovinam?',
    category: 'Tôn chỉ môn phái',
    status: 'review',
    score: 0,
    dayAssigned: 2,
    keywords: 'năm tôn chỉ 5 tôn chỉ môn phái vovinam toàn diện đồng môn dân tộc nhân loại tự cường',
    hintWords: '5 chữ đầu ghi nhớ: TOÀN DIỆN – ĐỒNG MÔN – DÂN TỘC – NHÂN LOẠI – TỰ CƯỜNG.',
    easyAnswer: {
      headlineQuote: '“Năm tôn chỉ: Toàn diện về thể xác lẫn tinh thần; Tình đồng môn keo sơn; Phục vụ Dân tộc; Hòa bình Nhân loại; Tự lực Tự cường.”',
      coreMeaning: '1. Toàn diện: Phát triển cả thể chất và tinh thần thanh cao. 2. Đồng môn: Tình huynh đệ tương thân tương ái. 3. Dân tộc: Phụng sự Tổ quốc. 4. Nhân loại: Hướng tới hòa bình, hữu nghị thế giới. 5. Tự cường: Ý chí tự lực vươn lên bất khuất.',
      mnemonic: 'Mẹo nhớ: TOÀN - ĐỒNG - DÂN - NHÂN - CƯỜNG'
    },
    fullAnswer: {
      intro: 'Năm tôn chỉ chỉ đạo mọi hoạt động tu dưỡng và phát triển của Vovinam:',
      paragraphs: [
        '1. Toàn diện: Phát triển con người toàn diện về cả thể lực, trí lực và tâm lực.',
        '2. Đồng môn: Xây dựng tình đồng môn keo sơn, gắn bó, coi nhau như ruột thịt.',
        '3. Dân tộc: Luôn gắn bó mật thiết với vận mệnh và tương lai của dân tộc Việt Nam.',
        '4. Nhân loại: Góp phần vào tình bác ái, hòa bình và sự tiến bộ chung của toàn thể nhân loại.',
        '5. Tự cường: Phát huy tinh thần tự lực, tự cường, kiên cường vượt qua nghịch cảnh.'
      ]
    },
    visualDetails: {
      fivePrinciples: [
        { name: '1. Toàn diện', desc: 'Phát triển cả thể chất lẫn tinh thần thanh cao.' },
        { name: '2. Đồng môn', desc: 'Tình đồng môn bền chặt, tương trợ không phân biệt.' },
        { name: '3. Dân tộc', desc: 'Hướng về phục vụ Tổ quốc và giống nòi Việt Nam.' },
        { name: '4. Nhân loại', desc: 'Đóng góp vào hòa bình, hữu nghị nhân loại rộng mở.' },
        { name: '5. Tự cường', desc: 'Phát huy tinh thần tự lực, tự cường, bất khuất.' }
      ]
    },
    accuracyPercent: 40,
    readCount: 6,
    chunks: [
      'Vovinam có 5 tôn chỉ chỉ đạo: Toàn diện – Đồng môn – Dân tộc – Nhân loại – Tự cường.',
      '1. Toàn diện: Phát triển con người toàn diện về cả thể lực, trí lực và tâm lực.',
      '2. Đồng môn: Xây dựng tình đồng môn keo sơn, gắn bó, xem nhau như ruột thịt.',
      '3. Dân tộc & Nhân loại: Gắn bó mật thiết với tiền đồ dân tộc Việt Nam và cống hiến cho hòa bình, bác ái của nhân loại.',
      '4. Tự cường: Phát huy ý chí tự lực tự cường, không ỷ lại, vượt qua mọi nghịch cảnh.'
    ],
    keyPoints: [
      'Tôn chỉ 1: TOÀN DIỆN (Thể lực, trí lực và tâm lực)',
      'Tôn chỉ 2: ĐỒNG MÔN (Gắn bó keo sơn như anh em ruột thịt)',
      'Tôn chỉ 3: DÂN TỘC (Gắn bó với vận mệnh Tổ quốc)',
      'Tôn chỉ 4: NHÂN LOẠI (Hòa bình, hữu nghị và tiến bộ nhân loại)',
      'Tôn chỉ 5: TỰ CƯỜNG (Tự lực tự cường, kiên cường vượt nghịch cảnh)'
    ],
    clozeData: [
      {
        prompt: 'Tôn chỉ 1 hướng tới phát triển con người {0} về thể lực, trí lực và tâm lực.',
        answers: ['toàn diện'],
        distractors: ['mạnh mẽ', 'hoàn hảo', 'vững chắc']
      },
      {
        prompt: '5 tôn chỉ gồm: Toàn diện, Đồng môn, {0}, {1} và Tự cường.',
        answers: ['Dân tộc', 'Nhân loại'],
        distractors: ['Xã hội', 'Tổ quốc', 'Đoàn kết']
      }
    ],
    commonMistakes: [
      'Rất hay nhầm thứ tự hoặc quên mất tôn chỉ số 4 (Nhân loại) và số 5 (Tự cường)',
      'Nhớ thần chú: TOÀN - ĐỒNG - DÂN - NHÂN - CƯỜNG'
    ]
  },
  {
    id: 5,
    number: 5,
    title: 'Quan niệm về sống trong sạch của Việt Võ Đạo Sinh?',
    category: 'Võ đạo ứng dụng',
    status: 'unlearned',
    score: 0,
    dayAssigned: 3,
    keywords: 'quan niệm sống trong sạch việt võ đạo sinh tâm hồn thanh bạch',
    hintWords: 'Giữ tâm hồn thanh bạch, thân thể khỏe mạnh, lời nói trung thực, hành vi minh bạch.',
    easyAnswer: {
      headlineQuote: '“Sống trong sạch là giữ tâm hồn thanh bạch, hành vi minh bạch, không tham lam danh lợi bất chính.”',
      coreMeaning: 'Việt Võ Đạo Sinh quan niệm sống trong sạch ở 4 phương diện: Thân thể khỏe mạnh, Tâm hồn thanh bạch, Lời nói trung thực, và Hành vi minh bạch, giữ gìn thanh danh môn phái.',
      mnemonic: 'Mẹo nhớ: Thân sạch – Tâm trong – Lời thật – Việc chính'
    },
    fullAnswer: {
      intro: 'Việt Võ Đạo Sinh quan niệm về nếp sống trong sạch:',
      paragraphs: [
        'Việt Võ Đạo Sinh quan niệm sống trong sạch là giữ tâm hồn thanh bạch, thân thể khỏe mạnh, lời nói trung thực, hành vi minh bạch.',
        'Không tham lam của cải, danh lợi bất chính; không a dua xu nịnh; luôn sống đúng lương tâm và tôn chỉ võ đạo, giữ gìn thanh danh cho bản thân, gia đình và môn phái.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      'Sống trong sạch là giữ tâm hồn thanh bạch, thân thể khỏe mạnh, lời nói trung thực, hành vi minh bạch.',
      'Người võ sinh không tham lam của cải danh lợi bất chính, không a dua xu nịnh.',
      'Luôn sống đúng lương tâm và đạo nghĩa, giữ gìn thanh danh cho bản thân, gia đình và môn phái.'
    ],
    keyPoints: [
      '4 biểu hiện trong sạch: Thân thể khỏe mạnh, Tâm hồn thanh bạch, Lời nói trung thực, Hành vi minh bạch',
      'Thái độ: Không tham lam danh lợi bất chính, không a dua xu nịnh',
      'Mục đích: Sống đúng lương tâm, giữ gìn thanh danh bản thân và môn phái'
    ],
    clozeData: [
      {
        prompt: 'Sống trong sạch là giữ tâm hồn {0}, thân thể {1}, lời nói {2}, hành vi {3}.',
        answers: ['thanh bạch', 'khỏe mạnh', 'trung thực', 'minh bạch'],
        distractors: ['trong sáng', 'cường tráng', 'ngay thẳng', 'đoan chính']
      }
    ],
    commonMistakes: [
      'Quên cụm 4 vế: Tâm hồn thanh bạch - Thân thể khỏe mạnh - Lời nói trung thực - Hành vi minh bạch'
    ]
  },
  {
    id: 6,
    number: 6,
    title: 'Điều tâm niệm thứ 6 của Việt Võ Đạo Sinh?',
    category: '10 Điều tâm niệm',
    status: 'learning',
    score: 1,
    dayAssigned: 3,
    keywords: 'điều tâm niệm thứ 6 chuyên cần học tập rèn luyện tinh thần trau dồi đạo hạnh',
    hintWords: 'chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.',
    easyAnswer: {
      headlineQuote: '“Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.”',
      coreMeaning: 'Ham học hỏi (5 điều căn bản: học rộng, hỏi kỹ, nghĩ cẩn thận, luận sáng, làm hết sức) và trau dồi 5 đức tính (sống khỏe, đức độ, cương trực, trầm tĩnh, tháo vát).',
      mnemonic: 'Mẹo nhớ: Học – Tinh thần – Đạo hạnh'
    },
    fullAnswer: {
      intro: 'Nội dung chuẩn Điều tâm niệm thứ 6 trong 10 Điều Tâm Niệm Vovinam Việt Võ Đạo:',
      quote: '“Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.”',
      paragraphs: [
        'Người môn sinh phải luôn cầu tiến, trau dồi kiến thức nghề nghiệp và văn hóa để phụng sự xã hội.',
        'Tinh thần cần vững vàng trước gian nguy, tâm hồn trong sáng, giữ tròn võ đạo và tư cách người võ sinh Việt Võ Đạo.'
      ]
    },
    accuracyPercent: 70,
    readCount: 3,
    chunks: [
      '“Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.”',
      'Chuyên cần học tập: Luôn có tinh thần cầu tiến, mở mang kiến thức để phụng sự xã hội.',
      'Rèn luyện tinh thần: Vững vàng trước khó khăn thử thách, không nao núng thoái chí.',
      'Trau dồi đạo hạnh: Giữ tâm hồn thanh cao trong sạch, làm gương sáng về tư cách võ đạo sinh.'
    ],
    keyPoints: [
      'Đọc chính xác nguyên văn câu niệm: “Việt Võ Đạo Sinh chuyên cần học tập, rèn luyện tinh thần, trau dồi đạo hạnh.”',
      'Ý 1: Chuyên cần học tập (học hỏi văn hóa, nghề nghiệp, võ thuật)',
      'Ý 2: Rèn luyện tinh thần (ý chí kiên cường, bản lĩnh trước thử thách)',
      'Ý 3: Trau dồi đạo hạnh (sống có đạo đức, nhân cách gương mẫu)'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh {0} học tập, {1} tinh thần, {2} đạo hạnh.',
        answers: ['chuyên cần', 'rèn luyện', 'trau dồi'],
        distractors: ['chăm chỉ', 'tu dưỡng', 'học hỏi']
      }
    ],
    commonMistakes: [
      'Nhầm lẫn động từ: Phải là "chuyên cần" học tập, "rèn luyện" tinh thần, "trau dồi" đạo hạnh (không dùng lộn xộn các từ tu dưỡng/học hỏi)'
    ]
  },
  {
    id: 7,
    number: 7,
    title: 'Điều tâm niệm thứ 7 (Trong sạch, giản dị, trung thực, cao thượng)',
    category: '10 Điều tâm niệm',
    status: 'mastered',
    score: 2,
    dayAssigned: 4,
    keywords: 'điều tâm niệm thứ 7 trong sạch giản dị trung thực cao thượng 4 đức tính',
    hintWords: '4 đức tính: Trong sạch, Giản dị, Trung thực và Cao thượng.',
    easyAnswer: {
      headlineQuote: '“Việt Võ Đạo Sinh sống trong sạch, giản dị, trung thực và cao thượng.”',
      coreMeaning: 'Là nền tảng nhân cách của môn sinh: Trong sạch về tâm hồn và hành động, giản dị trong nếp sống hàng ngày, trung thực trong lời nói và việc làm, cao thượng trong cách đối nhân xử thế.',
      mnemonic: 'Mẹo nhớ: Trong sạch – Giản dị – Trung thực – Cao thượng'
    },
    fullAnswer: {
      intro: 'Nội dung Điều tâm niệm thứ 7:',
      quote: '“Việt Võ Đạo Sinh sống trong sạch, giản dị, trung thực và cao thượng.”',
      paragraphs: [
        'Đây là kim chỉ nam cho lối sống của người môn sinh. Giữ lòng trong sạch không để lòng tham hay đố kỵ làm vẫn đục.',
        'Nếp sống giản dị không xa hoa cầu kỳ; trung thực với chính mình và mọi người; cao thượng biết tha thứ, bao dung và nâng đỡ kẻ yếu.'
      ]
    },
    accuracyPercent: 98,
    readCount: 4,
    chunks: [
      '“Việt Võ Đạo Sinh sống trong sạch, giản dị, trung thực và cao thượng.”',
      'Trong sạch: Tâm hồn thanh tịnh, hành vi quang minh chính đại.',
      'Giản dị & Trung thực: Lối sống mộc mạc, không xa hoa phù phiếm; lời nói và việc làm trước sau như một.',
      'Cao thượng: Có lòng vị tha, bao dung, sẵn sàng tha thứ và nâng đỡ người khác.'
    ],
    keyPoints: [
      'Đọc chuẩn nguyên văn: “Việt Võ Đạo Sinh sống trong sạch, giản dị, trung thực và cao thượng.”',
      'Ý nghĩa Trong sạch (tâm hồn & hành vi)',
      'Ý nghĩa Giản dị (nếp sống mộc mạc, tiết kiệm)',
      'Ý nghĩa Trung thực (lời nói chân thật, không dối trá)',
      'Ý nghĩa Cao thượng (bao dung, rộng lượng)'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh sống {0}, {1}, {2} và {3}.',
        answers: ['trong sạch', 'giản dị', 'trung thực', 'cao thượng'],
        distractors: ['khiêm tốn', 'ngay thẳng', 'chan hòa', 'bình dị']
      }
    ],
    commonMistakes: [
      'Đọc thiếu 1 trong 4 đức tính, thường quên từ "cao thượng" ở cuối'
    ]
  },
  {
    id: 8,
    number: 8,
    title: 'Điều tâm niệm thứ 8 (Ý chí đanh thép, nỗ lực tự thân)',
    category: '10 Điều tâm niệm',
    status: 'unlearned',
    score: 0,
    dayAssigned: 4,
    keywords: 'điều tâm niệm thứ 8 ý chí đanh thép nỗ lực tự thân gian lao khổ hạnh',
    hintWords: 'Rèn luyện ý chí đanh thép, nỗ lực tự thân, vượt mọi gian lao khổ hạnh.',
    easyAnswer: {
      headlineQuote: '“Việt Võ Đạo Sinh rèn luyện ý chí đanh thép, nỗ lực tự thân, vượt mọi gian lao khổ hạnh.”',
      coreMeaning: 'Không ngại khó, không lùi bước trước thử thách; tự lập, tự lực cánh sinh và kiên trì rèn luyện đến cùng.',
      mnemonic: 'Mẹo nhớ: Ý chí thép – Tự lực – Vượt gian lao'
    },
    fullAnswer: {
      intro: 'Nội dung Điều tâm niệm thứ 8:',
      quote: '“Việt Võ Đạo Sinh rèn luyện ý chí đanh thép, nỗ lực tự thân, vượt mọi gian lao khổ hạnh.”',
      paragraphs: [
        'Võ sinh tôi luyện ý chí kiên định qua năm tháng tập luyện gian khổ. Không trông chờ ỷ lại vào người khác mà luôn nỗ lực tự thân vươn lên trong mọi nghịch cảnh.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      '“Việt Võ Đạo Sinh rèn luyện ý chí đanh thép, nỗ lực tự thân, vượt mọi gian lao khổ hạnh.”',
      'Ý chí đanh thép: Tinh thần kiên cường, không nao núng trước thử thách và cám dỗ.',
      'Nỗ lực tự thân: Tự lập, tự cường, không ỷ lại hay trông chờ vào người khác.',
      'Vượt mọi gian lao khổ hạnh: Kiên trì vượt qua khó khăn để đi đến đích.'
    ],
    keyPoints: [
      'Nguyên văn: “Việt Võ Đạo Sinh rèn luyện ý chí đanh thép, nỗ lực tự thân, vượt mọi gian lao khổ hạnh.”',
      'Ý chí đanh thép: Thử thách tôi luyện tinh thần sắt đá',
      'Nỗ lực tự thân: Tự lực cánh sinh, không ỷ lại',
      'Vượt qua gian lao khổ hạnh: Kiên trì vượt chông gai'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh rèn luyện ý chí {0}, nỗ lực {1}, vượt mọi {2}.',
        answers: ['đanh thép', 'tự thân', 'gian lao khổ hạnh'],
        distractors: ['sắt đá', 'bản thân', 'nghịch cảnh gian khó']
      }
    ],
    commonMistakes: [
      'Nhầm "ý chí đanh thép" thành "ý chí sắt đá" hoặc nhầm "gian lao khổ hạnh" thành "gian khổ hiểm nguy"'
    ]
  },
  {
    id: 9,
    number: 9,
    title: 'Điều tâm niệm thứ 9 (Sáng suốt, bền gan, tháo vát)',
    category: '10 Điều tâm niệm',
    status: 'unlearned',
    score: 0,
    dayAssigned: 5,
    keywords: 'điều tâm niệm thứ 9 sáng suốt nhận định bền gan hành động tháo vát ứng biến',
    hintWords: 'Sáng suốt nhận định, bền gan hành động, tháo vát ứng biến.',
    easyAnswer: {
      headlineQuote: '“Việt Võ Đạo Sinh sáng suốt nhận định, bền gan hành động, tháo vát ứng biến.”',
      coreMeaning: 'Bộ 3 năng lực xử thế: Trí tuệ nhận định đúng sai khách quan; Nghị lực kiên trì hành động đến cùng; Tài năng linh hoạt ứng biến thích nghi.',
      mnemonic: 'Mẹo nhớ: Sáng suốt – Bền gan – Tháo vát'
    },
    fullAnswer: {
      intro: 'Nội dung Điều tâm niệm thứ 9:',
      quote: '“Việt Võ Đạo Sinh sáng suốt nhận định, bền gan hành động, tháo vát ứng biến.”',
      paragraphs: [
        'Trước mọi biến cố, người môn sinh phải giữ tâm trí sáng suốt để phân tích thấu đáo; khi đã quyết định thì bền gan, kiên định thực hiện; và linh hoạt, khéo léo thích ứng với mọi hoàn cảnh thực tế.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      '“Việt Võ Đạo Sinh sáng suốt nhận định, bền gan hành động, tháo vát ứng biến.”',
      'Sáng suốt nhận định: Giữ đầu óc tỉnh táo, phân biệt rõ đúng sai, phải trái trước khi hành động.',
      'Bền gan hành động: Có nghị lực kiên trì, không bỏ cuộc nửa chừng khi gặp trở ngại.',
      'Tháo vát ứng biến: Linh hoạt thích ứng khéo léo với mọi tình huống bất ngờ.'
    ],
    keyPoints: [
      'Nguyên văn: “Việt Võ Đạo Sinh sáng suốt nhận định, bền gan hành động, tháo vát ứng biến.”',
      'Sáng suốt NHẬN ĐỊNH: Trí tuệ soi sáng, phán đoán đúng sai',
      'Bền gan HÀNH ĐỘNG: Nghị lực vững vàng, không bỏ dở giữa chừng',
      'Tháo vát ỨNG BIẾN: Khéo léo, linh hoạt tùy cơ ứng biến'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh sáng suốt {0}, bền gan {1}, tháo vát {2}.',
        answers: ['nhận định', 'hành động', 'ứng biến'],
        distractors: ['suy nghĩ', 'thực hiện', 'xử lý']
      }
    ],
    commonMistakes: [
      'Hay lẫn cặp từ: Nhớ từ trước (sáng suốt, bền gan, tháo vát) nhưng quên từ đi kèm (nhận định, hành động, ứng biến)'
    ]
  },
  {
    id: 10,
    number: 10,
    title: 'Điều tâm niệm thứ 10 (Tự tín, tự thắng, khiêm cung...)',
    category: '10 Điều tâm niệm',
    status: 'unlearned',
    score: 0,
    dayAssigned: 5,
    keywords: 'điều tâm niệm thứ 10 tự tín tự thắng khiêm cung vị tha tự kiểm',
    hintWords: 'Tự tín, tự thắng, khiêm cung, vị tha, luôn luôn tự kiểm để tiến bộ.',
    easyAnswer: {
      headlineQuote: '“Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, vị tha, luôn luôn tự kiểm để tiến bộ.”',
      coreMeaning: 'Đỉnh cao võ đạo: Tự tin vào năng lực chính mình nhưng chiến thắng được bản ngã là chiến thắng hiển hách nhất. Luôn khiêm tốn, biết vị tha và tự phản tỉnh mỗi ngày.',
      mnemonic: 'Mẹo nhớ: Tự tín – Tự thắng – Khiêm cung – Vị tha – Tự kiểm'
    },
    fullAnswer: {
      intro: 'Nội dung Điều tâm niệm thứ 10:',
      quote: '“Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, vị tha, luôn luôn tự kiểm để tiến bộ.”',
      paragraphs: [
        'Điều tâm niệm thứ 10 tổng kết nhân cách đỉnh cao của Việt Võ Đạo Sinh.',
        'Chiến thắng chính mình (tự thắng) là chiến thắng vẻ vang nhất. Kết hợp sự khiêm tốn nhã nhặn, lòng bao dung vị tha và thói quen tự kiểm điểm hằng ngày để không ngừng hoàn thiện bản thân.'
      ]
    },
    accuracyPercent: 0,
    readCount: 1,
    chunks: [
      '“Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, vị tha, luôn luôn tự kiểm để tiến bộ.”',
      'Tự tín & Tự thắng: Tự tin vào bản thân; chiến thắng lòng tham và bản ngã của chính mình.',
      'Khiêm cung & Vị tha: Khiêm nhường lễ độ với mọi người; có lòng rộng lượng tha thứ lỗi lầm.',
      'Luôn luôn tự kiểm: Thường xuyên soi xét lại bản thân mỗi ngày để sửa mình và không ngừng tiến bộ.'
    ],
    keyPoints: [
      'Nguyên văn đầy đủ: “Việt Võ Đạo Sinh tự tín, tự thắng, khiêm cung, vị tha, luôn luôn tự kiểm để tiến bộ.”',
      'Ý 1: Tự tín (tự tin vào chính mình)',
      'Ý 2: Tự thắng (chiến thắng dục vọng, bản ngã)',
      'Ý 3: Khiêm cung (khiêm tốn, lễ phép)',
      'Ý 4: Vị tha (bao dung, rộng lượng)',
      'Ý 5: Tự kiểm (tự kiểm điểm mỗi ngày để hoàn thiện)'
    ],
    clozeData: [
      {
        prompt: 'Việt Võ Đạo Sinh {0}, {1}, {2}, {3}, luôn luôn {4} để tiến bộ.',
        answers: ['tự tín', 'tự thắng', 'khiêm cung', 'vị tha', 'tự kiểm'],
        distractors: ['tự lập', 'khiêm tốn', 'bao dung', 'tu tâm']
      }
    ],
    commonMistakes: [
      'Rất dài nên hay quên vế cuối "luôn luôn tự kiểm để tiến bộ"',
      'Nhầm "khiêm cung" thành "khiêm tốn", nhầm "tự tín" thành "tự tin"'
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
    focus: 'Việt Võ Đạo & 10 Điều tâm niệm',
    description: 'Nền tảng triết lý võ đạo căn bản',
    assignedQuestionIds: [1, 2],
    isCompleted: true,
    isToday: false
  },
  {
    day: 2,
    label: 'Ngày 2: Câu 3–4',
    focus: 'Kỳ hiệu & Ý nghĩa cấp đai',
    description: 'Danh dự võ sĩ và 5 tôn chỉ môn phái',
    assignedQuestionIds: [3, 4],
    isCompleted: true,
    isToday: false
  },
  {
    day: 3,
    label: 'Ngày 3: Câu 5–6',
    focus: 'Học mới + Ôn câu yếu 1, 4',
    description: 'Điều tâm niệm thứ 6 & ý nghĩa võ đạo',
    assignedQuestionIds: [5, 6],
    isCompleted: false,
    isToday: true
  },
  {
    day: 4,
    label: 'Ngày 4: Câu 7–8',
    focus: 'Nghi thức chào & Kỷ luật võ đường',
    description: 'Điều tâm niệm 7 và 8 về đức tính & ý chí',
    assignedQuestionIds: [7, 8],
    isCompleted: false,
    isToday: false
  },
  {
    day: 5,
    label: 'Ngày 5: Câu 9–10',
    focus: 'Lược sử Sáng Tổ & Chưởng Môn',
    description: 'Điều tâm niệm 9 và 10, đỉnh cao tu dưỡng',
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
