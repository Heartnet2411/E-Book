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
import TopicDetailModal from './TopicDetailModal';

export default function TopicManagement(){
    const [topics, setTopics] = useState(null);
    const [selectedTopic,setSelectedTopic] = useState(null)
    const token = localStorage.getItem('token');
    const [filter, setFilter] = useState('pending');
    const [showTopicModal, setShowTopicModal] = useState(false);
    const handleFilter = (event) => {
        setFilter(event.target.value);
    };
    const getTopics = async ()=>{
        let response;
        try {
            response = await fetch(url + `/topics/list/${filter}`, {
                headers: {
                    method: 'GET',
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            const rowsData = data.map((item, index) => ({
                id: item.topicId,
                ...item,
            }));
            setTopics(rowsData);
        } catch (error) {
            console.error('Failed to fetch topics:', error);
        }
    };
    const handleShowTopicModal = async (topic) => {
        setSelectedTopic(topic);
        setShowTopicModal(true);
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
    const handleUpdateTopics = (topicId) => {
        setTopics((prevTopics) =>
            prevTopics.filter((topic) => topic.topicId !== topicId)
        );
    };
    useEffect(() => {
        getTopics();
    }, [filter]);
    //===========Table===================
    const topicColumns = [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'name',
            headerName: 'Tên chủ đề',
            width: 300,
        },
        {
            field: 'createdAt',
            headerName: 'Ngày đăng',
            width: 150,
            renderCell: (params) => {
                const date = params?.row?.createdAt;
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
            field: 'action',
            headerName: 'Hành động',
            width: 120,
            renderCell: (params) => {
                return (
                    <IconButton onClick={() => handleShowTopicModal(params.row)}>
                        <VisibilityIcon />
                    </IconButton>
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
                             
                            <MenuItem value="pending">
                                Chờ duyệt
                            </MenuItem>
                            <MenuItem value="approved">
                                Đã duyệt
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid2>
            </Grid2>
            <Grid2 marginTop={3}>
                <DataGrid
                    columns={topicColumns}
                    rows={topics}
                    rowHeight={50}
                    disableRowSelectionOnClick
                />
                {showTopicModal && (
                    <TopicDetailModal
                        key={selectedTopic.topicId}
                        topic={selectedTopic}
                         onUpdateTopics={handleUpdateTopics}
                        onClose={() => {
                            setShowTopicModal(false);
                        }}
                    />
                )}
            </Grid2>
            </Box>
    )
}
