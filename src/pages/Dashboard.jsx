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
import CloseIcon from '@mui/icons-material/Close';
import PayPalButton from '../components/PaypalButton';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

// In Dashboard.jsx
import useAuth from '../hooks/AuthContext'; // Make sure the import matches the default export


const Dashboard = ({ userId }) => {
    const [showPayPal, setShowPayPal] = useState(true);
    const [view, setView] = useState('directory');
    const [isNewUser, setIsNewUser] = useState(true);
    const [steps, setSteps] = useState(0);
    const [verification, setVerification] = useState(true); // "" to ge all steps of membership, false for verification denied, true for verification success
    const [payment, setPayment] = useState(true); // false for the payment method process
    const [formField, setFormField] = useState({ degree: "" });
    const { user, userData } = useAuth();

    const handlePayPal = () => {
      setShowPayPal(false);
    };

    const handleFileUpload = async (file) => {
        if (!file) {
          console.error("No file selected");
          return;
        }

        const storageRef = ref(storage, `degrees/${file.name}`);
        try {
          // Upload the file
          const snapshot = await uploadBytes(storageRef, file);

          // Get the file's download URL
          const downloadURL = await getDownloadURL(snapshot.ref);

          console.log("File uploaded successfully. Download URL:", downloadURL);

          // Update state or Firestore with the file URL
          setFormField({ ...formField, degree: downloadURL });
        } catch (error) {
          console.error("File upload failed:", error);
        }
      };
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

    const handleSubmit = () => {
      if (steps === 0) {
        setSteps(1);
      } else if (steps === 1 && formField.degree !== "") {
        setSteps(2);
      } else if (steps === 2) {
        setSteps(3);
      }
    };

    useEffect(() => {
        if (user) {
          console.log(user); // Check if the photoURL is available here
        }
      }, [user]);

    const buttons = [
      { label: 'Directory', id: 'directory', icon: DirectoryImg },
      { label: 'Messages', id: 'messages', icon: MessagesImg },
      { label: 'Notices', id: 'notices', icon: NoticeImg },
      { label: 'Job Portal', id: 'jobPortal', icon: JobsImg },
    ];
  return (
    <div className="flex min-h-screen max-h-full bg-[#F8F9FA]">
      {isNewUser && !payment ? (
        <div className="w-full flex flex-col h-full">
          <div className='w-full flex items-center px-8 py-4 justify-between fixed'>
            <div className="w-[280px] object-cover flex-shrink-0">
              <a href="/">
                <img src={logo} alt="Alumni" className="w-full object-cover" />
              </a>
            </div>
            <div className="flex items-center gap-4  p-4 mt-8 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-300" onClick={() => setView('profile')}>
            <img
  src={user?.photoURL || "../assets/images/user.png"}
  alt="User"
  className="w-14 h-14 rounded-full object-cover"
/>


          <div>
            <p className="text-black text-lg font-semibold">{userData?.displayName || 'John Doe'}</p> {/* Display name from Firestore */}
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
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file); // Call the upload function
      e.target.value = ""; // Reset input
    }
  }}
/>

                            {formField.degree ? (
                              <div className="relative">
                                <img
                                  src={formField.degree}
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

                      ) : steps === 2 && formField.degree !== "" && (
                        <div className=' w-full'>
                          <div className=' flex flex-col w-full items-center justify-center'>
                            <div className=' flex items-center justify-center gap-2'>
                              <CheckCircleIcon fontSize="small" className=' text-green-500' />
                              <div className='font-[600] font-inter'>File Uplaoded</div>
                            </div>
                            <div className=' text-gray-700 mt-2'>Proceed to payment once verification is completed. </div>
                            <div className='text-gray-700'>This may take 1 - 2 business days.</div>
                          </div>
                          <Button
                    className={`w-full mt-5 ${verification === false ? 'hidden' : ''}`}
                    onClick={handleSubmit}
                    disabled={!(verification !== "" || steps !== 2)}
                  >
                    Make Payment
                  </Button>
                        </div>
                      )}
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
    setPayment(true); // Update state or navigate as needed
  }}
/>    )}
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
  src={user?.photoURL || "../assets/images/user.png"}
  alt="User"
  className="w-14 h-14 rounded-full object-cover"
/>
              <div>
              <p className="text-black text-lg font-semibold">{userData?.displayName || 'John Doe'}</p> {/* Display name from Firestore */}
              <p className="text-gray-500 text-sm">
  {userData?.email ? `${userData.email.split('@')[0].slice(0, 25)}...` : 'johndoe@example.com'}
</p>
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
