import React from 'react';

function Notification({ message, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-bold mb-4">Thông báo</h2>
                <p className="mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default Notification;
