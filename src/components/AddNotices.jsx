import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Attach from "../assets/images/upload.png";
import DateFilterImg from "../assets/svgs/calendar.svg";
import { Delete, Visibility } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { db, storage } from "../firebase";

const AddNotices = () => {
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formField, setFormField] = useState({
    title: "",
    description: "",
    pdf: null,
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [files, setFiles] = useState([]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'notices'));
      let noticesData = [];

      for (const docSnapshot of querySnapshot.docs) {
        const notice = docSnapshot.data();
        let pdfUrl = null;

        // Check if pdfUrl exists before trying to get download URL
        if (notice.pdfUrl) {
          try {
            // If pdfUrl already contains the full URL
            if (notice.pdfUrl.startsWith('http')) {
              pdfUrl = notice.pdfUrl;
            } else {
              // Otherwise, get the download URL from Firebase storage
              pdfUrl = await getDownloadURL(ref(storage, notice.pdfUrl));
            }
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        }

        noticesData.push({
          id: docSnapshot.id,
          title: notice.title,
          description: notice.description,
          issuedDate: notice.createdAt?.toDate(),
          pdfUrl: pdfUrl,
          icon: DateFilterImg,
        });
      }

      noticesData.sort((a, b) => b.issuedDate - a.issuedDate);
      noticesData = noticesData.map(notice => ({
        ...notice,
        issuedDate: notice.issuedDate?.toLocaleDateString(),
      }));

      setNotices(noticesData);
      console.log('Fetched Notices:', noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notice?')) {
      setDeleteLoading(true);
      setSelectedNoticeId(id);
      try {
        // Delete the document from Firestore
        await deleteDoc(doc(db, 'notices', id));
        // After successful deletion, refresh the notices list
        fetchNotices();
        alert('Notice deleted successfully');
      } catch (error) {
        console.error('Error deleting notice:', error);
        alert('Failed to delete notice');
      } finally {
        setDeleteLoading(false);
        setSelectedNoticeId(null);
      }
    }
  };

  const handleViewPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('No PDF available for this notice');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!files.length || !files.some(file => file.type === "pdf")) {
        alert("Please upload a PDF file");
        setLoading(false);
        return;
      }

      // Get the PDF file from the files array
      const pdfFile = files.find(file => file.type === "pdf");

      if (!pdfFile || !pdfFile.file) {
        alert("Invalid PDF file");
        setLoading(false);
        return;
      }

      // Upload file to Firebase Storage
      const fileRef = ref(storage, `notices/${Date.now()}_${pdfFile.file.name}`);
      await uploadBytes(fileRef, pdfFile.file);
      const fileUrl = await getDownloadURL(fileRef);

      // Add document to Firestore
      const docRef = await addDoc(collection(db, 'notices'), {
        title: formField.title,
        description: formField.description,
        pdfUrl: fileUrl,
        createdAt: new Date(),
      });

      // Reset form fields
      setFormField({ title: "", description: "", pdf: null });
      setFiles([]);

      // Refresh notices list
      fetchNotices();
      alert("Notice uploaded successfully!");
    } catch (error) {
      console.error("Error uploading notice:", error);
      alert("Failed to upload notice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    uploadedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles((prevFiles) => [
            ...prevFiles,
            { type: "image", name: file.name, src: reader.result, file }
          ]);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setFiles((prevFiles) => [
          ...prevFiles,
          { type: "pdf", name: file.name, file }
        ]);
      }
    });
  };

  const handleRemoveFile = (e, index) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="ml-[300px] p-8 bg-gray-50 w-full h-full">
      <h1 className="text-xl font-semibold mb-4">Notice</h1>
      <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between w-full">
            <label htmlFor="title" className="block font-medium mb-2">
              Notice Title*
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="w-[500px] border border-gray-300 p-2 rounded"
              placeholder="Notice Title*"
              required
              value={formField.title}
              onChange={(e) => setFormField({ ...formField, title: e.target.value })}
            />
          </div>
          <div className="flex justify-between w-full">
            <label htmlFor="description" className="block font-medium mb-2">
              File/URL Description*
            </label>
            <input
              type="text"
              name="description"
              id="description"
              className="w-[500px] border border-gray-300 p-2 rounded"
              placeholder="File/URL Description*"
              required
              value={formField.description}
              onChange={(e) => setFormField({ ...formField, description: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 w-[500px] ml-auto border-2 border-dashed rounded p-4 text-gray-500">
          <label
            htmlFor="fileUpload"
            className="cursor-pointer block font-medium mb-2 text-center"
          >
            {files.length === 0 && (
              <>
                <img className="w-[50px] mx-auto pb-5" src={Attach} alt="" />
                Drag and Upload your file here
              </>
            )}
            <div className="grid grid-cols-12 gap-4">
              {files.map((file, index) => (
                <div key={index} className="col-span-4">
                  {file.type === "image" && (
                    <div className="relative">
                      <img
                        src={file.src}
                        alt={file.name}
                        className="w-48 h-auto block border border-gray-300 rounded-lg"
                      />
                      <span
                        onClick={(e) => handleRemoveFile(e, index)}
                        className="absolute top-1 right-2 text-red-600 font-bold cursor-pointer"
                      >
                        <CloseIcon fontSize="2px" />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {files.map((file, index) => (
              <div key={`pdf-${index}`} className="text-start mt-2">
                {file.type === "pdf" && (
                  <div className="relative flex items-center">
                    <h3 className="text-truncate flex-1">PDF: {file.name}</h3>
                    <span
                      onClick={(e) => handleRemoveFile(e, index)}
                      className="text-red-600 font-bold cursor-pointer"
                    >
                      <CloseIcon fontSize="2px" />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
            accept="application/pdf,image/*"
            multiple
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-purple text-white rounded hover:opacity-75"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <div>
        <h2 className="text-lg font-semibold mb-4">Past Notices</h2>
        <input
          type="text"
          placeholder="Search notices..."
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
        <ul className="space-y-2">
          {loading ? (
            <p className="text-lg font-medium text-center">Loading notices...</p>
          ) : (
            <>
              {filteredNotices.length > 0 ? (
                filteredNotices.map((notice) => (
                  <li
                    key={notice.id}
                    className="flex justify-between items-center p-3 bg-white shadow-sm rounded"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <img className="w-[20px]" src={DateFilterImg} alt="Calendar Icon" />
                        <span className="font-semibold">{notice.title}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {notice.issuedDate && <span>{notice.issuedDate}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleViewPdf(notice.pdfUrl)}
                        className="text-blue-600 hover:text-blue-800 flex items-center"
                        title="View PDF"
                      >
                        <Visibility />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className={`text-red-600 hover:text-red-800 flex items-center ${
                          deleteLoading && selectedNoticeId === notice.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={deleteLoading && selectedNoticeId === notice.id}
                        title="Delete Notice"
                      >
                        {deleteLoading && selectedNoticeId === notice.id ? (
                          <span>...</span>
                        ) : (
                          <Delete />
                        )}
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-center p-4">No notices found</li>
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddNotices;
