import React, { useState } from "react";
import SearchImg from "../assets/svgs/search.svg";
import UserImg from "../assets/svgs/avatar.png";
import SendImg from "../assets/svgs/send.svg";
import AttachImg from "../assets/svgs/attach.svg";
import BackgroundImg from "../assets/images/background.png";

const Messages = () => {
  const chatList = [
    {
      id: 1,
      name: "Sawant Kumar",
      avatar: UserImg,
      lastMessage: "Hey! How are you?",
      time: "10:30 AM",
      messages: [
        { id: 1, sender: "John", text: "Hey!", time: "10:29 AM", isSender: false },
        { id: 2, sender: "You", text: "Hi John! How are you?", time: "10:30 AM", isSender: true },
        { id: 3, sender: "John", text: "I am great!", time: "10:31 AM", isSender: false },
      ],
    },
    {
      id: 2,
      name: "Jhankar Sethi",
      avatar: UserImg,
      lastMessage: "Let’s catch up soon!",
      time: "Yesterday",
      messages: [
        { id: 1, sender: "You", text: "Hello Jane!", time: "9:00 AM", isSender: true },
        { id: 2, sender: "Jane", text: "Let’s catch up soon!", time: "9:01 AM", isSender: false },
      ],
    },
    {
      id: 3,
      name: "Kushagra Setth",
      avatar: UserImg,
      lastMessage: "Hey! How are you?",
      time: "10:30 AM",
      messages: [
        { id: 1, sender: "John", text: "Hey!", time: "10:29 AM", isSender: false },
        { id: 2, sender: "You", text: "Hi John! How are you?", time: "10:30 AM", isSender: true },
        { id: 3, sender: "John", text: "I am great!", time: "10:31 AM", isSender: false },
      ],
    },
    {
      id: 4,
      name: "Oshi Raghav",
      avatar: UserImg,
      lastMessage: "Let’s catch up soon!",
      time: "Yesterday",
      messages: [
        { id: 1, sender: "You", text: "Hello Jane!", time: "9:00 AM", isSender: true },
        { id: 2, sender: "Jane", text: "Let’s catch up soon!", time: "9:01 AM", isSender: false },
      ],
    },
  ];

  const [currentChat, setCurrentChat] = useState(chatList[0]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [modalFile, setModalFile] = useState(null);
  const [modalFileContent, setModalFileContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = () => {
    if (!message && !file) return;

    const newMessage = {
      id: currentChat.messages.length + 1,
      sender: "You",
      text: file ? `📎 ${file.name}` : message,
      file: file || null,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSender: true,
    };

    setCurrentChat((prevChat) => ({
      ...prevChat,
      messages: [...prevChat.messages, newMessage],
    }));

    setMessage("");
    setFile(null);
  };

  const handleFilePreview = (file) => {
    if (file.type.startsWith("image/")) {
      setModalFileContent(URL.createObjectURL(file));
    } else if (file.type === "application/pdf") {
      setModalFileContent(URL.createObjectURL(file));
    } else if (file.type.startsWith("text/")) {
      const reader = new FileReader();
      reader.onload = () => setModalFileContent(reader.result);
      reader.readAsText(file);
    } else {
      setModalFileContent("Unsupported file type.");
    }
    setModalFile(file);
  };


  const filteredChatList = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="ml-[310px] w-full px-6">
      <h1 className="text-3xl font-bold text-gray-800 pt-4 pb-8 ">Messages</h1>
      <div className="flex py-0 h-[85vh] bg-gray-100 custom-shadow2 rounded-2xl">
        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r rounded-l-md">
          {/* Search Input */}
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
              className={`flex items-center gap-4 p-4 hover:bg-gray-200 cursor-pointer ${
                currentChat?.id === chat.id ? "bg-gray-200" : ""
              }`}
            >
              <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold">{chat.name}</h3>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              <p className="text-xs text-gray-400">{chat.time}</p>
            </div>
          ))}
        </div>

        {/* Chat View */}
        <div className="w-2/3 flex flex-col">
          {/* Chat Header */}
          <div className="bg-purple text-white px-4 py-[17px] flex items-center gap-4 rounded-tr-md">
            <img src={currentChat.avatar} alt={currentChat.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="text-lg font-semibold">{currentChat.name}</h2>
              <p className="text-sm text-gray-200">Online</p>
            </div>
          </div>

 {/* Chat Body */}
 <div
  className="flex-1 p-4 overflow-y-auto bg-[#eee]"
  style={{
    backgroundImage: `url(${BackgroundImg})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }}
>
  {currentChat.messages.map((message) => (
    <div
      key={message.id}
      className={`flex items-start mb-4 ${
        message.isSender ? "justify-end" : "justify-start"
      }`}
    >
      {!message.isSender && (
        <img
          src={currentChat.avatar}
          alt={message.sender}
          className="w-10 h-10 rounded-full mr-3"
        />
      )}
      <div
        className={`max-w-xs px-4 py-2 rounded-lg ${
          message.isSender
            ? "bg-purple text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        {message.file ? (
          <button
            onClick={() => handleFilePreview(message.file)}
            className="text-sm hover:underline text-white"
          >
            {message.text}
          </button>
        ) : (
          <p className="text-sm">{message.text}</p>
        )}
        <p className="text-xs text-gray-400 text-right">{message.time}</p>
      </div>
    </div>
  ))}
