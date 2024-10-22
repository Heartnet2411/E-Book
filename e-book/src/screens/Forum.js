import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Post from '../components/Post';
import CreatePostModal from '../components/CreatePostModal';
import { AiFillHome } from 'react-icons/ai';
import { BsChatFill } from 'react-icons/bs';
import { FaBookmark, FaPlus } from 'react-icons/fa6';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

function Forum() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [selected, setSelected] = useState('home');
    const [topics, setTopics] = useState([]);
    const [posts, setPosts] = useState([]);
    const [totalTopic, setTotalTopic] = useState(0);
    const [selectedTopic, setSelectedTopic] = useState(-1);
    const [isTopicOpen, setisTopicOpen] = useState(true);
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    const toggleCurrentCourses = () => {
        setisTopicOpen(!isTopicOpen);
    };

    const fetchTopics = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/topics/');
            if (response.ok) {
                const data = await response.json();
                setTopics(data);
                console.log('aaa', data);
                const totalTopics = data.length;
                setTotalTopic(totalTopics);
            } else {
                console.error('Failed to fetch topics');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/post/');
            if (response.ok) {
                const data = await response.json();
                // Gắn dữ liệu lấy được vào state
                setPosts(data);
                console.log(data);
            } else {
                console.error('Failed to fetch posts');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPostById = async (id) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/post/${id}`
            );
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
                return data;
            } else {
                console.error('Failed to fetch the post');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchPostsByTopicId = async (topicId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/post/topic/${topicId}`
            );
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            } else {
                console.error('Failed to fetch posts by topic');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchSavedPostsByUserId = async (userId, token) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/saved/users/${userId}`,
                {
                    method: 'GET', // Phương thức GET
                    headers: {
                        Authorization: `Bearer ${token}`, // Thêm token vào headers
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const postMap = data.map((item) => item.post);
                setPosts(postMap);
            } else {
                console.error('Failed to fetch saved posts by user ID');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchTopics();
        fetchPosts();
    }, []);

    const handleFindFavoritePost = () => {
        setSelected('saved');
        const token = localStorage.getItem('token');
        fetchSavedPostsByUserId(user.userId, token);
    };

    const handleSelectTopic = (index, topicId) => {
        setSelectedTopic(index);
        if (index === -1) {
            fetchPosts();
            console.log('ok');
        } else {
            fetchPostsByTopicId(topicId);
            console.log('no');
        }
    };

    const handleFindMyPost = () => {
        setSelected('posts');
        // Gọi hàm với id cụ thể
        fetchPostById(user.userId);
    };

    const handleFindAllPost = () => {
        setSelected('home');
        fetchPosts();
    };

    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black min-h-screen"
        >
            <Header user={user} />

            <div className="grid grid-cols-10 px-16 max-w-screen-2xl mx-auto">
                {/* Left page */}
                <div className="col-span-3 p-4 flex flex-col items-center mt-8">
                    <div className="w-4/6">
                        <button
                            className={`cursor-pointer flex items-center w-full px-4 py-2 rounded-xl ${
                                selected === 'home'
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => handleFindAllPost()}
                        >
                            <AiFillHome
                                size={24}
                                className=" text-base rounded-md  text-black dark:text-white"
                            />
                            <span className="text-lg ml-4 font-semibold dark:text-white">
                                Trang chủ
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
                            <BsChatFill
                                size={22}
                                className=" text-base rounded-md  text-black dark:text-white"
                            />
                            <span className="text-lg ml-4 font-semibold dark:text-white">
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
                            <span className="text-lg ml-4 font-semibold dark:text-white">
                                Bài viết đã lưu
                            </span>
                        </button>
                    </div>

                    <div className="px-4 py-2 w-4/6">
                        {/* Current Course Section */}
                        <div
                            className="flex justify-between items-center cursor-pointer"
                            onClick={toggleCurrentCourses}
                        >
                            <h2 className="font-semibold text-lg dark:text-white">
                                Chủ đề ({totalTopic})
                            </h2>
                            <span>
                                {isTopicOpen ? (
                                    <FaCaretUp
                                        size={22}
                                        className="text-black dark:text-white"
                                    />
                                ) : (
                                    <FaCaretDown
                                        size={22}
                                        className="text-black dark:text-white"
                                    />
                                )}
                            </span>
                        </div>
                        {isTopicOpen && (
                            <ul className="mt-2">
                                {/* Thêm li cho "Tất cả chủ đề" */}
                                <li
                                    onClick={() => handleSelectTopic(-1)} // Giá trị -1 đại diện cho tất cả chủ đề
                                    className={`flex justify-between items-center p-2 rounded-lg font-normal cursor-pointer hover:bg-gray-300 dark:text-white dark:hover:bg-gray-700
                        ${
                            selectedTopic === -1
                                ? 'bg-gray-300 dark:bg-gray-700'
                                : ''
                        }`}
                                >
                                    <span>Tất cả chủ đề</span>
                                </li>

                                {topics.map((topic, index) => (
                                    <li
                                        key={index}
                                        onClick={() =>
                                            handleSelectTopic(
                                                index,
                                                topic.topicId
                                            )
                                        } // Xử lý chọn chủ đề
                                        className={`flex mt-1 justify-between items-center p-2 rounded-lg font-normal cursor-pointer hover:bg-gray-300 dark:text-white dark:hover:bg-gray-700
                            ${
                                selectedTopic === index
                                    ? 'bg-gray-300 dark:bg-gray-700'
                                    : ''
                            }`}
                                    >
                                        <span>{topic.name}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Right page */}
                <div className="col-span-7 p-4 pr-16 h-auto">
                    <div
                        onClick={() => setIsCreatePostOpen(true)}
                        className="bg-white cursor-pointer hover:bg-gray-100 dark:bg-gray-900 dark:shadow-gray-800 dark:shadow-md shadow-xl flex justify-between p-2 pl-6 items-center rounded-lg mt-8"
                    >
                        <span className="font-medium text-base dark:text-white">
                            Thêm bài viết
                        </span>
                        <button className=" p-2 bg-blue-400 rounded-lg">
                            <FaPlus
                                size={24}
                                className="text-black dark:text-white"
                            />
                        </button>
                    </div>

                    <div className="mt-4">
                        {posts ? (
                            posts.map((post) => <Post post={post} />)
                        ) : (
                            <span>Không có bài viết</span>
                        )}
                    </div>
                </div>
            </div>

            <Footer />

            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
                topics={topics}
            />
        </div>
    );
}

export default Forum;
