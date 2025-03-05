import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { doc, setDoc, collection, getDocs, query, orderBy, onSnapshot, addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuth from '../hooks/AuthContext';
import SearchImg from "../assets/svgs/search.svg";
import UserImg from "../assets/svgs/avatar.png";
import SendImg from "../assets/svgs/send.svg";
import AttachImg from "../assets/svgs/attach.svg";
import BackgroundImg from "../assets/images/background.png";
import { Timestamp } from "firebase/firestore";
import { Send } from "@mui/icons-material";
// Other imports...

const Messages = ({ userId, onResetUserId, jobData }) => {

  const { userData } = useAuth();
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");  // Initial empty state
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const getChatId = (user1, user2) => { const ids = [user1, user2]; ids.sort(); return ids.join("_"); };

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      if (userData) {
        setLoading(true);
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        let chats = [];
        for (const doc of querySnapshot.docs) {
          if (doc.id !== userData.uid) {
            const userData = doc.data();
            const messagesRef = collection(db, `chats/${getChatId(userData.uid, doc.id)}/messages`);
            const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"));
            const messageSnapshot = await getDocs(messagesQuery);
            let lastMessage = "No messages";
            if (!messageSnapshot.empty) {
              const lastMessageDoc = messageSnapshot.docs[0].data(); lastMessage = lastMessageDoc.text || "No text in message";
            }
            const lastActive = userData.lastActive || "Online";
            chats.push({ ...userData, lastMessage, lastActive, id: doc.id, });
          }
        }
        console.log("jhd", chatList)
        setChatList(chats);
        setLoading(false);
      }
    };

    fetchChats();
  }, [userData]);

  // Fetch receiving user and set as currentChat
  useEffect(() => {
    if (!userId) {
      return;
    }
    const fetchReceivingUser = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          setCurrentChat({ ...userDoc.data(), id: userDoc.id });
        } else {
          console.log("No such user found for userId:", userId);
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    fetchReceivingUser();
  }, [userId]);

  // Listen to messages for the current chat
  useEffect(() => {
    if (currentChat?.id) {
      const chatId = getChatId(userData?.uid, currentChat.id);
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let messagesData = [];
        querySnapshot.forEach((doc) => {
          messagesData.push(doc.data());
        });
        setMessages(messagesData);
      });
      return () => unsubscribe();
    }
  }, [currentChat]);

  const handleSendMessage = async () => {
    if (!message && !file) return;
    let fileUrl = null;
    if (file) {
      const storageRef = ref(storage, `chat_files/${file.name}`);
      try {
        const fileSnapshot = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(fileSnapshot.ref);
      } catch (error) {
        console.log("Error uploading file: ", error);
        return;
      }
    }
    const newMessage = {
      senderId: userData.uid,
      text: file ? ` File: ${file.name}` : message,
      file: fileUrl,
      timestamp: Timestamp.now(),
    };
    if (currentChat?.id) {
      try {
        const chatId = getChatId(userData.uid, currentChat.id);
        await addDoc(collection(db, `chats/${chatId}/messages`), newMessage);
        setMessage("");
        setFile(null);
      } catch (error) {
        console.log("Error sending message: ", error);
      }
    }
  };

  const filteredChatList = chatList.filter((chat) =>
    chat.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!isUserTyping && !message && userId && jobData && currentChat) {
      if (currentChat.uid === userId) {
        setMessage(`Hello, I am interested in the ${jobData.role} job at your company ${jobData.company}.`);
      }
    }
  }, [userId, jobData, message, isUserTyping]);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);
    if (!isUserTyping && value !== "") {
      setIsUserTyping(true);
    }
  };

  return (
    <div className="ml-[310px] w-full px-6">
      <h1 className="text-3xl font-bold text-gray-800 pt-4 pb-8">Messages</h1>
      <div className="flex py-0 h-[85vh] bg-gray-100 custom-shadow2 rounded-2xl">
        {/* Chat list */}
        <div className="w-1/3 bg-white border-r rounded-l-md">
          <div className="flex border-2 px-5 rounded-lg w-auto my-5 mx-4">
            <img className="w-6 opacity-50" src={SearchImg} alt="Search" />
            <input
              type="text"
              placeholder="Search"
              className="border-none text-black text-xl rounded-lg px-4 py-2 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {loading ? (
            <p className="text-lg font-medium text-center">Loading users...</p>
          ) : (
            <>
              {chatList.length > 0 ? filteredChatList.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => { setCurrentChat(chat), onResetUserId() }}
                  className={`flex items-center gap-4 p-4 hover:bg-gray-200 cursor-pointer ${currentChat?.id === chat.id ? "bg-gray-200" : ""}`}
                >
                  <img src={chat.photoURL || UserImg} alt={chat.displayName} className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{chat.displayName}</h3>
                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              )) : (
                <p className="text-lg font-medium text-center">No user found</p>
              )}
            </>
          )}
        </div>

        {/* Chat and Message area */}
        <div className="w-2/3 flex flex-col relative">
          {currentChat ? (
            <div className="bg-purple text-white px-4 py-[17px] flex items-center gap-4 rounded-tr-md">
              <img src={currentChat.photoURL || UserImg} alt={currentChat.displayName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h2 className="text-lg font-semibold">{currentChat.displayName}</h2>
                <p className="text-sm text-gray-200">Online</p>
              </div>
            </div>
          ) : (
            <span className="bg-purple text-2xl absolute top-[45%] left-[40%] font-bold  text-white px-6 py-3 rounded-lg">Click On A Chat!</span>
          )}

          <div
            className="flex-1 p-4 overflow-y-auto bg-[#eee]"
            style={{
              backgroundImage: `url(${BackgroundImg})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${msg.senderId === userData.uid ? "justify-end" : "justify-start"}`}
              >
                {msg.senderId !== userData.uid && (
                  <img
                    src={currentChat.photoURL || UserImg}
                    alt={msg.senderId}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${msg.senderId === userData.uid ? "bg-purple text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none "}`}
                >
                  {msg.file ? (
                    <a href={msg.file} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline text-blue-500 flex">
                      🔗{msg.text}
                    </a>
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                  <p className="text-xs text-gray-400 text-right">
                    {msg.timestamp && msg.timestamp instanceof Timestamp
                      ? new Date(msg.timestamp.toMillis()).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {currentChat && (
            <div className="flex items-center bg-white p-4 border-t gap-4">
              <label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <img
                  src={AttachImg}
                  alt="Attach"
                  className="w-8 h-8 opacity-50 cursor-pointer"
                />
              </label>
              <textarea
                placeholder="Type a message"
                className="w-full border rounded-lg px-4 py-2 focus:outline-none h-full"
                value={message}
                onChange={handleChange}
              />

              <button
                onClick={handleSendMessage}
                className="flex items-center justify-center rounded-ful bg-purple text-white p-4 rounded-lg"
              >
                <Send />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

