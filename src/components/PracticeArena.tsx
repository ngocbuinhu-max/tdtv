import React, { useState } from "react";
import { Level, Question, UserStats } from "../types";
import { levelsData } from "../levelsData";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Sparkles, Coins, ArrowRight, CheckCircle2, AlertTriangle, Play, HelpCircle, RefreshCw } from "lucide-react";

// Web Audio API Synthesizer for retro sounds (no assets needed, works offline)
function playSound(type: "correct" | "incorrect" | "victory") {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (type === "correct") {
      // Warm chime chord
      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc1.type = "triangle";
      osc2.type = "sine";
      
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
      
      osc2.frequency.setValueAtTime(659.25, now); // E5
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.15); // E6
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } else if (type === "incorrect") {
      // Soft low buzzer
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.25);
      
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "victory") {
      // Sweet arpeggio
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.12, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.3);
      });
    }
  } catch (err) {
    // Fail silently if audio context is blocked
    console.warn("AudioContext error: ", err);
  }
}

interface PracticeArenaProps {
  stats: UserStats;
  onLevelComplete: (levelId: string, coinsEarned: number) => void;
}

export default function PracticeArena({ stats, onLevelComplete }: PracticeArenaProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [reorderedWords, setReorderedWords] = useState<string[]>([]);
  const [errorWordSelected, setErrorWordSelected] = useState<string | null>(null);
  const [errorReplacementWord, setErrorReplacementWord] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [levelScore, setLevelScore] = useState<number>(0); // count of correct answers

  // Select Level
  const activeLevel = levelsData.find(l => l.id === selectedLevelId);
  const currentQuestion = activeLevel?.questions[currentQuestionIdx];

  const handleStartLevel = (levelId: string) => {
    setSelectedLevelId(levelId);
    setCurrentQuestionIdx(0);
    resetQuestionState();
    setLevelScore(0);
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setReorderedWords([]);
    setErrorWordSelected(null);
    setErrorReplacementWord(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowExplanation(false);
  };

  // Helper to split sentence for reordering or finding errors
  const initializeQuestionSpecifics = (question: Question) => {
    if (question.type === "reorder" && reorderedWords.length === 0 && question.words) {
      // Shuffle words once when rendering
      setReorderedWords([]);
    }
  };

  // Word Clicking for "Reorder" type
  const handleWordClickReorder = (word: string) => {
    if (isAnswerChecked) return;
    if (reorderedWords.includes(word)) {
      setReorderedWords(reorderedWords.filter(w => w !== word));
    } else {
      setReorderedWords([...reorderedWords, word]);
    }
  };

  const checkAnswer = () => {
    if (!currentQuestion) return;
    let correct = false;

    if (currentQuestion.type === "fill-blank") {
      correct = selectedOption?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    } else if (currentQuestion.type === "reorder") {
      // Build answer from reordered words
      const playerAnswer = reorderedWords.join(" ").replace(/\s+([.,?!])/g, '$1').trim();
      const targetAnswer = currentQuestion.correctAnswer.trim();
      
      // Lenient comparison (remove spaces, dots, lowercase)
      const cleanStr = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
      correct = cleanStr(playerAnswer) === cleanStr(targetAnswer);
    } else if (currentQuestion.type === "find-error") {
      const isErrorWordCorrect = errorWordSelected === currentQuestion.errorWord;
      const isReplacementCorrect = errorReplacementWord === currentQuestion.correctWord;
      correct = isErrorWordCorrect && isReplacementCorrect;
    }

    setIsCorrect(correct);
    setIsAnswerChecked(true);
    setShowExplanation(true);
    
    if (correct) {
      setLevelScore(prev => prev + 1);
      playSound("correct");
    } else {
      playSound("incorrect");
    }
  };

  const handleNextQuestion = () => {
    if (!activeLevel) return;
    if (currentQuestionIdx + 1 < activeLevel.questions.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      resetQuestionState();
    } else {
      // End of Level
      const levelId = activeLevel.id;
      const coinsEarned = activeLevel.rewardCoins;
      const wasCompleted = stats.completedLevels.includes(levelId);
      
      // Play level victory noise
      playSound("victory");
      
      // Call standard completion handler
      onLevelComplete(levelId, wasCompleted ? Math.round(coinsEarned * 0.3) : coinsEarned);
      setSelectedLevelId(null); // Go back to level select
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 1. Level List View */}
      <AnimatePresence mode="wait">
        {!selectedLevelId ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 py-4">
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-2">
                <span>⚔️</span> Đấu Trường To Be (Practice Arena)
              </h2>
              <p className="text-sm text-slate-500 max-w-lg mx-auto">
                Chinh phục các thử thách từ dễ tới khó để tích lũy hàng trăm Xu Vàng và làm chủ Động từ To Be!
              </p>
            </div>

            {/* Grid of levels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {levelsData.map((level, index) => {
                const isCompleted = stats.completedLevels.includes(level.id);
                const isLocked = index > 0 && !stats.completedLevels.includes(levelsData[index - 1].id);

                return (
                  <div
                    key={level.id}
                    id={`level-card-${level.id}`}
                    className={`relative bg-white rounded-2xl border transition-all overflow-hidden flex flex-col justify-between ${
                      isLocked
                        ? "border-slate-150 opacity-60 cursor-not-allowed select-none bg-slate-50/50"
                        : "border-slate-200/80 hover:shadow-md hover:-translate-y-0.5 shadow-xs"
                    }`}
                  >
                    {/* Level Reward Banner */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-600 font-bold text-xs px-2.5 py-1 rounded-full shadow-2xs">
                      <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
                      <span>+{level.rewardCoins}</span>
                    </div>

                    <div className="p-5 space-y-3 flex-1">
                      {/* Emoji & Badges */}
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 text-2xl rounded-xl flex items-center justify-center shadow-2xs shrink-0">
                          {level.emoji}
                        </div>
                        <div>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            level.difficulty === "Dễ" 
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                              : level.difficulty === "Trung bình"
                              ? "bg-amber-50 text-amber-600 border border-amber-100"
                              : "bg-red-50 text-red-600 border border-red-100"
                          }`}>
                            {level.difficulty}
                          </span>
                          <h3 className="text-base font-bold text-slate-800 mt-1 line-clamp-1">{level.vietnameseTitle}</h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed min-h-[3rem] line-clamp-2">
                        {level.description}
                      </p>
                    </div>

                    {/* Footer / Launch button */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      {isCompleted ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đã hoàn thành
                        </span>
                      ) : isLocked ? (
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                          🔒 Khóa (Cần vượt cấp trước)
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
                          ✨ Sẵn sàng thách đấu
                        </span>
                      )}

                      <button
                        id={`btn-play-level-${level.id}`}
                        onClick={() => !isLocked && handleStartLevel(level.id)}
                        disabled={isLocked}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
                          isLocked
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                      >
                        {isCompleted ? "Thử lại" : "Chiến đấu"} <Play className="w-3 h-3 fill-white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          // 2. Active Level Game Screen
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 md:p-8 space-y-6"
          >
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <button
                  id="btn-quit-level"
                  onClick={() => setSelectedLevelId(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1"
                >
                  ← Thoát thử thách
                </button>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="text-xl">{activeLevel?.emoji}</span> {activeLevel?.vietnameseTitle}
                </h3>
              </div>
              
              {/* Question count */}
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold">Câu hỏi</span>
                <span className="text-base font-extrabold text-slate-700">
                  {currentQuestionIdx + 1} / {activeLevel?.questions.length}
                </span>
              </div>
            </div>

            {/* Level progress bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{ width: `${((currentQuestionIdx + 1) / (activeLevel?.questions.length || 1)) * 100}%` }}
              />
            </div>

            {/* Current Question Canvas */}
            {currentQuestion && (
              <div className="space-y-6 py-2">
                {/* Visual cue for what type of question */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-orange-500" />
                  <span>
                    {currentQuestion.type === "fill-blank" && "Hãy điền từ thích hợp vào chỗ trống"}
                    {currentQuestion.type === "reorder" && "Hãy sắp xếp các từ thành câu đúng"}
                    {currentQuestion.type === "find-error" && "Tìm lỗi sai của câu dưới đây"}
                  </span>
                </div>

                {/* 2.1 RENDER: FILL IN THE BLANK */}
                {currentQuestion.type === "fill-blank" && (
                  <div className="space-y-6">
                    <div className="text-center p-6 md:p-10 bg-slate-50 border border-slate-100 rounded-2xl">
                      <p className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-wide font-sans">
                        {currentQuestion.sentence.split("___")[0]}
                        <span className="border-b-4 border-orange-400 px-4 text-orange-600 inline-block min-w-[3rem] text-center mx-1 bg-orange-50/50 rounded-xs">
                          {selectedOption || "___"}
                        </span>
                        {currentQuestion.sentence.split("___")[1]}
                      </p>
                      <p className="text-sm text-slate-400 italic mt-3">({currentQuestion.translation})</p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {(currentQuestion.options || ["am", "is", "are"]).map((opt) => {
                        const isSelected = selectedOption === opt;
                        let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

                        if (isAnswerChecked) {
                          const isCorrectOpt = opt.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
                          if (isCorrectOpt) {
                            btnStyle = "bg-emerald-500 border-emerald-600 text-white font-extrabold";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-500 border-rose-600 text-white font-extrabold";
                          } else {
                            btnStyle = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
                          }
                        } else if (isSelected) {
                          btnStyle = "bg-orange-50 border-orange-500 text-orange-900 font-extrabold ring-3 ring-orange-100";
                        }

                        return (
                          <button
                            key={opt}
                            id={`option-btn-${opt}`}
                            onClick={() => !isAnswerChecked && setSelectedOption(opt)}
                            disabled={isAnswerChecked}
                            className={`p-4 rounded-2xl border text-center text-lg font-bold transition-all shadow-2xs ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2.2 RENDER: WORD REORDER */}
                {currentQuestion.type === "reorder" && (
                  <div className="space-y-6">
                    {/* Words Scrambled & Answer Zone */}
                    <div className="space-y-3">
                      <div className="p-1 text-xs text-slate-400 font-bold">Lược đồ câu trả lời của bạn:</div>
                      <div className="p-5 bg-slate-50 border border-dashed border-slate-200 rounded-2xl min-h-[4rem] flex flex-wrap gap-2 items-center justify-center">
                        {reorderedWords.length === 0 ? (
                          <span className="text-slate-400 text-sm italic">Hãy nhấn vào các từ bên dưới để ghép câu</span>
                        ) : (
                          reorderedWords.map((word, idx) => (
                            <button
                              key={`${word}-${idx}`}
                              onClick={() => !isAnswerChecked && handleWordClickReorder(word)}
                              disabled={isAnswerChecked}
                              className="px-4 py-2 bg-white hover:bg-rose-50 hover:text-rose-600 border border-slate-200 rounded-xl font-bold text-sm shadow-2xs cursor-pointer transition-colors"
                            >
                              {word}
                            </button>
                          ))
                        )}
                      </div>
                      <p className="text-sm text-slate-400 italic text-center">({currentQuestion.translation})</p>
                    </div>

                    {/* Pool of words */}
                    <div className="space-y-2">
                      <div className="p-1 text-xs text-slate-400 font-bold">Các thẻ từ có sẵn:</div>
                      <div className="flex flex-wrap gap-2.5 justify-center p-4 bg-slate-100/50 rounded-2xl">
                        {(currentQuestion.words || []).map((word, idx) => {
                          const isUsed = reorderedWords.includes(word);
                          return (
                            <button
                              key={`${word}-pool-${idx}`}
                              onClick={() => !isAnswerChecked && handleWordClickReorder(word)}
                              disabled={isUsed || isAnswerChecked}
                              className={`px-4 py-2.5 rounded-xl font-bold text-sm shadow-2xs transition-all ${
                                isUsed
                                  ? "bg-slate-100 text-slate-300 border border-slate-150 cursor-not-allowed"
                                  : "bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              {word}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2.3 RENDER: FIND ERROR */}
                {currentQuestion.type === "find-error" && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="text-center p-6 bg-rose-50/50 border border-rose-100 rounded-2xl">
                        <p className="text-sm text-rose-500 font-bold flex items-center justify-center gap-1 mb-3">
                          <AlertTriangle className="w-4 h-4" /> Bấm vào đúng một từ bị lỗi sai ngữ pháp dưới đây:
                        </p>
                        {/* Split words */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          {(currentQuestion.sentenceWithError || "").split(" ").map((word, index) => {
                            // strip punctuation for error match
                            const cleanWord = word.replace(/[.,?!]/g, "");
                            const isSelected = errorWordSelected === cleanWord;
                            
                            let btnStyle = "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800";
                            if (isAnswerChecked) {
                              const isTargetError = cleanWord === currentQuestion.errorWord;
                              if (isTargetError) {
                                btnStyle = "bg-emerald-500 border-emerald-600 text-white font-extrabold";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-500 border-rose-600 text-white font-extrabold";
                              } else {
                                btnStyle = "bg-slate-100 border-slate-150 text-slate-300 opacity-60";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-rose-50 border-rose-400 text-rose-900 font-extrabold ring-3 ring-rose-100";
                            }

                            return (
                              <button
                                key={`${word}-${index}`}
                                onClick={() => !isAnswerChecked && setErrorWordSelected(cleanWord)}
                                disabled={isAnswerChecked}
                                className={`px-4 py-2 text-base font-bold rounded-xl border transition-all shadow-2xs ${btnStyle}`}
                              >
                                {word}
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-sm text-slate-400 italic mt-3">({currentQuestion.translation})</p>
                      </div>
                    </div>

                    {/* Step 2: replacement selection */}
                    {errorWordSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200"
                      >
                        <p className="text-xs font-extrabold text-slate-500 uppercase">
                          Sửa từ "{errorWordSelected}" bằng từ chính xác nào?
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {["am", "is", "are"].map((verb) => {
                            const isSelected = errorReplacementWord === verb;
                            let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

                            if (isAnswerChecked) {
                              const isTargetCorrect = verb === currentQuestion.correctWord;
                              if (isTargetCorrect) {
                                btnStyle = "bg-emerald-500 border-emerald-600 text-white font-bold";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-500 border-rose-600 text-white font-bold";
                              } else {
                                btnStyle = "bg-slate-100 text-slate-300 border-slate-150";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-orange-500 text-white font-bold border-orange-600";
                            }

                            return (
                              <button
                                key={verb}
                                onClick={() => !isAnswerChecked && setErrorReplacementWord(verb)}
                                disabled={isAnswerChecked}
                                className={`p-2.5 rounded-xl border text-sm transition-all font-semibold ${btnStyle}`}
                              >
                                {verb}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Answer check bar / result feedback */}
            <div className="border-t border-slate-100 pt-6 space-y-4">
              {!isAnswerChecked ? (
                <button
                  id="btn-check-arena-answer"
                  onClick={checkAnswer}
                  disabled={
                    (currentQuestion?.type === "fill-blank" && !selectedOption) ||
                    (currentQuestion?.type === "reorder" && reorderedWords.length === 0) ||
                    (currentQuestion?.type === "find-error" && (!errorWordSelected || !errorReplacementWord))
                  }
                  className={`w-full py-3 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-2 ${
                    (currentQuestion?.type === "fill-blank" && selectedOption) ||
                    (currentQuestion?.type === "reorder" && reorderedWords.length > 0) ||
                    (currentQuestion?.type === "find-error" && errorWordSelected && errorReplacementWord)
                      ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-100"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Kiểm Tra Đáp Án
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  {/* Banner */}
                  <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    isCorrect 
                      ? "bg-emerald-50 border-emerald-200 text-emerald-950" 
                      : "bg-rose-50 border-rose-200 text-rose-950"
                  }`}>
                    {isCorrect ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className="font-bold text-base">{isCorrect ? "Rất xuất sắc! Chính xác rồi! 🎉" : "Chưa chính xác mất rồi! 😢"}</h4>
                      <p className="text-xs text-slate-600 mt-1">Đáp án đúng là: <strong className="font-bold">{currentQuestion?.correctAnswer}</strong></p>
                    </div>
                  </div>

                  {/* Detailed Explanation */}
                  {showExplanation && (
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wide">Giải thích chi tiết</span>
                      <p className="text-xs text-slate-500 italic">Dịch nghĩa: "{currentQuestion?.translation}"</p>
                      <p className="text-sm text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-150">
                        💡 {currentQuestion?.explanation}
                      </p>
                    </div>
                  )}

                  {/* Next action button */}
                  <button
                    id="btn-arena-next"
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {currentQuestionIdx + 1 === activeLevel?.questions.length ? "Hoàn Thành Thách Đấu" : "Câu Tiếp Theo"}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
