import React, { useEffect, useState } from 'react';
import { url } from '../config/config';
import { useNavigate } from 'react-router-dom';

function TopicCard({ name, id }) {
    const [lastPost, setLastPost] = useState(null);
    const [postCount, setPostCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/forum/${id}`, {
            state: { topicName: name },
        });
    };

    const images = [
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2023.png?alt=media&token=7ad74141-6de1-4f8d-b7a2-2015e7469a4c',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2059.png?alt=media&token=6e75e70e-2b56-4bab-8ea7-46273d313d5a',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2047.png?alt=media&token=bdfdb871-756a-40de-a31b-13b9b1c97ad7',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2031.png?alt=media&token=cc32fd60-8fb1-4f71-a82a-5e703cbb4b75',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2074.png?alt=media&token=75aa9b37-c6e0-4021-9c7a-fa5ff0c76655',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2013.png?alt=media&token=6a018e1f-57f6-41b1-b498-30bdb53252de',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2029.png?alt=media&token=31a80edb-34d4-49e0-b8a3-1afab4a7498a',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2088.png?alt=media&token=2c148c5b-219a-4a35-9654-a7cba9a4c272',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2037.png?alt=media&token=83a88e58-5658-4f3c-bc9b-742def08ae3b',
        'https://firebasestorage.googleapis.com/v0/b/datn-ed1fa.appspot.com/o/images%2FAurora%20-%2099.png?alt=media&token=09a5791b-eec1-4554-b7ee-a32f999723bd',
    ];

    // Chọn ngẫu nhiên một hình ảnh từ danh sách
    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Hàm fetch để lấy thông tin bài viết cuối cùng và tổng số bài viết của topic
    const fetchTopicData = async () => {
        try {
            setLoading(true); // Bắt đầu load
            const response = await fetch(url + `/post/topic/last-post/${id}`);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Kiểm tra xem phản hồi có phải là JSON
            const data = await response.json();

            setLastPost(data.lastPost); // Cập nhật bài viết cuối cùng
            setPostCount(data.postCount); // Cập nhật tổng số bài viết
        } catch (error) {
            console.error('Error fetching topic data:', error);
        } finally {
            setLoading(false); // Kết thúc load
        }
    };

    // Gọi API khi component mount
    useEffect(() => {
        fetchTopicData();
    }, [id]);

    const removeHtmlTags = (str) => {
        return str.replace(/<\/?[^>]+(>|$)/g, ''); // Biểu thức chính quy để loại bỏ thẻ HTML
    };

    return (
        <div
            onClick={handleClick}
            className="w-full p-4 bg-white rounded-2xl shadow-md dark:bg-slate-800 dark:text-white cursor-pointer"
        >
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 rounded-xl bg-gray-400"
                style={{
                    backgroundImage: `url(${randomImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <h2 className="text-white font-semibold text-lg dark:text-white line-clamp-1">
                    {name}
                </h2>
            </div>

            {/* Stats */}
            <div className="flex justify-between mt-4 text-gray-600 dark:text-gray-300">
                <div>
                    <p className="text-xs font-medium">POSTS</p>
                    <p className="text-lg font-semibold">{postCount}</p>
                </div>
                <div>
                    <p className="text-xs font-medium">LAST ACTIVITY</p>
                    <p className="text-lg font-semibold">
                        {lastPost
                            ? (() => {
                                  const createdAtDate = new Date(
                                      lastPost.createdAt
                                  );
                                  const today = new Date();

                                  const isToday =
                                      createdAtDate.getDate() ===
                                          today.getDate() &&
                                      createdAtDate.getMonth() ===
                                          today.getMonth() &&
                                      createdAtDate.getFullYear() ===
                                          today.getFullYear();

                                  return isToday
                                      ? `Hôm nay ${createdAtDate.toLocaleTimeString(
                                            [],
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }
                                        )}`
                                      : `${createdAtDate.toLocaleDateString(
                                            'en-GB'
                                        )} ${createdAtDate.toLocaleTimeString(
                                            [],
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            }
                                        )}`;
                              })()
                            : 'N/A'}
                    </p>
                </div>
            </div>

            {/* Last Topic */}
            <div className="mt-4 flex-col items-start ">
                <p className="text-xs text-gray-500 dark:text-white">
                    LAST POST
                </p>
                <div className="mt-2 flex items-center h-10">
                    {lastPost ? (
                        <img
                            src={
                                lastPost && lastPost.user
                                    ? lastPost.user.avatar
                                    : 'https://via.placeholder.com/40'
                            }
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : null}

                    <p className="ml-3 text-sm text-gray-800 font-medium dark:text-white line-clamp-2">
                        {lastPost
                            ? removeHtmlTags(lastPost.content)
                            : 'No posts yet'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TopicCard;
