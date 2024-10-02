import Header from './Header';
import Footer from './Footer.js';
import { FaBookOpen, FaHeart, FaShareAlt } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLanguageName } from '../locales/vi/vi.js';
export default function BookDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { book } = location.state || {};
    console.log(book);
    const bookInfo = book.volumeInfo;
    console.log(bookInfo);
    const handleAuthorClick = (author) => {
        navigate(`/author/${author}`);
    };
    const handleClickCategories = (category) => {
        navigate(`/category/${category}`);
    };
    const handleClickRead = (id) => {
        navigate(`/read/${id}`, { state: { book } });
    };
    return (
        book && (
            <div
                className="book-details from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black"
            >
                <Header />
                <div className="container mx-auto p-8">
                    <div className="flex gap-8">
                        {/* Book Image */}
                        <div className="w-1/3 flex justify-end pr-8 relative">
                            <img
                                src={
                                    bookInfo.imageLinks
                                        ? bookInfo.imageLinks.thumbnail
                                        : 'default-thumbnail.jpg'
                                }
                                alt="Book Cover"
                                className=" w-60 h-96 rounded-lg shadow-lg sticky top-8"
                            />
                        </div>

                        {/* Book Information */}
                        <div className="w-2/3">
                            <h1 className="text-4xl text-black dark:text-white font-bold mb-4">
                                {bookInfo.title}
                            </h1>
                            <div className="text-lg dark:text-gray-300 text-gray-500 mb-4">
                                <p>
                                    Tác giả:{' '}
                                    {bookInfo.authors &&
                                        bookInfo.authors.map(
                                            (author, index) => (
                                                <span
                                                    key={index}
                                                    className="text-black dark:text-white cursor-pointer"
                                                    onClick={() =>
                                                        handleAuthorClick(
                                                            author
                                                        )
                                                    }
                                                >
                                                    {author}
                                                    {index <
                                                    bookInfo.authors.length - 1
                                                        ? ', '
                                                        : ''}
                                                </span>
                                            )
                                        )}
                                </p>
                                <p>
                                    Thể loại:{' '}
                                    {bookInfo.categories &&
                                        bookInfo.categories.map(
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
                                                    {category}
                                                    {index <
                                                    bookInfo.categories.length -
                                                        1
                                                        ? ', '
                                                        : ''}
                                                </span>
                                            )
                                        )}
                                </p>
                                <p>
                                    Ngôn ngữ:{' '}
                                    <span className="text-black dark:text-white">
                                        {getLanguageName(bookInfo.language)}
                                    </span>
                                </p>
                                <p>
                                    Nhà xuất bản:{' '}
                                    {bookInfo.publisher && (
                                        <span className="text-black dark:text-white">
                                            {bookInfo.publisher}
                                        </span>
                                    )}
                                </p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 mb-4">
                                {/* Đọc sách Button */}
                                <button
                                    className="bg-green-500 text-black dark:text-white flex items-center gap-2 px-6 py-2 rounded-full hover:bg-green-600 transition"
                                    onClick={() => handleClickRead(book.id)}
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
                            <p className="mt-8 dark:text-gray-300 text-gray-500 w-3/4">
                                {bookInfo.description}
                            </p>
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
