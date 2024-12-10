// AddForumModal.js
import React, { useState } from 'react';
import { toast, Slide } from 'react-toastify';

const AddForumModal = ({ isOpen, onClose }) => {
    const [forum, setForum] = useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(forum);
    if (!isOpen) return null;

    const handleCreateTopic = async () => {
        if (forum === '') {
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/api/topics/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: forum, userId: user.userId }),
            });

            if (response.status === 201) {
                toast.success(
                    'Thêm chủ đề thành công! Chủ đề sẽ được xuất hiện sau khi quản trị viên kiểm duyệt',
                    {
                        position: 'top-right',
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        transition: Slide,
                    }
                );
            }
            if (response.status === 202) {
                toast.error(
                    'Tên chủ đề đã tồn tại. Vui lòng chọn một tên khác',
                    {
                        position: 'top-right',
                        autoClose: 4000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'light',
                        transition: Slide,
                    }
                );}

                
        } catch (error) {
            toast.error(
                'Có lỗi xảy ra khi thêm chủ đề. Xin vui lòng thử lại sau',
                {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'light',
                    transition: Slide,
                }
            );
        }

    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                    Thêm Diễn Đàn Mới
                </h2>
                <input
                    type="text"
                    placeholder="Tên diễn đàn"
                    onChange={(e) => setForum(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="mr-3 py-2 px-6 bg-gray-300 dark:text-white rounded-lg shadow-sm hover:bg-gray-400 focus:outline-none dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => {
                            handleCreateTopic();
                            onClose();
                        }}
                        className="py-2 px-6 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 focus:outline-none"
                    >
                        Thêm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddForumModal;
