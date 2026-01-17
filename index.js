// server/index.js
require('dotenv').config(); // Nạp biến môi trường từ file .env
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Cấu hình nơi lưu trữ (Storage) là Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'music-app',         // Tên thư mục trên Cloudinary
        resource_type: 'auto',       // Tự động nhận diện (âm thanh/video/ảnh)
        allowed_formats: ['mp3', 'wav', 'm4a']
    }
});

const upload = multer({ storage: storage });

// Biến lưu danh sách bài hát (vẫn lưu tạm trong RAM)
// *Gợi ý: Sau này bạn nên nâng cấp thêm MongoDB để lưu danh sách này vĩnh viễn
let songs = [];

// API 1: Upload nhạc lên Cloudinary
app.post('/upload', upload.single('musicFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Vui lòng chọn file');
    }

    // Cloudinary sẽ trả về đường dẫn file trong req.file.path
    const newSong = {
        id: Date.now(),
        name: req.file.originalname, 
        url: req.file.path // <-- Đây là link online trực tiếp từ Cloudinary
    };
    
    songs.push(newSong);
    res.json(newSong);
});

// API 2: Lấy danh sách nhạc
app.get('/songs', (req, res) => {
    res.json(songs);
});

app.listen(PORT, () => {
    console.log(`Server Cloudinary đang chạy tại port ${PORT}`);
});