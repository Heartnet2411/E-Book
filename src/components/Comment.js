import React, { useState, useEffect, useRef } from 'react';
import { PiWarningOctagonBold } from 'react-icons/pi';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';
import { toast, Slide } from 'react-toastify';
import ReplyComment from './ReplyComment';
import ReportModal from './ReportModal';
import { formatDate } from '../utils/formatDate';
import axios from 'axios';
import { url } from '../config/config';
function Comment({ cmt, postId, fetchPostComment }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showReply, setShowReply] = useState(false);
    const token = localStorage.getItem('token');
    const [showReplies, setShowReplies] = useState(false);
    const [comment, setCommnet] = useState('');
    const [selectedCommentId,setSelectedCommentId]=useState(null)
    const [showPicker, setShowPicker] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null); // State lưu lý do đã chọn

    const replyInputRef = useRef(null);

    useEffect(() => {
        if (showReply && replyInputRef.current) {
            replyInputRef.current.focus();
            replyInputRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [showReply]);

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason); // Lưu lý do đã chọn vào state của Post
        console.log('Reason selected in Post component:', reason);
        closeReportModal();
    };

    const openReportModal = (commentId) => {
        setSelectedCommentId(commentId)
        console.log(commentId)
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setSelectedReason(null);
        setSelectedCommentId(null)
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
                        // Sửa lại cách thêm Bearer token
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        postId: postId,
                        replyId: cmt.commentId,
                        content: comment, // Đảm bảo rằng `comment` là biến đúng
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                showToast('success', 'Thêm bình luận thành công');
                setCommnet(''); // Sửa lại setComment thay vì setCommnet
                setShowReply(false);
                fetchPostComment();
            } else {
                showToast('error', 'Có lỗi xảy ra khi thêm bình luận');
                setCommnet(''); // Sửa lại setComment thay vì setCommnet
            }
        } catch (error) {
            console.error('Lỗi:', error);
            showToast('error', 'Lỗi kết nối, vui lòng thử lại sau');
            setCommnet(''); // Sửa lại setComment thay vì setCommnet
        }
    };
    const handleCreateReport = async (reason) => {
        if (!selectedCommentId) return;

        try {
            const response = await axios.post(
                url + `/report/create`,
                {
                    targetType: 'post_comment',
                    targetId: selectedCommentId,
                    reason: reason,
                    userId: user?.userId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.status);
            if (response.status == 201) {
                // Kiểm tra xem phản hồi có thành công không
                toast.success('Báo cáo thành công!', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                closeReportModal(); // Đóng modal sau khi báo cáo
            } else {
                toast.error('Bạn đã báo cáo bình luận này rồi', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                closeReportModal();
            }
        } catch (error) {
            console.error('Error creating report:', error);
            toast.error('Có lỗi xảy ra khi báo cáo!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div key={cmt.commentId} className="flex-col pb-2">
            <div className="w-full flex items-center">
                <img
                    src={cmt.user.avatar}
                    className="w-10 h-10 rounded-full object-cover ml-4 mr-2"
                />
                <div className="w-full bg-gray-200 rounded-xl relative dark:bg-gray-800">
                    <p className="text-base font-medium px-4 w-11/12 dark:text-white">
                        {cmt.user.firstname + ' ' + cmt.user.lastname}
                    </p>
                    <p className="text-base font-normal px-4 pb-1 w-11/12 dark:text-white">
                        {cmt.content}
                    </p>
                    <button
                        onClick={() => openReportModal(cmt.commentId)}
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
                className="text-sm ml-16 font-semibold text-gray-700 dark:text-gray-400 dark:hover:text-gray-600 hover:text-gray-500 hover:underline"
            >
                Phản hồi
            </button>
            <span className="ml-4 text-sm dark:text-gray-400">
                {formatDate(cmt.createdAt)}
            </span>
            <div className="ml-16 border-l-2 border-gray-300 pl-4">
                {cmt.Replies.length > 0 ? (
                    showReplies ? (
                        <>
                            {cmt.Replies.map((rly) => (
                                <ReplyComment
                                    key={rly.commentId}
                                    cmt={rly}
                                    postId={postId}
                                    fetchPostComment={fetchPostComment}
                                    replyId={cmt.commentId}
                                />
                            ))}
                            <button
                                className="text-sm text-blue-500"
                                onClick={() => setShowReplies(false)}
                            >
                                Thu gọn
                            </button>
                        </>
                    ) : (
                        <button
                            className="text-sm text-blue-500"
                            onClick={() => setShowReplies(true)}
                        >
                            Xem thêm các phản hồi
                        </button>
                    )
                ) : null}
            </div>
            {showReply && (
                <div className=" flex items-center ml-16">
                    <img
                        src={user.avatar}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="w-full bg-gray-100 rounded-xl ml-2 dark:bg-gray-800">
                        <span className="text-base font-semibold px-4 pt-1 dark:text-white">
                            {user.firstName + ' ' + user.lastName}
                        </span>
                        <div className="relative w-full">
                            <input
                                ref={replyInputRef}
                                className="w-11/12 px-4 pb-2 rounded-xl dark:bg-gray-800 bg-gray-100 focus:outline-none text-base dark:text-white"
                                placeholder="Thêm bình luận của bạn"
                                value={comment}
                                onChange={(e) => setCommnet(e.target.value)}
                            />
                            <button
                                onClick={handleSendComment}
                                className="absolute right-4 top-1/2 -translate-y-1/2 dark:text-white"
                            >
                                <IoSend size={20} />
                            </button>
                            <button
                                className="absolute right-12 top-1/2 -translate-y-1/2 dark:text-white"
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
            )}
            {isReportModalOpen && (
                <ReportModal onClose={closeReportModal}
                onSubmit={handleCreateReport} />
            )}
        </div>
    );
}

export default Comment;
