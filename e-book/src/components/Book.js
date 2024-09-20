// Book.js
import React from 'react';

export default function Book({ book }) {
    const { title, imageLinks } = book.volumeInfo;
    const thumbnail = imageLinks ? imageLinks.thumbnail : 'default-thumbnail.jpg';

    return (
        <div className="book flex flex-col items-center p-4">
            <img src={thumbnail} alt={title} className="w-52 h-80 mb-2 rounded-lg" />
            <h3 className='text-white'>{title}</h3>
        </div>
    );
}