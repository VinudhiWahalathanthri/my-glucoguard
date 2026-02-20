import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: string;
  familyDiabetes: boolean;
  dailySugar: string;
  onboardingComplete: boolean;
}

interface UserContextType {
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;
  points: number;
  addPoints: (p: number) => void;
  level: number;
  streak: number;
  completedChallenges: string[];
  completeChallenge: (id: string) => void;
  badges: string[];
  earnBadge: (badge: string) => void;
  dailyScore: number;
  setDailyScore: (s: number) => void;
  avatarState: "high" | "mid" | "low";
  setAvatarState: (s: "high" | "mid" | "low") => void;
  habits: DailyHabits;
  setHabits: (h: Partial<DailyHabits>) => void;
  foodLog: FoodEntry[];
  addFoodEntry: (entry: FoodEntry) => void;
  diabetesRisk: DiabetesRisk;
  weeklyData: WeeklyDay[];
  habitsLoggedToday: boolean;
  markHabitsLogged: () => void;
}

export interface DailyHabits {
  sugarItems: number;
  sugaryDrinks: number;
  activityMinutes: number;
  sleepHours: number;
  energyMood: number;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  sugar: number;
  fat?: number;
  level: "safe" | "moderate" | "high";
  time: string;
  image?: string;
  advice?: {
    isGoodChoice: boolean;
    explanation: string;
    healthierSwap: string;
    swapReason: string;
    tip: string;
  };
}

export interface DiabetesRisk {
  level: "low" | "medium" | "high";
  score: number;
  futureScore?: number;
  factors: string[];
}

export interface WeeklyDay {
  day: string;
  score: number;
  mood: "high" | "mid" | "low";
  logged: boolean;
}

const defaultProfile: UserProfile = {
  age: 0,
  height: 0,
  weight: 0,
  gender: "",
  familyDiabetes: false,
  dailySugar: "",
  onboardingComplete: false,
};

const defaultHabits: DailyHabits = {
  sugarItems: 0,
  sugaryDrinks: 0,
  activityMinutes: 0,
  sleepHours: 7,
  energyMood: 3,
};

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function calculateDiabetesRisk(
  profile: UserProfile,
  habits: DailyHabits,
): DiabetesRisk {
  let score = 0;
  const factors: string[] = [];

  // BMI factor
  if (profile.height > 0 && profile.weight > 0) {
    const bmi = profile.weight / Math.pow(profile.height / 100, 2);
    if (bmi > 30) {
      score += 25;
      factors.push("High BMI");
    } else if (bmi > 25) {
      score += 15;
      factors.push("Elevated BMI");
    } else {
      score += 0;
    }
  }

  // Family history
  if (profile.familyDiabetes) {
    score += 20;
    factors.push("Family history of diabetes");
  }

  // Daily sugar intake from onboarding
  if (profile.dailySugar === "very-high") {
    score += 20;
    factors.push("Very high sugar intake");
  } else if (profile.dailySugar === "high") {
    score += 15;
    factors.push("High sugar intake");
  } else if (profile.dailySugar === "moderate") {
    score += 8;
  }

  // Current habits
  if (habits.sugarItems >= 6) {
    score += 10;
    factors.push("High daily sugar items");
  } else if (habits.sugarItems >= 3) {
    score += 5;
  }

  if (habits.sugaryDrinks >= 3) {
    score += 10;
    factors.push("Frequent sugary drinks");
  } else if (habits.sugaryDrinks >= 1) {
    score += 3;
  }

  if (habits.activityMinutes < 10) {
    score += 10;
    factors.push("Low physical activity");
  } else if (habits.activityMinutes >= 30) {
    score -= 5;
  }

  if (habits.sleepHours < 6) {
    score += 5;
    factors.push("Insufficient sleep");
  }

  score = Math.max(0, Math.min(100, score));

  const level = score >= 50 ? "high" : score >= 25 ? "medium" : "low";
  return { level, score, factors };
}

