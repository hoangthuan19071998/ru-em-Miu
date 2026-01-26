// src/api/index.js
import axios from 'axios';

// 1. Khởi tạo Axios với Base URL lấy từ file .env
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// 2. Định nghĩa các hàm gọi API

// Lấy danh sách bài hát
export const fetchSongsAPI = () => API.get('/songs');

// Upload bài hát (cần header multipart)
export const uploadSongAPI = (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
});

// Xóa bài hát
export const deleteSongAPI = (id) => API.delete(`/songs/${id}`);

export const fetchPlaylistsAPI = () => API.get('/playlists');
export const createPlaylistAPI = (data) => API.post('/playlists', data);
export const addSongsToPlaylistAPI = (data) => API.put('/songs/add-to-playlist', data);
export const deleteSongsAPI = (ids) => API.post('/songs/delete-bulk', { ids }); // Bạn cần làm thêm API xóa nhiều bài bên server nếu muốn
export const deletePlaylistAPI = (id) => API.delete(`/playlists/${id}`);