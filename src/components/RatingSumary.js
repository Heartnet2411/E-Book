import React, { useEffect, useState } from 'react';
import { url } from '../config/config';

const RatingSummary = ({ bookId }) => {
    const [ratingSummary, setRatingSummary] = useState(null);

    useEffect(() => {
        const fetchRatingSummary = async () => {
            try {
                const response = await fetch(
                    url + `/book/comments/sumary/${bookId}`
                );
                const data = await response.json();
                setRatingSummary(data);
            } catch (error) {
                console.error('Error fetching rating summary:', error);
            }
        };
        fetchRatingSummary();
    }, [bookId]);

    if (!ratingSummary) return <p>Loading...</p>;

    return (
        <div className="p-4 bg-gray-100 rounded-lg w-3/4 mt-4 dark:bg-gray-800">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                Thông tin đánh giá
            </h2>
            <div className="flex items-center mt-2 space-x-2">
                <span className="text-3xl font-bold text-yellow-500">
                    {ratingSummary.averageRating.toFixed(1)}
                </span>
                <span className="text-base text-gray-500 dark:text-gray-400">
                    Trung bình trên {ratingSummary.totalReviews} đánh giá
                </span>
            </div>

            <div className="mt-4 space-y-2 mb-2">
                {Object.entries(ratingSummary.ratings).map(([star, count]) => (
                    <div key={star} className="flex items-center">
                        <span className="w-16 text-base text-center font-semibold text-gray-600 dark:text-gray-400">
                            {star} sao:
                        </span>
                        <div className="flex-1 h-3 mx-2 bg-gray-200 rounded-xl">
                            <div
                                className={`h-3 rounded-xl ${
                                    count > 0 ? 'bg-yellow-400' : 'bg-gray-200'
                                }`}
                                style={{
                                    width:
                                        count > 0
                                            ? `${
                                                  (count /
                                                      ratingSummary.totalReviews) *
                                                  100
                                              }%`
                                            : '100%',
                                }}
                            ></div>
                        </div>
                        <span className="text-base font-medium text-gray-600 dark:text-gray-400">
                            {count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingSummary;
