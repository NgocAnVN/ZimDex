
import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc, ListMusic, Mic2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Song {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

interface MusicAppProps {
  isPlaying: boolean;
  currentSong: Song;
  onTogglePlay: (e?: React.MouseEvent) => void;
  onNext: (e?: React.MouseEvent) => void;
  onPrev: (e?: React.MouseEvent) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  isPlaying,
  currentSong,
  onTogglePlay,
  onNext,
  onPrev
}) => {
  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      {/* Left: Visuals / Now Playing */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/20 blur-[80px]"
        />
        
        {/* Vinyl Record Animation */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 group cursor-pointer" onClick={onTogglePlay}>
            {/* The Vinyl Disc */}
            <motion.div 
              className="w-full h-full rounded-full bg-black border-4 border-[#1a1a1a] shadow-2xl flex items-center justify-center overflow-hidden relative"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ 
                 boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.1)'
              }}
            >
                 {/* Texture grooves */}
                 <div className="absolute inset-0 rounded-full border-[20px] border-transparent border-t-white/5 border-b-white/5 opacity-20 pointer-events-none" />
                 <div className="absolute inset-4 rounded-full border border-white/5 opacity-30" />
                 <div className="absolute inset-8 rounded-full border border-white/5 opacity-30" />
                 <div className="absolute inset-12 rounded-full border border-white/5 opacity-30" />
                 
                 {/* Album Cover Center */}
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#111] relative z-10">
                    <img src={currentSong.cover} alt="cover" className="w-full h-full object-cover" />
                 </div>
            </motion.div>
            
            {/* Tonearm (stylized) */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-32 pointer-events-none origin-top-right z-20 drop-shadow-lg"
              animate={{ rotate: isPlaying ? 25 : 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
               <div className="w-2 h-24 bg-gray-400 absolute right-4 top-4 rotate-12 rounded-full" />
               <div className="w-8 h-12 bg-gray-300 rounded-md absolute bottom-0 left-0 rotate-12" />
               <div className="w-4 h-4 bg-gray-500 rounded-full absolute top-2 right-2" />
            </motion.div>
        </div>

        {/* Song Info Mobile/Compact */}
        <div className="mt-8 text-center z-10">
           <h2 className="text-2xl font-bold text-white tracking-tight mb-1">{currentSong.title}</h2>
           <p className="text-blue-400 font-medium text-lg">{currentSong.artist}</p>
        </div>
      </div>

      {/* Right: Controls & Playlist */}
      <div className="w-full md:w-[350px] bg-black/20 border-l border-white/5 p-6 flex flex-col backdrop-blur-sm">
         <div className="flex items-center justify-between mb-6 text-white/50">
            <span className="text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <ListMusic size={14} /> Playlist
            </span>
            <span className="text-xs">3 songs</span>
         </div>

         {/* Playlist Items */}
         <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 space-y-1">
            <div className="p-3 rounded-lg bg-white/10 border border-white/5 flex items-center gap-3 transition-colors cursor-default">
               <div className="w-10 h-10 rounded bg-gray-800 overflow-hidden relative">
                  <img src={currentSong.cover} className="w-full h-full object-cover opacity-80" />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-end justify-center gap-[2px] pb-1 bg-black/30">
                       <motion.div animate={{ height: [4, 12, 6, 14, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-white rounded-full" />
                       <motion.div animate={{ height: [8, 4, 14, 6, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[2px] bg-white rounded-full" />
                       <motion.div animate={{ height: [6, 14, 4, 10, 6] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-[2px] bg-white rounded-full" />
                    </div>
                  )}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{currentSong.title}</div>
                  <div className="text-white/50 text-xs truncate">{currentSong.artist}</div>
               </div>
            </div>
            {/* Dummy items for visual completeness */}
            <div className="p-3 rounded-lg hover:bg-white/5 flex items-center gap-3 transition-colors cursor-pointer opacity-60 hover:opacity-100">
               <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-500">
                 <Disc size={16} />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">Thu Do Cypher</div>
                  <div className="text-white/50 text-xs truncate">Low G, MCK, Orijinn...</div>
               </div>
            </div>
            <div className="p-3 rounded-lg hover:bg-white/5 flex items-center gap-3 transition-colors cursor-pointer opacity-60 hover:opacity-100">
               <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-gray-500">
                 <Mic2 size={16} />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">Chan Gaii</div>
                  <div className="text-white/50 text-xs truncate">Low G</div>
               </div>
            </div>
         </div>

         {/* Controls Area */}
         <div className="mt-6 pt-6 border-t border-white/10">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-2 relative group cursor-pointer">
               <div className="absolute left-0 top-0 bottom-0 bg-blue-500 w-1/3 rounded-full relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>
            <div className="flex justify-between text-[10px] text-white/40 font-mono mb-4">
               <span>1:24</span>
               <span>3:45</span>
            </div>

            {/* Main Buttons */}
            <div className="flex items-center justify-center gap-6">
               <button onClick={onPrev} className="text-white/70 hover:text-white transition-transform hover:scale-110 active:scale-95">
                  <SkipBack size={24} fill="currentColor" />
               </button>
               
               <button 
                 onClick={onTogglePlay}
                 className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
               >
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
               </button>

               <button onClick={onNext} className="text-white/70 hover:text-white transition-transform hover:scale-110 active:scale-95">
                  <SkipForward size={24} fill="currentColor" />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
