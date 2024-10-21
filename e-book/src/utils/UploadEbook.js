import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase'; // Import Firebase Storage từ cấu hình

const UploadEpub = () => {
    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };
    const handleUploadEpub = () => {
        if (!file) return;

        // Tạo tham chiếu đến file trong Firebase Storage
        const storageRef = ref(storage, `epub/${file.name}`);

        // Tải file lên
        uploadBytes(storageRef, file).then((snapshot) => {
            console.log('File uploaded successfully!');

            // Lấy URL của file đã tải lên
            getDownloadURL(storageRef).then((url) => {
                setFileUrl(url); // Lưu lại URL để sử dụng trong ứng dụng
                console.log('File available at', url);
            });
        });
    };
    const handleUploadImage = () => {
        if (!imageFile) return;

        // Tạo tham chiếu đến file hình ảnh trong Firebase Storage
        const imageRef = ref(storage, `images/${imageFile.name}`);

        // Tải file hình ảnh lên
        uploadBytes(imageRef, imageFile).then((snapshot) => {
            console.log('Image uploaded successfully!');

            // Lấy URL của file hình ảnh đã tải lên
            getDownloadURL(imageRef).then((url) => {
                setImageUrl(url); // Lưu lại URL để sử dụng trong ứng dụng
                console.log('Image available at', url);
            });
        });
    };
    return (
        <div className="flex flex-col">
            <div className="m-8">
                <input type="file" accept=".epub" onChange={handleFileChange} />
                <button onClick={handleUploadEpub}>Upload EPUB</button>
                {fileUrl && (
                    <p>
                        File URL:{' '}
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {fileUrl}
                        </a>
                    </p>
                )}
            </div>
            <div className="m-8">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button onClick={handleUploadImage}>Upload Image</button>
                {imageUrl && (
                    <img className="w-48" src={imageUrl} alt="Uploaded Image" />
                )}
                <p> imageUrl : {imageUrl}</p>
            </div>
        </div>
    );
};

export default UploadEpub;
