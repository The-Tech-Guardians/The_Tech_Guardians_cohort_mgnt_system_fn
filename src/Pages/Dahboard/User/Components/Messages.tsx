import { useState, useEffect, useRef } from 'react';
import { Send, Search, Loader2, MessageCircle } from 'lucide-react';
import MessageService from '../Services/MessageService';
import SocketService from '../Services/SocketService';

interface Conversation {
  user: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    isOnline?: boolean;
    lastSeen?: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string; email: string; profilePicture?: string; isOnline?: boolean; lastSeen?: string }[]>([]);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getLastSeenText = (lastSeen?: string, isOnline?: boolean) => {
    if (isOnline) return 'Online';
    if (!lastSeen) return 'Offline';
    
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - lastSeenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return lastSeenDate.toLocaleDateString();
  };

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchConversations();
    fetchAllUsers();
    SocketService.connect(currentUser.id);

    SocketService.onReceiveMessage((message: Message) => {
      if (selectedUser && (message.senderId === selectedUser.user.id || message.receiverId === selectedUser.user.id)) {
        setMessages((prev) => [...prev, message]);
        MessageService.markAsRead(message.senderId);
      }
      fetchConversations();
    });

    SocketService.onMessageSent((message: Message) => {
      setMessages((prev) => [...prev, message]);
      fetchConversations();
    });

    SocketService.onUserStatusChange((data) => {
      setConversations((prev) => 
        prev.map((conv) => 
          conv.user.id === data.userId 
            ? { ...conv, user: { ...conv.user, isOnline: data.isOnline, lastSeen: data.lastSeen?.toString() } }
            : conv
        )
      );
      setAllUsers((prev) => 
        prev.map((user) => 
          user.id === data.userId 
            ? { ...user, isOnline: data.isOnline, lastSeen: data.lastSeen?.toString() }
            : user
        )
      );
      if (selectedUser && selectedUser.user.id === data.userId) {
        setSelectedUser((prev) => 
          prev ? { ...prev, user: { ...prev.user, isOnline: data.isOnline, lastSeen: data.lastSeen?.toString() } } : null
        );
      }
    });

    SocketService.onUserTyping((data) => {
      if (selectedUser && data.senderId === selectedUser.user.id) {
        setIsTyping(true);
        if (typingTimeout) clearTimeout(typingTimeout);
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        setTypingTimeout(timeout);
      }
    });

    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
      SocketService.disconnect();
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const data = await MessageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const users = await MessageService.getAllUsers();
      setAllUsers(users.filter(u => u.id !== currentUser.id));
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleSelectUser = async (conversation: Conversation) => {
    setSelectedUser(conversation);
    setIsLoading(true);
    try {
      const msgs = await MessageService.getMessages(conversation.user.id);
      setMessages(msgs);
      await MessageService.markAsRead(conversation.user.id);
      fetchConversations();
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    SocketService.sendMessage(selectedUser.user.id, currentUser.id, newMessage.trim());
    setNewMessage('');
  };

  const handleSelectNewUser = async (user: { id: string; name: string; email: string; profilePicture?: string; isOnline?: boolean; lastSeen?: string }) => {
    const conversation: Conversation = {
      user,
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };
    setSelectedUser(conversation);
    setMessages([]);
    setShowAllUsers(false);
  };

  const handleTyping = () => {
    if (selectedUser) {
      SocketService.sendTyping(selectedUser.user.id, currentUser.id);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = allUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] bg-white rounded-lg md:rounded-2xl shadow-sm overflow-hidden">
      <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r flex-col`}>
        <div className="p-3 md:p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold">Messages</h2>
            <button
              onClick={() => setShowAllUsers(!showAllUsers)}
              className="text-xs md:text-sm px-2 md:px-3 py-1 bg-[#2C7A7B] text-white rounded-lg hover:bg-[#235E5F]"
            >
              {showAllUsers ? 'Conversations' : 'New Chat'}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2C7A7B]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {showAllUsers ? (
            filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
                <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mb-2" />
                <p className="text-sm md:text-base">No users available</p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectNewUser(user)}
                  className="p-3 md:p-4 border-b cursor-pointer hover:bg-gray-50 transition active:bg-gray-100"
                >
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2C7A7B] flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                        {user.profilePicture ? (
                          <img src={`https://community-support-flatform-backend-1-0ghf.onrender.com/${user.profilePicture}`} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      {user.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">{user.name}</h3>
                      <p className="text-xs text-gray-500">{getLastSeenText(user.lastSeen, user.isOnline)}</p>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mb-2" />
              <p className="text-sm md:text-base">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.user.id}
                onClick={() => handleSelectUser(conv)}
                className={`p-3 md:p-4 border-b cursor-pointer hover:bg-gray-50 transition active:bg-gray-100 ${
                  selectedUser?.user.id === conv.user.id ? 'bg-[#2C7A7B]/10' : ''
                }`}
              >
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#2C7A7B] flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                      {conv.user.profilePicture ? (
                        <img src={`https://community-support-flatform-backend-1-0ghf.onrender.com/${conv.user.profilePicture}`} alt={conv.user.name} className="w-full h-full object-cover" />
                      ) : (
                        conv.user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    {conv.user.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs md:text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-[#2C7A7B] text-white text-xs rounded-full px-2 py-0.5 ml-2">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>
        {selectedUser ? (
          <>
            <div className="p-3 md:p-4 border-b flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg -ml-2"
              >
                ←
              </button>
              <div className="relative">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#2C7A7B] flex items-center justify-center text-white font-bold overflow-hidden">
                  {selectedUser.user.profilePicture ? (
                    <img src={`https://community-support-flatform-backend-1-0ghf.onrender.com/${selectedUser.user.profilePicture}`} alt={selectedUser.user.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedUser.user.name.charAt(0).toUpperCase()
                  )}
                </div>
                {selectedUser.user.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              <div>
                <h3 className="text-sm md:text-base font-semibold">{selectedUser.user.name}</h3>
                <p className="text-xs text-gray-500">{getLastSeenText(selectedUser.user.lastSeen, selectedUser.user.isOnline)}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-[#2C7A7B]" />
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 md:px-4 py-2 ${
                          msg.senderId === currentUser.id
                            ? 'bg-[#2C7A7B] text-white'
                            : 'bg-white border border-gray-200'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <div className="flex items-center justify-between gap-2 mt-1">
                          <p
                            className={`text-xs ${
                              msg.senderId === currentUser.id ? 'text-white/70' : 'text-gray-500'
                            }`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {msg.senderId === currentUser.id && (
                            <span className="text-xs text-white/70">
                              {msg.isRead ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 md:p-4 border-t bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C7A7B]"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-3 md:px-4 py-2 bg-[#2C7A7B] text-white rounded-lg hover:bg-[#235E5F] disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-95"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-4">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
              <p className="text-sm md:text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
