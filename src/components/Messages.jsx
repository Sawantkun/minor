import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { doc, setDoc, collection, getDocs, query, orderBy, onSnapshot, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuth from "../hooks/AuthContext";
import SearchImg from "../assets/svgs/search.svg";
import UserImg from "../assets/svgs/avatar.png";
import SendImg from "../assets/svgs/send.svg";
import AttachImg from "../assets/svgs/attach.svg";
import BackgroundImg from "../assets/images/background.png";
import { Timestamp } from 'firebase/firestore'; // Import Timestamp to type-check if needed

const Messages = () => {
  const { user } = useAuth();
  const [currentChat, setCurrentChat] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(false);  // State to handle loading

  // Function to generate unique chat ID based on user IDs
  const getChatId = (user1, user2) => {
    const ids = [user1, user2];
    ids.sort();  // Sort the IDs lexicographically
    return ids.join("_");  // Join them to form a unique chat ID
  };

  // Fetching chats
  useEffect(() => {
    const fetchChats = async () => {
      if (user) {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        let chats = [];

        for (const doc of querySnapshot.docs) {
          if (doc.id !== user.uid) {
            const userData = doc.data();
            const messagesRef = collection(db, `chats/${getChatId(user.uid, doc.id)}/messages`);
            const messagesQuery = query(messagesRef, orderBy("timestamp", "desc"));
            const messageSnapshot = await getDocs(messagesQuery);

            let lastMessage = "No messages";
            if (!messageSnapshot.empty) {
              const lastMessageDoc = messageSnapshot.docs[0].data();
              lastMessage = lastMessageDoc.text || "No text in message";
            }

            const lastActive = userData.lastActive || "Online";

            chats.push({
                ...userData,
                lastMessage,
                lastActive,
                id: doc.id,
              });
          }
        }

        setChatList(chats);
      }
    };

    fetchChats();
  }, [user]);

  // Listening to messages for the current chat
  useEffect(() => {
    if (currentChat?.id) {
      const chatId = getChatId(user.uid, currentChat.id);  // Generate unique chat ID
      const messagesRef = collection(db, `chats/${chatId}/messages`);
      const q = query(messagesRef, orderBy("timestamp"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let messagesData = [];
        querySnapshot.forEach((doc) => {
          messagesData.push(doc.data());
        });
        setMessages(messagesData);  // Set the messages for the chat
      });
      return () => unsubscribe();  // Cleanup on unmount
    }
  }, [currentChat]);

  const updateLastActive = async () => {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { lastActive: new Date() }, { merge: true });
  };

  const handleSendMessage = async () => {
    if (!message && !file) return;

    setLoading(true); // Start loading state

    let fileUrl = null;

    if (file) {
      const storageRef = ref(storage, `chat_files/${file.name}`);
      try {
        const fileSnapshot = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(fileSnapshot.ref);
      } catch (error) {
        console.error("Error uploading file: ", error);
        setLoading(false);
        return;
      }
    }

    const newMessage = {
      senderId: user.uid,
      text: file ? ` File: ${file.name}` : message,
      file: fileUrl,
      timestamp: Timestamp.now(),  // Use Firestore Timestamp for accurate sorting
    };

    if (currentChat?.id) {
      try {
        const chatId = getChatId(user.uid, currentChat.id);  // Generate unique chat ID
        await addDoc(collection(db, `chats/${chatId}/messages`), newMessage);
        await updateLastActive();  // Update last active time
        setMessage("");
        setFile(null);
      } catch (error) {
        console.error("Error sending message: ", error);
      }
    }

    setLoading(false); // End loading state
  };

  const filteredChatList = chatList.filter((chat) =>
    chat.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-[310px] w-full px-6">
      <h1 className="text-3xl font-bold text-gray-800 pt-4 pb-8">Messages</h1>
      <div className="flex py-0 h-[85vh] bg-gray-100 custom-shadow2 rounded-2xl">
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
          {filteredChatList.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setCurrentChat(chat)}
              className={`flex items-center gap-4 p-4 hover:bg-gray-200 cursor-pointer ${currentChat?.id === chat.id ? "bg-gray-200" : ""}`}
            >
              <img src={chat.photoURL || UserImg} alt={chat.displayName} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold">{chat.displayName}</h3>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="w-2/3 flex flex-col relative">
          {currentChat ? (
            <div className="bg-purple text-white px-4 py-[17px] flex items-center gap-4 rounded-tr-md">
              <img src={currentChat.photoURL || UserImg} alt={currentChat.displayName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h2 className="text-lg font-semibold">{currentChat.displayName}</h2>
                <p className="text-sm text-gray-200">Online</p>
              </div>
            </div>
          ):( <span className="bg-purple text-2xl absolute top-[45%] left-[40%] font-bold  text-white px-6 py-3 rounded-lg">Click On A Chat !</span>)}

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
                className={`flex items-start mb-4 ${msg.senderId === user.uid ? "justify-end" : "justify-start"}`}
              >
                {msg.senderId !== user.uid && (
                  <img
                    src={currentChat.photoURL || UserImg}
                    alt={msg.senderId}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-lg ${msg.senderId === user.uid ? "bg-purple text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none "}`}
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
                      ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : "Invalid timestamp"}
                  </p>
                </div>
              </div>
            ))}
          </div>

         {currentChat && (
             <div className="bg-white p-4 flex items-center gap-2 border-t border-gray-300 rounded-br-md relative">
             {file && (
               <span className="text-sm text-gray-600 bg-[#FFFFFF] p-2 truncate max-w-[150px] absolute left-0 top-[-32px]" title={file.name}>
                 {file.name}
               </span>
             )}
             <input
               type="file"
               className="hidden"
               onChange={(e) => {
                 const selectedFile = e.target.files[0];
                 if (selectedFile) {
                   setFile(selectedFile);
                 }
               }}
             />
             <button onClick={() => document.querySelector('input[type="file"]').click()}>
               <img src={AttachImg} alt="Attach" className="w-6 h-6" />
             </button>
             <input
               type="text"
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               placeholder="Type a message"
               className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none"
             />
             <button onClick={handleSendMessage} className={`bg-purple p-2 rounded-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
               {loading ? <span>Sending...</span> : <img src={SendImg} alt="Send" className="w-6 h-6" />}
             </button>
           </div>
         )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
