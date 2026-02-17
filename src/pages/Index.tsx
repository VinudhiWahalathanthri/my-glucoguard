import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import AvatarDisplay from '@/components/AvatarDisplay';
import { Flame, Zap, Target, TrendingUp, Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const todayChallenge = {
  title: '💧 Drink water instead of soda today!',
  points: 15,
  id: 'water-today',
};

const Index = () => {
  const { avatarState, dailyScore, streak, points, level, completeChallenge, completedChallenges, addPoints } = useUser();
  const navigate = useNavigate();

  const scoreColor = dailyScore >= 70 ? 'gradient-success' : dailyScore >= 40 ? 'gradient-accent' : 'gradient-danger';
  const challengeDone = completedChallenges.includes(todayChallenge.id);

  const handleCompleteChallenge = () => {
    if (!challengeDone) {
      completeChallenge(todayChallenge.id);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">GlucoGuard 🛡️</h1>
            <p className="text-sm text-muted-foreground">Level {level} • {points} pts</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-2 shadow-card">
            <Flame className="h-5 w-5 text-accent" />
            <span className="font-bold text-foreground">{streak}</span>
            <span className="text-xs text-muted-foreground">day streak</span>
          </div>
        </motion.div>

        {/* Avatar & Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-card p-6 shadow-card"
        >
          <div className="flex items-center gap-6">
            <AvatarDisplay state={avatarState} size="lg" />
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-muted-foreground">Daily Score</span>
                  <span className="text-lg font-bold text-foreground">{dailyScore}/100</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${scoreColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${dailyScore}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1">
                  <Zap className="h-3 w-3 text-accent" />
                  <span className="text-xs font-semibold text-foreground">Level {level}</span>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-muted px-2 py-1">
                  <Target className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-foreground">{points} pts</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Today's Challenge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-card p-5 shadow-card"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Today's Challenge</h2>
          </div>
          <div className={`rounded-2xl p-4 ${challengeDone ? 'gradient-success' : 'bg-muted'}`}>
            <p className={`font-semibold ${challengeDone ? 'text-success-foreground' : 'text-foreground'}`}>
              {challengeDone ? '✅ Challenge Completed!' : todayChallenge.title}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm ${challengeDone ? 'text-success-foreground/80' : 'text-muted-foreground'}`}>
                +{todayChallenge.points} points
              </span>
              {!challengeDone && (
                <button
                  onClick={handleCompleteChallenge}
                  className="rounded-xl gradient-primary px-4 py-1.5 text-sm font-bold text-primary-foreground shadow-button"
                >
                  Done ✓
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { label: 'Scan Food', emoji: '📸', to: '/food', gradient: 'gradient-primary' },
            { label: 'Log Habits', emoji: '📊', to: '/habits', gradient: 'gradient-accent' },
            { label: 'Challenges', emoji: '🏆', to: '/challenges', gradient: 'gradient-purple' },
            { label: 'Exercises', emoji: '🏃', to: '/exercises', gradient: 'gradient-success' },
          ].map(({ label, emoji, to, gradient }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className={`flex items-center gap-3 rounded-2xl ${gradient} p-4 text-left text-primary-foreground shadow-card transition-transform active:scale-95`}
            >
              <span className="text-2xl">{emoji}</span>
              <div>
                <span className="text-sm font-bold">{label}</span>
                <ChevronRight className="h-4 w-4 opacity-70" />
              </div>
            </button>
          ))}
        </motion.div>

        {/* Risk Awareness Mini */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-card p-5 shadow-card"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Health Insight</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Your recent habits look great! Keep it up and your future self will thank you 💙
          </p>
          <button
            onClick={() => navigate('/summary')}
            className="mt-3 text-sm font-semibold text-primary flex items-center gap-1"
          >
            View Weekly Summary <ChevronRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
