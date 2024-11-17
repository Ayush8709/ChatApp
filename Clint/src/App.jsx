import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const App = () => {
  const [username, setUserName] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for incoming messages
    socket.on('recevied-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket listener when the component unmounts
    return () => {
      socket.off('recevied-message');
    };
  }, []);  // Empty dependency array, runs once when the component mounts

  const handelSubmit = (e) => {
    e.preventDefault();
    const messageData = {
      message: newMessage,
      user: username,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
    };

    if (newMessage !== '') {
      socket.emit('send-message', messageData);
      setNewMessage('');
    } else {
      alert('Please enter a message');
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
      {chatActive ? (
        <div className="rounded-md p-2 w-full md:w-[80vw] lg:w-[40vw] mx-auto">
          <h1 className="text-center font-bold text-xl my-2 uppercase">Squad Chat</h1>
          <div>
            <div className="overflow-scroll h-[80vh] lg:h-[60vh]">
              {messages.map((message, index) => {
                return (
                  <div
                    key={index}
                    className={`flex rounded-md shadow-md my-5 w-fit ${username === message.user && 'ml-auto'
                      }`}
                  >
                    <div className="bg-green-400 flex justify-center items-center rounded-l-md">
                      <h3 className="font-bold text-lg px-2">{message.user.charAt(0).toUpperCase()}</h3>
                    </div>
                    <div className="py-2 bg-white rounded-md">
                      <span className="text-sm">{message.user}</span>
                      <h3 className="font-bold">{message.message}</h3>
                      <h3 className="text-xs text-right">{message.time}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
            <form className="flex gap-2 md:gap-4 justify-between" onSubmit={handelSubmit}>
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full rounded-md border-2 outline-none px-3 py-2"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
              <button type="submit" className="px-3 py-2 bg-green-500 text-white rounded-md font-bold">
                Send
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="w-screen h-screen flex justify-center items-center gap-2">
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            name=""
            id=""
            className="text-center px-3 py-2 outline-none border-2 rounded-md"
            placeholder="Enter User Name"
          />
          <button
            type="submit"
            onClick={() => {
              if (username !== '') {
                setChatActive(true);
              }
            }}
            className="bg-green-500 text-white px-3 py-2 rounded-md font-bold"
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
