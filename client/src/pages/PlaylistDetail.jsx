// src/pages/PlaylistDetail.jsx
import { FaArrowLeft, FaMusic, FaPlay, FaRandom } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import SongList from '../components/SongList';
// 👇 1. Import danh sách playlist
import { playlists } from '../data/playlists';
const PlaylistDetail = ({ state, actions }) => {
    const { id } = useParams(); // Lấy ID playlist từ URL
    const navigate = useNavigate();

    // Nếu là 'tat-ca' hoặc tìm không thấy thì tạo một object mặc định
    const currentPlaylist = playlists.find(p => p.id === id)

    const displaySongs = state.songs.filter(song => {
        // 1. Nếu đang ở mục "Tất cả" -> Lấy hết
        if (id === 'tat-ca') return true;

        // 2. Nếu bài hát chưa có playlist (bài cũ) -> Cho vào mục "Khác" hoặc ẩn đi tùy bạn
        // Ở đây mình sẽ cho hiển thị nếu playlistId trùng khớp
        return song.playlist === id;
    });
    return (
        <div className="h-full flex flex-col px-4 pt-2">

            {/* Header: Nút Back + Tên Playlist */}
            <div className="flex items-center gap-4 mb-6 mt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-gray-800/80 rounded-full text-gray-300 hover:text-white transition backdrop-blur-md"
                >
                    <FaArrowLeft />
                </button>
                <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg shrink-0">
                    {currentPlaylist.coverUrl ? (
                        <img src={currentPlaylist.coverUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${currentPlaylist.color} flex items-center justify-center`}>
                            <FaMusic className="text-white/50" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">{currentPlaylist.name}</h2>
                    <p className="text-xs text-gray-400">{displaySongs.length} bài hát</p>
                </div>
            </div>

            {/* --- CÁC NÚT ĐIỀU KHIỂN (Đã chuyển vào trong này) --- */}
            <div className="flex gap-3 mb-4 shrink-0">
                <button
                    onClick={() => {
                        // Logic: Phát bài đầu tiên của playlist này
                        if (displaySongs.length > 0) {
                            actions.setIsShuffle(false);
                            actions.setCurrentSong(displaySongs[0]);
                            actions.setIsPlaying(true);
                        }
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
                >
                    <FaPlay size={12} /> Phát tất cả
                </button>

                <button
                    onClick={actions.handleShufflePlay}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 border border-gray-700"
                >
                    <FaRandom size={12} /> Ngẫu nhiên
                </button>
            </div>

            {/* Danh sách bài hát */}
            <SongList
                songs={displaySongs}
                currentSong={state.currentSong}
                isPlaying={state.isPlaying}
                onSelect={actions.setCurrentSong}
                favorites={state.favorites}
                onToggleFavorite={actions.toggleFavorite}
                onDelete={actions.handleDeleteSong}
            />
        </div>
    );
};

export default PlaylistDetail;