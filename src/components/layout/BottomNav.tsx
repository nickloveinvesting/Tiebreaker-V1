import { Home, History, Library, Trophy } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';

export default function BottomNav() {
  const location = useLocation();
  const hideOnPaths = ['/play'];
  
  if (hideOnPaths.some(p => location.pathname.startsWith(p))) {
    return null;
  }

  const items = [
    { id: 'home', to: '/', icon: Home, label: 'Home' },
    { id: 'history', to: '/history', icon: History, label: 'History' },
    { id: 'library', to: '/library', icon: Library, label: 'Library' },
    { id: 'scoreboard', to: '/scoreboard', icon: Trophy, label: 'Scores' },
  ];

  return (
    <nav className="border-t-[4px] border-ink bg-cream pb-[env(safe-area-inset-bottom)] fixed bottom-0 w-full max-w-md mx-auto z-50">
      <div className="flex h-16">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.to}
              className={({ isActive }) => clsx(
                "flex-1 flex flex-col items-center justify-center gap-1 transition-colors border-r-[4px] border-ink last:border-r-0",
                isActive ? "bg-ink text-cream" : "text-ink hover:bg-black/5"
              )}
            >
              <Icon size={24} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-wider">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
