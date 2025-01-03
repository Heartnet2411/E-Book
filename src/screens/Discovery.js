import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { url } from '../config/config';
import Book from '../components/Book';
import CategorySelector from '../components/CategorySelector';
import CountrySelector from '../components/CountrySelector';
import { FaAngleLeft } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { FaAngleDoubleLeft } from 'react-icons/fa';
import Lottie from 'react-lottie';
import loadingAnimation from '../lotties/loading.json';
import nothing from '../lotties/nothing.json';

function Discovery() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [clearSelected, setClearSelected] = useState(false);
    const [fromYear, setFromYear] = useState('');
    const [toYear, setToYear] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const bookRef = useRef(null);
    const years = [1900, 1950, 1975, 2000, 2010, 2020, 2024];
    const handleFromYearChange = (e) => {
        setFromYear(e.target.value);
        if (toYear && e.target.value > toYear) {
            setToYear('');
        }
    };

    const handleToYearChange = (e) => {
        setToYear(e.target.value);
        if (fromYear && e.target.value < fromYear) {
            setFromYear('');
        }
    };

    const filteredToYears = years.filter(
        (year) => !fromYear || year >= fromYear
    );
    const filteredFromYears = years.filter((year) => !toYear || year <= toYear);

    const countries = [
        'Việt Nam',
        'Hoa Kỳ',
        'Trung Quốc',
        'Đức',
        'Anh',
        'Nhật',
        'Pháp',
        'Nga',
    ];

    // Tính toán các trang cần hiển thị
    const getPaginationPages = (currentPage, totalPages) => {
        const pages = [];

        // Nếu tổng số trang nhỏ hơn hoặc bằng 5, hiển thị tất cả
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Nếu trang hiện tại nằm trong khoảng đầu
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages - 2);
                pages.push(totalPages - 1);
                pages.push(totalPages);
            }
            // Nếu trang hiện tại nằm trong khoảng cuối
            else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push(2);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            }
            // Nếu trang hiện tại nằm giữa
            else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    // Sử dụng hàm getPaginationPages trong render
    const paginationPages = getPaginationPages(currentPage, totalPages);

    useEffect(() => {
        fetchBooks(currentPage);
    }, [currentPage]);

    const loadingOption = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const nothingOption = {
        loop: true,
        autoplay: true,
        animationData: nothing,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    useEffect(() => {
        // Hàm để lấy danh sách thể loại từ API
        const fetchCategories = async () => {
            try {
                const response = await axios.get(url + '/category');
                setCategories(response.data); // Giả sử dữ liệu trả về là mảng các thể loại
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = () => {
        console.log({
            searchText,
            selectedCategories,
            fromYear,
            toYear,
            selectedCountries,
        });
        setLoading(true);
        fetchBooks(1);
        setCurrentPage(1);
        if (bookRef.current) {
            bookRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const fetchBooks = (page) => {
        setLoading(true);
        setClearSelected(true);
        axios
            .get(`${url}/book/search`, {
                params: {
                    page,
                    name: searchText || '', // Sử dụng giá trị mặc định nếu không có searchText
                    categoryIds: selectedCategories.join(','), // Chuyển mảng sang chuỗi cho nhiều thể loại
                    countries: selectedCountries.join(','),
                    startYear: fromYear || '',
                    endYear: toYear || '',
                },
            })
            .then((res) => {
                console.log(res.data.books);
                setBooks(res.data.books);
                setTotalPages(res.data.totalPages);
                setLoading(false);
                setClearSelected(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setClearSelected(false);
            });
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Chia books thành các hàng, mỗi hàng chứa 5 sách
    const rows = [];
    for (let i = 0; i < books.length; i += 5) {
        rows.push(books.slice(i, i + 5));
    }

    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-slate-900 dark:to-black "
        >
            <Header user={user} />
            <div className="min-h-screen p-4 max-w-screen-2xl mx-auto">
                <div className="w-3/5 mx-auto flex flex-col  justify-center mb-4">
                    <div className="mb-4 mt-4">
                        <label className="block text-4xl font-medium text-gray-700 dark:text-white text-center">
                            Tìm kiếm sách
                        </label>
                        <input
                            placeholder="Nhập nội dung tìm kiếm"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="px-4 py-2 mt-1 block w-full border border-gray-300 rounded-xl shadow-sm dark:text-white dark:bg-gray-700 dark:border-gray-900"
                        />
                    </div>
                    <div className="flex mb-4">
                        <CategorySelector
                            categories={categories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            clearSelected={clearSelected}
                        />

                        <div className="flex-1 mx-2">
                            <label className="block text-lg font-medium text-gray-700 dark:text-white">
                                Năm xuất bản
                            </label>
                            <select
                                value={fromYear}
                                onChange={handleFromYearChange}
                                className="px-4 py-2 mt-1 block w-full border border-gray-300 rounded-xl shadow-sm dark:text-white dark:bg-gray-700 dark:border-gray-900"
                            >
                                <option value="">-- Từ năm --</option>
                                {filteredFromYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={toYear}
                                onChange={handleToYearChange}
                                className="px-4 py-2 mt-1 block w-full border border-gray-300 rounded-xl shadow-sm dark:text-white dark:bg-gray-700 dark:border-gray-900"
                            >
                                <option value="">-- Đến năm --</option>

                                {filteredToYears.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <CountrySelector
                            countries={countries}
                            selectedCountries={selectedCountries}
                            setSelectedCountries={setSelectedCountries}
                            clearSelected={clearSelected}
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="w-1/4 py-2 text-lg mx-auto bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-200"
                    >
                        Tìm kiếm sách
                    </button>
                </div>

                <div ref={bookRef}>
                    {loading ? (
                        <div className="flex justify-center items-center min-h-screen dark:text-white font-medium text-3xl">
                            <Lottie
                                options={loadingOption}
                                height="50%"
                                width="50%"
                            />
                        </div>
                    ) : books.length > 0 ? (
                        rows.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className="flex flex-wrap justify-center gap-4 mb-2"
                            >
                                {row.map((book) => (
                                    <Book book={book} />
                                ))}
                            </div>
                        ))
                    ) : (
                        <div>
                            <Lottie
                                options={nothingOption}
                                height="30%"
                                width="30%"
                            />
                            <p className="text-center text-lg">
                                Không có sách nào
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {books.length > 0 ? (
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="px-5 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-500"
                        >
                            <FaAngleDoubleLeft size={22} />
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-5 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-500"
                        >
                            <FaAngleLeft size={22} />
                        </button>

                        {paginationPages.map((page, index) =>
                            page === '...' ? (
                                <span
                                    key={index}
                                    className="px-4 pt-4 mx-1 font-extrabold dark:text-white"
                                >
                                    . . . .
                                </span> // Hiển thị dấu "..."
                            ) : (
                                <button
                                    key={index}
                                    onClick={() =>
                                        typeof page === 'number' &&
                                        handlePageChange(page)
                                    }
                                    className={`px-4 py-2 mx-1 rounded-lg ${
                                        page === currentPage
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 dark:text-white'
                                    }`}
                                    disabled={page === '...'}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-5 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
                        >
                            <FaAngleRight size={22} />
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-5 py-2 mx-1 bg-blue-500 text-white rounded-lg disabled:bg-gray-400"
                        >
                            <FaAngleDoubleRight size={22} />
                        </button>
                    </div>
                ) : null}
            </div>
            <Footer />
        </div>
    );
}

export default Discovery;
