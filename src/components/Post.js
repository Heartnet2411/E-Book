import React, { useEffect, useState } from 'react';
import { FaRegBookmark } from 'react-icons/fa6';
import { FaRegHeart, FaHeart, FaRegComment, FaBookmark } from 'react-icons/fa';
import { PiWarningOctagonBold } from 'react-icons/pi';
import { toast, Slide } from 'react-toastify';

function Post({ post }) {
    console.log('posst', post);
    const [savedPost, setSavedPost] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
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

    return (
        <div
            key={post.postId}
            className=" bg-white dark:bg-gray-900 dark:shadow-gray-800 dark:shadow-md shadow-xl flex justify-between p-2 px-8 items-center rounded-lg mt-4 "
        >
            <div className="w-full">
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
                            <button className="cursor-pointer">
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
                        dangerouslySetInnerHTML={{
                            __html: post.content,
                        }}
                        className="dark:text-white"
                    />
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

                    <button className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl ml-4 cursor-pointer">
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
        </div>
    );
}

export default Post;
