import React, { useState } from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'draft-js/dist/Draft.css';
import {
    FaBold,
    FaItalic,
    FaUnderline,
    FaListUl,
    FaListOl,
    FaQuoteRight,
} from 'react-icons/fa';
import axios from 'axios';
import { url } from '../config/config';
import { toast, Slide } from 'react-toastify';

const CreatePostModal = ({ isOpen, onClose, topics, post }) => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const [title, setTitle] = useState('');
    const [selectedTopicId, setSelectedTopicId] = useState('');
    console.log(selectedTopicId);
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState('');
    const token = localStorage.getItem('token');

    const handleEditorChange = (newState) => {
        setEditorState(newState);
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn một file hình ảnh.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageUrl(reader.result); // Lưu trữ URL của ảnh tạm thời
                setImageFile(file); // Lưu file ảnh để gửi lên server
            };
            reader.readAsDataURL(file); // Đọc file ảnh
        }
    };

    const handleOutsideClick = (event) => {
        if (event.target.id === 'modal-overlay') {
            onClose(); // Đóng modal khi click ra ngoài modal
        }
    };

    const toggleInlineStyle = (event, style) => {
        event.preventDefault(); // Ngăn việc mất focus do sự kiện click gây ra
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockType = (event, blockType) => {
        event.preventDefault(); // Ngăn việc mất focus do sự kiện click gây ra
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const contentState = editorState.getCurrentContent();
        const htmlContent = stateToHTML(contentState);

        // Log tất cả dữ liệu đã nhập

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', htmlContent);
        formData.append('topicId', selectedTopicId);
        if (imageFile) {
            formData.append('image', imageFile); // Thêm file ảnh vào FormData
        }

        try {
            const response = await axios.post(url + '/post', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // Thiết lập Content-Type cho FormData
                },
            });
            onClose();
            post();
            console.log('Bài viết đã được tạo thành công:', response.data);
            toast.success('Thêm bài viết thành công', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Slide,
            });
        } catch (error) {
            console.error('Có lỗi xảy ra khi tạo bài viết:', error.message);
            toast.error('Có lỗi xảy ra khi thêm bài viết', {
                position: 'top-right',
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light',
                transition: Slide,
            });
        }
    };

    const myBlockStyleFn = (block) => {
        switch (block.getType()) {
            case 'blockquote':
                return 'custom-blockquote';
            default:
                return null;
        }
    };

    const currentInlineStyle = editorState.getCurrentInlineStyle();
    const isStyleActive = (style) => currentInlineStyle.has(style);
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);

    if (!isOpen) return null;

    return (
        <div
            id="modal-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 max-w-screen-2xl"
            onMouseDown={handleOutsideClick} // Dùng onMouseDown thay vì onClick
        >
            <div
                className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-3xl"
                onMouseDown={(e) => e.stopPropagation()} // Ngăn sự kiện lan ra ngoài khi nhấn vào modal
            >
                <p className="text-2xl text-center font-bold dark:text-white mb-4">
                    Đăng bài viết mới
                </p>

                <div className="mb-2">
                    <label className="block text-gray-700 text-base font-bold mb-1 dark:text-gray-200">
                        Tiêu đề
                    </label>
                    <input
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)} // Lưu trữ giá trị tiêu đề
                        placeholder="Nhập tiêu đề"
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-gray-700 dark:text-gray-200 text-base font-bold mb-1">
                        Chủ đề bài viết
                    </label>
                    <select
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-0"
                        value={selectedTopicId}
                        onChange={(e) => setSelectedTopicId(e.target.value)} // Lưu trữ ID của chủ đề đã chọn
                    >
                        <option value="default">
                            --Chọn chủ đề bài viết--
                        </option>
                        {topics.map((topic) => (
                            <option key={topic.topicId} value={topic.topicId}>
                                {topic.name}
                            </option>
                        ))}
                    </select>
                </div>

                <label className="block text-gray-700 text-base font-bold mb-1 dark:text-gray-200">
                    Thêm nội dung
                </label>

                <div className="border border-gray-200 rounded-lg p-1 mb-2">
                    {/* Toolbar chỉnh sửa định dạng */}
                    <div className="mb-1 mt-2 flex justify-end mr-4">
                        <button
                            className={`px-2 py-1 border mr-2 rounded-lg ${
                                isStyleActive('BOLD')
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                            }`}
                            onMouseDown={(event) =>
                                toggleInlineStyle(event, 'BOLD')
                            }
                        >
                            <FaBold size={18} />
                        </button>
                        <button
                            className={`px-2 py-1 border mr-2 rounded-lg ${
                                isStyleActive('ITALIC')
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                            }`}
                            onMouseDown={(event) =>
                                toggleInlineStyle(event, 'ITALIC')
                            }
                        >
                            <FaItalic size={18} />
                        </button>
                        <button
                            className={`px-2 py-1 border mr-2 rounded-lg ${
                                isStyleActive('UNDERLINE')
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                            }`}
                            onMouseDown={(event) =>
                                toggleInlineStyle(event, 'UNDERLINE')
                            }
                        >
                            <FaUnderline size={18} />
                        </button>
                        <button
                            className={`px-2 py-1 border mr-2 rounded-lg ${
                                currentBlockType === 'unordered-list-item'
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                            }`}
                            onMouseDown={(event) =>
                                toggleBlockType(event, 'unordered-list-item')
                            }
                        >
                            <FaListUl size={18} />
                        </button>
                        <button
                            className={`px-2 py-1 border mr-2 rounded-lg ${
                                currentBlockType === 'ordered-list-item'
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                            }`}
                            onMouseDown={(event) =>
                                toggleBlockType(event, 'ordered-list-item')
                            }
                        >
                            <FaListOl size={18} />
                        </button>
                        <button
                            className={`px-2 py-1 border rounded-lg ${
                                currentBlockType === 'blockquote'
                                    ? 'bg-blue-400 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                            }`}
                            onMouseDown={(event) =>
                                toggleBlockType(event, 'blockquote')
                            }
                        >
                            <FaQuoteRight size={18} />
                        </button>
                    </div>

                    {/* Trình soạn thảo Draft.js */}
                    <div className="border border-gray-300 rounded-lg px-4 py-1 bg-white">
                        <Editor
                            editorState={editorState}
                            handleKeyCommand={RichUtils.handleKeyCommand}
                            onChange={handleEditorChange}
                            blockStyleFn={myBlockStyleFn}
                        />
                    </div>
                </div>

                {/* Input tải lên hình ảnh */}
                <div className="">
                    <div className="image-upload mb-2">
                        <label className="block text-gray-700 text-base font-bold mb-2 dark:text-gray-200">
                            Tải lên hình ảnh
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:text-white"
                        />
                    </div>
                    {/* Hiển thị hình ảnh nếu có */}
                    {imageUrl && (
                        <div className="image-preview mb-4 max-h-32  overflow-scroll flex px-4 ">
                            <div className="flex-1  ">
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    className="w-2/4 h-auto rounded-lg"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setImageUrl('');
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg h-10"
                            >
                                Hủy hình ảnh
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2 hover:bg-gray-400"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={handleSubmit}
                    >
                        Đăng bài viết
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePostModal;