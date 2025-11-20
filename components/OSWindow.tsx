import React, { useState } from 'react';
import { motion, Variants, useDragControls, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { X, Minus, Square, Search } from 'lucide-react';

interface OSWindowProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: (finalPos?: { x: number, y: number }) => void;
  title: string;
  isActive: boolean;
  onFocus: () => void;
  launchOrigin: { x: number, y: number };
  initialPosition: { x: number, y: number };
  onDragEnd: (pos: { x: number, y: number }) => void;
  dragConstraints?: React.RefObject<Element>;
}

export const OSWindow: React.FC<OSWindowProps> = ({
  children,
  isOpen,
  onClose,
  title,
  isActive,
  onFocus,
  launchOrigin,
  initialPosition,
  onDragEnd,
  dragConstraints
}) => {
  // Window dimensions
  const WIDTH = 950;
  const HEIGHT = 600;

  // Capture the initialPosition only when the component FIRST mounts.
  const [mountPosition] = useState(initialPosition);

  // Setup drag controls to restrict dragging to the header
  const dragControls = useDragControls();

  // Track drag deltas
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Context Menu State
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);

  // Dynamically calculate transform origin based on current position (mount + drag) relative to the launch origin
  const originX = useTransform(x, (currentX) => launchOrigin.x - (mountPosition.x + currentX));
  const originY = useTransform(y, (currentY) => launchOrigin.y - (mountPosition.y + currentY));
  
  const transformOrigin = useMotionTemplate`${originX}px ${originY}px`;

  const variants: Variants = {
    initial: {
      opacity: 0,
      scale: 0, // Start from icon size (0)
      rotateX: 60, // 3D tilt
      filter: "blur(20px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // iOS-like spring/ease
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      rotateX: 60, // Tilt away when closing
      filter: "blur(20px)",
      transition: {
        duration: 0.5,
        ease: [0.32, 0, 0.67, 0], // Ease in back
      }
    }
  };

  const handleClose = () => {
    // Pass the final calculated position back to parent based on mountPosition + current drag
    onClose({
      x: mountPosition.x + x.get(),
      y: mountPosition.y + y.get()
    });
  };

  const handleDragEnd = () => {
    // Update parent state with the new static position
    onDragEnd({
      x: mountPosition.x + x.get(),
      y: mountPosition.y + y.get()
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Close context menu on click elsewhere
  React.useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [contextMenu]);

  return (
    <>
      <motion.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{
          width: WIDTH,
          height: HEIGHT,
          position: 'absolute', // Changed to absolute for better constraint handling within the parent container
          top: mountPosition.y,
          left: mountPosition.x,
          x, 
          y,
          transformOrigin: transformOrigin, // The magic happens here
          transformStyle: "preserve-3d",
        }}
        className={`pointer-events-auto flex flex-col ${isActive ? 'z-[60]' : 'z-[50]'}`}
        onPointerDown={onFocus}
      >
        {/* The Window Frame */}
        <div 
          className="
            w-full h-full
            bg-[#1e2228]/85 backdrop-blur-xl
            rounded-xl border border-white/10 
            shadow-[0_30px_80px_rgba(0,0,0,0.6)] 
            flex flex-col overflow-hidden
          "
        >
          {/* Title Bar - Draggable Area */}
          <div 
            onPointerDown={(e) => {
              onFocus();
              dragControls.start(e);
            }}
            onContextMenu={handleContextMenu}
            className="h-10 bg-white/5 border-b border-white/5 flex items-center justify-between px-4 select-none shrink-0 cursor-grab active:cursor-grabbing touch-none"
          >
             {/* Search/Title area */}
             <div className="flex items-center w-1/3 pointer-events-none">
                 <div className="text-xs font-medium text-gray-400 flex items-center gap-2">
                   <Search size={12} />
                   <span className="opacity-80">{title}</span>
                 </div>
             </div>
             
             {/* Window Controls */}
             <div className="flex items-center gap-4 text-gray-400 pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
               <button className="hover:text-white transition-colors"><Minus size={14} /></button>
               <button className="hover:text-white transition-colors"><Square size={12} /></button>
               <button 
                  onClick={(e) => { e.stopPropagation(); handleClose(); }} 
                  className="hover:text-red-400 transition-colors"
               >
                 <X size={14} />
               </button>
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative text-gray-200 cursor-auto">
            {children}
          </div>
        </div>
      </motion.div>

      {/* Title Bar Context Menu Portal */}
      {contextMenu && (
        <div 
            style={{ 
              position: 'fixed', 
              top: contextMenu.y, 
              left: contextMenu.x,
              zIndex: 9999 
            }}
            className="w-48 bg-[#141414]/95 backdrop-blur-xl border border-white/15 rounded-lg shadow-2xl py-1.5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left"
            onClick={(e) => e.stopPropagation()}
        >
             <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-xs mx-1 rounded transition-colors text-left">
               Minimize
             </button>
             <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-xs mx-1 rounded transition-colors text-left">
               Maximize
             </button>
             <div className="h-[1px] bg-white/10 my-1 mx-2" />
             <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-xs mx-1 rounded transition-colors text-left">
               About ZimDex
             </button>
             <div className="h-[1px] bg-white/10 my-1 mx-2" />
             <button 
                onClick={() => { setContextMenu(null); handleClose(); }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-red-500/80 text-gray-200 hover:text-white text-xs mx-1 rounded transition-colors text-left"
             >
               Close
             </button>
        </div>
      )}
    </>
  );
};