import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface Track {
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
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
}

const MusicGrid: React.FC<MusicGridProps> = ({ 
  selectedPlaylist, 
  playlists, 
  musics, 
  playTrack 
}) => {
  return (
    <div className="flex-1 p-4 md:p-6 overflow-y-auto">
      <div className="mb-6 pb-3 border-b border-white border-opacity-10">
        <h2 className="text-xl md:text-2xl font-semibold">
          {selectedPlaylist !== null ? playlists[selectedPlaylist].name : 'All Music'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {(selectedPlaylist !== null 
          ? playlists[selectedPlaylist].tracks.map(index => ({ ...musics[index], originalIndex: index }))
          : musics.map((track, i) => ({ ...track, originalIndex: i }))
        ).map((track, index) => (
          <div key={index} className="bg-white bg-opacity-5 rounded-xl overflow-hidden card-hover">
            <div 
              className="relative w-full pt-[100%] cursor-pointer"
              onClick={() => playTrack(track.originalIndex)}
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
    </div>
  );
};

export default MusicGrid;