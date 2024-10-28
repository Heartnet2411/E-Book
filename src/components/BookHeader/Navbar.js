// src/components/BookHeader/Navbar.js
import React from 'react';
import { IoMdSettings, IoIosListBox, IoMdSearch, ioMd } from 'react-icons/io';
import { MdFullscreen } from 'react-icons/md';
import { RiHeadphoneFill } from 'react-icons/ri';
import { useState } from 'react';
import { BsThreeDotsVertical, BsBookmarkPlusFill } from 'react-icons/bs';
const Navbar = ({ onBookmark, onSettings, onFullScreen, onControl,title,onSearch}) => {
     const [searchQuery, setSearchQuery] = useState('');
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch(searchQuery)

        }
    }
    return (
        <nav className="navbar flex justify-between bg-gray-900 text-white p-3">
            <div className="flex items-center">
                <IoMdSearch size={24} className="mr-4 hover:cursor-pointer" />
                <input
                        type="text"
                        className=" p-2 rounded-lg text-black h-8"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
            </div>
            <div className="flex items-center justify-center">
                <h1>{title}</h1>
            </div>
            <ul className="flex items-center space-x-6">
                <li>
                    {/* <RiHeadphoneFill size={24} className="hover:cursor-pointer"/> */}
                    <IoIosListBox size={24} className="hover:cursor-pointer" />
                </li>
                <li>
                    <BsBookmarkPlusFill
                        size={22}
                        onClick={onBookmark}
                        className="hover:cursor-pointer"
                    />
                </li>
                <li>
                    <IoMdSettings
                        size={24}
                        onClick={onSettings}
                        className="hover:cursor-pointer"
                    />
                </li>
                <li>
                    <MdFullscreen
                        size={26}
                        onClick={onFullScreen}
                        className="hover:cursor-pointer"
                    />
                </li>
                <li>
                    <BsThreeDotsVertical
                        size={20}
                        className="hover:cursor-pointer"
                        onClick={onControl}
                    />
                </li>
            </ul>
        </nav>
    );
};
export default Navbar;
