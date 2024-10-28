import React, { useState } from 'react';
import Book from './Book';

const BookSearch = (books,searchTerm,loadingSearch,setLoadingSearch) => {
    console.log(books)
    return (
        <div className="popular px-8 mt-16 ">
        <div className="title text-black dark:text-white font-semibold text-6xl px-8 text-center">
            Kết quả tìm kiếm cho {books.searchTerm}
        </div>
        {loadingSearch ? (
                <div className="loading text-center mt-8 text-xl">Đang tải...</div>
            ) : (
            <div className="grid grid-cols-5 gap-4 mt-8">
                {books?.books?.length > 0 ? (
                    books.books.map((book, index) => (
                        <Book className="m-4"
                        book={book}
                        key={book.id}/>
                    ))
                ) : (
                    <p>Không tìm thấy cuốn sách nào</p>
                )}
            </div>
        )}
        </div>
    );
};

export default BookSearch;