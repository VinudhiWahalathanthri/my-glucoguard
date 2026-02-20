import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Star, Lock, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const challenges = [
  { id: 'c1', title: 'Max 3 junk foods this week', emoji: '🍔', points: 30, category: 'food', check: (h: any) => h.sugarItems <= 3 },
  { id: 'c2', title: 'Drink water instead of soda – 5 days', emoji: '💧', points: 25, category: 'sugar', check: (h: any) => h.sugaryDrinks === 0 },
  { id: 'c3', title: '10 mins movement daily', emoji: '🏃', points: 20, category: 'exercise', check: (h: any) => h.activityMinutes >= 10 },
  { id: 'c4', title: 'Zero sugary drinks today', emoji: '🥤', points: 15, category: 'sugar', check: (h: any) => h.sugaryDrinks === 0 },
  { id: 'c5', title: 'Eat 2 fruits today', emoji: '🍎', points: 15, category: 'food', check: () => false },
  { id: 'c6', title: 'Sleep 8+ hours tonight', emoji: '🛌', points: 20, category: 'wellness', check: (h: any) => h.sleepHours >= 8 },
  { id: 'c7', title: 'No candy for 3 days', emoji: '🍬', points: 35, category: 'sugar', check: (h: any) => h.sugarItems === 0 },
  { id: 'c8', title: 'Walk 5000 steps today', emoji: '👟', points: 25, category: 'exercise', check: (h: any) => h.activityMinutes >= 30 },
  { id: 'c9', title: 'Max 2 sugar items today', emoji: '🍭', points: 20, category: 'sugar', check: (h: any) => h.sugarItems <= 2 },
  { id: 'c10', title: 'Get 7+ hours of sleep', emoji: '😴', points: 15, category: 'wellness', check: (h: any) => h.sleepHours >= 7 },
];

const allBadges = [
  { id: 'first-log', name: 'First Log', emoji: '📝', desc: 'Logged your first habit' },
  { id: 'streak-3', name: '3-Day Streak', emoji: '🔥', desc: '3 days in a row!' },
  { id: 'streak-7', name: 'Week Warrior', emoji: '⚡', desc: '7-day streak' },
  { id: 'sugar-free', name: 'Sugar Free Day', emoji: '🏆', desc: 'Zero sugar items in a day' },
  { id: 'hydro-hero', name: 'Hydro Hero', emoji: '💧', desc: 'Only water for 3 days' },
  { id: 'move-master', name: 'Move Master', emoji: '🏅', desc: '30 mins activity 5 days' },
  { id: 'scan-pro', name: 'Scan Pro', emoji: '📸', desc: 'Scanned 10 foods' },
  { id: 'level-5', name: 'Level 5', emoji: '⭐', desc: 'Reached level 5' },
];

const Challenges = () => {
  const { completedChallenges, completeChallenge, badges, points, level, habits } = useUser();
  const [tab, setTab] = useState<'challenges' | 'badges'>('challenges');

  const canComplete = (c: typeof challenges[0]) => {
    return c.check(habits) && !completedChallenges.includes(c.id);
  };

  const handleComplete = (c: typeof challenges[0]) => {
    if (!completedChallenges.includes(c.id)) {
      completeChallenge(c.id);
      toast({ title: "Challenge done! 🎉", description: `+${c.points} points earned!` });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Challenges & Badges 🏆</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-muted-foreground">Level {level}</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{points} points</span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{badges.length}/{allBadges.length} badges</span>
          </div>
        </motion.div>

        {/* Level Progress */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl gradient-hero p-5 text-primary-foreground">
          <div className="flex items-center gap-3 mb-3">
            <Star className="h-6 w-6" />
            <span className="font-bold text-lg">Level {level}</span>
          </div>
          <div className="h-3 w-full rounded-full bg-primary-foreground/20 overflow-hidden">
            <div className="h-full rounded-full bg-primary-foreground/80 transition-all" style={{ width: `${(points % 100)}%` }} />
          </div>
          <p className="text-sm mt-2 opacity-80">{100 - (points % 100)} pts to level {level + 1}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('challenges')}
            className={`flex-1 rounded-2xl py-3 font-bold text-sm transition-all ${
              tab === 'challenges' ? 'gradient-primary text-primary-foreground shadow-button' : 'bg-card text-foreground shadow-card'
            }`}
          >
            🎯 Challenges
          </button>
          <button
            onClick={() => setTab('badges')}
            className={`flex-1 rounded-2xl py-3 font-bold text-sm transition-all ${
              tab === 'badges' ? 'gradient-accent text-accent-foreground shadow-button' : 'bg-card text-foreground shadow-card'
            }`}
          >
            🏅 Badges
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'challenges' ? (
            <motion.div key="challenges" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-3">
              {challenges.map((c, i) => {
                const done = completedChallenges.includes(c.id);
                const eligible = canComplete(c);
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-4 rounded-2xl p-4 shadow-card transition-all ${
                      done ? 'bg-success/10 border border-success/30' : eligible ? 'bg-primary/5 border border-primary/30' : 'bg-card'
                    }`}
                  >
                    <span className="text-3xl">{c.emoji}</span>
                    <div className="flex-1">
                      <p className={`font-semibold ${done ? 'text-success line-through' : 'text-foreground'}`}>{c.title}</p>
                      <p className="text-xs text-muted-foreground">+{c.points} points</p>
                      {eligible && !done && (
                        <p className="text-xs text-primary font-semibold mt-1">✨ Your habits qualify!</p>
                      )}
                    </div>
                    {done ? (
                      <div className="rounded-full bg-success p-1.5">
                        <Check className="h-4 w-4 text-success-foreground" />
                      </div>
                    ) : (
                      <button
                        onClick={() => handleComplete(c)}
                        disabled={!eligible}
                        className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                          eligible
                            ? 'gradient-primary text-primary-foreground shadow-button active:scale-95'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {eligible ? 'Claim!' : 'In Progress'}
                      </button>
                    )}
                  </motion.div>
                );
              })}
              <p className="text-center text-xs text-muted-foreground pt-2">
                Log your habits first to unlock challenges! 💙
              </p>
            </motion.div>
          ) : (
            <motion.div key="badges" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-2 gap-3">
              {allBadges.map((b, i) => {
                const earned = badges.includes(b.id);
                return (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all ${
                      earned ? 'bg-card shadow-card' : 'bg-muted/50 opacity-60'
                    }`}
                  >
                    <span className={`text-4xl ${earned ? '' : 'grayscale'}`}>{b.emoji}</span>
                    <span className="font-bold text-sm text-foreground">{b.name}</span>
                    <span className="text-xs text-muted-foreground">{b.desc}</span>
                    {earned ? (
                      <span className="text-xs font-semibold text-success">✅ Earned</span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Locked
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Challenges;
