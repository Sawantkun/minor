import React, { useEffect, useState } from 'react';
import SearchImg from "../assets/svgs/search.svg"; // Ensure to import the correct icon
import DateFilterImg from "../assets/svgs/calendar.svg"; // Calendar icon for date filtering
import { db } from '../firebase';

const Notices = () => {


  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'notices'));
      const noticesData = [];

      for (const doc of querySnapshot.docs) {
        const notice = doc.data();
        const pdfUrl = notice.pdfUrl ? await getDownloadURL(ref(storage, notice.pdfUrl)) : null;

        noticesData.push({
          id: doc.id,
          title: notice.title,
          description: notice.description,
          issuedDate: notice.createdAt.toDate().toLocaleDateString(),
          pdfUrl: pdfUrl,
          icon: DateFilterImg,
        });
      }

      console.log('Fetched Notices:', noticesData);
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter((notice) => {
    const matchesSearchTerm = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? notice.issuedDate === selectedDate : true;
    return matchesSearchTerm && matchesDate;
  });

  return (
    <div className="ml-[310px] w-full p-5">
      <div className="flex gap-4  mb-10 border-b-[1px]">
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
      <div className="space-y-4 ">
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
