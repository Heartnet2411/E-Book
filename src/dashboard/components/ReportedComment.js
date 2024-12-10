import {
    Grid2,
    Box,
    Typography,
    FormControl,
    MenuItem,
    InputLabel,
    Select,
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
import CommentDetailModal from './CommentDetailModal';
export default function ReportedComment() {
    const [comments, setComments] = useState(null);
    const [selectedComment, setSelectedComment] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showCommentModal, setShowCommentModal] = useState(false);
    const token = localStorage.getItem('token');
    const handleFilter = (event) => {
        setFilter(event.target.value);
    };
    const fetchReports = async () => {
        try {
            const response = await fetch(
                url + `/report/comment?filter=${filter}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await response.json();
            const commentsData= data.map((item,index)=>({
                id:item?.commentId,
                ...item,
            }))
            setComments(commentsData);
        } catch (error) {}
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
            case 'book_comment':
                return 'Bình luận sách';
            case 'post_comment':
                return 'Bình luận bài viết';
        }
    };
    const handleShowCommentModal = async (comment) => {
        setSelectedComment(comment);
        console.log(comment);
        setShowCommentModal(true);
    };
    const handleUpdateComments = (commentId) => {
        setComments((prevComments) =>
            prevComments.filter((comment) => comment.commentId !== commentId)
        );
    };

    //===============Table================================
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
            field: 'count',
            headerName: 'Báo cáo',
            width: 100,
        },
        {
            field: 'createdAt',
            headerName: 'Ngày đăng',
            width: 150,
            renderCell: (params) => {
                const date = params.row.commentCreatedAt;
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
    useEffect(() => {
        fetchReports();
    }, [filter]);
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
                    // rowCount={pageState.total}
                    // loading={pageState.isLoading}
                    // pagination
                    // paginationModel={
                    //    pageState
                    // }
                    // onPaginationModelChange={handlePaginationModelChange}
                    // paginationMode="server"

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

