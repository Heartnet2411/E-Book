// Book.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import BookImage from '../assets/book.jpg';

const ImageWithFallback = ({ src, alt, fallbackSrc }) => {
    return (
        <img
            src={src}
            alt={alt}
            onError={(e) => {
                e.target.src = fallbackSrc; // Thay thế bằng hình ảnh mặc định
            }}
            className="w-52 h-80 mb-2 rounded-lg"
        />
    );
};

export default function Book({ book }) {
    const navigate = useNavigate();
    // const { title,formats } = book;
    // const thumbnail = formats["image/jpeg"];
    const handleClick = () => {
        console.log(book);
        if (book) {
            navigate(`/book/${book.bookId}`);
        }
    };

    return (
        <div
            className="book flex flex-col items-center p-4 cursor-pointer"
            onClick={handleClick}
        >
            <ImageWithFallback
                src={book.imageUrl} // Link hình ảnh bị lỗi
                alt="Example"
                fallbackSrc={BookImage} // Hình ảnh mặc định
            />
            <h3 className="text-black dark:text-white text-lg max-w-52 line-clamp-3">
                {book.bookName}
            </h3>
        </div>
    );
}
