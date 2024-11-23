import React, { useState } from 'react';
import SearchImg from "../assets/svgs/search.svg"; // Ensure to import the correct icon
import DateFilterImg from "../assets/svgs/calendar.svg"; // Calendar icon for date filtering

const Notices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const noticesList = [
      {
        id: 1,
        title: "Team Meeting to Discuss Strategic Planning for the Upcoming Quarter",
        issuedDate: "2024-11-22",
        icon: DateFilterImg
      },
      {
        id: 2,
        title: "Holiday Notice for Diwali: Office Closed from 23rd to 27th November",
        issuedDate: "2024-11-20",
        icon: DateFilterImg
      },
      {
        id: 3,
        title: "Scheduled Server Maintenance on 18th November: Expect Downtime from 1 AM to 5 AM",
        issuedDate: "2024-11-18",
        icon: DateFilterImg
      },
      {
        id: 4,
        title: "Project Deadline Reminder: Submit All Deliverables by 15th November End of Day",
        issuedDate: "2024-11-15",
        icon: DateFilterImg
      },
      {
          id: 5,
          title: "Urgent Notice: Server Maintenance Scheduled for Tonight, Prepare Accordingly",
          issuedDate: "2024-11-18",
          icon: DateFilterImg
        },
        {
            id: 6,
            title: "Final Reminder: Project Deadline Approaching on 15th November for All Teams",
            issuedDate: "2024-11-15",
            icon: DateFilterImg
        },
        {
            id: 7,
            title: "Critical Update: Server Maintenance and Security Patching Scheduled for 18th November",
            issuedDate: "2024-11-18",
            icon: DateFilterImg
        },
        {
            id: 8,
            title: "Submission Deadline: Submit Final Project Reports by 15th November Midnight",
            issuedDate: "2024-11-15",
            icon: DateFilterImg
        },
        {
          id: 9,
          title: "Team Meeting to Discuss Strategic Planning for the Upcoming Quarter",
          issuedDate: "2024-11-22",
          icon: DateFilterImg
        },
        {
          id: 10,
          title: "Holiday Notice for Diwali: Office Closed from 23rd to 27th November",
          issuedDate: "2024-11-20",
          icon: DateFilterImg
        },
        {
          id: 11,
          title: "Scheduled Server Maintenance on 18th November: Expect Downtime from 1 AM to 5 AM",
          issuedDate: "2024-11-18",
          icon: DateFilterImg
        },
        {
          id: 12,
          title: "Project Deadline Reminder: Submit All Deliverables by 15th November End of Day",
          issuedDate: "2024-11-15",
          icon: DateFilterImg
        }
        // Add more notices here
    ];


    const filteredNotices = noticesList.filter(notice => {
        const matchesSearchTerm = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = selectedDate ? notice.issuedDate === selectedDate : true;
        return matchesSearchTerm && matchesDate;
  });

  return (
    <div className="ml-[310px] w-full p-5">
      {/* Heading */}

      {/* Search and Date Filter */}
      <div className="flex gap-4 mb-5">
      <div className="flex justify-between w-full items-center">
      <h1 className="text-3xl font-bold text-gray-800 pb-8">Notices</h1>
        {/* Search Input */}
      <div className="flex gap-3 px-2">
      <div className="flex border-2 px-5 rounded-lg w-[400px]  h-[45px]">
            <img className="w-6 opacity-50" src={SearchImg} alt="" />
         <input
            type="text"
            placeholder="Search"
            className="border-none text-black text-xl rounded-lg px-4 py-2 focus:outline-none bg-[#F8F9FA] "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
         </div>

        {/* Date Filter */}
        <div className="flex items-center border-2 px-5 py-2 rounded-lg h-[45px] w-[220px] cursor-pointer">
          <input
            type="date"
            className="cursor-pointer border-none text-black text-xl rounded-lg px-4 py-2 focus:outline-none  bg-[#F8F9FA] "
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <div key={notice.id} className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-xl transition-all duration-300">
              {/* Notice Icon */}
              <img src={notice.icon} alt={notice.title} className="w-8 h-8 object-cover" />

              {/* Notice Details */}
              <div className="flex-1 ml-4 flex items-center">
                <h3 className="text-lg font-semibold">{notice.title}</h3>
                <p className="text-lg text-gray-500 pl-2">({notice.issuedDate})</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No notices found.</p>
        )}
      </div>
    </div>
  );
};

export default Notices;
