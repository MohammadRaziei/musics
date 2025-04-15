import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface Playlist {
  name: string;
  tracks: number[];
}

interface PlaylistModalProps {
  showPlaylistModal: boolean;
  playlists: Playlist[];
  newPlaylistName: string;
  setNewPlaylistName: (name: string) => void;
  createNewPlaylist: () => void;
  addTrackToPlaylist: (index: number) => void;
  closeModal: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  showPlaylistModal,
  playlists,
  newPlaylistName,
  setNewPlaylistName,
  createNewPlaylist,
  addTrackToPlaylist,
  closeModal
}) => {
  if (!showPlaylistModal) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000] p-4">
      <div className="bg-gray-800 rounded-lg p-5 w-full max-w-[400px]">
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
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PlaylistModal;