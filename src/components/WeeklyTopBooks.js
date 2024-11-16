import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WeeklyTopBooks = ({ data }) => {
    const navigate = useNavigate();
    const [showAll, setShowAll] = useState(false); // State để theo dõi hiển thị các sách còn lại

    const handleClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    if (data.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400">
                Không có dữ liệu sách đọc nhiều trong tuần.
            </div>
        );
    }

    // Cắt dữ liệu chỉ hiển thị 3 sách đầu tiên hoặc tất cả nếu showAll là true
    const booksToDisplay = showAll ? data : data.slice(0, 3);

    return (
        <div className="py-6 px-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg w-3/5">
            <div className="space-y-4">
                {booksToDisplay.map((item, index) => (
                    <div
                        key={item.book.bookId}
                        className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md flex items-center hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                        {/* Xếp hạng */}
                        <div
                            className={`text-2xl font-bold text-center rounded-full p-4 shadow-md  ${
                                index === 0
                                    ? 'bg-yellow-500 text-white'
                                    : index === 1
                                    ? 'bg-gray-400 text-white'
                                    : 'bg-orange-400 text-white'
                            }`}
                        >
                            #{index + 1}
                        </div>
                        {/* Hình ảnh sách */}
                        <img
                            src={item.book.imageUrl}
                            alt={item.book.bookName}
                            className="w-20 h-28 object-cover rounded-md shadow-md mx-4"
                        />
                        {/* Thông tin sách */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                {item.book.bookName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Tác giả: {item.book.author}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quốc gia: {item.book.country}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Thể loại:{' '}
                                {item.book.categories
                                    .map((category) => category.name)
                                    .join(', ')}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Lượt đọc: {item.totalReadCount}
                            </p>
                        </div>

                        <div>
                            <button
                                onClick={() => handleClick(item.book.bookId)}
                                className="bg-green-500 px-4 py-2 rounded-xl text-white"
                            >
                                Đọc ngay
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Hiển thị nút "Xem thêm" nếu có hơn 3 sách */}
            {data.length > 3 && !showAll && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setShowAll(true)}
                        className="text-blue-500  px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600"
                    >
                        Xem thêm
                    </button>
                </div>
            )}

            {/* Hiển thị nút "Thu gọn" nếu đang hiển thị tất cả */}
            {showAll && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setShowAll(false)}
                        className="text-blue-500 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600"
                    >
                        Thu gọn
                    </button>
                </div>
            )}
        </div>
    );
};

export default WeeklyTopBooks;
