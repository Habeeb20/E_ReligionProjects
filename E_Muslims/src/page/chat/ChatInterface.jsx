import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useTheme } from '../ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ChatInterface = () => {
  const { leaderId } = useParams();
  const navigate = useNavigate();
  const [chatSessions, setChatSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [leader, setLeader] = useState(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        console.log('Fetching chat sessions from:', `${import.meta.env.VITE_BACKEND_URL}/profile/chat/sessions`);
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/chat/sessions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setChatSessions(response.data.data);
      } catch (err) {
        console.error('Fetch chats error:', err.response?.status, err.response?.data);
        setError(err.response?.data?.message || 'Failed to fetch chats');
        toast.error(err.response?.data?.message || 'Failed to fetch chats');
      } finally {
        setLoadingSessions(false);
      }
    };
    fetchChats();
  }, []);

  useEffect(() => {
    if (!leaderId) return;

    setLoadingChat(true);
    setIsMobileChatOpen(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    console.log('LocalStorage:', { token: token ? 'provided' : 'missing', userId, email: localStorage.getItem('email') });
    if (!token || !userId) {
      setError('Missing authentication token or user ID');
      toast.error('Please log in again');
      navigate('/login');
      setLoadingChat(false);
      return;
    }

    console.log('Connecting to Socket.IO:', import.meta.env.VITE_BACKEND_URL1);
    socketRef.current = io(import.meta.env.VITE_BACKEND_URL1, {
      query: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket.IO connected');
      socketRef.current.emit('joinChat', { leaderId, userId });
    });

    socketRef.current.on('message', (message) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg._id === message._id)) return prev;
        return [...prev, message];
      });
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      toast.error(`Connection error: ${err.message}`);
      setError(`Connection error: ${err.message}`);
    });

    socketRef.current.on('error', (err) => {
      console.error('Socket.IO error:', err.message);
      toast.error(`Socket error: ${err.message}`);
      setError(`Socket error: ${err.message}`);
    });

    const fetchChat = async () => {
      try {
        console.log('Fetching profile:', `${import.meta.env.VITE_BACKEND_URL}/profile/${leaderId}`);
        console.log('Fetching messages:', `${import.meta.env.VITE_BACKEND_URL}/profile/chat/messages/${leaderId}`);
        const [leaderRes, messagesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/${leaderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/profile/chat/messages/${leaderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setLeader(leaderRes.data.data);
        setMessages(messagesRes.data.data);
      } catch (err) {
        console.error('Fetch chat error:', err.response?.status, err.response?.data);
        setError(err.response?.data?.message || 'Failed to load chat');
        toast.error(err.response?.data?.message || 'Failed to load chat');
      } finally {
        setLoadingChat(false);
      }
    };
    fetchChat();

    const interval = setInterval(() => {
      if (error.includes('Connection error')) {
        fetchChat();
      }
    }, 5000);

    return () => {
      socketRef.current.disconnect();
      console.log('Socket.IO disconnected');
      clearInterval(interval);
    };
  }, [leaderId, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('User ID not found. Please log in again.');
      navigate('/login');
      return;
    }

    const message = {
      leaderId,
      userId,
      content: newMessage,
      sender: 'user',
    };

    socketRef.current.emit('sendMessage', message);
    setMessages((prev) => [...prev, { ...message, createdAt: new Date() }]);
    setNewMessage('');
  };

  const handleSessionClick = (sessionLeaderId) => {
    setIsMobileChatOpen(true);
    navigate(`/chat/${sessionLeaderId}`);
  };

  const handleBack = () => {
    setIsMobileChatOpen(false);
    navigate('/chat');
  };

  if (loadingSessions) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-900"></div>
    </div>
  );
  if (error) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
        >
          Retry
        </button>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen mt-8 pt-16 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex mt-8 h-[calc(100vh-4rem)]">
        {/* Chat List */}
        <div className={`w-full md:w-1/3 bg-white md:bg-transparent border-r md:border-r-gray-200 overflow-y-auto ${isMobileChatOpen && leaderId ? 'hidden md:block' : 'block'}`}>
          <h1 className="text-xl md:text-2xl mt-4 font-bold text-indigo-900 p-4">Your Chats</h1>
          {chatSessions.length === 0 ? (
            <div className="text-center p-4">
              <p className="text-gray-600 text-sm mb-4">
                You haven't paid to chat with any leader yet.
              </p>
              <Link to="/choice">
                <button className="bg-indigo-900 text-white py-2 px-4 rounded-lg">
                  View Leaders to Chat
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {chatSessions.map((session) => (
                <div
                  key={session._id}
                  onClick={() => handleSessionClick(session.leaderId?._id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${
                    session.leaderId?._id === leaderId ? 'bg-gray-200' : ''
                  }`}
                  role="button"
                  aria-label={`Chat with ${session.leaderId?.title || ''} ${session.leaderId?.firstname || ''} ${session.leaderId?.lastname || ''}`}
                >
                  <img
                    src={
                      session.leaderId?.profilePicture ||
                      (session.leaderId?.gallery && session.leaderId.gallery.length > 0
                        ? session.leaderId.gallery[0]
                        : '/default-avatar.png')
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                    onError={(e) => (e.target.src = '/default-avatar.png')}
                  />
                  <div>
                    <h3 className="text-base font-semibold">
                      {session.leaderId
                        ? `${session.leaderId.title || ''} ${session.leaderId.firstname || ''} ${
                            session.leaderId.lastname || ''
                          }`.trim()
                        : 'Unknown Leader'}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      Paid on: {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Chat Conversation */}
        <div className={`w-full md:w-2/3 mt-4 flex-col ${isMobileChatOpen && leaderId ? 'flex' : 'hidden md:flex'}`}>
          {leaderId ? (
            <>
              {loadingChat ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-900"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : !leader ? (
                <p className="text-center text-indigo-600">User not found</p>
              ) : (
                <>
                  <div
                    className={`${
                      isDark ? 'bg-navy-blue-900' : 'bg-navy-blue-600'
                    } text-white p-4 flex items-center shadow-md sticky top-0 z-10`}
                  >
                    <img
                      src={
                        leader.profilePicture ||
                        (leader.gallery && leader.gallery.length > 0 ? leader.gallery[0] : '/default-avatar.png')
                      }
                      alt="Profile"
                      className="w-10 h-10 rounded-full mr-2"
                      onError={(e) => (e.target.src = '/default-avatar.png')}
                    />
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold">
                        {leader.title} {leader.firstname} {leader.lastname}
                      </h3>
                      <p className="text-sm">Online</p>
                    </div>
                    <button
                      onClick={handleBack}
                      className="bg-gray-500 text-white py-1 px-2 rounded-md"
                    >
                      Back
                    </button>
                  </div>
                  <div
                    className={`flex-1 overflow-y-auto p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className="max-w-full mx-auto">
                      {messages.map((msg, index) => (
                        <div
                          key={msg._id || index}
                          className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender === 'user'
                                ? 'bg-navy-blue-600 text-white'
                                : isDark
                                  ? 'bg-gray-700 text-white'
                                  : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs text-right mt-1">
                              {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                  <div
                    className={`${
                      isDark ? 'bg-gray-900' : 'bg-white'
                    } p-4 border-t border-gray-200 sticky bottom-0`}
                  >
                    <form onSubmit={sendMessage} className="flex">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className={`flex-grow px-3 py-2 border rounded-full ${
                          isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900'
                        }`}
                      />
                      <button
                        type="submit"
                        className="ml-2 bg-navy-blue-600 text-white py-2 px-4 rounded-full"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-600">Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;