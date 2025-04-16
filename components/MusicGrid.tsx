import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import MusicModal from './MusicModal';

interface Track {
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  album?: string;
}

interface Playlist {
  name: string;
  tracks: number[];
}

interface MusicGridProps {
  selectedPlaylist: number | null;
  playlists: Playlist[];
  musics: Track[];
  playTrack: (index: number) => void;
  currentTrack: number;
  isPlaying: boolean;
  handlePlayPause: () => void;
  handleNext: () => void;
  handlePrevious: () => void;
  currentTime: number;
  duration: number;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const MusicGrid: React.FC<MusicGridProps> = ({
  selectedPlaylist,
  playlists,
  musics,
  playTrack,
  currentTrack,
  isPlaying,
  handlePlayPause,
  handleNext,
  handlePrevious,
  currentTime,
  duration,
  modalOpen,
  setModalOpen,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<number>(currentTrack);

  const handleTrackClick = (index: number) => {
    setModalOpen(true);
    setSelectedTrack(index);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTrack(currentTrack);
  };

  const handlePlayInModal = () => {
    if (selectedTrack !== null) {
      playTrack(selectedTrack);
    }
  };


  // Auto-select currentTrack if modal is open but selectedTrack is null
  // Remove or comment out this effect if you want the modal to always open with the clicked track
  // React.useEffect(() => {
  //   if (modalOpen && selectedTrack === null) {
  //     setSelectedTrack(currentTrack);
  //   }
  // }, [modalOpen, selectedTrack, currentTrack]);

  // Get the list of tracks currently displayed in the grid
  const displayedTracks = selectedPlaylist !== null
    ? playlists[selectedPlaylist].tracks
    : musics.map((_, i) => i);

  // New navigation functions
  const navigateToTrack = (targetIndex: number) => {
    if (displayedTracks.length === 0) return;
    const safeIndex = ((targetIndex % displayedTracks.length) + displayedTracks.length) % displayedTracks.length;
    setSelectedTrack(displayedTracks[safeIndex]);
  }

  // New navigation functions
  const handleNavigateNext = () => {
    if (selectedTrack === null) return;
    // Find the current track's position in the displayed tracks
    const currentIndex = displayedTracks.indexOf(selectedTrack);
    navigateToTrack(currentIndex + 1);
  };

  const handleNavigatePrevious = () => {
    if (selectedTrack === null) return;
    // Find the current track's position in the displayed tracks
    const currentIndex = displayedTracks.indexOf(selectedTrack);
    navigateToTrack(currentIndex - 1);
  };




  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="mb-6 pb-3 border-b border-white border-opacity-10">
        <h2 className="text-xl md:text-2xl font-semibold">
          {selectedPlaylist !== null ? playlists[selectedPlaylist].name : 'All Music'}
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {(selectedPlaylist !== null
          ? playlists[selectedPlaylist].tracks.map(index => ({ ...musics[index], originalIndex: index }))
          : musics.map((track, i) => ({ ...track, originalIndex: i }))
        ).map((track, index) => (
          <div key={index} className="bg-white bg-opacity-5 rounded-xl overflow-hidden card-hover">
            <div
              className="relative w-full pt-[100%] cursor-pointer"
              onClick={() => handleTrackClick(track.originalIndex)}
            >
              <img
                src={track.coverUrl}
                alt={track.title}
                className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 hover:opacity-100">
                <FontAwesomeIcon icon={faPlay} className="text-4xl text-blue-500" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-base font-medium truncate">{track.title}</h3>
              <p className="text-sm text-gray-400 truncate">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Music Modal */}
      <MusicModal
        track={selectedTrack !== null ? musics[selectedTrack] : null}
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onPlay={handlePlayInModal}
        onPause={handlePlayPause}
        onNext={() => { handleNext(); navigateToTrack?.(currentTrack + 1); }}
        onPrevious={() => { handlePrevious(); navigateToTrack?.(currentTrack - 1); }}
        isPlaying={isPlaying && selectedTrack === currentTrack}
        currentTime={currentTime}
        duration={duration}
        onNavigateNext={handleNavigateNext}
        onNavigatePrevious={handleNavigatePrevious}
      />
    </div>
  );
};

export default MusicGrid;