import React from "react";
import { UserStats } from "../types";
import { motion } from "motion/react";
import { Shield, Coins, Trophy, Zap, Sparkles, Check, CheckCircle2, Lock } from "lucide-react";

interface AvatarItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
}

interface DashboardProps {
  stats: UserStats;
  onSelectAvatar: (avatarId: string) => void;
  onBuyAvatar: (avatarId: string, cost: number) => void;
}

export default function Dashboard({ stats, onSelectAvatar, onBuyAvatar }: DashboardProps) {
  
  const avatars: AvatarItem[] = [
    { id: "bee", name: "Ong Vàng Mascot", emoji: "🐝", cost: 0, description: "Người bạn học đồng hành mặc định siêu đáng yêu." },
    { id: "cat", name: "Mèo Con Năng Động", emoji: "🐱", cost: 100, description: "Nhanh nhẹn và vô cùng cá tính khi làm bài." },
    { id: "dino", name: "Dino Học Giả", emoji: "🦖", cost: 180, description: "Khủng long bạo chúa ham học hỏi và cực kỳ thông thái." },
    { id: "robot", name: "Rô Bốt Trí Tuệ", emoji: "🤖", cost: 250, description: "Thuật toán xử lý 'to be' siêu nhanh và chuẩn xác." },
    { id: "wizard", name: "Phù Thủy Nhỏ", emoji: "🧙", cost: 350, description: "Khai thông phép thuật tối thượng của am, is, are." }
  ];

  const achievements = [
    {
      id: "first_win",
      title: "Lần Đầu Ra Quân 👋",
      description: "Hoàn thành cấp độ đầu tiên bất kỳ.",
      isUnlocked: stats.completedLevels.length >= 1
    },
    {
      id: "streak_3",
      title: "Học Tập Liên Tục 🔥",
      description: "Đạt chuỗi streak học tập từ 1 trở lên.",
      isUnlocked: stats.streak >= 1
    },
    {
      id: "arcade_warrior",
      title: "Chiến Binh Vũ Trụ 🛸",
      description: "Đạt trên 50 điểm trong game Đấu Trường Thiên Thạch.",
      isUnlocked: stats.highScore >= 50
    },
    {
      id: "rich_kid",
      title: "Triệu Phú To Be 🪙",
      description: "Tích lũy tổng số Xu Vàng trên 150 xu.",
      isUnlocked: stats.coins >= 150
    },
    {
      id: "grammar_king",
      title: "Huyền Thoại Ngữ Pháp 👑",
      description: "Hoàn thành toàn bộ cả 6 cấp độ luyện tập.",
      isUnlocked: stats.completedLevels.length >= 6
    }
  ];

  const handleEquipOrBuy = (avatar: AvatarItem) => {
    const isUnlocked = stats.unlockedAvatars.includes(avatar.id);
    if (isUnlocked) {
      onSelectAvatar(avatar.id);
    } else {
      if (stats.coins >= avatar.cost) {
        onBuyAvatar(avatar.id, avatar.cost);
      } else {
        alert(`Cậu cần thêm ${avatar.cost - stats.coins} xu vàng nữa để đón bạn ${avatar.name} về nha! 🪙`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* HUD Cards Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Coins */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-lg shadow-2xs shrink-0">
            🪙
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tài khoản xu</span>
            <h4 className="text-lg font-black text-amber-500 font-mono mt-0.5">{stats.coins}</h4>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-lg shadow-2xs shrink-0">
            🔥
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Chuỗi streak</span>
            <h4 className="text-lg font-black text-orange-500 font-mono mt-0.5">{stats.streak} ngày</h4>
          </div>
        </div>

        {/* Level Clearance ratio */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-lg shadow-2xs shrink-0">
            ⭐
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Đã vượt cấp</span>
            <h4 className="text-lg font-black text-emerald-600 font-mono mt-0.5">{stats.completedLevels.length} / 6</h4>
          </div>
        </div>

        {/* Arcade Highscore */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-lg shadow-2xs shrink-0">
            🛸
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Kỷ lục arcade</span>
            <h4 className="text-lg font-black text-blue-600 font-mono mt-0.5">{stats.highScore} pts</h4>
          </div>
        </div>
      </div>

      {/* Main split sections: Store vs Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* STORE SECTION */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="text-amber-500 w-5 h-5 fill-amber-200" />
              Cửa Hàng Thú Cưng Học Tập
            </h3>
            <p className="text-xs text-slate-500">
              Dùng Xu Vàng tích lũy khi giải bài tập đúng để rước những người bạn đồng hành siêu đáng yêu khác về nhé!
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {avatars.map((avatar) => {
              const isUnlocked = stats.unlockedAvatars.includes(avatar.id);
              const isActive = stats.avatar === avatar.id;
              
              return (
                <div
                  key={avatar.id}
                  id={`store-item-${avatar.id}`}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    isActive
                      ? "border-amber-400 bg-amber-50/50 shadow-2xs"
                      : "border-slate-150 bg-white"
                  }`}
                >
                  {/* Left: Avatar visual & text */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 text-3xl rounded-2xl flex items-center justify-center shadow-2xs shrink-0">
                      {avatar.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-slate-800">{avatar.name}</h4>
                        {isActive && (
                          <span className="bg-amber-100 text-amber-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            Đang dùng
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{avatar.description}</p>
                    </div>
                  </div>

                  {/* Right: Buy / Use Button */}
                  <button
                    id={`btn-avatar-${avatar.id}`}
                    onClick={() => handleEquipOrBuy(avatar)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-amber-100 text-amber-700 cursor-default border border-amber-200"
                        : isUnlocked
                        ? "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        : "bg-amber-500 hover:bg-amber-600 text-white"
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Đồng hành
                      </>
                    ) : (
                      <>
                        <Coins className="w-3.5 h-3.5 fill-amber-300" /> {avatar.cost} xu
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACHIEVEMENTS SECTION */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Trophy className="text-orange-500 w-5 h-5 fill-orange-200" />
              Huy Hiệu Học Tập
            </h3>
            <p className="text-xs text-slate-500">
              Hoàn thành các cột mốc thử thách khác nhau để mở khóa trọn bộ huân chương danh dự của bạn!
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                id={`ach-card-${ach.id}`}
                className={`p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
                  ach.isUnlocked
                    ? "bg-slate-50 border-slate-200"
                    : "bg-slate-100/50 border-transparent opacity-60"
                }`}
              >
                {/* Icon box */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  ach.isUnlocked ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400"
                }`}>
                  {ach.isUnlocked ? (
                    <Trophy className="w-5 h-5 fill-amber-300" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${ach.isUnlocked ? "text-slate-800" : "text-slate-400"}`}>
                    {ach.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
