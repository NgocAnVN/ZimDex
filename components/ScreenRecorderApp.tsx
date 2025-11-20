import React, { useState, useRef, useEffect } from 'react';
import { Video, StopCircle, Download, Trash2, Monitor, Mic, AlertTriangle } from 'lucide-react';

export const ScreenRecorderApp: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Fix: Use 'any' instead of 'NodeJS.Timeout' to avoid type errors in browser environments
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      setErrorMessage(null);
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 60 }
        },
        audio: true // System audio
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setIsRecording(false);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      // Handle if user stops sharing via browser UI
      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedUrl(null);

    } catch (err: any) {
      console.error("Error starting screen recording:", err);
      if (err.name === 'NotAllowedError') {
          setErrorMessage("Permission denied. Please allow screen recording access.");
      } else if (err.message && err.message.includes('display-capture')) {
          setErrorMessage("Screen recording is disallowed by the browser environment permissions.");
      } else {
          setErrorMessage("Failed to start recording: " + (err.message || "Unknown error"));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const downloadVideo = () => {
    if (recordedUrl) {
      const a = document.createElement('a');
      a.href = recordedUrl;
      a.download = `recording-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const discardVideo = () => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
      setRecordedUrl(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#111] text-white">
      {/* Toolbar / Status */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
         <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
            <span className="font-medium font-mono text-lg tracking-widest">
              {isRecording ? formatTime(timer) : '00:00'}
            </span>
         </div>
         {isRecording && (
             <div className="text-xs text-red-400 font-medium animate-pulse uppercase tracking-wider">
                 ● Rec
             </div>
         )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 flex items-center justify-center bg-[#0a0a0a]">
        {!isRecording && !recordedUrl && (
          <div className="flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-300">
             <div className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl relative group">
                 <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                 <Monitor size={48} className="text-gray-300 relative z-10" />
             </div>
             
             {errorMessage ? (
                 <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg max-w-xs flex flex-col gap-2 items-center">
                     <div className="flex items-center gap-2 text-red-400 font-bold">
                        <AlertTriangle size={18} />
                        <span>Recording Failed</span>
                     </div>
                     <p className="text-xs text-red-300/80">{errorMessage}</p>
                     <button 
                        onClick={() => setErrorMessage(null)} 
                        className="text-xs text-white bg-white/10 px-3 py-1 rounded hover:bg-white/20 mt-2"
                     >
                        Dismiss
                     </button>
                 </div>
             ) : (
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Ready to Record?</h3>
                    <p className="text-gray-400 max-w-xs">Capture your entire screen, window, or browser tab. System audio is supported.</p>
                </div>
             )}

             {!errorMessage && (
                <button 
                    onClick={startRecording}
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                    <div className="w-3 h-3 bg-white rounded-full" />
                    Start Recording
                </button>
             )}
          </div>
        )}

        {isRecording && (
          <div className="flex flex-col items-center gap-8">
             <div className="relative">
                <div className="w-40 h-40 rounded-full border-4 border-red-500/30 flex items-center justify-center animate-[spin_4s_linear_infinite]">
                   <div className="w-full h-full rounded-full border-4 border-transparent border-t-red-500" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-32 h-32 rounded-full bg-red-500/10 flex items-center justify-center animate-pulse">
                      <Video size={40} className="text-red-500" />
                   </div>
                </div>
             </div>
             <button 
                onClick={stopRecording}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-full font-bold transition-all flex items-center gap-2"
             >
                <StopCircle size={20} />
                Stop Recording
             </button>
          </div>
        )}

        {!isRecording && recordedUrl && (
          <div className="w-full h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex-1 bg-black rounded-xl border border-white/10 overflow-hidden shadow-2xl relative group">
                <video src={recordedUrl} controls className="w-full h-full object-contain" />
             </div>
             <div className="flex justify-center gap-4">
                <button 
                   onClick={discardVideo}
                   className="px-6 py-2 bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                   <Trash2 size={16} />
                   Discard
                </button>
                <button 
                   onClick={downloadVideo}
                   className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 transition-colors flex items-center gap-2"
                >
                   <Download size={16} />
                   Save Recording
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};