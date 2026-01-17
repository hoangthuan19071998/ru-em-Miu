// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Import Components
import SongList from './components/SongList';
import PlayerControls from './components/PlayerControls';
import Navbar from './components/Navbar';
import UploadPage from './components/UploadPage';

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Lỗi phát:", err));
    }
  }, [currentSong]);

  const fetchSongs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/songs');
      setSongs(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('musicFile', file);

    try {
      const res = await axios.post('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSongs(prev => [...prev, res.data]);
      alert("Upload thành công!"); // Thông báo nhỏ
    } catch (error) {
      alert("Upload thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  // 1. Logic phát từ bài đầu tiên
  const handlePlayFirst = () => {
    if (songs.length > 0) {
      setIsShuffle(false); // Tắt shuffle để nghe theo thứ tự
      setCurrentSong(songs[0]);
      setIsPlaying(true);
    }
  };

  // 2. Logic phát ngẫu nhiên ngay lập tức
  const handleShufflePlay = () => {
    if (songs.length > 0) {
      setIsShuffle(true); // Bật chế độ shuffle
      const randomIndex = Math.floor(Math.random() * songs.length);
      setCurrentSong(songs[randomIndex]);
      setIsPlaying(true);
    }
  };

  // Logic Next/Prev/Shuffle (Giữ nguyên)
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
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Khi bài hát tải xong metadata, lấy tổng thời lượng
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Khi người dùng kéo thanh tua
  const handleSeek = (newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Khi hết bài, reset thời gian
  const handleSongEnd = () => {
    if (isRepeat) {
      // Nếu đang bật Repeat: Tua về 0 và phát lại
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      // Nếu không bật Repeat: Chuyển bài tiếp theo
      handleNext(); 
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center p-4">
        
        {/* Khung ứng dụng chính */}
        <div className="w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col h-[85vh]">
          
          {/* 1. Header & Menu */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 pb-2 z-10">
             <h1 className="text-2xl font-bold text-center pt-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
               My Music Space
             </h1>
             <Navbar />
          </div>

          {/* 2. Nội dung thay đổi theo trang (Router) */}
          <div className="flex-1 overflow-hidden relative">
            <Routes>
              {/* Trang chủ: Hiện danh sách nhạc */}
              <Route path="/" element={
                <div className="h-full flex flex-col px-4 pt-2">
                   {/* Truyền thêm 2 props mới vào SongList */}
                   <SongList 
                      songs={songs} 
                      currentSong={currentSong} 
                      isPlaying={isPlaying} 
                      onSelect={setCurrentSong}
                      onPlayFirst={handlePlayFirst}     // <-- Mới
                      onShufflePlay={handleShufflePlay} // <-- Mới
                    />
                </div>
              } />

              {/* Trang Upload: Hiện form upload */}
              <Route path="/upload" element={
                <UploadPage onUpload={handleFileUpload} isUploading={isUploading} />
              } />

              {/* Chuyển hướng các link lạ về trang chủ */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* 3. Player Controls (Luôn hiển thị ở dưới cùng) */}
          <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-6">
            <PlayerControls 
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onNext={handleNext}
              onPrev={handlePrev}
              isShuffle={isShuffle}
              toggleShuffle={() => setIsShuffle(!isShuffle)}
              currentSong={currentSong}
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              
              // 3. TRUYỀN PROPS MỚI XUỐNG
              isRepeat={isRepeat}
              toggleRepeat={() => setIsRepeat(!isRepeat)}
            />
            
            <audio 
              ref={audioRef} 
              src={currentSong?.url} 
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleSongEnd} // <--- Hàm này đã được cập nhật logic ở trên
            />
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;