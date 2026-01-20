// src/components/SongList.jsx
import { useRef } from 'react'; // Nhớ import useRef
import { FaHeart, FaMusic, FaRegHeart, FaWaveSquare } from 'react-icons/fa';
// Nhận thêm 2 props: onPlayFirst, onShufflePlay
const SongList = ({ songs, currentSong, isPlaying, onSelect, onPlayFirst, onShufflePlay, favorites, onToggleFavorite, onDelete }) => {

  // Ref để lưu bộ đếm thời gian
  const timerRef = useRef(null);

  // Hàm bắt đầu ấn (Mouse Down / Touch Start)
  const handlePressStart = (songId) => {
    // Thiết lập bộ đếm: Sau 800ms sẽ kích hoạt xóa
    timerRef.current = setTimeout(() => {
      onDelete(songId);
      timerRef.current = null; // Reset để không bị tính là click thường
    }, 800);
  };

  // Hàm nhả chuột (Mouse Up / Touch End)
  const handlePressEnd = () => {
    // Nếu chưa đủ 800ms mà đã nhả ra -> Hủy lệnh xóa
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  if (songs.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 animate-pulse">
        <FaMusic className="mx-auto text-4xl mb-3 opacity-30" />
        <p>Danh sách trống.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">

      {/* Danh sách bài hát (Cuộn) */}
      <div className="flex-1 overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="space-y-2">
          {songs.map((song, index) => {
            const isActive = currentSong?.id === song.id;
            // Kiểm tra xem bài này có trong danh sách yêu thích chưa
            const isFav = favorites?.some(fav => fav.id === song.id);

            return (
              <div
                key={song.id}
                onMouseDown={() => handlePressStart(song.id)}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd} // Kéo chuột ra ngoài cũng hủy
                onTouchStart={() => handlePressStart(song.id)} // Cho Mobile
                onTouchEnd={handlePressEnd}
                // Ngăn menu chuột phải hiện ra khi giữ lâu trên mobile
                onContextMenu={(e) => e.preventDefault()}
                className={`
                       group flex items-center justify-between p-3 rounded-xl transition-all duration-200
                       ${isActive
                    ? 'bg-gray-800 border border-green-500/50'
                    : 'bg-transparent hover:bg-gray-800/50 border border-transparent'}
                     `}
              >
                {/* Khu vực bấm để nghe nhạc */}
                <div
                  className="flex items-center gap-3 overflow-hidden flex-1 cursor-pointer"
                  onClick={() => {
                    if (timerRef.current) {
                      onSelect(song);
                    }
                  }}
                >
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold
                         ${isActive ? 'bg-green-500 text-white' : 'text-gray-500 group-hover:text-gray-300'}
                       `}>
                    {isActive && isPlaying ? <FaWaveSquare className="animate-pulse" /> : index + 1}
                  </div>

                  <div className="truncate">
                    <h4 className={`text-sm font-medium truncate ${isActive ? 'text-green-400' : 'text-gray-200'}`}>
                      {song.name}
                    </h4>
                  </div>
                </div>

                {/* --- NÚT TIM MỚI --- */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn không cho kích hoạt việc phát nhạc
                    onToggleFavorite(song);
                  }}
                  className={`p-2 rounded-full transition-transform active:scale-90 ${isFav ? 'text-pink-500' : 'text-gray-600 hover:text-gray-400'}`}
                >
                  {isFav ? <FaHeart /> : <FaRegHeart />}
                </button>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SongList;