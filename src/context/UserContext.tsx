import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  avatarState: 'high' | 'mid' | 'low';
  setAvatarState: (s: 'high' | 'mid' | 'low') => void;
  habits: DailyHabits;
  setHabits: (h: Partial<DailyHabits>) => void;
  foodLog: FoodEntry[];
  addFoodEntry: (entry: FoodEntry) => void;
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
  level: 'safe' | 'moderate' | 'high';
  time: string;
  image?: string;
}

const defaultProfile: UserProfile = {
  age: 0,
  height: 0,
  weight: 0,
  gender: '',
  familyDiabetes: false,
  dailySugar: '',
  onboardingComplete: false,
};

const defaultHabits: DailyHabits = {
  sugarItems: 0,
  sugaryDrinks: 0,
  activityMinutes: 0,
  sleepHours: 7,
  energyMood: 3,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfileState] = useState<UserProfile>(defaultProfile);
  const [points, setPoints] = useState(150);
  const [streak, setStreak] = useState(5);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(['c1', 'c2']);
  const [badges, setBadges] = useState<string[]>(['first-log', 'streak-3']);
  const [dailyScore, setDailyScore] = useState(72);
  const [avatarState, setAvatarState] = useState<'high' | 'mid' | 'low'>('high');
  const [habits, setHabitsState] = useState<DailyHabits>(defaultHabits);
  const [foodLog, setFoodLog] = useState<FoodEntry[]>([
    { id: '1', name: 'Grilled Chicken Salad', calories: 350, sugar: 5, level: 'safe', time: '12:30 PM' },
    { id: '2', name: 'Apple Juice', calories: 120, sugar: 24, level: 'high', time: '10:00 AM' },
    { id: '3', name: 'Banana', calories: 105, sugar: 14, level: 'moderate', time: '9:00 AM' },
    { id: '4', name: 'Oatmeal', calories: 150, sugar: 6, level: 'safe', time: '8:00 AM' },
  ]);

  const setProfile = (partial: Partial<UserProfile>) => {
    setProfileState(prev => ({ ...prev, ...partial }));
  };

  const addPoints = (p: number) => setPoints(prev => prev + p);
  const level = Math.floor(points / 100) + 1;

  const completeChallenge = (id: string) => {
    if (!completedChallenges.includes(id)) {
      setCompletedChallenges(prev => [...prev, id]);
      addPoints(25);
    }
  };

  const earnBadge = (badge: string) => {
    if (!badges.includes(badge)) {
      setBadges(prev => [...prev, badge]);
      addPoints(50);
    }
  };

  const setHabits = (partial: Partial<DailyHabits>) => {
    setHabitsState(prev => ({ ...prev, ...partial }));
  };

  const addFoodEntry = (entry: FoodEntry) => {
    setFoodLog(prev => [entry, ...prev]);
  };

  return (
    <UserContext.Provider value={{
      profile, setProfile, points, addPoints, level, streak,
      completedChallenges, completeChallenge, badges, earnBadge,
      dailyScore, setDailyScore, avatarState, setAvatarState,
      habits, setHabits, foodLog, addFoodEntry,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
