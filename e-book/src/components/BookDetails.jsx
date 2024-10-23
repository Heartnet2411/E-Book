import Header from './Header.js';
import Footer from './Footer.js';
import {
    FaBookOpen,
    FaShareAlt,
    FaRegBookmark,
    FaBookmark,
} from 'react-icons/fa';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getLanguageName } from '../locales/vi/vi.js';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import BookImage from '../assets/book.jpg';
import { storage } from '../utils/firebase.js';
import Notification from '../components/Notification';
import { useState, useEffect } from 'react';
import Comment from './BookComment.js';
import { toast, Bounce } from 'react-toastify';

import axios from 'axios';
import { url } from '../config/config.js';

export default function BookDetails() {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentUserId = user.userId;
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [myComments, setMyComments] = useState('');
    const [otherComments, setOtherComments] = useState('');
    const [comments, setComments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myCommentLimit, setMyCommentLimit] = useState(5);
    const [otherCommentLimit, setOtherCommentLimit] = useState(5);
    const [isSaved, setIsSaved] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!book) {
            fetchBook(id);
        }
    }, [id]);

    useEffect(() => {
        fetchComments();
        fetchIsBookSaved();
    }, [id]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8080/api/book/comments/${id}`
            );

            setComments(response.data);
            setMyComments(
                response.data.filter(
                    (comment) => comment.userId === currentUserId
                )
            );
            setOtherComments(
                response.data.filter(
                    (comment) => comment.userId !== currentUserId
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

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

    const fetchIsBookSaved = async () => {
        try {
            const response = await axios.get(
                url + `/book/saved/is-book-saved/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`, // Hoặc cách nào khác để lấy token
                    },
                }
            );
            console.log(response.data.isSaved);
            setIsSaved(response.data.isSaved);
        } catch (err) {
            console.log(err);
        }
    };

    const handleClickRead = async (id) => {
        try {
            navigate(`/reader/${id}`);
        } catch (error) {
            console.error('Lỗi khi tải sách:', error);
        }
    };

    const handleClickCategories = () => {};

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const truncatedDescription = book?.description.substring(0, 542) + '...';
    if (loading) {
        return <div>Loading...</div>;
    }

    const handleCommentSubmit = async () => {
        console.log('Rating:', rating);
        console.log('Comment:', comment);

        if (isSubmitting) {
            // Nếu đang gửi bình luận, không thực hiện hành động gì
            return;
        }
        setIsSubmitting(true);

        if (rating === 0) {
            setModalMessage('Vui lòng đánh giá sách trước khi bình luận.');
            setShowModal(true);
            return;
        } else if (comment === '') {
            setModalMessage('Vui lòng viết nội dung bình luận.');
            setShowModal(true);
            return;
        }

        try {
            await axios.post(
                'http://localhost:8080/api/book/comments',
                {
                    bookId: id,
                    rating: rating,
                    comment: comment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Gọi hàm fetchComments sau khi gửi thành công
            fetchComments();
            setModalMessage('Thêm bình luận thành công!');
            setShowModal(true);
        } catch (error) {
            console.error('Error submitting comment:', error);
            setModalMessage('Có lỗi xảy ra xin vui lòng thử lại sau');
            setShowModal(true);
        } finally {
            setComment('');
            setRating(0);
            setIsSubmitting(false); // Kết thúc quá trình gửi
        }
    };

    const handleLoadMoreMyComments = () => {
        setMyCommentLimit((prev) => prev + 5); // Tăng số lượng bình luận hiển thị
    };

    const handleLoadMoreOtherComments = () => {
        setOtherCommentLimit((prev) => prev + 5); // Tăng số lượng bình luận hiển thị
    };

    // Hàm fetch để lưu sách
    const saveBook = async () => {
        try {
            const response = await axios.post(
                url + '/book/saved/save-book',
                { bookId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Lưu sách thành công', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            setIsSaved(true);
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi lưu sách!', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
        }
    };

    // Hàm fetch để bỏ lưu sách
    const unsaveBook = async () => {
        try {
            const response = await axios.post(
                url + '/book/saved/unsave-book',
                { bookId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success('Bỏ lưu sách thành công', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
            setIsSaved(false);
        } catch (error) {
            console.error(error);
            toast.error('Có lỗi xảy ra khi bỏ lưu sách', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Bounce,
            });
        }
    };

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
                            <div className="text-lg dark:text-gray-300 text-gray-500 mb-4 font-medium">
                                <p>
                                    Tác giả:{' '}
                                    {book.author ? (
                                        <span className="text-black dark:text-white cursor-pointer">
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
                                <p>
                                    Năm xuất bản:{' '}
                                    <span className="text-black dark:text-white">
                                        {book.releaseDate.substring(0, 4)}
                                    </span>
                                </p>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center gap-4 mb-4">
                                {/* Đọc sách Button */}
                                <button
                                    className="bg-green-500 font-medium text-black dark:text-white flex items-center gap-2 px-6 py-2 rounded-full hover:bg-green-600 transition"
                                    onClick={() => handleClickRead(book.bookId)}
                                >
                                    <FaBookOpen size={24} /> Đọc sách
                                </button>

                                {/* Lưu sách Button */}
                                <button
                                    className="bg-gray-700  flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-500 cursor-pointer transition"
                                    onClick={isSaved ? unsaveBook : saveBook}
                                >
                                    {isSaved ? (
                                        <FaBookmark size={20} color="yellow" /> // Biểu tượng khi đã lưu
                                    ) : (
                                        <FaRegBookmark
                                            size={20}
                                            color="white"
                                        /> // Biểu tượng khi chưa lưu
                                    )}
                                </button>

                                {/* Chia sẻ Button */}
                                <button className="bg-gray-700 text-white flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-500 cursor-pointer transition">
                                    <FaShareAlt size={20} />
                                </button>
                            </div>
                            <div
                                className="mt-8 dark:text-gray-300 text-gray-600 w-3/4 font-medium text-base"
                                dangerouslySetInnerHTML={{
                                    __html: showFullDescription
                                        ? book.description
                                        : truncatedDescription,
                                }}
                            ></div>
                            {book.description.length > 542 && (
                                <button
                                    className="text-blue-400"
                                    onClick={toggleDescription}
                                >
                                    {showFullDescription
                                        ? 'Ẩn bớt'
                                        : 'Xem thêm'}
                                </button>
                            )}
                            {/* Reviews Section */}
                            {user ? (
                                <div className="my-4 p-4 border rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 w-3/4">
                                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-2">
                                        Bạn nghĩ sao về cuốn sách này?
                                    </h3>
                                    <div className="flex items-center mb-2">
                                        <label className="mr-2 text-gray-700 dark:text-white">
                                            Đánh giá:
                                        </label>
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    onClick={() =>
                                                        setRating(star)
                                                    }
                                                    className="text-2xl"
                                                >
                                                    {rating >= star ? (
                                                        <AiFillStar className="text-yellow-400" />
                                                    ) : (
                                                        <AiOutlineStar className="text-gray-400" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Nhập bình luận của bạn"
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        className="w-full px-4 py-2 border rounded-md shadow-sm border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                    />
                                    <button
                                        onClick={handleCommentSubmit}
                                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Gửi bình luận
                                    </button>
                                </div>
                            ) : null}

                            <div className="mt-8 w-3/4">
                                <h2 className="text-2xl font-bold mb-4">
                                    Độc giả nói gì về sách
                                </h2>
                                <div className="bg-gray-200 px-8 py-2 rounded-xl w-full">
                                    <div>
                                        {myComments.length > 0 && (
                                            <div>
                                                <h3 className="font-bold text-lg mt-2">
                                                    Bình luận của tôi
                                                </h3>
                                                {myComments
                                                    .slice(0, myCommentLimit)
                                                    .map((comment) => (
                                                        <Comment
                                                            key={
                                                                comment.commentId
                                                            }
                                                            comment={comment}
                                                            isCurrentUser={true}
                                                        />
                                                    ))}
                                                {myCommentLimit <
                                                    myComments.length && (
                                                    <button
                                                        onClick={
                                                            handleLoadMoreMyComments
                                                        }
                                                        className="text-blue-600 mb-2 -mt-2 font-medium"
                                                    >
                                                        Xem thêm
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {otherComments.length > 0 && (
                                            <div className="">
                                                <h3 className="font-bold text-lg">
                                                    Bình luận của độc giả khác
                                                </h3>
                                                {otherComments
                                                    .slice(0, otherCommentLimit)
                                                    .map((comment) => (
                                                        <Comment
                                                            key={
                                                                comment.commentId
                                                            }
                                                            comment={comment}
                                                            isCurrentUser={
                                                                false
                                                            }
                                                        />
                                                    ))}
                                                {otherCommentLimit <
                                                    otherComments.length && (
                                                    <button
                                                        onClick={
                                                            handleLoadMoreOtherComments
                                                        }
                                                        className="text-blue-600 mb-2 -mt-2 font-medium"
                                                    >
                                                        Xem thêm
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {myComments.length === 0 &&
                                            otherComments.length === 0 && (
                                                <p>Chưa có bình luận nào.</p>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Books Section */}

                    {/* Hiển thị modal nếu showModal là true */}
                    {showModal && (
                        <Notification
                            message={modalMessage}
                            onClose={() => setShowModal(false)}
                        />
                    )}

                    <Footer />
                </div>
            </div>
        )
    );
}
