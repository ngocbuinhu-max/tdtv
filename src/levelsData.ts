import { Level } from "./types";

export const levelsData: Level[] = [
  {
    id: "level-1",
    title: "Greeting Ong Bee",
    vietnameseTitle: "Chào hỏi Ong Bee 🐝",
    description: "Làm quen với ngôi xưng 'I' (Tôi) và 'You' (Bạn). Học cách tự giới thiệu bản thân!",
    emoji: "👋",
    difficulty: "Dễ",
    rewardCoins: 50,
    questions: [
      {
        id: "q1-1",
        type: "fill-blank",
        sentence: "I ___ a student.",
        options: ["am", "is", "are"],
        correctAnswer: "am",
        translation: "Tôi là một học sinh.",
        explanation: "Chủ ngữ là 'I' nên động từ 'to be' tương ứng luôn luôn là 'am'."
      },
      {
        id: "q1-2",
        type: "fill-blank",
        sentence: "You ___ my best friend.",
        options: ["am", "is", "are"],
        correctAnswer: "are",
        translation: "Bạn là người bạn thân nhất của tôi.",
        explanation: "Chủ ngữ là 'You' (Bạn) nên chúng ta điền động từ 'to be' là 'are'."
      },
      {
        id: "q1-3",
        type: "reorder",
        sentence: "I am happy.",
        words: ["happy.", "am", "I"],
        correctAnswer: "I am happy.",
        translation: "Tôi đang rất hạnh phúc.",
        explanation: "Cấu trúc câu khẳng định: Chủ ngữ (I) + to be (am) + tính từ (happy)."
      },
      {
        id: "q1-4",
        type: "find-error",
        sentence: "I is ten years old.",
        sentenceWithError: "I is ten years old.",
        errorWord: "is",
        correctWord: "am",
        translation: "Tôi mười tuổi.",
        explanation: "Sai rồi! Với chủ ngữ 'I' thì 'to be' phải là 'am', không thể dùng 'is' nhé."
      },
      {
        id: "q1-5",
        type: "fill-blank",
        sentence: "I ___ very excited to learn English!",
        options: ["am", "is", "are"],
        correctAnswer: "am",
        translation: "Tôi rất hào hứng được học tiếng Anh!",
        explanation: "Chủ ngữ là 'I' thì đi với 'am' để diễn đạt trạng thái cảm xúc của bản thân."
      }
    ]
  },
  {
    id: "level-2",
    title: "Lovely Family",
    vietnameseTitle: "Gia đình yêu thương 🏠",
    description: "Học cách dùng 'is' với các ngôi số ít He (Anh ấy), She (Cô ấy), It (Nó) và danh từ số ít.",
    emoji: "👨‍👩‍👧‍👦",
    difficulty: "Dễ",
    rewardCoins: 60,
    questions: [
      {
        id: "q2-1",
        type: "fill-blank",
        sentence: "My father ___ a doctor.",
        options: ["am", "is", "are"],
        correctAnswer: "is",
        translation: "Bố của tôi là một bác sĩ.",
        explanation: "'My father' (Bố của tôi) tương ứng với ngôi 'He' (số ít) nên động từ 'to be' là 'is'."
      },
      {
        id: "q2-2",
        type: "fill-blank",
        sentence: "She ___ my sweet mother.",
        options: ["am", "is", "are"],
        correctAnswer: "is",
        translation: "Bà ấy là người mẹ ngọt ngào của tôi.",
        explanation: "Với chủ ngữ là đại từ 'She' (Cô ấy), ta luôn sử dụng động từ 'to be' là 'is'."
      },
      {
        id: "q2-3",
        type: "reorder",
        sentence: "He is very tall.",
        words: ["very", "is", "tall.", "He"],
        correctAnswer: "He is very tall.",
        translation: "Anh ấy rất cao.",
        explanation: "Sắp xếp theo cấu trúc: Chủ ngữ (He) + to be (is) + trạng từ (very) + tính từ (tall)."
      },
      {
        id: "q2-4",
        type: "find-error",
        sentence: "My dog are brown.",
        sentenceWithError: "My dog are brown.",
        errorWord: "are",
        correctWord: "is",
        translation: "Chú chó của tớ màu nâu.",
        explanation: "Vì 'My dog' chỉ có một chú chó (danh từ số ít/ngôi It), chúng ta phải dùng 'is' thay vì 'are'."
      },
      {
        id: "q2-5",
        type: "fill-blank",
        sentence: "The weather today ___ very beautiful.",
        options: ["am", "is", "are"],
        correctAnswer: "is",
        translation: "Thời tiết hôm nay rất đẹp.",
        explanation: "'The weather' (Thời tiết) là danh từ không đếm được, được coi là danh từ số ít nên dùng 'is'."
      }
    ]
  },
  {
    id: "level-3",
    title: "Animal Kingdom",
    vietnameseTitle: "Thế giới động vật 🦁",
    description: "Luyện tập dùng 'are' với ngôi số nhiều We (Chúng tôi), They (Họ) và danh từ số nhiều.",
    emoji: "🐘",
    difficulty: "Trung bình",
    rewardCoins: 70,
    questions: [
      {
        id: "q3-1",
        type: "fill-blank",
        sentence: "Elephants ___ very big animals.",
        options: ["am", "is", "are"],
        correctAnswer: "are",
        translation: "Những chú voi là động vật rất lớn.",
        explanation: "'Elephants' có s ở cuối là danh từ số nhiều (những chú voi), tương đương 'They', nên dùng 'are'."
      },
      {
        id: "q3-2",
        type: "fill-blank",
        sentence: "We ___ happy at the zoo.",
        options: ["am", "is", "are"],
        correctAnswer: "are",
        translation: "Chúng tôi rất vui vẻ ở sở thú.",
        explanation: "Chủ ngữ 'We' (Chúng tôi) là ngôi số nhiều nên đi cùng động từ 'to be' là 'are'."
      },
      {
        id: "q3-3",
        type: "reorder",
        sentence: "Birds are flying high.",
        words: ["flying", "Birds", "high.", "are"],
        correctAnswer: "Birds are flying high.",
        translation: "Những chú chim đang bay cao.",
        explanation: "'Birds' là số nhiều, đi với 'are'. Sắp xếp: Birds + are + flying (đang bay) + high."
      },
      {
        id: "q3-4",
        type: "find-error",
        sentence: "Monkeys is funny animals.",
        sentenceWithError: "Monkeys is funny animals.",
        errorWord: "is",
        correctWord: "are",
        translation: "Những chú khỉ là loài động vật vui nhộn.",
        explanation: "'Monkeys' là danh từ số nhiều (nhiều con khỉ) nên 'to be' phải đổi từ 'is' thành 'are'."
      },
      {
        id: "q3-5",
        type: "fill-blank",
        sentence: "You and I ___ a great team!",
        options: ["am", "is", "are"],
        correctAnswer: "are",
        translation: "Bạn và tôi là một đội tuyệt vời!",
        explanation: "'You and I' (bạn và tôi) gồm hai người, tương đương 'We' (chúng ta), là số nhiều nên phải dùng 'are'."
      }
    ]
  },
  {
    id: "level-4",
    title: "Fun School Day",
    vietnameseTitle: "Trường học vui vẻ 🏫",
    description: "Thử thách tổng hợp với tất cả các ngôi! Hãy cẩn thận phân biệt số ít và số nhiều nhé.",
    emoji: "🎒",
    difficulty: "Trung bình",
    rewardCoins: 80,
    questions: [
      {
        id: "q4-1",
        type: "fill-blank",
        sentence: "The classroom ___ very clean.",
        options: ["am", "is", "are"],
        correctAnswer: "is",
        translation: "Phòng học rất sạch sẽ.",
        explanation: "'The classroom' (Phòng học) là một phòng học duy nhất (danh từ số ít) nên ta dùng 'is'."
      },
      {
        id: "q4-2",
        type: "fill-blank",
        sentence: "The teachers ___ very friendly.",
        options: ["am", "is", "are"],
        correctAnswer: "are",
        translation: "Các thầy cô giáo rất thân thiện.",
        explanation: "'The teachers' (các thầy cô giáo) có 's' ở cuối nên là số nhiều, ta điền 'are'."
      },
      {
        id: "q4-3",
        type: "reorder",
        sentence: "I am ready for school.",
        words: ["school.", "am", "ready", "I", "for"],
        correctAnswer: "I am ready for school.",
        translation: "Tớ đã sẵn sàng đi học rồi.",
        explanation: "Sắp xếp: Chủ ngữ 'I' + 'am' + 'ready' (sẵn sàng) + 'for school' (đến trường)."
      },
      {
        id: "q4-4",
        type: "find-error",
        sentence: "The pencils is on the desk.",
        sentenceWithError: "The pencils is on the desk.",
        errorWord: "is",
        correctWord: "are",
        translation: "Những chiếc bút chì ở trên bàn học.",
        explanation: "Vì 'The pencils' là số nhiều (những chiếc bút chì), chúng ta phải đổi 'is' thành 'are'."
      },
      {
        id: "q4-5",
        type: "fill-blank",
        sentence: "Look! The school bus ___ coming.",
        options: ["am", "is", "are"],
        correctAnswer: "is",
        translation: "Nhìn kìa! Xe buýt trường học đang đến.",
        explanation: "'The school bus' (xe buýt trường học) là danh từ số ít nên đi với động từ 'is'."
      }
    ]
  },
  {
    id: "level-5",
    title: "The Secret of NOT",
    vietnameseTitle: "Bí kíp Phủ định (NOT) 🚫",
    description: "Học cách tạo câu phủ định bằng cách thêm 'NOT' sau am, is, are. Rất dễ thôi!",
    emoji: "🙅",
    difficulty: "Trung bình",
    rewardCoins: 90,
    questions: [
      {
        id: "q5-1",
        type: "fill-blank",
        sentence: "She ___ not a bad person.",
        options: ["am", "is", "are"],
        correctAnswer: "is",
        translation: "Cô ấy không phải là người xấu.",
        explanation: "Cấu trúc phủ định: S + am/is/are + NOT. Ở đây chủ ngữ 'She' đi với 'is' + 'not'."
      },
      {
        id: "q5-2",
        type: "fill-blank",
        sentence: "They ___ not at home today.",
        options: ["am", "is", "are"],
        correctAnswer: "are",
        translation: "Họ không có ở nhà ngày hôm nay.",
        explanation: "Chủ ngữ 'They' (Họ) đi với 'are' trong cấu trúc phủ định 'are not' (hoặc aren't)."
      },
      {
        id: "q5-3",
        type: "reorder",
        sentence: "It is not cold today.",
        words: ["cold", "It", "not", "today.", "is"],
        correctAnswer: "It is not cold today.",
        translation: "Hôm nay trời không lạnh.",
        explanation: "Cấu trúc phủ định với It: It + is + not + cold (lạnh) + today (hôm nay)."
      },
      {
        id: "q5-4",
        type: "find-error",
        sentence: "I is not afraid of ghosts.",
        sentenceWithError: "I is not afraid of ghosts.",
        errorWord: "is",
        correctWord: "am",
        translation: "Tớ không sợ ma đâu.",
        explanation: "Với chủ ngữ 'I', ta dùng phủ định là 'am not', không được viết 'is not' nha."
      },
      {
        id: "q5-5",
        type: "fill-blank",
        sentence: "You ___ not late for class.",
        options: ["am", "is", "are"],
        correctAnswer: "are",
        translation: "Bạn không bị muộn giờ học đâu.",
        explanation: "Chủ ngữ 'You' đi với 'are', thể phủ định là 'are not' (viết tắt là aren't)."
      }
    ]
  },
  {
    id: "level-6",
    title: "The Question Maker",
    vietnameseTitle: "Thử thách Đặt câu hỏi ❓",
    description: "Học cách chuyển động từ 'to be' lên trước chủ ngữ để tạo thành câu hỏi Yes/No.",
    emoji: "🤔",
    difficulty: "Khó",
    rewardCoins: 100,
    questions: [
      {
        id: "q6-1",
        type: "fill-blank",
        sentence: "___ you happy today?",
        options: ["Am", "Is", "Are"],
        correctAnswer: "Are",
        translation: "Hôm nay bạn có vui không?",
        explanation: "Trong câu hỏi, ta đưa 'to be' lên đầu. Với chủ ngữ 'you', ta đưa 'Are' lên trước."
      },
      {
        id: "q6-2",
        type: "fill-blank",
        sentence: "___ your dog friendly?",
        options: ["Am", "Is", "Are"],
        correctAnswer: "Is",
        translation: "Chú chó của bạn có thân thiện không?",
        explanation: "'your dog' là danh từ số ít (It) nên động từ 'to be' tương ứng đưa lên đầu câu hỏi là 'Is'."
      },
      {
        id: "q6-3",
        type: "reorder",
        sentence: "Are they at school?",
        words: ["school?", "Are", "they", "at"],
        correctAnswer: "Are they at school?",
        translation: "Họ có đang ở trường không?",
        explanation: "Câu hỏi bắt đầu bằng động từ To Be 'Are' + chủ ngữ 'they' + trạng ngữ chỉ nơi chốn 'at school'."
      },
      {
        id: "q6-4",
        type: "find-error",
        sentence: "Is you ten years old?",
        sentenceWithError: "Is you ten years old?",
        errorWord: "Is",
        correctWord: "Are",
        translation: "Bạn mười tuổi phải không?",
        explanation: "Chủ ngữ là 'you' thì động từ hỏi tương ứng phải là 'Are', không dùng 'Is' nhé."
      },
      {
        id: "q6-5",
        type: "fill-blank",
        sentence: "___ I a good boy?",
        options: ["Am", "Is", "Are"],
        correctAnswer: "Am",
        translation: "Con có phải là một đứa trẻ ngoan không?",
        explanation: "Với chủ ngữ là 'I', từ hỏi đưa lên đầu câu phải là 'Am'."
      }
    ]
  }
];
