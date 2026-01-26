// src/components/SongList.jsx

const SongList = ({
  songs,
  currentSong,
  isPlaying,
  onSelect,
  isSelectionMode,
  selectedIds,
  onToggleSelection
}) => {

  return (
    <div className="flex flex-col gap-2 pb-32">
      {songs.map((song, index) => {
        const isCurrent = currentSong?.id === song.id;
        const isSelected = selectedIds?.includes(song.id);

        return (
          <div
            key={song.id}
            onClick={() => !isSelectionMode && onSelect(song)}
            className={`
                flex items-center gap-3 p-3 rounded-xl transition-all group
                ${isCurrent ? 'bg-gray-800' : 'hover:bg-gray-800/50'}
                ${isSelected ? 'bg-blue-900/30 border border-blue-500/50' : 'border border-transparent'}
            `}
          >
            {/* Checkbox (Giữ nguyên) */}
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <input
                type="checkbox"
                checked={isSelected || false}
                onChange={() => onToggleSelection(song.id)}
                className="w-5 h-5 rounded border-gray-600 cursor-pointer accent-green-500"
              />
            </div>

            {/* STT/Icon (Giữ nguyên) */}
            <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0 relative">
              {isCurrent && isPlaying ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="animate-pulse h-3 w-3 bg-green-500 rounded-full"></span>
                </div>
              ) : (
                <span className="text-gray-500 font-bold text-sm">{index + 1}</span>
              )}
            </div>

            {/* Tên bài hát (Giữ nguyên) */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium truncate ${isCurrent ? 'text-green-400' : 'text-white'}`}>
                {song.name.replace('.mp3', '')}
              </h3>
            </div>

            {/* ❌ ĐÃ XÓA ĐOẠN NÚT TIM Ở ĐÂY */}

          </div>
        );
      })}
    </div>
  );
};

export default SongList;