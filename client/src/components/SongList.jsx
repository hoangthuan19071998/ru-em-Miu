// src/components/SongList.jsx
import React from 'react';
import { FaMusic, FaWaveSquare, FaPlay, FaRandom } from 'react-icons/fa';

// Nhận thêm 2 props: onPlayFirst, onShufflePlay
const SongList = ({ songs, currentSong, isPlaying, onSelect, onPlayFirst, onShufflePlay }) => {
  
  if (songs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">
        <FaMusic className="mx-auto text-4xl mb-3 opacity-30" />
        <p>Danh sách trống. Hãy upload nhạc nhé!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* --- PHẦN MỚI: Cụm nút điều khiển đầu danh sách --- */}
      <div className="flex gap-3 mb-4 shrink-0">
        <button 
          onClick={onPlayFirst}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition transform active:scale-95 shadow-lg shadow-green-900/20"
        >
          <FaPlay size={12} /> Phát tất cả
        </button>
        
        <button 
          onClick={onShufflePlay}
          className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 border border-gray-700 transition transform active:scale-95"
        >
          <FaRandom size={12} /> Ngẫu nhiên
        </button>
      </div>

      <div className="text-xs text-gray-500 font-semibold uppercase mb-2 px-1">
        Danh sách ({songs.length} bài)
      </div>

      {/* Danh sách bài hát (Cuộn) */}
      <div className="flex-1 overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="space-y-2">
          {songs.map((song, index) => {
            const isActive = currentSong?.id === song.id;
            return (
              <div
                key={song.id}
                onClick={() => onSelect(song)}
                className={`
                  group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-gray-800 border border-green-500/50 shadow-md shadow-green-900/10' 
                    : 'bg-transparent hover:bg-gray-800/50 border border-transparent'}
                `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {/* Số thứ tự hoặc Icon */}
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors
                    ${isActive ? 'bg-green-500 text-white' : 'text-gray-500 group-hover:text-gray-300'}
                  `}>
                     {isActive && isPlaying ? <FaWaveSquare className="animate-pulse" /> : index + 1}
                  </div>
                  
                  {/* Tên bài hát */}
                  <div className="truncate">
                    <h4 className={`text-sm font-medium truncate ${isActive ? 'text-green-400' : 'text-gray-200'}`}>
                      {song.name}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SongList;