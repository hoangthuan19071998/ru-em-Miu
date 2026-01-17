import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaCloudUploadAlt } from 'react-icons/fa';

const Navbar = () => {
  const linkClass = ({ isActive }) => 
    `flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
      isActive ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`;

  return (
    <nav className="flex justify-center gap-4 mb-6 p-2 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 mx-4 mt-4">
      <NavLink to="/" className={linkClass}>
        <FaHome /> Trang chủ
      </NavLink>
      <NavLink to="/upload" className={linkClass}>
        <FaCloudUploadAlt /> Upload nhạc
      </NavLink>
    </nav>
  );
};

export default Navbar;