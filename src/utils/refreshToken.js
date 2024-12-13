import { url } from '../config/config';

export const refreshAccessToken = async () => {
    try {
        const response = await fetch(url + '/user/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('refreshToken'), // Lấy Refresh Token từ localStorage
            }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.accessToken); // Lưu Access Token mới
            console.log('ok');
        } else {
            const data = await response.json();
            if (data.message === 'Refresh token has expired') {
                // Thông báo người dùng
                alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');

                // Điều hướng đến trang đăng nhập
                window.location.href = '/login';
            } else {
                console.error('Lỗi khác:', data.message);
            }
        }
    } catch (error) {
        console.error('Lỗi khi làm mới token:', error);
    }
};
