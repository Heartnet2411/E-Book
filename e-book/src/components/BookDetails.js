import Header from './Header';
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
                className="book-details"
                style={{
                    background:
                        'linear-gradient(0deg, #2b2738 0%, #2f2a3f 50%, #24202e 100%)',
                }}
            >
                <Header />
                <div className="container mx-auto p-8">
                    <div className="flex gap-8">
                        {/* Book Image */}
                        <div className="w-1/4 flex justify-center">
                            <img
                                src={
                                    bookInfo.imageLinks
                                        ? bookInfo.imageLinks.thumbnail
                                        : 'default-thumbnail.jpg'
                                }
                                alt="Book Cover"
                                className=" w-52 h-80 rounded-lg shadow-lg"
                            />
                        </div>

                        {/* Book Information */}
                        <div className="w-3/4">
                            <h1 className="text-4xl text-white font-bold mb-4">
                                {bookInfo.title}
                            </h1>
                            <div className="text-lg text-gray-400 mb-4">
                                <p>
                                    Tác giả:{' '}
                                    {bookInfo.authors &&
                                        bookInfo.authors.map(
                                            (author, index) => (
                                                <span
                                                    key={index}
                                                    className="text-white cursor-pointer"
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
                                                    className="text-white cursor-pointer"
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
                                    <span className="text-white">
                                        {getLanguageName(bookInfo.language)}
                                    </span>
                                </p>
                                <p>
                                    Nhà xuất bản:{' '}
                                    {bookInfo.publisher && (
                                        <span className="text-white">
                                            {bookInfo.publisher}
                                        </span>
                                    )}
                                </p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 mb-4">
                                {/* Đọc sách Button */}
                                <button
                                    className="bg-green-500 text-white flex items-center gap-2 px-6 py-2 rounded-full hover:bg-green-600 transition"
                                    onClick={() => handleClickRead(book.id)}
                                >
                                    <FaBookOpen /> Đọc sách
                                </button>

                                {/* Yêu thích Button */}
                                <button className="bg-gray-800 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition">
                                    <FaHeart />
                                </button>

                                {/* Chia sẻ Button */}
                                <button className="bg-gray-800 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-700 transition">
                                    <FaShareAlt />
                                </button>
                            </div>
                            <p className="mt-8 text-gray-300 w-3/4">
                                {bookInfo.description}
                            </p>
                            {/* Reviews Section */}
                            <div className="mt-8 w-3/4">
                                <h2 className="text-2xl text-white font-bold mb-4">
                                    Độc giả nói gì về sách
                                </h2>
                                <div className="bg-gray-800 p-4 rounded-xl">
                                    <div className="mb-4 text-white">
                                        <p className="font-bold ">Minp</p>
                                        <p>Cuốn này sẽ ra sách giấy ạ?</p>
                                    </div>
                                    <div className="mb-4 text-white">
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
                </div>
            </div>
        )
    );
}
