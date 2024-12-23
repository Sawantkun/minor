import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Attach from "../assets/images/upload.png";
import DateFilterImg from "../assets/svgs/calendar.svg"; // Calendar icon for date filtering
import { Delete } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { storage } from "../firebase";

const AddNotices = () => {
  const [notices, setNotices] = useState([
    {
      title: "Announcements of new programs, initiatives, or projects. (March 1, 2024)",
      description: "Details about new programs.",
      createdAt: "2024-03-01",
    },
    {
      title: "Updates to existing policies or procedures. (March 2, 2024)",
      description: "Policy updates description.",
      createdAt: "2024-03-02",
    },
    {
      title: "Important reminders about upcoming deadlines. (March 3, 2024)",
      description: "Reminder details.",
      createdAt: "2024-03-03",
    },
    {
      title: "Introduction of new team members. (March 4, 2024)",
      description: "Meet our new team members.",
      createdAt: "2024-03-04",
    },
    {
      title: "Launch of new initiatives. (March 5, 2024)",
      description: "Details about new initiatives.",
      createdAt: "2024-03-05",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [formField, setFormField] = useState({
    title: "",
    description: "",
    pdf: null,
  });

  const handleDelete = (index) => {
    const updatedNotices = notices.filter((_, i) => i !== index);
    setNotices(updatedNotices);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fileRef = ref(storage, `notices/${formField.pdf?.name}`);
      await uploadBytes(fileRef, formField.pdf);
      const fileUrl = await getDownloadURL(fileRef);
      const newNotice = {
        title: formField.title,
        description: formField.description,
        pdfUrl: fileUrl,
        createdAt: new Date(),
      };
      setFormField({ title: "", description: "", pdf: null });
      setNotices((prevNotices) => [newNotice, ...prevNotices]);
      alert("Notice uploaded successfully!");
    } catch (error) {
      console.error("Error uploading notice:", error);
      alert("Failed to upload notice. Please try again.");
    }
  };

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    uploadedFiles.forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFiles((prevFiles) => [
            ...prevFiles,
            { type: "image", name: file.name, src: reader.result },
          ]);
        };
        reader.readAsDataURL(file);
      } else if (file.type === "application/pdf") {
        setFiles((prevFiles) => [
          ...prevFiles,
          { type: "pdf", name: file.name },
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
                        className="absolute top-1 right-2 text-red-600 font-bold"
                      >
                        <CloseIcon fontSize="2px" />
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {files.map((file, index) => (
              <div key={index} className="text-start mt-2">
                {file.type === "pdf" && (
                  <h3 className="text-truncate">PDF: {file.name}</h3>
                )}
              </div>
            ))}
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
            required
            multiple
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-purple text-white rounded hover:opacity-75"
        >
          Upload
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
          {filteredNotices.length > 0 ? (
            filteredNotices.map((notice, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 bg-gray-100 rounded"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <img className="w-[20px]" src={DateFilterImg} alt="Calendar Icon" />
                    <span className="font-semibold">{notice.title}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Delete />
                </button>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No notices found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AddNotices;
