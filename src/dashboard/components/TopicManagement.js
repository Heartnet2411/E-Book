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

export default function TopicManagement(){
    const [topics, setTopics] = useState(null);
    const [selectedTopic,setSelectedTopic] = useState(null)
    const token = localStorage.getItem('token');
    const [filter, setFilter] = useState('pending');
    const [showTopicModal, setShowTopicModal] = useState(false);
}