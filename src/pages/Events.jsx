import { useState } from "react";
import VirtualEvents from "../components/VirtualEvents";
import IRLEvents from "../components/IRLEvents";
import Modal from "../components/ui/Modal";
import { db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import useAuth from "../hooks/AuthContext";

const Events = () => {
  const [tab, setTab] = useState("virtual");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    organizer: "",
    location: "",
    meetLink: ""
  });
  const [image, setImage] = useState(null);

  const { userData } = useAuth();

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      alert("You must be logged in to request an event.");
      return;
    }
    let imageUrl = "";
    try {
      if (image) {
        // Upload image to Firebase Storage
        const storageRef = window.firebaseStorageRef || (await import("firebase/storage")).ref;
        const { storage } = await import("../firebase");
        const { uploadBytes, getDownloadURL } = await import("firebase/storage");
        const imgRef = storageRef(storage, `eventImages/${Date.now()}_${image.name}`);
        await uploadBytes(imgRef, image);
        imageUrl = await getDownloadURL(imgRef);
      }
      await addDoc(collection(db, "eventRequests"), {
        ...form,
        image: imageUrl,
        status: "pending",
        user: {
          displayName: userData.displayName || "Anonymous",
          email: userData.email || "",
          photoURL: userData.photoURL || "",
          uid: userData.uid || "",
        },
        createdAt: new Date(),
      });
      alert("Event request submitted!");
      setModalOpen(false);
      setForm({
        title: "",
        description: "",
        date: "",
        time: "",
        organizer: "",
        location: "",
        meetLink: ""
      });
      setImage(null);
    } catch (error) {
      alert("Failed to submit event request.");
      console.error(error);
    }
  };

  return (
    <div className="pl-[300px] min-h-screen flex flex-col items-left bg-gray-50 py-2 !w-[97vw]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Events</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search events..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-purple"
            value={search}
            onChange={handleSearchChange}
          />
          <button
            className="bg-purple text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-purple-700 transition"
            onClick={() => setModalOpen(true)}
          >
            Request Event
          </button>
        </div>
      </div>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-8 py-3 rounded-xl text-2xl font-semibold transition-all duration-300 ${tab === "virtual" ? "bg-purple text-white" : "bg-gray-200 text-black"}`}
          onClick={() => setTab("virtual")}
        >
          Virtual Events
        </button>
        <button
          className={`px-8 py-3 rounded-xl text-2xl font-semibold transition-all duration-300 ${tab === "irl" ? "bg-purple text-white" : "bg-gray-200 text-black"}`}
          onClick={() => setTab("irl")}
        >
          IRL Events
        </button>
      </div>
      <div className="w-full max-w-4xl">
        {tab === "virtual" && <VirtualEvents search={search} />}
        {tab === "irl" && <IRLEvents search={search} />}
      </div>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>Request an Event</Modal.Header>
        <Modal.Body>
          <form className="flex flex-col gap-4" onSubmit={handleFormSubmit}>
            <input
              name="title"
              type="text"
              placeholder="Event Title"
              className="border rounded-lg px-4 py-2"
              value={form.title}
              onChange={handleFormChange}
              required
            />
            <textarea
              name="description"
              placeholder="Event Description"
              className="border rounded-lg px-4 py-2"
              value={form.description}
              onChange={handleFormChange}
              required
            />
            <div className="flex gap-2">
              <input
                name="date"
                type="date"
                className="border rounded-lg px-4 py-2 flex-1"
                value={form.date}
                onChange={handleFormChange}
                required
              />
              <input
                name="time"
                type="time"
                className="border rounded-lg px-4 py-2 flex-1"
                value={form.time}
                onChange={handleFormChange}
                required
              />
            </div>
            <input
              name="organizer"
              type="text"
              placeholder="Organizer Name"
              className="border rounded-lg px-4 py-2"
              value={form.organizer}
              onChange={handleFormChange}
              required
            />
            <input
              name="location"
              type="text"
              placeholder="Location (for IRL events)"
              className="border rounded-lg px-4 py-2"
              value={form.location}
              onChange={handleFormChange}
            />
            <input
              name="meetLink"
              type="url"
              placeholder="Google Meet Link (for virtual events)"
              className="border rounded-lg px-4 py-2"
              value={form.meetLink}
              onChange={handleFormChange}
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setImage(e.target.files[0])}
              className="border rounded-lg px-4 py-2"
            />
            <button
              type="submit"
              className="bg-purple text-white px-6 py-2 rounded-lg font-semibold text-lg hover:bg-purple-700 transition mt-2"
            >
              Submit Request
            </button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Events;
