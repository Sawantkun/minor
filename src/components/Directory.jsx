import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore'; // Import from firebase.js
import { db } from '../firebase'; // Import Firestore initialization from your firebase.js file
import MessagesImg from "../assets/svgs/messages.svg";
import UserImg from "../assets/svgs/avatar.png";
import SearchImg from "../assets/svgs/search.svg";
import Modal from './ui/Modal';
import { useLocation, useNavigate } from 'react-router-dom';

const Directory = ({ onMessageClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from Firestore on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched users:", usersList); // Log users for debugging
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtered users based on search term
  const filteredUsers = users.filter(
    (user) =>
      (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (user.designation?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (user.location?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [showData, setshowData] = useState("")

  const navigate = useNavigate()

  const handleMessageClick = (userId) => {

  }

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
              className="border-none text-black text-xl rounded-lg px-4 py-2 focus:outline-none bg-[#F8F9FA]"
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

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : (
        <div className="grid grid-cols-4 gap-10">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 bg-[#fff]"
              >
                {/* User Image */}
                <img
                  src={user?.photoURL || UserImg} // Use photoURL from Firestore, fallback to default image
                  alt={user?.displayName}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                {/* User Info */}
                <h2 className="text-xl font-semibold text-center text-gray-800">{user.displayName}</h2>
                <p className="text-gray-400 font-bold text-center">{user.designation}</p> {/* Display designation */}
                <p className="text-gray-400 text-center">{user.location}</p> {/* Display location */}
                {/* Icons */}
                <div className="flex justify-center gap-4 mt-8">
                  <button className="bg-purple text-white px-4 py-3 rounded-lg w-[120px] border border-purple font-medium hover:bg-transparent hover:text-purple hover:border-purple transition-all duration-300" onClick={() => { setModalOpen(true), setshowData(user) }}>
                    Visit Profile
                  </button>
                  <button className="text-purple-600 hover:text-purple-800">
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="text-purple-600 hover:text-purple-800" onClick={() => onMessageClick(user.id)}>
                    <img className="w-7" src={MessagesImg} alt="Message" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-4 text-center">No users found</p>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>
          <div className=' flex items-center gap-4 w-full'>
            <div className=' w-14 h-14 flex-shrink-0'>
              <img
                src={showData?.photoURL || UserImg}
                alt={showData?.displayName}
                className=" w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className=' text-lg font-semibold'>{showData?.displayName}</div>
              <div className='text-sm font-semibold text-gray-700'>{showData?.designation}</div>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div className=' w-full flex flex-col gap-3'>
            <div className='  flex items-center justify-between w-full'>
              <div className='  font-medium'>Company</div>
              <div className=' font-medium text-gray-900'>{showData?.companyName}</div>
            </div>
            <div className='my-3 border-b border-gray-200 w-full'></div>
            <div className=' flex items-center justify-between w-full'>
              <div className='  font-medium'>Experience</div>
              <div className=' font-medium text-gray-900'>{showData?.experience}</div>
            </div>
            <div className='my-3 border-b border-gray-200 w-full'></div>
            <div className=' flex items-center justify-between w-full'>
              <div className='  font-medium'>Linkedin</div>
              <a className=' font-medium text-blue-500 underline' href={showData?.linkedinId}>{showData?.linkedinId}</a>
            </div>
            <div className='my-3 border-b border-gray-200 w-full'></div>
            <div className=' flex items-center justify-between w-full'>
              <div className='  font-medium'>Email</div>
              <div className=' font-medium text-gray-900'>{showData?.email}</div>
            </div>
            <div className='my-3 border-b border-gray-200 w-full'></div>
            <div className=' flex items-center justify-between w-full'>
              <div className='  font-medium'>Location</div>
              <div className=' font-medium text-gray-900'>{showData?.designation}</div>
            </div>
            <div className='my-3 border-b border-gray-200 w-full'></div>
            <div className=' flex items-center justify-between w-full'>
              <div className='  font-medium'>Qualification</div>
              <div className=' font-medium text-gray-900'>{showData?.educationLevel}</div>
            </div>
            <div className='my-3 border-b border-gray-200 w-full'></div>
            <div className=' flex items-center justify-between w-full'>
              <div className='  font-medium'>Graduation Year</div>
              <div className=' font-medium text-gray-900'>{showData?.graduationYear}</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Directory;
