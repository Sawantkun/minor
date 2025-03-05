import React, { useEffect, useState } from 'react';
import { Add, Search, LocationOn, Delete } from '@mui/icons-material';
import MessagesImg from "../assets/svgs/messages.svg";
import { BusinessCenter, Work, CorporateFare, AccountBalance } from '@mui/icons-material';
import { PlaceOutlined, WorkOutline, AttachMoney, AccessTime } from '@mui/icons-material';
import { db } from '../firebase';
import { addDoc, collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import useAuth from '../hooks/AuthContext';

const JobPortal = ({ setshowMessage, setjobData }) => {

  const [jobs, setJobs] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const jobsPerPage = 4; // Jobs per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'jobData'));
        const userList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            ...(data.formData || {}),
            createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleString() : "N/A",
          };
        });
        console.log(userList);
        setJobs(userList);
      } catch (error) {
        console.error('Error fetching documents: ', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (jobId) => {
    if (!jobId) {
      alert('Please enter a document ID');
      return;
    }
    try {
      setJobs(jobs.filter(job => job.id !== jobId));
      await deleteDoc(doc(db, 'jobData', jobId));
      console.log('Document deleted successfully');
      alert('Document deleted successfully!');
      setDocId('');
    } catch (error) {
      console.error('Error deleting document: ', error);
      alert('Error deleting document!');
    }
  };


  const handleAddJob = (newJob) => {
    console.log(newJob)
    setJobs([{ ...newJob, id: jobs.length + 1 }, ...jobs]); // Prepend the new job
    setModalOpen(false); // Close the modal
  };

  const filteredJobs = jobs.filter(job =>
    job.role?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    job.location?.toLowerCase().includes(locationTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="min-h-screen p-4 ml-[310px] w-full">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Job Portal</h1>
        </div>
        <div className="flex space-x-4 mb-6">
          <div className="flex items-center border border-gray-300 rounded-md p-2 flex-grow shadow-sm">
            <Search className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="What position are you looking for?"
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-md p-2 flex-grow shadow-sm">
            <LocationOn className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Location"
              className="flex-grow outline-none text-gray-700 placeholder-gray-400"
              value={locationTerm}
              onChange={(e) => setLocationTerm(e.target.value)}
            />
          </div>
          <button
            className="bg-purple text-white px-5 py-2 rounded-md flex items-center space-x-2 shadow"
            onClick={() => setModalOpen(true)}
          >
            <Add />
            <span>Post a Job</span>
          </button>
        </div>

        {displayedJobs.map((job) => (
          <JobCard key={job.id} job={job} onDelete={handleDelete} setshowMessage={setshowMessage} setjobData={setjobData} />
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            disabled={currentPage === 1}
            onClick={goToPreviousPage}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-300' : 'bg-purple text-white'}`}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={goToNextPage}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-300' : 'bg-purple text-white'}`}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && (
        <JobFormModal onClose={() => setModalOpen(false)} onSubmit={handleAddJob} />
      )}
    </div>
  );
};

const JobFormModal = ({ onClose, onSubmit }) => {

  const { userData } = useAuth();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    type: '',
    salary: '',
    postedTime: 'Just now',
    link: '',
    isNew: true,
    postedBy: 'John Doe',
    userId: userData.uid,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    onSubmit(formData);
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'jobData'), {
        formData,
        createdAt: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      alert('Data added successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error adding data!');
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Post a Job</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="role"
              placeholder="Role"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="type"
              placeholder="Job Type"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="salary"
              placeholder="Salary"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="url"
              name="link"
              placeholder="Apply Link"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={formData.link}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const JobCard = ({ job, loggedInUser, onDelete, setshowMessage, setjobData }) => {
  const icons = [<BusinessCenter />, <Work />, <CorporateFare />, <AccountBalance />];
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  const { userData } = useAuth();


  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-start justify-between relative">
      {/* Company Icon on the left with increased size */}
      <div className="text-gray-500 mr-4 flex-shrink-0">
        {React.cloneElement(randomIcon, { style: { fontSize: 40 } })}
      </div>
      <div className=" w-full">
        <h2 className="text-xl font-semibold">
          {job.company}
          {job.isNew && <span className="text-sm bg-red-500 text-white px-3 py-1 ml-2 rounded">New post</span>}
        </h2>
        <p className="text-gray-700">{job.role}</p>
        <div className="flex space-x-8 text-sm text-gray-500 mt-4">
          <div className="flex items-center">
            <PlaceOutlined className="text-gray-500 mr-2" style={{ fontSize: 18 }} />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <WorkOutline className="text-gray-500 mr-2" style={{ fontSize: 18 }} />
            <span>{job.type}</span>
          </div>
          <div className="flex items-center">
            <AttachMoney className="text-gray-500 mr-2" style={{ fontSize: 18 }} />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center">
            <AccessTime className="text-gray-500 mr-2" style={{ fontSize: 18 }} />
            <span>{job.createdAt}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2">Posted by: {job.postedBy}</p>
        <a href={job.link} className="text-blue-500 text-sm mt-2 block" target="_blank">Apply: {job.link}</a>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {job.userId === userData.uid && (
          <button className="text-red-500" onClick={() => onDelete(job.id)}>
            <Delete />
          </button>
        )}
        <button className="opacity-[0.5] right-[15px] hover:opacity-[1] flex items-center w-6 h-6 absolute bottom-[10px]" onClick={() => { setshowMessage(job.userId), setjobData(job) }}>
          <img src={MessagesImg} alt="Messages" />
        </button>
      </div>
    </div>
  );
};

export default JobPortal;
