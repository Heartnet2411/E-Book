import React, { useEffect, useState } from 'react';
import { FaRegBookmark } from 'react-icons/fa6';
import { FaRegHeart, FaRegComment, FaBookmark } from 'react-icons/fa';
import { PiWarningOctagonBold } from 'react-icons/pi';

function Post({ post }) {
    const [savedPost, setSavedPost] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const savePostForUser = async (postId, userId, token) => {
        try {
            const response = await fetch(
                'http://localhost:8080/api/saved/save',
                {
                    method: 'POST', // Sử dụng phương thức POST
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào headers
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: postId,
                        userId: userId,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('Bài viết đã được lưu:', data);
                return data; // Trả về dữ liệu nếu cần
            } else {
                console.error('Lưu bài viết thất bại:', response.statusText);
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    async function fetchSavedPost(postId, token) {
        try {
            const response = await fetch(
                `http://localhost:8080/api/saved/savedPosts/${postId}`,
                {
                    method: 'POST', // Sử dụng phương thức POST
                    headers: {
                        'Content-Type': 'application/json',
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
            setSavedPost(savedPost);
        } catch (error) {
            console.error('Failed to fetch saved post:', error);
        }
    }

    async function fetchUnsavePost(postId, token) {
        try {
            const response = await fetch(
                'http://localhost:8080/api/saved/unsave',
                {
                    method: 'DELETE', // Sử dụng phương thức DELETE
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Thêm token vào header
                    },
                    body: JSON.stringify({ postId }), // Chuyển đổi postId thành JSON
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Error: ${response.status} ${response.statusText}`
                );
            }

            const data = await response.json();
            console.log('Unsaved Post:', data);
            return data; // Trả lại thông điệp phản hồi để sử dụng sau này nếu cần
        } catch (error) {
            console.error('Failed to unsave post:', error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetchSavedPost(post.postId, token);
    }, [post.postId]);

    const handleSavePost = () => {
        const token = localStorage.getItem('token');
        savePostForUser(post.postId, user.userId, token);
    };

    const handleRemoveSavePost = () => {
        const token = localStorage.getItem('token');
        fetchUnsavePost(post.postId, token);
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
                            src={post.userAvatar}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover mr-4"
                        />
                        <span className="text-lg font-semibold dark:text-white">
                            {post.userName}
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="relative group">
                            {savedPost.postId === post.postId ? (
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
                                        Lưu bài viết
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
                <div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.content,
                        }}
                        className="dark:text-white"
                    />
                    <img
                        src={post.image}
                        alt="user post"
                        className="h-60 my-3"
                    />
                </div>
                <div className="flex py-2">
                    <button className="flex font-semibold bg-gray-200 dark:bg-gray-800 py-1 px-3 rounded-xl cursor-pointer">
                        <FaRegHeart
                            size={24}
                            className=" text-base rounded-md  text-black dark:text-white"
                        />
                        <span className="ml-2 dark:text-white">Thích</span>
                    </button>
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
