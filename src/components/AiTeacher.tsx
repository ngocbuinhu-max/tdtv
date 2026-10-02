import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, Question } from "../types";
import { Send, Sparkles, CheckCircle2, AlertCircle, Bot, User, HelpCircle, ArrowRight, Info, BookOpen } from "lucide-react";

export default function AiTeacher({ onAwardCoins }: { onAwardCoins: (amount: number) => void }) {
  const [activeSubTab, setActiveSubTab] = useState<"sandbox" | "chat">("sandbox");
  
  // AI Sandbox States
  const [sandboxInput, setSandboxInput] = useState<string>("");
  const [sandboxLoading, setSandboxLoading] = useState<boolean>(false);
  const [sandboxResult, setSandboxResult] = useState<{
    isCorrect: boolean;
    feedback: string;
    explanation: string;
    correctedSentence: string;
  } | null>(null);
  const [sandboxError, setSandboxError] = useState<string | null>(null);

  // AI Chat States
  const [chatInput, setChatInput] = useState<string>("");
  const [chatLoading, setChatLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);

  // Dynamic Quiz States (generated via chat/topic)
  const [dynamicQuestions, setDynamicQuestions] = useState<Question[]>([]);
  const [currentDynamicIdx, setCurrentDynamicIdx] = useState<number>(0);
  const [dynamicSelectedOpt, setDynamicSelectedOpt] = useState<string | null>(null);
  const [dynamicChecked, setDynamicChecked] = useState<boolean>(false);
  const [dynamicCorrect, setDynamicCorrect] = useState<boolean>(false);
  const [topicInput, setTopicInput] = useState<string>("");
  const [topicLoading, setTopicLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize Welcome Message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          sender: "bot",
          text: "Xin chào! Tớ là giáo viên phụ tá Ong Bee 🐝. Tớ ở đây để giúp cậu gỡ rối mọi thắc mắc về động từ tobe (am, is, are). Cậu có thể hỏi tớ bất kỳ câu hỏi ngữ pháp nào, hoặc gõ một chủ đề cậu yêu thích xuống dưới (như 'khủng long 🦖', 'bóng đá ⚽', 'mèo con 🐱') để tớ biên soạn riêng một đề thi gồm 3 câu thử thách cậu nhé! ✨",
          timestamp: new Date()
        }
      ]);
    }
  }, [messages]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  // Sandbox: Submit sentence for evaluation
  const handleCheckSentence = async () => {
    if (!sandboxInput.trim()) return;
    setSandboxLoading(true);
    setSandboxResult(null);
    setSandboxError(null);

    try {
      const response = await fetch("/api/ai/correct-sentence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence: sandboxInput.trim() })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Không thể kết nối đến máy chủ AI.");
      }

      const data = await response.json();
      setSandboxResult(data);
      
      // Award 20 coins for practicing writing
      onAwardCoins(20);
    } catch (err: any) {
      setSandboxError(err.message || "Đã xảy ra lỗi khi kiểm tra câu.");
    } finally {
      setSandboxLoading(false);
    }
  };

  // Chat: Send message to Bot Bee
  const handleSendMessage = async (textToSend?: string) => {
    const finalMsg = textToSend || chatInput;
    if (!finalMsg.trim() || chatLoading) return;

    if (!textToSend) setChatInput("");

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: finalMsg.trim(),
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatLoading(true);
    setChatError(null);

    try {
      // Map ChatMessage format to prompt history format
      const history = messages
        .filter(m => m.id !== "welcome")
        .map(m => ({
          role: m.sender === "user" ? ("user" as const) : ("model" as const),
          text: m.text
        }));

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMsg.trim(), history })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Không thể tải phản hồi từ Ong Bee.");
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setChatError(err.message || "Lỗi kết nối.");
    } finally {
      setChatLoading(false);
    }
  };

  // Generate dynamic questions based on a topic
  const handleGenerateTopicQuestions = async (selectedTopic?: string) => {
    const topic = selectedTopic || topicInput;
    if (!topic.trim()) return;

    setTopicLoading(true);
    setDynamicQuestions([]);
    setDynamicChecked(false);
    setDynamicSelectedOpt(null);

    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Không thể lập đề thi.");
      }

      const data = await response.json();
      
      // Convert AI response questions into game questions format
      if (data.questions && Array.isArray(data.questions)) {
        const formatted: Question[] = data.questions.map((q: any, idx: number) => ({
          id: `ai-q-${idx}-${Date.now()}`,
          type: "fill-blank",
          sentence: q.sentenceWithBlank,
          options: ["am", "is", "are"],
          correctAnswer: q.correctOption,
          translation: q.translation,
          explanation: q.explanation
        }));
        
        setDynamicQuestions(formatted);
        setCurrentDynamicIdx(0);
        
        // Append a notification message to the chat
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: "bot",
            text: `Tớ đã biên soạn xong 3 câu hỏi thuộc chủ đề "${topic}" rồi nè! Hãy thử giải đố ở chiếc bảng bên cạnh nhé! 🐝✨`,
            timestamp: new Date()
          }
        ]);
        
        if (!selectedTopic) setTopicInput("");
      }
    } catch (err: any) {
      alert("Lỗi khi tạo đề: " + err.message);
    } finally {
      setTopicLoading(false);
    }
  };

  const handleCheckDynamicAnswer = () => {
    if (!dynamicSelectedOpt) return;
    const currentQ = dynamicQuestions[currentDynamicIdx];
    const isCorrect = dynamicSelectedOpt.toLowerCase() === currentQ.correctAnswer.toLowerCase();
    
    setDynamicCorrect(isCorrect);
    setDynamicChecked(true);

    if (isCorrect) {
      onAwardCoins(10); // Award 10 coins for solving AI generated question correctly
    }
  };

  const handleNextDynamic = () => {
    if (currentDynamicIdx + 1 < dynamicQuestions.length) {
      setCurrentDynamicIdx(currentDynamicIdx + 1);
      setDynamicSelectedOpt(null);
      setDynamicChecked(false);
    } else {
      // Finished all AI questions
      setDynamicQuestions([]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Tab Switcher */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200/85 flex shadow-sm">
        <button
          id="tab-sandbox-btn"
          onClick={() => setActiveSubTab("sandbox")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "sandbox"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="w-4 h-4" /> Luyện Viết Tự Do (AI Sandbox)
        </button>
        <button
          id="tab-chat-btn"
          onClick={() => setActiveSubTab("chat")}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === "chat"
              ? "bg-amber-500 text-white shadow-xs"
              : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Bot className="w-4 h-4" /> Hỏi Đáp & Tạo Đề (AI Bee Mascot)
        </button>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: WRITING SANDBOX */}
        {activeSubTab === "sandbox" && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-6"
          >
            {/* Input pane */}
            <div className="md:col-span-3 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="text-amber-500 w-5 h-5" />
                  Sân Chơi Luyện Viết To Be
                </h3>
                <p className="text-xs text-slate-400">
                  Hãy viết bất kỳ một câu tiếng Anh nào có chứa động từ "To Be" (am, is, are) rồi bấm gửi. Thầy giáo AI sẽ đánh giá ngữ pháp cho cậu ngay!
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Câu tiếng Anh của bạn:</label>
                <textarea
                  id="sandbox-textarea"
                  value={sandboxInput}
                  onChange={(e) => setSandboxInput(e.target.value)}
                  placeholder="Ví dụ: My dogs is playing in the park..."
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-hidden focus:border-amber-400 focus:bg-white resize-none font-medium"
                />
              </div>

              {/* Suggestions */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Gợi ý chủ đề viết thử:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Giới thiệu tên tuổi",
                    "Khen một con vật đáng yêu",
                    "Nói về thời tiết hôm nay",
                    "Nói về việc học tiếng Anh"
                  ].map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (i === 0) setSandboxInput("I am ten years old and my name is Bin.");
                        if (i === 1) setSandboxInput("Our cat are extremely fluffy and cute.");
                        if (i === 2) setSandboxInput("The sky is blue and it are sunny.");
                        if (i === 3) setSandboxInput("We is studying English with teacher Bee.");
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 font-bold rounded-lg border border-slate-150 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <button
                id="btn-sandbox-submit"
                onClick={handleCheckSentence}
                disabled={sandboxLoading || !sandboxInput.trim()}
                className={`w-full py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
                  sandboxInput.trim() && !sandboxLoading
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs shadow-amber-100"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-150"
                }`}
              >
                {sandboxLoading ? "🤖 Đang chấm bài..." : "Kiểm Tra Ngay (+20 🪙)"}
              </button>
            </div>

            {/* Results pane */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 min-h-[16rem] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {sandboxLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="my-auto text-center space-y-3"
                    >
                      <div className="relative w-12 h-12 mx-auto">
                        <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
                        <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Giáo viên AI đang xem xét câu viết và phân tích đại từ/động từ của bạn...
                      </p>
                    </motion.div>
                  ) : sandboxResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Status tag */}
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          sandboxResult.isCorrect
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-rose-50 border-rose-100 text-rose-700"
                        }`}>
                          {sandboxResult.isCorrect ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span>ĐÚNG NGỮ PHÁP!</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                              <span>CẦN SỬA LẠI</span>
                            </>
                          )}
                        </div>

                        {/* Feedback quote */}
                        <p className="text-sm font-bold text-slate-800 leading-snug">
                          "{sandboxResult.feedback}"
                        </p>

                        {/* Sentence display comparing */}
                        <div className="bg-white p-3 rounded-xl border border-slate-150 space-y-1.5 text-xs">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block">CÂU CỦA BẠN:</span>
                            <span className="text-slate-700 font-medium">{sandboxInput}</span>
                          </div>
                          {!sandboxResult.isCorrect && (
                            <div className="border-t border-slate-100 pt-1.5">
                              <span className="text-[9px] text-emerald-500 font-bold block">GỢI Ý SỬA LẠI:</span>
                              <span className="text-emerald-700 font-bold">{sandboxResult.correctedSentence}</span>
                            </div>
                          )}
                        </div>

                        {/* Detailed explanation in Vietnamese */}
                        <div className="text-xs text-slate-600 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50 leading-relaxed max-h-48 overflow-y-auto">
                          💡 <strong>Phân tích lý thuyết:</strong> {sandboxResult.explanation}
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-400 italic text-center mt-2">
                        Tiếp tục luyện viết nhiều câu khác để tích lũy thêm thật nhiều xu vàng nhé!
                      </div>
                    </motion.div>
                  ) : sandboxError ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="my-auto text-center space-y-2 text-rose-500"
                    >
                      <AlertCircle className="w-8 h-8 mx-auto" />
                      <p className="text-xs font-bold">{sandboxError}</p>
                      <p className="text-[10px] text-slate-400">
                        Hệ thống gặp sự cố tải. Đừng lo, bạn vẫn có thể chơi các chế độ khác của game bình thường!
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="my-auto text-center space-y-2 text-slate-400 p-4"
                    >
                      <Bot className="w-10 h-10 mx-auto opacity-50" />
                      <h4 className="font-bold text-xs text-slate-500">Bảng Đánh Giá Đang Chờ</h4>
                      <p className="text-[10px] max-w-[200px] mx-auto leading-relaxed">
                        Nhập câu của cậu ở ô bên trái rồi bấm gửi, giáo án phân tích chi tiết sẽ xuất hiện ngay tại đây!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: CHAT BOT BEE + TOPIC QUIZZES */}
        {activeSubTab === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-6"
          >
            {/* Chat Simulator Pane */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/85 shadow-sm overflow-hidden flex flex-col h-[28rem]">
              {/* Chat Header */}
              <div className="p-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold text-sm flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-2xs">
                    <span>🐝</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950">Ong Vàng Bee 🐝</h4>
                    <span className="text-[10px] text-slate-800 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Đang trực tuyến
                    </span>
                  </div>
                </div>
                <Info className="w-4 h-4 text-slate-700" title="Bee chuyên giải đáp về am, is, are" />
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
                {messages.map((msg) => {
                  const isBot = msg.sender === "bot";
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-2xs text-xs ${
                        isBot ? "bg-amber-100" : "bg-orange-100"
                      }`}>
                        {isBot ? "🐝" : "👤"}
                      </div>
                      <div className={`p-3 rounded-2xl text-xs leading-relaxed font-medium shadow-2xs ${
                        isBot 
                          ? "bg-white border border-slate-200 text-slate-800 rounded-tl-xs" 
                          : "bg-slate-800 text-white rounded-tr-xs"
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}

                {chatLoading && (
                  <div className="flex gap-2 mr-auto items-center max-w-[80%]">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-xs shadow-2xs">
                      🐝
                    </div>
                    <div className="p-3 bg-white border border-slate-150 rounded-2xl rounded-tl-xs text-xs flex gap-1 shadow-2xs">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Chat Presets */}
              <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                {[
                  "Khi nào dùng am, is, are?",
                  "Sự khác nhau giữa is và are?",
                  "Tạo 3 câu hỏi chủ đề Siêu Anh Hùng 🦸"
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (preset.includes("Siêu Anh Hùng")) {
                        handleGenerateTopicQuestions("Siêu Anh Hùng");
                      } else {
                        handleSendMessage(preset);
                      }
                    }}
                    className="px-3 py-1 bg-white hover:bg-slate-50 text-[10px] font-bold text-slate-600 rounded-full border border-slate-200 shrink-0 transition-colors shadow-2xs cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Message input */}
              <div className="p-3 bg-white border-t border-slate-200 flex gap-2 shrink-0">
                <input
                  type="text"
                  placeholder="Hỏi Bee điều gì đó về am, is, are..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-hidden focus:border-amber-400 focus:bg-white font-medium"
                />
                <button
                  id="btn-chat-send"
                  onClick={() => handleSendMessage()}
                  className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Custom Quiz Builder Pane */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Creator interface */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <BookOpen className="text-amber-500 w-4 h-4" />
                    Tạo đề theo sở thích
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Gõ bất kỳ từ khóa nào bạn thích (bóng đá, siêu xe, búp bê Barbie, động vật) để AI soạn riêng đề thi cho bạn!
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Chủ đề: Minecraft, Dinosaurs..."
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-hidden focus:border-amber-400 focus:bg-white font-bold"
                  />
                  <button
                    id="btn-topic-quiz-create"
                    onClick={() => handleGenerateTopicQuestions()}
                    disabled={topicLoading || !topicInput.trim()}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      topicInput.trim() && !topicLoading
                        ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-400 border border-slate-150 cursor-not-allowed"
                    }`}
                  >
                    {topicLoading ? "Đang soạn..." : "Soạn Đề"}
                  </button>
                </div>
              </div>

              {/* Dynamic Interactive Quiz Box */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-5 min-h-[14rem] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  {topicLoading ? (
                    <div className="my-auto text-center space-y-2.5 p-4">
                      <div className="relative w-10 h-10 mx-auto">
                        <div className="absolute inset-0 border-4 border-amber-200 rounded-full" />
                        <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold">
                        AI đang sáng tác các câu tiếng Anh siêu độc đáo theo chủ đề của bạn...
                      </p>
                    </div>
                  ) : dynamicQuestions.length > 0 ? (
                    <motion.div
                      key="active-quiz"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4 flex-1 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                          <span>📝 ĐỀ THI TỰ CHỌN</span>
                          <span>Câu {currentDynamicIdx + 1} / {dynamicQuestions.length}</span>
                        </div>

                        {/* Sentence display */}
                        <div className="p-4 bg-white rounded-xl border border-slate-150 text-center">
                          <p className="text-sm font-extrabold text-slate-800">
                            {dynamicQuestions[currentDynamicIdx].sentence.split("___")[0]}
                            <span className="border-b-2 border-amber-400 px-2 text-amber-600 font-black">
                              {dynamicSelectedOpt || "___"}
                            </span>
                            {dynamicQuestions[currentDynamicIdx].sentence.split("___")[1]}
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-1.5">
                            ({dynamicQuestions[currentDynamicIdx].translation})
                          </span>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-3 gap-2">
                          {["am", "is", "are"].map((verb) => {
                            const isSelected = dynamicSelectedOpt === verb;
                            let btnStyle = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";

                            if (dynamicChecked) {
                              const isCorrectAnswer = verb === dynamicQuestions[currentDynamicIdx].correctAnswer;
                              if (isCorrectAnswer) {
                                btnStyle = "bg-emerald-500 border-emerald-600 text-white font-bold";
                              } else if (isSelected) {
                                btnStyle = "bg-rose-500 border-rose-600 text-white font-bold";
                              } else {
                                btnStyle = "bg-slate-100 text-slate-300 border-slate-150";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-amber-100 border-amber-400 text-amber-900 font-extrabold ring-2 ring-amber-50";
                            }

                            return (
                              <button
                                key={verb}
                                onClick={() => !dynamicChecked && setDynamicSelectedOpt(verb)}
                                disabled={dynamicChecked}
                                className={`py-2 rounded-xl border text-xs font-bold transition-all ${btnStyle}`}
                              >
                                {verb}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation panel */}
                        {dynamicChecked && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className={`p-3 rounded-xl border ${
                              dynamicCorrect ? "bg-emerald-50 border-emerald-100 text-emerald-900" : "bg-rose-50 border-rose-100 text-rose-900"
                            } text-[11px] leading-relaxed`}
                          >
                            <span className="font-bold block mb-0.5">
                              {dynamicCorrect ? "🎉 Tuyệt hảo! Chính xác (+10 🪙)" : "😢 Chưa chính xác rồi!"}
                            </span>
                            {dynamicQuestions[currentDynamicIdx].explanation}
                          </motion.div>
                        )}
                      </div>

                      {/* Footer actions */}
                      <div className="pt-2">
                        {!dynamicChecked ? (
                          <button
                            id="btn-check-dynamic"
                            onClick={handleCheckDynamicAnswer}
                            disabled={!dynamicSelectedOpt}
                            className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                              dynamicSelectedOpt
                                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            Kiểm Tra Đáp Án
                          </button>
                        ) : (
                          <button
                            id="btn-next-dynamic"
                            onClick={handleNextDynamic}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                          >
                            {currentDynamicIdx + 1 === dynamicQuestions.length ? "Hoàn Thành" : "Câu Tiếp Theo"}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="my-auto text-center space-y-1.5 text-slate-400 p-4">
                      <HelpCircle className="w-8 h-8 mx-auto opacity-50" />
                      <h4 className="font-bold text-xs text-slate-500">Bảng Giải Đố Trống</h4>
                      <p className="text-[10px] max-w-[180px] mx-auto leading-relaxed">
                        Gõ một chủ đề vào ô soạn đề bên trên để nhận 3 câu trắc nghiệm cực vui kiếm tiền xu nhé!
                      </p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
