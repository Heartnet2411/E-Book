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
function CommentDetailModal({ comment, onClose, onUpdateComments }) {
    const [reportReasons, setReportReasons] = useState([]);
    const token = localStorage.getItem('token');
    const handleOutsideClick = (event) => {
        if (event.target.id === 'modal-overlay') {
            onClose(); // Đóng modal khi click ra ngoài modal
        }
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
    const hideCommentConfirm = (id) => {
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
                        Ẩn bình luận
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn ẩn bình luận này?
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
                                hideComment(id);
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
    const hideComment = async (id) => {
        try {
            const response = await axios.post(
                url + `/report/hide-comment/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                showToast('success', 'Ẩn bình luận thành công');
                onClose();
                onUpdateComments(id);
            }
        } catch (error) {
            console.error('Failed to hide posts:', error);
            showToast('error', 'Có lỗi xảy ra khi ẩn bình luận');
        }
    };
    const deleteCommentConfirm = (id, type) => {
        confirmAlert({
            title: 'Xoá bài viết',
            message: 'Bạn có chắc chắn muốn xoá bình luận này?',
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
                    onClick: () => deleteComment(id, type),
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
                        Xoá bình luận
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn xoá bình luận này?
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
                                deleteComment(id, type);
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
    const deleteComment = async (id, type) => {
        console.log(type)
        try {
            let response;
            if (type === 'book') {
                response = await axios.delete(url + `/book/comments/delete-by-admin/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                response = await axios.delete(url + `/post/comment/delete-by-admin/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            if (response.status === 204) {
                showToast('success', 'Xoá thành công');
                onClose();
                onUpdateComments(id);
            }
        } catch (error) {
            console.error('Failed to delete posts:', error);
            showToast('error', 'Có lỗi xảy ra khi xoá');
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
                        Giữ nguyên bình luận
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn giữ nguyên bình luận này?
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
                                declineComment(id);
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

    const declineComment = async (id) => {
        try {
            const response = await axios.put(
                url + `/report/decline-hide-comment/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                showToast('success', 'Giữ nguyên bình luận thành công');
                onClose();
                onUpdateComments(id);
            }
        } catch (error) {
            console.error('Failed to decline report:', error);
            showToast('error', 'Có lỗi xảy ra khi giữ nguyên bình luận');
        }
    };
    return (
        <div
            id="modal-overlay"
            onMouseDown={handleOutsideClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-2/4 px-8 h-fit max-h-[90vh] flex flex-col relative">
                <div className="flex justify-between items-center mb-4">
                    <Typography
                        variant="h6"
                        component="h2"
                        className="text-gray-800 dark:text-white font-bold"
                    >
                        Chi tiết bình luận
                    </Typography>
                    <Button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-white"
                    >
                        <CloseIcon />
                    </Button>
                </div>
                <div className="w-full flex items-center">
                    <img
                        src={comment.user.avatar}
                        className="w-10 h-10 rounded-full object-cover ml-4 mr-2"
                    />
                    <div className="w-full bg-gray-200 rounded-xl relative dark:bg-gray-800">
                        <p className="text-base font-medium px-4 w-11/12 dark:text-white">
                            {comment.user.firstname +
                                ' ' +
                                comment.user.lastname}
                        </p>
                        <p className="text-base font-normal px-4 pb-1 w-11/12 dark:text-white">
                            {comment.content || comment.comment}
                        </p>
                    </div>
                </div>
                {comment.hiddenReason && reportReasons.length > 0 && (
                    <div className="flex pb-2 border-b"></div>
                )}
                {comment.hiddenReason && (
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
                                Lý do ẩn : {comment.hiddenReason}
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
                {comment.status && <div className="flex pb-2 border-b"></div>}
                {/* Nút Ẩn và xoá */}
                {comment.status ==true && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="secondary"
                            variant="contained"
                            startIcon={<VisibilityOffIcon />}
                            onClick={() =>
                                hideCommentConfirm(comment.commentId)
                            }
                        >
                            Ẩn bài viết
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() =>
                                deleteCommentConfirm(
                                    comment.commentId,
                                    comment.type
                                )
                            }
                        >
                            Xoá bài viết
                        </Button>
                    </div>
                )}
                {comment.status == false && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() =>
                                deleteCommentConfirm(
                                    comment.commentId,
                                    comment.type
                                )
                            }
                        >
                            Xoá bài viết
                        </Button>
                    </div>
                )}
                {comment.count && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<VisibilityOffIcon />}
                            onClick={() => hideCommentConfirm(comment.commentId)}
                        >
                            Ẩn bình luận
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            startIcon={<CloseIcon />}
                            onClick={() => declinePostConfirm(comment.commentId)}
                        >
                            Giữ nguyên
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
export default CommentDetailModal;
