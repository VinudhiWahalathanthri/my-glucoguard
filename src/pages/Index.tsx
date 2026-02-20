import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import AvatarDisplay from '@/components/AvatarDisplay';
import { Flame, Zap, Target, Shield, ChevronRight, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { avatarState, dailyScore, streak, points, level, diabetesRisk } = useUser();
  const navigate = useNavigate();

  const scoreColor = dailyScore >= 70 ? 'gradient-success' : dailyScore >= 40 ? 'gradient-accent' : 'gradient-danger';
  const riskColor = diabetesRisk.level === 'low' ? 'text-success' : diabetesRisk.level === 'medium' ? 'text-warning' : 'text-destructive';
  const riskBg = diabetesRisk.level === 'low' ? 'bg-success/10' : diabetesRisk.level === 'medium' ? 'bg-warning/10' : 'bg-destructive/10';
  const riskEmoji = diabetesRisk.level === 'low' ? '💚' : diabetesRisk.level === 'medium' ? '💛' : '❤️';

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
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
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-card p-6 shadow-card">
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

        {/* Diabetes Risk Card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Health Risk Assessment</h2>
          </div>
          <div className={`rounded-2xl ${riskBg} p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Risk Level</span>
              <span className={`text-lg font-bold ${riskColor}`}>{riskEmoji} {diabetesRisk.level.charAt(0).toUpperCase() + diabetesRisk.level.slice(1)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden mb-2">
              <motion.div
                className={`h-full rounded-full ${diabetesRisk.level === 'low' ? 'bg-success' : diabetesRisk.level === 'medium' ? 'bg-warning' : 'bg-destructive'}`}
                initial={{ width: 0 }}
                animate={{ width: `${diabetesRisk.score}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            {diabetesRisk.factors.length > 0 && (
              <div className="space-y-1 mt-2">
                {diabetesRisk.factors.slice(0, 3).map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-warning shrink-0" />
                    <span className="text-xs text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {diabetesRisk.level === 'low' && "Your habits look great! Keep up the awesome work 💪"}
              {diabetesRisk.level === 'medium' && "Some factors to watch. Small changes can make a big difference! 💛"}
              {diabetesRisk.level === 'high' && "Your habits show increased risk. Let's fix it early 💙"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">⚠️ Based on habits, not a medical diagnosis</p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 gap-3">
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

        {/* Weekly Summary link */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <button
            onClick={() => navigate('/summary')}
            className="w-full rounded-3xl bg-card p-5 shadow-card text-left flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold text-foreground">📅 Weekly Summary</h3>
              <p className="text-sm text-muted-foreground">View your progress & trends</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