</div>


   {/* Input Bar */}
<div className="bg-white p-4 flex items-center gap-2 border-t border-gray-300 rounded-br-md relative">
     {/* Display file name as an indicator */}
  {file && (
    <span className="text-sm text-gray-600 bg-[#FFFFFF] p-2 truncate max-w-[150px] absolute left-0 top-[-32px]" title={file.name}>
      📎 {file.name}
    </span>
  )}
  <label className="cursor-pointer bg-gray-100 rounded-full p-2 hover:bg-gray-200" title="Attach a file">
    <img className="w-6" src={AttachImg} alt="Attach" />
    <input
      type="file"
      className="hidden"
      onChange={(e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
      }}
    />
  </label>

  <input
    type="text"
    placeholder="Type a message..."
    className="flex-1 border rounded-lg px-4 py-2 outline-none"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
  <button className="bg-purple text-white p-2 rounded-full" onClick={handleSendMessage}>
    <img className="w-[30px] translate-x-1" src={SendImg} alt="Send" />
  </button>
</div>

        </div>
      </div>

   {/* Modal */}
{modalFile && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="bg-white p-6 rounded-lg w-[90vw] h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">File Preview</h2>
        <button
          className="text-purple font-semibold text-lg"
          onClick={() => setModalFile(null)}
        >
          ✖
        </button>
      </div>

      {/* Preview Area */}
      <div className="flex-1 border p-4 overflow-auto bg-gray-100 rounded-lg">
        {modalFile.type.startsWith("image/") && (
          <img
            src={modalFileContent}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        )}
        {modalFile.type === "application/pdf" && (
          <iframe
            src={modalFileContent}
            title="PDF Preview"
            className="w-full h-full"
          ></iframe>
        )}
        {modalFile.type.startsWith("text/") && (
          <pre className="whitespace-pre-wrap">{modalFileContent}</pre>
        )}
        {!modalFile.type.startsWith("image/") &&
          !modalFile.type.startsWith("text/") &&
          modalFile.type !== "application/pdf" && (
            <p>{modalFileContent}</p>
          )}
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 text-black font-bold px-4 py-2 rounded"
          onClick={() => setModalFile(null)}
        >
          Close
        </button>
        <a
          href={modalFileContent}
          download={modalFile.name}
          className="bg-purple text-white px-4 py-2 rounded font-bold"
        >
          Download
        </a>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Messages;
