import React, { useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import Switch from 'react-switch';
import { FaCheckCircle,FaCheck } from 'react-icons/fa';
import { IoMdCheckmark } from "react-icons/io";
const SettingModal = ({
    onClose,
    isScrollMode,
    setIsScrollMode,
    selectedColor,
    setSelectedColor,
    size,
    setSize,
    selectedFont,
    setSelectedFont,
}) => {
    const handleFontChange = (font) => {
        setSelectedFont(font);
    };
    const handleScrollPageChange = (checked) => {
        setIsScrollMode(checked);
    };
    const handlebBackgroundChange = (color) => {
        setSelectedColor(color);
    };
    const handleChangeSize = (newSize) => {
        setSize(newSize);
    };
    return (
        <div className="bg-gray-900 text-white p-4 rounded-lg w-64">
            <div className="flex flex-cols border-b-2">
                <IoCloseSharp
                    className="cursor-pointer"
                    size={24}
                    onClick={onClose}
                />
                <h2 className="text-lg font-bold mb-4 text-center flex-grow">
                    Cài đặt
                </h2>
            </div>
            <div className="m-2">
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Nền</h2>
                    <div className="flex space-x-2 mt-2">
                        <div
                            className="w-8 h-8 bg-white rounded-full"
                            onClick={() => handlebBackgroundChange('light')}
                        >
                            {selectedColor === 'light' && (
                                <FaCheckCircle
                                    className="ml-5"
                                    size={15}
                                    color="green"
                                />
                            )}
                        </div>
                        <div
                            className="w-8 h-8 bg-black rounded-full"
                            onClick={() => handlebBackgroundChange('dark')}
                        >
                            {selectedColor === 'dark' && (
                                <FaCheckCircle
                                    className="ml-5"
                                    size={15}
                                    color="green"
                                />
                            )}
                        </div>
                        <div
                            className="w-8 h-8 bg-[#d4c69f] rounded-full"
                            onClick={() => handlebBackgroundChange('amber')}
                        >
                            {selectedColor === 'amber' && (
                                <FaCheckCircle
                                    className="ml-5"
                                    size={15}
                                    color="green"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Cuộn dọc trang</h2>
                    <div className="mt-2">
                        <Switch
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={isScrollMode}
                            onChange={handleScrollPageChange}
                        />
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-semibold">Cỡ và kiểu chữ</h2>
                    <div className="flex space-x-2 mt-2">
                        <button
                            onClick={() => {
                                handleChangeSize(Math.max(80, size - 10));
                            }}
                            className="bg-gray-700 px-2 py-1 rounded"
                        >
                            A-
                        </button>
                        <span className='text-center mt-1'>{size}%</span>
                        <button
                            onClick={() => {
                                handleChangeSize(Math.min(150, size + 10));
                            }}
                            className="bg-gray-700 px-2 py-1 rounded"
                        >
                            A+
                        </button>
                    </div>
                    <ul className="mt-4 space-y-2">
                {['Arial', 'Times New Roman'].map((font) => (
                    <li
                        key={font}
                        className={`text-gray-200 p-1 flex justify-between items-center cursor-pointer ${selectedFont === font ? 'rounded-lg bg-gray-800' : ''}`}
                        onClick={() => handleFontChange(font)}
                    >
                        {font}
                        {selectedFont === font && <IoMdCheckmark size={20}  />}
                    </li>
                ))}
            </ul>
                </div>
                <div>
                    {/* <h2 className="text-lg font-semibold cursor-pointer">Bố cục trang</h2> */}
                </div>
            </div>
        </div>
    );
};

export default SettingModal;
