import React, { useState } from 'react';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { TbMessageReport } from 'react-icons/tb';
import { FaRegEdit } from 'react-icons/fa';
import EditCommentModal from './EditCommentModal';

const Comment = ({
    comment,
    isCurrentUser,
    openReportModal,
    updateComment,
}) => {
    const [isEditing, setIsEditing] = useState(false);

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) =>
            star <= rating ? (
                <AiFillStar size={20} key={star} className="text-yellow-400" />
            ) : (
                <AiOutlineStar size={20} key={star} className="text-gray-400" />
            )
        );
    };

    const handleEditSave = async (updatedComment) => {
        await updateComment(comment.bookId, updatedComment);
        setIsEditing(false);
    };

    return (
        <div
            className={`my-3 text-black dark:text-white flex items-center dark:bg-gray-800 ${
                isCurrentUser ? 'bg-gray-200' : ''
            }`}
        >
            <img
                src={comment.user.avatar}
                alt="User avt"
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4 w-full">
                <div className="flex justify-between items-center">
                    <span className="font-bold flex-1">
                        {comment.user.firstName + ' ' + comment.user.lastName}
                    </span>
                    <span className="mr-2">
                        {new Date(comment.updatedAt).toLocaleDateString(
                            'en-GB'
                        )}
                    </span>
                    {isCurrentUser ? (
                        <div className="relative group">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-2 text-black dark:text-white"
                            >
                                <FaRegEdit size={24} />
                            </button>
                            <span className="absolute left-0 top-8 w-max p-2 bg-gray-800 text-white dark:bg-gray-200 dark:text-black text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Chỉnh sửa bình luận
                            </span>
                        </div>
                    ) : (
                        <div className="relative group">
                            <button onClick={openReportModal} className="px-2">
                                <TbMessageReport size={26} color="red" />
                            </button>
                            <span className="absolute left-0 top-8 w-max p-2 bg-gray-800 text-white dark:bg-gray-200 dark:text-black text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Báo cáo bài viết
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex items-center">
                    <span className="mr-2">Đánh giá:</span>
                    <div className="flex space-x-1">
                        {renderStars(comment.rating)}
                    </div>
                </div>
                <p>Nội dung: {comment.comment}</p>
            </div>
            {isEditing && (
                <EditCommentModal
                    comment={comment}
                    onClose={() => setIsEditing(false)}
                    onSave={handleEditSave}
                />
            )}
        </div>
    );
};

export default Comment;
