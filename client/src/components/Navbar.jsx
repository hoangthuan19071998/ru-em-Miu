// src/components/Navbar.jsx
import { FaCloudUploadAlt, FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  // Class chung cho các nút icon
  const iconClass = ({ isActive }) => `
    p-3 rounded-full transition-all duration-300 flex items-center justify-center
    ${isActive
      ? 'text-green-400 bg-gray-800 shadow-md shadow-green-900/30'
      : 'text-gray-400 hover:text-white hover:bg-gray-800'}
  `;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-gray-800 to-gray-900 shadow-sm border-b border-gray-800/50">

      {/* 1. Bên Trái: Nút Home */}
      <NavLink to="/" className={iconClass} title="Trang chủ">
        <FaHome size={22} />
      </NavLink>

      {/* 2. Ở Giữa: Tiêu đề */}
      <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 tracking-wide">
        Nhạc Của Miu
      </h1>

      {/* 3. Bên Phải: Nút Upload */}
      <NavLink to="/upload" className={iconClass} title="Upload nhạc">
        <FaCloudUploadAlt size={22} />
      </NavLink>

    </div>
  );
};

export default Navbar;