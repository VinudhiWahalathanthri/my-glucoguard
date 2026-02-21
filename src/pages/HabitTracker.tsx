import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { Candy, GlassWater, Footprints, Moon, Smile, Check, Utensils } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const habitItems = [
  { key: 'sugarItems' as const, icon: Candy, label: 'Extra Sugar Items', emoji: '🍬', max: 10, unit: 'items', color: 'text-destructive' },
  { key: 'sugaryDrinks' as const, icon: GlassWater, label: 'Sugary Drinks', emoji: '🥤', max: 5, unit: 'drinks', color: 'text-warning' },
  { key: 'activityMinutes' as const, icon: Footprints, label: 'Activity', emoji: '🏃', max: 120, unit: 'min', color: 'text-success', step: 5 },
  { key: 'sleepHours' as const, icon: Moon, label: 'Sleep', emoji: '🛌', max: 12, unit: 'hrs', color: 'text-secondary', step: 0.5 },
  { key: 'energyMood' as const, icon: Smile, label: 'Energy / Mood', emoji: '😊', max: 5, unit: '', color: 'text-primary' },
];

const moodEmojis = ['😫', '😟', '😐', '🙂', '😄', '🤩'];

const mealOptions = [
  { label: 'Breakfast 🍳', key: 'breakfastType', options: [
    { label: 'Light', val: 'light', emoji: '🥣', sugarBoost: 0 },
    { label: 'Heavy', val: 'heavy', emoji: '🥞', sugarBoost: 2 },
    { label: 'None', val: 'none', emoji: '❌', sugarBoost: 0 }
  ]},
  { label: 'Lunch 🍱', key: 'lunchType', options: [
    { label: 'Healthy', val: 'salad', emoji: '🥗', sugarBoost: 0 },
    { label: 'Standard', val: 'home', emoji: '🏠', sugarBoost: 1 },
    { label: 'Fast Food', val: 'fastfood', emoji: '🍔', sugarBoost: 3 }
  ]},
  { label: 'Dinner 🌙', key: 'dinnerType', options: [
    { label: 'Light', val: 'light', emoji: '🍲', sugarBoost: 0 },
    { label: 'Heavy', val: 'heavy', emoji: '🍛', sugarBoost: 2 },
    { label: 'Late Snack', val: 'late', emoji: '🍕', sugarBoost: 3 }
  ]}
];

const HabitTracker = () => {
  const { habits, setHabits, profile, setProfile, habitsLoggedToday, markHabitsLogged, streak } = useUser();

  const handleMealSelect = (mealKey: string, val: string, boost: number) => {
    // 1. Update the profile with the meal type
    setProfile({ [mealKey]: val });
    
    // 2. Automatically nudge the sugar count based on meal "heaviness"
    if (boost > 0) {
      setHabits({ sugarItems: Math.min(10, habits.sugarItems + boost) });
      toast({
        title: "Sugar impact tracked",
        description: "Your sugar count was adjusted based on your meal choice.",
      });
    }
  };

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
          <p className="text-sm text-muted-foreground">Quick taps – tracking made easy!</p>
        </motion.div>

        {/* --- NEW MEAL SELECTOR SECTION --- */}
        <motion.div 
          className="rounded-3xl bg-card p-5 shadow-card space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="h-5 w-5 text-primary" />
            <span className="font-bold">What did you eat today?</span>
          </div>
          
          <div className="space-y-4">
            {mealOptions.map((meal) => (
              <div key={meal.key} className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase">{meal.label}</p>
                <div className="flex gap-2">
                  {meal.options.map((opt) => {
                    const isActive = (profile as any)[meal.key] === opt.val;
                    return (
                      <button
                        key={opt.val}
                        onClick={() => handleMealSelect(meal.key, opt.val, opt.sugarBoost)}
                        className={`flex-1 flex flex-col items-center py-2 rounded-2xl transition-all ${
                          isActive ? 'gradient-primary text-white scale-105' : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-[10px] font-bold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* --- SLIDER HABIT ITEMS --- */}
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

              {/* ... [Rest of your energyMood logic and input range remains the same] ... */}
              {item.key === 'energyMood' ? (
                <div className="flex justify-between gap-2">
                  {moodEmojis.map((emoji, idx) => (
                    <button
                      key={idx}
                      onClick={() => setHabits({ energyMood: idx })}
                      className={`flex-1 rounded-xl py-2 text-xl transition-all ${
                        value === idx ? 'gradient-primary shadow-button scale-110' : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="range"
                  min={0}
                  max={item.max}
                  step={step}
                  value={value}
                  onChange={(e) => setHabits({ [item.key]: Number(e.target.value) })}
                  className="w-full h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
                />
              )}
            </motion.div>
          );
        })}

        {/* --- SAVE BUTTON --- */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <button
            onClick={handleSaveHabits}
            disabled={habitsLoggedToday}
            className={`w-full rounded-2xl py-4 font-bold text-lg shadow-button transition-all active:scale-95 ${
              habitsLoggedToday ? 'bg-success/20 text-success cursor-default' : 'gradient-primary text-primary-foreground'
            }`}
          >
            {habitsLoggedToday ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="h-5 w-5" /> All Tracked! ✅
              </span>
            ) : (
              'Save Progress 💾'
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default HabitTracker;