import { useState } from "react";
import logo from "../../assets/fulllogogbu 1.png";
import DirectoryImg from "../../assets/svgs/bxs_dashboard.svg";
import MessagesImg from "../../assets/svgs/messages.svg";
import NoticeImg from "../../assets/svgs/news.svg";
import JobsImg from "../../assets/svgs/jobs.svg";
import useAuth from "../../hooks/AuthContext";
import Requests from "../../components/Requests"
import Messages from "../../components/Messages"
import JobPortal from "../../components/JobPortal"
import AddNotices from "../../components/AddNotices"
import Profile from "../../components/Profile";

const Dashboard = () => {
  const [view, setView] = useState("requests");
  const { userData } = useAuth();

  const buttons = [
    { label: "Requests", id: "requests", icon: DirectoryImg },
    { label: "Messages", id: "messages", icon: MessagesImg },
    { label: "Notices", id: "notices", icon: NoticeImg },
    { label: "Job Portal", id: "jobPortal", icon: JobsImg },
  ];

  const renderView = () => {
    switch (view) {
      case "requests":
        return <Requests />;
      case "messages":
        return <Messages />;
      case "notices":
        return <AddNotices />;
      case "jobPortal":
        return <JobPortal />;
      case 'profile':
        return <Profile />;
      default:
        return <div>Requests Component</div>;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-[310px] text-white flex flex-col px-6 py-4 border-r-[1px] justify-between fixed bg-[#F8F9FA] h-full">
        <div>
          {/* Logo */}
          <div className="w-[270px] object-cover flex-shrink-0 mb-10">
            <a href="/">
              <img
                src={logo}
                alt="Alumni"
                className="w-full h-full object-cover border-b-[1px] pb-5"
              />
            </a>
          </div>

          {/* Sidebar Buttons */}
          {buttons.map(({ label, id, icon }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`mb-5 py-3 w-full px-8 rounded-xl text-2xl hover:bg-purple hover:text-white flex gap-3 transition-all duration-300 items-center group ${view === id ? "bg-purple text-white" : "text-black"
                }`}
            >
              <img
                className={`w-10 h-7 filter group-hover:invert ${view === id ? "invert" : ""
                  }`}
                src={icon}
                alt={label}
              />
              {label}
            </button>
          ))}
        </div>

        {/* User Profile Section */}
        <div
          className="flex items-center gap-4 border-t-[1px] p-4 mt-8 cursor-pointer hover:bg-gray-200 rounded-lg transition-all duration-300"
          onClick={() => setView("profile")}
        >
          <img
            src={userData?.photoURL || "../assets/images/user.png"}
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="text-black text-lg font-semibold">
              {userData?.displayName || "John Doe"}
            </p>
            <p className="text-gray-500 text-sm">
              {userData?.email
                ? `${userData.email.length > 20 ? userData.email.substring(0, 20) + "..." : userData.email}`
                : "johndoe@example.com"}
            </p>
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className=" w-4/5  bg-gray-50">{renderView()}</div>
    </div>
  );
};

export default Dashboard;
