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
function TopicDetailModal({ topic, onClose,onUpdateTopics }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const [reason, setReason] = useState('');
    const [openDeclineModal, setOpenDeclineModal] = useState(false);

    const handleOutsideClick = (event) => {
        if (event.target.id === 'modal-overlay') {
            onClose(); // Đóng modal khi click ra ngoài modal
        }
    };
    const handleDeclineClose = () => {
        setOpenDeclineModal(false);
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
    const acceptPendingTopicConfirmm = (id) => {
        confirmAlert({
            title: 'Duyệt chủ đề',
            message: 'Bạn có chắc chắn muốn duyệt chủ đề này?',
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
                        Duyệt chủ đề
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn duyệt chủ đề này?
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
                                acceptPendingTopic(id);
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
    const acceptPendingTopic = async (id) => {
        // Gọi API để duyệt bài viết
        try {
            const response = await axios.post(
                url + `/admin/topic/approved/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                showToast('success', 'Duyệt chủ đề thành công');
                onClose();
                onUpdateTopics(id);
            }
        } catch (error) {
            showToast('error', 'Có lỗi xảy ra khi duyệt chủ đề');
            console.error('Failed to approved posts:', error);
        }
    };
    const declinePendingTopic = async (id, reason) => {
        try {
            const response = await axios.put(
                url + `/admin/topic/rejected/${id}`,
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
                onUpdateTopics(id);
            }
        } catch (error) {
            showToast('error', 'Có lỗi xảy ra khi từ chối');
            console.error('Failed to approved posts:', error);
        }
    };
    const deleteTopicConfirm = (id) => {
        confirmAlert({
            title: 'Xoá chủ đề',
            message: 'Bạn có chắc chắn muốn xoá chủ đề này?',
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
                    onClick: () => deleteTopic(id),
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
                        Xoá chủ đề
                    </h2>
                    <p style={{ marginBottom: '20px', color: '#555' }}>
                        Bạn có chắc chắn muốn xoá chủ đề này?
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
                                deleteTopic(id);
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
    const deleteTopic = async (id) => {
        try {
            const response = await axios.delete(url + `/topics/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                showToast('success', 'Xoá thành công');
                onClose();
                onUpdateTopics(id);
            }
        } catch (error) {
            console.error('Failed to delete posts:', error);
            showToast('error', 'Có lỗi xảy ra khi xoá');
        }
    };
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
                            src={topic.user.avatar}
                            alt="Avatar"
                            className="w-11 h-11 rounded-full object-cover mr-4"
                        />
                        <span className="text-lg font-semibold dark:text-white">
                            {topic.user.firstname + ' ' + topic.user.lastname}
                        </span>
                    </div>
                </div>
                {/* Chủ đề (Topic Name) */}
                <div className="mt-4">
                    <Typography
                        variant="h5"
                        component="h2"
                        className="font-bold text-gray-800 dark:text-white"
                    >
                       Tên chủ đề: {topic.name}
                    </Typography>
                </div>
                <div className="flex pb-2 border-b"></div>
                {/* Nút Duyệt và Từ chối */}
                {topic.state == 'pending' && (
                    <div className="flex justify-end gap-4 mt-4">
                        <Button
                            color="secondary"
                            variant="contained"
                            startIcon={<CheckIcon />}
                            onClick={() =>
                                acceptPendingTopicConfirmm(topic.topicId)
                            }
                        >
                            Duyệt chủ đề
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
                {topic.state == 'approved' && (
                    <div className="flex justify-end gap-4 mt-4">
                        
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<DeleteOutlineIcon />}
                            onClick={() => deleteTopicConfirm(topic.topicId)}
                        >
                            Xoá chủ đề
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
                                    declinePendingTopic(topic.topicId, reason);
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
export default TopicDetailModal