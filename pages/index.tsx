import { useState, useEffect } from 'react';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faPause, faStepForward, faStepBackward, 
  faVolumeUp, faHeart, faDownload, faPlus, faMusic,
  faRandom, faRedo
} from '@fortawesome/free-solid-svg-icons';
import musics from '../data/music.json';
// Replace CSS module imports with direct Tailwind classes
// import styles from '../styles/Home.module.css';

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [playlists, setPlaylists] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

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
      alert(`Cannot play "${musics[currentTrack]?.title}". The audio format may not be supported or the resource is unavailable.`);
      setIsPlaying(false);
    });
    
    setAudioElement(audio);
    
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('error', () => {});
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

  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioElement) {
      audioElement.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const addToPlaylist = (trackIndex) => {
    setShowPlaylistModal(true);
  };

  const createNewPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const updatedPlaylists = [...playlists, { name: newPlaylistName, tracks: [] }];
    setPlaylists(updatedPlaylists);
    localStorage.setItem('mrMusicPlaylists', JSON.stringify(updatedPlaylists));
    setNewPlaylistName('');
  };

  const addTrackToPlaylist = (playlistIndex) => {
    const updatedPlaylists = [...playlists];
    if (!updatedPlaylists[playlistIndex].tracks.includes(currentTrack)) {
      updatedPlaylists[playlistIndex].tracks.push(currentTrack);
      setPlaylists(updatedPlaylists);
      localStorage.setItem('mrMusicPlaylists', JSON.stringify(updatedPlaylists));
    }
    setShowPlaylistModal(false);
  };

  const exportPlaylist = (playlistIndex) => {
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

  const playTrack = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Head>
        <title>MR Music</title>
        <meta name="description" content="A beautiful music player app" />
        <link rel="icon" href="https://github.com/MohammadRaziei/mohammadraziei.github.io/raw/main/src/images/logo.svg" />
      </Head>

      <main className="flex flex-1 h-[calc(100vh-90px)] overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-black bg-opacity-30 p-6 flex flex-col border-r border-white border-opacity-10">
          <div className="flex items-center mb-8">
            <img 
              src="https://github.com/MohammadRaziei/mohammadraziei.github.io/raw/main/src/images/logo.svg" 
              alt="MR Music Logo" 
              className="w-10 h-10" 
            />
            <h1 className="ml-3 text-xl font-bold text-blue-500">MR Music</h1>
          </div>
          
          <div className="sidebar-item">
            <FontAwesomeIcon icon={faMusic} className="mr-4 text-blue-500 text-lg" />
            <span>All Music</span>
          </div>
          
          <div className="mt-8 flex-1 overflow-y-auto">
            <h2 className="text-xs uppercase text-blue-400 font-semibold mb-4">Playlists</h2>
            {playlists.map((playlist, index) => (
              <div 
                key={index} 
                className={`playlist-item ${selectedPlaylist === index ? 'active' : ''}`}
                onClick={() => setSelectedPlaylist(index)}
              >
                <span>{playlist.name}</span>
                <button 
                  className="bg-transparent border border-gray-600 text-gray-300 px-2 py-1 rounded text-xs transition-all hover:bg-blue-500 hover:text-white hover:border-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    exportPlaylist(index);
                  }}
                >
                  Export
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6 pb-3 border-b border-white border-opacity-10">
            <h2 className="text-2xl font-semibold">{selectedPlaylist !== null ? playlists[selectedPlaylist].name : 'All Music'}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {(selectedPlaylist !== null 
              ? playlists[selectedPlaylist].tracks.map(index => musics[index])
              : musics
            ).map((track, index) => (
              <div key={index} className="bg-white bg-opacity-5 rounded-xl overflow-hidden card-hover">
                <div 
                  className="relative w-full pt-[100%] cursor-pointer"
                  onClick={() => playTrack(selectedPlaylist !== null 
                    ? playlists[selectedPlaylist].tracks[index]
                    : index
                  )}
                >
                  <img src={track.coverUrl} alt={track.title} className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
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
        </div>
      </main>

      {/* Player */}
      <div className="h-[90px] bg-black bg-opacity-80 backdrop-blur-md border-t border-white border-opacity-10 flex items-center px-6 fixed bottom-0 w-full z-50">
        <div className="flex items-center w-1/3">
          <img 
            src={musics[currentTrack]?.coverUrl} 
            alt={musics[currentTrack]?.title} 
            className="w-[60px] h-[60px] rounded-lg mr-4 object-cover shadow-lg transition-transform duration-300 hover:scale-105"
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

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000]">
          <div className="bg-gray-800 rounded-lg p-5 w-[400px] max-w-[90%]">
            <h2 className="mt-0 mb-5 text-white">Add to Playlist</h2>
            <div className="max-h-[200px] overflow-y-auto mb-5">
              {playlists.map((playlist, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded cursor-pointer transition-colors hover:bg-gray-700"
                  onClick={() => addTrackToPlaylist(index)}
                >
                  {playlist.name}
                </div>
              ))}
            </div>
            <div className="flex mb-5">
              <input
                type="text"
                placeholder="New playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="flex-1 bg-gray-700 border-none p-3 rounded text-white mr-2"
              />
              <button 
                onClick={createNewPlaylist}
                className="bg-blue-500 border-none text-white p-3 rounded cursor-pointer transition-colors hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faPlus} /> Create
              </button>
            </div>
            <button 
              className="bg-transparent border border-gray-600 text-white p-3 rounded cursor-pointer transition-colors hover:bg-gray-700 w-full"
              onClick={() => setShowPlaylistModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}