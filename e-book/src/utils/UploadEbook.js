import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from './firebase'; // Import Firebase Storage từ cấu hình

const UploadEpub = () => {
  const [file, setFile] =useState(null);
  const [fileUrl, setFileUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    
    // Tạo tham chiếu đến file trong Firebase Storage
    const storageRef = ref(storage, `epub/${file.name}`);

    // Tải file lên
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("File uploaded successfully!");

      // Lấy URL của file đã tải lên
      getDownloadURL(storageRef).then((url) => {
        setFileUrl(url); // Lưu lại URL để sử dụng trong ứng dụng
        console.log("File available at", url);
      });
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload EPUB</button>
      {fileUrl && <p>File URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>}
    </div>
  );
};  

export default UploadEpub;
