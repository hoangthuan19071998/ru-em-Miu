// Danh sách các Playlist cố định
import img1 from '../assets/covers/nhac_ru_thumbnail.png';
import img2 from '../assets/covers/nhac_tu_thumbnail.png';
import img3 from '../assets/covers/tat-ca.png';
// Bạn có thể thêm/bớt tùy ý tại đây
export const playlists = [
    {
        id: 'tat-ca',
        name: 'Tất Cả Bài Hát',
        coverUrl: img1,
        color: 'from-sky-500 to-emerald-600'
    },
    {
        id: 'nhac-ru-ngu',
        name: 'Ru Miu Ngủ',
        coverUrl: img2,
        color: 'from-grey-500 to-blue-600' // Màu nền cho trang chủ
    },
    {
        id: 'nhac-tu',
        name: 'Nhạc tủ của Miu',
        coverUrl: img3,
        color: 'from-orange-400 to-red-500'
    }
];