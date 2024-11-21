import axios from 'axios';
import React, { useEffect } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import { useState, useRef } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import Navbar from '../../components/BookHeader/Navbar';
import SettingsModal from '../../components/BookHeader/SettingModal';
import Epub, { Rendition, Contents } from 'epubjs';
import { useCallback } from 'react';
import { useMemo } from 'react';
import ControlModal from '../../components/BookHeader/ControlModal';
import { useLocation, useParams } from 'react-router-dom';
import { url } from '../../config/config';
import BookmarkModal from '../../components/BookHeader/BookmarkModal';
import useBookContent from '../../hooks/useBookContent';

export const readerContext = React.createContext(null);

const BookReader = () => {
    const [location, setLocation] = useLocalStorageState('persist-location', {
        defaultValue: 0,
    });
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const locationState = useLocation();
    const [page, setPage] = useState('');
    const [size, setSize] = useState(100);
    const [selectedFont, setSelectedFont] = useState(`Arial`);
    const reactReaderRef = useRef(null);
    const [isScrollMode, setIsScrollMode] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [epubOptions, setEpubOptions] = useState({
        flow: isScrollMode ? 'scrolled' : 'paginated',
        manager: 'continuous',
    });
    const toc = useRef([]);
    const locationChanged = async (epubcfi) => {
        setLocation(epubcfi);
        if (reactReaderRef?.current && toc.current) {
            const { displayed, href } =
                reactReaderRef?.current?.location?.start;
            const chapter = toc.current.find((item) => item.href === href);
            setPage(chapter ? chapter.label : '');
            const isBookmarked = bookmarks.some(
                (bookmark) => bookmark.location === epubcfi
            );
            setIsBookmarked(isBookmarked);
        }
    };
    const [rendition, setRendition] = useState(undefined);
    const { bookContents, searchBookContents } = useBookContent(rendition?.book);
    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
    const [isControlModalOpen, setIsControlModalOpen] = useState(false);
    const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [selectedColor, setSelectedColor] = useState('light');
    const [highlights, setHighlights] = useState([]);
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false); // Trạng thái để điều khiển hiển thị bảng chọn màu
    const [colorPickerPosition, setColorPickerPosition] = useState({
        top: 0,
        left: 0,
    });
    const [searchResults, setSearchResults] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    const colors = ['red', 'green', 'blue', 'yellow'];
    const colorPickerRef = useRef(null);
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };
    useEffect(() => {
        if (!book) {
            fetchBook(id);
        }
    }, [id]);
    useEffect(() => {
        if (book && book?.epubUrl) {
            fetchBookmarks(user.userId, id);
            fetchHighlights(user.userId, id);
        }
    }, [book]);
    const fetchBook = async (id) => {
        try {
            const response = await axios.get(url + `/book/${id}`);
            console.log(response.data);
            setBook(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSettingsClick = () => {
        setIsSettingModalOpen(true);
    };
    const closeSettingModal = () => {
        setIsSettingModalOpen(false);
    };
    const handleControlClick = () => {
        setIsControlModalOpen(true);
    };
    const closeControlModal = () => {
        setIsControlModalOpen(false);
    };
    const handleShowBookmark = () => {
        setIsBookmarkModalOpen(true);
    };
    const handleCopyLink = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                alert('URL đã được sao chép vào bộ nhớ tạm!'); // Thông báo khi sao chép thành công
            })
            .catch((error) => {
                console.error('Lỗi khi sao chép URL:', error);
            });
    };
    const fetchBookmarks = async (userId, bookId) => {
        try {
            const response = await axios.get(
                `${url}/bookmark/${userId}/${bookId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBookmarks(response.data);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
        }
    };
    const fetchHighlights = async (userId, bookId) => {
        try {
            const response = await axios.get(
                `${url}/highlight/${userId}/${bookId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setHighlights(response.data);
        } catch (error) {
            console.error('Error fetching highlights:', error);
        }
    };
    const handleBookmark = async () => {
        if (reactReaderRef?.current) {
            const currentLocation =
                reactReaderRef?.current?.location?.start?.cfi;
            // Kiểm tra nếu bookmark đã tồn tại
            const existingBookmark = bookmarks.find(
                (bookmark) => bookmark.location === currentLocation
            );

            if (existingBookmark) {
                deleteBookmark(existingBookmark.bookmarkId);
            } else {
                try {
                    const response = await axios.post(
                        `${url}/bookmark/create-bookmark`,
                        {
                            userId: user?.userId,
                            bookId: book?.bookId,
                            location: currentLocation,
                            date: new Date().toISOString(),
                            content: page,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setBookmarks([response.data, ...bookmarks]);
                    setIsBookmarked(true);
                } catch (error) {
                    console.error('Error adding bookmark:', error);
                }
            }
        }
    };
    const deleteBookmark = async (bookmarkId) => {
        try {
            await axios.delete(`${url}/bookmark/${bookmarkId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            // Cập nhật danh sách bookmark sau khi xoá
            setBookmarks((prevBookmarks) =>
                prevBookmarks.filter(
                    (bookmark) => bookmark.bookmarkId !== bookmarkId
                )
            );
            setIsBookmarked(false);
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };
    const createHighlight = async (highlight) => {
        try {
            const response = await axios.post(
                `${url}/highlight/create-highlight`,
                {
                    highlight,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.status === 201) {
                setHighlights((prevHighlights) => [
                    response.data,
                    ...prevHighlights,
                ]);
                console.log('Highlight created successfully:', response.data);
            } else {
                console.error('Failed to create highlight:', response.data);
            }
        } catch (error) {
            console.error('Error creating highlight:', error);
        }
    };
    const onShowHighlight = async (rendition) => {
        // Hiển thị các highlight đã lưu
        highlights.forEach((highlight) => {
            console.log(highlight.color);
            const highlightColor = highlight.color
            rendition.annotations.highlight(
                highlight.cfiRange, 
                {},  // Không cần data bổ sung nếu không sử dụng callback
                null,  // Không cần callback
                '',  // Không cần className
                {
                    'fill': highlightColor,  // Màu nền của highlight
                    'opacity': 1,  // Độ mờ
                    'mix-blend-mode': 'multiply'  // Hiệu ứng pha trộn
                }

            );
        });
    };
    const deleteHighlight = async (highlightId, cfiRange) => {
        try {
            // Xoá highlight khỏi annotations
            if (rendition) {
                console.log('deleted')
                rendition?.annotations.remove(cfiRange,'highlight');
            }
    
            // Xoá highlight khỏi database thông qua API
            const response = await axios.delete(
                `${url}/highlight/${highlightId}`, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            if (response.status === 200) {
                // Cập nhật lại state sau khi xoá highlight thành công
                setHighlights((prevHighlights) =>
                    prevHighlights.filter((highlight) => highlight.highlightId !== highlightId)
                );
                console.log('Highlight deleted successfully!');
            } else {
                console.error('Failed to delete highlight in database');
            }
        } catch (error) {
            console.error('Error deleting highlight:', error);
        }
    };
    
    console.log(highlights);
    const handleFullScreen = () => {
        setIsFullScreen(!!document.fullscreenElement);
        setIsSettingModalOpen(false);
        setIsControlModalOpen(false);
    };
    console.log(selectedFont);
    const updateFontSize = async (size) => {
        reactReaderRef?.current?.themes?.fontSize(`${size}%`);
    };
    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullScreen);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreen);
        };
    }, []);
    useEffect(() => {
        setEpubOptions({
            ...epubOptions,
            flow: isScrollMode ? 'scrolled' : 'paginated',
            manager: 'continuous',
        });
    }, [isScrollMode]);
    useEffect(() => {
        if (reactReaderRef.current) {
            updateTheme(reactReaderRef.current, selectedColor);
            // updateScrollMode(reactReaderRef,isScrollMode);
            updateFontSize(size);
            const rendition = reactReaderRef.current;
            if (rendition) {
                rendition.themes?.register('custom', {
                    body: {
                        'font-family': `'${selectedFont}', sans-serif !important`,
                    },
                });
                // Apply the custom theme
                rendition.themes?.select('custom');
            }
        }
    }, [selectedColor, size, selectedFont]);
    useEffect(() => {
        if (rendition) {
            function setRenderHighlights(cfiRange, contents) {
                if (rendition) {
                    const range = rendition.getRange(cfiRange);
                    const rect = range.getBoundingClientRect();
                    setColorPickerPosition({
                        top: rect.top + window.scrollY + rect.height,
                        left: rect.left + window.scrollX,
                    });
                    const newHighlight = {
                        userId: user?.userId,
                        bookId: book?.bookId,
                        text: rendition.getRange(cfiRange).toString(),
                        cfiRange,
                        date: new Date().toISOString(),
                        color: '#FFFF00',
                    };
                    setSelectedHighlight(newHighlight); // Đặt highlight được chọn
                    setIsColorPickerOpen(true);
                }
            }
            rendition.on('selected', setRenderHighlights);
            return () => {
                rendition.off('selected', setRenderHighlights);
            };
        }
    }, [rendition, setHighlights]);
    function handleColorChange(newColor) {
        console.log(newColor);
        if (selectedHighlight) {
            // Cập nhật màu của highlight đã chọn
            const updateHighlight = { ...selectedHighlight, color: newColor };
            createHighlight(updateHighlight);

            rendition.annotations.add(
                'highlight',
                selectedHighlight.cfiRange,
                {},
                null,
                'hl',
                {
                    fill: newColor,
                    'fill-opacity': '0.5',
                    'mix-blend-mode': 'multiply',
                }
            );
            setIsColorPickerOpen(false); // Ẩn bảng chọn màu
        }
    }
    // const handleClickOutside = (event) => {
    //     if (
    //         colorPickerRef.current &&
    //         !colorPickerRef.current.contains(event.target)
    //     ) {
    //         setIsColorPickerOpen(false);
    //         setSelectedColor(null); // Reset màu đã chọn khi nhấn ra ngoài
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener('mousedown', handleClickOutside);
    //     return () => {
    //         document.removeEventListener('mousedown', handleClickOutside);
    //     };
    // }, []);
    const updateTheme = useCallback((rendition, theme) => {
        const themes = rendition.themes;
        switch (theme) {
            case 'dark': {
                themes?.override('color', '#fff');
                themes?.override('background', '#000');
                break;
            }
            case 'light': {
                themes?.override('color', '#000');
                themes?.override('background', '#fff');
                break;
            }
            case 'amber': {
                themes?.override('color', '#000');
                themes?.override('background', '#d4c69f');
                break;
            }
        }
    }, []);
    const lightReaderTheme = useMemo(
        () => ({
            ...ReactReaderStyle,
            readerArea: {
                ...ReactReaderStyle.readerArea,
                transition: undefined,
            },
        }),
        []
    );
    const darkReaderTheme = useMemo(
        () => ({
            ...ReactReaderStyle,
            arrow: {
                ...ReactReaderStyle.arrow,
                color: 'white',
            },
            arrowHover: {
                ...ReactReaderStyle.arrowHover,
                color: '#ccc',
            },
            readerArea: {
                ...ReactReaderStyle.readerArea,
                backgroundColor: 'black',
                transition: undefined,
            },
            titleArea: {
                ...ReactReaderStyle.titleArea,
                color: '#ccc',
            },
            tocArea: {
                ...ReactReaderStyle.tocArea,
                background: '#111',
            },
            tocButtonExpanded: {
                ...ReactReaderStyle.tocButtonExpanded,
                background: '#222',
            },
            tocButtonBar: {
                ...ReactReaderStyle.tocButtonBar,
                background: '#fff',
            },
            tocButton: {
                ...ReactReaderStyle.tocButton,
                color: 'white',
            },
        }),
        []
    );
    const amberReaderTheme = useMemo(
        () => ({
            ...ReactReaderStyle,
            arrow: {
                ...ReactReaderStyle.arrow,
                color: 'white',
            },
            arrowHover: {
                ...ReactReaderStyle.arrowHover,
                color: 'black',
            },
            readerArea: {
                ...ReactReaderStyle.readerArea,
                backgroundColor: '#d4c69f',
                transition: undefined,
            },
            titleArea: {
                ...ReactReaderStyle.titleArea,
                color: 'black',
            },
            tocArea: {
                ...ReactReaderStyle.tocArea,
                background: '#d4c69f',
            },
            tocButtonExpanded: {
                ...ReactReaderStyle.tocButtonExpanded,
                background: '#d4c69f',
            },
            tocButtonBar: {
                ...ReactReaderStyle.tocButtonBar,
                background: 'white',
            },
            tocButton: {
                ...ReactReaderStyle.tocButton,
                color: 'white',
            },
        }),
        []
    );
    
    const handleSearch = async (text) => {
        console.log(text);
        const result = await searchBookContents(text);
        setSearchResults(result);
    };

    console.log(searchResults);
    return (
        <div className="h-screen flex flex-col">
            <Navbar
                onShowBookmark={handleShowBookmark}
                onBookmark={handleBookmark}
                onSettings={handleSettingsClick}
                onFullScreen={toggleFullScreen}
                onControl={handleControlClick}
                title={book?.bookName}
                onSearch={handleSearch}
                searchResults={searchResults}
                setSearchResults={setSearchResults}
                setCurrentPage={setLocation}
                rendition={rendition}
                bookmarked={isBookmarked}
            />
            <div className="flex-grow">
                <ReactReader
                    className="h-full"
                    ref={reactReaderRef}
                    url={book?.epubUrl}
                    location={location}
                    tocChanged={(_toc) => (toc.current = _toc)}
                    readerStyles={
                        selectedColor === 'dark'
                            ? darkReaderTheme
                            : selectedColor === 'amber'
                            ? amberReaderTheme
                            : lightReaderTheme
                    }
                    key={isScrollMode ? 'scrolled' : 'paginated'}
                    epubOptions={epubOptions}
                    locationChanged={locationChanged}
                    getRendition={(rendition) => {
                        reactReaderRef.current = rendition;
                        setRendition(rendition);
                         console.log(rendition);
                        updateTheme(reactReaderRef, selectedColor);
                        updateFontSize(size);
                        onShowHighlight(rendition);
                    }}
                />
            </div>
            <SettingsModal
                isOpen={isSettingModalOpen}
                onClose={closeSettingModal}
                isScrollMode={isScrollMode}
                setIsScrollMode={setIsScrollMode}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                size={size}
                setSize={setSize}
                selectedFont={selectedFont}
                setSelectedFont={setSelectedFont}
            />
            <ControlModal
                isOpen={isControlModalOpen}
                onClose={closeControlModal}
                epubUrl={book?.epubUrl}
                onCopy={handleCopyLink}
            />
            <BookmarkModal
                isOpen={isBookmarkModalOpen}
                onClose={() => setIsBookmarkModalOpen(false)}
                bookmarks={bookmarks}
                onJump={(bookmark) => {
                    setLocation(bookmark.location);
                    setIsBookmarkModalOpen(false);
                    setIsBookmarked(true);
                }}
                onJumpHighlight={(highlights) => {
                    rendition?.display(highlights.cfiRange);
                    setIsBookmarkModalOpen(false);
                }}
                onDeleteBookmark={deleteBookmark}
                highlights={highlights}
                onDeleteHighlight={deleteHighlight}
            />
            {isColorPickerOpen && (
                <div
                    ref={colorPickerRef}
                    style={{
                        position: 'absolute',
                        top: colorPickerPosition.top,
                        left: colorPickerPosition.left,
                        display: 'flex',
                        gap: '10px',
                        padding: '10px',
                        backgroundColor: '#f9f9f9',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        zIndex: 1000,
                    }}
                >
                    {colors.map((color) => (
                        <div
                            key={color}
                            onClick={() => handleColorChange(color)}
                            style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: color,
                                cursor: 'pointer',
                                border: '2px solid #fff',
                                borderRadius: '50%',
                                boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                            }}
                        ></div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookReader;
