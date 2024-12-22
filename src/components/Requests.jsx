import React, { useState } from "react";

const Requests = () => {
  const [pendingApprovals, setPendingApprovals] = useState([
    { fullName: "John Doe", email: "john.doe@gmail.com" },
    { fullName: "Jane Smith", email: "jane.smith@gmail.com" },
    { fullName: "Alice Brown", email: "alice.brown@gmail.com" },
    { fullName: "Bob White", email: "bob.white@gmail.com" },
  ]);

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

  const handleApprove = (index) => {
    const approvedUser = pendingApprovals[index];
    setAlumniList([
      ...alumniList,
      {
        userId: Date.now().toString(), // Generate a unique ID
        name: approvedUser.fullName,
        company: "-", // Default values
        designation: "-",
        location: "-",
        passOutYear: "-",
      },
    ]);

    const updatedPending = pendingApprovals.filter((_, i) => i !== index);
    setPendingApprovals(updatedPending);
  };

  const handleReject = (index) => {
    const updatedPending = pendingApprovals.filter((_, i) => i !== index);
    setPendingApprovals(updatedPending);
  };

  return (
    <div className=" ml-[310px] p-8 bg-gray-50 w-full">
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
          {pendingApprovals.map((approval, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b last:border-b-0 py-3"
            >
              <div className="flex gap-10 items-end">
                <p className="font-medium">{approval.fullName}</p>
                <p className="text-gray-500 text-sm">{approval.email}</p>
                <a
                  href="#"
                  className="text-purple text-sm underline hover:text-black"
                >
                  View document
                </a>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(index)}
                  className="bg-purple text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
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
                <th className="p-4 border-b">Action</th>
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
                    <button
                      className="text-purple underline hover:text-black"
                      onClick={() => alert(`Viewing details of ${alumni.name}`)}
                    >
                      View
                    </button>
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
    </div>
  );
};

export default Requests;
