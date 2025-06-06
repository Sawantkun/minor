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
import userLog from "../assets/images/user.png"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Button from '../components/ui/button';
import uploadLogo from "../assets/images/upload.png"
import CloseIcon from '@mui/icons-material/Close';
import PayPalButton from '../components/PaypalButton';
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { db, storage } from "../firebase";
import userImg from "../assets/svgs/avatar.png"
import useAuth from '../hooks/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Events from './Events';

const Dashboard = () => {

  const { userData } = useAuth();
  const [showPayPal, setShowPayPal] = useState(true);
  const [view, setView] = useState('directory');
  const [steps, setSteps] = useState(0);
  const [verification, setVerification] = useState(userData?.isVerificationDone);
  const [payment, setPayment] = useState(userData?.isPaymentDone);
  const [formField, setFormField] = useState({ degree: "" });
  const [selectedUserId, setSelectedUserId] = useState();
  const [jobData, setjobData] = useState()
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!userData?.uid) return;
    const checkUserFile = async (userId) => {
      if (!userId) return;
      setLoading(true)
      const fileDoc = await getDoc(doc(db, "userFiles", userId));
      if (fileDoc.exists()) {
        const { fileURL } = fileDoc.data();
        console.log("User file found:", fileURL);
        setSteps(2);
        setLoading(false)
      } else {
        setLoading(false)
        console.log("No file found for this user.");
      }
    };
    checkUserFile(userData?.uid);
  }, [userData?.uid]);

  console.log(userData)


  const handlePayPal = () => {
    setShowPayPal(false);
  };

  const handleFileUpload = async (file, userId) => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    const storageRef = ref(storage, `degrees/${userId}/${file.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      await setDoc(doc(db, "userFiles", userId), {
        fileName: file.name,
        fileURL: downloadURL,
      });
      setSteps(2);
      console.log(`User ${userId} uploaded: ${file.name}, URL: ${downloadURL}`);
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };


  const renderView = () => {
    switch (view) {
      case 'directory':
        return <Directory onMessageClick={(userId) => { setView('messages'); setSelectedUserId(userId); }} />;
      case 'jobPortal':
        return <JobPortal setshowMessage={(userId) => { setView('messages'); setSelectedUserId(userId); }} setjobData={setjobData} />;
      case 'messages':
        return <Messages userId={selectedUserId} jobData={jobData} onResetUserId={() => setSelectedUserId()} />;
      case 'profile':
        return <Profile />;
      case 'events':
        return <Events />;
      case 'notices':
        return <Notices />;
      default:
        return <Directory />;
    }
  };

  const handleSubmit = () => {
    if (steps === 0) {
      setSteps(1);
    } else if (steps === 1 && formField.degree !== "") {
      handleFileUpload(formField.degree, userData?.uid)
    } else if (steps === 2) {
      setSteps(3);
    }
  };

  const buttons = [
    { label: 'Directory', id: 'directory', icon: DirectoryImg },
    { label: 'Messages', id: 'messages', icon: MessagesImg },
    { label: 'Notices', id: 'notices', icon: NoticeImg },
    { label: 'Events', id: 'events', icon: NoticeImg },
    { label: 'Job Portal', id: 'jobPortal', icon: JobsImg },
  ];

  return (
    <div className="flex  min-h-screen max-h-full bg-[#F8F9FA]">
      {loading ?
        (
          <div>Loading...</div>
        ) : (
          <>
            {!payment ? (
              <div className="w-full flex flex-col h-full">
                <div className='w-full flex items-center px-8 py-4 justify-between fixed'>
                  <div className="w-[280px] object-cover flex-shrink-0">
                    <a href="/">
                      <img src={logo} alt="Alumni" className="w-full object-cover" />
                    </a>
                  </div>
                  <div className="flex items-center gap-4  p-4 mt-8 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-300" onClick={() => setView('profile')}>
                    <img
                      src={userData?.photoURL || userImg}
                      alt="User"
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-black text-lg font-semibold">{userData?.displayName || "John Doe"}</p> {/* Display name from Firestore */}
                      <p className="text-gray-500 text-sm">{userData?.email || 'johndoe@example.com'}</p> {/* Display email from Firestore */}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center min-h-screen">
                  <div className="bg-white w-1/2 h-1/2 flex items-center justify-center p-6 rounded-2xl">
                    <div className=' w-full flex flex-col justify-center items-center gap-10 max-w-md'>
                      <div className=' w-full flex flex-col justify-center items-center'>
                        <div className=' w-16 h-full flex justify-center items-center mx-auto'>
                          <img src={userLog} alt='' className=' w-full h-full object-cover rounded-full bg-gray-300 mb-2' />
                        </div>
                        <div className=' mt-2 text-center'>
                          <div className=' text-xl font-[600] font-inter'>Join the GBU Alumini Portal</div>
                          <div className=' text-gray-500 font-inter text-sm mt-1'>Invest in Your Future - Unloc Exclusive Benifits Today!</div>
                        </div>
                      </div>
                      <div className=' flex flex-col gap-4 w-max justify-center mx-auto'>
                        {verification === "" ? (
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
                                <Button
                                  className={`w-full mt-10 ${verification === false ? 'hidden' : ''}`}
                                  onClick={handleSubmit}
                                  disabled={!(verification !== "" || steps !== 2)}
                                >
                                  Become a Member
                                </Button>
                              </div>
                            ) : steps === 1 ? (
                              <div className="w-full">
                                <div className="text-xl font-[600] font-inter">
                                  Upload your GBU Degree for verifications
                                </div>
                                <div className="border border-dashed border-gray-700 p-4 mt-4 relative">
                                  <input
                                    type="file"
                                    id="degree"
                                    name="degree"
                                    className="hidden"
                                    onChange={(e) => setFormField({ ...formField, degree: e.target.files?.[0] })}
                                  />
                                  {formField.degree ? (
                                    <div className="relative">
                                      <img
                                        src={URL.createObjectURL(formField.degree)}
                                        alt="Uploaded Preview"
                                        className="w-[250px] h-full object-cover flex-shrink-0 mx-auto"
                                      />
                                      <button
                                        onClick={() => setFormField({ ...formField, degree: "" })}
                                        className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                      >
                                        <CloseIcon fontSize='larger' />
                                      </button>
                                    </div>
                                  ) : (
                                    <label htmlFor="degree" className="cursor-pointer">
                                      <div className="w-10 h-10 object-cover flex-shrink-0 mx-auto">
                                        <img
                                          src={uploadLogo}
                                          alt="Upload Logo"
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="text-center mt-2">Drag and Upload your file here.</div>
                                    </label>
                                  )}
                                </div>
                                <Button
                                  className={`w-full mt-10 ${verification === false ? 'hidden' : ''}`}
                                  onClick={handleSubmit}
                                  disabled={!(verification !== "" || steps !== 2)}
                                >
                                  Upload File
                                </Button>
                              </div>
                            ) : steps === 2 ? (
                              <div className=' w-full'>
                                <div className=' flex flex-col w-full items-center justify-center'>
                                  <div className=' flex items-center justify-center gap-2'>
                                    <CheckCircleIcon fontSize="small" className=' text-green-500' />
                                    <div className='font-[600] font-inter'>File Uplaoded</div>
                                  </div>
                                  <div className=' text-gray-700 mt-2'>Proceed to payment once verification is completed. </div>
                                  <div className='text-gray-700'>This may take 1 - 2 business days.</div>
                                </div>
                                <Button className=" w-full mt-4" disabled>
                                  Make Payment
                                </Button>
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <>
                            {verification ? (
                              <div className=' w-full '>
                                <div className=' flex items-center justify-center gap-2 mb-5'>
                                  <CheckCircleIcon fontSize="small" className=' text-green-500' />
                                  <div className='font-[600] font-inter '>verification Completed</div>
                                </div>
                                <div className=' w-full'>
                                  {showPayPal ? (
                                    <Button
                                      className={`w-full ${verification === false ? 'hidden' : ''}`}
                                      onClick={handlePayPal}
                                      disabled={!(verification !== "" || steps !== 2)}
                                    >
                                      Make payment
                                    </Button>
                                  ) : (
                                    <PayPalButton
                                      amount="99.99"
                                      onPaymentSuccess={() => {
                                        console.log("Payment successful!");
                                        setPayment(true);
                                      }}
                                    />)}
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
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-[300px] text-white flex flex-col px-6 py-4 border-r-[1px] justify-between fixed bg-[#F8F9FA] h-full">
                  <div>
                    {/* Logo */}
                    <div className="w-[250px] object-cover flex-shrink-0 mb-10">
                      <a href="/">
                        <img src={logo} alt="Alumni" className="w-full h-full object-cover border-b-[1px] pb-5" loading="lazy" />
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
                      src={userData?.photoURL || userImg}
                      referrerPolicy="no-referrer"
                      alt="User Profile"
                      className="w-14 h-14 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-black text-lg font-semibold">{userData?.displayName || 'John Doe'}</p>
                      <p className="text-gray-500 text-sm">
                        {userData?.email ? `${userData.email}...` : 'johndoe@example.com'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-4/5 p-4 flex flex-col">
                  {renderView()}
                </div>
              </>
            )}
          </>
        )}
    </div>
  );
};

export default Dashboard;
