import React, { useState, useEffect } from "react";
import useAuth from "../hooks/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";

const defaultAvatar = "/src/assets/svgs/avatar.png";

const EventRepository = ({ eventId }) => {
  const { userData } = useAuth();
  const [posts, setPosts] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const q = query(collection(db, `eventRequests/${eventId}/repository`), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
      setLoading(false);
    };
    if (eventId) fetchPosts();
  }, [eventId]);

  const handlePost = async () => {
    if ((input || image) && userData) {
      let imageUrl = null;
      if (image) {
        const storageRef = window.firebaseStorageRef || (await import("firebase/storage")).ref;
        const { storage } = await import("../firebase");
        const { uploadBytes, getDownloadURL } = await import("firebase/storage");
        const imgRef = storageRef(storage, `eventRepoImages/${eventId}_${Date.now()}_${image.name}`);
        await uploadBytes(imgRef, image);
        imageUrl = await getDownloadURL(imgRef);
      }
      const postData = {
        text: input,
        image: imageUrl,
        user: {
          displayName: userData.displayName || "Anonymous",
          email: userData.email || "",
          photoURL: userData.photoURL || defaultAvatar,
          uid: userData.uid || null,
        },
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, `eventRequests/${eventId}/repository`), postData);
      setInput("");
      setImage(null);
      // Refresh posts
      const q = query(collection(db, `eventRequests/${eventId}/repository`), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    }
  };

  const handleDelete = async (id) => {
    // Optional: implement delete with Firestore if needed
    alert("Delete functionality for posts in Firestore is not implemented in this snippet.");
  };

  return (
    <div className="mt-10 bg-gray-100 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4">Event Repository</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <textarea
          className="flex-1 border rounded-lg p-2"
          placeholder="Share something about the event..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <button
          className="bg-purple text-white px-4 py-2 rounded-lg font-semibold"
          onClick={handlePost}
        >
          Post
        </button>
      </div>
      <div className="space-y-4">
        {loading && <p className="text-gray-500">Loading posts...</p>}
        {!loading && posts.length === 0 && <p className="text-gray-500">No posts yet.</p>}
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg p-4 shadow flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <img src={post.user?.photoURL || defaultAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="font-semibold text-gray-800">{post.user?.displayName}</div>
                <div className="text-xs text-gray-500">{post.user?.email}</div>
              </div>
              {/*
              {userData && post.user?.uid === userData.uid && (
                <button
                  className="ml-4 text-red-500 hover:text-red-700 text-sm font-bold px-2 py-1 rounded"
                  onClick={() => handleDelete(post.id)}
                  title="Delete post"
                >
                  Delete
                </button>
              )}
              */}
            </div>
            {post.text && <div className="text-gray-800">{post.text}</div>}
            {post.image && <img src={post.image} alt="event" className="max-h-60 rounded-lg object-cover" />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventRepository;
