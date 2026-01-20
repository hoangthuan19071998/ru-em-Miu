// src/pages/Home.jsx
import { FaMusic } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { playlists } from '../data/playlists';
const Home = () => {
    const navigate = useNavigate();

    // Dữ liệu giả lập các Playlist (Bạn có thể thêm hình ảnh coverUrl vào đây)
    const displayPlaylists = [
        ...playlists
    ];

    return (
        <div className="h-full px-4 pt-4 overflow-y-auto pb-20 scrollbar-hide">

            <h2 className="text-lg font-bold text-white mb-4">Danh sách phát</h2>

            {/* GRID LAYOUT: 2 Cột trên Mobile */}
            <div className="grid grid-cols-2 gap-4">
                {displayPlaylists.map((playlist) => (
                    <div
                        key={playlist.id}
                        onClick={() => navigate(`/playlist/${playlist.id}`)}
                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-all duration-200 shadow-lg"
                    >
                        <div className={`w-full h-full bg-gradient-to-br ${playlist.color} relative`}>
                            {playlist.coverUrl ? (
                                // TRƯỜNG HỢP 1: CÓ ẢNH
                                <img
                                    src={playlist.coverUrl}
                                    alt={playlist.name}
                                    className="w-full h-full object-contain p-2  transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                // TRƯỜNG HỢP 2: KHÔNG CÓ ẢNH (Dùng màu Gradient cũ)
                                <div className={`w-full h-full bg-gradient-to-br ${playlist.color || 'from-gray-700 to-gray-900'} flex items-center justify-center`}>
                                    <FaMusic className="text-white/30 text-4xl group-hover:scale-110 transition-transform" />
                                </div>
                            )}
                        </div>


                        {/* Lớp phủ đen mờ để chữ luôn dễ đọc */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-10">
                            <p className="text-white font-bold text-sm truncate">{playlist.name}</p>
                        </div>
                    </div>
                ))}

            </div>

        </div>
    );
};

export default Home;