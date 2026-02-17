import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser, FoodEntry } from '@/context/UserContext';
import { Camera, ScanBarcode, Plus, ArrowRight, Zap, Droplets } from 'lucide-react';

const healthySwaps = [
  { from: 'Soda', to: 'Sparkling water with lemon', emoji: '🥤➡️💧' },
  { from: 'Candy bar', to: 'Dark chocolate square', emoji: '🍫➡️🍫' },
  { from: 'Chips', to: 'Air-popped popcorn', emoji: '🍟➡️🍿' },
  { from: 'Ice cream', to: 'Frozen yogurt', emoji: '🍦➡️🧊' },
];

const levelColors = {
  safe: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success', label: '🟢 Safe' },
  moderate: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', label: '🟡 Moderate' },
  high: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive', label: '🔴 High Sugar' },
};

const FoodScanner = () => {
  const { foodLog, addFoodEntry } = useUser();
  const [showCamera, setShowCamera] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodEntry | null>(null);

  const totalCalories = foodLog.reduce((acc, f) => acc + f.calories, 0);
  const totalSugar = foodLog.reduce((acc, f) => acc + f.sugar, 0);
  const avgLevel = totalSugar > 40 ? 'high' : totalSugar > 20 ? 'moderate' : 'safe';

  const simulateScan = () => {
    setShowCamera(true);
    setTimeout(() => {
      const foods: FoodEntry[] = [
        { id: Date.now().toString(), name: 'Pizza Slice', calories: 285, sugar: 3, level: 'moderate', time: 'Just now' },
        { id: Date.now().toString(), name: 'Chocolate Milkshake', calories: 450, sugar: 55, level: 'high', time: 'Just now' },
        { id: Date.now().toString(), name: 'Greek Yogurt', calories: 100, sugar: 7, level: 'safe', time: 'Just now' },
      ];
      const random = foods[Math.floor(Math.random() * foods.length)];
      setScannedFood(random);
      setShowCamera(false);
    }, 2000);
  };

  const addScanned = () => {
    if (scannedFood) {
      addFoodEntry(scannedFood);
      setScannedFood(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Food Scanner 📸</h1>
          <p className="text-sm text-muted-foreground">Track what you eat, stay in control</p>
        </motion.div>

        {/* Scan Buttons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3">
          <button
            onClick={simulateScan}
            className="flex flex-col items-center gap-2 rounded-2xl gradient-primary p-5 text-primary-foreground shadow-button active:scale-95 transition-transform"
          >
            <Camera className="h-8 w-8" />
            <span className="text-sm font-bold">Scan Food</span>
          </button>
          <button className="flex flex-col items-center gap-2 rounded-2xl gradient-purple p-5 text-primary-foreground shadow-card active:scale-95 transition-transform">
            <ScanBarcode className="h-8 w-8" />
            <span className="text-sm font-bold">Scan Barcode</span>
          </button>
        </motion.div>

        {/* Camera simulation */}
        {showCamera && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-foreground/90 p-8 flex flex-col items-center gap-4"
          >
            <div className="h-40 w-40 rounded-2xl border-4 border-dashed border-primary-foreground/50 flex items-center justify-center">
              <div className="animate-pulse text-primary-foreground/80 text-sm font-semibold">Scanning...</div>
            </div>
            <p className="text-primary-foreground/70 text-sm">Point camera at your food</p>
          </motion.div>
        )}

        {/* Scanned Result */}
        {scannedFood && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl bg-card p-5 shadow-card border-2 border-primary/30"
          >
            <h3 className="font-bold text-foreground mb-3">🎯 Detected Food</h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-foreground">{scannedFood.name}</span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${levelColors[scannedFood.level].bg} ${levelColors[scannedFood.level].text}`}>
                {levelColors[scannedFood.level].label}
              </span>
            </div>
            <div className="flex gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">{scannedFood.calories} cal</span>
              </div>
              <div className="flex items-center gap-1">
                <Droplets className="h-4 w-4 text-destructive" />
                <span className="text-sm font-semibold text-foreground">{scannedFood.sugar}g sugar</span>
              </div>
            </div>
            <button
              onClick={addScanned}
              className="w-full rounded-2xl gradient-primary py-3 text-primary-foreground font-bold shadow-button"
            >
              Add to Log <Plus className="inline h-4 w-4 ml-1" />
            </button>
          </motion.div>
        )}

        {/* Summary Cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground">Total Calories</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalCalories}</p>
            <p className="text-xs text-muted-foreground">today</p>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Total Sugar</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalSugar}g</p>
            <div className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${levelColors[avgLevel].bg} ${levelColors[avgLevel].text}`}>
              {levelColors[avgLevel].label}
            </div>
          </div>
        </motion.div>

        {/* Food Log */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-lg font-bold text-foreground mb-3">📋 Today's Food Log</h2>
          <div className="space-y-2">
            {foodLog.map((item) => {
              const lc = levelColors[item.level];
              return (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-card">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${lc.dot}`} />
                    <div>
                      <p className="font-semibold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{item.calories} cal</p>
                    <p className={`text-xs font-semibold ${lc.text}`}>{item.sugar}g sugar</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Healthy Swaps */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-lg font-bold text-foreground mb-3">💡 Healthy Swaps</h2>
          <div className="space-y-2">
            {healthySwaps.map((swap) => (
              <div key={swap.from} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
                <span className="text-2xl">{swap.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Instead of <span className="font-semibold text-foreground">{swap.from}</span></p>
                  <p className="text-sm font-semibold text-primary">Try {swap.to}!</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodScanner;
