import { useEffect, useState } from 'react';
import { FaArrowLeft, FaFolderPlus, FaMusic, FaPlay, FaRandom, FaTimes, FaTrash } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import SongList from '../components/SongList';
// Import API
import { addSongsToPlaylistAPI, fetchPlaylistsAPI } from '../api';

const PlaylistDetail = ({ state, actions }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [currentPlaylist, setCurrentPlaylist] = useState(null);
    const [allPlaylists, setAllPlaylists] = useState([]); // Dùng cho popup chọn playlist

    // --- STATE QUẢN LÝ CHỌN BÀI ---
    const [selectedIds, setSelectedIds] = useState([]);
    const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);

    // 1. Load thông tin Playlist khi vào trang
    useEffect(() => {
        const getPlaylistInfo = async () => {
            try {
                // Lấy danh sách tất cả playlist từ server về
                const res = await fetchPlaylistsAPI();
                setAllPlaylists(res.data);

                // Xử lý tìm playlist hiện tại
                if (id === 'tat-ca') {
                    setCurrentPlaylist({
                        id: 'tat-ca',
                        name: 'Tất Cả Bài Hát',
                        coverUrl: null,
                        color: 'from-green-500 to-emerald-700'
                    });
                } else {
                    const found = res.data.find(p => p.id === id);
                    if (found) {
                        setCurrentPlaylist(found);
                    } else {
                        // Nếu gõ ID linh tinh không tìm thấy -> Về trang chủ
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error("Lỗi tải playlist:", error);
            }
        };
        getPlaylistInfo();
    }, [id, navigate]);

    // 2. Lọc bài hát thuộc playlist này
    const displaySongs = state.songs.filter(song => {
        if (id === 'tat-ca') return true;

        // 1. Kiểm tra kiểu cũ (dành cho bài hát cũ)
        const matchOld = song.playlist === id;

        // 2. Kiểm tra kiểu mới (Mảng)
        // 👇 QUAN TRỌNG: Thêm dấu ? vào sau playlists
        // Nghĩa là: "Nếu có mảng playlists thì mới kiểm tra, không có thì thôi"
        const matchNew = song.playlists?.includes(id);

        return matchOld || matchNew;
    });

    // 3. Xử lý logic chọn bài (Checkbox)
    const handleToggleSelection = (songId) => {
        setSelectedIds(prev => {
            if (prev.includes(songId)) {
                return prev.filter(item => item !== songId); // Bỏ chọn
            }
            return [...prev, songId]; // Chọn thêm
        });
    };

    // 4. Gọi API thêm bài vào playlist khác
    const handleAddToPlaylist = async (targetPlaylistId) => {
        if (selectedIds.length === 0) return;

        try {
            await addSongsToPlaylistAPI({
                songIds: selectedIds,
                targetPlaylistId: targetPlaylistId
            });

            alert(`Đã thêm thành công!`);

            // 👇 THÊM DÒNG NÀY: Tải lại trang để cập nhật dữ liệu mới nhất từ Server
            window.location.reload();

        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra.');
        }
    };

    // --- RENDER ---

    // Nếu chưa tải xong thông tin playlist thì hiện Loading để tránh lỗi trắng trang
    if (!currentPlaylist) {
        return <div className="text-center mt-10 text-gray-400 animate-pulse">Đang tải thông tin...</div>;
    }

    return (
        <div className="h-full flex flex-col px-4 pt-2 relative overflow-y-auto scrollbar-hide">

            {/* --- HEADER: Back, Ảnh, Tên --- */}
            <div className="flex items-center gap-4 mb-6 mt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 bg-gray-800/80 rounded-full text-gray-300 hover:text-white transition backdrop-blur-md"
                >
                    <FaArrowLeft />
                </button>

                {/* Ảnh bìa Playlist */}
                <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg shrink-0">
                    {currentPlaylist.coverUrl ? (
                        <img src={currentPlaylist.coverUrl} className="w-full h-full object-cover" alt={currentPlaylist.name} />
                    ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${currentPlaylist.color || 'from-gray-700 to-gray-800'} flex items-center justify-center`}>
                            <FaMusic className="text-white/50" />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">{currentPlaylist.name}</h2>
                    <p className="text-xs text-gray-400">
                        {selectedIds.length > 0
                            ? <span className="text-green-400 font-bold">Đang chọn {selectedIds.length} bài</span>
                            : `${displaySongs.length} bài hát`
                        }
                    </p>
                </div>
            </div>

            {/* --- CÁC NÚT ĐIỀU KHIỂN (Phát / Ngẫu nhiên) --- */}
            <div className="flex gap-3 mb-4 shrink-0">
                <button
                    onClick={() => {
                        if (displaySongs.length > 0) {
                            actions.setIsShuffle(false);
                            actions.setCurrentSong(displaySongs[0]);
                            actions.setIsPlaying(true);
                        }
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 active:scale-95 transition-transform"
                >
                    <FaPlay size={12} /> Phát tất cả
                </button>

                <button
                    onClick={actions.handleShufflePlay}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 border border-gray-700 active:scale-95 transition-transform"
                >
                    <FaRandom size={12} /> Ngẫu nhiên
                </button>
            </div>

            {/* --- DANH SÁCH BÀI HÁT --- */}
            {displaySongs.length === 0 ? (
                <div className="text-center mt-10 text-gray-500">
                    <p>Chưa có bài hát nào trong playlist này.</p>
                </div>
            ) : (
                <SongList
                    songs={displaySongs}
                    currentSong={state.currentSong}
                    isPlaying={state.isPlaying}

                    // Logic Click: Nếu đang chọn bài thì click là chọn, ko thì phát nhạc
                    onSelect={(song) => {
                        if (selectedIds.length > 0) {
                            handleToggleSelection(song.id);
                        } else {
                            actions.setCurrentSong(song);
                            actions.setIsPlaying(true);
                        }
                    }}

                    // Props mới cho check box
                    selectedIds={selectedIds}
                    onToggleSelection={handleToggleSelection}
                    // Truyền cờ này xuống để SongList biết là đang có chọn hay không (để disable click play nếu cần)
                    isSelectionMode={selectedIds.length > 0}
                />
            )}

            {/* --- THANH CÔNG CỤ NỔI (Giao diện mới) --- */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-24 left-0 right-0 z-50 flex justify-center pointer-events-none">
                    {/* Container chính: Thêm pointer-events-auto để bấm được nút */}
                    <div className="pointer-events-auto bg-gray-900/90 backdrop-blur-xl border border-white/10 p-2 pl-5 rounded-2xl shadow-2xl shadow-black/50 flex items-center gap-4 animate-bounce-in mx-4 w-full max-w-md">

                        {/* Số lượng bài đã chọn */}
                        <div className="flex items-center gap-2 mr-auto">
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-xs font-bold text-black">
                                {selectedIds.length}
                            </div>
                            <span className="text-white font-medium text-sm">Đã chọn</span>
                        </div>

                        {/* Các nút hành động */}
                        <div className="flex items-center gap-1">
                            {/* Nút Xóa */}
                            <button
                                onClick={() => {
                                    if (window.confirm('Bạn muốn xóa các bài này?')) {
                                        // Logic xóa
                                    }
                                }}
                                className="p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl transition-all"
                                title="Xóa"
                            >
                                <FaTrash />
                            </button>

                            {/* Đường kẻ dọc ngăn cách */}
                            <div className="w-px h-8 bg-gray-700 mx-1"></div>

                            {/* Nút Thêm vào Playlist (Nổi bật nhất) */}
                            <button
                                onClick={() => setShowAddToPlaylistModal(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                            >
                                <FaFolderPlus />
                                <span className="text-sm">Thêm vào</span>
                            </button>

                            {/* Nút Hủy (Dấu X nhỏ gọn) */}
                            <button
                                onClick={() => setSelectedIds([])}
                                className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all ml-1"
                                title="Hủy chọn"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL (POPUP) CHỌN PLAYLIST --- */}
            {showAddToPlaylistModal && (
                <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden border border-gray-700 shadow-2xl animate-fade-in-up">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900">
                            <h3 className="font-bold text-white">Thêm vào Playlist</h3>
                            <button onClick={() => setShowAddToPlaylistModal(false)} className="p-2 hover:bg-gray-800 rounded-full">
                                <FaTimes className="text-gray-400" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                            {allPlaylists
                                .filter(p => p.id !== 'tat-ca') // Không thêm vào 'Tất cả'
                                .filter(p => p.id !== id)       // Không thêm vào chính playlist đang đứng (Optional)
                                .map(pl => (
                                    <div
                                        key={pl.id}
                                        onClick={() => handleAddToPlaylist(pl.id)}
                                        className="p-3 hover:bg-gray-700 rounded-xl cursor-pointer flex items-center gap-3 transition group"
                                    >
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pl.color} flex items-center justify-center shrink-0`}>
                                            {pl.coverUrl ? (
                                                <img src={pl.coverUrl} className="w-full h-full object-cover rounded-lg" alt="" />
                                            ) : (
                                                <FaMusic className="text-white/50" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium group-hover:text-green-400 transition">{pl.name}</p>
                                        </div>
                                        <FaFolderPlus className="text-gray-600 group-hover:text-white" />
                                    </div>
                                ))
                            }

                            {/* Nếu không còn playlist nào để chọn */}
                            {allPlaylists.filter(p => p.id !== 'tat-ca' && p.id !== id).length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Không có playlist nào khác.</p>
                                    <p className="text-xs mt-1">Hãy tạo thêm playlist mới nhé!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="h-32 shrink-0"></div>
        </div>
    );
};

export default PlaylistDetail;