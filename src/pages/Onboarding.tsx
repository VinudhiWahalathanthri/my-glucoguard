import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Heart, Shield, Sparkles } from "lucide-react";

const steps = [
  {
    title: "Welcome! 🎉",
    subtitle: "Let's set up your GlucoGuard profile",
    field: "welcome",
  },
  {
    title: "Age Check",
    subtitle: "Safety first! How old are you?",
    field: "age_gate",
  },
  { title: "How old are you?", subtitle: "Between 10 and 25", field: "age" },
  {
    title: "What's your gender?",
    subtitle: "Select what applies to you",
    field: "gender",
  },
  { title: "What's your height?", subtitle: "In centimeters", field: "height" },
  { title: "What's your weight?", subtitle: "In kilograms", field: "weight" },
  {
    title: "Family history?",
    subtitle: "Does diabetes run in your family?",
    field: "familyDiabetes",
  },
  {
    title: "Tea & Sugar ☕",
    subtitle: "How many cups of tea with sugar daily?",
    field: "teaLog",
  },
  {
    title: "Sleep 😴",
    subtitle: "How many hours did you sleep last night?",
    field: "sleep",
  },
  {
    title: "Activity 🏃",
    subtitle: "Minutes of physical activity today?",
    field: "activity",
  },
  {
    title: "Meal Habits 🍽️",
    subtitle: "What does your typical day look like?",
    field: "meals",
  },
  {
    title: "School Commute 🚲",
    subtitle: "How do you get to school?",
    field: "commute",
  },
  {
    title: "Sports & Fitness ⚽",
    subtitle: "Daily exercise and school sports",
    field: "fitness",
  },
  {
    title: "You're all set! 🚀",
    subtitle: "Let's start your health journey",
    field: "complete",
  },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const { profile, setProfile } = useUser();
  const { habits, setHabits } = useUser();
  const navigate = useNavigate();
  const [localAge, setLocalAge] = useState("");
  const [localHeight, setLocalHeight] = useState("");
  const [localWeight, setLocalWeight] = useState("");
  const [isBlocked, setIsBlocked] = useState(false);

  const [meals, setMeals] = useState({ breakfast: "", lunch: "", dinner: "" });
  const [commute, setCommute] = useState("");
  const [fitness, setFitness] = useState({
    playsSports: false,
    hoursPerDay: 1,
    daysPerWeek: 3,
    homeExerciseMins: 0,
  });

  const currentStep = steps[step];
  const progress = (step / (steps.length - 1)) * 100;

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else {
      setProfile({ onboardingComplete: true });
      navigate("/");
    }
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };
  const renderField = () => {
    if (isBlocked) {
      return (
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
          <div className="text-8xl">🛑</div>
          <div className="rounded-2xl bg-destructive/10 p-6 text-center border-2 border-destructive/20">
            <p className="text-lg font-bold text-destructive">
              Access Restricted
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              GlucoGuard is designed for users 13 and older to comply with
              safety and privacy guidelines.
            </p>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      );
    }
    switch (currentStep.field) {
      case "welcome":
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="text-8xl animate-float">🛡️</div>
            <div className="flex gap-4">
              {[
                {
                  icon: Heart,
                  label: "Track Health",
                  color: "text-destructive",
                },
                { icon: Shield, label: "Stay Safe", color: "text-primary" },
                { icon: Sparkles, label: "Earn Rewards", color: "text-accent" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-card p-4 shadow-card"
                >
                  <Icon className={`h-6 w-6 ${color}`} />
                  <span className="text-sm font-semibold text-foreground">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground text-center max-w-xs">
              Your personal health guardian. Fun, private, and made just for
              teens! 💙
            </p>
          </div>
        );
      case "age_gate":
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="text-6xl">😶‍🌫️</div>
            <p className="font-semibold text-center">
              Are you 13 years of age or older?
            </p>
            <div className="flex gap-4 w-full">
              <Button
                className="flex-1 h-16 rounded-2xl text-xl font-bold border-2 border-primary/20 bg-card text-foreground hover:bg-primary/10"
                onClick={() => setIsBlocked(true)}
              >
                No
              </Button>
              <Button
                className="flex-1 h-16 rounded-2xl text-xl font-bold gradient-primary text-primary-foreground"
                onClick={next}
              >
                Yes
              </Button>
            </div>
          </div>
        );
      case "age":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🎂</div>
            <input
              type="number"
              value={localAge}
              onChange={(e) => {
                setLocalAge(e.target.value);
                setProfile({ age: Number(e.target.value) });
              }}
              placeholder="Enter your age"
              className="w-48 rounded-2xl border-2 border-primary/20 bg-card px-6 py-4 text-center text-2xl font-bold text-foreground outline-none focus:border-primary transition-colors"
              min={10}
              max={25}
            />
            <p className="text-sm text-muted-foreground">Between 10 and 25</p>
          </div>
        );
      case "gender":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-3">
              {[
                { value: "male", emoji: "👦", label: "Male" },
                { value: "female", emoji: "👧", label: "Female" },
                { value: "other", emoji: "🧑", label: "Other" },
              ].map(({ value, emoji, label }) => (
                <button
                  key={value}
                  onClick={() => setProfile({ gender: value })}
                  className={`flex flex-col items-center gap-2 rounded-2xl px-6 py-4 transition-all ${
                    profile.gender === value
                      ? "gradient-primary text-primary-foreground shadow-button scale-105"
                      : "bg-card shadow-card hover:shadow-card-hover"
                  }`}
                >
                  <span className="text-4xl">{emoji}</span>
                  <span className="font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case "height":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">📏</div>
            <div className="flex items-end gap-2">
              <input
                type="number"
                value={localHeight}
                onChange={(e) => {
                  setLocalHeight(e.target.value);
                  setProfile({ height: Number(e.target.value) });
                }}
                placeholder="Height"
                className="w-36 rounded-2xl border-2 border-primary/20 bg-card px-6 py-4 text-center text-2xl font-bold text-foreground outline-none focus:border-primary transition-colors"
              />
              <span className="pb-4 text-lg font-semibold text-muted-foreground">
                cm
              </span>
            </div>
          </div>
        );
      case "weight":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">⚖️</div>
            <div className="flex items-end gap-2">
              <input
                type="number"
                value={localWeight}
                onChange={(e) => {
                  setLocalWeight(e.target.value);
                  setProfile({ weight: Number(e.target.value) });
                }}
                placeholder="Weight"
                className="w-36 rounded-2xl border-2 border-primary/20 bg-card px-6 py-4 text-center text-2xl font-bold text-foreground outline-none focus:border-primary transition-colors"
              />
              <span className="pb-4 text-lg font-semibold text-muted-foreground">
                kg
              </span>
            </div>
          </div>
        );
      case "familyDiabetes":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">👨‍👩‍👧</div>
            <div className="flex gap-4">
              {[
                { value: true, label: "Yes", emoji: "✅" },
                { value: false, label: "No", emoji: "❌" },
              ].map(({ value, label, emoji }) => (
                <button
                  key={label}
                  onClick={() => setProfile({ familyDiabetes: value })}
                  className={`flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-semibold transition-all ${
                    profile.familyDiabetes === value
                      ? "gradient-primary text-primary-foreground shadow-button scale-105"
                      : "bg-card shadow-card hover:shadow-card-hover"
                  }`}
                >
                  <span>{emoji}</span> {label}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              🔒 This info is completely private and never shared
            </p>
          </div>
        );
      case "dailySugar":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🍬</div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "low", label: "Very little", desc: "0-2 items/day" },
                { value: "moderate", label: "Some", desc: "3-5 items/day" },
                { value: "high", label: "Quite a lot", desc: "6-8 items/day" },
                { value: "very-high", label: "A lot!", desc: "9+ items/day" },
              ].map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setProfile({ dailySugar: value })}
                  className={`flex flex-col rounded-2xl px-4 py-3 text-left transition-all ${
                    profile.dailySugar === value
                      ? "gradient-primary text-primary-foreground shadow-button scale-105"
                      : "bg-card shadow-card hover:shadow-card-hover"
                  }`}
                >
                  <span className="font-bold">{label}</span>
                  <span
                    className={`text-xs ${profile.dailySugar === value ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                  >
                    {desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      case "teaLog":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">☕</div>
            <div className="flex items-center gap-4">
              {[0, 1, 2, 3, "4+"].map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setHabits({
                      sugaryDrinks: typeof num === "string" ? 4 : num,
                    })
                  }
                  className={`w-14 h-14 rounded-2xl font-bold transition-all ${
                    habits.sugaryDrinks === (typeof num === "string" ? 4 : num)
                      ? "gradient-primary text-primary-foreground scale-110"
                      : "bg-card shadow-card"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Cups per day</p>
          </div>
        );

      case "sleep":
        return (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl">🌙</div>
            <input
              type="range"
              min="4"
              max="12"
              step="0.5"
              value={habits.sleepHours}
              onChange={(e) =>
                setHabits({ sleepHours: Number(e.target.value) })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <span className="text-2xl font-bold text-foreground">
              {habits.sleepHours} Hours
            </span>
            <p className="text-sm text-muted-foreground">Ideal is 7-9 hours</p>
          </div>
        );

      case "activity":
        return (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="text-6xl">🏃</div>
            <div className="grid grid-cols-2 gap-3 w-full">
              {[
                { label: "None", val: 0 },
                { label: "Light (15m)", val: 15 },
                { label: "Active (30m)", val: 30 },
                { label: "Pro (60m+)", val: 60 },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setHabits({ activityMinutes: item.val })}
                  className={`p-4 rounded-2xl font-bold transition-all ${
                    habits.activityMinutes === item.val
                      ? "gradient-primary text-primary-foreground"
                      : "bg-card shadow-card"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        );

      case "meals":
        return (
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {/* Breakfast */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                🍳 Breakfast
              </label>
              <select
                onChange={(e) =>
                  setMeals({ ...meals, breakfast: e.target.value })
                }
                className="w-full p-3 rounded-xl bg-card border-2 border-primary/10 outline-none focus:border-primary"
              >
                <option value="">Select...</option>
                <option value="heavy">
                  Heavy (Rice, Bread, Eggs, Full meal)
                </option>
                <option value="light">Light (Cereal, Fruit, Toast)</option>
                <option value="none">I skip breakfast</option>
              </select>
            </div>

            {/* Lunch */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                🍱 Lunch
              </label>
              <select
                onChange={(e) => setMeals({ ...meals, lunch: e.target.value })}
                className="w-full p-3 rounded-xl bg-card border-2 border-primary/10 outline-none focus:border-primary"
              >
                <option value="">Select...</option>
                <option value="home">Home cooked (Rice & Curry/Pasta)</option>
                <option value="fastfood">
                  Fast Food / Canteen (Burgers, Fries)
                </option>
                <option value="salad">Salad or light sandwich</option>
              </select>
            </div>

            {/* Dinner */}
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                🌙 Dinner
              </label>
              <select
                onChange={(e) => setMeals({ ...meals, dinner: e.target.value })}
                className="w-full p-3 rounded-xl bg-card border-2 border-primary/10 outline-none focus:border-primary"
              >
                <option value="">Select...</option>
                <option value="heavy">Full heavy meal (Rice, Meats)</option>
                <option value="light">Light dinner (Soup, Salad, Tea)</option>
                <option value="late">Late night heavy snacking</option>
              </select>
            </div>
          </div>
        );

      case "commute":
        return (
          <div className="grid grid-cols-1 gap-3 w-full">
            {[
              {
                id: "car",
                label: "Car / Bus",
                emoji: "🚗",
                desc: "Mostly sitting",
              },
              {
                id: "cycle",
                label: "Bicycle",
                emoji: "🚲",
                desc: "Good workout",
              },
              {
                id: "walk",
                label: "Walking",
                emoji: "🚶",
                desc: "Highly active",
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCommute(item.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  commute === item.id
                    ? "gradient-primary text-primary-foreground scale-105"
                    : "bg-card border-2 border-primary/5 shadow-sm"
                }`}
              >
                <span className="text-3xl">{item.emoji}</span>
                <div className="text-left">
                  <p className="font-bold">{item.label}</p>
                  <p
                    className={`text-xs ${commute === item.id ? "opacity-80" : "text-muted-foreground"}`}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        );
      case "fitness":
        return (
          <div className="flex flex-col gap-6 w-full max-w-sm animate-in fade-in slide-in-from-bottom-4">
            {/* Primary Question */}
            <div className="bg-card p-5 rounded-3xl border-2 border-primary/5 shadow-sm">
              <p className="font-bold text-center mb-4">
                Do you play sports in school? ⚽
              </p>
              <div className="flex gap-4">
                <Button
                  className={`flex-1 h-12 rounded-2xl font-bold transition-all ${fitness.playsSports ? "gradient-primary text-white" : "bg-muted text-muted-foreground"}`}
                  onClick={() => setFitness({ ...fitness, playsSports: true })}
                >
                  Yes
                </Button>
                <Button
                  className={`flex-1 h-12 rounded-2xl font-bold transition-all ${!fitness.playsSports ? "gradient-primary text-white" : "bg-muted text-muted-foreground"}`}
                  onClick={() => setFitness({ ...fitness, playsSports: false })}
                >
                  No
                </Button>
              </div>
            </div>

            {/* Conditional Detailed Sports Questions */}
            <AnimatePresence>
              {fitness.playsSports && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="bg-accent/5 p-4 rounded-2xl border border-accent/20">
                    <label className="text-sm font-bold flex justify-between">
                      <span>Hours per session</span>
                      <span className="text-accent">
                        {fitness.hoursPerDay}h
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="4"
                      step="0.5"
                      value={fitness.hoursPerDay}
                      onChange={(e) =>
                        setFitness({
                          ...fitness,
                          hoursPerDay: parseFloat(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  <div className="bg-accent/5 p-4 rounded-2xl border border-accent/20">
                    <label className="text-sm font-bold flex justify-between">
                      <span>Days per week</span>
                      <span className="text-accent">
                        {fitness.daysPerWeek} days
                      </span>
                    </label>
                    <div className="flex justify-between mt-2">
                      {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                        <button
                          key={d}
                          onClick={() =>
                            setFitness({ ...fitness, daysPerWeek: d })
                          }
                          className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${fitness.daysPerWeek === d ? "bg-accent text-white" : "bg-muted"}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Home Exercise Section */}
            <div className="space-y-3 px-2">
              <p className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
                Home Exercise / Gym
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={fitness.homeExerciseMins}
                  onChange={(e) =>
                    setFitness({
                      ...fitness,
                      homeExerciseMins: Number(e.target.value),
                    })
                  }
                  placeholder="Mins"
                  className="w-24 p-3 rounded-xl border-2 border-primary/10 bg-card text-center font-bold"
                />
                <span className="text-sm font-medium">mins daily</span>
              </div>
            </div>
          </div>
        );
      case "complete":
        return (
          <div className="flex flex-col items-center gap-6">
            <div className="text-8xl animate-bounce-in">🎊</div>
            <div className="rounded-2xl gradient-primary p-6 text-primary-foreground text-center">
              <p className="text-lg font-bold">Your GlucoGuard is ready!</p>
              <p className="text-sm opacity-90 mt-1">
                Time to start earning points & keeping healthy 💪
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-background px-6 py-8">
      <div className="w-full max-w-md">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full gradient-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Step {step + 1} of {steps.length}
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center gap-6 w-full"
          >
            <h1 className="text-2xl font-bold text-foreground text-center">
              {currentStep.title}
            </h1>
            <p className="text-muted-foreground text-center">
              {currentStep.subtitle}
            </p>
            {renderField()}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex w-full max-w-md items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={prev}
          disabled={step === 0}
          className="rounded-2xl px-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          onClick={next}
          className="rounded-2xl px-8 gradient-primary text-primary-foreground shadow-button border-0"
        >
          {step === steps.length - 1 ? "Let's Go!" : "Next"}{" "}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
