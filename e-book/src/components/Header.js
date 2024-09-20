import React from 'react';
import { CiSearch } from 'react-icons/ci';
const Header = () => {
    return (
        <div
            className="w-full h-16 flex flex-row px-8 items-center  "
            style={{
                background:
                    'linear-gradient(0deg, #2b2738 0%, #2f2a3f 50%, #24202e 100%)',
            }}
        >
            <a>
                <img
                    src="..\..\TheBookLounge.png"
                    className=" w-16 cursor-pointer"
                />
            </a>
            <div className="grid grid-cols-4 gap-4 ml-56 items-center flex space-x-10 ">
                <div>
                    <a className="text-white text-xl">Sách điện tử</a>
                </div>
                <div>
                    <a className="text-white text-xl ">Sách nói</a>
                </div>
                <div>
                    <a className="text-white text-xl">Diễn đàn</a>
                </div>
                <div>
                    <a className="text-white text-xl">Podcast</a>
                </div>
            </div>
            <div className='pl-28 flex flex-row'>
            <CiSearch size={30} color='white' />
            <button className='text-black w-28 bg-blue-200 rounded-xl ml-9'>Đăng ký</button>
            <button className='text-white w-28 bg-blue-800 rounded-xl ml-9'>Đăng nhập</button>
            </div>
        </div>
    );
};

export default Header;
