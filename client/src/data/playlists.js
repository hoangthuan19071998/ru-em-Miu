// Danh sách các Playlist cố định
import imgRuNgu from '../assets/nhac_ru_thumbnail.png';
import imgNhacTu from '../assets/nhac_tu_thumbnail.png';
import imgTatCa from '../assets/tat-ca.png';
// Bạn có thể thêm/bớt tùy ý tại đây
export const playlists = [
    {
        id: 'tat-ca',
        name: 'Tất Cả Bài Hát',
        coverUrl: imgTatCa,
        color: 'from-sky-500 to-emerald-600'
    },
    {
        id: 'nhac-ru-ngu',
        name: 'Ru Miu Ngủ',
        coverUrl: imgRuNgu,
        color: 'from-grey-500 to-blue-600' // Màu nền cho trang chủ
    },
    {
        id: 'nhac-tu',
        name: 'Nhạc tủ của Miu',
        coverUrl: imgNhacTu,
        color: 'from-orange-400 to-red-500'
    }
];