import React, { useState } from 'react';
import { Add, Search, LocationOn, Delete } from '@mui/icons-material';
import MessagesImg from "../assets/svgs/messages.svg";
import { BusinessCenter, Work, CorporateFare, AccountBalance } from '@mui/icons-material';
import { PlaceOutlined, WorkOutline, AttachMoney, AccessTime } from '@mui/icons-material';

const JobPortal = () => {
  const loggedInUser = "John Doe";

  const [jobs, setJobs] = useState([
    {
      id: 1,
      company: "TechCorp",
      role: "Frontend Developer",
      location: "San Francisco, CA",
      type: "Full-Time",
      salary: "$120k/year",
      postedTime: "1 hour ago",
      link: "https://techcorp.com/careers/frontend-developer",
      isNew: true,
      postedBy: "Jane Smith",
    },
    {
      id: 2,
      company: "Healthify",
      role: "Data Scientist",
      location: "New York, NY",
      type: "Part-Time",
      salary: "$80k/year",
      postedTime: "3 hours ago",
      link: "https://healthify.com/jobs/data-scientist",
      isNew: false,
      postedBy: "John Doe",
    },
    {
      id: 3,
      company: "EduSpark",
      role: "Backend Developer",
      location: "Remote",
      type: "Contract",
      salary: "$100k/year",
      postedTime: "1 day ago",
      link: "https://eduspark.com/hiring/backend-developer",
      isNew: true,
      postedBy: "Alice Johnson",
    },
    {
      id: 4,
      company: "MarketGenius",
      role: "Product Manager",
      location: "Chicago, IL",
      type: "Full-Time",
      salary: "$130k/year",
      postedTime: "2 days ago",
      link: "https://marketgenius.com/careers/product-manager",
      isNew: false,
      postedBy: "Mark Spencer",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const jobsPerPage = 4; // Jobs per page

  const handleDelete = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  const handleAddJob = (newJob) => {
    setJobs([{ ...newJob, id: jobs.length + 1 }, ...jobs]); // Prepend the new job
    setModalOpen(false); // Close the modal
  };

  const filteredJobs = jobs.filter(job =>
    job.role.toLowerCase().includes(searchTerm.toLowerCase()) &&
    job.location.toLowerCase().includes(locationTerm.toLowerCase())
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
          <JobCard key={job.id} job={job} loggedInUser={loggedInUser} onDelete={handleDelete} />
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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

const JobCard = ({ job, loggedInUser, onDelete }) => {
  const icons = [<BusinessCenter />, <Work />, <CorporateFare />, <AccountBalance />];
  const randomIcon = icons[Math.floor(Math.random() * icons.length)];

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 flex items-start justify-between relative">
      {/* Company Icon on the left with increased size */}
      <div className="text-gray-500 mr-4 mt-1 flex-shrink-0">
        {React.cloneElement(randomIcon, { style: { fontSize: 40 } })}
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-semibold">
          {job.company}
          {job.isNew && <span className="text-sm bg-red-500 text-white px-2 py-1 ml-2 rounded">New post</span>}
        </h2>
        <p className="text-gray-700">{job.role}</p>

        <div className="flex space-x-8 text-sm text-gray-500 mt-2">
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
            <span>{job.postedTime}</span>
          </div>
        </div>

        <p className="text-gray-500 text-sm mt-2">Posted by: {job.postedBy}</p>
        <a href={job.link} className="text-blue-500 text-sm mt-2 block">Apply: {job.link}</a>
      </div>

      <div className="flex flex-col items-center space-y-2">
        {job.postedBy === loggedInUser && (
          <button className="text-red-500" onClick={() => onDelete(job.id)}>
            <Delete />
          </button>
        )}
        <button className="opacity-[0.5] right-[15px] hover:opacity-[1] flex items-center w-6 h-6 absolute bottom-[10px]">
          <img src={MessagesImg} alt="Messages" />
        </button>
      </div>
    </div>
  );
};

export default JobPortal;
