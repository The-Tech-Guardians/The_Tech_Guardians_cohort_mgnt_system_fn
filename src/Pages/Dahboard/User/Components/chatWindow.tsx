interface Message {
  from: string;
  text: string;
  time: string;
}

interface Conversation {
  name: string;
  messages: Message[];
}

export default function ChatWindow({ conversation }: { conversation: Conversation | null }) {
  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 bg-white rounded-xl border">
        Select a conversation to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl ">
      
      <div className="border-b p-4 border-b-gray-200 font-semibold">
        {conversation.name}
      </div>

     
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {conversation.messages.map((msg: Message, index: number) => (
          <div
            key={index}
            className={`max-w-xs p-3 rounded-lg text-sm
              ${msg.from === "me"
                ? "bg-[#10B981] text-white ml-auto"
                : "bg-gray-200 text-gray-800"
              }`}
          >
            <p>{msg.text}</p>
            <span className="text-xs opacity-60 block mt-1">
              {msg.time}
            </span>
          </div>
        ))}
      </div>

    
      <div className="border-t border-t-gray-200 p-3 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
        />
        <button className="bg-[#10B981] text-white px-4 rounded-lg">
          ➤
        </button>
      </div>
    </div>
  );
}
