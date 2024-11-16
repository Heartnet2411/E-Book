import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const EditCommentModal = ({ comment, onClose, onSave }) => {
    const [content, setContent] = useState(comment.comment);
    const [rating, setRating] = useState(comment.rating);

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) =>
            star <= rating ? (
                <AiFillStar
                    size={20}
                    key={star}
                    className="text-yellow-400 cursor-pointer"
                    onClick={() => setRating(star)}
                />
            ) : (
                <AiOutlineStar
                    size={20}
                    key={star}
                    className="text-gray-400 cursor-pointer"
                    onClick={() => setRating(star)}
                />
            )
        );
    };

    const handleSave = () => {
        onSave({ content, rating });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-96">
                <h2 className="text-lg font-bold mb-4">Chỉnh sửa bình luận</h2>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                />
                <div className="mt-2">
                    <span className="mr-2">Đánh giá:</span>
                    <div className="flex space-x-1">{renderStars(rating)}</div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded-md"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCommentModal;
