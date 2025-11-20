import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Power, Settings, User, FileText, Image, Music, Video, 
  Mail, Calendar, Map, Terminal, Calculator, Folder, ArrowRight,
  Lock, Grid, Cpu, Zap, Wifi, Monitor
} from 'lucide-react';

interface StartMenuProps {
  onClose: () => void;
  onOpenSettings: () => void;
  onOpenGallery: () => void;
  onOpenRecorder: () => void;
  anchorX: number; // Position to align with
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose, onOpenSettings, onOpenGallery, onOpenRecorder, anchorX }) => {
  const [searchValue, setSearchValue] = useState('');

  const systemWidgets = [
    { label: 'CPU', value: '32%', icon: Cpu, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: 'MEM', value: '8.2GB', icon: Grid, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { label: 'PWR', value: 'Balanced', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { label: 'NET', value: '5G', icon: Wifi, color: 'text-green-400', bg: 'bg-green-500/20' },
  ];

  const pinnedApps = [
    { name: 'Settings', icon: Settings, action: onOpenSettings, color: 'from-gray-700 to-gray-600' },
    { name: 'Terminal', icon: Terminal, color: 'from-black to-gray-900 border border-white/20' },
    { name: 'Music', icon: Music, color: 'from-pink-600 to-rose-500' },
    { name: 'Gallery', icon: Image, action: onOpenGallery, color: 'from-purple-600 to-indigo-500' },
    { name: 'Browser', icon: Map, color: 'from-blue-600 to-cyan-500' },
    { name: 'Files', icon: Folder, color: 'from-yellow-500 to-orange-500' },
    { name: 'Recorder', icon: Video, action: onOpenRecorder, color: 'from-red-600 to-red-500' },
    { name: 'Monitor', icon: Monitor, color: 'from-teal-600 to-emerald-500' },
    { name: 'Mail', icon: Mail, color: 'from-blue-500 to-blue-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      style={{ 
        position: 'fixed',
        bottom: '90px', // Gap from bottom dock
        left: Math.max(16, anchorX - 160), // Center on anchor, but keep padding from screen edge. 320px width / 2 = 160
      }}
      className="w-[320px] h-[550px] bg-[#0f0f11]/80 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.7)] z-[100] flex flex-col overflow-hidden text-gray-100 font-sans"
      onClick={(e) => e.stopPropagation()}
    >
        {/* Header Profile */}
        <div className="p-5 flex items-center justify-between border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-lg shadow-blue-500/20">
                   <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                       <User size={16} className="text-white" />
                   </div>
                </div>
                <div>
                    <div className="text-sm font-bold text-white leading-tight">NgocAnn</div>
                    <div className="text-[10px] text-blue-400 font-mono tracking-wider uppercase">Administrator</div>
                </div>
            </div>
            <div className="flex gap-1">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                    <Lock size={16} />
                </button>
                <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                    <Power size={16} />
                </button>
            </div>
        </div>

        {/* Search */}
        <div className="p-4 pb-2">
             <div className="bg-black/40 border border-white/10 rounded-xl flex items-center px-3 py-2.5 shadow-inner focus-within:border-blue-500/50 transition-colors">
                <Search size={16} className="text-gray-500 mr-2" />
                <input 
                    type="text" 
                    placeholder="Command Line / Search..." 
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="bg-transparent outline-none text-sm text-white w-full placeholder-gray-600 font-medium"
                    autoFocus
                />
             </div>
        </div>

        {/* Widgets */}
        <div className="grid grid-cols-4 gap-2 px-4 py-2">
            {systemWidgets.map((w, i) => (
                <div key={i} className={`${w.bg} rounded-lg p-2 flex flex-col items-center justify-center gap-1 border border-white/5`}>
                    <w.icon size={14} className={w.color} />
                    <span className="text-[10px] font-bold text-gray-300">{w.label}</span>
                    <span className="text-[9px] opacity-70">{w.value}</span>
                </div>
            ))}
        </div>

        <div className="px-4 py-2">
            <div className="h-[1px] w-full bg-white/10" />
        </div>

        {/* App Grid */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Applications</h3>
            <div className="grid grid-cols-3 gap-3">
                {pinnedApps.map((app, i) => (
                    <button 
                        key={i}
                        onClick={() => {
                            if(app.action) {
                                app.action();
                                onClose();
                            }
                        }}
                        className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-all group active:scale-95"
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.color} flex items-center justify-center shadow-lg group-hover:shadow-blue-500/20 transition-all`}>
                            <app.icon size={24} className="text-white drop-shadow-md" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 group-hover:text-white transition-colors">{app.name}</span>
                    </button>
                ))}
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 mt-6">Recent Files</h3>
            <div className="space-y-1">
                 {[1,2,3].map((_, i) => (
                     <button key={i} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left group">
                         <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                             <FileText size={14} />
                         </div>
                         <div className="flex flex-col min-w-0">
                             <span className="text-xs text-gray-300 group-hover:text-white truncate font-medium">Project_Specs_v2.pdf</span>
                             <span className="text-[10px] text-gray-600">Updated 2h ago</span>
                         </div>
                     </button>
                 ))}
            </div>
        </div>
    </motion.div>
  );
};