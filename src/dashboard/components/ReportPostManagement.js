import {
    Grid2,
    Box,
    Typography,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
    Table,
    TableCell,
    TableHead,
    TableRow,
    Button,
    IconButton,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { url } from '../../config/config';
import { DataGrid } from '@mui/x-data-grid';
import { toast, Slide } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import PostDetailModal from './PostDetailModal';

export default function ReportPostManagement() {
    const [posts, setPosts] = useState(null);
    const token = localStorage.getItem('token');
    const [filter, setFilter] = useState('pending');
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const getPosts = async () => {
        try {
            let response;
            response = await fetch(url + `/report/post`, {
                headers: {
                    method: 'GET',
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            const rowsData = data.map((item, index) => ({
                id: item.targetId ? item.targetId : item.postId,
                ...item,
            }));
            setPosts(rowsData);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };
    const convertStatus = (status) => {
        switch (status) {
            case 'pending':
                return 'Đang xử lý';
            case 'reviewed':
                return 'Đã xử lý';
            case 'hidden':
                return 'Đã ẩn';
            default:
                break;
        }
    };
    const convertState = (state) => {
        switch (state) {
            case 'pending':
                return 'Chờ duyệt';
            case 'approved':
                return 'Đã duyệt';
            case 'hidden':
                return 'Đã ẩn';
            default:
                break;
        }
    };
    const convertDate = (dateString) => {
        const date = new Date(dateString);

        // Lấy ngày, tháng, năm
        const day = String(date.getDate()).padStart(2, '0'); // Đảm bảo có 2 chữ số
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
        const year = date.getFullYear();

        // Trả về định dạng "DD/MM/YYYY"
        return `${day}/${month}/${year}`;
    };
    //==========================================================
    //  report table
    const hidePostConfirm = (id) => {
        confirmAlert({
            title: 'Ẩn bài viết',
            message: 'Bạn có chắc chắn muốn ẩn bài viết này?',
            buttons: [
                {
                    label: 'Huỷ',
                    className: 'react-confirm-alert-button cancel',
                },
                {
                    label: 'Xác nhận',
                    className: 'react-confirm-alert-button confirm',
                    onClick: () => hidePost(id),
                },
            ],
            closeOnClickOutside: false,
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
            // const data = await response.json();
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== id)
                );
                toast.success('Ẩn bài viết thành công', {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Failed to hide posts:', error);
        }
    };
    const declinePostConfirm = (id) => {
        confirmAlert({
            title: 'Từ chối ẩn bài viết',
            message: 'Bạn có chắc chắn muốn từ chối ẩn bài viết này?',
            buttons: [
                {
                    label: 'Huỷ',
                    className: 'react-confirm-alert-button cancel',
                },
                {
                    label: 'Xác nhận',
                    className: 'react-confirm-alert-button confirm',
                    onClick: () => declinePost(id),
                },
            ],
            closeOnClickOutside: false,
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
            // const data = await response.json();
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== id)
                );
                toast.success('Đã từ chối', {
                    position: 'top-right',
                    autoClose: 4000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error('Failed to decline report:', error);
        }
    };
    const handleUpdatePosts = (postId) => {
        setPosts((prevPosts) =>
            prevPosts.filter((post) => post.postId !== postId)
        );
    };
    const handleShowPostModal = async (post) => {
        setSelectedPost(post);
        console.log(post);
        setShowPostModal(true);
    };
    useEffect(() => {
        getPosts();
    }, []);
    console.log(posts);
    const reportColumns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'topic',
            headerName: 'Chủ đề',
            width: 300,
            renderCell: (params) => {
                const { name } = params?.value || {};
                return <div>{name}</div>;
            },
        },
        {
            field: 'count',
            headerName: 'Báo cáo',
            width: 100,
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
            renderCell: (params) => {
                const status = params?.row?.status;
                return <div>{convertStatus(status)}</div>;
            },
        },
        {
            field: 'postCreatedAt',
            headerName: 'Ngày đăng',
            width: 180,
            renderCell: (params) => {
                const date = params.row.postCreatedAt;
                return <div>{convertDate(date)}</div>;
            },
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 270,
            renderCell: (params) => {
                return (
                    <div className="flex mt-1 justify-between">
                        <IconButton
                            onClick={() => handleShowPostModal(params.row)}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </div>
                );
            },
        },
    ];
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Grid2 container spacing={4} paddingTop={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ flexGrow: 1, marginBottom: 2 }}
                    >
                        Bộ lọc
                    </Typography>
                </Grid2>
            </Grid2>
            <Grid2 marginTop={3}>
                <DataGrid
                    columns={reportColumns}
                    rows={posts}
                    initialState={{
                        pagination: {
                          paginationModel: { pageSize: 10, page: 0 },
                        },
                      }}
                    disableRowSelectionOnClick
                />
                {showPostModal && (
                    <PostDetailModal
                        key={selectedPost.postId}
                        post={selectedPost}
                        onUpdatePosts={handleUpdatePosts}
                        onClose={() => {
                            setShowPostModal(false);
                        }}
                    />
                )}
            </Grid2>
        </Box>
    );
}
