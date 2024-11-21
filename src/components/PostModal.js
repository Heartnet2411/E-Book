import React, { useEffect, useState, useRef } from 'react';
import {
    FaRegBookmark,
    FaRegHeart,
    FaHeart,
    FaRegComment,
    FaTimes,
    FaBookmark,
} from 'react-icons/fa';
import { PiWarningOctagonBold } from 'react-icons/pi';
import { toast, Slide } from 'react-toastify';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';
import Comment from './Comment';
import ReportModal from './ReportModal';

function PostModal({ post, onClose }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [savedPost, setSavedPost] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const contentRef = useRef(null);
    const [comment, setCommnet] = useState('');
    const [comments, setCommnets] = useState([]);
    const [showPicker, setShowPicker] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null); // State lưu lý do đã chọn

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason); // Lưu lý do đã chọn vào state của Post
        console.log('Reason selected in Post component:', reason);
        closeReportModal();
    };

    const openReportModal = () => {
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
    };

    const onEmojiClick = (emoji) => {
        setCommnet((prevText) => prevText + emoji.emoji);
        setShowPicker(false); // Đóng picker sau khi chọn emoji
    };

    const maxHeight = 144;

    useEffect(() => {
        if (contentRef.current.scrollHeight > maxHeight) {
            setShowReadMore(true);
        }
    }, [post.content]);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    function showToast(type, message) {
        const options = {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Slide,
        };

        if (type === 'success') {
            toast.success(message, options);
        } else if (type === 'error') {
            toast.error(message, options);
        } else if (type === 'info') {
            toast.info(message, options);
        } else if (type === 'warning') {
            toast.warning(message, options);
        }
    }

    const savePostForUser = async (postId, token) => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/post/saved/save',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Bài viết đã được lưu:', data);
                showToast('success', 'Lưu bài viết thành công');
                setSavedPost(true);
            } else {
                showToast('error', 'Có lỗi xảy ra xin hãy thử lại sau');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showToast('error', 'Lỗi kết nối, vui lòng thử lại sau');
        }
    };

    async function fetchUnsavePost(postId, token) {
        try {
            const response = await fetch(
                'http://localhost:8080/api/post/saved/unsave',
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ postId }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Unsaved Post:', data);
                showToast('success', 'Bỏ lưu bài viết thành công');
                setSavedPost(false);
            } else {
                showToast('error', 'Có lỗi xảy ra xin hãy thử lại sau');
            }
        } catch (error) {
            console.error('Failed to unsave post:', error);
            showToast('error', 'Lỗi kết nối, vui lòng thử lại sau');
        }
    }

    async function fetchSavedPost(postId, token) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/post/saved/savedPosts/${postId}`,
                {
                    method: 'GET', // Chuyển phương thức thành GET
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} ${response.statusText}`
                );
            }

            const savedPost = await response.json();

            setSavedPost(savedPost.isSaved);
        } catch (error) {
            console.error('Failed to fetch saved post:', error);
        }
    }

    const addFavoritePost = async (postId, token) => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/post/favorite/add',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                showToast('success', 'Đã thêm vào danh sách yêu thích');
                setIsFavorite(true);
            } else {
                showToast('error', 'Có lỗi xảy ra xin hãy thử lại sau');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showToast('error', 'Lỗi kết nối, vui lòng thử lại sau');
        }
    };

    const removeFavoritePost = async (postId, token) => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/post/favorite/remove',
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ postId }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                showToast('success', 'Đã xóa khỏi danh sách yêu thích');
                setIsFavorite(false);
            } else {
                showToast('error', 'Có lỗi xảy ra xin hãy thử lại sau');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showToast('error', 'Lỗi kết nối, vui lòng thử lại sau');
        }
    };

    const fetchFavoritePost = async (postId, token) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/post/favorite/favoritePosts/${postId}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const favoritePost = await response.json();
                console.log('favorite', favoritePost);
                setIsFavorite(favoritePost.isFavorite);
            }
        } catch (error) {
            console.error('Failed to fetch favorite post:', error);
        }
    };

    const fetchPostComment = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/post/comment/${post.postId}`,
                {
                    method: 'GET',
                }
            );

            if (response.ok) {
                const comments = await response.json();
                setCommnets(comments);
            }
        } catch (error) {
            console.error('Failed to fetch comments post:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchSavedPost(post.postId, token);
        fetchFavoritePost(post.postId, token);
        fetchPostComment();
    }, [post.postId]);

    const handleSavePost = () => {
        const token = localStorage.getItem('token');
        savePostForUser(post.postId, token);
    };

    const handleRemoveSavePost = () => {
        const token = localStorage.getItem('token');
        fetchUnsavePost(post.postId, token);
    };

    const handleSaveFavoritePost = () => {
        const token = localStorage.getItem('token');
        addFavoritePost(post.postId, token);
    };

    const handleRemoveFavoritePost = () => {
        const token = localStorage.getItem('token');
        removeFavoritePost(post.postId, token);
    };

    const handleOutsideClick = (event) => {
        if (event.target.id === 'modal-overlay') {
            onClose(); // Đóng modal khi click ra ngoài modal
        }
    };

    const handleSendComment = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(
                'http://localhost:8080/api/post/comment',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: post.postId,
                        replyId: null,
                        content: comment,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                showToast('success', 'Thêm bình luận thành công');
                setCommnet('');
                fetchPostComment();
            } else {
                showToast('error', 'Có lỗi xảy ra khi thêm bình luận');
                setCommnet('');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showToast('error', 'Lỗi kết nối, vui lòng thử lại sau');
            setCommnet('');
        }
    };

    return (
        <div
            id="modal-overlay"
            onMouseDown={handleOutsideClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-3/5 px-8 min-h-[90vh] max-h-[90vh] overflow-scroll relative">
                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center ">
                        <img
                            src={post.user.avatar}
                            alt="Avatar"
                            className="w-11 h-11 rounded-full object-cover mr-4"
                        />
                        <span className="text-lg font-semibold dark:text-white">
                            {post.user.firstname + ' ' + post.user.lastname}
                        </span>
                    </div>
                    <div className="flex items-center">
                        {/* Đã lưu / Chưa lưu */}
                        {savedPost ? (
                            <button onClick={handleRemoveSavePost}>
                                <FaBookmark
                                    size={22}
                                    className="text-yellow-400"
                                />
                            </button>
                        ) : (
                            <button onClick={handleSavePost}>
                                <FaRegBookmark
                                    size={22}
                                    className="text-black dark:text-white"
                                />
                            </button>
                        )}
                        {/* Icon báo cáo */}
                        <button className="ml-4">
                            <PiWarningOctagonBold
                                size={26}
                                className="text-red-500"
                            />
                        </button>
                        <button
                            onClick={onClose}
                            className="ml-4 text-gray-700 dark:text-white"
                        >
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>
                <div className="my-4">
                    <div
                        ref={contentRef}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                        className={`transition-max-height duration-300 overflow-hidden dark:text-white ${
                            isExpanded ? 'max-h-full' : `max-h-36`
                        }`}
                        style={{
                            WebkitMaskImage:
                                !isExpanded && showReadMore
                                    ? 'linear-gradient(180deg, black 60%, transparent)'
                                    : 'none',
                        }}
                    />
                    {showReadMore && (
                        <button
                            onClick={toggleExpand}
                            className="text-blue-500 hover:underline mt-2"
                        >
                            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                    )}
                    {post.image && (
                        <img
                            src={post.image}
                            alt="user post"
                            className="h-60 my-3"
                        />
                    )}
                </div>
                <div className="flex pb-2 border-b">
                    {isFavorite ? (
                        <button
                            onClick={handleRemoveFavoritePost}
                            className="flex font-medium bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl cursor-pointer"
                        >
                            <FaHeart size={24} className="text-red-500" />
                            <span className="ml-2 dark:text-white">
                                Bỏ Thích
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSaveFavoritePost}
                            className="flex font-medium bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl cursor-pointer"
                        >
                            <FaRegHeart
                                size={24}
                                className="text-black dark:text-white"
                            />
                            <span className="ml-2 dark:text-white">Thích</span>
                        </button>
                    )}
                    <button className="flex font-medium bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl ml-4 cursor-pointer">
                        <FaRegComment
                            size={24}
                            className="text-black dark:text-white"
                        />
                        <span className="ml-2 dark:text-white">
                            Thêm bình luận
                        </span>
                    </button>
                </div>

                <div className="mt-2">
                    {comments.length > 0 ? (
                        comments.map((cmt) => (
                            <Comment
                                cmt={cmt}
                                postId={post.postId}
                                fetchPostComment={fetchPostComment}
                            />
                        ))
                    ) : (
                        <div className="pb-4 pt-2 text-inherit">
                            <em>Chưa có bình luận nào</em>
                        </div>
                    )}
                </div>

                <div className="flex w-full rounded-xl border border-gray-300 dark:border-gray-500 p-2 bg-gray-100 dark:bg-gray-800 items-center sticky -bottom-4">
                    <img
                        src={user.avatar}
                        className="w-12 h-12 rounded-full object-cover ml-4"
                    />
                    <div className="w-full">
                        <span className="text-lg font-semibold px-4 dark:text-white">
                            {user.firstName + ' ' + user.lastName}
                        </span>
                        <div className=" ">
                            <input
                                className="w-11/12 px-4 pb-2 pt-1 rounded-xl bg-gray-100 dark:bg-gray-800 dark:text-white focus:outline-none text-base "
                                placeholder="Thêm bình luận của bạn"
                                value={comment}
                                onChange={(e) => setCommnet(e.target.value)}
                            />
                            <button
                                onClick={handleSendComment}
                                className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-white"
                            >
                                <IoSend size={20} />
                            </button>
                            <button
                                className="absolute right-12 top-1/2 -translate-y-1/2 dark:text-white"
                                onClick={() => setShowPicker((val) => !val)}
                            >
                                <BsEmojiSmile size={20} />
                            </button>
                            {showPicker && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        zIndex: '1000',
                                        right: '0',
                                    }}
                                >
                                    <EmojiPicker onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hiển thị modal nếu isReportModalOpen là true */}
            {isReportModalOpen && (
                <ReportModal
                    onClose={closeReportModal}
                    onReasonSelect={handleReasonSelect} // Truyền hàm để nhận lý do đã chọn
                />
            )}
        </div>
    );
}

export default PostModal;
