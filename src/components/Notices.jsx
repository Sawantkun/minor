import React, { useEffect, useState } from 'react';
import SearchImg from "../assets/svgs/search.svg";
import DateFilterImg from "../assets/svgs/calendar.svg";
import { db, storage } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { Visibility } from '@mui/icons-material'; // Import view icon

const Notices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'notices'));
      let noticesData = [];

      for (const doc of querySnapshot.docs) {
        const notice = doc.data();
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
          id: doc.id,
          title: notice.title,
          description: notice.description,
          issuedDate: notice.createdAt?.toDate(),
          pdfUrl: pdfUrl,
          icon: DateFilterImg,
        });
      }

      // Sort notices by date (newest first)
      noticesData.sort((a, b) => b.issuedDate - a.issuedDate);

      // Format dates for display
      noticesData = noticesData.map(notice => ({
        ...notice,
        issuedDate: notice.issuedDate?.toLocaleDateString(),
      }));

      console.log('Fetched Notices:', noticesData);
      setNotices(noticesData);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleViewPdf = (e, pdfUrl) => {
    e.stopPropagation(); // Prevent any parent click events
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    } else {
      alert('No PDF available for this notice');
    }
  };

  const filteredNotices = notices.filter((notice) => {
    const matchesSearchTerm = notice.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? notice.issuedDate === selectedDate : true;
    return matchesSearchTerm && matchesDate;
  });

  return (
    <div className="ml-[310px] w-full p-5">
      <div className="flex gap-4 mb-10 border-b-[1px]">
        <div className="flex justify-between w-full items-center">
          <h1 className="text-3xl font-bold text-gray-800 pb-8">Notices</h1>
          {/* Search Input */}
          <div className="flex gap-3 px-2">
            <div className="flex border-2 px-5 rounded-lg w-[400px] h-[45px]">
              <img className="w-6 opacity-50" src={SearchImg} alt="" />
              <input
                type="text"
                placeholder="Search"
                className="border-none text-black text-xl rounded-lg px-4 py-2 focus:outline-none bg-[#F8F9FA] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center border-2 px-4 py-2 rounded-lg cursor-pointer">
              <input
                type="date"
                className="cursor-pointer border-none text-black rounded-lg focus:outline-none bg-[#F8F9FA]"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-lg font-medium text-center">Loading notices...</p>
        ) : (
          <>
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg hover:shadow-xl transition-all duration-300"
                >
                  {/* Notice Icon */}
                  <img src={notice.icon} alt={notice.title} className="w-8 h-8 object-cover" />

                  {/* Notice Details */}
                  <div className="flex-1 ml-4 flex items-center">
                    <h3 className="text-lg font-semibold">{notice.title}</h3>
                    <p className="text-lg text-gray-500 pl-2">{notice.issuedDate && notice.issuedDate}</p>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={(e) => handleViewPdf(e, notice.pdfUrl)}
                    className="flex items-center text-blue-600 hover:text-blue-800 px-3 py-1 rounded transition-colors duration-300"
                    title="View Notice"
                  >
                    <Visibility className="mr-1" />
                    <span>View</span>
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No notices found.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notices;
