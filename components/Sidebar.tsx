import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic, faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface Playlist {
  name: string;
  tracks: number[];
}

interface SidebarProps {
  playlists: Playlist[];
  selectedPlaylist: number | null;
  setSelectedPlaylist: (index: number | null) => void;
  exportPlaylist: (index: number) => void;
  showAddPlaylistModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  playlists, 
  selectedPlaylist, 
  setSelectedPlaylist, 
  exportPlaylist,
  showAddPlaylistModal
}) => {
  return (
    <div className="w-full md:w-64 bg-black bg-opacity-30 p-4 md:p-6 flex flex-col border-b md:border-b-0 md:border-r border-white border-opacity-10 md:h-full overflow-y-auto">
      <div className="flex items-center mb-6">
        <img 
          src="https://github.com/MohammadRaziei/mohammadraziei.github.io/raw/main/src/images/logo.svg" 
          alt="MR Music Logo" 
          className="w-8 h-8 md:w-10 md:h-10" 
        />
        <h1 className="ml-3 text-lg md:text-xl font-bold text-blue-500">MR Music</h1>
      </div>
      
      <div 
        className="sidebar-item cursor-pointer flex items-center p-2 rounded hover:bg-white hover:bg-opacity-10"
        onClick={() => setSelectedPlaylist(null)}
      >
        <FontAwesomeIcon icon={faMusic} className="mr-4 text-blue-500 text-lg" />
        <span>All Music</span>
      </div>
      
      <div className="mt-6 flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs uppercase text-blue-400 font-semibold">Playlists</h2>
          <button 
            onClick={showAddPlaylistModal}
            className="text-blue-400 hover:text-blue-300"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        
        {playlists.map((playlist, index) => (
          <div 
            key={index} 
            className={`playlist-item flex justify-between items-center p-2 mb-1 rounded cursor-pointer ${selectedPlaylist === index ? 'bg-blue-500 bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
            onClick={() => setSelectedPlaylist(index)}
          >
            <span className="truncate">{playlist.name}</span>
            <button 
              className="bg-transparent border border-gray-600 text-gray-300 px-2 py-1 rounded text-xs transition-all hover:bg-blue-500 hover:text-white hover:border-blue-500"
              onClick={(e: React.MouseEvent) => {
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
  );
};

export default Sidebar;