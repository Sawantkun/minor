import React, { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import Button from "./ui/button";
import { db } from "../firebase";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import useAuth from "../hooks/AuthContext";

const Requests = () => {

  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setloading] = useState(false)

  const { userData } = useAuth()

  useEffect(() => {
    const fetchUsersWithDegrees = async () => {
      setloading(true)
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = await Promise.all(
          usersSnapshot.docs
            .map(async (userDoc) => {
              const userData = { userId: userDoc.id, ...userDoc.data() };
              console.log(userData)
              if (userData.isVerificationDone === "") {
                const userFileRef = doc(db, "userFiles", userDoc.id);
                const userFileSnap = await getDoc(userFileRef);
                userData.degree = userFileSnap.exists() ? userFileSnap.data() : null;
                return userData;
              }
              return null;
            })
        );
        setloading(false)
        setPendingApprovals(usersList.filter(Boolean));
      } catch (error) {
        console.error("Error fetching users with degrees:", error);
      }
    };

    fetchUsersWithDegrees();
  }, []);



  const [alumniList, setAlumniList] = useState([
    {
      userId: "12356790",
      name: "Krishna Kanth",
      company: "xyz",
      designation: "Manager",
      location: "Gachibowli, Hyderabad",
      passOutYear: "2021",
    },
    // Add more alumni to test pagination
    ...Array.from({ length: 50 }, (_, index) => ({
      userId: `1000${index}`,
      name: `Alumni ${index + 1}`,
      company: `Company ${index + 1}`,
      designation: `Designation ${index + 1}`,
      location: `Location ${index + 1}`,
      passOutYear: `20${10 + (index % 10)}`,
    })),
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setshowAlert] = useState({
    vissible: false,
    rejectIndex: null
  })

  const itemsPerPage = 10;
  const filteredAlumni = alumniList.filter(
    (alumni) =>
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alumni.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const paginatedAlumni = filteredAlumni.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleApprove = async (userId) => {
    try {
      const approvedUser = pendingApprovals.find((approval) => approval.userId === userId);
      if (!approvedUser) {
        console.error("User not found in pending approvals");
        return;
      }
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isVerificationDone: true });
      setAlumniList([
        ...alumniList,
        {
          userId: approvedUser.userId,
          name: approvedUser.name,
          company: "-",
          designation: "-",
          location: "-",
          passOutYear: "-",
        },
      ]);
      const updatedPending = pendingApprovals.filter((approval) => approval.userId !== userId);
      setPendingApprovals(updatedPending);
      console.log(`User ${userId} approved successfully!`);
    } catch (error) {
      console.error("Error updating user verification status:", error);
    }
  };

  const handleReject = async (userId) => {
    try {
      const rejectUser = pendingApprovals.find((approval) => approval.userId === userId);
      if (!rejectUser) {
        console.error("User not found in pending approvals");
        return;
      }
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { isVerificationDone: false });
      setPendingApprovals((prev) => prev.filter((approval) => approval.userId !== userId));
      setshowAlert({ ...showAlert, vissible: false, rejectIndex: null })
      console.log(`User ${userId} reject successfully!`);
    } catch (error) {
      console.error("Error updating user verification status:", error);
    }
  };


  return (
    <div className=" ml-[300px] p-6 bg-gray-50 w-full">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold text-gray-600">Total Alumni</p>
            <p className="text-3xl font-bold text-purple-600">
              {alumniList.length}
            </p>
          </div>
          <div className="text-gray-400 text-2xl">📅</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <p className="text-lg font-semibold text-gray-600">
              Approvals Pending
            </p>
            <p className="text-3xl font-bold text-purple-600">
              {pendingApprovals.length}
            </p>
          </div>
          <div className="text-gray-400 text-2xl">📤</div>
        </div>
      </div>

      {/* Approvals Pending Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Approvals Pending
        </h3>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {loading ? (
            <div className=" text-center">Loading...</div>
          ) : (
            <>
              {pendingApprovals.map((approval, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b last:border-b-0 py-3"
                >
                  <div className="flex gap-10 items-end">
                    <p className="font-medium">{approval.name}</p>
                    <p className="text-gray-500 text-sm">{approval.email}</p>
                    {approval.degree && (
                      <a
                        href={approval.degree?.fileURL}
                        className="text-purple text-sm cursor-pointer underline hover:text-black"
                        target="_blank"
                      >
                        View document
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(approval.userId)}
                      className="bg-purple text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setshowAlert({ vissible: true, rejectIndex: approval.userId })}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>

                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Alumni List Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Alumni List
        </h3>
        <div className="bg-white rounded-lg shadow-md">
          {/* Search and Filter */}
          <div className="p-4 flex justify-between items-center">
            <input
              type="text"
              placeholder="Search alumni by name or company"
              className="border p-2 rounded-lg w-full max-w-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Alumni Table */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 border-b">User ID</th>
                <th className="p-4 border-b">Alumni Name</th>
                <th className="p-4 border-b">Company</th>
                <th className="p-4 border-b">Designation</th>
                <th className="p-4 border-b">Location</th>
                <th className="p-4 border-b">Pass Out Year</th>
                <th className="p-4 border-b">Document</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlumni.map((alumni, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-4 border-b">{alumni.userId}</td>
                  <td className="p-4 border-b">{alumni.name}</td>
                  <td className="p-4 border-b">{alumni.company}</td>
                  <td className="p-4 border-b">{alumni.designation}</td>
                  <td className="p-4 border-b">{alumni.location}</td>
                  <td className="p-4 border-b">{alumni.passOutYear}</td>
                  <td className="p-4 border-b">
                    <a
                      href={alumni.data}
                      className="text-purple underline cursor-pointer hover:text-black"
                      target="_blank"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="p-4 flex justify-between items-center">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="bg-purple text-white px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {showAlert.vissible && (
        <Modal isOpen={showAlert.vissible} onClose={() => setshowAlert({ ...showAlert, vissible: false })}>
          <Modal.Header>
          </Modal.Header>
          <Modal.Body>
            <div className="text-2xl text-center font-semibold">Are you sure you want to reject this user</div>
          </Modal.Body>
          <Modal.Footer>
            <div className=" flex items-center justify-end gap-4">
              <button onClick={() => setshowAlert({ ...showAlert, vissible: false })}>Cancel</button>
              <button className=" bg-purple text-white px-4 py-2 rounded-lg" onClick={() => handleReject(showAlert.rejectIndex)}>Confirm</button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Requests;
