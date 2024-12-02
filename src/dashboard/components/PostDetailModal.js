import React, { useEffect, useState, useRef } from 'react';
import {
    Button,
    Typography,
    TextField,
    Box,
    Modal,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Divider,
    ListSubheader,
} from '@mui/material';
import Comment from '../../components/Comment';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Cancel, CheckCircle } from '@mui/icons-material';
import { url } from '../../config/config';
import { toast, Slide } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
function PostDetailModal({ post, onClose, onUpdatePosts }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const [isExpanded, setIsExpanded] = useState(false);
    const [showReadMore, setShowReadMore] = useState(false);
    const contentRef = useRef(null);
    const [reason, setReason] = useState('');
    const [openDeclineModal, setOpenDeclineModal] = useState(false);
    const [comment, setCommnet] = useState('');
    const [comments, setCommnets] = useState([]);
    const [reportReasons, setReportReasons] = useState([]);
    const handleOutsideClick = (event) => {
        if (event.target.id === 'modal-overlay') {
            onClose(); // Đóng modal khi click ra ngoài modal
        }
    };
    const handleDeclineClose = () => {
        setOpenDeclineModal(false);
    };
    const toggleExpand = () => {
        setIsExpanded((prev) => !prev);
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
    //================Post===========================
    const acceptPendingPostConfirmm = (id) => {
        confirmAlert({
            title: 'Duyệt bài viết',
            message: 'Bạn có chắc chắn muốn duyệt bài viết này?',
            closeOnClickOutside: false,
            customUI: ({ onClose }) => (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '8px',
                        background: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    <h2 style={{ marginBottom: '10px', fontSize: '18px' }}>
                        Duyệt bài viết
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn duyệt bài viết này?
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Cancel style={{ marginRight: '5px' }} />
                            Huỷ
                        </button>
                        <button
                            onClick={() => {
                                acceptPendingPost(id);
                                onClose();
                            }}
                            style={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CheckCircle style={{ marginRight: '5px' }} />
                            Xác nhận
                        </button>
                    </div>
                </div>
            ),
        });
    };
    const acceptPendingPost = async (id) => {
        // Gọi API để duyệt bài viết
        try {
            const response = await axios.post(
                url + `/admin/post/approved/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                showToast('success', 'Duyệt bài viết thành công');
                onClose();
                onUpdatePosts(id);
            }
        } catch (error) {
            showToast('error', 'Có lỗi xảy ra khi duyệt bài viết');
            console.error('Failed to approved posts:', error);
        }
    };
    const declinePendingPost = async (id, reason) => {
        try {
            const response = await axios.put(
                url + `/admin/post/rejected/${id}`,
                { reason },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                showToast('success', 'Từ chối thành công');
                onClose();
                onUpdatePosts(id);
            }
        } catch (error) {
            showToast('error', 'Có lỗi xảy ra khi từ chối');
            console.error('Failed to approved posts:', error);
        }
    };
    const deletePostConfirm = (id) => {
        confirmAlert({
            title: 'Xoá bài viết',
            message: 'Bạn có chắc chắn muốn xoá bài viết này?',
            buttons: [
                {
                    label: (
                        <span>
                            <Cancel
                                style={{
                                    marginRight: '5px',
                                    verticalAlign: 'middle',
                                }}
                            />
                            Huỷ
                        </span>
                    ),
                    className: 'react-confirm-alert-button cancel',
                    onClick: () => {},
                    style: {
                        backgroundColor: '#f44336', // Màu đỏ
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 15px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '10px', // Khoảng cách giữa 2 nút
                    },
                },
                {
                    label: (
                        <span>
                            <CheckCircle
                                style={{
                                    marginRight: '5px',
                                    verticalAlign: 'middle',
                                }}
                            />
                            Xác nhận
                        </span>
                    ),
                    className: 'react-confirm-alert-button confirm',
                    onClick: () => deletePost(id),
                    style: {
                        backgroundColor: '#4caf50', // Màu xanh lá
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '8px 15px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                },
            ],
            closeOnClickOutside: false,
            customUI: ({ onClose }) => (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '8px',
                        background: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    <h2 style={{ marginBottom: '10px', fontSize: '18px' }}>
                        Xoá bài viết
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn xoá bài viết này?
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Cancel style={{ marginRight: '5px' }} />
                            Huỷ
                        </button>
                        <button
                            onClick={() => {
                                deletePost(id);
                                onClose();
                            }}
                            style={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CheckCircle style={{ marginRight: '5px' }} />
                            Xác nhận
                        </button>
                    </div>
                </div>
            ),
        });
    };
    const deletePost = async (id) => {
        try {
            const response = await axios.delete(url + `/post/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 204) {
                showToast('success', 'Xoá thành công');
                onClose();
                onUpdatePosts(id);
            }
        } catch (error) {
            console.error('Failed to delete posts:', error);
            showToast('error', 'Có lỗi xảy ra khi xoá');
        }
    };

    //===============Report=======================
    const hidePostConfirm = (id) => {
        confirmAlert({
            title: 'Ẩn bài viết',
            message: 'Bạn có chắc chắn muốn ẩn bài viết này?',
            closeOnClickOutside: false,
            customUI: ({ onClose }) => (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '8px',
                        background: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    <h2 style={{ marginBottom: '10px', fontSize: '18px' }}>
                        Ẩn bài viết
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn ẩn bài viết này?
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = '#e53935')
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = '#f44336')
                            }
                        >
                            <Cancel style={{ marginRight: '5px' }} />
                            Huỷ
                        </button>
                        <button
                            onClick={() => {
                                hidePost(id);
                                onClose();
                            }}
                            style={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = '#43a047')
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = '#4caf50')
                            }
                        >
                            <CheckCircle style={{ marginRight: '5px' }} />
                            Xác nhận
                        </button>
                    </div>
                </div>
            ),
        });
    };

    const hidePost = async (id) => {
        try {
            const response = await axios.post(
                url + `/report/hide-post/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                showToast('success', 'Ẩn bài viết thành công');
                onClose();
                onUpdatePosts(id);
            }
        } catch (error) {
            console.error('Failed to hide posts:', error);
            showToast('error', 'Có lỗi xảy ra khi ẩn bài viết');
        }
    };
    const declinePostConfirm = (id) => {
        confirmAlert({
            title: 'Giữ nguyên bài viết',
            message: 'Bạn có chắc chắn muốn giữ nguyên bài viết này?',
            closeOnClickOutside: false,
            customUI: ({ onClose }) => (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '20px',
                        borderRadius: '8px',
                        background: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}
                >
                    <h2 style={{ marginBottom: '10px', fontSize: '18px' }}>
                        Giữ nguyên bài viết
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn giữ nguyên bài viết này?
                    </p>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '10px',
                        }}
                    >
                        <button
                            onClick={onClose}
                            style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = '#e53935')
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = '#f44336')
                            }
                        >
                            <Cancel style={{ marginRight: '5px' }} />
                            Huỷ
                        </button>
                        <button
                            onClick={() => {
                                declinePost(id);
                                onClose();
                            }}
                            style={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '8px 15px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s',
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.backgroundColor = '#43a047')
                            }
                            onMouseLeave={(e) =>
                                (e.target.style.backgroundColor = '#4caf50')
                            }
                        >
                            <CheckCircle style={{ marginRight: '5px' }} />
                            Xác nhận
                        </button>
                    </div>
                </div>
            ),
        });
    };

    const declinePost = async (id) => {
        try {
            const response = await axios.put(
                url + `/report/decline-hide-post/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                showToast('success', 'Giữ nguyên bài viết thành công');
                onClose();
                onUpdatePosts(id);
            }
        } catch (error) {
            console.error('Failed to decline report:', error);
            showToast('error', 'Có lỗi xảy ra khi giữ nguyên bài viết');
        }
    };
    const fetchReportReasons = async (postId) => {
        try {
            const response = await axios.get(
                `${url}/report/get-reason-report/${postId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                setReportReasons(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch report reasons:', error);
            showToast('error', 'Không thể tải lý do báo cáo');
        }
    };
    useEffect(() => {
        if (post.postId) {
            fetchReportReasons(post.postId);
            console.log(post.postId);
        }
    }, [post.postId]);
    return (
        <div
            id="modal-overlay"
            onMouseDown={handleOutsideClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-2/4 px-8 h-fit max-h-[90vh] flex flex-col relative">
                {/* Header */}
                <div className="flex items-center justify-between my-2">
                    <div className="flex items-center">
                        <img
                            src={post.user.avatar}
                            alt="Avatar"
                            className="w-11 h-11 rounded-full object-cover mr-4"
                        />
                        <span className="text-lg font-semibold dark:text-white">
                            {post.user.firstname + ' ' + post.user.lastname}
                        </span>
                    </div>
                </div>

                {/* Nội dung bài viết */}
                <div className="flex-1 overflow-y-auto">
                    <div className="my-4">
                        <div
                            ref={contentRef}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                            className={`transition-max-height duration-300 overflow-hidden dark:text-white ${
                                isExpanded ? 'max-h-full' : `max-h-36`
                            }`}
                            style={{
                                WebkitMaskImage:
                                    !isExpanded && showReadMore
                                        ? 'linear-gradient(180deg, black 60%, transparent)'
                                        : 'none',
                            }}
                        />
                        {showReadMore && (
                            <button
                                onClick={toggleExpand}
                                className="text-blue-500 hover:underline mt-2"
                            >
                                {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                            </button>
                        )}
                        {post.image && (
                            <img
                                src={post.image}
                                alt="user post"
                                className="h-60 my-3"
                            />
                        )}
                    </div>
                    <div className="flex pb-2 border-b"></div>
                    {/* Danh sách bình luận */}
                    {/* <div className="mt-2">
                        {comments.length > 0 ? (
                            comments.map((cmt) => (
                                <Comment
                                    key={cmt.id}
                                    cmt={cmt}
                                    postId={post.postId}
                                />
                            ))
                        ) : (
                            <div className="pb-4 pt-2 text-inherit">
                                <em>Chưa có bình luận nào</em>
                            </div>
                        )}
                    </div> */}
                    {post.hiddenReason && (
                        <List
                            sx={{
                                width: '100%',
                                maxWidth: 600,
                                bgcolor: 'background.paper',
                                marginTop: 2,
                                borderRadius: 2,
                            }}
                        >
                            <ListItem alignItems="flex-start">
                                {' '}
                                <ListItemText>
                                    Lý do ẩn : {post.hiddenReason}
                                </ListItemText>
                            </ListItem>
                        </List>
                    )}
                    {reportReasons.length > 0 && (
                        <List
                            sx={{
                                width: '100%',
                                maxWidth: 600,
                                bgcolor: 'background.paper',
                                marginTop: 2,
                                borderRadius: 2,
                            }}
                            subheader={
                                <ListSubheader
                                    component="div"
                                    id="nested-list-subheader"
                                    sx={{
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        color: 'text.primary',
                                    }}
                                >
                                    Lý do báo cáo
                                </ListSubheader>
                            }
                        >
                            {reportReasons.map((reason, index) => (
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar src={reason.user.avatar} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            reason.user.firstname +
                                            ' ' +
                                            reason.user.lastname
                                        }
                                        secondary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                sx={{
                                                    color: 'text.primary',
                                                    display: 'inline',
                                                }}
                                            >
                                                {reason.reason}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </div>

                <div className="flex pb-2 border-b"></div>
                {/* Nút Duyệt và Từ chối */}
                {post.state == 'pending' && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="secondary"
                            variant="contained"
                            startIcon={<CheckIcon />}
                            onClick={() =>
                                acceptPendingPostConfirmm(post.postId)
                            }
                        >
                            Duyệt bài viết
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<CloseIcon />}
                            onClick={() => setOpenDeclineModal(true)}
                        >
                            Từ chối
                        </Button>
                    </div>
                )}
                {post.state == 'hidden' && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => deletePostConfirm(post.postId)}
                        >
                            Xoá bài viết
                        </Button>
                    </div>
                )}
                {post.state == 'approved' && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="secondary"
                            variant="contained"
                            startIcon={<VisibilityOffIcon />}
                            onClick={() => hidePostConfirm(post.postId)}
                        >
                            Ẩn bài viết
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => deletePostConfirm(post.postId)}
                        >
                            Xoá bài viết
                        </Button>
                    </div>
                )}
                {post.count && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<VisibilityOffIcon />}
                            onClick={() => hidePostConfirm(post.postId)}
                        >
                            Ẩn bài viết
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            startIcon={<CloseIcon />}
                            onClick={() => declinePostConfirm(post.postId)}
                        >
                            Giữ nguyên
                        </Button>
                    </div>
                )}
                <Modal
                    open={openDeclineModal}
                    onClose={handleDeclineClose}
                    aria-labelledby="decline-modal-title"
                    aria-describedby="decline-modal-description"
                >
                    <Box
                        sx={{
                            p: 4,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            width: 600,
                            height: 230,
                            mx: 'auto',
                            mt: 10,
                            position: 'absolute', // Set to absolute or fixed for custom positioning
                            top: '200px', // Adjust distance from top
                            left: '50%', // Adjust distance from left
                            transform: 'translateX(-50%)', // Center horizontally
                        }}
                    >
                        <Typography
                            id="decline-modal-title"
                            variant="h6"
                            component="h2"
                        >
                            Nhập lý do từ chối
                        </Typography>
                        <TextField
                            size="large"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            label="Lý do từ chối"
                            multiline
                            maxRows={4}
                            fullWidth
                            variant="outlined"
                            sx={{ mt: 2 }} // Adjust font size and line height
                        />
                        <div className="flex justify-end gap-4 mt-4">
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleDeclineClose}
                            >
                                Huỷ
                            </Button>
                            <Button
                                color="secondary"
                                variant="contained"
                                onClick={() => {
                                    if (!reason.trim()) {
                                        toast.error(
                                            'Vui lòng nhập lý do từ chối!'
                                        );
                                        return;
                                    }
                                    declinePendingPost(post.postId, reason);
                                    setReason('');
                                    handleDeclineClose();
                                }}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

export default PostDetailModal;
