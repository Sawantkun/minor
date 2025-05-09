import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import defaultAvatar from "../assets/svgs/avatar.png";

const AdminEvents = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "eventRequests"));
      const reqs = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setRequests(reqs);
      setLoading(false);
    };
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    await updateDoc(doc(db, "eventRequests", id), { status: "approved" });
    setRequests(requests.map(req => req.id === id ? { ...req, status: "approved" } : req));
  };

  const handleReject = async (id) => {
    await updateDoc(doc(db, "eventRequests", id), { status: "rejected" });
    setRequests(requests.map(req => req.id === id ? { ...req, status: "rejected" } : req));
  };

  return (
    <div className="py-8 ml-[350px] !w-[75vw]">
      <h2 className="text-3xl font-bold mb-8">Event Requests</h2>
      <div className="space-y-6">
        {loading && <div className="text-gray-500">Loading...</div>}
        {!loading && requests.length === 0 && <div className="text-gray-500">No event requests.</div>}
        {requests.map(req => (
          <div key={req.id} className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 border-l-4 border-purple-400">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{req.title}</h3>
                <div className="text-gray-600 mb-1">{req.description}</div>
                <div className="text-gray-500 text-sm">{req.date} | {req.time}</div>
                <div className="text-gray-700 font-semibold">Organizer: {req.organizer}</div>
                {req.location && <div className="text-gray-700 font-semibold">Location: {req.location}</div>}
                {req.meetLink && <a href={req.meetLink} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer">Google Meet Link</a>}
                <div className="flex items-center gap-3 mt-4">
                  <img src={req.user?.photoURL || defaultAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-800">{req.user?.displayName || 'Anonymous'}</div>
                    <div className="text-xs text-gray-500">{req.user?.email || ''}</div>
                  </div>
                </div>
              </div>
              <div>
                {req.status === "pending" && (
                  <>
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2 font-semibold hover:bg-green-600" onClick={() => handleApprove(req.id)}>Approve</button>
                    <button className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600" onClick={() => handleReject(req.id)}>Reject</button>
                  </>
                )}
                {req.status === "approved" && <span className="text-green-600 font-bold">Approved</span>}
                {req.status === "rejected" && <span className="text-red-600 font-bold">Rejected</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
