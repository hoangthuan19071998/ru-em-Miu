// src/components/UploadButton.jsx
import React from 'react';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

const UploadButton = ({ onUpload, isUploading }) => {
  return (
    <div className="mb-6">
      <label className={`
        flex items-center justify-center gap-3 w-full p-4 rounded-xl border-2 border-dashed
        cursor-pointer transition-all duration-300
        ${isUploading 
          ? 'bg-gray-700 border-gray-500 text-gray-400 cursor-not-allowed' 
          : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400 hover:bg-gray-750'}
      `}>
        {isUploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt size={24} />}
        <span className="font-semibold text-sm">
          {isUploading ? 'Đang tải lên...' : 'Tải file MP3 lên'}
        </span>
        <input 
          type="file" 
          accept="audio/mp3" 
          className="hidden" 
          onChange={onUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default UploadButton;