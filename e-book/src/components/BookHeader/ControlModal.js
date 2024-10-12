import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { IoShareSocialSharp } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
const ControlModal = ({ onClose,epubUrl,onCopy }) => {
    return (
        <div className="bg-gray-900 text-white rounded-lg w-52">
            <div className="">
                <IoCloseSharp
                    className="cursor-pointer"
                    size={24}
                    onClick={onClose}
                />
            </div>
            <div
                className=""
            >
                    {/* <div className=" flex flex-cols p-2 mt-2 w-full hover:bg-gray-700"> */}
                    {/* <IoShareSocialSharp size={24} /> */}
                       {/* <h2 className='ml-3'>Chia sẻ</h2>  */}
                    {/* </div> */}
                    <a href={epubUrl}>
                    <div className="flex flex-cols mt-2 p-2 w-full hover:bg-gray-700 cursor-pointer">
                    <IoMdDownload size={24} />
                    
                    <h2 className='ml-3'>Tải về</h2>
                    </div>
                    </a>
                    <div onClick={onCopy} className="flex flex-cols mt-2 p-2 w-full hover:bg-gray-700 cursor-pointer">
                    <MdContentCopy size={24}/>
                    <h2 className='ml-3'>Sao chép liên kết</h2>
                    </div>
                </div>
            </div>
    );
};
export default ControlModal;
