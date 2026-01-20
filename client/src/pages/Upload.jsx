// src/pages/Upload.jsx
import { useState } from 'react';
import { FaCloudUploadAlt, FaMusic, FaSpinner } from 'react-icons/fa';
import { playlists } from '../data/playlists';
const Upload = ({ state, actions }) => {
    const { isUploading } = state;
    const [selectedPlaylist, setSelectedPlaylist] = useState(playlists[0].id);

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">

            <div className="bg-gray-800/50 p-8 rounded-3xl border-2 border-dashed border-gray-700 w-full max-w-sm">
                {/* Icon đám mây sẽ nhảy múa khi đang upload */}
                <div className={`transition-transform duration-700 ${isUploading ? 'animate-bounce' : ''}`}>
                    <FaCloudUploadAlt className={`text-6xl mx-auto mb-4 ${isUploading ? 'text-green-400' : 'text-blue-500'}`} />
                </div>

                <h2 className="text-xl font-bold mb-2">
                    {isUploading ? 'Đang xử lý...' : 'Upload nhạc mới'}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                    {isUploading ? 'Vui lòng không tắt trình duyệt' : 'Chọn playlist và file nhạc của bạn'}
                </p>

                {/* 1. MENU CHỌN PLAYLIST */}
                <div className="mb-4 text-left">
                    <label className="text-xs text-gray-400 font-bold ml-2">Chọn Playlist:</label>
                    <select
                        value={selectedPlaylist}
                        onChange={(e) => setSelectedPlaylist(e.target.value)}
                        className="w-full mt-1 bg-gray-900 border border-gray-700 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors cursor-pointer appearance-none"
                    >
                        {playlists.map(pl => (
                            <option key={pl.id} value={pl.id}>{pl.name}</option>
                        ))}
                    </select>
                </div>

                {/* --- 2. NÚT BẤM CÓ HOẠT ẢNH --- */}
                <label className={`
                            block w-full py-4 rounded-xl font-bold cursor-pointer transition-all select-none
                            ${isUploading
                        ? 'bg-gray-700 text-gray-300 cursor-not-allowed border border-gray-600' // Style khi đang up
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/30 text-white active:scale-95'} // Style bình thường
                        `}>

                    {isUploading ? (
                        // TRẠNG THÁI LOADING
                        <div className="flex items-center justify-center gap-3">
                            {/* animate-spin: Class của Tailwind làm icon tự xoay tròn */}
                            <FaSpinner className="animate-spin text-xl text-green-400" />
                            <span className="animate-pulse">Đang tải file lên...</span>
                        </div>
                    ) : (
                        // TRẠNG THÁI BÌNH THƯỜNG
                        <div className="flex items-center justify-center gap-2">
                            <FaMusic /> Chọn File MP3
                        </div>
                    )}

                    <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(e) => actions.handleFileUpload(e, selectedPlaylist)}
                    />
                </label>

            </div>
        </div>
    );
};

export default Upload;