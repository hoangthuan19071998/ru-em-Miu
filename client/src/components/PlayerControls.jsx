// src/components/PlayerControls.jsx
import React from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo } from 'react-icons/fa';

// Hàm định dạng thời gian: giây -> mm:ss
const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const PlayerControls = ({
    isPlaying,
    onPlayPause,
    onNext,
    onPrev,
    isShuffle,
    toggleShuffle,
    currentSong,
    currentTime, // Nhận từ App
    duration,    // Nhận từ App
    onSeek,      // Nhận từ App
    isRepeat,
    toggleRepeat
}) => {
    return (
        <div className="mt-2 border-t border-gray-800 pt-4"> {/* Giảm margin top cũ đi một chút */}

            {/* Tên bài hát */}
            <div className="mb-4 text-center">
                <h3 className="text-white font-bold text-lg truncate px-4">
                    {currentSong ? currentSong.name : 'Chọn bài hát để bắt đầu'}
                </h3>
                <p className="text-green-500 text-xs font-medium uppercase tracking-wider mt-1">
                    {currentSong ? 'Now Playing' : 'Mp3 Player'}
                </p>
            </div>

            {/* --- PHẦN MỚI: THANH TUA (PROGRESS BAR) --- */}
            <div className="mb-6 flex items-center justify-between gap-3 text-xs text-gray-400 font-medium font-mono">
                {/* Thời gian hiện tại */}
                <span className="w-10 text-right">{formatTime(currentTime)}</span>

                {/* Thanh input range */}
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    disabled={!currentSong}
                    className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 transition-all"
                />

                {/* Tổng thời gian */}
                <span className="w-10 text-left">{formatTime(duration)}</span>
            </div>

            {/* Các nút điều khiển (Giữ nguyên) */}
            <div className="flex items-center justify-center gap-6">
                <button
                    onClick={toggleShuffle}
                    className={`p-2 rounded-full transition-colors ${isShuffle ? 'text-green-500' : 'text-gray-500 hover:text-white'}`}
                    title="Phát ngẫu nhiên"
                >
                    <FaRandom size={18} />
                </button>

                <button
                    onClick={onPrev}
                    className="text-gray-300 hover:text-white transition transform hover:-translate-x-1"
                    disabled={!currentSong}
                >
                    <FaStepBackward size={24} />
                </button>

                <button
                    onClick={onPlayPause}
                    disabled={!currentSong}
                    className={`
            w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-green-500/30 transition-transform hover:scale-110
            ${currentSong ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gray-600 cursor-not-allowed'}
          `}
                >
                    {isPlaying ? <FaPause /> : <FaPlay className="ml-1" />}
                </button>

                <button
                    onClick={onNext}
                    className="text-gray-300 hover:text-white transition transform hover:translate-x-1"
                    disabled={!currentSong}
                >
                    <FaStepForward size={24} />
                </button>

                <button
                    onClick={toggleRepeat}
                    className={`p-2 rounded-full transition-colors ${isRepeat ? 'text-green-500' : 'text-gray-500 hover:text-white'}`}
                    title="Lặp lại bài hiện tại"
                >
                    <FaRedo size={18} />
                </button>
            </div>
        </div>
    );
};

export default PlayerControls;