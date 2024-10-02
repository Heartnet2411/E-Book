import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { ReactReader } from 'react-reader';
import { IoIosArrowBack } from 'react-icons/io';
import { getUrlReadBook } from '../config/config';

export default function BookViewer() {
    const navigate = useNavigate();
    const location = useLocation();
    const { book } = location.state || {};
    console.log(book);
    const bookInfo = book.volumeInfo;
    const handleGoBack = () => {
        navigate(-1);
    };
    const uri = getUrlReadBook(book.id);
    return (
        <div
            className="container mx-auto p-8"
            style={{
                background:
                    'linear-gradient(0deg, #2b2738 0%, #2f2a3f 50%, #24202e 100%)',
            }}
        >
            <div className="back-icon mb-8">
                <IoIosArrowBack
                    onClick={() => handleGoBack()}
                    className="cursor-pointer"
                    size={24}
                    color="white"
                />
            </div>
            <div className="flex gap-8 justify-center items-start">
                <div className="w-1/4 text-center">
                    {/* <img */}

                    <img
                        src={
                            bookInfo.imageLinks
                                ? bookInfo.imageLinks.thumbnail
                                : 'default-thumbnail.jpg'
                        }
                        alt="Book Cover"
                        className=" w-52 h-80 rounded-lg shadow-lg mx-auto"
                    />

                    <h1 className="text-2xl text-white font-bold mt-8">
                        {bookInfo.title}
                    </h1>
                    <h2 className="text-xl text-white mt-8">
                        {bookInfo.authors}
                    </h2>
                </div>
                <div className="w-3/4">
                    <iframe
                        src={uri}
                        width="1100"
                        height="720"
                        allowfullscreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
