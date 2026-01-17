import React from 'react';
import UploadButton from './UploadButton';

const UploadPage = ({ onUpload, isUploading }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-2">Thêm bài hát mới</h2>
      <p className="text-gray-400 mb-8 text-sm">Tải file MP3 lên server của bạn để bắt đầu nghe.</p>
      
      <div className="w-full max-w-xs">
        <UploadButton onUpload={onUpload} isUploading={isUploading} />
      </div>

      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg text-xs text-gray-500 border border-gray-700">
        <p>Hỗ trợ định dạng: .mp3</p>
        <p>Dung lượng tối đa: 10MB</p>
      </div>
    </div>
  );
};

export default UploadPage;