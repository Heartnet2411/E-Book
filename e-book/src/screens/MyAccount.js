import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { MdEdit } from 'react-icons/md';

function MyAccount() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [edit, setEdit] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));

        if (user) {
            setFirstName(user.firstName || '');
            setLastName(user.lastName || '');
            setEmail(user.email || '');
            setDateOfBirth(user.dateOfBirth || '');
            setGender(user.gender || '');
            setPhoneNumber(user.phoneNumber || '');
        }
    }, []);

    return (
        <div
            className="bg-gradient-to-b from-slate-50 via-slate-100 to-white 
             dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-black min-h-screen"
        >
            <Header user={user} />
            <div className="px-16">
                <div className="mx-auto ">
                    <div className="flex justify-center relative">
                        <img
                            src={user.background}
                            className="w-4/5 h-56 object-cover rounded-b-2xl"
                            alt="user backround img "
                        />
                        <div className="absolute bottom-0 w-3/5 translate-y-1/2 flex justify-between items-end">
                            <img
                                src={user.avatar}
                                className="w-40 h-40 object-cover rounded-full "
                                alt="user avatar img"
                            />
                            <div className="flex items-center justify-between w-full">
                                <div className="text-black dark:text-white ml-4">
                                    <p className="font-bold text-3xl">
                                        {user.firstName + ' ' + user.lastName}
                                    </p>
                                    <p className="font-medium text-lg">
                                        0 người theo dõi
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEdit(!edit)}
                                    disabled={!edit}
                                    className="flex items-center text-black dark:text-white bg-gray-300 dark:bg-gray-700 p-2 px-4 rounded-xl"
                                >
                                    <MdEdit size={24} />
                                    <span className="font-semibold text-lg ml-2">
                                        Chỉnh sửa thông tin
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-28 grid grid-cols-10 w-4/5 mx-auto  gap-4 ">
                        <div className="col-span-3 p-4 bg-gray-200 rounded-xl h-max">
                            <ul className="list-none p-4 space-y-2  rounded-md">
                                <li className="p-3 rounded-xl border border-gray-400 hover:bg-gray-50 cursor-pointer">
                                    <a
                                        href="#personal-info"
                                        className="text-gray-700 font-medium"
                                    >
                                        Thông tin cá nhân
                                    </a>
                                </li>
                                <li className="p-3 rounded-xl border border-gray-400 hover:bg-gray-50 cursor-pointer">
                                    <a
                                        href="#your-posts"
                                        className="text-gray-700 font-medium"
                                    >
                                        Bài viết của bạn
                                    </a>
                                </li>
                                <li className="p-3 rounded-xl border border-gray-400 hover:bg-gray-50 cursor-pointer">
                                    <a
                                        href="#saved-posts"
                                        className="text-gray-700 font-medium"
                                    >
                                        Bài viết đã lưu
                                    </a>
                                </li>
                                <li className="p-3 rounded-xl border border-gray-400 hover:bg-gray-50 cursor-pointer">
                                    <a
                                        href="#saved-books"
                                        className="text-gray-700 font-medium"
                                    >
                                        Sách đã lưu
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-span-7 p-4 bg-gray-200 rounded-xl">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-1">
                                    <label className="block text-gray-600">
                                        Họ
                                    </label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
                                        disabled={edit}
                                        onChange={(e) =>
                                            setFirstName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-gray-600">
                                        Tên
                                    </label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
                                        disabled={edit}
                                        onChange={(e) =>
                                            setLastName(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-gray-600">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
                                        disabled
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-gray-600">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
                                        disabled={edit}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-gray-600">
                                        Giới tính
                                    </label>
                                    <select
                                        value={gender}
                                        className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
                                        disabled={edit} // Nếu edit là false thì select sẽ bị vô hiệu hóa
                                        onChange={(e) =>
                                            setGender(e.target.value)
                                        } // Cập nhật giới tính khi chọn
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-gray-600">
                                        Ngày sinh
                                    </label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        className="w-full p-3 border rounded-md bg-gray-100 text-gray-800"
                                        disabled={edit}
                                        onChange={(e) =>
                                            setDateOfBirth(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                {!edit ? (
                                    <button className="font-semibold text-lg px-8 py-2 bg-blue-600 rounded-xl">
                                        {' '}
                                        Lưu
                                    </button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyAccount;
