import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreatePostModal from '../components/CreatePostModal';
import TopicCard from '../components/TopicCard';
import { FaPlus } from 'react-icons/fa6';
import Lottie from 'react-lottie';
import loadingAnimation from '../lotties/loading.json';
import nothing from '../lotties/nothing.json';
import { url } from '../config/config';
import AddForumModal from '../components/AddForumModal';

function Forum() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [topics, setTopics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTopics, setFilteredTopics] = useState(topics);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            // Nếu searchTerm rỗng, hiển thị tất cả topics
            setFilteredTopics(topics);
        }
    }, [topics, searchTerm]);

    // Hàm xử lý khi bấm nút "Tìm kiếm"
    const handleSearch = () => {
        if (searchTerm.trim() === '') {
            setFilteredTopics(topics); // Hiển thị tất cả nếu searchTerm rỗng
        } else {
            const filtered = topics.filter((topic) =>
                topic.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTopics(filtered);
        }
    };

    const fetchTopics = async () => {
        try {
            const response = await fetch(url + '/topics/');
            if (response.ok) {
                const data = await response.json();
                setTopics(data);
            } else {
                console.error('Failed to fetch topics');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

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
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-slate-900 dark:to-black min-h-screen"
        >
            <Header user={user} />

            {/* Ô tìm kiếm và nút tìm kiếm */}
            <div className="flex justify-center mt-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm diễn đàn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <button
                    onClick={handleSearch}
                    className="ml-3 py-2 px-6 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none"
                >
                    Tìm kiếm
                </button>
            </div>

            <div className="flex justify-end w-4/5 mx-auto">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-3 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none flex items-center"
                >
                    <FaPlus size={20} />
                    <span className="ml-2">Thêm diễn đàn mới</span>
                </button>
            </div>

            <AddForumModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* Grid các topic */}
            <div className="flex justify-center w-4/5 mx-auto ">
                {loading ? (
                    <div>
                        <Lottie
                            options={loadingAnimation}
                            height="50%"
                            width="50%"
                        />
                        <p className="text-center text-lg">
                            Không có diễn đàn nào
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3  gap-x-14 gap-y-6 py-6  w-full">
                        {filteredTopics.map((topic) => (
                            <TopicCard
                                key={topic.topicId}
                                name={topic.name}
                                id={topic.topicId}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Forum;
