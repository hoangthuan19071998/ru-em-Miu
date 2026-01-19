// src/App.jsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import useMusicPlayer from './hooks/useMusicPlayer'; // Import Hook não bộ

// Components
import Navbar from './components/Navbar';
import PlayerControls from './components/PlayerControls';
import Home from './pages/Home';
import Upload from './pages/Upload';

function App() {
  // Gọi 1 dòng duy nhất để lấy toàn bộ logic
  const { state, actions, refs } = useMusicPlayer();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white font-sans flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col h-[85vh]">

          {/* Header */}
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 pb-2 z-10">
            <h1 className="text-2xl font-bold text-center pt-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
              Nhạc Của Miu
            </h1>
            <Navbar />
          </div>

          {/* Body - Routes */}
          <div className="flex-1 overflow-hidden relative">
            <Routes>
              {/* Truyền state và actions xuống trang con */}
              <Route path="/" element={<Home state={state} actions={actions} />} />
              <Route path="/upload" element={<Upload state={state} actions={actions} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* Footer - Player Controls */}
          <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-6">
            <PlayerControls
              isPlaying={state.isPlaying}
              onPlayPause={actions.handlePlayPause}
              onNext={actions.handleNext}
              onPrev={actions.handlePrev}
              isShuffle={state.isShuffle}
              toggleShuffle={() => actions.setIsShuffle(!state.isShuffle)}
              currentSong={state.currentSong}
              currentTime={state.currentTime}
              duration={state.duration}
              onSeek={actions.handleSeek}
              isRepeat={state.isRepeat}
              toggleRepeat={() => actions.setIsRepeat(!state.isRepeat)}
            />

            {/* Thẻ Audio ẩn - Vẫn nằm ở App để duy trì sự sống */}
            <audio
              ref={refs.audioRef}
              src={state.currentSong?.url}
              onTimeUpdate={actions.handleTimeUpdate}
              onLoadedMetadata={actions.handleLoadedMetadata}
              onEnded={actions.handleSongEnd}
            />
          </div>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;