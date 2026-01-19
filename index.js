// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
// 1. Import Firebase Admin
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 2. Kết nối Firebase (Xử lý lỗi xuống dòng \n cho Render)
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Dòng dưới rất quan trọng để chạy được trên Render
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore(); // Khởi tạo Database

// Cấu hình Cloudinary (Giữ nguyên)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'music-app',
        resource_type: 'auto',
        allowed_formats: ['mp3', 'wav', 'm4a']
    }
});
const upload = multer({ storage: storage });

// --- CÁC API ĐÃ SỬA ĐỔI ---

// API 1: Upload nhạc (Lưu file lên Cloudinary -> Lưu info vào Firestore)
app.post('/upload', upload.single('musicFile'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('Vui lòng chọn file');

        const newSong = {
            name: req.file.originalname,
            url: req.file.path,
            createdAt: new Date().toISOString() // Lưu thời gian tạo
        };

        // Lưu vào Firestore (Collection tên là 'songs')
        const docRef = await db.collection('songs').add(newSong);

        // Trả về cho client (kèm ID vừa tạo từ Firestore)
        res.json({ id: docRef.id, ...newSong });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// API 2: Lấy danh sách nhạc (Lấy từ Firestore)
app.get('/songs', async (req, res) => {
    try {
        const snapshot = await db.collection('songs').orderBy('createdAt', 'desc').get();

        // Biến đổi dữ liệu Firestore thành mảng
        const list = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.json(list);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Middleware xử lý lỗi (Giữ nguyên từ bước trước)
app.use((err, req, res, next) => {
    console.error(JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Lỗi server', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Server Firestore đang chạy tại port ${PORT}`);
});