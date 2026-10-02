import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft } from "lucide-react";

interface QuickQuiz {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  translation: string;
}

interface Lesson {
  id: number;
  title: string;
  emoji: string;
  color: string;
  summary: string;
  content: React.ReactNode;
  quiz: QuickQuiz;
}

export default function GrammarSchool({ onAwardCoins }: { onAwardCoins: (amount: number) => void }) {
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const lessons: Lesson[] = [
    {
      id: 1,
      title: "Động từ 'To Be' là gì?",
      emoji: "💡",
      color: "from-amber-400 to-orange-500",
      summary: "Hiểu khái niệm cốt lõi của am, is, are trong tiếng Anh.",
      content: (
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">
            Trong tiếng Anh, động từ <strong className="text-orange-600 font-semibold">"To Be"</strong> là động từ quan trọng nhất. Nó có nghĩa là <span className="bg-orange-100 px-2 py-0.5 rounded font-medium text-orange-800">Thì, Là, hoặc Ở</span>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <h4 className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                <span>✨</span> LÀ (Định nghĩa)
              </h4>
              <p className="text-xs text-amber-900">Giới thiệu tên, nghề nghiệp hoặc đặc điểm.</p>
              <p className="text-sm font-bold mt-2 text-slate-800">I <span className="text-amber-600">am</span> a student.</p>
              <p className="text-xs text-slate-500 italic">(Tôi là học sinh.)</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
              <h4 className="font-bold text-orange-800 mb-1 flex items-center gap-1">
                <span>✨</span> THÌ (Tính chất)
              </h4>
              <p className="text-xs text-orange-900">Mô tả tính chất, màu sắc hoặc cảm xúc.</p>
              <p className="text-sm font-bold mt-2 text-slate-800">The cat <span className="text-orange-600">is</span> cute.</p>
              <p className="text-xs text-slate-500 italic">(Chú mèo thì dễ thương.)</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-bold text-yellow-800 mb-1 flex items-center gap-1">
                <span>✨</span> Ở (Nơi chốn)
              </h4>
              <p className="text-xs text-yellow-900">Nói về vị trí hoặc một địa điểm nào đó.</p>
              <p className="text-sm font-bold mt-2 text-slate-800">We <span className="text-yellow-600">are</span> at school.</p>
              <p className="text-xs text-slate-500 italic">(Chúng tôi ở trường học.)</p>
            </div>
          </div>
          <p className="text-sm bg-slate-50 p-3 rounded-lg border border-slate-200">
            💡 <strong>Nhớ nhé:</strong> Động từ To Be có 3 biến thể ở hiện tại đơn: <strong className="text-blue-600">AM</strong>, <strong className="text-emerald-600">IS</strong>, và <strong className="text-purple-600">ARE</strong>. Tùy thuộc vào chủ ngữ đứng trước là ai mà chúng ta chọn từ cho đúng!
          </p>
        </div>
      ),
      quiz: {
        question: "Động từ 'To Be' trong câu 'The sun is hot.' mang nghĩa là gì?",
        options: ["Là", "Thì", "Ở"],
        correct: "Thì",
        translation: "Mặt trời thì nóng.",
        explanation: "'Hot' là một tính từ mô tả trạng thái/tính chất của mặt trời, nên 'is' ở đây mang nghĩa là 'Thì'!"
      }
    },
    {
      id: 2,
      title: "Ai đi với ai? (Chủ ngữ + To Be)",
      emoji: "🤝",
      color: "from-blue-400 to-indigo-500",
      summary: "Tìm hiểu sự kết hợp chuẩn xác giữa các đại từ và am, is, are.",
      content: (
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">
            Đây là bí kíp quan trọng nhất! Hãy cùng ghi nhớ sự kết hợp sau:
          </p>
          <div className="space-y-3 my-4">
            {/* AM */}
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-500 text-white font-bold text-lg rounded-full flex items-center justify-center shadow-sm">
                AM
              </div>
              <div>
                <p className="font-bold text-blue-800 text-base">Chỉ đi duy nhất với: <span className="bg-white px-2 py-0.5 rounded text-blue-600">I</span> (Tôi)</p>
                <p className="text-xs text-slate-600 mt-1">Ví dụ: <strong>I am</strong> a good kid. <em>(Tớ là một cậu bé ngoan.)</em></p>
              </div>
            </div>

            {/* IS */}
            <div className="flex items-center gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="w-16 h-16 bg-emerald-500 text-white font-bold text-lg rounded-full flex items-center justify-center shadow-sm">
                IS
              </div>
              <div>
                <p className="font-bold text-emerald-800 text-base">Đi với ngôi số ít: <span className="bg-white px-1 py-0.5 rounded text-emerald-600">He</span> (Anh ấy), <span className="bg-white px-1 py-0.5 rounded text-emerald-600">She</span> (Cô ấy), <span className="bg-white px-1 py-0.5 rounded text-emerald-600">It</span> (Nó) hoặc danh từ số ít (1 người/vật).</p>
                <p className="text-xs text-slate-600 mt-1">Ví dụ: <strong>She is</strong> beautiful. | <strong>My cat is</strong> sleeping. <em>(Cô ấy xinh đẹp. | Con mèo của tớ đang ngủ.)</em></p>
              </div>
            </div>

            {/* ARE */}
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-500 text-white font-bold text-lg rounded-full flex items-center justify-center shadow-sm">
                ARE
              </div>
              <div>
                <p className="font-bold text-purple-800 text-base">Đi với ngôi số nhiều: <span className="bg-white px-1 py-0.5 rounded text-purple-600">You</span> (Bạn/Các bạn), <span className="bg-white px-1 py-0.5 rounded text-purple-600">We</span> (Chúng tôi), <span className="bg-white px-1 py-0.5 rounded text-purple-600">They</span> (Họ) hoặc danh từ số nhiều (&gt;= 2 người/vật).</p>
                <p className="text-xs text-slate-600 mt-1">Ví dụ: <strong>They are</strong> playing. | <strong>The cars are</strong> fast. <em>(Họ đang chơi. | Những chiếc xe hơi rất nhanh.)</em></p>
              </div>
            </div>
          </div>
        </div>
      ),
      quiz: {
        question: "Điền từ đúng vào câu sau: 'My sister and I ___ sisters.'",
        options: ["am", "is", "are"],
        correct: "are",
        translation: "Chị gái tôi và tôi là chị em.",
        explanation: "'My sister and I' (Chị tôi và tôi) là 2 người, tương đương với ngôi 'We' (Chúng tôi/Chúng ta) số nhiều, do đó phải đi với 'are'!"
      }
    },
    {
      id: 3,
      title: "Dạng viết rút gọn (Contractions)",
      emoji: "✂️",
      color: "from-pink-400 to-rose-500",
      summary: "Học cách viết nhanh và nói tự nhiên như người bản xứ bằng dấu nháy đơn.",
      content: (
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">
            Trong giao tiếp hàng ngày hoặc các đoạn hội thoại tự nhiên, người bản xứ thường rút gọn Động từ To Be bằng cách sử dụng dấu nháy đơn <strong className="text-rose-600 font-semibold">' (apostrophe)</strong>.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 my-3">
            <h4 className="font-bold text-slate-800 mb-3 text-sm">Bảng quy đổi viết tắt:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-xs text-slate-400">I am</span>
                <span className="text-lg font-extrabold text-blue-600">I'm</span>
                <span className="text-xs text-slate-500 mt-1">/aɪm/</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-xs text-slate-400">He / She / It is</span>
                <span className="text-lg font-extrabold text-emerald-600">He's / She's / It's</span>
                <span className="text-xs text-slate-500 mt-1">/hiːz/ - /ʃiːz/ - /ɪts/</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-xs text-slate-400">We / You / They are</span>
                <span className="text-lg font-extrabold text-purple-600">We're / You're / They're</span>
                <span className="text-xs text-slate-500 mt-1">/wɪər/ - /jʊər/ - /ðeər/</span>
              </div>
            </div>
          </div>
          <p className="text-sm bg-rose-50 p-3 rounded-lg border border-rose-200 text-rose-900">
            ⚠️ <strong>Lưu ý:</strong> Khi viết tắt, hãy chắc chắn đặt dấu nháy đơn ở đúng vị trí chữ cái bị lược bỏ nhé (Ví dụ: <strong>a</strong>m lược bỏ chữ 'a' thành <strong>'m</strong>, <strong>i</strong>s lược bỏ chữ 'i' thành <strong>'s</strong>, <strong>a</strong>re lược bỏ chữ 'a' thành <strong>'re</strong>).
          </p>
        </div>
      ),
      quiz: {
        question: "Từ viết tắt của 'They are' là gì?",
        options: ["They'is", "They're", "They'm"],
        correct: "They're",
        translation: "Họ là/đang...",
        explanation: "Để rút gọn 'They are', ta bỏ chữ 'a' ở đầu từ 'are' và thay bằng dấu nháy đơn ('), ghép lại được 'They're'!"
      }
    },
    {
      id: 4,
      title: "Thể phủ định (Thêm NOT)",
      emoji: "🚫",
      color: "from-red-400 to-pink-500",
      summary: "Học cách nói 'Không' bằng cách thêm NOT sau am, is, are.",
      content: (
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">
            Khi muốn nói điều gì đó <strong>không đúng</strong> hoặc <strong>không phải</strong>, chúng ta chỉ cần thêm từ <strong className="text-red-600">NOT</strong> ngay đằng sau động từ To Be.
          </p>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100 my-3">
            <h4 className="font-bold text-red-800 text-sm mb-2">Công thức chung:</h4>
            <div className="bg-white p-3 rounded-lg border border-red-200 text-center text-lg font-mono font-bold text-slate-800">
              Chủ ngữ + am / is / are + <span className="text-red-500">NOT</span> + ...
            </div>
          </div>
          <p className="font-medium text-slate-800">Chúng ta có thể viết tắt thể phủ định như sau:</p>
          <ul className="list-disc list-inside space-y-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm">
            <li><strong>am not</strong>: Không viết tắt được với 'not' (vẫn là <strong className="text-blue-600">I'm not</strong>).</li>
            <li><strong>is not</strong>: Viết tắt thành <strong className="text-emerald-600">isn't</strong> (Ví dụ: He isn't a pilot).</li>
            <li><strong>are not</strong>: Viết tắt thành <strong className="text-purple-600">aren't</strong> (Ví dụ: We aren't tired).</li>
          </ul>
        </div>
      ),
      quiz: {
        question: "Cách viết tắt phủ định nào sau đây là SAI?",
        options: ["amn't", "isn't", "aren't"],
        correct: "amn't",
        translation: "Không có viết tắt amn't.",
        explanation: "Trong tiếng Anh KHÔNG tồn tại từ 'amn't'. Với chủ ngữ 'I', ta phải viết tắt là 'I'm not' chứ không rút gọn 'am not' thành 'amn't' nhé!"
      }
    },
    {
      id: 5,
      title: "Thể nghi vấn (Đặt câu hỏi)",
      emoji: "❓",
      color: "from-purple-400 to-violet-500",
      summary: "Lật ngược câu để hỏi xem điều đó có đúng hay không.",
      content: (
        <div className="space-y-4 text-slate-700">
          <p className="leading-relaxed">
            Để đặt câu hỏi dạng <strong className="text-violet-600">Yes / No (Có hay Không)</strong>, chúng ta chỉ cần thực hiện một động tác cực kỳ đơn giản: <strong>Đưa động từ To Be (Am, Is, Are) lên đầu câu</strong>, đứng trước chủ ngữ!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 block mb-1">CÂU KHẲNG ĐỊNH</span>
              <p className="text-base font-bold text-slate-700">You <span className="text-emerald-600">are</span> happy.</p>
              <p className="text-xs text-slate-500 italic">(Bạn đang hạnh phúc.)</p>
            </div>
            <div className="p-3 bg-violet-50 rounded-xl border border-violet-200">
              <span className="text-xs font-bold text-violet-400 block mb-1">CÂU HỎI (ĐỔI CHỖ)</span>
              <p className="text-base font-bold text-violet-700"><span className="text-violet-600 underline">Are</span> you happy?</p>
              <p className="text-xs text-slate-500 italic">(Bạn có đang hạnh phúc không?)</p>
            </div>
          </div>
          <h4 className="font-bold text-slate-800 text-sm mt-3">Cách trả lời ngắn gọn:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
              <p className="font-bold text-emerald-800 mb-1">👍 Trở lời ĐÚNG (YES):</p>
              <ul className="space-y-1 text-slate-700">
                <li>Yes, I am.</li>
                <li>Yes, he/she/it is.</li>
                <li>Yes, we/you/they are.</li>
              </ul>
            </div>
            <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
              <p className="font-bold text-rose-800 mb-1">👎 Trả lời SAI (NO):</p>
              <ul className="space-y-1 text-slate-700">
                <li>No, I'm not.</li>
                <li>No, he/she/it isn't.</li>
                <li>No, we/you/they aren't.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      quiz: {
        question: "Tìm câu hỏi đúng ngữ pháp:",
        options: ["Is they your brothers?", "Are they your brothers?", "Am they your brothers?"],
        correct: "Are they your brothers?",
        translation: "Họ có phải là anh em của bạn không?",
        explanation: "Chủ ngữ là 'they' (số nhiều), do đó động từ To Be tương ứng phải là 'Are'. Câu hỏi chuẩn là: 'Are they your brothers?'"
      }
    }
  ];

  const currentLesson = lessons.find((l) => l.id === activeLesson) || lessons[0];

  const handleSelectOption = (option: string) => {
    if (quizSubmitted) return;
    setQuizSelected(option);
  };

  const handleSubmitQuiz = () => {
    if (!quizSelected) return;
    const isCorrect = quizSelected === currentLesson.quiz.correct;
    setQuizCorrect(isCorrect);
    setQuizSubmitted(true);

    if (isCorrect) {
      // Award 15 coins for answering the quick quiz correctly
      if (!completedLessons.includes(activeLesson)) {
        onAwardCoins(15);
        setCompletedLessons([...completedLessons, activeLesson]);
      }
    }
  };

  const handleNextLesson = () => {
    if (activeLesson < lessons.length) {
      setActiveLesson(activeLesson + 1);
      setQuizSelected(null);
      setQuizSubmitted(false);
      setQuizCorrect(null);
    }
  };

  const handlePrevLesson = () => {
    if (activeLesson > 1) {
      setActiveLesson(activeLesson - 1);
      setQuizSelected(null);
      setQuizSubmitted(false);
      setQuizCorrect(null);
    }
  };

  const handleLessonTabClick = (id: number) => {
    setActiveLesson(id);
    setQuizSelected(null);
    setQuizSubmitted(false);
    setQuizCorrect(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header section with progress */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-orange-500 w-6 h-6" />
            Trường Học To Be (Grammar School)
          </h2>
          <p className="text-sm text-slate-500 mt-1">Học lý thuyết, trả lời bài kiểm tra nhanh để kiếm thêm xu vàng!</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Hoàn thành:</span>
          <div className="flex gap-1.5">
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isActive = lesson.id === activeLesson;
              return (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonTabClick(lesson.id)}
                  id={`lesson-indicator-${lesson.id}`}
                  className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
                      : isActive
                      ? "bg-orange-500 text-white shadow-sm shadow-orange-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200"
                  }`}
                  title={lesson.title}
                >
                  {isCompleted ? "✓" : lesson.id}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar for Large Screens */}
        <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm h-fit">
          <h3 className="font-bold text-xs uppercase text-slate-400 px-2 tracking-wider mb-2">Các bài giảng</h3>
          {lessons.map((lesson) => {
            const isActive = lesson.id === activeLesson;
            const isCompleted = completedLessons.includes(lesson.id);
            return (
              <button
                key={lesson.id}
                id={`lesson-btn-${lesson.id}`}
                onClick={() => handleLessonTabClick(lesson.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-3 border ${
                  isActive
                    ? "bg-orange-50 border-orange-200/60 shadow-xs"
                    : "bg-transparent border-transparent hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                  isActive ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
                }`}>
                  {lesson.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-bold truncate ${isActive ? "text-orange-950" : "text-slate-700"}`}>
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{lesson.summary}</p>
                </div>
                {isCompleted && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Lesson Display */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLesson}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              {/* Lesson Hero Header */}
              <div className={`p-6 bg-gradient-to-r ${currentLesson.color} text-white flex items-center justify-between`}>
                <div className="space-y-1">
                  <span className="text-xs bg-white/20 text-white/90 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Bài {currentLesson.id}
                  </span>
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
                    <span>{currentLesson.emoji}</span> {currentLesson.title}
                  </h3>
                </div>
                <Sparkles className="w-8 h-8 opacity-20 hidden md:block" />
              </div>

              {/* Lesson Body */}
              <div className="p-6 md:p-8">
                {currentLesson.content}
              </div>

              {/* Quick Quiz Section */}
              <div className="bg-slate-50/80 border-t border-slate-200/60 p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <h4>Kiểm tra nhanh (Nhận +15 🪙 xu)</h4>
                </div>
                <p className="font-bold text-slate-800 text-base">{currentLesson.quiz.question}</p>

                {/* Quiz options */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mt-3">
                  {currentLesson.quiz.options.map((option) => {
                    const isSelected = quizSelected === option;
                    let optionStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";

                    if (quizSubmitted) {
                      const isCorrectAnswer = option === currentLesson.quiz.correct;
                      if (isCorrectAnswer) {
                        optionStyle = "bg-emerald-500 border-emerald-600 text-white font-semibold";
                      } else if (isSelected) {
                        optionStyle = "bg-rose-500 border-rose-600 text-white font-semibold";
                      } else {
                        optionStyle = "bg-white border-slate-100 text-slate-300 opacity-60";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-orange-50 border-orange-400 text-orange-900 font-bold ring-2 ring-orange-100";
                    }

                    return (
                      <button
                        key={option}
                        id={`quick-quiz-${activeLesson}-${option}`}
                        onClick={() => handleSelectOption(option)}
                        disabled={quizSubmitted}
                        className={`p-3 rounded-xl border text-center transition-all ${optionStyle}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* Submit button / Feedback */}
                <div className="mt-4">
                  {!quizSubmitted ? (
                    <button
                      id="submit-quick-quiz-btn"
                      onClick={handleSubmitQuiz}
                      disabled={!quizSelected}
                      className={`w-full py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                        quizSelected
                          ? "bg-orange-500 hover:bg-orange-600 text-white shadow-sm"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Kiểm Tra Đáp Án
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={`p-4 rounded-xl border ${
                        quizCorrect
                          ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                          : "bg-rose-50 border-rose-200 text-rose-900"
                      } space-y-2`}
                    >
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {quizCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-rose-500" />
                        )}
                        <span>
                          {quizCorrect ? "Chính xác! Cậu giỏi lắm! 🎉" : "Chưa đúng rồi! Hãy cùng xem giải thích nha."}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Dịch nghĩa: <span className="italic">"{currentLesson.quiz.translation}"</span>
                      </p>
                      <p className="text-xs leading-relaxed text-slate-600 bg-white/60 p-2.5 rounded border border-white/50">
                        💡 <strong>Giải thích:</strong> {currentLesson.quiz.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Prev / Next controls */}
              <div className="flex justify-between items-center bg-slate-100/50 p-4 border-t border-slate-200/40">
                <button
                  id="prev-lesson-btn"
                  onClick={handlePrevLesson}
                  disabled={activeLesson === 1}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1 transition-all ${
                    activeLesson === 1
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" /> Bài Trước
                </button>
                <span className="text-xs text-slate-400 font-bold">Bài {activeLesson} / {lessons.length}</span>
                <button
                  id="next-lesson-btn"
                  onClick={handleNextLesson}
                  disabled={activeLesson === lessons.length}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1 transition-all ${
                    activeLesson === lessons.length
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Bài Tiếp <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
