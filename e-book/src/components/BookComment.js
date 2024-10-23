import React from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const Comment = ({ comment, isCurrentUser }) => {
    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) =>
            star <= rating ? (
                <AiFillStar size={20} key={star} className="text-yellow-400" />
            ) : (
                <AiOutlineStar size={20} key={star} className="text-gray-400" />
            )
        );
    };

    return (
        <div
            className={`my-3 text-black dark:text-white flex items-center ${
                isCurrentUser ? 'bg-gray-200' : ''
            }`}
        >
            <img
                src={comment.user.avatar}
                alt="User avt"
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4 w-full">
                <div className="flex justify-between">
                    <span className="font-bold flex-1">
                        {comment.user.firstName + ' ' + comment.user.lastName}
                    </span>
                    <span>
                        {new Date(comment.createdAt).toLocaleDateString(
                            'en-GB'
                        )}{' '}
                        {/* Định dạng dd/mm/yyyy */}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="mr-2">Đánh giá:</span>
                    <div className="flex space-x-1">
                        {renderStars(comment.rating)}{' '}
                        {/* Hiển thị sao dựa trên rating */}
                    </div>
                </div>
                <p>Nội dung: {comment.comment}</p>
            </div>
        </div>
    );
};

export default Comment;
