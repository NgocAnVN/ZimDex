import React, { useState, useEffect, useRef } from 'react';
import { OSWindow } from './components/OSWindow';
import { SettingsApp } from './components/SettingsApp';
import { CustomCursor } from './components/CustomCursor';
import { MusicApp } from './components/MusicApp';
import { StartMenu } from './components/StartMenu';
import { WallpaperApp } from './components/WallpaperApp';
import { ScreenRecorderApp } from './components/ScreenRecorderApp';
import { 
  Settings, Wifi, Volume2, Battery, MessageSquare, Play, SkipBack, 
  SkipForward, Search, Power, Monitor, Calendar, Image as ImageIcon, 
  RefreshCw, Disc, Folder
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Simple clock component
const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="text-white font-medium text-sm select-none tracking-wide drop-shadow-md font-['Inter']">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

export default function App() {
  // Window States
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  
  // Window Positions
  const [settingsPosition, setSettingsPosition] = useState({ x: 0, y: 0 });
  const [musicPosition, setMusicPosition] = useState({ x: 0, y: 0 });
  const [galleryPosition, setGalleryPosition] = useState({ x: 0, y: 0 });
  const [recorderPosition, setRecorderPosition] = useState({ x: 0, y: 0 });
  const [hasInitializedPos, setHasInitializedPos] = useState(false);

  // Start Menu Anchor
  const [startMenuX, setStartMenuX] = useState(0);

  // Drag Constraints Ref
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Dock References for Animation Origin
  const [launchOrigin, setLaunchOrigin] = useState({ x: 0, y: 0 });
  const [musicLaunchOrigin, setMusicLaunchOrigin] = useState({ x: 0, y: 0 });
  const [galleryLaunchOrigin, setGalleryLaunchOrigin] = useState({ x: 0, y: 0 });
  const [recorderLaunchOrigin, setRecorderLaunchOrigin] = useState({ x: 0, y: 0 });
  
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const musicDockRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const galleryButtonRef = useRef<HTMLButtonElement>(null);

  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playlist = [
    { title: "An Than", artist: "Low G", url: "https://ia801400.us.archive.org/15/items/low-g-songs/An%20Th%E1%BA%A7n%20ft.%20Th%E1%BA%AFng%20-%20Low%20G%20%28Rap%20Nh%C3%A0%20L%C3%A0m%29.mp3", cover: "https://i1.sndcdn.com/artworks-Zq37C5Rz5bQ7-0-t500x500.jpg" },
    { title: "Simp Gais 808", artist: "Low G", url: "https://ia902703.us.archive.org/31/items/low-g-collection/Simp%20G%C3%A1i%20808%20-%20Low%20G%20%28Rap%20Nh%C3%A0%20L%C3%A0m%29.mp3", cover: "https://i.ytimg.com/vi/QW50d1dE2tU/maxresdefault.jpg" },
    { title: "Tam Giac", artist: "Anh Phan ft Low G", url: "https://ia801400.us.archive.org/15/items/low-g-songs/Tam%20Giac.mp3", cover: "https://i.scdn.co/image/ab67616d0000b27331390178597730e8be46f92f" },
  ];

  // Wallpaper State
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [wallpapers, setWallpapers] = useState([
    'https://images.unsplash.com/photo-1565347786727-2629aa068529?q=80&w=2000&auto=format&fit=crop', // Rooftop
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?q=80&w=2000&auto=format&fit=crop', // Rain
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2000', // Dark Mountains
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000', // Yosemite
    'https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=2000', // Abstract Geometry
    'https://images.unsplash.com/photo-1534067783741-512d0deaf55c?q=80&w=2000'  // Colorful
  ]);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number; type: 'desktop' | 'music' } | null>(null);

  const updateOrigins = () => {
    if (settingsButtonRef.current) {
      const rect = settingsButtonRef.current.getBoundingClientRect();
      setLaunchOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    if (musicDockRef.current) {
       const rect = musicDockRef.current.getBoundingClientRect();
       setMusicLaunchOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    if (startButtonRef.current) {
        const rect = startButtonRef.current.getBoundingClientRect();
        setStartMenuX(rect.left + rect.width / 2);
        setGalleryLaunchOrigin({ x: rect.left + rect.width / 2, y: rect.top - 50 }); 
        setRecorderLaunchOrigin({ x: rect.left + rect.width / 2, y: rect.top - 50 });
    }
  };

  // Initialize Positions and update on resize
  useEffect(() => {
    if (!hasInitializedPos) {
      setSettingsPosition({ 
        x: (window.innerWidth - 950) / 2, 
        y: (window.innerHeight - 600) / 2 
      });
      setMusicPosition({
        x: (window.innerWidth - 950) / 2,
        y: (window.innerHeight - 600) / 2
      });
      setGalleryPosition({
        x: (window.innerWidth - 950) / 2,
        y: (window.innerHeight - 600) / 2
      });
      setRecorderPosition({
        x: (window.innerWidth - 950) / 2, 
        y: (window.innerHeight - 600) / 2
      });
      setHasInitializedPos(true);
    }

    const timer = setTimeout(updateOrigins, 100);
    window.addEventListener('resize', updateOrigins);
    return () => {
        window.removeEventListener('resize', updateOrigins);
        clearTimeout(timer);
    }
  }, [hasInitializedPos]);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  
  const nextSong = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSong((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };
  
  const prevSong = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const toggleSettings = () => {
    updateOrigins(); 
    setIsSettingsOpen(!isSettingsOpen);
    setIsStartMenuOpen(false);
  };

  const toggleMusicApp = () => {
     updateOrigins();
     setIsMusicOpen(!isMusicOpen);
     setContextMenu(null);
     setIsStartMenuOpen(false);
  };

  const toggleGallery = () => {
     updateOrigins();
     setIsGalleryOpen(!isGalleryOpen);
     setIsStartMenuOpen(false);
  };

  const toggleRecorder = () => {
     updateOrigins();
     setIsRecorderOpen(!isRecorderOpen);
     setIsStartMenuOpen(false);
  }

  const toggleStartMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    updateOrigins();
    setIsStartMenuOpen(!isStartMenuOpen);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'desktop' | 'music' = 'desktop') => {
    e.preventDefault();
    e.stopPropagation();
    
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + 220 > window.innerWidth) x = window.innerWidth - 220;
    if (y + 200 > window.innerHeight) y = window.innerHeight - 200;

    setContextMenu({ show: true, x, y, type });
  };

  const handleGlobalClick = () => {
    if (contextMenu) setContextMenu(null);
    if (isStartMenuOpen) setIsStartMenuOpen(false);
  };

  const changeWallpaper = () => {
    setWallpaperIndex((prev) => (prev + 1) % wallpapers.length);
    setContextMenu(null);
  };

  const handleAddWallpaper = (file: File) => {
    const url = URL.createObjectURL(file);
    setWallpapers(prev => [...prev, url]);
    setWallpaperIndex(wallpapers.length); 
  };

  const handleRemoveWallpaper = (index: number) => {
    if (wallpapers.length <= 1) return;
    const newWallpapers = wallpapers.filter((_, i) => i !== index);
    setWallpapers(newWallpapers);
    if (wallpaperIndex === index) {
      setWallpaperIndex(0);
    } else if (wallpaperIndex > index) {
      setWallpaperIndex(wallpaperIndex - 1);
    }
  };

  const ZLogo = () => (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
       <path d="M4 20h16v-4h-2v2H6.8l11.2-14v-2H2v4h2V4h11.2L4 18z"/>
    </svg>
  );

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative bg-black select-none font-sans"
      onClick={handleGlobalClick}
      onContextMenu={(e) => handleContextMenu(e, 'desktop')}
    >
      <audio 
        ref={audioRef}
        src={playlist[currentSong].url}
        onEnded={() => nextSong()}
      />

      <CustomCursor />

      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ 
          backgroundImage: `url("${wallpapers[wallpaperIndex]}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-6 z-20 pointer-events-none">
          <div className="pointer-events-auto">
             <Clock />
          </div>
      </div>

      {/* Start Menu Layer */}
      <div className="relative z-[100]">
        <AnimatePresence>
            {isStartMenuOpen && (
            <StartMenu 
                onClose={() => setIsStartMenuOpen(false)} 
                onOpenSettings={() => {
                    if (!isSettingsOpen) toggleSettings();
                    setIsStartMenuOpen(false);
                }}
                onOpenGallery={() => {
                   if (!isGalleryOpen) toggleGallery();
                   setIsStartMenuOpen(false);
                }}
                onOpenRecorder={() => {
                   if (!isRecorderOpen) toggleRecorder();
                   setIsStartMenuOpen(false);
                }}
                anchorX={startMenuX}
            />
            )}
        </AnimatePresence>
      </div>

      {/* Window Manager Layer */}
      {/* Attached constraints ref here to limit dragging. overflow-hidden added to ensure no scrollbars. */}
      <div 
        ref={constraintsRef} 
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden perspective-[2000px]"
      >
         <AnimatePresence>
           {isSettingsOpen && (
             <OSWindow 
               key="settings-window"
               isOpen={isSettingsOpen} 
               onClose={toggleSettings}
               title="Settings"
               isActive={!isMusicOpen && !isGalleryOpen && !isRecorderOpen} 
               onFocus={() => {}}
               launchOrigin={launchOrigin}
               initialPosition={settingsPosition}
               onDragEnd={(pos) => setSettingsPosition(pos)}
               dragConstraints={constraintsRef}
             >
               <SettingsApp />
             </OSWindow>
           )}

           {isMusicOpen && (
             <OSWindow
                key="music-window"
                isOpen={isMusicOpen}
                onClose={toggleMusicApp}
                title="Music Player"
                isActive={isMusicOpen && !isGalleryOpen && !isRecorderOpen}
                onFocus={() => {}}
                launchOrigin={musicLaunchOrigin}
                initialPosition={musicPosition}
                onDragEnd={(pos) => setMusicPosition(pos)}
                dragConstraints={constraintsRef}
             >
               <MusicApp 
                 isPlaying={isPlaying}
                 currentSong={playlist[currentSong]}
                 onTogglePlay={() => setIsPlaying(!isPlaying)}
                 onNext={nextSong}
                 onPrev={prevSong}
               />
             </OSWindow>
           )}

           {isGalleryOpen && (
              <OSWindow
                key="gallery-window"
                isOpen={isGalleryOpen}
                onClose={toggleGallery}
                title="Gallery & Wallpapers"
                isActive={isGalleryOpen && !isRecorderOpen}
                onFocus={() => {}}
                launchOrigin={galleryLaunchOrigin}
                initialPosition={galleryPosition}
                onDragEnd={(pos) => setGalleryPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <WallpaperApp 
                  wallpapers={wallpapers}
                  activeIndex={wallpaperIndex}
                  onSelect={setWallpaperIndex}
                  onAdd={handleAddWallpaper}
                  onRemove={handleRemoveWallpaper}
                />
              </OSWindow>
           )}

           {isRecorderOpen && (
              <OSWindow
                key="recorder-window"
                isOpen={isRecorderOpen}
                onClose={toggleRecorder}
                title="Screen Recorder"
                isActive={isRecorderOpen}
                onFocus={() => {}}
                launchOrigin={recorderLaunchOrigin}
                initialPosition={recorderPosition}
                onDragEnd={(pos) => setRecorderPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <ScreenRecorderApp />
              </OSWindow>
           )}
         </AnimatePresence>
      </div>

      {/* Bottom Dock */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-50 flex justify-center pb-4 pointer-events-none"
        onContextMenu={(e) => e.stopPropagation()} 
      >
         <div className="
            flex items-center px-2 py-2
            h-[68px]
            bg-[#1c1c1e]/80 backdrop-blur-2xl 
            border border-white/10 
            shadow-2xl pointer-events-auto
            rounded-2xl
            min-w-[600px]
         ">
            <button 
                ref={startButtonRef}
                onClick={toggleStartMenu}
                className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mr-2
                ${isStartMenuOpen ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' : 'text-white/90 hover:bg-white/10 hover:scale-105'}
                `}
            >
                <ZLogo />
            </button>

            <div className="w-[1px] h-8 bg-white/10 mx-2" />

            <div className="flex items-center gap-3 px-2">
               <div className="relative group">
                   <button 
                     ref={settingsButtonRef}
                     onClick={toggleSettings}
                     className={`
                        w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ease-out
                        ${isSettingsOpen ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 hover:-translate-y-2 hover:scale-110'}
                     `}
                   >
                      <div className={`transition-transform duration-[3s] ease-linear ${isSettingsOpen ? 'rotate-[120deg]' : ''}`}>
                        <Settings size={26} className="text-white drop-shadow-md" strokeWidth={1.5} />
                      </div>
                   </button>
                   <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full transition-all duration-300 ${isSettingsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
               </div>

               <button className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/10 hover:-translate-y-2 hover:scale-110 transition-all duration-300">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Search className="text-black" size={20} />
                  </div>
               </button>
               
               <button 
                 onClick={toggleGallery}
                 className={`
                   w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                   ${isGalleryOpen ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 hover:-translate-y-2 hover:scale-110'}
                 `}
               >
                   <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <ImageIcon size={20} />
                   </div>
               </button>
            </div>

            <div className="flex-1" />

            <div 
                ref={musicDockRef}
                onContextMenu={(e) => handleContextMenu(e, 'music')}
                onClick={toggleMusicApp}
                className="hidden lg:flex items-center gap-3 px-3 py-1 hover:bg-white/5 rounded-xl transition-colors cursor-pointer mr-2"
            >
                <div className={`w-9 h-9 bg-gray-800 rounded-lg overflow-hidden shadow-inner border border-white/5 relative`}>
                    <img 
                    src={playlist[currentSong].cover} 
                    className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`} 
                    style={{ animationDuration: '8s' }}
                    />
                </div>
                <div className="flex items-center gap-2 text-white/80 ml-1" onClick={(e) => e.stopPropagation()}>
                    <button className="hover:text-white" onClick={prevSong}><SkipBack size={14} fill="currentColor" /></button>
                    <button className="hover:text-white" onClick={togglePlay}>
                    {isPlaying ? <div className="w-2.5 h-2.5 bg-white rounded-[1px]" /> : <Play size={14} fill="currentColor" />}
                    </button>
                    <button className="hover:text-white" onClick={nextSong}><SkipForward size={14} fill="currentColor" /></button>
                </div>
            </div>

            <div className="w-[1px] h-8 bg-white/10 mx-2" />

            <div className="flex items-center gap-4 text-white/60 px-4">
               <Wifi size={18} />
               <Volume2 size={18} />
               <Battery size={18} />
            </div>
         </div>
      </div>

      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.1 }}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute z-[100] w-56 bg-[#141414]/90 backdrop-blur-xl border border-white/15 rounded-lg shadow-2xl py-1.5 flex flex-col pointer-events-auto origin-top-left"
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'desktop' ? (
            <>
              <button 
                onClick={changeWallpaper}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors group"
              >
                <ImageIcon size={15} />
                Next Wallpaper
              </button>
              <button 
                onClick={() => { setContextMenu(null); toggleGallery(); }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors"
              >
                <Folder size={15} />
                Wallpaper Library
              </button>
              <div className="h-[1px] bg-white/10 my-1.5 mx-2" />
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <RefreshCw size={15} />
                Refresh
              </button>
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <Monitor size={15} />
                Display Settings
              </button>
              <div className="h-[1px] bg-white/10 my-1.5 mx-2" />
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-red-500/80 text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <Power size={15} />
                Shut down
              </button>
            </>
          ) : (
            <>
               <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Music Player</div>
               <button 
                 onClick={toggleMusicApp} 
                 className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors"
               >
                 <Disc size={15} />
                 Open Music App
               </button>
               <button onClick={togglePlay} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                 {isPlaying ? <div className="w-4 h-4 flex items-center justify-center"><div className="w-2 h-2 bg-current"/></div> : <Play size={15} />}
                 {isPlaying ? "Pause" : "Play"}
               </button>
               <button onClick={nextSong} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                 <SkipForward size={15} />
                 Next Track
               </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}