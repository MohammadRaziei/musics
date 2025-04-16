import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay, faPause, faStepForward, faStepBackward,
  faVolumeUp, faHeart, faDownload, faPlus,
  faRandom, faRedo
} from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface Track {
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

interface PlayerProps {
  currentTrack: number;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  volume: number;
  shuffle: boolean;
  repeat: boolean;
  musics: Track[];
  handlePlayPause: () => void;
  handlePrevious: () => void;
  handleNext: () => void;
  handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatTime: (time: number) => string;
  setShuffle: (value: boolean) => void;
  setRepeat: (value: boolean) => void;
  addToPlaylist: (trackIndex: number) => void;
  setModalOpen: (open: boolean) => void;
  setSelectedTrack: (track: number | null) => void;
}



const Player: React.FC<PlayerProps> = ({
  currentTrack,
  isPlaying,
  duration,
  currentTime,
  volume,
  shuffle,
  repeat,
  musics,
  handlePlayPause,
  handlePrevious,
  handleNext,
  handleTimeChange,
  handleVolumeChange,
  formatTime,
  setShuffle,
  setRepeat,
  addToPlaylist,
  setModalOpen,
  setSelectedTrack
}) => {
  return (
    <div className="bg-black bg-opacity-80 backdrop-blur-md border-t border-white border-opacity-10 fixed bottom-0 w-full z-50">
      {/* Mobile Player */}
      <div className="md:hidden p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center flex-1 overflow-hidden">
            <img
              src={musics[currentTrack]?.coverUrl}
              alt={musics[currentTrack]?.title}
              className="w-12 h-12 rounded-md object-cover cursor-pointer"
              onClick={() => {
                setSelectedTrack(currentTrack);
                setModalOpen(true);
              }}
            />
            <div className="overflow-hidden">
              <h3 className="text-sm font-medium truncate">{musics[currentTrack]?.title}</h3>
              <p className="text-xs text-gray-400 truncate">{musics[currentTrack]?.artist}</p>
            </div>
          </div>
          <button className="ml-2 bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center" onClick={handlePlayPause}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
        </div>

        <div className="flex items-center w-full">
          <span className="text-xs text-gray-400 w-8 text-center">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleTimeChange}
            className="progress-bar flex-1 mx-1"
          />
          <span className="text-xs text-gray-400 w-8 text-center">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Desktop Player */}
      <div className="hidden md:flex h-[90px] items-center px-6">
        <div className="flex items-center w-1/3">
          <img
            src={musics[currentTrack]?.coverUrl}
            alt={musics[currentTrack]?.title}
            className="w-[60px] h-[60px] rounded-lg mr-4 object-cover shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => {
              setSelectedTrack(currentTrack);
              setModalOpen(true);
            }}
          />
          <div className="overflow-hidden">
            <h3 className="text-sm font-medium truncate">{musics[currentTrack]?.title}</h3>
            <p className="text-xs text-gray-400 truncate">{musics[currentTrack]?.artist}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-1/3">
          <div className="flex items-center mb-2">
            <button
              className={`bg-transparent border-none text-gray-300 text-lg cursor-pointer mx-3 transition-all hover:text-blue-500 hover:scale-110 ${shuffle ? 'text-blue-500' : ''}`}
              onClick={() => setShuffle(!shuffle)}
            >
              <FontAwesomeIcon icon={faRandom} />
            </button>
            <button className="bg-transparent border-none text-gray-300 text-lg cursor-pointer mx-3 transition-all hover:text-blue-500 hover:scale-110" onClick={handlePrevious}>
              <FontAwesomeIcon icon={faStepBackward} />
            </button>
            <button className="bg-blue-500 border-none text-white w-12 h-12 rounded-full flex items-center justify-center cursor-pointer mx-4 transition-all hover:scale-110 hover:bg-blue-600 shadow-lg shadow-blue-500/30" onClick={handlePlayPause}>
              <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
            </button>
            <button className="bg-transparent border-none text-gray-300 text-lg cursor-pointer mx-3 transition-all hover:text-blue-500 hover:scale-110" onClick={handleNext}>
              <FontAwesomeIcon icon={faStepForward} />
            </button>
            <button
              className={`bg-transparent border-none text-gray-300 text-lg cursor-pointer mx-3 transition-all hover:text-blue-500 hover:scale-110 ${repeat ? 'text-blue-500' : ''}`}
              onClick={() => setRepeat(!repeat)}
            >
              <FontAwesomeIcon icon={faRedo} />
            </button>
          </div>

          <div className="flex items-center w-full">
            <span className="text-xs text-gray-400 w-10 text-center">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleTimeChange}
              className="progress-bar flex-1 mx-2"
            />
            <span className="text-xs text-gray-400 w-10 text-center">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end w-1/3">
          <button className="bg-transparent border-none text-gray-300 text-lg cursor-pointer mx-2 transition-all hover:text-blue-500 hover:scale-110" onClick={() => addToPlaylist(currentTrack)}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button className="bg-transparent border-none text-gray-300 text-lg cursor-pointer mx-2 transition-all hover:text-blue-500 hover:scale-110">
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <button
            className="bg-transparent border-none text-gray-300 text-lg cursor-pointer mx-2 transition-all hover:text-blue-500 hover:scale-110"
            onClick={() => {
              if (musics[currentTrack]?.audioUrl) {
                const link = document.createElement('a');
                link.href = musics[currentTrack].audioUrl;
                link.download = `${musics[currentTrack].artist} - ${musics[currentTrack].title}.mp3`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
            }}
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
          <div className="flex items-center ml-4">
            <FontAwesomeIcon icon={faVolumeUp} className="text-gray-300" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
