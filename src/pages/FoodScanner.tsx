import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, FoodEntry } from '@/context/UserContext';
import { Camera, ScanBarcode, Plus, Zap, Droplets, Loader2, X, AlertTriangle, Lightbulb, ArrowRightLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const levelColors = {
  safe: { bg: 'bg-success/10', text: 'text-success', dot: 'bg-success', label: '🟢 Safe' },
  moderate: { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning', label: '🟡 Moderate' },
  high: { bg: 'bg-destructive/10', text: 'text-destructive', dot: 'bg-destructive', label: '🔴 High Sugar' },
};

const FoodScanner = () => {
  const { foodLog, addFoodEntry, profile } = useUser();
  const [analyzing, setAnalyzing] = useState(false);
  const [scannedFood, setScannedFood] = useState<FoodEntry | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const totalCalories = foodLog.reduce((acc, f) => acc + f.calories, 0);
  const totalSugar = foodLog.reduce((acc, f) => acc + f.sugar, 0);
  const avgLevel = totalSugar > 40 ? 'high' : totalSugar > 20 ? 'moderate' : 'safe';

  const processImage = async (file: File) => {
    setAnalyzing(true);
    setCapturedImage(null);
    setScannedFood(null);

    try {
      // Convert to base64
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          setCapturedImage(result);
          resolve(result.split(',')[1]); // Remove data:image/... prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke('analyze-food', {
        body: {
          imageBase64: base64,
          userProfile: {
            age: profile.age,
            height: profile.height,
            weight: profile.weight,
            familyDiabetes: profile.familyDiabetes,
            dailySugar: profile.dailySugar,
          },
        },
      });

      if (error) throw error;

      const entry: FoodEntry = {
        id: Date.now().toString(),
        name: data.nutrition.name,
        calories: Math.round(data.nutrition.calories),
        sugar: Math.round(data.nutrition.sugar),
        fat: Math.round(data.nutrition.fat),
        level: data.sugarLevel as 'safe' | 'moderate' | 'high',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        advice: data.advice,
      };

      setScannedFood(entry);
    } catch (err: any) {
      console.error('Food scan error:', err);
      toast({
        title: "Scan Failed",
        description: err.message || "Could not analyze the food. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
    e.target.value = '';
  };

  const addScanned = () => {
    if (scannedFood) {
      addFoodEntry(scannedFood);
      setScannedFood(null);
      setCapturedImage(null);
      toast({ title: "Added to log! ✅", description: `${scannedFood.name} +5 points` });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Food Scanner 📸</h1>
          <p className="text-sm text-muted-foreground">Snap a photo to get AI-powered nutrition info</p>
        </motion.div>

        {/* Hidden file inputs */}
        <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCameraCapture} />
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCameraCapture} />

        {/* Scan Buttons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={analyzing}
            className="flex flex-col items-center gap-2 rounded-2xl gradient-primary p-5 text-primary-foreground shadow-button active:scale-95 transition-transform disabled:opacity-50"
          >
            <Camera className="h-8 w-8" />
            <span className="text-sm font-bold">Take Photo</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={analyzing}
            className="flex flex-col items-center gap-2 rounded-2xl gradient-purple p-5 text-primary-foreground shadow-card active:scale-95 transition-transform disabled:opacity-50"
          >
            <ScanBarcode className="h-8 w-8" />
            <span className="text-sm font-bold">Upload Photo</span>
          </button>
        </motion.div>

        {/* Analyzing spinner */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="rounded-3xl bg-card p-8 flex flex-col items-center gap-4 shadow-card"
            >
              {capturedImage && (
                <img src={capturedImage} alt="Captured food" className="h-40 w-40 rounded-2xl object-cover" />
              )}
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-semibold text-muted-foreground">Analyzing with AI + FatSecret...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scanned Result */}
        <AnimatePresence>
          {scannedFood && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-3xl bg-card p-5 shadow-card border-2 border-primary/30 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-foreground">🎯 Detected Food</h3>
                <button onClick={() => { setScannedFood(null); setCapturedImage(null); }} className="p-1 rounded-full hover:bg-muted">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {capturedImage && (
                <img src={capturedImage} alt="Food" className="w-full h-40 rounded-2xl object-cover" />
              )}

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">{scannedFood.name}</span>
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${levelColors[scannedFood.level].bg} ${levelColors[scannedFood.level].text}`}>
                  {levelColors[scannedFood.level].label}
                </span>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">{scannedFood.calories} cal</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-semibold text-foreground">{scannedFood.sugar}g sugar</span>
                </div>
                {scannedFood.fat !== undefined && (
                  <div className="flex items-center gap-1">
                    <span className="text-sm">🧈</span>
                    <span className="text-sm font-semibold text-foreground">{scannedFood.fat}g fat</span>
                  </div>
                )}
              </div>

              {/* AI Advice */}
              {scannedFood.advice && (
                <div className="space-y-3">
                  <div className={`rounded-2xl p-4 ${scannedFood.advice.isGoodChoice ? 'bg-success/10' : 'bg-destructive/10'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {scannedFood.advice.isGoodChoice ? (
                        <span className="text-lg">✅</span>
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      <span className="font-bold text-foreground">
                        {scannedFood.advice.isGoodChoice ? 'Good Choice!' : 'Careful!'}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{scannedFood.advice.explanation}</p>
                  </div>

                  {scannedFood.advice.healthierSwap && !scannedFood.advice.isGoodChoice && (
                    <div className="rounded-2xl bg-primary/10 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowRightLeft className="h-4 w-4 text-primary" />
                        <span className="font-bold text-sm text-primary">Healthier Swap</span>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{scannedFood.advice.healthierSwap}</p>
                      <p className="text-xs text-muted-foreground mt-1">{scannedFood.advice.swapReason}</p>
                    </div>
                  )}

                  <div className="flex items-start gap-2 p-3 rounded-xl bg-muted">
                    <Lightbulb className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">{scannedFood.advice.tip}</p>
                  </div>
                </div>
              )}

              <button
                onClick={addScanned}
                className="w-full rounded-2xl gradient-primary py-3 text-primary-foreground font-bold shadow-button active:scale-95 transition-transform"
              >
                Add to Log <Plus className="inline h-4 w-4 ml-1" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

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
          {foodLog.length === 0 ? (
            <div className="rounded-2xl bg-card p-8 shadow-card text-center">
              <span className="text-4xl">📷</span>
              <p className="text-sm text-muted-foreground mt-2">No foods scanned yet. Take a photo to start!</p>
            </div>
          ) : (
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
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FoodScanner;
