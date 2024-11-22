// src/components/BookHeader/Navbar.js
import React, { useContext } from 'react';
import { IoMdSettings, IoIosListBox, IoMdSearch, ioMd } from 'react-icons/io';
import { MdFullscreen } from 'react-icons/md';
import { RiHeadphoneFill } from 'react-icons/ri';
import { useState,useEffect } from 'react';
import { BsThreeDotsVertical, BsBookmarkPlusFill } from 'react-icons/bs';
import {
    Drawer,
    List,
    ListItemText,
    Paper,
    InputBase,
    IconButton,
    ListSubheader,
    ListItemButton,
} from '@mui/material';
import Highlighter from 'react-highlight-words';
const Navbar = ({
    onShowBookmark,
    isBookmarked,
    onBookmark,
    onSettings,
    onFullScreen,
    onControl,
    title,
    onSearch,
    setSearchResults,
    searchResults,
    rendition,
    bookmarked,
}) => {
    const [searchText, setSearchText] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [highlighted, setHighlighted] = useState(false);
    const [highlightedCFIs, setHighlightedCFIs] = useState([]);
    useEffect(() => {
        if (searchResults.length > 0) {
            // Highlight khi có kết quả tìm kiếm
            const cfiList = searchResults.map(result => result.cfi);
            highlightText(cfiList);
            setHighlighted(true); // Đánh dấu là đã highlight
        }
    }, [searchResults]);
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            removeHighlights();
            onSearch(searchText);
            setShowResults(true);
        }
    };
    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 100);
        // setSearchResults([]);
    };
    const highlightText = (cfiList) => {

        cfiList.forEach((cfi) => {
            if (rendition) {
                rendition.annotations.add('highlight', cfi, {},
                    null,
                    'hls',
                    {
                        fill: 'yellow',
                        'fill-opacity': '0.6',
                        'mix-blend-mode': 'multiply',
                    }
                );
            }
        });
        setHighlightedCFIs(cfiList);

    };

    const onListItemClick = async (cfi, searchResults, rendition) => {
        await rendition?.display(cfi);
    };
    const removeHighlights = () => {
        if (rendition) {
            highlightedCFIs.forEach((cfi) => {
                rendition.annotations.remove(cfi, 'highlight');
            });

            // Xóa danh sách cfiRange đã lưu
            setHighlightedCFIs([]);
        }
    };

    return (
        <nav className="navbar flex justify-between bg-gray-900 text-white p-3">
            <div className="flex items-center">
                <IoMdSearch size={24} className="mr-4 hover:cursor-pointer" />
                <input
                    type="text"
                    className=" p-2 rounded-lg text-black h-8"
                    placeholder="Tìm kiếm..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowResults(true)}
                    onBlur={handleBlur}
                />
                {showResults && searchResults.length > 0 && (
                    <div className="absolute top-14  text-black left-0 w-110 bg-white shadow-lg rounded-lg max-h-96 overflow-y-auto z-50">
                        <List
                            style={{
                                width: '400px',
                                marginTop: 1,
                                backgroundColor: 'background.paper',
                            }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader
                                    component="div"
                                    id="nested-list-subheader"
                                    style={{ width: '100%' }}
                                >
                                    {searchResults.length} kết quả
                                </ListSubheader>
                            }
                        >
                            {searchResults.map((item, index) => {
                                return item ? (
                                    <ListItemButton
                                        onMouseDown={() =>
                                            onListItemClick(
                                                item.cfi,
                                                searchText,
                                                rendition
                                            )
                                        }
                                        key={index}
                                    >
                                        <ListItemText>
                                            <Highlighter
                                                searchWords={[searchText]}
                                                autoEscape
                                                textToHighlight={item.excerpt}
                                                // highlightStyle={{
                                                //     backgroundColor: 'yellow',
                                                // }}
                                            />
                                        </ListItemText>
                                    </ListItemButton>
                                ) : null;
                            })}
                        </List>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-center">
                <h1>{title}</h1>
            </div>
            <ul className="custom flex items-center space-x-6">
                <li>
                    {/* <RiHeadphoneFill size={24} className="hover:cursor-pointer"/> */}
                    <IoIosListBox
                        size={24}
                        className="hover:cursor-pointer"
                        onClick={onShowBookmark}
                    />
                </li>
                <li>
                    {bookmarked ? (
                        <BsBookmarkPlusFill
                            size={22}
                            onClick={onBookmark}
                            color="yellow"
                            className="hover:cursor-pointer"
                        />
                    ) : (
                        <BsBookmarkPlusFill
                            size={22}
                            onClick={onBookmark}
                            // color="yellow"
                            className="hover:cursor-pointer"
                        />
                    )}
                </li>
                <li>
                    <IoMdSettings
                        size={24}
                        onClick={onSettings}
                        className="hover:cursor-pointer"
                    />
                </li>
                <li>
                    <MdFullscreen
                        size={26}
                        onClick={onFullScreen}
                        className="hover:cursor-pointer"
                    />
                </li>
                <li>
                    <BsThreeDotsVertical
                        size={20}
                        className="hover:cursor-pointer"
                        onClick={onControl}
                    />
                </li>
            </ul>
        </nav>
    );
};
export default Navbar;
