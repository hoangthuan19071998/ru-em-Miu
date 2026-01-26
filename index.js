// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 5000;
const { FieldValue } = require('firebase-admin/firestore');

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

            const newSong = {
                name: req.body.name || req.file.originalname.replace(/\.[^/.]+$/, ""), // Cho phép đặt tên custom nếu muốn
                playlist: req.body.playlist || 'tat-ca',       // <--- LƯU PLAYLIST ID
                url: url,
                fileName: fileName,
                createdAt: new Date().toISOString()
            };

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

// API 3: Xóa bài hát
app.delete('/songs/:id', async (req, res) => {
    try {
        const songId = req.params.id;

        // 1. Lấy thông tin bài hát từ Firestore để biết tên file
        const docRef = db.collection('songs').doc(songId);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Không tìm thấy bài hát' });
        }

        const songData = doc.data();
        const fileName = songData.fileName; // Tên file mình đã lưu lúc upload

        // 2. Xóa file trên Firebase Storage (Nếu có tên file)
        if (fileName) {
            try {
                await bucket.file(fileName).delete();
                console.log(`Đã xóa file Storage: ${fileName}`);
            } catch (err) {
                console.warn("Lỗi xóa file Storage (có thể file không tồn tại):", err.message);
                // Vẫn tiếp tục xóa trong DB dù lỗi file
            }
        }

        // 3. Xóa dữ liệu trong Firestore
        await docRef.delete();

        res.json({ message: 'Đã xóa thành công', id: songId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 1. API Lấy danh sách Playlist
app.get('/playlists', async (req, res) => {
    try {
        const snapshot = await db.collection('playlists').get();
        const playlists = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json(playlists);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// 2. API Tạo Playlist mới (CẬP NHẬT)
app.post('/playlists', async (req, res) => {
    try {
        // Lấy ID từ client gửi lên (ví dụ: 'nhac-chill')
        // Nếu không có thì vẫn dùng logic cũ (tự sinh ngẫu nhiên)
        const customId = req.body.id;

        const newPlaylist = {
            name: req.body.name,
            color: req.body.color || 'from-gray-700 to-gray-900',
            coverUrl: req.body.coverUrl || '',
            createdAt: new Date().toISOString()
        };

        if (customId) {
            // CÁCH MỚI: Dùng ID đẹp do client gửi lên
            // .set() nghĩa là: "Tạo doc có ID này, nếu có rồi thì ghi đè"
            await db.collection('playlists').doc(customId).set(newPlaylist);
            res.json({ id: customId, ...newPlaylist });
        } else {
            // CÁCH CŨ: Để Firestore tự sinh ID loằng ngoằng
            const docRef = await db.collection('playlists').add(newPlaylist);
            res.json({ id: docRef.id, ...newPlaylist });
        }

    } catch (error) {
        res.status(500).send(error.message);
    }
});
// API: Thêm bài hát vào Playlist (Hỗ trợ 1 bài nhiều playlist)
app.put('/songs/add-to-playlist', async (req, res) => {
    const { songIds, targetPlaylistId } = req.body;

    try {
        const batch = db.batch();

        songIds.forEach(songId => {
            const docRef = db.collection('songs').doc(songId);

            // 👇 2. Dùng arrayUnion: Chỉ thêm vào nếu chưa có, không ghi đè dữ liệu cũ
            batch.update(docRef, {
                playlists: FieldValue.arrayUnion(targetPlaylistId)
            });
        });

        await batch.commit();
        res.json({ success: true });
    } catch (error) {
        // Nếu lỗi do document chưa có trường 'playlists', ta dùng set merge
        console.error(error);
        res.status(500).send(error.message);
    }
});

// API Xóa Playlist (CẬP NHẬT: Xóa cả tham chiếu trong bài hát)
app.delete('/playlists/:id', async (req, res) => {
    const { id } = req.params;

    // ⛔️ CHẶN: Không cho phép xóa playlist 'tat-ca' dưới mọi hình thức
    if (id === 'tat-ca') {
        return res.status(400).json({ error: 'Không thể xóa playlist mặc định' });
    }

    try {
        const batch = db.batch();

        // BƯỚC 1: Xóa document Playlist
        const playlistRef = db.collection('playlists').doc(id);
        batch.delete(playlistRef);

        // BƯỚC 2: Tìm tất cả bài hát đang nằm trong playlist này
        const songsSnapshot = await db.collection('songs')
            .where('playlists', 'array-contains', id) // Tìm bài có chứa ID này trong mảng
            .get();

        // BƯỚC 3: Xóa ID playlist khỏi mảng 'playlists' của từng bài hát
        songsSnapshot.docs.forEach(doc => {
            const songRef = db.collection('songs').doc(doc.id);
            batch.update(songRef, {
                // arrayRemove: Chỉ xóa đúng cái ID này ra khỏi mảng, giữ nguyên các playlist khác
                playlists: FieldValue.arrayRemove(id)
            });
        });

        // BƯỚC 4: Thực thi tất cả cùng lúc
        await batch.commit();

        res.json({
            success: true,
            message: `Đã xóa playlist và cập nhật ${songsSnapshot.size} bài hát liên quan.`
        });

    } catch (error) {
        console.error("Lỗi khi xóa playlist:", error);
        res.status(500).send(error.message);
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