import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Trophy, Zap, Play, RotateCcw, ShieldAlert, Sparkles, Coins } from "lucide-react";

// Synthesizer sounds for arcade action
function playArcadeSound(type: "laser" | "explosion" | "hit" | "gameover") {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = audioCtx.currentTime;

    if (type === "laser") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "explosion") {
      // Noise buffer for explosion
      const bufferSize = audioCtx.sampleRate * 0.3;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(10, now + 0.3);

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.3);
    } else if (type === "hit") {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.setValueAtTime(60, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "gameover") {
      const notes = [220, 196, 174, 146]; // A3, G3, F3, D3
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);
        gain.gain.setValueAtTime(0.1, now + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.15 + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.2);
      });
    }
  } catch (err) {
    // Silence audio error
  }
}

interface AsteroidSentence {
  sentence: string;
  correctAnswer: "am" | "is" | "are";
  translation: string;
}

// Huge pool of simple sentences for arcade
const arcadePool: AsteroidSentence[] = [
  { sentence: "The cat ___ sleeping on the chair.", correctAnswer: "is", translation: "Chú mèo đang ngủ trên ghế." },
  { sentence: "I ___ happy to meet you.", correctAnswer: "am", translation: "Tớ rất vui được gặp cậu." },
  { sentence: "They ___ playing soccer in the park.", correctAnswer: "are", translation: "Họ đang chơi bóng đá ở công viên." },
  { sentence: "You ___ a very nice person.", correctAnswer: "are", translation: "Bạn là một người rất tốt bụng." },
  { sentence: "My father ___ washing the car.", correctAnswer: "is", translation: "Bố tớ đang rửa xe." },
  { sentence: "We ___ excited about the school trip.", correctAnswer: "are", translation: "Chúng tớ rất hào hứng về chuyến dã ngoại của trường." },
  { sentence: "The apple ___ red and sweet.", correctAnswer: "is", translation: "Quả táo thì màu đỏ và ngọt." },
  { sentence: "I ___ not a bad student.", correctAnswer: "am", translation: "Tớ không phải là một học sinh tồi." },
  { sentence: "The books ___ on the bookshelf.", correctAnswer: "are", translation: "Những cuốn sách ở trên giá sách." },
  { sentence: "Elephants ___ strong animals.", correctAnswer: "are", translation: "Những con voi là động vật khỏe mạnh." },
  { sentence: "She ___ writing a letter to her friend.", correctAnswer: "is", translation: "Cô ấy đang viết thư cho bạn." },
  { sentence: "It ___ a beautiful day today.", correctAnswer: "is", translation: "Hôm nay trời thật là đẹp." },
  { sentence: "Birds ___ singing in the trees.", correctAnswer: "are", translation: "Chim đang hót trên cây." },
  { sentence: "You and I ___ best friends.", correctAnswer: "are", translation: "Bạn và tôi là bạn thân nhất." },
  { sentence: "The baby ___ crying for milk.", correctAnswer: "is", translation: "Đứa bé đang khóc đòi sữa." },
  { sentence: "Dogs ___ faithful pets.", correctAnswer: "are", translation: "Chó là thú cưng trung thành." },
  { sentence: "The classroom ___ warm and bright.", correctAnswer: "is", translation: "Lớp học thì ấm áp và tươi sáng." },
  { sentence: "___ you ready for the game?", correctAnswer: "are", translation: "Bạn đã sẵn sàng cho trò chơi chưa?" },
  { sentence: "___ he your english teacher?", correctAnswer: "is", translation: "Thầy ấy có phải thầy giáo tiếng Anh của bạn không?" },
  { sentence: "Where ___ we going today?", correctAnswer: "are", translation: "Chúng ta đang đi đâu hôm nay thế?" },
  { sentence: "My hands ___ cold.", correctAnswer: "are", translation: "Bàn tay của tớ lạnh quá." },
  { sentence: "The train ___ arriving at the station.", correctAnswer: "is", translation: "Tàu hỏa đang đến ga." },
  { sentence: "I ___ older than you.", correctAnswer: "am", translation: "Tớ lớn tuổi hơn cậu." },
  { sentence: "Water ___ essential for life.", correctAnswer: "is", translation: "Nước rất cần thiết cho sự sống." },
  { sentence: "These flowers ___ beautiful.", correctAnswer: "are", translation: "Những bông hoa này thật đẹp." },
  { sentence: "My brother ___ riding a bicycle.", correctAnswer: "is", translation: "Anh trai tớ đang đi xe đạp." },
  { sentence: "We ___ proud of your work.", correctAnswer: "are", translation: "Chúng tớ tự hào về bài làm của cậu." },
  { sentence: "The pizza ___ delicious.", correctAnswer: "is", translation: "Bánh pizza thật ngon." },
  { sentence: "The keys ___ in my bag.", correctAnswer: "are", translation: "Những chiếc chìa khóa ở trong túi của tớ." },
  { sentence: "My school ___ very big.", correctAnswer: "is", translation: "Trường học của tớ rất to." }
];

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export default function ArcadeGame({ onAddCoins }: { onAddCoins: (amount: number) => void }) {
  const [gameState, setGameState] = useState<"menu" | "playing" | "gameover">("menu");
  const [currentSentence, setCurrentSentence] = useState<AsteroidSentence | null>(null);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [asteroidY, setAsteroidY] = useState<number>(0); // 0 (top) to 100 (bottom)
  const [laserFired, setLaserFired] = useState<"am" | "is" | "are" | null>(null);
  const [laserEffect, setLaserEffect] = useState<boolean>(false);
  const [comboText, setComboText] = useState<string | null>(null);
  const [explosionEffect, setExplosionEffect] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState<string>("");
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.2); // speed scale

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load Leaderboard on mount
  useEffect(() => {
    const saved = localStorage.getItem("tobe_leaderboard");
    if (saved) {
      setLeaderboard(JSON.parse(saved));
    } else {
      const dummy: LeaderboardEntry[] = [
        { name: "Ong Vàng 🐝", score: 250, date: "2026-07-20" },
        { name: "Anh Thư", score: 180, date: "2026-07-20" },
        { name: "Minh Quân", score: 120, date: "2026-07-20" }
      ];
      localStorage.setItem("tobe_leaderboard", JSON.stringify(dummy));
      setLeaderboard(dummy);
    }
  }, []);

  // Primary Game loop for falling asteroid
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = 40; // ~25 FPS
    timerRef.current = setInterval(() => {
      setAsteroidY((prev) => {
        const next = prev + speed;
        if (next >= 85) {
          // Asteroid hits shield
          handleAsteroidCrash();
          return 0; // reset to top
        }
        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, currentSentence, speed]);

  const selectRandomSentence = () => {
    const randomIndex = Math.floor(Math.random() * arcadePool.length);
    setCurrentSentence(arcadePool[randomIndex]);
    setAsteroidY(0);
  };

  const startGame = () => {
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setSpeed(1.2);
    setGameState("playing");
    selectRandomSentence();
  };

  const handleAsteroidCrash = () => {
    playArcadeSound("hit");
    setLives((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        endGame();
      }
      return next;
    });
    setCombo(0);
    selectRandomSentence();
  };

  const endGame = () => {
    playArcadeSound("gameover");
    setGameState("gameover");
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate coin rewards (1 coin per 10 points)
    const coinsEarned = Math.round(score * 0.1);
    if (coinsEarned > 0) {
      onAddCoins(coinsEarned);
    }

    // Check if high score
    const lowestTopScore = leaderboard.length >= 5 ? leaderboard[4].score : 0;
    if (score > lowestTopScore || leaderboard.length < 5) {
      setIsNewHighScore(true);
    } else {
      setIsNewHighScore(false);
    }
  };

  const handleShoot = (verb: "am" | "is" | "are") => {
    if (gameState !== "playing" || laserEffect) return;

    setLaserFired(verb);
    setLaserEffect(true);
    playArcadeSound("laser");

    // Timeout for laser animation travel
    setTimeout(() => {
      setLaserEffect(false);
      setLaserFired(null);

      if (currentSentence && verb === currentSentence.correctAnswer) {
        // Disintegrate asteroid
        playArcadeSound("explosion");
        setExplosionEffect(true);
        setTimeout(() => setExplosionEffect(false), 300);

        // Update score & combo
        const basePoints = 10;
        const comboBonus = Math.floor(combo / 5) * 5; // +5 pts per 5 combo
        const earned = basePoints + comboBonus;
        
        setScore((prev) => prev + earned);
        setCombo((prev) => {
          const next = prev + 1;
          if (next > maxCombo) setMaxCombo(next);
          
          // Display funny cheer words on streaks
          if (next === 5) setComboText("Tốt Lắm! 🌟");
          else if (next === 10) setComboText("Tuyệt Vời! 🔥");
          else if (next === 15) setComboText("Bất Bại! 👑");
          else if (next === 20) setComboText("Huyền Thoại! 🛸");
          else setComboText(null);
          
          if (next % 5 === 0) {
            setTimeout(() => setComboText(null), 1200);
          }

          return next;
        });

        // Increase speed slightly over time
        setSpeed((s) => Math.min(s + 0.05, 3.5));

        selectRandomSentence();
      } else {
        // Wrong answer shoots but gets deflected/hit
        playArcadeSound("hit");
        setLives((prev) => {
          const next = prev - 1;
          if (next <= 0) {
            endGame();
          }
          return next;
        });
        setCombo(0);
        // We keep the sentence so they can try again, just reset asteroid back up slightly as penalty
        setAsteroidY((y) => Math.max(0, y - 25));
      }
    }, 250);
  };

  const submitHighScore = () => {
    if (!playerName.trim()) return;

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score: score,
      date: new Date().toISOString().split("T")[0]
    };

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep top 5

    localStorage.setItem("tobe_leaderboard", JSON.stringify(updated));
    setLeaderboard(updated);
    setIsNewHighScore(false);
    setPlayerName("");
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Container wrapper mimicking retro cabinet or glowing modern play area */}
      <div className="bg-slate-900 text-white rounded-3xl border-4 border-slate-700 shadow-2xl overflow-hidden relative font-sans aspect-[4/5] flex flex-col">
        
        {/* Starry background effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950 via-slate-950 to-black opacity-90 z-0" />

        <AnimatePresence mode="wait">
          {/* 3.1 MENU VIEW */}
          {gameState === "menu" && (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex-1 flex flex-col justify-between p-6 text-center"
            >
              <div className="space-y-4 my-auto">
                {/* Logo & Glowing banner */}
                <div className="inline-block relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full blur-xs opacity-75" />
                  <span className="relative text-xs font-black uppercase tracking-widest bg-slate-800 text-amber-300 px-3.5 py-1 rounded-full border border-amber-400">
                    Chế độ Arcade
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-orange-600 drop-shadow-sm tracking-tight leading-none uppercase">
                  Đấu Trường Thiên Thạch
                </h1>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Thiên thạch ngữ pháp đang rơi xuống lá chắn Trái Đất! Chọn vũ khí <strong className="text-amber-400">AM / IS / ARE</strong> chính xác để kích nổ chúng trước khi quá muộn.
                </p>

                {/* Start Game Button */}
                <button
                  id="btn-arcade-start"
                  onClick={startGame}
                  className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-base shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2 mx-auto"
                >
                  <Play className="w-5 h-5 fill-white" /> BẮT ĐẦU CHƠI
                </button>
              </div>

              {/* Mini Highscore board */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 backdrop-blur-xs">
                <h4 className="text-[10px] font-black text-amber-400 tracking-wider uppercase mb-2 flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3 fill-amber-400" /> TOP CAO THỦ PHÒNG THỦ
                </h4>
                <div className="space-y-1.5 text-xs text-slate-400">
                  {leaderboard.slice(0, 3).map((entry, index) => (
                    <div key={index} className="flex justify-between items-center px-2">
                      <span className="font-bold">
                        {index + 1}. {entry.name}
                      </span>
                      <span className="font-mono text-amber-300 font-extrabold">{entry.score} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 3.2 PLAYING VIEW */}
          {gameState === "playing" && (
            <motion.div
              key="playing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex-1 flex flex-col justify-between"
            >
              {/* Top Status HUD */}
              <div className="p-4 flex items-center justify-between border-b border-slate-800 bg-slate-950/40 backdrop-blur-xs">
                {/* Lives / Shields */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Heart
                      key={idx}
                      className={`w-5 h-5 ${
                        idx < lives
                          ? "text-red-500 fill-red-500 drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]"
                          : "text-slate-800 fill-transparent"
                      }`}
                    />
                  ))}
                </div>

                {/* Score */}
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-400 block uppercase tracking-wider">SCORE</span>
                  <span className="text-xl font-mono font-black text-amber-300 tracking-tight">{score}</span>
                </div>

                {/* Active Combo / Streak */}
                <div className="text-right flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-xl">
                  <Zap className="w-4 h-4 text-orange-500 fill-orange-400 animate-pulse" />
                  <div>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase leading-none">COMBO</span>
                    <span className="text-xs font-mono font-bold text-white leading-none">{combo}</span>
                  </div>
                </div>
              </div>

              {/* Combat Stage (Asteroid & Laser area) */}
              <div className="flex-1 relative overflow-hidden px-4 py-2">
                
                {/* Combo/Streak Announcement Banner */}
                <AnimatePresence>
                  {comboText && (
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center select-none"
                    >
                      <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                        {comboText}
                      </h3>
                      <span className="text-xs font-mono text-orange-300 drop-shadow-md">+{combo} Combo x1.5!</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Laser Ray Effect */}
                {laserEffect && laserFired && (
                  <motion.div
                    initial={{ y: 350, opacity: 1 }}
                    animate={{ y: asteroidY * 3.5, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`absolute left-1/2 -translate-x-1/2 w-1.5 h-24 rounded-full z-20 ${
                      laserFired === "am"
                        ? "bg-blue-400 shadow-[0_0_12px_#38bdf8]"
                        : laserFired === "is"
                        ? "bg-emerald-400 shadow-[0_0_12px_#34d399]"
                        : "bg-purple-400 shadow-[0_0_12px_#c084fc]"
                    }`}
                  />
                )}

                {/* Falling Asteroid Sentence Block */}
                {currentSentence && (
                  <motion.div
                    style={{
                      top: `${asteroidY}%`,
                      transform: "translateX(-50%)"
                    }}
                    className="absolute left-1/2 w-full max-w-sm z-10 px-4"
                  >
                    <div className={`p-4 rounded-2xl border-2 text-center shadow-lg relative transition-all ${
                      explosionEffect 
                        ? "scale-110 bg-orange-500 border-yellow-300 text-white shadow-orange-500/50" 
                        : "bg-slate-950/80 border-slate-700/80 text-white backdrop-blur-xs"
                    }`}>
                      
                      {/* Burning fire tail effect under asteroid */}
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gradient-to-b from-orange-600/0 to-orange-500 rounded-b-full blur-xs animate-pulse" />

                      <p className="text-sm md:text-base font-black tracking-wide leading-snug">
                        {currentSentence.sentence.split("___")[0]}
                        <span className="text-amber-400 underline decoration-2 underline-offset-4 px-1">
                          ___
                        </span>
                        {currentSentence.sentence.split("___")[1]}
                      </p>
                      
                      {/* Translation clue */}
                      <span className="text-[10px] text-slate-400 block mt-1">
                        {currentSentence.translation}
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Player spaceship / defense shield at the bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full max-w-xs flex flex-col items-center">
                  {/* Glowing energy line */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent blur-xs shadow-[0_0_8px_#06b6d4] opacity-80 mb-2" />
                  
                  {/* Spaceship element */}
                  <div className="w-12 h-8 bg-slate-800 border-2 border-slate-600 rounded-t-2xl flex items-center justify-center relative">
                    <div className="w-2 h-4 bg-cyan-400 rounded-t-sm absolute -top-3 left-1/2 -translate-x-1/2 shadow-[0_0_6px_#22d3ee]" />
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                  </div>
                </div>

              </div>

              {/* Weapon Controls Footer Panel */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 grid grid-cols-3 gap-2.5">
                {/* AM GUN */}
                <button
                  id="btn-shoot-am"
                  onClick={() => handleShoot("am")}
                  disabled={laserEffect}
                  className="py-3 bg-gradient-to-t from-blue-900 to-blue-800 active:scale-95 border border-blue-600 rounded-2xl font-black text-sm tracking-widest text-blue-200 hover:text-white hover:border-blue-400 transition-all shadow-md shadow-blue-950"
                >
                  AM
                </button>

                {/* IS GUN */}
                <button
                  id="btn-shoot-is"
                  onClick={() => handleShoot("is")}
                  disabled={laserEffect}
                  className="py-3 bg-gradient-to-t from-emerald-900 to-emerald-800 active:scale-95 border border-emerald-600 rounded-2xl font-black text-sm tracking-widest text-emerald-200 hover:text-white hover:border-emerald-400 transition-all shadow-md shadow-emerald-950"
                >
                  IS
                </button>

                {/* ARE GUN */}
                <button
                  id="btn-shoot-are"
                  onClick={() => handleShoot("are")}
                  disabled={laserEffect}
                  className="py-3 bg-gradient-to-t from-purple-900 to-purple-800 active:scale-95 border border-purple-600 rounded-2xl font-black text-sm tracking-widest text-purple-200 hover:text-white hover:border-purple-400 transition-all shadow-md shadow-purple-950"
                >
                  ARE
                </button>
              </div>
            </motion.div>
          )}

          {/* 3.3 GAMEOVER VIEW */}
          {gameState === "gameover" && (
            <motion.div
              key="gameover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex-1 flex flex-col justify-between p-6 text-center"
            >
              <div className="space-y-4 my-auto">
                <div className="w-16 h-16 bg-red-950 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-500 animate-bounce">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600 tracking-tight leading-none uppercase">
                  Lá Chắn Đã Sụp Đổ!
                </h2>
                <p className="text-xs text-slate-400">Trái Đất đã ghi nhận sự cống hiến phòng thủ của bạn.</p>

                {/* Final stats */}
                <div className="grid grid-cols-3 gap-3 bg-slate-950/70 border border-slate-800 p-3 rounded-2xl max-w-sm mx-auto font-mono text-center">
                  <div>
                    <span className="text-[8px] text-slate-500 block">SCORE</span>
                    <span className="text-base font-extrabold text-amber-300">{score}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block">MAX COMBO</span>
                    <span className="text-base font-extrabold text-orange-400">{maxCombo}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-500 block">COINS</span>
                    <span className="text-base font-extrabold text-emerald-400 flex items-center justify-center gap-0.5">
                      🪙{Math.round(score * 0.1)}
                    </span>
                  </div>
                </div>

                {/* Submit High Score Interface */}
                {isNewHighScore ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl space-y-3 max-w-sm mx-auto"
                  >
                    <p className="text-xs text-amber-300 font-extrabold uppercase flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 fill-amber-300" /> KỶ LỤC MỚI ĐƯỢC THIẾT LẬP!
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập tên dũng sĩ..."
                        maxLength={15}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-bold"
                      />
                      <button
                        onClick={submitHighScore}
                        disabled={!playerName.trim()}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold ${
                          playerName.trim()
                            ? "bg-amber-500 hover:bg-amber-600 text-slate-950"
                            : "bg-slate-700 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        Lưu
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    Nhận được {Math.round(score * 0.1)} Xu Vàng được cộng vào tài khoản của bạn!
                  </div>
                )}

                {/* Retry action */}
                <button
                  id="btn-arcade-retry"
                  onClick={startGame}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold text-xs flex items-center gap-1.5 mx-auto border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" /> THỬ SỨC LẠI
                </button>
              </div>

              {/* Footer navigation */}
              <button
                id="btn-arcade-exit-menu"
                onClick={() => setGameState("menu")}
                className="text-xs font-bold text-slate-500 hover:text-slate-300 mt-2 block mx-auto underline"
              >
                Về màn hình chính Arcade
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
