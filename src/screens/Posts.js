import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Post from '../components/Post';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import CreatePostModal from '../components/CreatePostModal';
import { FaComments } from 'react-icons/fa';
import { FaSignOutAlt } from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FaComment } from 'react-icons/fa';
import { FaBookmark, FaPlus } from 'react-icons/fa6';
import Lottie from 'react-lottie';
import loadingAnimation from '../lotties/loading.json';
import nothing from '../lotties/nothing.json';
import { url } from '../config/config';
import { TbReload } from 'react-icons/tb';

function Posts() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user'));
    const [selected, setSelected] = useState('home');
    const [posts, setPosts] = useState([]);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { topicName } = location.state || {};
    const token = localStorage.getItem('token');

    const [showRefreshButton, setShowRefreshButton] = useState(false);

    const handleScroll = () => {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;

        // Kiểm tra nếu cuộn qua một khoảng (ví dụ 300px)
        if (scrollTop > 300) {
            setShowRefreshButton(true);
        } else {
            setShowRefreshButton(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

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

    const fetchPostById = async () => {
        try {
            const response = await fetch(url + `/post/${id}`, {
                method: 'GET', // Phương thức GET
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào headers
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                // Lọc các post có trạng thái là "approved"
                const approvedPosts = data.filter(
                    (post) => post.state === 'approved'
                );
                // Gắn dữ liệu đã lọc vào state
                setPosts(approvedPosts);
                setLoading(false);
            } else {
                console.error('Failed to fetch the post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPostsByTopicId = async (topicId) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Cuộn mượt mà
        });
        try {
            const response = await fetch(url + `/post/topic/${topicId}`, {
                method: 'GET', // Phương thức GET
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào headers
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                // Lọc các post có trạng thái là "approved"
                const approvedPosts = data.filter(
                    (post) => post.state === 'approved'
                );
                // Gắn dữ liệu đã lọc vào state
                setPosts(approvedPosts);
                setLoading(false);
            } else {
                console.error('Failed to fetch posts by topic');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchSavedPostsByUserId = async () => {
        try {
            const response = await fetch(url + `/post/saved/${id}`, {
                method: 'GET', // Phương thức GET
                headers: {
                    Authorization: `Bearer ${token}`, // Thêm token vào headers
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                const approvedPosts = data
                    .map((item) => item.post) // Trích xuất trường 'post' từ từng phần tử
                    .filter((post) => post.state === 'approved'); // Lọc các post có trạng thái 'approved'

                // Gắn dữ liệu đã lọc vào state
                setPosts(approvedPosts);
                setLoading(false);
            } else {
                console.error('Failed to fetch saved posts by user ID');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchPostsByTopicId(id);
    }, []);

    const handleFindFavoritePost = () => {
        setLoading(true);
        setSelected('saved');
        fetchSavedPostsByUserId(user.userId);
    };

    const handleFindMyPost = () => {
        setLoading(true);
        setSelected('posts');
        // Gọi hàm với id cụ thể
        fetchPostById();
    };

    const handleFindAllPost = () => {
        setLoading(true);
        fetchPostsByTopicId(id);
        setSelected('home');
    };

    const nothingOptions = {
        loop: true,
        autoplay: true,
        animationData: nothing,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const loadingOption = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-slate-900 dark:to-black min-h-screen relative"
        >
            <Header user={user} />

            <div
                className="w-4/5 mx-auto text-center mt-6 h-16 flex items-center justify-center rounded-xl"
                style={{
                    backgroundImage: `url(${images[8]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <span className="text-xl font-medium text-white custom-text-shadow">
                    {topicName}
                </span>
            </div>

            {showRefreshButton && (
                <button
                    onClick={() => fetchPostsByTopicId(id)}
                    className="fixed top-0 translate-y-1/2 left-1/2 z-50 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
                >
                    <TbReload size={24} />
                </button>
            )}

            <div className="grid grid-cols-10 px-16 max-w-screen-2xl mx-auto">
                {/* Left page */}
                <div className="col-span-3 py-4 pl-6  flex flex-col items-center mt-4">
                    <div className="w-4/6">
                        <button
                            className={`cursor-pointer flex items-center w-full px-4 py-2 rounded-xl ${
                                selected === 'abc'
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => navigate(`/forum`)}
                        >
                            <IoArrowBackOutline
                                size={24}
                                className=" text-base rounded-md text-black
                            dark:text-white"
                            />
                            <span className="text-base ml-4 font-semibold dark:text-white">
                                Các diễn đàn khác
                            </span>
                        </button>
                    </div>

                    <div className="w-4/6 border border-t mt-2"></div>

                    <div className="w-4/6 mt-2">
                        <button
                            className={`cursor-pointer flex items-center w-full px-4 py-2 rounded-xl ${
                                selected === 'home'
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleFindAllPost()}
                        >
                            <FaComments
                                size={24}
                                className=" text-base rounded-md  text-black dark:text-white"
                            />
                            <span className="text-base ml-4 font-semibold dark:text-white">
                                Tất cả bài viết
                            </span>
                        </button>
                    </div>
                    <div className="w-4/6 mt-2">
                        <button
                            className={`cursor-pointer flex items-center w-full px-4 py-2 rounded-xl ${
                                selected === 'posts'
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleFindMyPost()}
                        >
                            <FaComment
                                size={22}
                                className=" text-base rounded-md  text-black dark:text-white"
                            />
                            <span className="text-base ml-4 font-semibold dark:text-white">
                                Bài viết của bạn
                            </span>
                        </button>
                    </div>
                    <div className="w-4/6 mt-2">
                        <button
                            className={`cursor-pointer flex items-center w-full px-4 py-2 rounded-xl ${
                                selected === 'saved'
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleFindFavoritePost()}
                        >
                            <FaBookmark
                                size={22}
                                className=" text-base rounded-md  text-black dark:text-white"
                            />
                            <span className="text-base ml-4 font-semibold dark:text-white">
                                Bài viết đã lưu
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right page */}
                <div className="col-span-7 px-4 pr-24 h-auto">
                    {selected === 'home' ? (
                        <div
                            onClick={() => setIsCreatePostOpen(true)}
                            className="bg-white cursor-pointer hover:bg-gray-100 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-800 dark:shadow-md shadow-xl flex justify-between p-2 pl-6 items-center rounded-lg mt-6"
                        >
                            <span className="font-medium text-base dark:text-white">
                                Thêm bài viết mới
                            </span>
                            <button className=" p-2 bg-blue-400 rounded-lg">
                                <FaPlus
                                    size={20}
                                    className="text-white dark:text-white"
                                />
                            </button>
                        </div>
                    ) : null}

                    <div className="mt-4">
                        {loading ? (
                            <div className="">
                                <Lottie
                                    options={loadingOption}
                                    height="50%"
                                    width="50%"
                                />
                            </div>
                        ) : posts.length > 0 ? (
                            posts.map((post) => (
                                <Post
                                    post={post}
                                    currentUserId={user.userId}
                                    selected={selected}
                                    fetchPostById={fetchPostById}
                                />
                            ))
                        ) : (
                            <div>
                                <Lottie
                                    options={nothingOptions}
                                    height="50%"
                                    width="50%"
                                />
                                <p className="text-center text-lg dark:text-white">
                                    Không có bài viết nào
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
                topicId={id}
                topicName={topicName}
            />
        </div>
    );
}

export default Posts;
