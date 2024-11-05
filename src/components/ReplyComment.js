import React, { useState, useEffect } from 'react';
import { PiWarningOctagonBold } from 'react-icons/pi';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';
import { toast, Slide } from 'react-toastify';
import ReportModal from './ReportModal';

function ReplyComment({ cmt, postId, fetchPostComment, replyId }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showReply, setShowReply] = useState(false);
    const [comment, setCommnet] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null); // State lưu lý do đã chọn

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason); // Lưu lý do đã chọn vào state của Post
        console.log('Reason selected in Post component:', reason);
        closeReportModal();
    };

    const openReportModal = () => {
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
    };

    const onEmojiClick = (emoji) => {
        setCommnet((prevText) => prevText + emoji.emoji);
        setShowPicker(false); // Đóng picker sau khi chọn emoji
    };

    function showToast(type, message) {
        const options = {
            position: 'top-right',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
            transition: Slide,
        };

        if (type === 'success') {
            toast.success(message, options);
        } else if (type === 'error') {
            toast.error(message, options);
        } else if (type === 'info') {
            toast.info(message, options);
        } else if (type === 'warning') {
            toast.warning(message, options);
        }
    }

    const handleSendComment = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(
                'http://localhost:8080/api/post/comment',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: postId,
                        replyId: replyId,
                        content: comment,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                showToast('success', 'Thêm bình luận thành công');
                setCommnet('');
                setShowReply(false);
                fetchPostComment();
            } else {
                showToast('error', 'Có lỗi xảy ra khi thêm bình luận');
                setCommnet('');
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showToast('error', 'Lỗi kết nối, vui lòng thử lại sau');
            setCommnet('');
        }
    };

    return (
        <div key={cmt.commentId} className="flex-col  ">
            <div className="w-full flex items-center">
                <img
                    src={cmt.user.avatar}
                    className="w-10 h-10 rounded-full object-cover mr-2"
                />
                <div className="w-full bg-gray-200 rounded-xl relative">
                    <p className="text-base font-medium px-4 w-11/12">
                        {cmt.user.firstname + ' ' + cmt.user.lastname}
                    </p>
                    <p className="text-base font-normal px-4 pb-1 w-11/12">
                        {cmt.content}
                    </p>
                    <button
                        onClick={openReportModal}
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                        <PiWarningOctagonBold
                            size={20}
                            className="text-red-500"
                        />
                    </button>
                </div>
            </div>
            <button
                onClick={() => setShowReply(true)}
                className="text-sm ml-16 font-semibold text-gray-700 hover:text-gray-500 hover:underline"
            >
                Phản hồi
            </button>

            {showReply ? (
                <div className="w-full flex items-center">
                    <img
                        src={user.avatar}
                        className="w-8 h-8 rounded-full object-cover ml-28"
                    />
                    <div className="w-full bg-gray-100 rounded-xl ml-2">
                        <span className="text-base font-semibold px-4 pt-1">
                            {user.firstName + ' ' + user.lastName}
                        </span>
                        <div className="relative w-full">
                            <input
                                className="w-11/12 px-4 pb-2  rounded-xl bg-gray-100 focus:outline-none text-base "
                                placeholder="Thêm bình luận của bạn"
                                value={comment}
                                onChange={(e) => setCommnet(e.target.value)}
                            />
                            <button
                                onClick={handleSendComment}
                                className="absolute right-4 top-1/2 -translate-y-1/2"
                            >
                                <IoSend size={20} />
                            </button>
                            <button
                                className="absolute right-12 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPicker((val) => !val)}
                            >
                                <BsEmojiSmile size={20} />
                            </button>
                            {showPicker && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        zIndex: '1000',
                                        right: '0',
                                    }}
                                >
                                    <EmojiPicker onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Hiển thị modal nếu isReportModalOpen là true */}
            {isReportModalOpen && (
                <ReportModal
                    onClose={closeReportModal}
                    onReasonSelect={handleReasonSelect} // Truyền hàm để nhận lý do đã chọn
                />
            )}
        </div>
    );
}

export default ReplyComment;
