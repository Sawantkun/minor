import React, { useState } from 'react';
import MessagesImg from "../assets/svgs/messages.svg";
import UserImg from "../assets/svgs/avatar.png";
import SearchImg from "../assets/svgs/search.svg";

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const users = [
    {
      id: 1,
      img: UserImg, // Replace with actual image path
      name: 'John Doe',
      designation: 'Software Engineer',
      location: 'New York, USA',
    },
    {
      id: 2,
      img: UserImg,
      name: 'Jane Smith',
      designation: 'Project Manager',
      location: 'London, UK',
    },
    {
      id: 3,
      img: UserImg,
      name: 'Michael Johnson',
      designation: 'UI/UX Designer',
      location: 'San Francisco, USA',
    },
    {
      id: 4,
      img: UserImg,
      name: 'Emily Davis',
      designation: 'Data Scientist',
      location: 'Berlin, Germany',
    },
    {
      id: 5,
      img: UserImg, // Replace with actual image path
      name: 'John Doe',
      designation: 'Software Engineer',
      location: 'New York, USA',
    },
    {
      id: 6,
      img: UserImg,
      name: 'Jane Smith',
      designation: 'Project Manager',
      location: 'London, UK',
    },
    {
      id: 7,
      img: UserImg,
      name: 'Michael Johnson',
      designation: 'UI/UX Designer',
      location: 'San Francisco, USA',
    },
    {
      id: 8,
      img: UserImg,
      name: 'Emily Davis',
      designation: 'Data Scientist',
      location: 'Berlin, Germany',
    },
    {
      id: 9,
      img: UserImg, // Replace with actual image path
      name: 'John Doe',
      designation: 'Software Engineer',
      location: 'New York, USA',
    },
    {
      id: 10,
      img: UserImg,
      name: 'Jane Smith',
      designation: 'Project Manager',
      location: 'London, UK',
    },
    {
      id: 11,
      img: UserImg,
      name: 'Michael Johnson',
      designation: 'UI/UX Designer',
      location: 'San Francisco, USA',
    },
    {
      id: 12,
      img: UserImg,
      name: 'Emily Davis',
      designation: 'Data Scientist',
      location: 'Berlin, Germany',
    },
    // Add more users as needed
  ];

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-6 py-2 pb-[100px] ml-[310px] w-full">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10 border-b-[1px] pb-6">
        <h1 className="text-3xl font-bold text-gray-800">Directory</h1>
        <div className="flex items-center gap-4">
          <div className="flex border-2 px-5 rounded-lg w-[400px]">
            <img className="w-6 opacity-50" src={SearchImg} alt="Search" />
            <input
              type="text"
              placeholder="Search"
              className="border-none text-black text-xl rounded-lg px-4 py-2 focus:outline-none  bg-[#F8F9FA] "
              value={searchTerm} // Bind input to state
              onChange={(e) => setSearchTerm(e.target.value)} // Update state on input change
            />
          </div>
          <div className="border border-gray-300 rounded-lg px-4 py-2 outline-none cursor-pointer text-xl bg-gray-300">
            <select className="outline-none cursor-pointer bg-gray-300">
              <option value="">Filter</option>
              <option value="designation">Designation</option>
              <option value="location">Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-4 gap-10">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="rounded-xl p-4 custom-shadow hover:shadow-2xl transition-all duration-300 bg-[#fff]"
            >
              {/* User Image */}
              <img
                src={user.img}
                alt={user.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              {/* User Info */}
              <h2 className="text-xl font-semibold text-center text-gray-800">{user.name}</h2>
              <p className="text-gray-400 font-bold text-center">{user.designation}</p>
              <p className="text-gray-400 text-center">{user.location}</p>
              {/* Icons */}
              <div className="flex justify-center gap-4 mt-8">
                <button className="bg-purple text-white px-4 py-3 rounded-lg w-[120px] border border-purple font-medium hover:bg-transparent hover:text-purple hover:border-purple transition-all duration-300">
                  Visit Profile
                </button>
                <button className="text-purple-600 hover:text-purple-800">
                  <i className="fas fa-phone"></i>
                </button>
                <button className="text-purple-600 hover:text-purple-800">
                  <img className="w-7" src={MessagesImg} alt="Message" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-4 text-center">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Directory;
