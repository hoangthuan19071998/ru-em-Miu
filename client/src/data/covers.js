// src/data/covers.js

// 👇 1. Dùng import.meta.glob để lấy tất cả ảnh trong folder assets/covers
// Dấu * nghĩa là lấy tất cả tên file
// { eager: true } nghĩa là import ngay lập tức (giống như import ... from ...)
const modules = import.meta.glob('../assets/covers/*.{png,jpg,jpeg,webp,svg}', { eager: true });

// 👇 2. Chuyển đổi dữ liệu thành mảng các đường dẫn ảnh
// Vite trả về dạng Object, ta cần lấy value.default để ra đường dẫn chuỗi
export const coverImages = Object.values(modules).map(module => module.default);

// Hàm lấy ảnh ngẫu nhiên (Giữ nguyên)
export const getRandomCover = () => {
    if (coverImages.length === 0) return null; // Tránh lỗi nếu không có ảnh
    const randomIndex = Math.floor(Math.random() * coverImages.length);
    return coverImages[randomIndex];
};