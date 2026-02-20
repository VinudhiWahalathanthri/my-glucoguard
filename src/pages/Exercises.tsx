import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipForward, Clock, ExternalLink } from 'lucide-react';

const categories = [
  { id: 'lazy', label: '😴 Lazy Day', color: 'gradient-accent' },
  { id: 'after-school', label: '🏫 After School', color: 'gradient-primary' },
  { id: 'low-energy', label: '🔋 Low Energy', color: 'gradient-success' },
  { id: 'stress', label: '🧘 Stress Relief', color: 'gradient-purple' },
];

const exercises = [
  { id: 'e1', name: '5-Min Wake Up Stretch', category: 'lazy', duration: 300, thumbnail: '🧘‍♂️', youtubeId: 'ml6cT4AZdqI', desc: 'Gentle stretches to start your day' },
  { id: 'e2', name: '10-Min Dance Workout', category: 'after-school', duration: 600, thumbnail: '💃', youtubeId: 'ml6cT4AZdqI', desc: 'Fun dance moves, no equipment' },
  { id: 'e3', name: '7-Min HIIT for Teens', category: 'after-school', duration: 420, thumbnail: '🔥', youtubeId: 'dJlFmxiL11s', desc: 'Quick high intensity burst' },
  { id: 'e4', name: 'Chair Yoga Break', category: 'low-energy', duration: 300, thumbnail: '🪑', youtubeId: 'v7AYKMP6rOE', desc: 'Do it at your desk!' },
  { id: 'e5', name: 'Breathing Exercises', category: 'stress', duration: 300, thumbnail: '🌬️', youtubeId: 'SEfs5TJZ6Nk', desc: 'Calm your mind in 5 mins' },
  { id: 'e6', name: 'Easy Bedroom Workout', category: 'lazy', duration: 480, thumbnail: '🛏️', youtubeId: 'IODxDxX7oi4', desc: 'Workout without leaving your room' },
  { id: 'e7', name: 'Walk & Talk Routine', category: 'low-energy', duration: 600, thumbnail: '🚶', youtubeId: 'njeZ29umqVE', desc: 'Light walking exercise' },
  { id: 'e8', name: 'Guided Meditation', category: 'stress', duration: 600, thumbnail: '🧠', youtubeId: 'inpok4MKVLM', desc: 'Peaceful meditation for teens' },
];

const Exercises = () => {
  const [selectedCategory, setSelectedCategory] = useState('lazy');
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const filtered = exercises.filter(e => e.category === selectedCategory);
  const currentExercise = exercises.find(e => e.id === activeExercise);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const startExercise = (ex: typeof exercises[0]) => {
    setActiveExercise(ex.id);
    setTimeLeft(ex.duration);
    setIsRunning(true);
    setShowVideo(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const nextExercise = () => {
    const idx = filtered.findIndex(e => e.id === activeExercise);
    if (idx < filtered.length - 1) {
      startExercise(filtered[idx + 1]);
    } else {
      setActiveExercise(null);
      setIsRunning(false);
      setShowVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <div className="mx-auto max-w-md space-y-5">

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Exercises 🏃‍♀️</h1>
          <p className="text-sm text-muted-foreground">Short & easy – no equipment needed!</p>
        </motion.div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActiveExercise(null);
                setIsRunning(false);
                setShowVideo(false);
              }}
              className={`whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-bold transition-all ${
                selectedCategory === cat.id
                  ? `${cat.color} text-primary-foreground shadow-button`
                  : 'bg-card text-foreground shadow-card'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {currentExercise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl gradient-hero p-6 text-primary-foreground space-y-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentExercise.thumbnail}</span>
              <div>
                <h3 className="font-bold text-lg">{currentExercise.name}</h3>
                <p className="text-sm opacity-80">{currentExercise.desc}</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl font-bold font-display">
                {formatTime(timeLeft)}
              </div>

              <div className="h-2 w-full rounded-full bg-primary-foreground/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-foreground/80 transition-all"
                  style={{
                    width: `${((currentExercise.duration - timeLeft) / currentExercise.duration) * 100}%`,
                  }}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="rounded-full bg-primary-foreground/20 p-3 hover:bg-primary-foreground/30 transition-colors"
                >
                  {isRunning ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </button>

                <button
                  onClick={nextExercise}
                  className="rounded-full bg-primary-foreground/20 p-3 hover:bg-primary-foreground/30 transition-colors"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
              </div>

              <button
                onClick={() => {
                  setIsRunning(false);
                  setShowVideo(!showVideo);
                }}
                className="flex items-center gap-2 rounded-xl bg-primary-foreground/20 px-4 py-2 text-sm font-bold hover:bg-primary-foreground/30 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {showVideo ? "Hide Tutorial" : "Watch Tutorial"}
              </button>
            </div>

            {showVideo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="aspect-video w-full overflow-hidden rounded-xl"
              >
                <iframe
                  className="h-full w-full rounded-xl"
                  src={`https://www.youtube.com/embed/${currentExercise.youtubeId}`}
                  title="Exercise Tutorial"
                  allowFullScreen
                />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Exercise List */}
        <div className="space-y-3">
          {filtered.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-card cursor-pointer active:scale-[0.98]"
              onClick={() => startExercise(ex)}
            >
              <span className="text-3xl">{ex.thumbnail}</span>
              <div className="flex-1">
                <p className="font-bold text-foreground">{ex.name}</p>
                <p className="text-xs text-muted-foreground">{ex.desc}</p>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {Math.floor(ex.duration / 60)} min
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Exercises;