// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Cấu hình Firebase
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // Xử lý xuống dòng cho Private Key
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : undefined,
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Quan trọng: Khai báo Bucket Storage
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const db = admin.firestore();
const bucket = admin.storage().bucket(); // Lấy reference tới thùng chứa file

// 2. Cấu hình Multer (Lưu file vào RAM tạm thời)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // Giới hạn 10MB
});

// --- API ---

// API Upload: Node.js nhận file -> Gửi sang Firebase Storage -> Lấy Link
app.post('/upload', upload.single('musicFile'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).send('Vui lòng chọn file');

        // Tạo tên file duy nhất để tránh trùng
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const fileUpload = bucket.file(fileName);

        // Tạo luồng ghi file (Stream) lên Firebase Storage
        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: req.file.mimetype // set kiểu file là audio/mp3...
            }
        });

        blobStream.on('error', (error) => {
            console.error('Lỗi upload Storage:', error);
            res.status(500).json({ error: error.message });
        });

        blobStream.on('finish', async () => {
            // File đã lên Storage xong. Giờ lấy đường dẫn Public.

            // Cách 1: Lấy Signed URL (có hạn dùng rất lâu, ví dụ 100 năm)
            const [url] = await fileUpload.getSignedUrl({
                action: 'read',
                expires: '03-09-2100' // Hết hạn vào năm 2100 :D
            });

            // Tạo data để lưu vào Firestore
            const newSong = {
                name: req.file.originalname,
                url: url, // Link từ Firebase Storage
                fileName: fileName, // Lưu tên file để sau này xóa nếu cần
                createdAt: new Date().toISOString()
            };

            // Lưu vào Firestore
            const docRef = await db.collection('songs').add(newSong);

            res.json({ id: docRef.id, ...newSong });
        });

        // Bắt đầu đẩy dữ liệu từ RAM lên Storage
        blobStream.end(req.file.buffer);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/songs', async (req, res) => {
    try {
        const snapshot = await db.collection('songs').orderBy('createdAt', 'desc').get();
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

// Log lỗi chi tiết
app.use((err, req, res, next) => {
    console.error(JSON.stringify(err, null, 2));
    res.status(500).json({ error: 'Lỗi server', details: err.message });
});

app.listen(PORT, () => {
    console.log(`Server Firebase Fullstack đang chạy tại port ${PORT}`);
});