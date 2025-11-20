import React, { useState } from 'react';
import { 
  Monitor, Volume2, Bell, Grid, Layout, HardDrive, 
  Battery, Shield, Accessibility, Settings as SettingsIcon, 
  Info, User, Cpu, CircuitBoard, Type, Keyboard,
  Mouse, Printer, Bluetooth, Wifi, Moon, Sun,
  ToggleLeft, ToggleRight, Check, Search, Trash2,
  Mic, Camera, MapPin, Eye, Smartphone, Speaker,
  Headphones, Radio, Lock, Globe
} from 'lucide-react';

// --- Reusable UI Components ---

const SectionCard: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`bg-[#2a2e35]/80 border border-white/5 rounded-xl p-5 mb-4 ${className}`}>
    {title && <h3 className="text-white font-bold text-sm mb-4 border-b border-white/5 pb-2">{title}</h3>}
    {children}
  </div>
);

const SettingRow: React.FC<{ 
  icon?: React.ElementType; 
  label: string; 
  subLabel?: string; 
  action?: React.ReactNode;
  onClick?: () => void;
}> = ({ icon: Icon, label, subLabel, action, onClick }) => (
  <div 
    className={`flex items-center justify-between py-3 first:pt-0 last:pb-0 ${onClick ? 'cursor-pointer hover:bg-white/5 -mx-2 px-2 rounded-lg transition-colors' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
          <Icon size={18} className="text-gray-300"/>
        </div>
      )}
      <div>
        <div className="text-gray-200 text-sm font-medium">{label}</div>
        {subLabel && <div className="text-gray-500 text-xs">{subLabel}</div>}
      </div>
    </div>
    <div>{action}</div>
  </div>
);

const Toggle: React.FC<{ checked?: boolean }> = ({ checked = false }) => (
  <div className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${checked ? 'bg-[#3b82f6]' : 'bg-gray-600'}`}>
    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 ${checked ? 'left-6' : 'left-1'}`} />
  </div>
);

const ProgressBar: React.FC<{ value: number; color?: string }> = ({ value, color = "bg-blue-500" }) => (
  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
    <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

// --- Main Component ---

export const SettingsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('About');

  const menuItems = [
    { icon: Monitor, label: 'Devices' },
    { icon: Volume2, label: 'Sounds' },
    { icon: Bell, label: 'Notification' },
    { icon: Grid, label: 'Apps' },
    { icon: Layout, label: 'Display' },
    { icon: HardDrive, label: 'Storage' },
    { icon: Battery, label: 'Battery' },
    { icon: Shield, label: 'Privacy' },
    { icon: Accessibility, label: 'Accessibility' },
    { icon: SettingsIcon, label: 'System' },
  ];

  // Render Content Logic
  const renderContent = () => {
    switch (activeTab) {
      case 'Devices':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Bluetooth & devices</h2>
            <SectionCard>
               <SettingRow 
                  icon={Bluetooth} 
                  label="Bluetooth" 
                  subLabel="Discoverable as 'NgocAnn-PC'"
                  action={<Toggle checked={true} />}
               />
               <div className="mt-4 pt-4 border-t border-white/5">
                 <button className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-white border border-white/5">
                   Add device
                 </button>
               </div>
            </SectionCard>

            <SectionCard title="Input">
              <SettingRow icon={Mouse} label="Gaming Mouse G502" subLabel="Connected - Battery 80%" action={<span className="text-xs text-gray-500">Remove</span>} />
              <div className="my-2 border-b border-white/5" />
              <SettingRow icon={Keyboard} label="Mechanical Keyboard" subLabel="Connected" action={<span className="text-xs text-gray-500">Remove</span>} />
            </SectionCard>
            
            <SectionCard title="Other devices">
               <SettingRow icon={Printer} label="Canon LBP 2900" subLabel="Offline" />
               <div className="my-2 border-b border-white/5" />
               <SettingRow icon={Smartphone} label="iPhone 14 Pro" subLabel="Paired" />
            </SectionCard>
          </div>
        );

      case 'Sounds':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Sound</h2>
            <SectionCard title="Output">
               <SettingRow 
                 icon={Speaker} 
                 label="Speakers" 
                 subLabel="Realtek(R) Audio" 
                 action={<span className="text-xs text-blue-400 cursor-pointer">Properties</span>}
               />
               <div className="mt-4 px-2">
                 <div className="flex justify-between text-xs text-gray-400 mb-2">
                   <span>Volume</span>
                   <span>82%</span>
                 </div>
                 <ProgressBar value={82} />
               </div>
            </SectionCard>

            <SectionCard title="Input">
               <SettingRow 
                 icon={Mic} 
                 label="Microphone Array" 
                 subLabel="Intel Smart Sound Technology" 
                 action={<span className="text-xs text-blue-400 cursor-pointer">Properties</span>}
               />
               <div className="mt-4 px-2">
                 <div className="flex justify-between text-xs text-gray-400 mb-2">
                   <span>Volume</span>
                   <span>100%</span>
                 </div>
                 <ProgressBar value={100} />
               </div>
            </SectionCard>
          </div>
        );

      case 'Notification':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Notifications</h2>
            <SectionCard>
              <SettingRow 
                icon={Bell} 
                label="Notifications" 
                subLabel="Get notifications from apps and other senders" 
                action={<Toggle checked={true} />}
              />
              <div className="my-2 border-b border-white/5" />
              <SettingRow 
                icon={Moon} 
                label="Do not disturb" 
                subLabel="Notifications will be sent directly to notification center" 
                action={<Toggle checked={false} />}
              />
            </SectionCard>

            <SectionCard title="Get notifications from these senders">
               <SettingRow icon={SettingsIcon} label="Settings" subLabel="Banners, Sounds" action={<Toggle checked={true} />} />
               <div className="my-2 border-b border-white/5" />
               <SettingRow icon={Grid} label="Explorer" subLabel="Banners" action={<Toggle checked={true} />} />
               <div className="my-2 border-b border-white/5" />
               <SettingRow icon={ChromeIcon} label="Google Chrome" subLabel="Banners, Sounds" action={<Toggle checked={true} />} />
            </SectionCard>
          </div>
        );
        
      case 'Apps':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Apps & features</h2>
            <div className="bg-[#2a2e35]/80 border border-white/5 rounded-xl p-4 mb-4 flex gap-2">
               <Search className="text-gray-500" size={20} />
               <input 
                 type="text" 
                 placeholder="Search apps" 
                 className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
               />
            </div>
            
            <SectionCard title="Installed apps">
               <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">Z</div>
                     <div>
                        <div className="text-white text-sm font-medium">ZimDex Browser</div>
                        <div className="text-gray-500 text-xs">156 MB • 2025-01-15</div>
                     </div>
                  </div>
                  <SettingsIcon size={16} className="text-gray-500" />
               </div>
               <div className="border-b border-white/5 my-1" />
               <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#1DB954] rounded-lg flex items-center justify-center text-black"><Volume2 size={20} /></div>
                     <div>
                        <div className="text-white text-sm font-medium">Spotify</div>
                        <div className="text-gray-500 text-xs">240 MB • 2024-12-20</div>
                     </div>
                  </div>
                  <SettingsIcon size={16} className="text-gray-500" />
               </div>
               <div className="border-b border-white/5 my-1" />
               <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-[#007ACC] rounded-lg flex items-center justify-center text-white"><Layout size={20} /></div>
                     <div>
                        <div className="text-white text-sm font-medium">Visual Studio Code</div>
                        <div className="text-gray-500 text-xs">310 MB • 2025-02-01</div>
                     </div>
                  </div>
                  <SettingsIcon size={16} className="text-gray-500" />
               </div>
            </SectionCard>
          </div>
        );

      case 'Display':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl font-bold text-white mb-6">Display</h2>
            <SectionCard title="Brightness & color">
               <div className="mb-4">
                 <div className="flex justify-between text-sm text-gray-300 mb-2">
                   <span>Brightness</span>
                 </div>
                 <div className="flex items-center gap-4">
                   <Sun size={16} className="text-gray-500" />
                   <ProgressBar value={75} color="bg-white" />
                   <Sun size={20} className="text-white" />
                 </div>
               </div>
               <SettingRow 
                 icon={Moon} 
                 label="Night light" 
                 subLabel="Use warmer colors to help block blue light" 
                 action={<Toggle checked={false} />}
               />
            </SectionCard>

            <SectionCard title="Scale & layout">
               <SettingRow 
                 label="Scale" 
                 subLabel="100% (Recommended)" 
                 action={<div className="px-3 py-1 bg-white/10 rounded text-xs text-white">Change</div>}
               />
               <div className="my-2 border-b border-white/5" />
               <SettingRow 
                 label="Display resolution" 
                 subLabel="1920 x 1080 (Recommended)" 
                 action={<div className="px-3 py-1 bg-white/10 rounded text-xs text-white">Change</div>}
               />
            </SectionCard>
          </div>
        );

      case 'Storage':
         return (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-2xl font-bold text-white mb-6">Storage</h2>
             <SectionCard className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center">
                      <HardDrive size={32} className="text-blue-400" />
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-end mb-1">
                         <span className="text-white font-medium">Local Disk (C:)</span>
                         <span className="text-gray-400 text-sm">420 GB used / 1.8 TB free</span>
                      </div>
                      <ProgressBar value={20} />
                   </div>
                </div>
             </SectionCard>
             
             <SectionCard title="Usage breakdown">
                <SettingRow icon={Grid} label="Apps & features" subLabel="210 GB" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Trash2} label="Temporary files" subLabel="14 GB" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Layout} label="Other" subLabel="50 GB" />
             </SectionCard>
           </div>
         );

      case 'Battery':
         return (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-2xl font-bold text-white mb-6">Power & battery</h2>
             <SectionCard className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="absolute inset-0 border-4 border-green-500/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-green-500 rounded-full border-l-transparent border-b-transparent rotate-45"></div>
                      <span className="text-xl font-bold text-white">85%</span>
                   </div>
                   <div>
                      <div className="text-white font-medium">Estimated time remaining</div>
                      <div className="text-gray-400 text-sm">5 hours 21 minutes</div>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-xs text-gray-500">Last charged</div>
                   <div className="text-sm text-gray-300">2 hours ago</div>
                </div>
             </SectionCard>
             
             <SectionCard title="Power options">
                <SettingRow 
                  label="Power mode" 
                  subLabel="Optimize for performance" 
                  action={<div className="text-sm text-white bg-white/10 px-3 py-1 rounded border border-white/10">Best performance</div>}
                />
                <div className="my-2 border-b border-white/5" />
                <SettingRow 
                  icon={Battery} 
                  label="Battery saver" 
                  subLabel="Turn on now to extend battery life" 
                  action={<Toggle checked={false} />}
                />
             </SectionCard>
           </div>
         );

      case 'Privacy':
         return (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-2xl font-bold text-white mb-6">Privacy & security</h2>
             <SectionCard title="Windows permissions">
                <SettingRow icon={Shield} label="General" subLabel="Advertising ID, local content" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Mic} label="Speech" subLabel="Online speech recognition" />
             </SectionCard>
             
             <SectionCard title="App permissions">
                <SettingRow icon={MapPin} label="Location" subLabel="On" action={<Toggle checked={true} />} />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Camera} label="Camera" subLabel="On" action={<Toggle checked={true} />} />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Mic} label="Microphone" subLabel="On" action={<Toggle checked={true} />} />
             </SectionCard>
           </div>
         );
      
      case 'Accessibility':
         return (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-2xl font-bold text-white mb-6">Accessibility</h2>
             <SectionCard title="Vision">
                <SettingRow icon={Type} label="Text size" subLabel="Make text bigger" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Eye} label="Visual effects" subLabel="Scroll bars, transparency, animations" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Mouse} label="Mouse pointer and touch" subLabel="Mouse pointer color, size" />
             </SectionCard>

             <SectionCard title="Hearing">
                <SettingRow icon={Volume2} label="Audio" subLabel="Mono audio, audio notifications" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Type} label="Captions" subLabel="Subtitle styles" />
             </SectionCard>
           </div>
         );
         
      case 'System':
         return (
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-2xl font-bold text-white mb-6">System</h2>
             <SectionCard>
                <SettingRow icon={Monitor} label="Display" subLabel="Monitors, brightness, night light, display profile" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Volume2} label="Sound" subLabel="Volume levels, output, input, sound devices" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={Bell} label="Notifications" subLabel="Alerts from apps and system, do not disturb" />
             </SectionCard>
             
             <SectionCard title="Productivity">
                <SettingRow icon={Layout} label="Multitasking" subLabel="Snap windows, desktops, task switching" />
                <div className="my-2 border-b border-white/5" />
                <SettingRow icon={HardDrive} label="Storage" subLabel="Storage space, drives, configuration rules" />
             </SectionCard>
           </div>
         );

      case 'About':
      default:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* Computer Name Card */}
              <div className="col-span-5 bg-[#2a2e35]/80 border border-white/5 rounded-xl p-5 flex flex-col justify-center">
                <span className="text-xs text-gray-400 font-medium mb-1">Computer name</span>
                <h2 className="text-xl font-bold text-white tracking-tight">NgocAnn</h2>
              </div>
              
              {/* Hero Banner */}
              <div className="col-span-7 relative h-32 rounded-xl overflow-hidden border border-white/5 group">
                <img 
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=1000&auto=format&fit=crop" 
                  alt="ZimDex Banner" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6">
                    <div className="flex flex-col">
                      <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                        ZimDex <span className="text-2xl font-light opacity-90">with AI</span>
                      </h1>
                    </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4 mb-4">
              {/* Device Info */}
              <div className="col-span-5 bg-[#2a2e35]/80 border border-white/5 rounded-xl p-5 flex flex-col justify-center">
                <span className="text-xs text-gray-400 font-medium mb-2">More device info</span>
                <div className="bg-[#1a1d21] text-gray-400 font-mono text-sm p-2 rounded border border-white/5">
                  Ask your mom
                </div>
              </div>
              <div className="col-span-7"></div>
            </div>

            {/* Specifications Section */}
            <div className="bg-[#2a2e35]/80 border border-white/5 rounded-xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5">
                  <h3 className="text-base font-bold text-white">Specifications</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                  {/* CPU */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                      <Cpu size={12} /> CPU
                    </div>
                    <div className="text-white font-semibold text-sm">Intel® Core i3</div>
                    <div className="text-gray-400 text-xs">10105F - 4.2GHz</div>
                  </div>

                  {/* GPU */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                      <CircuitBoard size={12} /> GPU
                    </div>
                    <div className="text-white font-semibold text-sm">NVIDIA GeForce GTX 1650</div>
                    <div className="text-gray-400 text-xs">11,9GB</div>
                  </div>

                  {/* RAM */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                      <HardDrive size={12} /> RAM
                    </div>
                    <div className="text-white font-semibold text-sm">16GB</div>
                    <div className="text-gray-400 text-xs">DDR4</div>
                  </div>
              </div>
              
              <div className="mt-6 grid grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <div className="text-gray-500 text-xs font-medium">Idk</div>
                    <div className="text-gray-400 text-xs">idk</div>
                  </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-[#2a2e35]/80 border border-white/5 rounded-xl p-5 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold text-sm">About ZimDex</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-400 text-xs">OS Type</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-white text-sm font-medium">64-bit</span>
                </div>
            </div>
          </div>
        );
    }
  };
  
  // Dummy component for Chrome Icon used in notifications
  const ChromeIcon = (props: any) => (
     <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
     </div>
  );

  return (
    <div className="flex h-full text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-[240px] bg-black/20 border-r border-white/5 flex flex-col py-4">
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto space-y-1 px-2 custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveTab(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                activeTab === item.label 
                  ? 'bg-white/10 text-white font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <item.icon size={16} className={`${activeTab === item.label ? 'text-[#3b82f6]' : 'text-gray-500'} ${item.label === 'Notification' ? 'text-red-400' : ''} ${item.label === 'Battery' ? 'text-green-400' : ''}`} />
              {item.label}
            </button>
          ))}
           {/* Separator before About */}
           <div className="my-2 border-b border-white/5 mx-4"></div>
           <button
              onClick={() => setActiveTab('About')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm transition-all duration-200 ${
                activeTab === 'About'
                  ? 'bg-white/10 text-white font-medium shadow-inner' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
              }`}
            >
              <Info size={16} className="text-white" />
              About
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};