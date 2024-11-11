import axios from 'axios';
import React, { useEffect } from 'react';
import { ReactReader, ReactReaderStyle } from 'react-reader';
import { useState, useRef } from 'react';
import useLocalStorageState from 'use-local-storage-state';
import Navbar from '../../components/BookHeader/Navbar';
import SettingsModal from '../../components/BookHeader/SettingModal';
import { Rendition, Contents } from 'epubjs';
import { useCallback } from 'react';
import { useMemo } from 'react';
import ControlModal from '../../components/BookHeader/ControlModal';
import { useLocation, useParams } from 'react-router-dom';
import { url } from '../../config/config';
import BookmarkModal from '../../components/BookHeader/BookmarkModal';

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
            setPage(
                `Page ${displayed?.page} of ${displayed?.total} ${
                    chapter ? `in chapter` + chapter.label : ''
                }`
            );
        }
    };
    const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
    const [isControlModalOpen, setIsControlModalOpen] = useState(false);
    const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [selectedColor, setSelectedColor] = useState('light');
    const [searchQuery, setSearchQuery] = useState('start');
    const [searchResults, setSearchResults] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [currentBookmarkText, setCurrentBookmarkText] = useState('');
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
        setIsBookmarkModalOpen(false);
        setIsControlModalOpen(false);
    };
    const closeSettingModal = () => {
        setIsSettingModalOpen(false);
    };
    const handleControlClick = () => {
        setIsControlModalOpen(true);
        setIsBookmarkModalOpen(false);
        setIsSettingModalOpen(false);
    };
    const closeControlModal = () => {
        setIsControlModalOpen(false);
    };
    const handleShowBookmark = () => {
        setIsBookmarkModalOpen(true);
        setIsSettingModalOpen(false);
        setIsControlModalOpen(false);
        console.log(bookmarks);
        console.log(location);
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
    const handleBookmark = async () => {
        if (reactReaderRef?.current) {
            const currentLocation =
                reactReaderRef?.current?.location?.start?.cfi;
            console.log(currentBookmarkText);

            const bookmark = {
                userId: 1,
                bookId: book.bookId,
                location: currentLocation,
                date: new Date().toISOString(),
                content: page,
            };

            setBookmarks([...bookmarks, bookmark]);
            setIsBookmarked(!isBookmarked);
        }
        // axios.post(url + '/bookmarks', bookmark)
        // .then((response) => {
        //     console.log('Bookmark saved:', response.data);
        // })
        // .catch((error) => {
        //     console.error('Error saving bookmark:', error);
        // });
    };

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
    return (
        <div className="h-screen flex flex-col">
            <Navbar
                onShowBookmark={handleShowBookmark}
                onBookmark={handleBookmark}
                onSettings={handleSettingsClick}
                onFullScreen={toggleFullScreen}
                onControl={handleControlClick}
                title={book?.bookName}
                // onSearch={handleSearch}
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
                        updateTheme(reactReaderRef, selectedColor);
                        updateFontSize(size);
                    }}
                />
                {/* <div
                    style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '1rem',
                        left: '1rem',
                        textAlign: 'center',
                        zIndex: 1,
                    }}
                >
                    {page}
                </div> */}
            </div>
            {isSettingModalOpen && (
                <div className="fixed top-10 right-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 z-10">
                    <SettingsModal
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
                </div>
            )}
            {isControlModalOpen && (
                <div className="fixed top-11 right-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 z-10">
                    <ControlModal
                        onClose={closeControlModal}
                        epubUrl={book?.epubUrl}
                        onCopy={handleCopyLink}
                    />
                </div>
            )}
            {isBookmarkModalOpen && (
                <div className="fixed top-11 right-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 z-10">
                    <BookmarkModal
                        onClose={() => setIsBookmarkModalOpen(false)}
                        bookmarks={bookmarks}
                        onJump={(bookmark) => {
                            setLocation(bookmark.location);
                            setIsBookmarkModalOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
};
export default BookReader;
