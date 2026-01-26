// src/App.jsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import useMusicPlayer from './hooks/useMusicPlayer'; // Import Hook não bộ

// Components
import Navbar from './components/Navbar';
import PlayerControls from './components/PlayerControls';
import CreatePlaylist from './pages/CreatePlaylist';
import Home from './pages/Home';
import PlaylistDetail from './pages/PlaylistDetail';
import Upload from './pages/Upload';
function App() {
  // Gọi 1 dòng duy nhất để lấy toàn bộ logic
  const { state, actions, refs } = useMusicPlayer();

  return (
    <BrowserRouter>
      <div className="h-[100dvh] w-screen overflow-hidden bg-gray-950 text-white font-sans md:flex md:items-center md:justify-center md:p-4">
        <div className="w-full h-full md:h-[85vh] md:max-w-md bg-gray-900 md:rounded-3xl shadow-2xl overflow-hidden border-0 md:border border-gray-800 flex flex-col">

          {/* Header */}
          <div className="z-10 shrink-0">
            <Navbar />
          </div>

          {/* Body - Routes */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            <Routes>
              {/* Trang chủ: Hiện Grid Playlist */}
              <Route path="/" element={<Home />} />
              {/* Trang chi tiết: Hiện danh sách bài hát */}
              <Route path="/playlist/:id" element={<PlaylistDetail state={state} actions={actions} />} />
              <Route path="/upload" element={<Upload state={state} actions={actions} />} />
              <Route path="/create-playlist" element={<CreatePlaylist />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          {/* Footer - Player Controls */}
          {state.currentSong && (
            <div className="bg-gray-900/95 backdrop-blur-md border-t border-gray-800 p-3 shrink-0 md:pb-6">
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
                // eslint-disable-next-line react-hooks/refs
                ref={refs.audioRef}
                src={state.currentSong?.url}
                autoPlay={state.isPlaying}
                onTimeUpdate={actions.handleTimeUpdate}
                onLoadedMetadata={actions.handleLoadedMetadata}
                onEnded={actions.handleSongEnd}
              />
            </div>
          )}

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;