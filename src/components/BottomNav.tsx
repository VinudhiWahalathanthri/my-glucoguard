import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Camera, BarChart3, Trophy, Dumbbell, Calendar } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/food', icon: Camera, label: 'Food' },
  { to: '/habits', icon: BarChart3, label: 'Habits' },
  { to: '/challenges', icon: Trophy, label: 'Goals' },
  { to: '/exercises', icon: Dumbbell, label: 'Moves' },
  { to: '/summary', icon: Calendar, label: 'Week' },
];

const BottomNav = () => {
  const location = useLocation();

  if (location.pathname === '/onboarding') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`rounded-xl p-1.5 transition-all ${isActive ? 'gradient-primary text-primary-foreground shadow-button' : ''}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
