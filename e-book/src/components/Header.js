import React, { useEffect, useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { Link } from 'react-router-dom';
const Header = ({ user }) => {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        setCurrentUser(user);
        console.log(user);
    }, [user]);

    return (
        <div
            className="w-full h-16 flex items-center  justify-between px-20 shadow-md"
            style={{
                background: 'linear-gradient(0deg, #2b2738 0%, #24202e 100%)',
            }}
        >
            <Link to={'/#'}>
                <img src="..\..\logo512.png" className=" w-24 cursor-pointer" />
            </Link>
            <div className="items-center flex space-x-10 flex-1 justify-center">
                <div>
                    <Link to={'/'} className="text-white text-xl font-medium">
                        Sách điện tử
                    </Link>
                </div>
                <div>
                    <Link to={'/'} className="text-white text-xl font-medium">
                        Sách nói
                    </Link>
                </div>
                <div>
                    <Link to={'/'} className="text-white text-xl font-medium">
                        Diễn đàn
                    </Link>
                </div>
                <div>
                    <Link to={'/'} className="text-white text-xl font-medium">
                        Podcast
                    </Link>
                </div>
            </div>
            <div className="flex">
                <IoSearch size={30} color="white" />
                {currentUser ? (
                    <div className="text-white ml-6">Xin chào</div>
                ) : (
                    <div className="flex">
                        <Link to={'/register'}>
                            <button className="text-black bg-blue-100 rounded-xl ml-6 font-medium py-1 px-6">
                                Đăng ký
                            </button>
                        </Link>
                        <Link to={'/login'}>
                            <button className="text-white bg-blue-600 rounded-xl ml-6 font-medium py-1 px-4">
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
