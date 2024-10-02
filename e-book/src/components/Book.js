// Book.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
export default function Book({ book }) {
    const navigate = useNavigate();
    const { title, imageLinks } = book.volumeInfo;
    const thumbnail = imageLinks
        ? imageLinks.thumbnail
        : 'default-thumbnail.jpg';
    const handleClick = () => {
        console.log(book);
        navigate(`/book/${book.id}`, { state: { book } });
    };
    return (
        <div
            className="book flex flex-col items-center p-4 cursor-pointer"
            onClick={handleClick}
        >
            <img
                src={thumbnail}
                alt={title}
                className="w-52 h-80 mb-2 rounded-lg"
            />
            <h3 className="text-white text-lg">{title}</h3>
        </div>
    );
}
