import React, { useState } from 'react';

function ReportModal({ onClose, onSubmit }) {
    const reasons = [
        'Vấn đề liên quan đến người dưới 18 tuổi',
        'Bắt nạt, quấy rối hoặc lạm dụng/ngược đãi',
        'Tự tử hoặc tự gây thương tích',
        'Nội dung mang tính bạo lực, thù ghét hoặc gây phiền toái',
        'Bán hoặc quảng cáo mặt hàng bị hạn chế',
        'Nội dung người lớn',
        'Thông tin sai sự thật, lừa đảo hoặc gian lận',
    ];

    const handleSelectReason = (reason) => {
        console.log('Selected reason:', reason);
        onSubmit(reason);
    };

    const handleOutsideClick = (event) => {
        if (event.target.id === 'modal-overlay') {
            onClose(); // Đóng modal khi click ra ngoài modal
        }
    };

    return (
        <div
            id="modal-overlay"
            onMouseDown={handleOutsideClick}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
        >
            <div className="dark:bg-gray-800 bg-gray-100 text-black dark:text-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 text-2xl"
                >
                    &times;
                </button>
                <h2 className="text-xl font-semibold mb-2">
                    Tại sao bạn báo cáo bài viết này?
                </h2>
                <p className="dark:text-gray-400 text-gray-700 mb-4">
                    Nếu bạn nhận thấy ai đó đang gặp nguy hiểm, đừng chặn chữ mà
                    hãy tìm ngay sự giúp đỡ trước khi báo cáo với The Book
                    Lounge.
                </p>
                <ul className="space-y-3">
                    {reasons.map((reason, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectReason(reason)}
                            className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <span>{reason}</span>
                            <span>&gt;</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default ReportModal;
