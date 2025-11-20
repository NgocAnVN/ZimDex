import React, { useRef, useState } from 'react';
import { Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react';

interface WallpaperAppProps {
  wallpapers: string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: (file: File) => void;
  onRemove: (index: number) => void;
}

export const WallpaperApp: React.FC<WallpaperAppProps> = ({
  wallpapers,
  activeIndex,
  onSelect,
  onAdd,
  onRemove
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    imageFiles.forEach(file => onAdd(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAdd(e.target.files[0]);
    }
  };

  return (
    <div 
      className="w-full h-full flex flex-col relative"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between shrink-0">
        <div>
           <h2 className="text-2xl font-bold text-white mb-1">Wallpaper Library</h2>
           <p className="text-gray-400 text-sm">Drag and drop images here to add to your collection</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium border border-white/10 shadow-lg"
        >
          <Upload size={16} />
          Upload Photo
        </button>
        <input 
           type="file" 
           ref={fileInputRef} 
           className="hidden" 
           accept="image/*" 
           onChange={handleFileSelect}
        />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-0">
        <div className="grid grid-cols-3 gap-4">
           {/* Add New Card (Visual alternative to button) */}
           <button 
             onClick={() => fileInputRef.current?.click()}
             className="aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 flex flex-col items-center justify-center gap-2 transition-all group"
           >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Plus size={20} className="text-gray-400 group-hover:text-white" />
              </div>
              <span className="text-xs text-gray-500 font-medium">Add New</span>
           </button>

           {wallpapers.map((src, index) => (
             <div 
               key={index} 
               className={`group relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${index === activeIndex ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/50' : 'border-transparent hover:border-white/20'}`}
               onClick={() => onSelect(index)}
             >
               <img src={src} alt={`Wallpaper ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
               
               {/* Active Indicator */}
               {index === activeIndex && (
                 <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <div className="w-2.5 h-1.5 border-l-2 border-b-2 border-white -rotate-45 mb-0.5" />
                 </div>
               )}

               {/* Gradient Overlay for text readability */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

               {/* Delete Button */}
               <button 
                 onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                 className="absolute bottom-2 right-2 p-2 bg-black/60 hover:bg-red-500/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0"
                 title="Remove wallpaper"
               >
                 <Trash2 size={14} />
               </button>
             </div>
           ))}
        </div>
      </div>

      {/* Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-4 bg-blue-600/20 backdrop-blur-md border-4 border-blue-500 border-dashed rounded-xl z-50 flex flex-col items-center justify-center animate-in fade-in duration-200 pointer-events-none">
           <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-2xl shadow-blue-500/50 animate-bounce">
              <Upload size={32} className="text-white" />
           </div>
           <h3 className="text-2xl font-bold text-white drop-shadow-lg">Drop to Add Wallpaper</h3>
        </div>
      )}
    </div>
  );
};