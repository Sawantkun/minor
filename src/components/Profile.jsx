import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import useAuth from "../hooks/AuthContext";
import Avatar from "../assets/svgs/avatar.png";
import Edit from "../assets/svgs/edit.svg";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCredentials, setDeleteCredentials] = useState({
    email: "",
    password: "",
  });
  const [userInfo, setUserInfo] = useState({
    city: "",
    educationLevel: "",
    graduationYear: "",
    companyName: "",
    experience: "",
    country: "",
    location: "",
    linkedinId: "",
    designation: "",
    profilePic: user?.photoURL || Avatar,
  });
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, userInfo);
      alert("Profile information saved successfully!");
      setIsEditing(false);
      fetchUserData(); // Ensure we fetch the latest data
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.error("No such user document!");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);


  const handleChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = () => {
    user && user.auth.signOut();
    navigate("/login");
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

  const handlePasswordChange = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.password !== password.currentPassword) {
          alert("Current password is incorrect!");
          return;
        }
        if (password.newPassword !== password.confirmPassword) {
          alert("New password and confirm password do not match!");
          return;
        }
        await updateDoc(userDocRef, { password: password.newPassword });
        alert("Password updated successfully!");
        setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert("User not found!");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occurred");
    }
  };


  return (
    <div className="py-4 px-6 ml-[310px] w-full">
      <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>
      <div className="flex gap-4 border-b pb-2 mb-6">
        <button
          className={`px-4 py-2 ${activeTab === "profile"
            ? "border-b-2 border-purple bg-gray-200 font-bold rounded-t-lg"
            : ""
            }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "security"
            ? "border-b-2 border-purple bg-gray-200 font-bold rounded-t-lg"
            : ""
            }`}
          onClick={() => setActiveTab("security")}
        >
          Password & Security
        </button>
      </div>
      {activeTab === "profile" && (
        <div>
          {!isEditing ? (
            <div className="p-6 shadow-md rounded-lg bg-white">
              <div className="flex items-center mb-4">
                <img
                  src={user?.photoURL || Avatar}
                  alt="User"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div className="ml-4">
                  <p className="text-black text-lg font-semibold">
                    {user?.displayName || "John Doe"}
                  </p>
                  <p className="text-gray-500">
                    {userInfo?.designation || "No designation"}
                  </p>
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
                <p>
                  <strong>Email:</strong> {user?.email}
                </p>
                <p>
                  <strong>City:</strong> {userInfo?.city}
                </p>
                <p>
                  <strong>Education Level:</strong> {userInfo?.educationLevel}
                </p>
                <p>
                  <strong>Graduation Year:</strong>{" "}
                  {userInfo?.graduationYear}
                </p>
                <p>
                  <strong>Company:</strong> {userInfo?.companyName}
                </p>
                <p>
                  <strong>Experience:</strong> {userInfo?.experience} years
                </p>
                <p>
                  <strong>Location:</strong> {userInfo?.location}
                </p>
                <p>
                  <strong>Country:</strong> {userInfo?.country}
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    href={userInfo?.linkedinId}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    {userInfo?.linkedinId}
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 shadow-md rounded-lg bg-white">
              <div className="mb-10">
                <label className="block font-medium mb-1">
                  Profile Picture
                </label>
                {user?.photoURL && (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mt-4"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1">Designation</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.designation || ""}
                    onChange={(e) =>
                      handleChange("designation", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">City</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Education Level
                  </label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.educationLevel || ""}
                    onChange={(e) =>
                      handleChange("educationLevel", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.graduationYear || ""}
                    onChange={(e) =>
                      handleChange("graduationYear", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.companyName || ""}
                    onChange={(e) =>
                      handleChange("companyName", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.experience || ""}
                    onChange={(e) =>
                      handleChange("experience", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Country</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.country || ""}
                    onChange={(e) => handleChange("country", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Linkedin</label>
                  <input
                    type="text"
                    className="w-full border px-3 py-2 rounded"
                    value={userInfo.linkedinId || ""}
                    onChange={(e) => handleChange("linkedinId", e.target.value)}
                  />
                </div>

              </div>
              <div className="mt-4">
                <button
                  className="bg-purple text-white px-4 py-2 rounded-md mr-3"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  onClick={() => setIsEditing(false)}
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
            className="bg-purple text-white px-4 py-2 rounded-lg w-max border border-purple font-medium mt-5 "
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
