import React, { useState, useRef, useEffect } from 'react';
import { PiWarningOctagonBold } from 'react-icons/pi';
import { IoSend } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { BsEmojiSmile } from 'react-icons/bs';
import ReplyComment from './ReplyComment';
import ReportModal from './ReportModal';

function Comment({ cmt, postId, fetchPostComment }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [showReply, setShowReply] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [comment, setComment] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

    const handleSendComment = async () => {
        // Xử lý gửi bình luận
    };

    const onEmojiClick = (emoji) => {
        setComment((prevText) => prevText + emoji.emoji);
        setShowPicker(false);
    };

    return (
        <div key={cmt.commentId} className="flex-col pb-2">
            <div className="w-full flex items-center dark:text-white ">
                <img
                    src={cmt.user.avatar}
                    className="w-10 h-10 rounded-full object-cover ml-4 mr-2"
                />
                <div className="w-full bg-gray-200 rounded-xl relative dark:bg-gray-800">
                    <p className="text-base font-medium px-4 w-11/12">
                        {cmt.user.firstname + ' ' + cmt.user.lastname}
                    </p>
                    <p className="text-base font-normal px-4 pb-1 w-11/12">
                        {cmt.content}
                    </p>
                    <button
                        onClick={() => setIsReportModalOpen(true)}
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
            <div className="ml-14 border-l-2 border-gray-300 pl-4">
                {cmt.Replies.length > 0 && (
                    <>
                        {showReplies ? (
                            <>
                                {cmt.Replies.map((rly) => (
                                    <ReplyComment
                                        key={rly.commentId}
                                        cmt={rly}
                                        postId={postId}
                                        fetchPostComment={fetchPostComment}
                                    />
                                ))}
                                <button
                                    className="text-sm text-blue-500 hover:underline dark:font-medium"
                                    onClick={() => setShowReplies(false)}
                                >
                                    Thu gọn
                                </button>
                            </>
                        ) : (
                            <button
                                className="text-sm text-blue-500 hover:underline"
                                onClick={() => setShowReplies(true)}
                            >
                                Xem thêm các phản hồi
                            </button>
                        )}
                    </>
                )}
            </div>
            {showReply && (
                <div className=" flex items-center ml-16 dark:text-white">
                    <img
                        src={user.avatar}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl ml-2">
                        <span className="text-base font-semibold px-4 pt-1">
                            {user.firstName + ' ' + user.lastName}
                        </span>
                        <div className="relative w-full">
                            <input
                                ref={replyInputRef}
                                className="w-11/12 px-4 pb-2 rounded-xl dark:bg-gray-800 bg-gray-100 focus:outline-none text-base"
                                placeholder="Thêm bình luận của bạn"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
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
            )}
            {isReportModalOpen && (
                <ReportModal onClose={() => setIsReportModalOpen(false)} />
            )}
        </div>
    );
}

export default Comment;
