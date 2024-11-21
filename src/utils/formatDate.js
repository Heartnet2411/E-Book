import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);

    const differenceInDays = Math.floor(
        (now - createdDate) / (1000 * 60 * 60 * 24)
    );

    if (differenceInDays < 1) {
        // Nếu trong ngày, hiển thị giờ (ví dụ: 3 giờ trước)
        return formatDistanceToNow(createdDate, {
            addSuffix: true,
            locale: vi,
        });
    } else if (differenceInDays <= 7) {
        // Trong vòng 7 ngày, hiển thị ngày (ví dụ: 2 ngày trước)
        return `${differenceInDays} ngày trước`;
    } else {
        // Sau 7 ngày, hiển thị ngày/tháng/năm
        return format(createdDate, 'dd/MM/yyyy');
    }
};
