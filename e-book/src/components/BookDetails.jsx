import Header from './Header.js';
import Footer from './Footer.js';
import { FaBookOpen, FaHeart, FaShareAlt } from 'react-icons/fa';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getLanguageName } from '../locales/vi/vi.js';
import BookImage from '../assets/book.jpg';
import { storage } from '../utils/firebase.js';
import { useState, useEffect } from 'react';

import axios from 'axios';
import { url } from '../config/config.js';

export default function BookDetails() {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    console.log(book);
    useEffect(() => {
        if (!book) {
            fetchBook(id);
        }
    }, [id]);
    const fetchBook = async (id) => {
        try {
            const response = await axios.get(url + `/book/${id}`);
            console.log(response.data);
            setBook(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    const handleAuthorClick = (author) => {
        navigate(`/author/${author}`);
    };
    const handleClickCategories = (category) => {
        navigate(`/category/${category}`);
    };
    const handleClickRead = async (id) => {
        try {
            navigate(`/reader/${id}`);
        } catch (error) {
            console.error('Lỗi khi tải sách:', error);
        }
    };
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };
    const truncatedDescription = book?.description.substring(0, 542) + '...';
    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        book && (
            <div
                className="book-details from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black "
            >
                <Header user={user} />
                <div className="container mx-auto p-8 max-w-screen-2xl">
                    <div className="flex gap-8  ">
                        {/* Book Image */}
                        <div className="w-1/3 flex justify-end pr-8 relative ">
                            <img
                                src={book.imageUrl ? book.imageUrl : BookImage}
                                alt="Book Cover"
                                className=" w-60 h-96 rounded-lg shadow-lg sticky top-8"
                            />
                        </div>

                        {/* Book Information */}
                        <div className="w-2/3 ">
                            <h1 className="text-4xl text-black dark:text-white font-bold mb-4 mr-32 ">
                                {book.bookName}
                            </h1>
                            <div className="text-lg dark:text-gray-300 text-gray-500 mb-4">
                                <p>
                                    Tác giả:{' '}
                                    {book.author ? (
                                        <span
                                            className="text-black dark:text-white cursor-pointer"
                                            onClick={() =>
                                                handleAuthorClick(book.author)
                                            }
                                        >
                                            {book.author}
                                        </span>
                                    ) : (
                                        <span className="text-black dark:text-white">
                                            Không rõ
                                        </span>
                                    )}
                                </p>
                                <p>
                                    Thể loại:{' '}
                                    {book.categories &&
                                        book.categories.map(
                                            (category, index) => (
                                                <span
                                                    key={index}
                                                    className="text-black dark:text-white cursor-pointer"
                                                    onClick={() =>
                                                        handleClickCategories(
                                                            category
                                                        )
                                                    }
                                                >
                                                    {category.name}
                                                    {index <
                                                    book.categories.length - 1
                                                        ? ', '
                                                        : ''}
                                                </span>
                                            )
                                        )}
                                </p>
                                <p>
                                    Quốc gia:{' '}
                                    <span className="text-black dark:text-white">
                                        {book.country}
                                    </span>
                                </p>
                                <p>
                                    Nhà xuất bản:{' '}
                                    {book.publisher && (
                                        <span className="text-black dark:text-white">
                                            {book.publisher}
                                        </span>
                                    )}
                                </p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 mb-4">
                                {/* Đọc sách Button */}
                                <button
                                    className="bg-green-500 text-black dark:text-white flex items-center gap-2 px-6 py-2 rounded-full hover:bg-green-600 transition"
                                    onClick={() => handleClickRead(book.bookId)}
                                >
                                    <FaBookOpen /> Đọc sách
                                </button>

                                {/* Yêu thích Button */}
                                <button className="bg-gray-700 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition">
                                    <FaHeart />
                                </button>

                                {/* Chia sẻ Button */}
                                <button className="bg-gray-700 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition">
                                    <FaShareAlt />
                                </button>
                            </div>
                            <div
                                className="mt-8 dark:text-gray-300 text-gray-500 w-3/4"
                                dangerouslySetInnerHTML={{
                                    __html: showFullDescription
                                        ? book.description
                                        : truncatedDescription,
                                }}
                            ></div>
                            {book.description.length > 542 && (
                                <button
                                    className="text-blue-300"
                                    onClick={toggleDescription}
                                >
                                    {showFullDescription
                                        ? 'Ẩn bớt'
                                        : 'Xem thêm'}
                                </button>
                            )}
                            {/* Reviews Section */}
                            <div className="mt-8 w-3/4">
                                <h2 className="text-2xl text-black dark:text-white font-bold mb-4">
                                    Độc giả nói gì về sách
                                </h2>
                                <div className="dark:bg-gray-700 bg-gray-200 p-4 rounded-xl">
                                    <div className="mb-4 text-black dark:text-white">
                                        <p className="font-bold ">Minp</p>
                                        <p>Cuốn này sẽ ra sách giấy ạ?</p>
                                    </div>
                                    <div className="mb-4 text-black dark:text-white">
                                        <p className="font-bold">chik***</p>
                                        <p>
                                            Tình cảm cũng bị mù, chắc phải bỏ
                                            ngang quá!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Books Section */}

                    <Footer />
                </div>
            </div>
        )
    );
}
