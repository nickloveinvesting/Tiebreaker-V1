import { Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AppHeader({ title, backTo }: { title: string, backTo?: string }) {
  return (
    <header className="h-16 border-b-[4px] border-ink bg-cream flex items-center justify-between px-4 pt-[env(safe-area-inset-top)] shrink-0">
      <div className="flex-1">
        {backTo && (
          <Link to={backTo} className="font-black uppercase text-xs tracking-wider">
            &larr; Back
          </Link>
        )}
      </div>
      <h1 className="font-display font-black text-2xl uppercase tracking-tighter">
        {title} <span className="text-[10px] align-top bg-ink text-white px-1.5 py-0.5 rounded-full ml-1 font-sans tracking-normal">MVP</span>
      </h1>
      <div className="flex-1 flex justify-end">
        <Link to="/settings" className="p-2 -mr-2 bg-white border-[3px] border-ink hover:bg-cream rounded-full transition-colors shadow-[3px_3px_0_0_#1A1A1A] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]">
          <Settings size={20} strokeWidth={2.5} />
        </Link>
      </div>
    </header>
  );
}
