// src/pages/CreatePlaylist.jsx
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa'; // Icon tích xanh
import { useNavigate } from 'react-router-dom';
import { createPlaylistAPI } from '../api';
// 👇 1. Import danh sách ảnh
import { coverImages } from '../data/covers';

const CreatePlaylist = () => {
    const [name, setName] = useState('');

    // 👇 2. State lưu ảnh đang chọn (Mặc định chọn ảnh đầu tiên)
    const [selectedCover, setSelectedCover] = useState(coverImages[0]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const createSlug = (str) => {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        const slugId = createSlug(name);
        setIsSubmitting(true);

        try {
            await createPlaylistAPI({
                id: slugId,
                name: name,
                // 👇 3. Gửi ảnh người dùng ĐÃ CHỌN (không random nữa)
                coverUrl: selectedCover,
                color: 'from-purple-500 to-indigo-600'
            });

            alert('Tạo playlist thành công!');
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Lỗi khi tạo playlist (Có thể tên đã tồn tại)');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center p-6 overflow-y-auto scrollbar-hide">
            <div className="w-full max-w-md bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl my-auto">
                <h2 className="text-xl font-bold text-white mb-6 text-center">Tạo Playlist Mới</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Ô nhập tên */}
                    <div>
                        <label className="text-gray-400 text-xs font-bold ml-1 uppercase tracking-wider">Tên Playlist</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ví dụ: Nhạc Chill..."
                            className="w-full mt-2 bg-gray-800 text-white p-3 rounded-xl border border-gray-700 focus:border-green-500 focus:outline-none transition-colors"
                            autoFocus
                        />
                    </div>

                    {/* 👇 4. KHU VỰC CHỌN ẢNH BÌA */}
                    <div>
                        <label className="text-gray-400 text-xs font-bold ml-1 uppercase tracking-wider mb-2 block">Chọn ảnh bìa</label>

                        <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto p-1 scrollbar-hide">
                            {coverImages.map((img, index) => {
                                const isSelected = selectedCover === img;
                                return (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedCover(img)}
                                        className={`
                                    relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all
                                    ${isSelected ? 'ring-2 ring-green-500 scale-95 opacity-100' : 'opacity-60 hover:opacity-100 hover:scale-105'}
                                `}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />

                                        {/* Dấu tích xanh khi chọn */}
                                        {isSelected && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                <FaCheck className="text-green-500 text-xl font-bold" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Nút Submit */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 p-3 rounded-xl font-bold bg-gray-800 text-gray-400 hover:bg-gray-700 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!name || isSubmitting}
                            className={`flex-1 p-3 rounded-xl font-bold transition-all shadow-lg ${!name || isSubmitting
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-400 shadow-green-500/20'
                                }`}
                        >
                            {isSubmitting ? 'Đang tạo...' : 'Hoàn tất'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaylist;