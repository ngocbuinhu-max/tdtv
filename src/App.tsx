import React, { useState, useEffect } from "react";
import { UserStats } from "./types";
import GrammarSchool from "./components/GrammarSchool";
import PracticeArena from "./components/PracticeArena";
import ArcadeGame from "./components/ArcadeGame";
import AiTeacher from "./components/AiTeacher";
import Dashboard from "./components/Dashboard";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Shield, Zap, Bot, Trophy, Sparkles, Coins, Flame } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"school" | "arena" | "arcade" | "ai" | "dashboard">("school");
  const [stats, setStats] = useState<UserStats>({
    coins: 50, // 50 coins welcome bonus!
    completedLevels: [],
    streak: 1,
    lastActiveDate: null,
    highScore: 0,
    avatar: "bee",
    unlockedAvatars: ["bee"]
  });

  // Load stats from localStorage on mount
  useEffect(() => {
    try {
      const savedCoins = localStorage.getItem("tobe_coins");
      const savedLevels = localStorage.getItem("tobe_completed_levels");
      const savedStreak = localStorage.getItem("tobe_streak");
      const savedLastActive = localStorage.getItem("tobe_last_active_date");
      const savedHighScore = localStorage.getItem("tobe_highscore");
      const savedAvatar = localStorage.getItem("tobe_avatar");
      const savedUnlockedAvatars = localStorage.getItem("tobe_unlocked_avatars");

      const loadedStats: UserStats = {
        coins: savedCoins ? parseInt(savedCoins, 10) : 50,
        completedLevels: savedLevels ? JSON.parse(savedLevels) : [],
        streak: savedStreak ? parseInt(savedStreak, 10) : 1,
        lastActiveDate: savedLastActive || null,
        highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0,
        avatar: savedAvatar || "bee",
        unlockedAvatars: savedUnlockedAvatars ? JSON.parse(savedUnlockedAvatars) : ["bee"]
      };

      // Calculate/Update Streak on Load
      const todayStr = new Date().toISOString().split("T")[0];
      if (!loadedStats.lastActiveDate) {
        loadedStats.lastActiveDate = todayStr;
        loadedStats.streak = 1;
      } else if (loadedStats.lastActiveDate !== todayStr) {
        const lastActive = new Date(loadedStats.lastActiveDate);
        const today = new Date(todayStr);
        const diffTime = Math.abs(today.getTime() - lastActive.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          loadedStats.streak += 1;
        } else if (diffDays > 1) {
          loadedStats.streak = 1; // broken streak, reset
        }
        loadedStats.lastActiveDate = todayStr;
      }

      setStats(loadedStats);
      saveToStorage(loadedStats);
    } catch (e) {
      console.error("Failed to load user progress:", e);
    }
  }, []);

  // Save specific stats bundle to local storage
  const saveToStorage = (updated: UserStats) => {
    localStorage.setItem("tobe_coins", updated.coins.toString());
    localStorage.setItem("tobe_completed_levels", JSON.stringify(updated.completedLevels));
    localStorage.setItem("tobe_streak", updated.streak.toString());
    if (updated.lastActiveDate) {
      localStorage.setItem("tobe_last_active_date", updated.lastActiveDate);
    }
    localStorage.setItem("tobe_highscore", updated.highScore.toString());
    localStorage.setItem("tobe_avatar", updated.avatar);
    localStorage.setItem("tobe_unlocked_avatars", JSON.stringify(updated.unlockedAvatars));
  };

  // State modification helpers
  const handleAwardCoins = (amount: number) => {
    setStats((prev) => {
      const next = { ...prev, coins: prev.coins + amount };
      saveToStorage(next);
      return next;
    });
  };

  const handleLevelComplete = (levelId: string, coinsEarned: number) => {
    setStats((prev) => {
      const updatedLevels = prev.completedLevels.includes(levelId)
        ? prev.completedLevels
        : [...prev.completedLevels, levelId];
        
      const next = {
        ...prev,
        coins: prev.coins + coinsEarned,
        completedLevels: updatedLevels
      };
      saveToStorage(next);
      return next;
    });
  };

  const handleSelectAvatar = (avatarId: string) => {
    setStats((prev) => {
      const next = { ...prev, avatar: avatarId };
      saveToStorage(next);
      return next;
    });
  };

  const handleBuyAvatar = (avatarId: string, cost: number) => {
    setStats((prev) => {
      if (prev.coins < cost) return prev;
      const next = {
        ...prev,
        coins: prev.coins - cost,
        unlockedAvatars: [...prev.unlockedAvatars, avatarId],
        avatar: avatarId // Auto-equip bought avatar
      };
      saveToStorage(next);
      return next;
    });
  };

  const handleArcadeGameEnd = (score: number) => {
    setStats((prev) => {
      const newHigh = Math.max(prev.highScore, score);
      const coinsReward = Math.round(score * 0.1);
      const next = {
        ...prev,
        highScore: newHigh,
        coins: prev.coins + coinsReward
      };
      saveToStorage(next);
      return next;
    });
  };

  // Helper mapping avatar id to cute emoji
  const getAvatarEmoji = (id: string) => {
    if (id === "bee") return "🐝";
    if (id === "cat") return "🐱";
    if (id === "dino") return "🦖";
    if (id === "robot") return "🤖";
    if (id === "wizard") return "🧙";
    return "🐝";
  };

  const getAvatarName = (id: string) => {
    if (id === "bee") return "Ong Bee";
    if (id === "cat") return "Mèo Con";
    if (id === "dino") return "Dino";
    if (id === "robot") return "Rô Bốt";
    if (id === "wizard") return "Phù Thủy";
    return "Ong Bee";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans select-none pb-24 md:pb-8">
      
      {/* GLOBAL HEADER HUD */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo & Avatar info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 text-2xl rounded-2xl flex items-center justify-center shadow-md shadow-amber-400/20 animate-pulse">
              {getAvatarEmoji(stats.avatar)}
            </div>
            <div>
              <h1 className="font-extrabold text-slate-800 text-sm tracking-tight flex items-center gap-1">
                <span>Vũ Trụ To Be</span> 🐝
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                Đồng hành: <span className="text-amber-500">{getAvatarName(stats.avatar)}</span>
              </p>
            </div>
          </div>

          {/* Quick Stats (Coins, Streaks) */}
          <div className="flex items-center gap-4">
            
            {/* Streak Counter */}
            <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full shadow-2xs">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
              <span className="font-mono text-xs font-black text-orange-600">{stats.streak} ngày</span>
            </div>

            {/* Coins Counter */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full shadow-2xs">
              <Coins className="w-4 h-4 text-amber-500 fill-amber-300" />
              <span className="font-mono text-xs font-black text-amber-600">{stats.coins}</span>
            </div>
          </div>

        </div>
      </header>

      {/* MAIN SCREEN AREA */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "school" && (
              <GrammarSchool onAwardCoins={handleAwardCoins} />
            )}
            
            {activeTab === "arena" && (
              <PracticeArena stats={stats} onLevelComplete={handleLevelComplete} />
            )}
            
            {activeTab === "arcade" && (
              <ArcadeGame onAddCoins={handleAwardCoins} />
            )}
            
            {activeTab === "ai" && (
              <AiTeacher onAwardCoins={handleAwardCoins} />
            )}
            
            {activeTab === "dashboard" && (
              <Dashboard
                stats={stats}
                onSelectAvatar={handleSelectAvatar}
                onBuyAvatar={handleBuyAvatar}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* BOTTOM/SIDE FLOATING NAVIGATION RAIL */}
      <nav className="fixed bottom-0 left-0 right-0 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl bg-white/95 backdrop-blur-md md:rounded-2xl border-t md:border border-slate-200 shadow-xl z-40 px-4 py-2.5">
        <div className="flex justify-around items-center">
          
          {/* 1. Lessons Tab */}
          <button
            id="nav-btn-school"
            onClick={() => setActiveTab("school")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "school"
                ? "text-orange-500 md:bg-orange-50 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <BookOpen className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight">Học Tập</span>
          </button>

          {/* 2. Practice Arena Tab */}
          <button
            id="nav-btn-arena"
            onClick={() => setActiveTab("arena")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "arena"
                ? "text-orange-500 md:bg-orange-50 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Shield className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight">Đấu Trường</span>
          </button>

          {/* 3. Space Shooter Tab */}
          <button
            id="nav-btn-arcade"
            onClick={() => setActiveTab("arcade")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "arcade"
                ? "text-orange-500 md:bg-orange-50 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Zap className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight">Thiên Thạch</span>
          </button>

          {/* 4. AI Assistant Tab */}
          <button
            id="nav-btn-ai"
            onClick={() => setActiveTab("ai")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "ai"
                ? "text-orange-500 md:bg-orange-50 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Bot className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight font-black flex items-center gap-0.5">
              <span>Trợ Lý AI</span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block animate-bounce" />
            </span>
          </button>

          {/* 5. Store / Achievement Dashboard */}
          <button
            id="nav-btn-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "text-orange-500 md:bg-orange-50 font-bold"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <Trophy className="w-5 h-5 shrink-0" />
            <span className="text-[10px] tracking-tight">Thành Tích</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
