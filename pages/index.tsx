import { useState, useEffect } from 'react';

import Head from 'next/head';
import musics from '../data/music.json';
import Sidebar from '../components/Sidebar';
import MusicGrid from '../components/MusicGrid';
import Player from '../components/Player';
import PlaylistModal from '../components/PlaylistModal';
import HamburgerMenu from '../components/HamburgerMenu';
import LoadingSpinner from '../components/LoadingSpinner';

// Define interfaces
interface Playlist {
  name: string;
  tracks: number[];
}

interface Track {
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);


  // Load playlists from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPlaylists = localStorage.getItem('mrMusicPlaylists');
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      } else {
        // Initialize with default playlist
        const defaultPlaylists = [{ name: 'My Favorites', tracks: [] }];
        setPlaylists(defaultPlaylists);
        localStorage.setItem('mrMusicPlaylists', JSON.stringify(defaultPlaylists));
      }
    }

    // Initialize audio element
    const audio = new Audio();
    audio.src = musics[currentTrack]?.audioUrl || '';
    audio.volume = volume;

    // Add error handling for audio loading
    audio.addEventListener('error', (e) => {
      console.error("Audio error:", e);
      // alert(`Cannot play "${musics[currentTrack]?.title}". The audio format may not be supported or the resource is unavailable.`);
      setIsPlaying(false);
    });

    setAudioElement(audio);
    setIsLoading(false);

    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('error', () => { });
      }
    };
  }, []);

  // Update audio element when track changes
  useEffect(() => {
    if (audioElement) {
      audioElement.src = musics[currentTrack]?.audioUrl || '';
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
          // Handle the error gracefully
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack, audioElement]);

  // Handle play/pause
  useEffect(() => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error("Error playing audio:", error);
          // Handle the error gracefully
          setIsPlaying(false);
        });
      } else {
        audioElement.pause();
      }
    }
  }, [isPlaying, audioElement]);

  // Update audio events
  useEffect(() => {
    if (!audioElement) return;

    const updateTime = () => setCurrentTime(audioElement.currentTime);
    const updateDuration = () => setDuration(audioElement.duration);
    const endedHandler = () => {
      if (repeat) {
        audioElement.currentTime = 0;
        audioElement.play();
      } else if (shuffle) {
        const randomIndex = Math.floor(Math.random() * musics.length);
        setCurrentTrack(randomIndex);
      } else {
        handleNext();
      }
    };

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateDuration);
    audioElement.addEventListener('ended', endedHandler);

    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateDuration);
      audioElement.removeEventListener('ended', endedHandler);
    };
  }, [audioElement, repeat, shuffle]);

  // Handle volume change
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev === musics.length - 1 ? 0 : prev + 1));
  };

  const handlePrevious = () => {
    setCurrentTrack((prev) => (prev === 0 ? musics.length - 1 : prev - 1));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioElement) {
      audioElement.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const addToPlaylist = (trackIndex: number) => {
    setShowPlaylistModal(true);
  };

  const createNewPlaylist = () => {
    if (!newPlaylistName.trim()) return;

    const updatedPlaylists = [...playlists, { name: newPlaylistName, tracks: [] }];
    setPlaylists(updatedPlaylists);
    localStorage.setItem('mrMusicPlaylists', JSON.stringify(updatedPlaylists));
    setNewPlaylistName('');
  };

  const addTrackToPlaylist = (playlistIndex: number) => {
    const updatedPlaylists = [...playlists];
    if (!updatedPlaylists[playlistIndex].tracks.includes(currentTrack)) {
      updatedPlaylists[playlistIndex].tracks.push(currentTrack);
      setPlaylists(updatedPlaylists);
      localStorage.setItem('mrMusicPlaylists', JSON.stringify(updatedPlaylists));
    }
    setShowPlaylistModal(false);
  };

  const exportPlaylist = (playlistIndex: number) => {
    const playlist = playlists[playlistIndex];
    const playlistData = {
      name: playlist.name,
      tracks: playlist.tracks.map(index => musics[index])
    };

    const dataStr = JSON.stringify(playlistData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = `${playlist.name.replace(/\s+/g, '_')}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const playTrack = (index: number) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Head>
        <title>MR Music</title>
        <meta name="description" content="A beautiful music player app" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="https://github.com/MohammadRaziei/mohammadraziei.github.io/raw/main/src/images/logo.svg" />
      </Head>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Mobile Header */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-white border-opacity-10">
            <div className="flex items-center">
              <img
                src="https://github.com/MohammadRaziei/mohammadraziei.github.io/raw/main/src/images/logo.svg"
                alt="MR Music Logo"
                className="w-8 h-8"
              />
              <h1 className="ml-3 text-lg font-bold text-blue-500">MR Music</h1>
            </div>
            <HamburgerMenu isOpen={isMobileMenuOpen} toggle={toggleMobileMenu} />
          </div>

          <div className="flex flex-1 flex-col md:flex-row h-[calc(100vh-90px)] md:overflow-hidden">
            {/* Mobile Sidebar (conditionally rendered) */}
            {isMobileMenuOpen && (
              <div className="md:hidden">
                <Sidebar
                  playlists={playlists}
                  selectedPlaylist={selectedPlaylist}
                  setSelectedPlaylist={(index) => {
                    setSelectedPlaylist(index);
                    setIsMobileMenuOpen(false);
                  }}
                  exportPlaylist={exportPlaylist}
                  showAddPlaylistModal={() => setShowPlaylistModal(true)}
                />
              </div>
            )}

            {/* Desktop Sidebar (always visible on md+) */}
            <div className="hidden md:block">
              <Sidebar
                playlists={playlists}
                selectedPlaylist={selectedPlaylist}
                setSelectedPlaylist={setSelectedPlaylist}
                exportPlaylist={exportPlaylist}
                showAddPlaylistModal={() => setShowPlaylistModal(true)}
              />
            </div>

            {/* Content */}
            <MusicGrid
              selectedPlaylist={selectedPlaylist}
              playlists={playlists}
              musics={musics as Track[]}
              playTrack={playTrack}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              handlePlayPause={handlePlayPause}
              handleNext={handleNext}
              handlePrevious={handlePrevious}
              currentTime={currentTime}
              duration={duration}
              modalOpen={modalOpen}
              setModalOpen={setModalOpen}
            />
          </div>

          {/* Player */}
          <Player
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            duration={duration}
            currentTime={currentTime}
            volume={volume}
            shuffle={shuffle}
            repeat={repeat}
            musics={musics as Track[]}
            handlePlayPause={handlePlayPause}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            handleTimeChange={handleTimeChange}
            handleVolumeChange={handleVolumeChange}
            formatTime={formatTime}
            setShuffle={setShuffle}
            setRepeat={setRepeat}
            addToPlaylist={addToPlaylist}
            setModalOpen={setModalOpen}
            setSelectedTrack={setSelectedTrack}
            
          />

          {/* Playlist Modal */}
          <PlaylistModal
            showPlaylistModal={showPlaylistModal}
            playlists={playlists}
            newPlaylistName={newPlaylistName}
            setNewPlaylistName={setNewPlaylistName}
            createNewPlaylist={createNewPlaylist}
            addTrackToPlaylist={addTrackToPlaylist}
            closeModal={() => setShowPlaylistModal(false)}
          />
        </>
      )}
    </div>
  );
}