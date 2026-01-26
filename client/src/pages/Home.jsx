// src/pages/Home.jsx
import { useEffect, useRef, useState } from 'react';
import { FaMusic, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { deletePlaylistAPI, fetchPlaylistsAPI } from '../api';

const Home = () => {
    const navigate = useNavigate();
    const [dbPlaylists, setDbPlaylists] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- STATE QUẢN LÝ LONG PRESS & MODAL ---
    const [playlistToDelete, setPlaylistToDelete] = useState(null); // Lưu playlist đang muốn xóa
    const timerRef = useRef(null);         // Bộ đếm giờ
    const isLongPress = useRef(false);     // Cờ đánh dấu: Có phải đang long press không?

    // Load danh sách (Giữ nguyên)
    const loadPlaylists = async () => {
        try {
            const res = await fetchPlaylistsAPI();
            setDbPlaylists(res.data);
        } catch (error) { console.error(error); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { loadPlaylists(); }, []);

    // --- LOGIC XỬ LÝ ẤN VÀ GIỮ (LONG PRESS) ---

    const handleStart = (playlist) => {
        // 1. Không cho xóa playlist mặc định 'Tất cả'
        if (playlist.id === 'tat-ca') return;

        isLongPress.current = false; // Reset cờ

        // 2. Bắt đầu đếm ngược 600ms (0.6 giây)
        timerRef.current = setTimeout(() => {
            isLongPress.current = true; // Đánh dấu là đã giữ lâu
            // Rung nhẹ điện thoại (Haptic Feedback) nếu trình duyệt hỗ trợ
            if (navigator.vibrate) navigator.vibrate(50);
            setPlaylistToDelete(playlist); // Hiện Modal xóa
        }, 600);
    };

    const handleEnd = () => {
        // Nếu thả tay ra thì hủy đếm giờ ngay
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
    };

    const handleClick = (playlist) => {
        // Nếu vừa mới Long Press xong -> KHÔNG chuyển trang
        if (isLongPress.current) return;

        // Nếu bấm nhanh bình thường -> Chuyển trang
        navigate(`/playlist/${playlist.id}`);
    };

    // --- LOGIC GỌI API XÓA ---
    const confirmDelete = async () => {
        if (!playlistToDelete) return;
        try {
            await deletePlaylistAPI(playlistToDelete.id);
            // Xóa thành công thì lọc bỏ khỏi danh sách ngay lập tức (đỡ phải gọi lại API)
            setDbPlaylists(prev => prev.filter(p => p.id !== playlistToDelete.id));
            setPlaylistToDelete(null); // Đóng modal
        } catch (error) {
            alert(error, 'Lỗi khi xóa playlist');
        }
    };

    // Danh sách hiển thị
    const defaultPlaylist = {
        id: 'tat-ca',
        name: 'Tất Cả Bài Hát',
        coverUrl: null,
        color: 'from-green-500 to-emerald-700'
    };
    const finalPlaylists = [defaultPlaylist, ...dbPlaylists];

    return (
        <div className="h-full px-4 pt-4 overflow-y-auto pb-20 scrollbar-hide select-none">
            <h2 className="text-lg font-bold text-white mb-4">Thư viện của bạn</h2>

            {isLoading ? (
                <div className="text-gray-400 text-sm animate-pulse">Đang tải danh sách...</div>
            ) : (
                <div className="grid grid-cols-2 gap-4">

                    {finalPlaylists.map((playlist) => (
                        <div
                            key={playlist.id}

                            // 👇 SỰ KIỆN CHUỘT (MÁY TÍNH)
                            onMouseDown={() => handleStart(playlist)}
                            onMouseUp={handleEnd}
                            onMouseLeave={handleEnd}

                            // 👇 SỰ KIỆN CẢM ỨNG (ĐIỆN THOẠI)
                            onTouchStart={() => handleStart(playlist)}
                            onTouchEnd={handleEnd}

                            // 👇 SỰ KIỆN CLICK (XỬ LÝ CHUYỂN TRANG)
                            onClick={() => handleClick(playlist)}

                            // Chặn menu chuột phải mặc định của trình duyệt
                            onContextMenu={(e) => e.preventDefault()}

                            className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-all duration-200 shadow-lg"
                        >
                            <div className={`w-full h-full bg-gradient-to-br ${playlist.color || 'from-gray-700 to-gray-900'} relative`}>
                                {playlist.coverUrl ? (
                                    <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FaMusic className="text-white/30 text-4xl group-hover:scale-110 transition-transform" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-10">
                                <p className="text-white font-bold text-sm truncate">{playlist.name}</p>
                            </div>
                        </div>
                    ))}

                    {/* Nút Tạo Playlist */}
                    <div
                        onClick={() => navigate('/create-playlist')}
                        className="aspect-square rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-gray-800/50 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2 group-hover:bg-green-500 transition-colors">
                            <FaPlus className="text-gray-400 group-hover:text-white" />
                        </div>
                        <span className="text-gray-400 text-xs font-bold group-hover:text-white">Tạo mới</span>
                    </div>
                </div>
            )}

            {/* --- MODAL XÁC NHẬN XÓA (Giao diện kính mờ) --- */}
            {playlistToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">

                        <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaTrash size={24} />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">Xóa Playlist?</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            Bạn có chắc muốn xóa playlist <strong className="text-white">"{playlistToDelete.name}"</strong> không?
                            <br />Hành động này không thể hoàn tác.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setPlaylistToDelete(null)}
                                className="flex-1 py-3 rounded-xl font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 transition"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 transition"
                            >
                                Xóa luôn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;