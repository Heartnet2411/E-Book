import React, { useEffect, useState, useRef } from 'react';
import { FaRegBookmark } from 'react-icons/fa6';
import { FaRegHeart, FaHeart, FaRegComment, FaBookmark } from 'react-icons/fa';
import { PiWarningOctagonBold } from 'react-icons/pi';
import { toast, Slide } from 'react-toastify';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';
import Comment from './Comment';
import ReportModal from './ReportModal';
import { url } from '../config/config';
import axios from 'axios';
import { formatDate } from '../utils/formatDate';

function Post({ post }) {
    const [savedPost, setSavedPost] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const contentRef = useRef(null);
    const commentRef = useRef(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const token = localStorage.getItem('token');
    const [showPicker, setShowPicker] = useState(false);
    const [comment, setCommnet] = useState('');
    const [comments, setCommnets] = useState([]);
    const [visibleComments, setVisibleComments] = useState(4); // Số lượng bình luận được hiển thị

    const commentClick = () => {
        commentRef.current.focus();
        commentRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    };

    const handleShowMore = () => {
        setVisibleComments((prev) => prev + 4); // Tăng số lượng bình luận hiển thị thêm 5
    };

    const onEmojiClick = (emoji) => {
        setCommnet((prevText) => prevText + emoji.emoji);
        setShowPicker(false); // Đóng picker sau khi chọn emoji
    };

    const openReportModal = (postId) => {
        setSelectedPostId(postId);
        setIsReportModalOpen(true);
    };
    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedPostId(null);
    };

    const maxHeight = 144; // Set desired max height in pixels (e.g., 160px for around max-h-40)

    useEffect(() => {
        if (contentRef.current.scrollHeight > maxHeight) {
            setShowReadMore(true);
        }
    }, []);

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const user = JSON.parse(localStorage.getItem('user'));

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
    const handleCreateReport = async (reason) => {
        if (!selectedPostId) return;

        try {
            const response = await axios.post(
                url + `/report/create`,
                {
                    targetType: 'post',
                    targetId: selectedPostId,
                    reason: reason,
                    userId: user?.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.status);
            if (response.status == 201) {
                // Kiểm tra xem phản hồi có thành công không
                toast.success('Báo cáo thành công!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                closeReportModal(); // Đóng modal sau khi báo cáo
            } else {
                toast.error('Bạn đã báo cáo bài viết này rồi', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                closeReportModal();
            }
        } catch (error) {
            console.error('Error creating report:', error);
            toast.error('Có lỗi xảy ra khi báo cáo!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };
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
            const response = await fetch(url + '/post/favorite/remove', {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

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
            key={post.postId}
            className="border-gray-200 border dark:border-gray-700 bg-white dark:bg-gray-900 dark:shadow-gray-800 dark:shadow-md shadow-md flex-col justify-between p-2 px-8 items-center rounded-lg mt-4 "
        >
            <div className="w-full border-b border-gray-300 dark:border-gray-700">
                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center">
                        <img
                            src={post.user.avatar}
                            alt="Avatar"
                            className="w-11 h-11 rounded-full object-cover mr-4"
                        />
                        <div>
                            <p className="text-lg font-semibold dark:text-white">
                                {post.user.firstname + ' ' + post.user.lastname}
                            </p>
                            <p className="dark:text-gray-500 text-gray-500">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="relative group">
                            {savedPost ? (
                                <div>
                                    <button
                                        onClick={() => handleRemoveSavePost()}
                                        className="cursor-pointer"
                                    >
                                        <FaBookmark
                                            size={22}
                                            className="text-base rounded-md text-yellow-400"
                                        />
                                    </button>
                                    <span className="absolute left-0 top-8 w-max p-2 bg-gray-800 dark:bg-gray-200 dark:text-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Bỏ lưu bài viết
                                    </span>
                                </div>
                            ) : (
                                <div>
                                    <button
                                        onClick={() => handleSavePost()}
                                        className="cursor-pointer"
                                    >
                                        <FaRegBookmark
                                            size={22}
                                            className="text-base rounded-md text-black dark:text-white"
                                        />
                                    </button>
                                    <span className="absolute left-0 top-8 w-max p-2 bg-gray-800 dark:bg-gray-200 dark:text-black text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Lưu bài viết
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="relative group">
                            {' '}
                            <button
                                onClick={() => {
                                    openReportModal(post.postId);
                                }}
                                className="cursor-pointer"
                            >
                                <PiWarningOctagonBold
                                    size={26}
                                    className="ml-4 text-base rounded-md text-red-500 "
                                />
                            </button>
                            <span className="absolute left-0 top-8 w-max p-2 bg-gray-800 text-white dark:bg-gray-200 dark:text-black text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Báo cáo bài viết
                            </span>
                        </div>
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
                    {post.image !== null ? (
                        <img
                            src={post.image}
                            alt="user post"
                            className="h-60 my-3"
                        />
                    ) : null}
                </div>
                <div className="flex pb-2">
                    {isFavorite ? (
                        <button
                            onClick={() => handleRemoveFavoritePost()}
                            className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl cursor-pointer"
                        >
                            <FaHeart
                                size={24}
                                className=" text-base rounded-md  text-red-500"
                            />
                            <span className="ml-2 dark:text-white">
                                Bỏ Thích
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={() => handleSaveFavoritePost()}
                            className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl cursor-pointer"
                        >
                            <FaRegHeart
                                size={24}
                                className=" text-base rounded-md  text-black dark:text-white"
                            />
                            <span className="ml-2 dark:text-white">Thích</span>
                        </button>
                    )}

                    <button
                        onClick={commentClick}
                        className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl ml-4 cursor-pointer"
                    >
                        <FaRegComment
                            size={24}
                            className="ml-4 text-base rounded-md  text-black dark:text-white"
                        />
                        <span className="ml-2 dark:text-white">
                            Thêm bình luận
                        </span>
                    </button>
                </div>
            </div>

            <div className="mt-2">
                {comments.length > 0 ? (
                    <>
                        {comments.slice(0, visibleComments).map((cmt) => (
                            <Comment
                                key={cmt.id} // Đảm bảo thêm key nếu có ID hoặc unique field
                                cmt={cmt}
                                postId={post.postId}
                                fetchPostComment={fetchPostComment}
                            />
                        ))}
                        {visibleComments < comments.length && (
                            <div className="pt-2 ">
                                <button
                                    onClick={handleShowMore}
                                    className="text-blue-500 hover:underline"
                                >
                                    Xem thêm bình luận
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="pb-4 pt-2 text-inherit dark:text-white">
                        <em>Chưa có bình luận nào</em>
                    </div>
                )}
            </div>

            <div className="flex w-full rounded-xl border border-gray-300 dark:border-gray-500 p-2 bg-gray-100 dark:bg-gray-800 items-center relative">
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
                            ref={commentRef}
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

            {/* Hiển thị modal nếu isReportModalOpen là true */}
            {isReportModalOpen && (
                <ReportModal
                    onClose={closeReportModal}
                    onSubmit={handleCreateReport}
                />
            )}
        </div>
    );
}

export default Post;
