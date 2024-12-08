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
    Stack,
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

export default function HiddenPostManagement() {
    const [posts, setPosts] = useState(null);
    const token = localStorage.getItem('token');
    const [filter, setFilter] = useState('hidden');
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const getPosts = async () => {
        try {
            let response;
            response = await fetch(url + `/post/list/${filter}`, {
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

    const deletePostConfirm = (id) => {
        confirmAlert({
            title: 'Xoá bài viết',
            message: 'Bạn có chắc chắn muốn xoá bài viết này?',
            buttons: [
                {
                    label: 'Huỷ',
                    className: 'react-confirm-alert-button cancel',
                    onClick: () => {},
                },
                {
                    label: 'Xác nhận',
                    className: 'react-confirm-alert-button confirm',
                    onClick: () => deletePost(id),
                },
            ],
            closeOnClickOutside: false,
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
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== id)
                );
                toast.success('Xoá thành công', {
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
            console.error('Failed to delete posts:', error);
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
    }, [filter]);
    const postColumns = [
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
            field: 'createdAt',
            headerName: 'Ngày đăng',
            width: 150,
            renderCell: (params) => {
                const date = params.row.createdAt;
                return <div>{convertDate(date)}</div>;
            },
        },
        {
            field: 'user',
            headerName: 'Người đăng',
            width: 150,
            renderCell: (params) => {
                const { firstname } = params.value || {};
                const { lastname } = params.value || {};
                return <div>{firstname + ' ' + lastname}</div>;
            },
        },
        {
            field: 'state',
            headerName: 'Trạng thái',
            width: 150,
            renderCell: (params) => {
                const state = params?.row?.state;
                return <div>{convertState(state)}</div>;
            },
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 280,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={2}>
                        <IconButton
                            onClick={() => handleShowPostModal(params.row)}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Stack>
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
                    columns={postColumns}
                    rows={posts}
                    rowHeight={50}
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
