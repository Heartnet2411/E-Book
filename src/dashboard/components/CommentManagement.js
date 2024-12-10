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
    Stack
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
import CommentDetailModal from './CommentDetailModal';
export default function CommentManagement() {
    const [comments, setComments] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const token = localStorage.getItem('token');
    const [rowCount, setRowCount] = useState(0); // Tổng số bản ghi
    const [pageState, setPageState] = useState({
        page: 0,
        pageSize: 10,
        isLoading:false
    });
    const handleFilter = (event) => {
        setFilter(event.target.value);
    };
    const fetchComments = async () => {
        setPageState((prev) => ({ ...prev, isLoading: true }));
        try {
            let response;
            response = await fetch(
                url +
                    `/admin/comments/${filter}?page=${
                        pageState.page + 1
                    }&pageSize=${pageState.pageSize}&sort=DESC`,
                {
                    headers: {
                        method: 'GET',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            const comments = data.allComments;
            const rowsData = comments.map((item, index) => ({
                id: item.commentId,
                ...item,
            }));
             setComments(rowsData);
            setPageState(old=>({
                ...old,
                isLoading: false,
                data:rowsData,
                total: data.totalCount,
            }))
            // setRowCount(data.totalCount);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
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
    const convertType = (type) => {
        switch (type) {
            case 'book':
                return 'Bình luận sách';
            case 'post':
                return 'Bình luận bài viết';
        }
    };
    const handleUpdateComments = (commentId) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.commentId !== commentId)
        );
    };

    const commentColumns = [
        { field: 'id', headerName: 'ID', width: 150 },
        {
            field: 'type',
            headerName: 'Loại',
            width: 200,
            renderCell: (params) => {
                const { type } = params.row;
                return <div>{convertType(type)}</div>;
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
            field: 'actions',
            headerName: 'Hành động',
            width: 280,
            renderCell: (params) => {
                return (
                    <Stack direction="row" spacing={2}>
                        <IconButton
                        onClick={() => handleShowCommentModal(params.row)}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Stack>
                );
            },
        },
    ];
    const handlePaginationModelChange = (newPaginationModel) => {
        setPageState(newPaginationModel);
    };
    const handleShowCommentModal = async (comment) => {
        setSelectedComment(comment);
        console.log(comment);
        setShowCommentModal(true);
    };
    useEffect(() => {
        fetchComments();
    }, [filter, pageState.page, pageState.pageSize]);
    return (
        <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            <Grid2 container spacing={4} paddingTop={3}>
                <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
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
                            <MenuItem value="all">Tất cả</MenuItem>
                            <MenuItem value="book-cmt">Bình luận sách</MenuItem>
                            <MenuItem value="post-cmt">
                                Bình luận bài viết
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
            <Grid2 marginTop={3}>
                <DataGrid
                    columns={commentColumns}
                    rows={comments}
                    rowCount={pageState.total}
                    loading={pageState.isLoading}
                    pagination
                    paginationModel={
                       pageState
                    }
                    onPaginationModelChange={handlePaginationModelChange}
                    paginationMode="server"

                    disableRowSelectionOnClick
                />
            </Grid2>
            {showCommentModal && (
                    <CommentDetailModal
                        key={selectedComment.commentId}
                        comment={selectedComment}
                        onUpdateComments={handleUpdateComments}
                        onClose={() => {
                            setShowCommentModal(false);
                        }}
                    />
                )}
        </Box>
    );
}
