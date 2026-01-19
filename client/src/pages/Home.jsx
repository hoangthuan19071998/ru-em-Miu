// src/pages/Home.jsx
import { useState } from 'react';
import { FaFire, FaHeart, FaList } from 'react-icons/fa';
import SongList from '../components/SongList';

const Home = ({ state, actions }) => {
    // State cục bộ để biết đang xem tab nào: 'all' hoặc 'fav'
    const [activeTab, setActiveTab] = useState('all');

    // Logic lọc bài hát hiển thị
    const displayedSongs = activeTab === 'fav' ? state.favorites : state.songs;

    return (
        <div className="h-full flex flex-col px-4 pt-2">

            {/* --- PHẦN MỚI: THANH CHỌN PLAYLIST (TABS) --- */}
            <div className="flex gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {/* Nút 1: Tất cả */}
                <button
                    onClick={() => setActiveTab('all')}
                    className={`
            flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
            ${activeTab === 'all' ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
          `}
                >
                    <FaList /> Tất cả
                </button>

                {/* Nút 2: Yêu thích */}
                <button
                    onClick={() => setActiveTab('fav')}
                    className={`
            flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all
            ${activeTab === 'fav' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}
          `}
                >
                    <FaHeart /> Yêu thích ({state.favorites.length})
                </button>

                {/* Nút giả lập khác (cho đẹp) */}
                <button className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold bg-gray-800 text-gray-400 hover:bg-gray-700 opacity-50 cursor-not-allowed">
                    <FaFire /> Thịnh hành
                </button>
            </div>

            {/* Danh sách nhạc (Đã lọc) */}
            <SongList
                songs={displayedSongs} // Truyền danh sách đã lọc vào đây
                currentSong={state.currentSong}
                isPlaying={state.isPlaying}
                onSelect={actions.setCurrentSong}
                onPlayFirst={() => {
                    // Khi bấm Play All ở tab Fav, chỉ phát nhạc Fav
                    if (displayedSongs.length > 0) {
                        actions.setIsShuffle(false);
                        actions.setCurrentSong(displayedSongs[0]);
                        actions.setIsPlaying(true);
                    }
                }}
                onShufflePlay={actions.handleShufflePlay}

                // Truyền thêm props cho Tim
                favorites={state.favorites}
                onToggleFavorite={actions.toggleFavorite}
            />
        </div>
    );
};

export default Home;