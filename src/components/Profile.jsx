import React, { useState } from "react";
import Avatar from "../assets/svgs/avatar.png";
import Edit from "../assets/svgs/edit.svg";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCredentials, setDeleteCredentials] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/");
  };

  const [userInfo, setUserInfo] = useState({
    profilePic: "",
    username: "Sawant Kumar",
    email: "Sawant@example.com",
    educationLevel: "Bachelor's",
    designation: "Software Engineer",
    graduationYear: "2022",
    companyName: "Tech Corp",
    linkedinId: "https://linkedin.com/in/sawant",
    city: "Greater Noida",
    experience: 3,
    country: "India",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile information saved successfully!");
  };

  const handlePasswordChange = () => {
    if (password.newPassword === password.confirmPassword) {
      alert("Password updated successfully!");
    } else {
      alert("New password and confirm password do not match!");
    }
  };

  const handleDeleteAccount = () => {
    if (
      deleteCredentials.email === userInfo.email &&
      deleteCredentials.password
    ) {
      alert("Account deleted successfully!");
      setShowDeleteModal(false);
      navigate("/");
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="py-4 px-6 ml-[310px] w-full">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2 mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "profile"
              ? "border-b-2 border-purple bg-gray-200 font-bold rounded-t-lg"
              : ""
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "security"
              ? "border-b-2 border-purple bg-gray-200 font-bold rounded-t-lg"
              : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          Password & Security
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div>
          {!isEditing ? (
            <div className="p-6 shadow-md rounded-lg bg-white">
              <div className="flex items-center mb-4">
                <img
                  src={userInfo.profilePic || Avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full"
                />
                <div className="ml-4">
                  <h2 className="text-xl font-bold">{userInfo.username}</h2>
                  <p className="text-gray-500">{userInfo.designation}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="ml-auto"
                  aria-label="Edit Profile"
                >
                  <img className="w-7" src={Edit} alt="Edit Icon" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>City:</strong> {userInfo.city}</p>
                <p><strong>Education Level:</strong> {userInfo.educationLevel}</p>
                <p><strong>Graduation Year:</strong> {userInfo.graduationYear}</p>
                <p><strong>Company:</strong> {userInfo.companyName}</p>
                <p><strong>Experience:</strong> {userInfo.experience} years</p>
                <p><strong>Country:</strong> {userInfo.country}</p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={userInfo.linkedinId} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                    {userInfo.linkedinId}
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 shadow-md rounded-lg bg-white">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">Profile Picture</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        profilePic: URL.createObjectURL(e.target.files[0]),
                      }))
                    }
                  />
                  {userInfo.profilePic && (
                    <img
                      src={userInfo.profilePic}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mt-4"
                    />
                  )}
                </div>
                {Object.keys(userInfo)
                  .filter((key) => key !== "profilePic")
                  .map((key) => (
                    <div key={key}>
                      <label className="block font-medium mb-1 capitalize">
                        {key.replace(/([A-Z])/g, " $1")}
                      </label>
                      <input
                        type="text"
                        className="w-full border px-3 py-2 rounded"
                        value={userInfo[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                    </div>
                  ))}
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="bg-purple text-white px-4 py-2 rounded-lg border border-purple"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-black px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

 {/* Danger Zone */}
 {activeTab === "profile" && (
        <div className="mt-8 bg-red-100 border border-red-300 rounded-lg p-4">
          <h3 className="text-red-700 text-lg font-bold mb-3">Danger Zone</h3>
          <div className="flex gap-4">
            <button
              onClick={handleLogout}
              className="bg-purple text-white py-2 rounded-lg w-[80px] border border-purple font-medium"
            >
              Logout
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-lg font-bold text-red-600 mb-4">
              Confirm Account Deletion
            </h2>
            <p className="mb-4 text-gray-700">
              Please enter your email and password to confirm account deletion.
            </p>
            <div className="mb-4">
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border px-3 py-2 rounded"
                value={deleteCredentials.email}
                onChange={(e) =>
                  setDeleteCredentials((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border px-3 py-2 rounded"
                value={deleteCredentials.password}
                onChange={(e) =>
                  setDeleteCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold"
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-purple text-white font-bold px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Password & Security Tab */}
      {activeTab === "security" && (
        <div className="max-w-md">
          <div className="mb-4">
            <label className="block font-medium mb-1">Current Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password.currentPassword}
              onChange={(e) =>
                setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password.newPassword}
              onChange={(e) =>
                setPassword((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password.confirmPassword}
              onChange={(e) =>
                setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="bg-purple text-white px-4 py-2 rounded-lg w-[120px] border border-purple font-medium mt-5"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
