import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'motion/react';
import { FoodOption, WatchItem } from '../../lib/types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useEffect } from 'react';

export default function SwipeCard({ 
  item, 
  active,
  playerColor,
  onSwipe
}: { 
  item: FoodOption | WatchItem; 
  active: boolean;
  playerColor: string;
  onSwipe: (id: string, vote: 'yes' | 'no') => void 
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const yesOpacity = useTransform(x, [10, 100], [0, 1]);
  const noOpacity = useTransform(x, [-10, -100], [0, 1]);
  
  const controls = useAnimation();

  useEffect(() => {
    if (!active) {
      controls.set({ x: 0, opacity: 1, rotate: 0, scale: 0.95, zIndex: 0 });
    } else {
      controls.start({ scale: 1, zIndex: 10, transition: { duration: 0.2 } });
    }
  }, [active, controls]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    const velocityThreshold = 500;
    
    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      controls.start({ x: window.innerWidth, transition: { duration: 0.2 } }).then(() => onSwipe(item.id, 'yes'));
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      controls.start({ x: -window.innerWidth, transition: { duration: 0.2 } }).then(() => onSwipe(item.id, 'no'));
    } else {
      controls.start({ x: 0, transition: { type: 'spring', bounce: 0.5 } });
    }
  };

  return (
    <motion.div
      drag={active ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      animate={controls}
      className="absolute top-0 left-0 w-full aspect-[3/4] max-h-[60vh] bg-white border-[4px] border-ink rounded-[32px] shadow-[12px_12px_0_0_#1A1A1A] overflow-hidden flex flex-col items-center justify-center cursor-grab active:cursor-grabbing origin-bottom"
    >
      <div className="absolute inset-0 flex flex-col items-center p-6 h-full text-center">
        <div className="flex-1 flex flex-col justify-center items-center w-full min-h-[50%] relative mb-4">
          {(() => {
            const visual = 'emoji' in item ? (item as FoodOption).emoji : (item as WatchItem).posterUrl;
            if (visual?.startsWith('http')) {
               return <img src={visual} referrerPolicy="no-referrer" className="w-full h-full object-contain rounded-xl select-none pointer-events-none" alt="" />;
            }
            return <div className="text-[120px] select-none pointer-events-none">{visual}</div>;
          })()}
        </div>
        
        <div className="flex flex-col items-center justify-end pb-8 shrink-0 relative z-10 w-full bg-white/80 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="font-display font-black text-4xl text-center leading-tight mb-2 select-none pointer-events-none tracking-tighter">
            {'title' in item ? (item as WatchItem).title : (item as FoodOption).name}
          </h3>
          <div className="uppercase font-black tracking-widest text-ink/50 text-sm select-none pointer-events-none">
            {'cuisine' in item ? (item as FoodOption).cuisine : (item as WatchItem).type}
          </div>
        </div>
      </div>

      <motion.div 
        style={{ opacity: yesOpacity }}
        className="absolute top-8 right-8 border-[4px] border-green-500 rounded-full p-2 rotate-12 bg-white text-green-500"
      >
        <ThumbsUp size={48} strokeWidth={4} />
      </motion.div>
      
      <motion.div 
        style={{ opacity: noOpacity }}
        className="absolute top-8 left-8 border-[4px] border-red-500 rounded-full p-2 -rotate-12 text-red-500 bg-white"
      >
        <ThumbsDown size={48} strokeWidth={4} />
      </motion.div>
    </motion.div>
  );
}
