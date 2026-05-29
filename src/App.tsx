/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkAndSeedData } from './lib/seed';

import Home from './pages/Home';
import Play from './pages/Play';
import History from './pages/History';
import Library from './pages/Library';
import Scoreboard from './pages/Scoreboard';
import Settings from './pages/Settings';
import BottomNav from './components/layout/BottomNav';

export default function App() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    checkAndSeedData().then(() => setInit(true));
  }, []);

  if (!init) return <div className="h-dvh flex items-center justify-center text-ink bg-cream">Loading...</div>;

  return (
    <BrowserRouter>
      <div className="h-dvh w-full max-w-md mx-auto bg-cream text-ink relative flex flex-col font-sans overflow-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/play/:domain" element={<Play />} />
          <Route path="/history" element={<History />} />
          <Route path="/library" element={<Library />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
