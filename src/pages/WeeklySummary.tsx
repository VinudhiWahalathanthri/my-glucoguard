import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import AvatarDisplay from '@/components/AvatarDisplay';
import { TrendingUp, TrendingDown, Minus, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekMoods: ('high' | 'mid' | 'low')[] = ['high', 'high', 'mid', 'high', 'low', 'mid', 'high'];
const weekScores = [82, 75, 60, 78, 45, 65, 72];

const WeeklySummary = () => {
  const { avatarState, dailyScore, streak, completedChallenges, points, level } = useUser();
  const navigate = useNavigate();

  const avgScore = Math.round(weekScores.reduce((a, b) => a + b, 0) / weekScores.length);
  const trend = avgScore >= 70 ? 'up' : avgScore >= 50 ? 'stable' : 'down';
  const riskLevel = avgScore >= 70 ? 'Low' : avgScore >= 50 ? 'Medium' : 'High';
  const riskColor = avgScore >= 70 ? 'text-success' : avgScore >= 50 ? 'text-warning' : 'text-destructive';
  const riskBg = avgScore >= 70 ? 'bg-success/10' : avgScore >= 50 ? 'bg-warning/10' : 'bg-destructive/10';

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Weekly Summary 📅</h1>
          <p className="text-sm text-muted-foreground">Here's how your week went!</p>
        </motion.div>

        {/* Week mood bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-card p-5 shadow-card">
          <h2 className="font-bold text-foreground mb-4">Avatar Mood This Week</h2>
          <div className="flex justify-between items-end gap-1">
            {weekDays.map((day, i) => (
              <div key={day} className="flex flex-col items-center gap-2">
                <AvatarDisplay state={weekMoods[i]} size="sm" showLabel={false} />
                <div className="h-16 w-8 rounded-lg bg-muted overflow-hidden flex items-end">
                  <motion.div
                    className={`w-full rounded-lg ${weekScores[i] >= 70 ? 'gradient-success' : weekScores[i] >= 50 ? 'gradient-accent' : 'gradient-danger'}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(weekScores[i] / 100) * 100}%` }}
                    transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                  />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-sm text-muted-foreground">Avg Score</span>
            <div className="flex items-center gap-2">
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
              {trend === 'stable' && <Minus className="h-4 w-4 text-warning" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
              <span className="text-lg font-bold text-foreground">{avgScore}/100</span>
            </div>
          </div>
        </motion.div>

        {/* Challenge completion */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-3xl bg-card p-5 shadow-card">
          <h2 className="font-bold text-foreground mb-3">🎯 Challenges This Week</h2>
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                <path className="text-muted" strokeDasharray="100, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-primary" strokeDasharray={`${(completedChallenges.length / 8) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-foreground">{completedChallenges.length}/8</span>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground">{completedChallenges.length} challenges done!</p>
              <p className="text-sm text-muted-foreground">Keep going, you're doing great 💪</p>
            </div>
          </div>
        </motion.div>

        {/* Risk Awareness */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Risk Awareness</h2>
          </div>
          <div className={`rounded-2xl ${riskBg} p-4 mb-3`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Risk Level</span>
              <span className={`text-lg font-bold ${riskColor}`}>{riskLevel}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {riskLevel === 'Low' && "Your recent habits look amazing! Keep up the awesome work 💚"}
              {riskLevel === 'Medium' && "Your habits have some room for improvement. Small changes make a big difference! 💛"}
              {riskLevel === 'High' && "Your recent habits show increased risk. Let's fix it early 💙"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            ⚠️ This is based on trends, not a medical diagnosis
          </p>
        </motion.div>

        {/* Future You */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-3xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-accent" />
            <h2 className="font-bold text-foreground">🔮 Future You</h2>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">Current path</span>
              <AvatarDisplay state={trend === 'up' ? 'high' : trend === 'stable' ? 'mid' : 'low'} size="md" showLabel={false} />
            </div>
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-muted-foreground">Keep improving!</span>
              <AvatarDisplay state="high" size="md" showLabel={false} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            {trend === 'up'
              ? "If you keep this up, future you will be thriving! 🌟"
              : "Small improvements now = huge results later. You got this! 💪"}
          </p>
        </motion.div>

        {/* Suggestions */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-3xl gradient-primary p-5 text-primary-foreground">
          <h2 className="font-bold text-lg mb-2">💡 Next Week Tips</h2>
          <ul className="space-y-2 text-sm">
            <li>• Try replacing 1 sugary drink with water daily</li>
            <li>• Add a 5-min stretch to your morning</li>
            <li>• Aim for 8 hours of sleep tonight</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default WeeklySummary;
