import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

export default function BookmarkModal({ onClose, bookmarks, onJump }) {
    return (
        <div className="bg-gray-900 text-white rounded-lg w-72">
            <div className="">
                <IoCloseSharp
                    className="cursor-pointer"
                    size={24}
                    onClick={onClose}
                />
            </div>
            <div className="">
                {bookmarks.map((bookmark, index) => (
                    <div
                        key={index}
                        className="flex flex-cols mt-2 p-2 w-full hover:bg-gray-700 cursor-pointer"
                        onClick={() => onJump(bookmark)}
                    >
                        <h2>{bookmark.content}</h2>
                    </div>
                ))}
            </div>
            
        </div>
    );
}
