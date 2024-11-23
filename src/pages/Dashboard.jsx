import { useEffect, useState } from 'react';
import Directory from '../components/Directory';
import JobPortal from '../components/JobPortal';
import Messages from '../components/Messages';
import Notices from '../components/Notices';
import logo from "../assets/fulllogogbu 1.png";
import DirectoryImg from "../assets/svgs/bxs_dashboard.svg";
import MessagesImg from "../assets/svgs/messages.svg";
import NoticeImg from "../assets/svgs/news.svg";
import JobsImg from "../assets/svgs/jobs.svg";
import UserImg from "../assets/svgs/user.png";
import Profile from "../components/Profile"
import { useLocation } from 'react-router-dom';
import userLog from "../assets/images/user.png"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '../components/ui/button';
import uploadLogo from "../assets/images/upload.png"

const Dashboard = () => {

  const [view, setView] = useState('directory');

  const renderView = () => {
    switch (view) {
      case 'directory':
        return <Directory />;
      case 'jobPortal':
        return <JobPortal />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <Profile />;
      case 'notices':
        return <Notices />;
      default:
        return <Directory />;
    }
  };

  const buttons = [
    { label: 'Directory', id: 'directory', icon: DirectoryImg },
    { label: 'Messages', id: 'messages', icon: MessagesImg },
    { label: 'Notices', id: 'notices', icon: NoticeImg },
    { label: 'Job Portal', id: 'jobPortal', icon: JobsImg },
  ];

  const location = useLocation();
  const [isNewUser, setIsNewUser] = useState(false);
  const [steps, setsteps] = useState(0)
  const [verfication, setverfication] = useState("")
  const [formField, setFormField] = useState({
    degree: ""
  })

  useEffect(() => {
    console.log(location);
    if (location.state?.newUser) {
      setIsNewUser(true);
    }
    console.log(location.state?.newUser)
  }, [location]);

  const handleSubmit = () => {
    if (steps === 0) {
      setsteps(1);
    } else if (steps === 1 && formField.degree !== "") {
      setsteps(2);
    } else if (steps === 2) {
      setsteps(3);
    }
  }

  return (
    <div className="flex min-h-screen max-h-full bg-[#F8F9FA]">
      {isNewUser === false ? (
        <div className="w-full flex flex-col h-full">
          <div className='w-full flex items-center px-8 py-4 justify-between fixed'>
            <div className="w-[280px] object-cover flex-shrink-0">
              <a href="/">
                <img src={logo} alt="Alumni" className="w-full object-cover" />
              </a>
            </div>
            <div className="flex items-center gap-4 px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-300" onClick={() => setView('profile')}>
              <img
                src={UserImg}
                alt="User"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="text-black text-lg font-semibold">John Doe</p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white w-1/2 h-1/2 flex items-center justify-center p-6 rounded-2xl">
              <div className=' w-full flex flex-col justify-center items-center gap-10 max-w-md'>
                <div className=' w-full flex flex-col justify-center items-center'>
                  <div className=' w-16 h-full flex justify-center items-center mx-auto'>
                    <img src={userLog} alt='' className=' w-full h-full object-cover rounded-full bg-gray-300' />
                  </div>
                  <div className=' mt-2 text-center'>
                    <div className=' text-xl font-[600] font-inter'>Join the GBU Alumini Portal</div>
                    <div className=' text-gray-500 font-inter text-sm mt-1'>Invest in Your Future - Unloc Exclusive Benifits Today!</div>
                  </div>
                </div>
                <div className=' flex flex-col gap-4 w-max justify-center mx-auto'>
                  {verfication === "" ? (
                    <>
                      {steps === 0 ? (
                        <div className=' w-full flex flex-col gap-4'>
                          <div className=' flex items-center gap-4'>
                            <div>
                              <CheckCircleIcon fontSize="small" className=' text-blue-500' />
                            </div>
                            <div className=' font-inter font-[400]'>Connect with a vibrant network of alumin</div>
                          </div>
                          <div className=' flex items-center gap-4'>
                            <div>
                              <CheckCircleIcon fontSize="small" className=' text-blue-500' />
                            </div>
                            <div className='font-inter font-[400]'>Gain full access to exclusive member-only features</div>
                          </div>
                          <div className=' flex items-center gap-4'>
                            <div>
                              <CheckCircleIcon fontSize="small" className=' text-blue-500' />
                            </div>
                            <div className='font-inter font-[400]'>Stay updated with the latest  event and opportunites</div>
                          </div>
                          <div className=' flex items-center gap-4'>
                            <div>
                              <CheckCircleIcon fontSize="small" className=' text-blue-500' />
                            </div>
                            <div className='font-inter font-[400]'>Expand your professional and personal work</div>
                          </div>
                        </div>
                      ) : steps === 1 ? (
                        <div className=' w-full'>
                          <div className=' text-xl font-[600] font-inter'>Upload your GBU Degree for verfications</div>
                          <div className="border border-dashed border-gray-700 p-4 mt-4">
                            <input
                              type="file"
                              id="degree"
                              name="degree"
                              className="hidden"
                              value={formField.degree}
                              onChange={(e) => setFormField({ ...formField, degree: e.target.value })}
                            />
                            <label htmlFor="degree" className="cursor-pointer">
                              <div className="w-10 h-full object-cover flex-shrink-0 mx-auto">
                                <img
                                  src={uploadLogo}
                                  alt="Upload Logo"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="text-center mt-2">Drag and Upload your file here.</div>
                            </label>
                          </div>
                        </div>
                      ) : steps === 2 && formField.degree !== "" && (
                        <div className=' w-full'>
                          <div className=' flex flex-col w-full items-center justify-center'>
                            <div className=' flex items-center justify-center gap-2'>
                              <CheckCircleIcon fontSize="small" className=' text-green-500' />
                              <div className='font-[600] font-inter'>File Uplaoded</div>
                            </div>
                            <div className=' text-gray-700 mt-2'>Proceed to payment once verfication is completed. </div>
                            <div className='text-gray-700'>This may take 1 - 2 business days.</div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {verfication ? (
                        <div className=' w-full'>
                          <div className=' flex items-center justify-center gap-2'>
                            <CheckCircleIcon fontSize="small" className=' text-green-500' />
                            <div className='font-[600] font-inter'>Verfication Completed</div>
                          </div>
                        </div>
                      ) : (
                        <div className=' w-full'>
                          <div className=' flex items-center justify-center gap-2'>
                            <CheckCircleIcon fontSize="small" className=' text-red-500' />
                            <div className='font-[600] font-inter'>Error</div>
                          </div>
                          <div className='text-gray-700 mt-1 text-center'>Contact to admin form more enquiry</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className=' w-full'>
                  <Button
                    className={`w-full ${verfication === false ? 'hidden' : ''}`}
                    onClick={handleSubmit}
                    disabled={!(verfication !== "" || steps !== 2)}
                  >
                    {steps === 0 ? "Become a Member" : steps === 1 ? "Upload" : "Make payment"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-[310px]  text-white flex flex-col px-6 py-4 border-r-[1px] justify-between fixed bg-[#F8F9FA] h-full">
            <div>
              {/* Logo */}
              <div className="w-[270px] object-cover flex-shrink-0 mb-10">
                <a href="/">
                  <img src={logo} alt="Alumni" className="w-full h-full object-cover border-b-[1px] pb-5" />
                </a>
              </div>

              {/* Sidebar Buttons */}
              {buttons.map(({ label, id, icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`mb-5 py-3 w-full px-8 rounded-xl text-2xl hover:bg-purple hover:text-white flex gap-3 transition-all duration-300 items-center group ${view === id ? 'bg-purple text-white' : 'text-black'
                    }`}
                >
                  <img
                    className={`w-10 h-7 filter group-hover:invert ${view === id ? 'invert' : ''
                      }`}
                    src={icon}
                    alt={label}
                  />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 border-t-[1px] p-4 mt-8 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-300" onClick={() => setView('profile')}
            >
              <img
                src={UserImg}
                alt="User"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <p className="text-black text-lg font-semibold">John Doe</p>
                <p className="text-gray-500 text-sm">johndoe@example.com</p>
              </div>
            </div>
          </div>
          <div className="w-4/5 p-4">
            {renderView()}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
