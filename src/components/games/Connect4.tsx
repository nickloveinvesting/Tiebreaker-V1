import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Board, createEmptyBoard, dropPiece, checkWin, isBoardFull } from '../../lib/games/connect4';
import { Player } from '../../lib/types';
import { clsx } from 'clsx';
import { RotateCcw } from 'lucide-react';

export default function Connect4({ players, onWin, onDraw }: { players: Player[], onWin: (playerId: string) => void, onDraw: () => void }) {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  const currentPlayer = players[currentPlayerIdx];

  const handleColumnClick = useCallback((colIndex: number) => {
    if (winner) return;

    const newBoard = [...board.map(col => [...col])];
    const dropRow = dropPiece(newBoard, colIndex, currentPlayer.id);
    
    if (dropRow === -1) return; // Column is full
    
    setBoard(newBoard);
    
    if (checkWin(newBoard, colIndex, dropRow, currentPlayer.id)) {
      setWinner(currentPlayer.id);
      setTimeout(() => onWin(currentPlayer.id), 2000); // 2 second celebration delay
      return;
    }
    
    if (isBoardFull(newBoard)) {
      setTimeout(onDraw, 2000);
      return;
    }
    
    setCurrentPlayerIdx((prev) => (prev + 1) % players.length);
  }, [board, currentPlayer, players, winner, onWin, onDraw]);

  return (
    <div className="flex flex-col items-center w-full max-w-[360px] mx-auto mt-4 gap-6">
      <div className="flex justify-between w-full items-center px-2">
        <div className={clsx("transition-opacity flex flex-col items-center", currentPlayerIdx === 0 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1" style={{ backgroundColor: players[0].color }} />
          <span className="text-xs font-black uppercase">{players[0].name}</span>
        </div>
        <div className="text-2xl font-display font-black tracking-tighter">
          {winner ? 'WINNER!' : 'CONNECT 4'}
        </div>
        <div className={clsx("transition-opacity flex flex-col items-center", currentPlayerIdx === 1 ? "opacity-100" : "opacity-40")}>
          <div className="w-8 h-8 rounded-full border-[3px] border-ink shadow-[4px_4px_0_0_#1A1A1A] mb-1" style={{ backgroundColor: players[1].color }} />
          <span className="text-xs font-black uppercase">{players[1].name}</span>
        </div>
      </div>

      <div className="relative bg-ink p-3 rounded-[24px] shadow-[8px_8px_0_0_#1A1A1A]">
        {/* The Grid */}
        <div className="grid grid-cols-7 gap-2">
          {board.map((column, colIdx) => (
            <div 
              key={colIdx} 
              className="flex flex-col gap-2 cursor-pointer w-10 sm:w-11 relative"
              onClick={() => handleColumnClick(colIdx)}
            >
              {/* Pieces */}
              {column.map((cellPlayerId, rowIdx) => {
                const cellPlayer = players.find(p => p.id === cellPlayerId);
                return (
                  <div key={rowIdx} className="w-full aspect-square rounded-full flex-shrink-0 bg-cream/20 shadow-inner relative overflow-hidden">
                    <AnimatePresence>
                      {cellPlayer && (
                        <motion.div 
                          initial={{ y: -300 }}
                          animate={{ y: 0 }}
                          transition={{ type: 'spring', bounce: 0.5, duration: 0.6 }}
                          className="absolute inset-0 rounded-full border-[3px] border-ink opacity-90 m-[2px]"
                          style={{ backgroundColor: cellPlayer.color }}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      {winner && (
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="px-8 py-4 bg-white border-[4px] border-ink font-black uppercase tracking-widest rounded-full shadow-[8px_8px_0_0_#1A1A1A]"
        >
          {players.find(p => p.id === winner)?.name} Wins
        </motion.div>
      )}
    </div>
  );
}