function calculateDailyScore(habits: DailyHabits): number {
  let score = 50; // baseline
  // Lower sugar = better
  score += Math.max(0, 15 - habits.sugarItems * 3);
  score += Math.max(0, 10 - habits.sugaryDrinks * 4);
  // More activity = better
  score += Math.min(15, habits.activityMinutes / 2);
  // Good sleep = better
  if (habits.sleepHours >= 7 && habits.sleepHours <= 9) score += 10;
  else if (habits.sleepHours >= 6) score += 5;
  // Good mood = slight boost
  score += habits.energyMood * 3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<UserProfile>(() =>
    loadJSON("glucoguard_profile", defaultProfile),
  );
  const [points, setPoints] = useState(() => loadJSON("glucoguard_points", 0));
  const [streak, setStreak] = useState(() => loadJSON("glucoguard_streak", 0));
  const [lastActiveDate, setLastActiveDate] = useState(() =>
    loadJSON<string | null>("glucoguard_lastActive", null),
  );
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(() =>
    loadJSON("glucoguard_challenges", []),
  );
  const [badges, setBadges] = useState<string[]>(() =>
    loadJSON("glucoguard_badges", []),
  );
  const [dailyScore, setDailyScoreState] = useState(() =>
    loadJSON("glucoguard_dailyScore", 50),
  );
  const [avatarState, setAvatarStateInternal] = useState<
    "high" | "mid" | "low"
  >(() => loadJSON("glucoguard_avatar", "mid"));
  const [habits, setHabitsState] = useState<DailyHabits>(() =>
    loadJSON("glucoguard_habits", defaultHabits),
  );
  const [foodLog, setFoodLog] = useState<FoodEntry[]>(() =>
    loadJSON("glucoguard_foodLog", []),
  );
  const [habitsLoggedToday, setHabitsLoggedToday] = useState(
    () => loadJSON("glucoguard_habitsLoggedDate", "") === getToday(),
  );
  const [weeklyData, setWeeklyData] = useState<WeeklyDay[]>(() =>
    loadJSON("glucoguard_weeklyData", []),
  );

  useEffect(() => {
    saveJSON("glucoguard_profile", profile);
  }, [profile]);
  useEffect(() => {
    saveJSON("glucoguard_points", points);
  }, [points]);
  useEffect(() => {
    saveJSON("glucoguard_streak", streak);
  }, [streak]);
  useEffect(() => {
    saveJSON("glucoguard_lastActive", lastActiveDate);
  }, [lastActiveDate]);
  useEffect(() => {
    saveJSON("glucoguard_challenges", completedChallenges);
  }, [completedChallenges]);
  useEffect(() => {
    saveJSON("glucoguard_badges", badges);
  }, [badges]);
  useEffect(() => {
    saveJSON("glucoguard_dailyScore", dailyScore);
  }, [dailyScore]);
  useEffect(() => {
    saveJSON("glucoguard_avatar", avatarState);
  }, [avatarState]);
  useEffect(() => {
    saveJSON("glucoguard_habits", habits);
  }, [habits]);
  useEffect(() => {
    saveJSON("glucoguard_foodLog", foodLog);
  }, [foodLog]);
  useEffect(() => {
    saveJSON("glucoguard_weeklyData", weeklyData);
  }, [weeklyData]);

  useEffect(() => {
    const today = getToday();
    if (lastActiveDate === null) {
      return;
    }
    const lastDate = new Date(lastActiveDate);
    const todayDate = new Date(today);
    const diffDays = Math.floor(
      (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays > 1) {
      setStreak(0);
    }
  }, []);

  // Update avatar state based on daily score
  useEffect(() => {
    if (dailyScore >= 70) setAvatarStateInternal("high");
    else if (dailyScore >= 40) setAvatarStateInternal("mid");
    else setAvatarStateInternal("low");
  }, [dailyScore]);

  // const diabetesRisk = calculateDiabetesRisk(profile, habits);

  useEffect(() => {
    if (profile.age > 9 && profile.weight > 20 && profile.height > 50) {
      updateAIRisk(profile, habits);
    }
  }, [profile, habits]);

  const [diabetesRisk, setDiabetesRisk] = useState<DiabetesRisk>({
    level: "low",
    score: 0,
    factors: [],
  });

  const onboardingSugarMap: Record<string, number> = {
  'low': 2,
  'moderate': 5,
  'high': 8,
  'very-high': 10
};

  const updateAIRisk = async (
    currentProfile: UserProfile,
    currentHabits: DailyHabits,
  ) => {
    try {
      console.log("Sending data to ML model:", {
        age: currentProfile.age,
        weight: currentProfile.weight,
        height: currentProfile.height,
        family_history: currentProfile.familyDiabetes,
        sugar_intake: currentHabits.sugarItems + currentHabits.sugaryDrinks,
        activity_mins: currentHabits.activityMinutes,
        sleep_hours: currentHabits.sleepHours,
      });

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: currentProfile.age,
          weight: currentProfile.weight,
          height: currentProfile.height,
          family_history: currentProfile.familyDiabetes,
          sugar_intake:
            currentHabits.sugarItems + currentHabits.sugaryDrinks ||
            onboardingSugarMap[currentProfile.dailySugar] ||
            0,
          activity_mins: currentHabits.activityMinutes || 30, 
          sleep_hours: currentHabits.sleepHours,
        }),
      });

      const data = await response.json();
      console.log("ML Model Response:", data);

      setDiabetesRisk({
        level: data.level,
        score: data.currentRiskScore,
        futureScore: data.futureRiskScore,
        factors: data.message ? [data.message] : [],
      });
    } catch (error) {
      console.error("ML Server offline. Falling back to manual calculation.");
    }
  };

  //// AI MODEL ABOFE

  const setProfile = (partial: Partial<UserProfile>) => {
    setProfileState((prev) => ({ ...prev, ...partial }));
  };

  const addPoints = (p: number) => setPoints((prev: number) => prev + p);
  const level = Math.floor(points / 100) + 1;

  const completeChallenge = (id: string) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges((prev) => [...prev, id]);
      addPoints(25);
    }
  };

  const earnBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges((prev) => [...prev, badge]);
      addPoints(50);
    }
  };

  const setHabits = (partial: Partial<DailyHabits>) => {
    setHabitsState((prev) => {
      const next = { ...prev, ...partial };
      const newScore = calculateDailyScore(next);
      setDailyScoreState(newScore);
      return next;
    });
  };

  const setDailyScore = (s: number) => setDailyScoreState(s);
  const setAvatarState = (s: "high" | "mid" | "low") =>
    setAvatarStateInternal(s);

  const markHabitsLogged = () => {
    const today = getToday();
    if (!habitsLoggedToday) {
      setHabitsLoggedToday(true);
      saveJSON("glucoguard_habitsLoggedDate", today);

      // Update streak
      if (lastActiveDate !== today) {
        const lastDate = lastActiveDate ? new Date(lastActiveDate) : null;
        const todayDate = new Date(today);
        const diffDays = lastDate
          ? Math.floor(
              (todayDate.getTime() - lastDate.getTime()) /
                (1000 * 60 * 60 * 24),
            )
          : -1;

        if (diffDays === 1 || diffDays === -1) {
          setStreak((prev) => prev + 1);
        } else if (diffDays === 0) {
          // Same day, don't increment
        } else {
          setStreak(1); // restart streak
        }
        setLastActiveDate(today);
      }

      // Add to weekly data
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dayName = dayNames[new Date().getDay()];
      const score = calculateDailyScore(habits);
      const mood: "high" | "mid" | "low" =
        score >= 70 ? "high" : score >= 40 ? "mid" : "low";
      setWeeklyData((prev) => {
        const updated = [...prev, { day: dayName, score, mood, logged: true }];
        // Keep only last 7 entries
        return updated.slice(-7);
      });

      addPoints(10); // Points for logging

      // Check badge conditions
      if (streak >= 2) earnBadge("streak-3");
      if (streak >= 6) earnBadge("streak-7");
      if (habits.sugarItems === 0 && habits.sugaryDrinks === 0)
        earnBadge("sugar-free");
    }
  };

  const addFoodEntry = (entry: FoodEntry) => {
    setFoodLog((prev) => {
      const updated = [entry, ...prev];
      // Check scan-pro badge
      if (updated.length >= 10) earnBadge("scan-pro");
      return updated;
    });
    addPoints(5);
    // First log badge
    earnBadge("first-log");
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        setProfile,
        points,
        addPoints,
        level,
        streak,
        completedChallenges,
        completeChallenge,
        badges,
        earnBadge,
        dailyScore,
        setDailyScore,
        avatarState,
        setAvatarState,
        habits,
        setHabits,
        foodLog,
        addFoodEntry,
        diabetesRisk,
        weeklyData,
        habitsLoggedToday,
        markHabitsLogged,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
