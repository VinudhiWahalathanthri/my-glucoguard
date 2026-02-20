import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Candy, GlassWater, Footprints, Moon, Smile, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const habitItems = [
  { key: 'sugarItems' as const, icon: Candy, label: 'Sugar Items', emoji: '🍬', max: 10, unit: 'items', color: 'text-destructive' },
  { key: 'sugaryDrinks' as const, icon: GlassWater, label: 'Sugary Drinks', emoji: '🥤', max: 5, unit: 'drinks', color: 'text-warning' },
  { key: 'activityMinutes' as const, icon: Footprints, label: 'Activity', emoji: '🏃', max: 120, unit: 'min', color: 'text-success', step: 5 },
  { key: 'sleepHours' as const, icon: Moon, label: 'Sleep', emoji: '🛌', max: 12, unit: 'hrs', color: 'text-secondary', step: 0.5 },
  { key: 'energyMood' as const, icon: Smile, label: 'Energy / Mood', emoji: '😊', max: 5, unit: '', color: 'text-primary' },
];

const moodEmojis = ['😫', '😟', '😐', '🙂', '😄', '🤩'];

const HabitTracker = () => {
  const { habits, setHabits, habitsLoggedToday, markHabitsLogged, streak } = useUser();

  const handleSaveHabits = () => {
    markHabitsLogged();
    toast({
      title: "Habits logged! 🎉",
      description: `+10 points • ${streak + 1} day streak`,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Daily Habits 📊</h1>
          <p className="text-sm text-muted-foreground">Quick taps & slides – no typing needed!</p>
        </motion.div>

        {habitItems.map((item, i) => {
          const value = habits[item.key];
          const step = (item as any).step || 1;

          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-card p-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="font-bold text-foreground">{item.label}</span>
                </div>
                <span className={`text-lg font-bold ${item.color}`}>
                  {item.key === 'energyMood' ? moodEmojis[value] : `${value} ${item.unit}`}
                </span>
              </div>

              {item.key === 'energyMood' ? (
                <div className="flex justify-between gap-2">
                  {moodEmojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHabits({ energyMood: idx })}
                      className={`flex-1 rounded-xl py-2 text-xl transition-all ${
                        value === idx
                          ? 'gradient-primary shadow-button scale-110'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <input
                    type="range"
                    min={0}
                    max={item.max}
                    step={step}
                    value={value}
                    onChange={(e) => setHabits({ [item.key]: Number(e.target.value) })}
                    className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-muted-foreground">0</span>
                    <span className="text-xs text-muted-foreground">{item.max} {item.unit}</span>
                  </div>

                  {item.max <= 10 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {Array.from({ length: item.max + 1 }, (_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setHabits({ [item.key]: idx })}
                          className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                            value === idx
                              ? 'gradient-primary text-primary-foreground shadow-button'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {idx}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          );
        })}

        {/* Save Button */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <button
            onClick={handleSaveHabits}
            disabled={habitsLoggedToday}
            className={`w-full rounded-2xl py-4 font-bold text-lg shadow-button transition-all active:scale-95 ${
              habitsLoggedToday
                ? 'bg-success/20 text-success cursor-default'
                : 'gradient-primary text-primary-foreground'
            }`}
          >
            {habitsLoggedToday ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5" /> Logged Today ✅
              </span>
            ) : (
              'Save Today\'s Habits 💾'
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HabitTracker;
