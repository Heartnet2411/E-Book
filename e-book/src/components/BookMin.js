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
            className="w-48 h-72 mb-2 rounded-lg"
        />
    );
};

export default function     BookMin({ book }) {
    const navigate = useNavigate();
    const { title,formats } = book;
    const thumbnail = formats["image/jpeg"];
    const handleClick = () => {
        console.log(book);
        navigate(`/book/${book.id}`, { state: { book } });
    };

    return (
        <div
            className="book flex flex-col items-center p-4 cursor-pointer"
            onClick={handleClick}
        >
            <ImageWithFallback
                src={thumbnail} // Link hình ảnh bị lỗi
                alt="Example"
                fallbackSrc={BookImage} // Hình ảnh mặc định
            />
            <h3 className="leading-6 text-black dark:text-white text-ellipsis text-lg max-h-14">{title}</h3>
        </div>
    );
}
