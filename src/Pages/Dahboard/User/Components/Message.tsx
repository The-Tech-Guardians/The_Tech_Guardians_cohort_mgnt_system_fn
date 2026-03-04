import { useState } from "react";
import ConversationItem from "./ConversationItem";
import ChatWindow from "./chatWindow";

interface MessageContent {
  from: string;
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  date: string;
  unread: number;
  messages: MessageContent[];
}
  const conversations: Conversation[] = [
    {
      id: 1,
      name: "John Doe",
      lastMessage: "Thanks for the help!",
      date: "2024-01-15 10:30",
      unread: 2,
      messages: [
        { from: "them", text: "Hi, I need help with tutoring", time: "10:00" },
        { from: "me", text: "Sure! What subject?", time: "10:05" },
        { from: "them", text: "Math, specifically calculus", time: "10:10" },
        {
          from: "me",
          text: "I can help with that. When are you available?",
          time: "10:15",
        },
      ],
    },
    {
      id: 2,
      name: "Sarah Smith",
      lastMessage: "Can you help me next week?",
      date: "2024-01-14 15:45",
      unread: 0,
      messages: [
        { from: "them", text: "Can you help me next week?", time: "15:45" },
      ],
    },
    {
      id: 3,
      name: "Mike Johnson",
      lastMessage: "Great service!",
      date: "2024-01-13 09:15",
      unread: 1,
      messages: [
        { from: "them", text: "Great service!", time: "09:15" },
      ],
    },
  ];
const MessagePage = () => {

  // FIXED: Explicitly defined state type to allow both null and Conversation object
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[75vh]">
          <div className="bg-white rounded-xl p-4 overflow-y-auto border shadow-sm">
            <h2 className="font-semibold mb-3">Conversations</h2>

            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full mb-4 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />

            <div className="space-y-2">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                
                  isActive={selectedConversation?.id === conv.id}
                  onClick={() => setSelectedConversation(conv)}
                />
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2">
            <ChatWindow conversation={selectedConversation} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagePage;
