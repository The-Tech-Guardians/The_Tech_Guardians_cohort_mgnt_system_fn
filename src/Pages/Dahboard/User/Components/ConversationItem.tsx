interface ConversationItemProps {
  conversation: {
    name: string;
    lastMessage: string;
    date: string;
    unread: number;
  };
  isActive: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg cursor-pointer flex justify-between
        ${isActive ? "bg-[#10B981] text-white" : "hover:bg-gray-100"}
      `}
    >
      <div>
        <h3 className="font-medium">{conversation.name}</h3>
        <p className={`text-sm ${isActive ? "text-blue-200" : "text-gray-500"}`}>
          {conversation.lastMessage}
        </p>
        <p className="text-xs opacity-70">{conversation.date}</p>
      </div>

      {conversation.unread > 0 && (
        <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full h-fit">
          {conversation.unread}
        </span>
      )}
    </div>
  );
}
