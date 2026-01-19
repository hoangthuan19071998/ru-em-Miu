// src/hooks/useMusicPlayer.js
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const useMusicPlayer = () => {
    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // State thời gian
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioRef = useRef(null);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('my_favorites');
        return saved ? JSON.parse(saved) : [];
    });
    // Lấy danh sách nhạc khi load
    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        try {
            // Nhớ thay bằng link Render của bạn nếu đã deploy
            const res = await axios.get('https://ru-em-miu.onrender.com/songs');
            setSongs(res.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách:", error);
        }
    };

    // Logic Audio
    useEffect(() => {
        if (currentSong && audioRef.current) {
            audioRef.current.load();
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error("Lỗi phát:", err));
        }
    }, [currentSong]);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('musicFile', file);

        try {
            // Thay link Render của bạn vào đây
            const res = await axios.post('https://ru-em-miu.onrender.com/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSongs(prev => [...prev, res.data]);
            alert("Upload thành công!");
        } catch (error) {
            console.error(error);
            alert("Upload thất bại! Kiểm tra lại file hoặc server.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleNext = () => {
        if (songs.length === 0) return;
        if (isShuffle) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songs.length);
            } while (songs.length > 1 && songs[randomIndex].id === currentSong?.id);
            setCurrentSong(songs[randomIndex]);
        } else {
            const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
            const nextIndex = (currentIndex + 1) % songs.length;
            setCurrentSong(songs[nextIndex]);
        }
    };

    const handlePrev = () => {
        if (songs.length === 0) return;
        const currentIndex = songs.findIndex(s => s.id === currentSong?.id);
        const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
        setCurrentSong(songs[prevIndex]);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handlePlayFirst = () => {
        if (songs.length > 0) {
            setIsShuffle(false);
            setCurrentSong(songs[0]);
            setIsPlaying(true);
        }
    };

    const handleShufflePlay = () => {
        if (songs.length > 0) {
            setIsShuffle(true);
            const randomIndex = Math.floor(Math.random() * songs.length);
            setCurrentSong(songs[randomIndex]);
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleSeek = (newTime) => {
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const handleSongEnd = () => {
        if (isRepeat) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }
        } else {
            handleNext();
        }
    };

    // 2. THÊM HÀM THẢ TIM / BỎ TIM
    const toggleFavorite = (song) => {
        let newFavorites;
        const exists = favorites.find(s => s.id === song.id);

        if (exists) {
            // Nếu đã có -> Xóa khỏi danh sách
            newFavorites = favorites.filter(s => s.id !== song.id);
        } else {
            // Nếu chưa có -> Thêm vào
            newFavorites = [...favorites, song];
        }

        setFavorites(newFavorites);
        localStorage.setItem('my_favorites', JSON.stringify(newFavorites)); // Lưu vào trình duyệt
    };

    // Trả về mọi thứ cần thiết cho giao diện
    return {
        state: {
            songs, currentSong, isPlaying, isShuffle, isRepeat, isUploading, currentTime, duration, favorites,
        },
        actions: {
            setCurrentSong, setIsPlaying, setIsShuffle, setIsRepeat,
            handleFileUpload, handleNext, handlePrev, handlePlayPause,
            handlePlayFirst, handleShufflePlay, handleSeek,
            handleTimeUpdate, handleLoadedMetadata, handleSongEnd, toggleFavorite
        },
        refs: {
            audioRef
        }
    };
};

export default useMusicPlayer;