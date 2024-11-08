import React, { useEffect, useState, useRef } from 'react';
import {
    FaRegBookmark,
    FaRegHeart,
    FaHeart,
    FaRegComment,
} from 'react-icons/fa';
import { PiWarningOctagonBold } from 'react-icons/pi';
import { toast, Slide } from 'react-toastify';

function PostModal({ post, onClose }) {
    const [savedPost, setSavedPost] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const contentRef = useRef(null);

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchSavedPost(post.postId, token);
        fetchFavoritePost(post.postId, token);
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

    return (
        <div
            id="modal-overlay"
            onMouseDown={handleOutsideClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-11/12 md:w-3/4 lg:w-3/5 px-8 min-h-[90vh] overflow-scroll">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500"
                >
                    &times; {/* Icon đóng */}
                </button>
                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center">
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
                                <FaRegBookmark
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
                <div className="flex pb-2">
                    {isFavorite ? (
                        <button
                            onClick={handleRemoveFavoritePost}
                            className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl cursor-pointer"
                        >
                            <FaHeart size={24} className="text-red-500" />
                            <span className="ml-2 dark:text-white">
                                Bỏ Thích
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={handleSaveFavoritePost}
                            className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl cursor-pointer"
                        >
                            <FaRegHeart
                                size={24}
                                className="text-black dark:text-white"
                            />
                            <span className="ml-2 dark:text-white">Thích</span>
                        </button>
                    )}
                    <button className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl ml-4 cursor-pointer">
                        <FaRegComment
                            size={24}
                            className="text-black dark:text-white"
                        />
                        <span className="ml-2 dark:text-white">
                            Thêm bình luận
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostModal;