import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import AvatarDisplay from '@/components/AvatarDisplay';
import { TrendingUp, TrendingDown, Minus, Shield, Sparkles, ChevronRight } from 'lucide-react';

const WeeklySummary = () => {
  const { avatarState, dailyScore, streak, completedChallenges, points, level, weeklyData, diabetesRisk } = useUser();

  const days = weeklyData.length > 0 ? weeklyData : [
    { day: 'Today', score: dailyScore, mood: avatarState, logged: true },
  ];

  const avgScore = days.length > 0 ? Math.round(days.reduce((a, d) => a + d.score, 0) / days.length) : dailyScore;
  const trend = avgScore >= 70 ? 'up' : avgScore >= 50 ? 'stable' : 'down';

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Weekly Summary 📅</h1>
          <p className="text-sm text-muted-foreground">Here's how your week went!</p>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-3xl bg-card p-5 shadow-card">
          <h2 className="font-bold text-foreground mb-4">Avatar Mood This Week</h2>
          {days.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Log your habits daily to see trends here!</p>
          ) : (
            <>
              <div className="flex justify-between items-end gap-1">
                {days.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <AvatarDisplay state={d.mood} size="sm" showLabel={false} />
                    <div className="h-16 w-8 rounded-lg bg-muted overflow-hidden flex items-end">
                      <motion.div
                        className={`w-full rounded-lg ${d.score >= 70 ? 'gradient-success' : d.score >= 50 ? 'gradient-accent' : 'gradient-danger'}`}
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.score / 100) * 100}%` }}
                        transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{d.day}</span>
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
            </>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">{streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak 🔥</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">{completedChallenges.length}</p>
            <p className="text-xs text-muted-foreground">Challenges ✅</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card text-center">
            <p className="text-2xl font-bold text-foreground">{points}</p>
            <p className="text-xs text-muted-foreground">Points ⭐</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-3xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="font-bold text-foreground">Risk Awareness</h2>
          </div>
          <div className={`rounded-2xl ${diabetesRisk.level === 'low' ? 'bg-success/10' : diabetesRisk.level === 'medium' ? 'bg-warning/10' : 'bg-destructive/10'} p-4`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Risk Level</span>
              <span className={`text-lg font-bold ${diabetesRisk.level === 'low' ? 'text-success' : diabetesRisk.level === 'medium' ? 'text-warning' : 'text-destructive'}`}>
                {diabetesRisk.level.charAt(0).toUpperCase() + diabetesRisk.level.slice(1)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {diabetesRisk.level === 'low' && "Your recent habits look amazing! Keep up the awesome work 💚"}
              {diabetesRisk.level === 'medium' && "Your habits have some room for improvement. Small changes make a big difference! 💛"}
              {diabetesRisk.level === 'high' && "Your recent habits show increased risk. Let's fix it early 💙"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">⚠️ Based on trends, not a medical diagnosis</p>
        </motion.div>

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
