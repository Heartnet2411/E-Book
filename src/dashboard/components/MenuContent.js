import * as React from 'react';
import {
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Collapse,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CommentIcon from '@mui/icons-material/Comment';
import GroupIcon from '@mui/icons-material/Group';
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AnnouncementIcon from '@mui/icons-material/Announcement';
const mainListItems = [
    { text: 'Trang chủ', icon: <HomeRoundedIcon />, path: '/admin' },
    { text: 'Bài viết', icon: <ArticleIcon />, path: '/admin/posts' },
    {
        text: 'Bình luận',
        icon: <CommentIcon />,
        subMenu: [
            {
                text: 'Tất cả bình luận',
                icon: <CommentIcon />,
                path: '/admin/comments',
            },
            {
                text: 'Bình luận bị báo cáo',
                icon: <AnnouncementIcon />,
                path: '/admin/report-comments',
            },
        ],
    },
    { text: 'Độc giả', icon: <GroupIcon />, path: '/admin/users' },
];

export default function MenuContent() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigate = useNavigate();
    const [openSubMenuIndex, setOpenSubMenuIndex] = useState(null);
    const [selectedSubIndex, setSelectedSubIndex] = useState(null);
    const handleMenuItemClick = (index, path, hasSubMenu) => {
        if (!path) {
            // Nếu có submenu, chỉ cần mở/đóng submenu
            setOpenSubMenuIndex(openSubMenuIndex === index ? null : index);
            setSelectedIndex(null); // Không chọn mục cha
        } else {
            // Nếu không có submenu, chọn mục và điều hướng
            setSelectedIndex(index);
            navigate(path);
        }
    };
    const handleSubMenuItemClick = (subIndex, path) => {
        setSelectedSubIndex(subIndex);
        navigate(path);
    };
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <ListItemButton
                            selected={selectedIndex === index}
                            sx={{
                                backgroundColor:
                                    selectedIndex === index
                                        ? 'rgba(0, 0, 0, 0.08)'
                                        : 'inherit',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                },
                            }}
                            onClick={() =>
                                handleMenuItemClick(
                                    index,
                                    item.path,
                                    !!item.subMenu
                                )
                            }
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText
                                primary={item.text}
                            />
                            {item.subMenu ? (
                                openSubMenuIndex === index ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )
                            ) : null}
                        </ListItemButton>
                        {item.subMenu && (
                            <Collapse
                                in={openSubMenuIndex === index}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {item.subMenu.map((subItem, subIndex) => (
                                        <ListItem key={subIndex}>
                                            <ListItemButton
                                                selected={
                                                    selectedSubIndex ===
                                                    subIndex
                                                }
                                                onClick={() =>
                                                    handleSubMenuItemClick(
                                                        subIndex,
                                                        subItem.path
                                                    )
                                                }
                                            >
                                                <ListItemIcon>
                                                    {subItem.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={subItem.text}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}
