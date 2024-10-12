import React, { useEffect, useState, useRef } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Header = ({ user, onClickSearch }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);
    useEffect(() => {
        setCurrentUser(user);
        console.log(user);
    }, [user]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef]);

    const handleSearchClick = () => {
        setShowSearch(true);
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onClickSearch(event.target.value);
            // setShowSearch(false);
        }
    };
    return (
        <div
            className="w-full h-16 flex items-center   justify-between px-20 shadow-lg bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-black"
        >
            <Link to={'/#'}>
                <img src="..\..\logo512.png" className=" w-24 cursor-pointer" />
            </Link>
            <div className="items-center flex space-x-10 flex-1 justify-center">
                <div>
                    <Link
                        to={'/'}
                        className="text-black hover:text-gray-500 dark:text-white dark:hover:text-gray-400 text-xl font-medium"
                    >
                        Sách điện tử
                    </Link>
                </div>
                <div>
                    <Link
                        to={'/'}
                        className="text-black hover:text-gray-500 dark:text-white dark:hover:text-gray-400 text-xl font-medium"
                    >
                        Sách nói
                    </Link>
                </div>
                <div>
                    <Link
                        to={'/'}
                        className="text-black hover:text-gray-500 dark:text-white dark:hover:text-gray-400 text-xl font-medium"
                    >
                        Diễn đàn
                    </Link>
                </div>
                <div>
                    <Link
                        to={'/'}
                        className="text-black hover:text-gray-500 dark:text-white dark:hover:text-gray-400 text-xl font-medium"
                    >
                        Podcast
                    </Link>
                </div>
            </div>
            <div className="flex">
            {showSearch && (
    <div ref={searchRef}>
        <input
            type="text"
            placeholder="Nhập từ khóa tìm kiếm"
            onKeyPress={handleKeyPress}
            className='mr-2 rounded-lg text-black h-8'
        />
    </div>
)}
                <IoSearch
                    size={30}
                    className="text-black dark:text-white cursor-pointer"
                    onClick={handleSearchClick}
                />
                
                
                
                
                
                
                
                
                
                

                <ThemeToggle />
                {currentUser ? (
                    <div className="text-white ml-6">Xin chào</div>
                ) : (
                    <div className="flex">
                        <Link to={'/register'}>
                            <button className="text-black bg-gray-100 hover:bg-gray-200 rounded-2xl ml-6 font-medium py-1 px-6">
                                Đăng ký
                            </button>
                        </Link>
                        <Link to={'/login'}>
                            <button className="text-white bg-blue-600 hover:bg-blue-700 rounded-2xl ml-6 font-medium py-1 px-4">
                                Đăng nhập
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
