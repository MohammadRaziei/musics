import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faStepForward, faStepBackward, faTimes, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface Track {
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  album?: string;
}

interface MusicModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onNavigateNext?: () => void; // New prop for modal navigation
  onNavigatePrevious?: () => void; // New prop for modal navigation
}

const MusicModal: React.FC<MusicModalProps> = ({
  track,
  isOpen,
  onClose,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  isPlaying,
  currentTime,
  duration,
  onNavigateNext,
  onNavigatePrevious
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(30).fill(0));

  // Generate random visualizer data for demo purposes
  useEffect(() => {
    if (isOpen && isPlaying) {
      const interval = setInterval(() => {
        const newData = Array(30).fill(0).map(() => Math.random() * 100);
        setVisualizerData(newData);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [isOpen, isPlaying]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle drag to close and swipe navigation (for mobile only)
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // Only track touch events (mobile) for horizontal swipes
    if ('touches' in e) {
      const clientY = e.touches[0].clientY;
      const clientX = e.touches[0].clientX;
      setStartY(clientY);
      setStartX(clientX);
    } else {
      // For mouse events, only track vertical movement for closing
      const clientY = e.clientY;
      setStartY(clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!startY) return;
    
    if ('touches' in e) {
      // Mobile touch handling with both vertical and horizontal swipes
      const clientY = e.touches[0].clientY;
      const clientX = e.touches[0].clientX;
      const deltaY = clientY - startY;
      
      // Vertical swipe to close
      if (Math.abs(deltaY) > 60) {
        onClose();
        setStartY(null);
        setStartX(null);
        return;
      }
      
      // Horizontal swipe for navigation (only on mobile)
      if (startX !== null) {
        const deltaX = clientX - startX;
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
          if (deltaX > 0 && onNavigatePrevious) {
            onNavigatePrevious();
            setStartY(null);
            setStartX(null);
          } else if (deltaX < 0 && onNavigateNext) {
            onNavigateNext();
            setStartY(null);
            setStartX(null);
          }
        }
      }
    } else {
      // Desktop mouse handling - only for vertical drag to close
      const clientY = e.clientY;
      const deltaY = clientY - startY;
      
      if (deltaY > 100) {
        onClose();
        setStartY(null);
      }
    }
  };

  const handleTouchEnd = () => {
    setStartY(null);
    setStartX(null);
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (event.key === 'ArrowLeft' && onNavigatePrevious) {
        onNavigatePrevious();
      } else if (event.key === 'ArrowRight' && onNavigateNext) {
        onNavigateNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNavigateNext, onNavigatePrevious]);

  if (!isOpen || !track) return null;

  const progressPercent = (currentTime / duration) * 100 || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md transition-opacity duration-300">
      <div 
        ref={modalRef}
        className="w-full max-w-md mx-auto bg-gray-900 rounded-t-2xl overflow-hidden shadow-2xl transform transition-transform duration-300 ease-out animate-slide-up"
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative">
          {/* Navigation buttons */}
          {onNavigatePrevious && (
            <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">
              <button 
                onClick={onNavigatePrevious}
                className="bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-all"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>
          )}
          
          {onNavigateNext && (
            <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2">
              <button 
                onClick={onNavigateNext}
                className="bg-black bg-opacity-50 rounded-full p-3 text-white hover:bg-opacity-70 transition-all"
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          )}
          
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={onClose}
              className="bg-black bg-opacity-50 rounded-full p-2 text-white hover:bg-opacity-70 transition-all"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <img 
            src={track.coverUrl} 
            alt={track.title} 
            className="w-full h-64 object-cover" 
          />
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-1">{track.title}</h2>
          <p className="text-gray-400 mb-4">{track.artist} {track.album ? `• ${track.album}` : ''}</p>
          
          {/* Audio Visualizer */}
          <div className="h-16 mb-6 flex items-end justify-between">
            {visualizerData.map((height, i) => (
              <div 
                key={i} 
                className="w-1 rounded-t-sm transition-all duration-100 ease-out"
                style={{ 
                  height: `${height}%`, 
                  backgroundColor: i / visualizerData.length < progressPercent / 100 ? '#3b82f6' : '#4b5563'
                }}
              ></div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-700 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-blue-500 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <button 
              onClick={onPrevious}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <FontAwesomeIcon icon={faStepBackward} size="lg" />
            </button>
            
            <button 
              onClick={isPlaying ? onPause : onPlay}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-colors"
            >
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} size="lg" />
            </button>
            
            <button 
              onClick={onNext}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              <FontAwesomeIcon icon={faStepForward} size="lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicModal;