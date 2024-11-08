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

export default function PostManagement() {
    const [posts, setPosts] = useState(null);
    const token = localStorage.getItem('token');
    const [filter, setFilter] = useState('pending');
    const declineText = 'Từ chối thành công';
    const hideText = 'Đã ẩn bài viết';
    const handleFilter = (event) => {
        setFilter(event.target.value);
    };
    const getPosts = async () => {
        try {
            let response;
            if (filter === 'reported') {
                response = await fetch(url + `/report/post`, {
                    headers: {
                        method: 'GET',
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else {
                response = await fetch(url + `/post/list/${filter}`, {
                    headers: {
                        method: 'GET',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
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

    const acceptPendingPostConfirmm = (id) => {
        confirmAlert({
            title: 'Duyệt bài viết',
            message: 'Bạn có chắc chắn muốn duyệt bài viết này?',
            buttons: [
                {
                    label: 'Huỷ',
                    className: 'react-confirm-alert-button cancel',
                },
                {
                    label: 'Xác nhận',
                    className: 'react-confirm-alert-button confirm',
                    onClick: () => acceptPendingPost(id, token),
                },
            ],
            closeOnClickOutside: false,
        });
    };
    const acceptPendingPost = async (id, token) => {
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
            // const data = await response.json();
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== id)
                );
                toast.success('Duyệt thành công', {
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
            console.error('Failed to approved posts:', error);
        }
    };
    const declinePendingPostConfirm = (id) => {
        confirmAlert({
            title: 'Từ chối duyệt bài viết',
            message: 'Bạn có chắc chắn muốn từ chối duyệt bài viết này?',
            buttons: [
                {
                    label: 'Huỷ',
                    className: 'react-confirm-alert-button cancel',
                    onClick: () => {},
                },
                {
                    label: 'Xác nhận',
                    className: 'react-confirm-alert-button confirm',
                    onClick: () => declinePendingPost(id, declineText),
                },
            ],
            closeOnClickOutside: false,
        });
    };
    const declinePendingPost = async (id, declineText) => {
        try {
            const response = await axios.put(
                url + `/admin/post/rejected/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                // Nếu thành công thì cập nhật lại danh sách bài viết
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== id)
                );
                toast.success(declineText, {
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
            console.error('Failed to approved posts:', error);
        }
    };

    const hidePostConfirmm = (id) => {
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
                // Nếu thành công thì cập nhật lại danh sách bài viết
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
    useEffect(() => {
        getPosts();
    }, [filter]);
    console.log(posts);
    // console.log(filter);
    const postColumns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Tiêu đề', width: 200 },
        {
            field: 'topic',
            headerName: 'Chủ đề',
            width: 180,
            renderCell: (params) => {
                const { name } = params?.value || {};
                return <div>{name}</div>;
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
            field: 'detail',
            headerName: '',
            width: 120,
            renderCell: (params) => {
                return <Button startIcon={<VisibilityIcon />}></Button>;
            },
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 280,
            renderCell: (params) => {
                switch (filter) {
                    case 'pending':
                        return (
                            <div className="flex mt-1 justify-between">
                                <Button
                                    color="secondary"
                                    variant="contained"
                                    startIcon={<CheckIcon />}
                                    onClick={() =>
                                        acceptPendingPostConfirmm(params.row.id)
                                    }
                                >
                                    Duyệt bài viết
                                </Button>
                                <Button
                                    color="error"
                                    variant="contained"
                                    startIcon={<CloseIcon />}
                                    onClick={() =>
                                        declinePendingPostConfirm(params.row.id)
                                    }
                                >
                                    Từ chối
                                </Button>
                            </div>
                        );
                    case 'approved':
                        return (
                            <div className="flex mt-1 justify-between">
                                <Button
                                    size="medium"
                                    color="secondary"
                                    variant="contained"
                                    startIcon={<VisibilityOffIcon />}
                                    onClick={() =>
                                        hidePostConfirmm(params.row.id)
                                    }
                                >
                                    Ẩn bài viết
                                </Button>
                                <Button
                                    color="error"
                                    variant="contained"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={() =>
                                        deletePostConfirm(params.row.id)
                                    }
                                >
                                    Xoá bài viết
                                </Button>
                            </div>
                        );
                    case 'hidden':
                        return (
                            <div className="flex mt-1 justify-between">
                                <Button
                                    color="error"
                                    variant="contained"
                                    startIcon={<DeleteOutlineIcon />}
                                    onClick={() =>
                                        deletePostConfirm(params.row.id)
                                    }
                                >
                                    Xoá bài viết
                                </Button>
                            </div>
                        );
                    default:
                        break;
                }
            },
        },
    ];
    const reportColumns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'title', headerName: 'Tiêu đề', width: 250 },
        {
            field: 'topic',
            headerName: 'Chủ đề',
            width: 150,
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
            width: 120,
            renderCell: (params) => {
                const status = params?.row?.status;
                return <div>{convertStatus(status)}</div>;
            },
        },
        // {
        //     field: 'createdAt',
        //     headerName: 'Ngày báo cáo',
        //     width: 150,
        //     renderCell: (params) => {
        //         const date = params?.row?.createdAt;
        //         return <div>{convertDate(date)}</div>;
        //     },
        // },
        {
            field: 'detail',
            headerName: '',
            width: 120,
            renderCell: (params) => {
                return <Button startIcon={<VisibilityIcon />}></Button>;
            },
        },
        {
            field: 'actions',
            headerName: 'Hành động',
            width: 270,
            renderCell: (params) => {
                return (
                    <div className="flex mt-1 justify-between">
                        <Button
                            size="medium"
                            color="secondary"
                            variant="contained"
                            startIcon={<VisibilityOffIcon />}
                            onClick={() => hidePostConfirm(params.row.id)}
                        >
                            Ẩn bài viết
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            startIcon={<CloseIcon />}
                            onClick={() => declinePostConfirm(params.row.id)}
                        >
                            Từ chối
                        </Button>
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
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Loại</InputLabel>
                        <Select
                            label="Comment Type"
                            value={filter}
                            onChange={handleFilter}
                        >
                            {/* <MenuItem value="all">Tất cả</MenuItem> */}
                            <MenuItem value="pending">
                                Bài viết chờ duyệt
                            </MenuItem>
                            <MenuItem value="approved">
                                Bài viết đã duyệt
                            </MenuItem>
                            <MenuItem value="reported">
                                Bài viết bị báo cáo
                            </MenuItem>
                            <MenuItem value="hidden">Bài viết bị ẩn</MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
            <Grid2 marginTop={3}>
                {filter === 'reported' ? (
                    <DataGrid
                        columns={reportColumns}
                        rows={posts}
                        rowHeight={50}
                    />
                ) : (
                    <DataGrid
                        columns={postColumns}
                        rows={posts}
                        rowHeight={50}
                    />
                )}
            </Grid2>
        </Box>
    );
}
