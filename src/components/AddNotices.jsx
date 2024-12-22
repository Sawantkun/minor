import React, { useState } from "react";
import Attach from "../assets/images/upload.png";
import DateFilterImg from "../assets/svgs/calendar.svg"; // Calendar icon for date filtering
import { Delete } from "@mui/icons-material";

const AddNotices = () => {
  const [notices, setNotices] = useState([
    "Announcements of new programs, initiatives, or projects. (March 1, 2024)",
    "Updates to existing policies or procedures. (March 2, 2024)",
    "Important reminders about upcoming deadlines. (March 3, 2024)",
    "Introduction of new team members. (March 4, 2024)",
    "Launch of new initiatives. (March 5, 2024)",
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (index) => {
    const updatedNotices = notices.filter((_, i) => i !== index);
    setNotices(updatedNotices);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = e.target.noticeTitle.value;
    if (title) {
      setNotices([title, ...notices]);
      e.target.reset();
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-[310px] p-8 bg-gray-50 w-full h-full">
      <h1 className="text-xl font-semibold mb-4">Notice</h1>
      <form onSubmit={handleSubmit} className="mb-6 bg-white rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="flex justify-between w-full">
            <label htmlFor="noticeTitle" className="block font-medium mb-2">
              Notice Title*
            </label>
            <input
              type="text"
              name="noticeTitle"
              id="noticeTitle"
              className="w-[500px] border border-gray-300 p-2 rounded"
              placeholder="Notice Title*"
              required
            />
          </div>
          <div className="flex justify-between w-full">
            <label htmlFor="fileDescription" className="block font-medium mb-2">
              File/URL Description*
            </label>
            <input
              type="text"
              name="fileDescription"
              id="fileDescription"
              className="w-[500px] border border-gray-300 p-2 rounded"
              placeholder="File/URL Description*"
              required
            />
          </div>
        </div>
        <div className="mt-4 w-[500px] ml-auto">
          <label
            htmlFor="fileUpload"
            className="cursor-pointer block font-medium mb-2 text-center border-2 border-dashed rounded p-4 text-gray-500"
          >
            <img className="w-[50px] mx-auto pb-5" src={Attach} alt="" />
            Drag and Upload your file here
          </label>
          <input type="file" id="fileUpload" className="hidden" />
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
                <div className="flex gap-4">
                  <img className="w-[20px]" src={DateFilterImg} alt="" />
                  <span>{notice}</span>
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
