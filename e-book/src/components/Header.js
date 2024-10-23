import React, { useEffect, useState, useRef } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { CgMenu } from 'react-icons/cg';
import { IoLogOutOutline } from 'react-icons/io5';

const Header = ({ user }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');

        // Kiểm tra nếu refreshToken tồn tại
        if (refreshToken) {
            const response = await fetch(
                'http://localhost:8080/api/auth/refresh',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: refreshToken }),
                }
            );

            if (response.ok) {
                console.log('API called successfully with refresh token');
            } else {
                console.error('API call failed');
            }
        }

        // Xóa token và user khỏi localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken'); // Xóa refresh token nếu cần

        // Điều hướng về trang đăng nhập hoặc trang chủ
        navigate('/login');
    };

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
             dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-black "
        >
            <Link to={'/#'}>
                <img
                    src="..\..\logo512.png"
                    className=" w-24 cursor-pointer"
                    alt="logo"
                />
            </Link>
            <div className="items-center flex space-x-10 flex-1 justify-center h-16">
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
                        to={'/forum'}
                        className={`text-black h-16 hover:text-gray-500 dark:text-white dark:hover:text-gray-400 text-xl font-medium ${
                            location.pathname === '/forum'
                                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-600'
                                : ''
                        }`}
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
            <div className="flex items-center">
                <IoSearch size={30} className="text-black dark:text-white" />
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
                    <div
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="text-black dark:text-white ml-6 flex items-center relative cursor-pointer"
                    >
                        <img
                            src={user.avatar}
                            className="w-11 h-11 rounded-full object-cover"
                            alt="user avt"
                        />
                        <button className="px-2 py-1 bg-gray-200 dark:bg-gray-600 ml-2 rounded-lg">
                            <CgMenu
                                size={30}
                                className="text-black dark:text-white"
                            />
                        </button>

                        {isMenuOpen && (
                            <div className="z-50 origin-top-right absolute right-0 top-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 dark:bg-gray-800 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                                <div className="py-1" role="none">
                                    <Link
                                        to="/myaccount"
                                        className="text-gray-700 dark:text-gray-200 font-medium block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Tài khoản của tôi
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-700 dark:text-gray-200 font-medium block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Hỗ trợ
                                    </Link>
                                    <Link
                                        href="#"
                                        className="text-gray-700 dark:text-gray-200 font-medium block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        License
                                    </Link>
                                    <button
                                        href="#"
                                        onClick={() => handleLogout()}
                                        className="text-gray-700 w-full dark:text-gray-200 font-medium border-t flex justify-between items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <span>Đăng xuất</span>
                                        <IoLogOutOutline
                                            size={24}
                                            className="text-black dark:text-white"
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex">
                        <Link
                            to={'/register'}
                            className="text-black bg-gray-300 hover:bg-gray-400 rounded-2xl ml-6 font-medium py-1 px-6"
                        >
                            <button>Đăng ký</button>
                        </Link>
                        <Link
                            to={'/login'}
                            className="text-white bg-blue-600 hover:bg-blue-700 rounded-2xl ml-6 font-medium py-1 px-4"
                        >
                            <button>Đăng nhập</button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
